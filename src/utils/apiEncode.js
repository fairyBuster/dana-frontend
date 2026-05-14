const RESPONSE_SALT = 'KXXADFDFDF'

export function encodeApiPath(subPath) {
  const norm = subPath.startsWith('/') ? subPath : `/${subPath}`
  
  // Handling Buffer for SSR/Node environment compatibility if needed, though usually window.btoa is available in browsers
  // But for consistency with decode, let's stick to standard browser APIs or simple polyfills if needed.
  // User provided btoa, assuming browser env or polyfilled.
  
  let b64
  if (typeof btoa === 'function') {
    b64 = btoa(norm)
  } else if (typeof Buffer !== 'undefined') {
    b64 = Buffer.from(norm).toString('base64')
  } else {
    // Fallback or error
    b64 = norm // Should not happen in modern envs
  }

  const salted = b64 + RESPONSE_SALT
  const reversed = salted.split('').reverse().join('')
  return `/api/enc/${encodeURIComponent(reversed)}`
}

export function decodeApiResponse(encodedData) {
  if (typeof encodedData !== 'string') {
    return encodedData
  }
  const reversed = encodedData.split('').reverse().join('')
  const saltLength = RESPONSE_SALT.length
  const unsalted = saltLength > 0 ? reversed.slice(0, -saltLength) : reversed
  
  let jsonString = unsalted
  if (typeof atob === 'function') {
    try {
      jsonString = atob(unsalted)
    } catch (_) {}
  } else if (typeof Buffer !== 'undefined') {
    try {
      jsonString = Buffer.from(unsalted, 'base64').toString('utf-8')
    } catch (_) {}
  }
  
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    // Return original if parse fails (fallback)
    return encodedData
  }
}
