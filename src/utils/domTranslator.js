import axios from 'axios'

const ENV_MT_API_URL = import.meta.env.VITE_MT_API_URL
const isLocalhostUrl = (v) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(String(v || '').trim())
const DEFAULT_MT_API_URL = import.meta.env.DEV ? '/mt' : 'https://translate.argosopentech.com'
const MT_API_URL = ENV_MT_API_URL ? (isLocalhostUrl(ENV_MT_API_URL) ? '/mt' : ENV_MT_API_URL) : DEFAULT_MT_API_URL
const MT_TIMEOUT_MS = Number(import.meta.env.VITE_MT_TIMEOUT_MS) > 0 ? Number(import.meta.env.VITE_MT_TIMEOUT_MS) : 60_000
const MT_BATCH_SIZE = Number(import.meta.env.VITE_MT_BATCH_SIZE) > 0 ? Number(import.meta.env.VITE_MT_BATCH_SIZE) : 10

const MT_FALLBACKS = (!ENV_MT_API_URL && import.meta.env.DEV)
  ? ['https://libretranslate.de', 'https://translate.astian.org', 'https://translate.argosopentech.com']
  : []

const MT_ENDPOINTS = Array.from(new Set([MT_API_URL, ...MT_FALLBACKS].filter(Boolean)))

const CACHE_KEY_V2 = 'translation_cache_v2'
const CACHE_KEY_V1 = 'translation_cache'
const CACHE_TTL_MS = 365 * 24 * 60 * 60 * 1000
const CACHE_MAX_ENTRIES = 5000

const safeParseJSON = (raw, fallback) => {
  try {
    const v = JSON.parse(raw || '')
    return v && typeof v === 'object' ? v : fallback
  } catch (_) {
    return fallback
  }
}

const normalizeCacheObj = (obj) => {
  if (!obj || typeof obj !== 'object') return {}
  const now = Date.now()
  const out = {}
  for (const k of Object.keys(obj)) {
    const v = obj[k]
    if (typeof v === 'string') {
      out[k] = { v, e: now + CACHE_TTL_MS }
      continue
    }
    if (v && typeof v === 'object') {
      const text = typeof v.v === 'string' ? v.v : ''
      const exp = Number(v.e || 0)
      if (!text) continue
      if (exp > 0 && exp <= now) continue
      out[k] = { v: text, e: now + CACHE_TTL_MS }
    }
  }
  return out
}

const loadPersistentCache = () => {
  const v2 = safeParseJSON(localStorage.getItem(CACHE_KEY_V2), {})
  const v1 = safeParseJSON(localStorage.getItem(CACHE_KEY_V1), {})
  return { ...normalizeCacheObj(v1), ...normalizeCacheObj(v2) }
}

let persistentCache = {}
try {
  persistentCache = loadPersistentCache()
} catch (_) {
  persistentCache = {}
}

const prunePersistentCache = () => {
  const now = Date.now()
  const keys = Object.keys(persistentCache)
  for (const k of keys) {
    const ent = persistentCache[k]
    const exp = Number(ent?.e || 0)
    if (exp > 0 && exp <= now) delete persistentCache[k]
  }
  const remainingKeys = Object.keys(persistentCache)
  if (remainingKeys.length <= CACHE_MAX_ENTRIES) return
  remainingKeys.sort((a, b) => (Number(persistentCache[a]?.e || 0) - Number(persistentCache[b]?.e || 0)))
  const removeCount = remainingKeys.length - CACHE_MAX_ENTRIES
  for (let i = 0; i < removeCount; i += 1) {
    delete persistentCache[remainingKeys[i]]
  }
}

let saveTimer = null
const scheduleSaveCache = () => {
  if (saveTimer) return
  saveTimer = setTimeout(() => {
    saveTimer = null
    try {
      prunePersistentCache()
      localStorage.setItem(CACHE_KEY_V2, JSON.stringify(persistentCache))
    } catch (_) {}
  }, 500)
}

const cacheKey = (target, text) => `${target}::${text}`
const getCached = (target, text) => {
  const key = cacheKey(target, text)
  const ent = persistentCache[key]
  if (!ent) return null
  const exp = Number(ent.e || 0)
  if (exp > 0 && exp <= Date.now()) {
    delete persistentCache[key]
    return null
  }
  return typeof ent.v === 'string' ? ent.v : null
}
const setCached = (target, text, translated) => {
  const key = cacheKey(target, text)
  persistentCache[key] = { v: translated, e: Date.now() + CACHE_TTL_MS }
  scheduleSaveCache()
}

let translatedNodes = new WeakSet()
const resetTranslatedNodes = () => { translatedNodes = new WeakSet() }

let observer = null
const stopObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

let suspendUntil = 0
const shouldSuspend = () => Date.now() < suspendUntil
const suspend = (ms) => { suspendUntil = Date.now() + ms }
let translationDisabled = false

const chunk = (arr, size) => {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

const buildTranslateBody = (qList, source, target) => {
  const body = new URLSearchParams()
  for (const q of qList) body.append('q', q)
  body.append('source', source)
  body.append('target', target)
  body.append('format', 'text')
  return body
}

const joinUrl = (base, path) => {
  const b = String(base || '')
  const p = String(path || '')
  if (!b) return p
  if (b.endsWith('/') && p.startsWith('/')) return `${b}${p.slice(1)}`
  if (!b.endsWith('/') && !p.startsWith('/')) return `${b}/${p}`
  return `${b}${p}`
}

export const doTranslate = async (texts, targetLang) => {
  if (translationDisabled) return texts
  if (shouldSuspend()) return texts

  const toTranslate = []
  const results = []
  
  texts.forEach((t, i) => {
    const cached = getCached(targetLang, t)
    if (cached) {
      results[i] = cached
    } else {
      toTranslate.push({ text: t, index: i })
    }
  })

  if (toTranslate.length > 0) {
    const source = 'auto'
    const batches = chunk(toTranslate, MT_BATCH_SIZE)
    let lastError = null

    const translateWithEndpoint = async (endpoint) => {
      const translateUrl = joinUrl(endpoint, '/translate')
      const translateOne = async (text) => {
        const body = buildTranslateBody([text], source, targetLang)
        const res = await axios.post(translateUrl, body, {
          timeout: MT_TIMEOUT_MS,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        const translated = res?.data?.translatedText
        return typeof translated === 'string' ? translated : null
      }

      for (const batch of batches) {
        const q = batch.map(item => item.text)
        const body = buildTranslateBody(q, source, targetLang)
        const res = await axios.post(translateUrl, body, {
          timeout: MT_TIMEOUT_MS,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })

        const translated = res?.data?.translatedText
        if (Array.isArray(translated)) {
          translated.forEach((trans, idx) => {
            const original = batch[idx]?.text
            if (!original) return
            if (typeof trans === 'string' && trans) {
              setCached(targetLang, original, trans)
            }
            results[batch[idx].index] = trans
          })
        } else if (typeof translated === 'string') {
          if (batch.length === 1) {
            const original = batch[0].text
            if (translated) setCached(targetLang, original, translated)
            results[batch[0].index] = translated
            continue
          }

          for (const item of batch) {
            const original = item.text
            let trans = null
            try {
              trans = await translateOne(original)
            } catch (_) {
              trans = null
            }
            if (typeof trans === 'string' && trans) {
              setCached(targetLang, original, trans)
              results[item.index] = trans
            } else {
              results[item.index] = original
            }
          }
        } else {
          batch.forEach(item => {
            results[item.index] = item.text
          })
        }
      }
    }

    for (const endpoint of MT_ENDPOINTS) {
      try {
        await translateWithEndpoint(endpoint)
        lastError = null
        break
      } catch (e) {
        lastError = e
      }
    }

    if (lastError) {
      const status = lastError?.response?.status
      if (status === 429) suspend(60_000)
      if (status === 403) suspend(10 * 60_000)
      if (!status) suspend(2 * 60_000)
      if (!status || status >= 500) {
        translationDisabled = true
        stopObserver()
      }
      console.error('Translation error:', lastError)
      toTranslate.forEach(item => {
        results[item.index] = item.text
      })
    }
  }

  return results
}

export const stopDomTranslation = () => {
  stopObserver()
}

export const startDomTranslation = (targetLang) => {
  stopDomTranslation()
  translationDisabled = false
  resetTranslatedNodes()
  
  let timeout = null
  let pendingNodes = []
  const NO_TRANSLATE_SELECTOR = '[data-no-translate="true"], [translate="no"], .notranslate'

  const isInsideNoTranslate = (node) => {
    try {
      const parentEl = node?.parentElement || (node?.parentNode?.nodeType === 1 ? node.parentNode : null)
      return !!parentEl?.closest?.(NO_TRANSLATE_SELECTOR)
    } catch (_) {
      return false
    }
  }

  const processPending = async () => {
    if (!pendingNodes.length) return
    const nodes = [...pendingNodes]
    pendingNodes = []
    
    const texts = nodes.map(n => n.nodeValue.trim())
    const translated = await doTranslate(texts, targetLang)
    
    nodes.forEach((node, i) => {
      if (translated[i] && translated[i] !== texts[i]) {
        node.nodeValue = node.nodeValue.replace(texts[i], translated[i])
        translatedNodes.add(node)
      }
    })
  }

  const queueNode = (node) => {
    if (translatedNodes.has(node)) return
    if (isInsideNoTranslate(node)) return
    
    const text = node.nodeValue?.trim()
    // Skip empty, very short, or pure number strings
    if (!text || text.length <= 1 || /^\d+$/.test(text)) return
    
    pendingNodes.push(node)
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(processPending, 200)
  }

  const walkNodes = (node) => {
    if (node.nodeType === 3) { // Text node
      queueNode(node)
    } else if (node.nodeType === 1) { // Element node
      const tag = node.nodeName.toLowerCase()
      if (['script', 'style', 'noscript', 'code'].includes(tag)) return
      try {
        if (node?.matches?.(NO_TRANSLATE_SELECTOR)) return
        if (node?.closest?.(NO_TRANSLATE_SELECTOR)) return
      } catch (_) {}
      
      // Also translate placeholders for inputs
      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        if (node?.closest?.(NO_TRANSLATE_SELECTOR)) return
        const placeholder = node.getAttribute('placeholder')
        if (placeholder && placeholder.trim() && !/^\d+$/.test(placeholder)) {
          doTranslate([placeholder], targetLang).then(res => {
            if (res[0] && res[0] !== placeholder) {
              node.setAttribute('placeholder', res[0])
            }
          })
        }
      }

      for (let child of node.childNodes) {
        walkNodes(child)
      }
    }
  }

  observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => walkNodes(node))
      } else if (mutation.type === 'characterData') {
        if (!translatedNodes.has(mutation.target)) {
          queueNode(mutation.target)
        }
      }
    })
  })

  observer.observe(document.body, { 
    childList: true, 
    subtree: true, 
    characterData: true 
  })

  // initial walk
  walkNodes(document.body)
}
