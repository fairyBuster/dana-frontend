import axios from 'axios'
import { encodeApiPath, decodeApiResponse } from '@/utils/apiEncode'

// Base URL API dengan fallback untuk Web dan Android (Capacitor)
const ENV_API = import.meta?.env?.VITE_API_URL
const IS_LOCALHOST_ORIGIN = typeof location !== 'undefined' && location.hostname === 'localhost'
const IS_CAPACITOR_ORIGIN = typeof location !== 'undefined' && location.protocol === 'capacitor:'
// Deteksi runtime Capacitor di Android WebView (offline mode -> https://localhost)
const IS_CAPACITOR_RUNTIME = typeof window !== 'undefined' && !!window.Capacitor

// ENV configurable
const ENV_FRONTEND = import.meta?.env?.VITE_FRONTEND_URL
const ENV_BACKEND = import.meta?.env?.VITE_BACKEND_URL
const ENV_MOBILE_API = import.meta?.env?.VITE_MOBILE_API_URL
const ENV_USE_COOKIES_WEB = String(import.meta?.env?.VITE_USE_COOKIES_WEB || 'true') === 'true'
const ENV_USE_COOKIES_MOBILE = String(import.meta?.env?.VITE_USE_COOKIES_MOBILE || 'false') === 'true'
const CSRF_COOKIE_NAME = import.meta?.env?.VITE_CSRF_COOKIE_NAME || 'csrftoken'
const CSRF_HEADER_NAME = import.meta?.env?.VITE_CSRF_HEADER_NAME || 'X-CSRFToken'
const FORCE_LOGOUT_ON_401 = String(import.meta?.env?.VITE_FORCE_LOGOUT_ON_401 || 'false') === 'true'
const ENV_ENABLE_API_ENCODE = String(import.meta?.env?.VITE_ENABLE_API_ENCODE || '').toLowerCase()
const ENABLE_API_ENCODE = ENV_ENABLE_API_ENCODE
  ? ENV_ENABLE_API_ENCODE === 'true'
  : IS_CAPACITOR_RUNTIME
const DEFAULT_ANDROID_BACKEND_ORIGIN = 'https://drashcloudsafer.online'

const getMobileBackendOrigin = () => {
  return DEFAULT_ANDROID_BACKEND_ORIGIN
}

const rewriteMediaUrlsInPlace = (value, backendOrigin, depth = 0) => {
  if (!backendOrigin || depth > 8) return value
  if (value == null) return value

  if (typeof value === 'string') {
    if (value.startsWith('/media/')) return `${backendOrigin}${value}`
    if (value.startsWith('media/')) return `${backendOrigin}/${value}`
    return value
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = rewriteMediaUrlsInPlace(value[i], backendOrigin, depth + 1)
    }
    return value
  }
  if (typeof value === 'object') {
    for (const k of Object.keys(value)) {
      value[k] = rewriteMediaUrlsInPlace(value[k], backendOrigin, depth + 1)
    }
    return value
  }
  return value
}

const normalizeResponseForMobile = (response) => {
  try {
    if (!IS_CAPACITOR_RUNTIME) return response
    const isMobileLocalhost = typeof window !== 'undefined' && window?.location?.hostname === 'localhost'
    const isCapacitorOrigin = typeof window !== 'undefined' && window?.location?.protocol === 'capacitor:'
    if (!(isMobileLocalhost || isCapacitorOrigin)) return response
    const backendOrigin = getMobileBackendOrigin()
    if (response && response.data) {
      rewriteMediaUrlsInPlace(response.data, backendOrigin)
    }
  } catch (_) {}
  return response
}

const API_BASE_URL = (() => {
  // Pada aplikasi Android (Capacitor), gunakan domain frontend atau VITE_MOBILE_API agar CORS ok
  const IS_MOBILE_LOCALHOST = IS_LOCALHOST_ORIGIN && IS_CAPACITOR_RUNTIME
  if (IS_CAPACITOR_ORIGIN || IS_MOBILE_LOCALHOST) {
    if (ENV_MOBILE_API && /^https?:\/\//.test(ENV_MOBILE_API)) return ENV_MOBILE_API
    return `${DEFAULT_ANDROID_BACKEND_ORIGIN}/api`
  }
  // Jika env sudah absolute (http/https), gunakan langsung
  if (ENV_API && /^https?:\/\//.test(ENV_API)) return ENV_API
  // Jika env relative, gunakan proxy '/api' di web
  if (ENV_API && !/^https?:\/\//.test(ENV_API)) {
    // Gunakan path relative dari env apa adanya (mis. '/api')
    return ENV_API
  }
  // Jika disediakan FRONTEND, bangun dari sana
  if (ENV_FRONTEND && /^https?:\/\//.test(ENV_FRONTEND)) return `${ENV_FRONTEND.replace(/\/$/, '')}/api`
  // Default ke '/api' untuk web
  return '/api'
})()

// Root base untuk endpoint non-/api (mis. /auth/login, /logout)
const ROOT_BASE_URL = (() => {
  const IS_MOBILE_LOCALHOST = IS_LOCALHOST_ORIGIN && IS_CAPACITOR_RUNTIME
  // Pada aplikasi Android (Capacitor), gunakan domain frontend (VITE_FRONTEND_URL bila ada)
  if (IS_CAPACITOR_ORIGIN || IS_MOBILE_LOCALHOST) {
    return DEFAULT_ANDROID_BACKEND_ORIGIN
  }
  // Jika ENV_API absolute, coba turunkan ke rootnya
  if (ENV_API && /^https?:\/\//.test(ENV_API)) {
    try {
      const u = new URL(ENV_API)
      return `${u.origin}`
    } catch (_) {}
  }
  // Jika FRONTEND disediakan, gunakan
  if (ENV_FRONTEND && /^https?:\/\//.test(ENV_FRONTEND)) return ENV_FRONTEND.replace(/\/$/, '')
  // Jika ENV_API relative, gunakan origin saat ini
  if (ENV_API && !/^https?:\/\//.test(ENV_API)) {
    return window?.location?.origin || 'http://localhost:5173'
  }
  return window?.location?.origin || 'http://localhost:5173'
})()

// Deteksi WebView Android (origin localhost) untuk kontrol kredensial CORS
const IS_WEBVIEW_LOCALHOST = (() => {
  try {
    const origin = window?.location?.origin || ''
    return origin.startsWith('https://localhost') || origin.startsWith('http://localhost')
  } catch (_) { return false }
})()
// Gunakan kredensial hanya jika bukan WebView Android offline
const USE_CREDENTIALS = (() => {
  if (IS_CAPACITOR_RUNTIME && (IS_CAPACITOR_ORIGIN || IS_LOCALHOST_ORIGIN)) {
    return ENV_USE_COOKIES_MOBILE
  }
  return ENV_USE_COOKIES_WEB
})()

// Helper: parse JSON safely
const safeParseJSON = (input, fallback = {}) => {
  try {
    if (typeof input === 'string') return JSON.parse(input)
    if (typeof input === 'object' && input !== null) return input
  } catch (_) {}
  return fallback
}

const tryDecodeResponseData = (response) => {
  try {
    const payload = response && response.data && response.data.data
    if (typeof payload === 'string') {
      const decoded = decodeApiResponse(payload)
      response.data = decoded
    }
  } catch (_) {}
  return response
}

const tryDecodeErrorData = (error) => {
  try {
    const payload = error && error.response && error.response.data && error.response.data.data
    if (typeof payload === 'string') {
      const decoded = decodeApiResponse(payload)
      error.response.data = decoded
    }
  } catch (_) {}
  try {
    const status = error?.response?.status
    const data = error?.response?.data
    const extractText = (v) => {
      if (!v) return ''
      if (typeof v === 'string') return v
      if (typeof v === 'object') {
        if (v.detail) return String(v.detail)
        if (v.message) return String(v.message)
        if (v.error) return String(v.error)
        const k = Object.keys(v)[0]
        const first = v[k]
        if (Array.isArray(first) && first.length) return String(first[0])
        if (first) return String(first)
      }
      return ''
    }
    const raw = extractText(data) || String(error?.message || '')
    const lower = String(raw || '').toLowerCase()
    const compact = lower.replace(/\s+/g, '')
    const isRateLimited =
      status === 429 ||
      lower.includes('permintaan ini dibatasi') ||
      compact.includes('permintaaninidibatasi') ||
      lower.includes('permintaan ini telah dibatasi') ||
      compact.includes('permintaaninitelahdibatasi') ||
      lower.includes('dibatasi') ||
      lower.includes('terlalu banyak') ||
      lower.includes('too many') ||
      lower.includes('throttle') ||
      lower.includes('rate limit')
    if (isRateLimited && error?.response) {
      error.response.data = {
        code: 'rate_limited',
        detail: 'Jangan terlalu cepat, mohon tunggu sebentar',
        wait_seconds: Number(data?.wait_seconds ?? null),
        scope: data?.scope ?? null,
        path: data?.path ?? null,
        method: data?.method ?? null
      }
    }
  } catch (_) {}
  return error
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: USE_CREDENTIALS,
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_NAME
})

// Instance untuk endpoint root (non-/api), misal /logout/
const rootApi = axios.create({
  baseURL: ROOT_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: USE_CREDENTIALS,
  xsrfCookieName: CSRF_COOKIE_NAME,
  xsrfHeaderName: CSRF_HEADER_NAME
})

// Helper: set Authorization header if allowed
function attachAuthHeader(config) {
  try {
    const method = (config.method || 'get').toLowerCase()
    const path = String(config.url || '')
    const skipAuthPaths = [
      '/register',
      '/auth/login',
      '/auth/jwt/login',
      '/auth/jwt/refresh',
      '/auth/jwt/verify'
    ]
    const shouldSkip = skipAuthPaths.some(p => path.includes(p))
    if (shouldSkip) return

    const token = localStorage.getItem('auth_token')
    if (token) {
      const scheme = localStorage.getItem('auth_scheme') || 'Bearer'
      config.headers['Authorization'] = `${scheme} ${token}`
    }
  } catch (_) {}
}

// Request interceptor for encoding URL (runs before Auth interceptor because LIFO)
// But we actually want Auth to run BEFORE Encoding so Auth sees the original URL.
// Since Axios request interceptors are LIFO, we add Encoding FIRST here in code.
// Stack: [Encoding, Auth]. Execution: Auth -> Encoding.
api.interceptors.request.use((config) => {
  try {
    if (!ENABLE_API_ENCODE) return config
    if (config && config.__skipApiEncode) return config
    const url = config.url || ''
    // Ignore if already encoded
    if (url.includes('/api/enc/') || url.includes('/enc/')) return config

    // Extract subPath
    let subPath = url
    if (subPath.startsWith('/api/')) {
      subPath = subPath.replace('/api/', '')
    }

    // Skip if empty or root
    if (!subPath || subPath === '/') return config

    // Encode
    const encodedUrl = encodeApiPath(subPath)
    config.url = encodedUrl

    // Fix baseURL duplication (remove trailing /api)
    if (config.baseURL && config.baseURL.endsWith('/api')) {
      config.baseURL = config.baseURL.slice(0, -4)
    }
  } catch (_) {}
  return config
})

// Inject Authorization header from localStorage token
api.interceptors.request.use(async (config) => {
  try {
    const method = (config.method || 'get').toLowerCase()
    const path = String(config.url || '')

    // Tambah Authorization dari localStorage jika ada, kecuali untuk endpoint yang dikecualikan
    attachAuthHeader(config)

    // Helper ambil cookie
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'))
      return match ? decodeURIComponent(match[2]) : null
    }

    // Prefetch CSRF khusus untuk POST login lama (tetap untuk kompatibilitas)
    const isLegacyLoginPost = method === 'post' && (path.includes('/auth/login') || path.includes('/api/auth/login'))
    if (isLegacyLoginPost) {
      let csrf = getCookie('csrftoken')
      if (!csrf) {
        try {
          await api.get('/auth/login/', { params: { _: Date.now() } })
          csrf = getCookie('csrftoken')
        } catch (_) {
          // Abaikan jika prefetch gagal
        }
      }
      if (csrf) {
        config.headers['X-CSRFToken'] = csrf
      }
      config.params = { ...(config.params || {}), _: Date.now() }
    }

    // Cache-busting untuk GET endpoint privat
    const isPrivateGet = method === 'get' && PRIVATE_PREFIXES.some(p => path.startsWith(p))
    if (isPrivateGet) {
      if (config.params instanceof URLSearchParams) {
        config.params.append('_ts', Date.now())
      } else {
        config.params = { ...(config.params || {}), _ts: Date.now() }
      }
    }

    // Debug logging WebView dihapus untuk mode web-only
  } catch (_) {}
  return config
})

// Handle 401 Unauthorized responses with JWT refresh
api.interceptors.response.use(
  (response) => {
    return normalizeResponseForMobile(tryDecodeResponseData(response))
  },
  async (error) => {
    tryDecodeErrorData(error)
    try {
      if (error && error.response && error.response.status === 401) {
        const originalRequest = error.config || {}
        const hasRetried = !!originalRequest._retry
        const path = String(originalRequest.url || '')
        const isRefreshCall = path.includes('/auth/jwt/refresh')
        const isLoginCall = path.includes('/auth/jwt/login') || path.includes('/auth/login')

        // Jangan mencoba refresh untuk panggilan refresh atau login
        if (isRefreshCall || isLoginCall) {
          // Fallthrough ke redirect cleanup
        } else {
          const refresh = localStorage.getItem('refresh_token')
          if (refresh && !hasRetried) {
            try {
              const resp = await api.post('/auth/jwt/refresh/', { refresh })
              const data = resp?.data || {}
              const newAccess = data.access || data.token || data.access_token
              if (newAccess) {
                // Simpan token baru dan retry request
                try {
                  localStorage.setItem('auth_token', newAccess)
                  localStorage.setItem('auth_scheme', 'Bearer')
                } catch (_) {}
                originalRequest._retry = true
                // Re-attach header and retry
                attachAuthHeader(originalRequest)
                return api(originalRequest)
              }
            } catch (_) {
              // Refresh gagal -> lanjut ke cleanup
            }
          }
        }

        // Cleanup & redirect ke login hanya untuk request privat/ber-auth
        const reqPath = String(originalRequest.url || '')
        const hasAuthHeader = !!(originalRequest.headers && (originalRequest.headers.Authorization || originalRequest.headers.authorization))
        const isPrivatePath = PRIVATE_PREFIXES.some(p => reqPath.startsWith(p))
        if (FORCE_LOGOUT_ON_401 && (hasAuthHeader || isPrivatePath)) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_scheme')
          localStorage.removeItem('refresh_token')
          const currentPath = window.location.pathname
          const authPaths = ['/login', '/register', '/forgot-password', '/terms']
          const isAuthPath = authPaths.some(p => currentPath.startsWith(p))
          if (!isAuthPath) {
            window.location.href = '/login?session_expired=true'
          }
        }
      }
    } catch (_) {}

    return Promise.reject(error)
  }
)

rootApi.interceptors.response.use(
  (response) => {
    return normalizeResponseForMobile(tryDecodeResponseData(response))
  },
  async (error) => {
    tryDecodeErrorData(error)
    try {
      if (error && error.response && error.response.status === 401) {
        const originalRequest = error.config || {}
        const hasRetried = !!originalRequest._retry
        const path = String(originalRequest.url || '')
        const isRefreshCall = path.includes('/auth/jwt/refresh')
        const isLoginCall = path.includes('/auth/jwt/login') || path.includes('/auth/login')

        if (!(isRefreshCall || isLoginCall)) {
          const refresh = localStorage.getItem('refresh_token')
          if (refresh && !hasRetried) {
            try {
              const resp = await api.post('/auth/jwt/refresh/', { refresh })
              const data = resp?.data || {}
              const newAccess = data.access || data.token || data.access_token
              if (newAccess) {
                try {
                  localStorage.setItem('auth_token', newAccess)
                  localStorage.setItem('auth_scheme', 'Bearer')
                } catch (_) {}
                originalRequest._retry = true
                attachAuthHeader(originalRequest)
                return rootApi(originalRequest)
              }
            } catch (_) {}
          }
        }

        const reqPath = String(originalRequest.url || '')
        const hasAuthHeader = !!(originalRequest.headers && (originalRequest.headers.Authorization || originalRequest.headers.authorization))
        const isPrivatePath = PRIVATE_PREFIXES.some(p => reqPath.startsWith(p))
        if (FORCE_LOGOUT_ON_401 && (hasAuthHeader || isPrivatePath)) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_scheme')
          localStorage.removeItem('refresh_token')
          const currentPath = window.location.pathname
          const authPaths = ['/login', '/register', '/forgot-password', '/terms']
          const isAuthPath = authPaths.some(p => currentPath.startsWith(p))
          if (!isAuthPath) {
            window.location.href = '/login?session_expired=true'
          }
        }
      }
    } catch (_) {}
    
    return Promise.reject(error)
  }
)

rootApi.interceptors.request.use((config) => {
  try {
    attachAuthHeader(config)
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'))
      return match ? decodeURIComponent(match[2]) : null
    }
    const csrf = getCookie('csrftoken')
    if (csrf) {
      config.headers['X-CSRFToken'] = csrf
    }

    // Cache-busting hanya untuk GET endpoint privat pada rootApi
    const method = (config.method || 'get').toLowerCase()
    const urlPath = String(config.url || '')
    const isPrivateGet = method === 'get' && PRIVATE_PREFIXES.some(p => urlPath.startsWith(p))
    if (isPrivateGet) {
      if (config.params instanceof URLSearchParams) {
        config.params.append('_ts', Date.now())
      } else {
        config.params = { ...(config.params || {}), _ts: Date.now() }
      }
    }

    // Debug logging khusus WebView dihapus untuk mode web-only
  } catch (_) {}
  return config
})

// Handle 401 Unauthorized responses for rootApi as well
rootApi.interceptors.response.use(
  (response) => {
    return normalizeResponseForMobile(tryDecodeResponseData(response))
  },
  (error) => {
    tryDecodeErrorData(error)
    // Debug error khusus WebView dihapus untuk mode web-only

    // Handle 401 Unauthorized error
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access detected (401). Redirecting to login...')
      const originalRequest = error.config || {}
      const reqPath = String(originalRequest.url || '')
      const hasAuthHeader = !!(originalRequest.headers && (originalRequest.headers.Authorization || originalRequest.headers.authorization))
      const isPrivatePath = PRIVATE_PREFIXES.some(p => reqPath.startsWith(p))
      if (FORCE_LOGOUT_ON_401 && (hasAuthHeader || isPrivatePath)) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_scheme')
        localStorage.removeItem('refresh_token')
        const currentPath = window.location.pathname
        const authPaths = ['/login', '/register', '/forgot-password', '/terms']
        const isAuthPath = authPaths.some(path => currentPath.startsWith(path))
        if (!isAuthPath) {
          window.location.href = '/login?session_expired=true'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// Daftar prefix endpoint privat (tergantung Authorization/Cookie)
const PRIVATE_PREFIXES = [
  '/auth/',
  '/transactions/',
  '/investments/',
  '/withdrawals/',
  '/attendance/',
  '/banks/user/',
  '/missions/',
  '/products/',
  '/withdraw/'
]

// Utility: Bersihkan cache klien dan state auth
const clearClientCaches = async () => {
  try {
    // Hapus token dan scheme
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_scheme')
    localStorage.removeItem('refresh_token')
    // Bersihkan sessionStorage (biasanya data sementara per sesi)
    try { sessionStorage.clear() } catch (_) {}
    // Bersihkan Cache Storage (jika ada Service Worker atau cache manual)
    if (typeof caches !== 'undefined' && caches?.keys) {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
    // Hapus Authorization default dari axios instance
    try { delete api.defaults.headers.common['Authorization'] } catch (_) {}
    try { delete rootApi.defaults.headers.common['Authorization'] } catch (_) {}
  } catch (_) {}

  // Arahkan ke login dan reload untuk reset state memori SPA
  try {
    window.location.href = '/login'
    // Reload untuk memastikan komponen dan store di-reset total
    setTimeout(() => {
      try { window.location.reload() } catch (_) {}
    }, 0)
  } catch (_) {}
}

export const authAPI = {
  register: (userData) => {
    return api.post('/auth/register/', userData)
  },
  
  login: async (credentials) => {
    try {
      // JWT login: kirim JSON body { phone, password }
      const resp = await api.post('/auth/jwt/login/', credentials, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        // Hindari kredensial pada login agar tidak diblok CORS
        withCredentials: false,
        validateStatus: (status) => status >= 200 && status < 400,
      })
      return resp
    } catch (err) {
      throw err
    }
  },

  // Refresh access token using refresh token
  refreshToken: (refresh) => {
    return api.post('/auth/jwt/refresh/', { refresh })
  },

  // Verify a token
  verifyToken: (token) => {
    return api.post('/auth/jwt/verify/', { token })
  },

  resetPassword: (payload) => {
    return api.post('/auth/reset-password/', payload)
  },
  
  logout: () => {
    return api.post('/auth/logout/').finally(() => {
      clearClientCaches()
    })
  },

  getAccountInfo: () => {
    return api.get('/auth/account-info/')
  },
  
  updateProfile: (profileData) => {
    return api.put('/auth/profile-update/', profileData)
  },

  getBalanceStatistics: async (period = 'all-time') => {
    try {
      return await api.get(`/auth/balance-statistics/${period}/`)
    } catch (err) {
      if (err?.response?.status === 404) {
        return await api.get('/auth/balance-statistics/')
      }
      throw err
    }
  },

  getRankStatus: () => {
    return api.get('/auth/rank-status/')
  }
  ,
  // GET /api/auth/rank-levels/ - List konfigurasi RankLevel
  getRankLevels: () => {
    return api.get('/auth/rank-levels/')
  },
  getTopDepositors: () => {
    return api.get('/auth/top-depositors/')
  },
  getTopActiveLevel1: () => {
    return api.get('/auth/top-active-level1/')
  },
  getDownlineOverview: (params = {}) => {
    return api.get('/auth/downline-overview/', { params })
  },
  getSettings: () => {
    return api.get('/auth/settings/')
  },
  requestOTP: (phone) => {
    return api.post('/auth/request-otp/', { phone })
  },
  getInvestorsMonthly: (params = {}) => {
    return api.get('/auth/investors/monthly/', { params, __skipApiEncode: true })
  }
}

// Set or update withdrawal PIN (6 digits)
// POST /api/auth/withdraw-pin/
// Body: { pin: string, current_pin?: string }
authAPI.setWithdrawPin = (payload) => {
  return api.post('/auth/withdraw-pin/', payload)
}

authAPI.getAddresses = () => {
  return api.get('/auth/address/')
}

authAPI.createAddress = (payload) => {
  return api.post('/auth/address/', payload)
}

export const depositAPI = {
  initiateJayapay: ({ amount, wallet_type = 'BALANCE_DEPOSIT' }) => {
    const type = (wallet_type || 'BALANCE_DEPOSIT').toUpperCase()
    return api.post('/deposits/jayapay/initiate/', { amount, wallet_type: type })
  },
  initiateKlikpay: ({ amount, wallet_type = 'BALANCE_DEPOSIT' }) => {
    const type = (wallet_type || 'BALANCE_DEPOSIT').toUpperCase()
    return api.post('/deposits/klikpay/initiate/', { amount, wallet_type: type })
  },
  // GET /api/deposits/transactions/ - Daftar transaksi deposit dengan filter
  getTransactions: (params = {}) => {
    // Supported parameters:
    // start_date (YYYY-MM-DD), end_date (YYYY-MM-DD), gateway (JAYAPAY/KLIKPAY),
    // order_num, status, wallet_type (BALANCE/BALANCE_DEPOSIT), page
    return api.get('/deposits/transactions/', { params })
  }
}

export const attendanceAPI = {
  getActiveSettings: () => {
    return api.get('/attendance/settings/active/')
  },
  getSettings: (id) => {
    return api.get(`/attendance/settings/${id}/`)
  },
  checkStatus: () => {
    return api.get('/attendance/status/')
  },

  getStreak: () => {
    return api.get('/attendance/logs/streak/')
  },
  
  claim: () => {
    return api.post('/attendance/logs/claim/')
  },

  claimBonus: () => {
    return api.post('/attendance/logs/claim-bonus/', {})
  },
  
  getLogs: (params = {}) => {
    return api.get('/attendance/logs/', { params })
  }
}

export const missionAPI = {
  // GET /api/missions/
  getMissions: (params = {}) => {
    return api.get('/missions/', { params })
  },
  
  // POST /api/missions/claim/
  claimMission: (id) => {
    return api.post('/missions/claim/', { mission_id: id, times: 1 })
  }
}

export const investmentAPI = {
  // GET /api/investments/ - Get list of investments (Primary endpoint)
  getInvestments: (params = {}) => {
    return api.get('/investments/', { params })
  },
  // GET /api/investments/{id}/
  getInvestment: (id, config = {}) => {
    return api.get(`/investments/${id}/`, config)
  },
  // GET /api/investments/{id}/interest-transactions/ - Latest INTEREST transactions for a specific investment
  getInvestmentInterestTransactions: (id, params = {}) => {
    return api.get(`/investments/${id}/interest-transactions/`, { params })
  },
  // Claim daily profit from an active investment
  claimProfit: (investmentId) => {
    return api.post('/investments/claim-profit/', { investment_id: investmentId })
  },
  // Claim profit for all eligible active investments in one request
  claimProfitAll: () => {
    return api.post('/investments/claim-profit-all/', {})
  },
  claimPrincipal: (investmentId) => {
    return api.post('/investments/claim-principal/', { investment_id: investmentId })
  },
  // GET /api/investments/transaction/ - List transaksi investasi (type INTEREST)
  getTransactions: (params = {}) => {
    return api.get('/investments/transaction/', { params })
  }
}

export const transactionAPI = {
  // GET /api/transactions/ - Get list of transactions with filtering
  getTransactions: (params = {}) => {
    // Supported parameters: start_date, end_date, status, type, wallet_type, page
    return api.get('/transactions/', { params })
  },
  // GET /api/transactions/{id}/ - Get specific transaction details
  getTransaction: (transactionId) => {
    return api.get(`/transactions/${transactionId}/`)
  }
}

authAPI.getBalanceStatistics = (period = 'today') => {
  return api.get(`/auth/balance-statistics/${period}/`)
}

export const commissionAPI = {
  // Get downline members overview with commission statistics
  getDownlineOverview: (params = {}) => {
    return api.get('/auth/downline-overview/', { params })
  },
  // Get downline statistics per level (1-5)
  getDownlineStats: () => {
    return api.get('/auth/downline-stats/')
  }
}

export const voucherAPI = {
  // POST /api/vouchers/claim/ - Claim voucher untuk menambah saldo user
  claim: (voucherData) => {
    return api.post('/vouchers/claim/', voucherData)
  },
  // GET /api/vouchers/transactions/ - Riwayat penukaran voucher
  getTransactions: (params = {}) => {
    return api.get('/vouchers/transactions/', { params })
  },
  // GET /api/vouchers/ - List voucher aktif yang bisa diklaim
  getList: (params = {}) => {
    return api.get('/vouchers/', { params })
  }
}

export const reviewAPI = {
  getReviews: (params = {}) => {
    return api.get('/reviews/', { params })
  },
  createReview: (formData) => {
    return api.post('/reviews/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    })
  }
}

export const rouletteAPI = {
  getStatus: () => {
    return api.get('/roulette/status/')
  },
  spin: () => {
    return api.post('/roulette/spin/', {})
  }
}

export const supportAPI = {
  // Ambil daftar link support
  getLinks: (params = {}) => {
    return api.get('/support/links/', { params })
  },
  // Alias for getLinks to match the API endpoint name
  getSupportLinks: (params = {}) => {
    return api.get('/support/links/', { params })
  },
  // GET /api/support/chat/messages/ - daftar pesan thread user
  getChatMessages: () => {
    return api.get('/support/chat/messages/')
  },
  // POST /api/support/chat/send/ - kirim pesan user
  sendChatMessage: (payload) => {
    // payload: { message: string }
    return api.post('/support/chat/send/', payload)
  },
  // GET /api/support/chat/stream/ - SSE stream untuk balasan bot
  // Mengembalikan EventSource agar consumer bisa subscribe onmessage/onerror
  openChatStream: () => {
    try {
      const base = API_BASE_URL?.replace(/\/$/, '') || ''
      const url = `${base}/support/chat/stream/`
      return new EventSource(url, { withCredentials: USE_CREDENTIALS })
    } catch (_) {
      return null
    }
  },
  // Fallback SSE menggunakan fetch untuk environment yang menolak Accept default
  streamChatWithFetch: (onMessage) => {
    try {
      const base = API_BASE_URL?.replace(/\/$/, '') || ''
      const url = `${base}/support/chat/stream/`
      const controller = new AbortController()
      const signal = controller.signal
      const headers = {
        Accept: 'text/event-stream'
      }
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          const scheme = localStorage.getItem('auth_scheme') || 'Bearer'
          headers.Authorization = `${scheme} ${token}`
        }
      } catch (_) {}
      const readerReady = fetch(url, {
        method: 'GET',
        headers,
        credentials: USE_CREDENTIALS ? 'include' : 'same-origin',
        signal
      }).then(async (resp) => {
        if (!resp.ok) {
          return { ok: false, status: resp.status }
        }
        const reader = resp.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          // Proses event berdasarkan double newline sebagai pemisah
          let idx
          while ((idx = buffer.indexOf('\n\n')) !== -1) {
            const rawEvent = buffer.slice(0, idx)
            buffer = buffer.slice(idx + 2)
            // Ambil baris data:
            const lines = rawEvent.split('\n')
            const dataLines = lines.filter(l => l.startsWith('data:'))
            const dataStr = dataLines.map(l => l.slice(5).trim()).join('\n')
            if (!dataStr || dataStr === 'keep-alive') continue
            let payload = null
            try { payload = JSON.parse(dataStr) } catch (_) { payload = null }
            if (payload && typeof onMessage === 'function') {
              onMessage(payload)
            }
          }
        }
        return { ok: true, status: 200 }
      }).catch((err) => {
        return { ok: false, status: 0, error: err }
      })
      return { abort: () => controller.abort(), ready: readerReady }
    } catch (err) {
      console.warn('streamChatWithFetch init failed:', err)
      return null
    }
  }
}

export const newsAPI = {
  // Get news list with pagination
  getNews: (params = {}) => {
    return api.get('/news/', { params })
  },
  
  // Get news detail by ID
  getNewsDetail: (id) => {
    return api.get(`/news/${id}/`)
  },
}

export const productAPI = {
  // Get products list with pagination
  getProducts: (params = {}) => {
    return api.get('/products/', { params })
  },
  
  // Get product detail by ID
  getProduct: (id) => {
    return api.get(`/products/${id}/`)
  },
  
  // Purchase a product and create an investment
  purchaseProduct: (purchaseData) => {
    return api.post('/products/purchase/', purchaseData)
  },
  
  // Claim cashback from a purchase transaction
  claimCashback: (transactionId) => {
    // Format transaction_id harus: PUR-YYYYMMDDHHMMSS-XXXXX
    const requestData = { transaction_id: String(transactionId) };
    
    // Token akan otomatis ditambahkan oleh interceptor
    return api.post('/products/claim-cashback/', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}



export const bankAPI = {
  // GET /api/banks/ - List active banks for withdrawal
  getBanks: () => {
    return api.get('/banks/')
  },
  
  // GET /api/banks/user/ - List all banks owned by current user
  getUserBanks: () => {
    return api.get('/banks/user/')
  },
  
  // POST /api/banks/user/ - Add a bank owned by the user
  addUserBank: (bankData) => {
    return api.post('/banks/user/', bankData)
  },
  
  // PUT /api/banks/user/ - Edit a bank owned by the user
  updateUserBank: (bankData) => {
    return api.put('/banks/user/', bankData)
  },
  
  // PATCH /api/banks/user/{id}/ - Set a bank as default
  setDefaultBank: (bankId) => {
    return api.patch(`/banks/user/${bankId}/`)
  },
  
  // DELETE /api/banks/user/{id}/ - Delete a bank owned by the user
  deleteUserBank: (bankId) => {
    return api.delete(`/banks/user/${bankId}/`)
  },
}

export const withdrawalAPI = {
  // POST /api/withdraw/ - Request withdrawal (New Endpoint)
  createWithdrawal: (withdrawalData) => {
    return api.post('/withdraw/', withdrawalData)
  },

  // POST /api/withdrawals/ - Request withdrawal (Old Endpoint)
  requestWithdrawal: (withdrawalData) => {
    return api.post('/withdrawals/', withdrawalData)
  },
  
  // GET /api/withdrawals/ - Get list of withdrawals
  getWithdrawals: (params = {}) => {
    return api.get('/withdrawals/', { params })
  },

  // GET /api/withdrawals/transactions/ - Daftar transaksi withdraw dengan filter
  // Supported parameters:
  // bank_account_id, start_date (YYYY-MM-DD), end_date (YYYY-MM-DD),
  // order_num (trx_id), status, wallet_type (BALANCE/BALANCE_DEPOSIT), page
  getTransactions: async (params = {}) => {
    try {
      return await api.get('/withdraw/transactions/', { params })
    } catch (err) {
      if (err?.response?.status === 404) {
        return await api.get('/withdrawals/transactions/', { params })
      }
      throw err
    }
  },
  getUserWithdrawals: (params = {}) => {
    return api.get('/withdraw/', { params })
  },
  // GET /api/withdraw/services/ - List withdraw services (durasi dan fee)
  getServices: (params = {}) => {
    return api.get('/withdraw/services/', { params })
  }
}

export default api
