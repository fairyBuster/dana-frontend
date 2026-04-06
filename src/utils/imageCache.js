import { getFrontendUrl } from '@/utils/settings'

// Simple image cache utility using Cache API with TTL and object URLs
// Stores blobs in Cache API under a logical cacheKey and tracks timestamps via localStorage

const CACHE_NAME = 'image-cache-v1'

function getAuthHeaders() {
  try {
    const token = localStorage.getItem('auth_token')
    const scheme = localStorage.getItem('auth_scheme') || 'Bearer'
    if (token) {
      return { Authorization: `${scheme} ${token}` }
    }
  } catch (_) {}
  return {}
}

// Read URLs from environment
const ENV = import.meta.env || {}
// Gunakan origin runtime (window.location.origin) sebagai fallback yang lebih aman,
// agar tidak mengungkap domain backend ketika variabel env tidak sinkron.
const RUNTIME_ORIGIN = typeof window !== 'undefined' ? window.location.origin : ''
const FRONTEND_URL = ENV.VITE_FRONTEND_URL || RUNTIME_ORIGIN || 'https://www.ccvoltasein.com'
const BACKEND_URL = ENV.VITE_BACKEND_URL || ''
const IS_DEV = !!ENV.DEV
const IS_PROD = !!ENV.PROD

// Derive host/origin
let FRONTEND_ORIGIN = FRONTEND_URL
let BACKEND_HOST = BACKEND_URL
try {
  FRONTEND_ORIGIN = new URL(FRONTEND_URL).origin
  BACKEND_HOST = new URL(BACKEND_URL).hostname
} catch (_) {}

export function resolveImageUrl(rawUrl) {
  let normalized = String(rawUrl ?? '').trim()
  if (!normalized) return ''
  
  // Get dynamic frontend URL
  const currentFrontendUrl = getFrontendUrl() || 'https://www.ccvoltasein.com'
  let currentFrontendOrigin = currentFrontendUrl
  try {
    currentFrontendOrigin = new URL(currentFrontendUrl).origin
  } catch (_) {}

  if (normalized.length >= 2) {
    const first = normalized[0]
    const last = normalized[normalized.length - 1]
    if ((first === '`' && last === '`') || (first === '"' && last === '"') || (first === "'" && last === "'")) {
      normalized = normalized.slice(1, -1).trim()
    }
  }
  try {
    // Handle relative paths (e.g., /media/..)
    if (/^\/.+/.test(normalized)) {
      // Dev: gunakan path saja agar diproksi Vite
      if (IS_DEV) return normalized
      // Prod/APK: pastikan absolute ke origin frontend (bukan localhost)
      return `${currentFrontendOrigin}${normalized}`
    }

    const u = new URL(normalized)
    // Enforce HTTPS to avoid mixed content and align CSP
    if (u.protocol === 'http:') u.protocol = 'https:'

    // Selalu rute path media ke origin frontend agar tidak menampilkan host backend
    // Berlaku untuk URL apa pun yang memiliki path /media, terlepas dari host-nya.
    if (u.pathname.startsWith('/media')) {
      // Dev: gunakan path-only agar diproksi oleh Vite ke backend
      if (IS_DEV) {
        return u.pathname + u.search
      }
      // Prod/APK: gunakan domain frontend sehingga Network panel tidak menampilkan domain backend
      return `${currentFrontendOrigin}${u.pathname}${u.search}`
    }

    // If already pointing to frontend domain, return as is
    const FRONT_HOST = new URL(currentFrontendOrigin).hostname
    if (u.hostname === FRONT_HOST) {
      return u.toString()
    }

    // Default: keep URL (already absolute and safe)
    return u.toString()
  } catch (_) {
    return normalized.replace(/^http:\/\//, 'https://')
  }
}

export async function getBlobUrl(url, cacheKey, ttlMs = 5 * 60 * 1000, extraHeaders = {}) {
  const tsKey = `${cacheKey}:ts`
  const now = Date.now()

  const headers = { ...getAuthHeaders(), ...extraHeaders }
  const safeUrl = resolveImageUrl(url)

  let useCache = false
  let cache
  try {
    if (typeof caches !== 'undefined' && caches.open) {
      cache = await caches.open(CACHE_NAME)
      useCache = true
    }
  } catch (_) {
    useCache = false
  }

  if (useCache) {
    try {
      const cached = await cache.match(cacheKey)
      const cachedTs = parseInt(localStorage.getItem(tsKey) || '0', 10)
      if (cached && cachedTs && now - cachedTs < ttlMs) {
        const blob = await cached.blob()
        return URL.createObjectURL(blob)
      }
    } catch (_) {}
  }

  const resp = await fetch(safeUrl, { headers, credentials: 'include', cache: 'no-store', referrerPolicy: 'strict-origin-when-cross-origin' })
  if (!resp.ok) {
    throw new Error('Failed to fetch image')
  }
  const blob = await resp.blob()

  if (useCache) {
    try {
      await cache.put(cacheKey, new Response(blob))
      localStorage.setItem(tsKey, String(now))
    } catch (_) {}
  }

  return URL.createObjectURL(blob)
}

export async function revokeObjectUrlSafe(objUrl) {
  try {
    if (objUrl) URL.revokeObjectURL(objUrl)
  } catch (_) {}
}

// Centralized image cache/fetcher with proxy/HTTPS handling
const toHttps = (url) => {
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:') u.protocol = 'https:'
    return u.toString()
  } catch (_) {
    return url
  }
}

// Translate backend media URL ke domain frontend agar tidak direct ke backend
const toFrontendMedia = (url) => {
  let normalized = String(url ?? '').trim()
  if (!normalized) return ''
  if (normalized.length >= 2) {
    const first = normalized[0]
    const last = normalized[normalized.length - 1]
    if ((first === '`' && last === '`') || (first === '"' && last === '"') || (first === "'" && last === "'")) {
      normalized = normalized.slice(1, -1).trim()
    }
  }
  try {
    // Relative path: dev proxy or prod absolute
    if (/^\/.+/.test(normalized)) {
      return IS_DEV ? normalized : `${FRONTEND_ORIGIN}${normalized}`
    }
    const u = new URL(normalized)
    
    if (IS_DEV) {
      // Di dev, gunakan proxy Vite: path-only untuk /media
      if (u.pathname.startsWith('/media')) {
        return u.pathname + u.search
      }
      return normalized
    }
    // Di produksi/Android, arahkan semua path /media ke domain frontend
    if (u.pathname.startsWith('/media')) {
      return `${FRONTEND_ORIGIN}${u.pathname}${u.search}`
    }

    return normalized
  } catch (_) {
    return normalized
  }
}

export async function fetchImageWithCache(url, options = {}) {
  const cacheKey = options.cacheKey || url
  const controller = new AbortController()
  const signal = controller.signal

  // Pastikan HTTPS dan translate ke frontend
  const resolvedUrl = toFrontendMedia(toHttps(url))

  try {
    const resp = await fetch(resolvedUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        ...(options.headers || {}),
        'X-Requested-With': 'XMLHttpRequest'
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      signal
    })
    if (!resp.ok) {
      // Hindari membocorkan URL sensitif ke console
      throw new Error(`Image load failed with status ${resp.status}`)
    }
    const blob = await resp.blob()
    const objectUrl = URL.createObjectURL(blob)
    return { objectUrl, cacheKey }
  } catch (err) {
    // Jangan log URL atau stack yang sensitif
    return { error: true, message: 'Gagal mengambil gambar', cacheKey }
  }
}
