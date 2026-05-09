import axios from 'axios'

const ENV_MT_API_URL = import.meta.env.VITE_MT_API_URL
const DEFAULT_MT_API_URL = import.meta.env.DEV ? '/mt' : 'https://translate.argosopentech.com'
const MT_API_URL = ENV_MT_API_URL || DEFAULT_MT_API_URL

const MT_FALLBACKS = (!ENV_MT_API_URL && import.meta.env.DEV)
  ? ['https://libretranslate.de', 'https://translate.astian.org', 'https://translate.argosopentech.com']
  : []

const MT_ENDPOINTS = Array.from(new Set([MT_API_URL, ...MT_FALLBACKS].filter(Boolean)))

const getCache = () => JSON.parse(localStorage.getItem('translation_cache') || '{}')
const saveCache = (cache) => localStorage.setItem('translation_cache', JSON.stringify(cache))

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

  const cache = getCache()
  const toTranslate = []
  const results = []
  
  texts.forEach((t, i) => {
    const key = `${targetLang}_${t}`
    if (cache[key]) {
      results[i] = cache[key]
    } else {
      toTranslate.push({ text: t, index: i })
    }
  })

  if (toTranslate.length > 0) {
    const source = 'auto'
    const batches = chunk(toTranslate, 20)
    let lastError = null

    const translateWithEndpoint = async (endpoint) => {
      const translateUrl = joinUrl(endpoint, '/translate')
      const translateOne = async (text) => {
        const body = buildTranslateBody([text], source, targetLang)
        const res = await axios.post(translateUrl, body, {
          timeout: 15000,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        const translated = res?.data?.translatedText
        return typeof translated === 'string' ? translated : null
      }

      for (const batch of batches) {
        const q = batch.map(item => item.text)
        const body = buildTranslateBody(q, source, targetLang)
        const res = await axios.post(translateUrl, body, {
          timeout: 15000,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })

        const translated = res?.data?.translatedText
        if (Array.isArray(translated)) {
          translated.forEach((trans, idx) => {
            const original = batch[idx]?.text
            if (!original) return
            const key = `${targetLang}_${original}`
            cache[key] = trans
            results[batch[idx].index] = trans
          })
        } else if (typeof translated === 'string') {
          if (batch.length === 1) {
            const original = batch[0].text
            const key = `${targetLang}_${original}`
            cache[key] = translated
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
              const key = `${targetLang}_${original}`
              cache[key] = trans
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
        saveCache(cache)
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
