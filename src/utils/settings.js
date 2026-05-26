import { reactive } from 'vue'
import { authAPI } from '@/services/api'

// Reactive state for application settings
export const appSettings = reactive({
  frontendUrl: null,
  settings: null,
  currency: {
    currency_code: 'IDR',
    rate_to_idr: '1',
    symbol: 'Rp',
    symbol_position: 'prefix',
    symbol_space: true,
    thousand_sep: '.',
    decimal_sep: ',',
    decimals: 0
  },
  isLoaded: false
})

/**
 * Initialize application settings from API
 * Should be called early in the app lifecycle (e.g. App.vue or main.js)
 */
export const initSettings = async () => {
  try {
    const [settingsResp, currencyResp] = await Promise.allSettled([
      authAPI.getSettings(),
      authAPI.getCurrencySettings()
    ])

    if (settingsResp.status === 'fulfilled') {
      const response = settingsResp.value
      appSettings.settings = response?.data || null
      if (response.data && response.data.frontend_url) {
        appSettings.frontendUrl = response.data.frontend_url
      }
    }

    if (currencyResp.status === 'fulfilled') {
      const data = currencyResp.value?.data || null
      if (data && typeof data === 'object') {
        const rateFromApi = data.rate_to_idr ?? appSettings.currency.rate_to_idr ?? '1'
        appSettings.currency = {
          currency_code: 'IDR',
          rate_to_idr: String(rateFromApi),
          symbol: 'Rp',
          symbol_position: 'prefix',
          symbol_space: true,
          thousand_sep: '.',
          decimal_sep: ',',
          decimals: 0
        }
      }
    }

    appSettings.isLoaded = true
  } catch (error) {
    appSettings.isLoaded = true
  }
}

/**
 * Get the effective Frontend URL
 * Priority:
 * 1. Dynamic API setting (if loaded)
 * 2. VITE_FRONTEND_URL env var
 * 3. Window origin (browser)
 */
export const getFrontendUrl = () => {
  if (appSettings.frontendUrl) {
    return String(appSettings.frontendUrl).replace(/\/+$/, '')
  }
  
  const envUrl = import.meta.env.VITE_FRONTEND_URL
  if (envUrl) {
    return String(envUrl).replace(/\/+$/, '')
  }
  
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  return ''
}

const toNumberLoose = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const addThousandSep = (digits, sep) => {
  const s = String(digits || '')
  if (!s) return ''
  const negative = s.startsWith('-')
  const raw = negative ? s.slice(1) : s
  const out = raw.replace(/\B(?=(\d{3})+(?!\d))/g, sep)
  return negative ? `-${out}` : out
}

export const formatAppCurrency = (value, opts = {}) => {
  const cfg = appSettings.currency || {}
  const symbol = String(opts.symbol ?? cfg.symbol ?? '')
  const symbolPosition = String(opts.symbol_position ?? cfg.symbol_position ?? 'prefix')
  const symbolSpace = Boolean(opts.symbol_space ?? cfg.symbol_space ?? false)
  const thousandSep = String(opts.thousand_sep ?? cfg.thousand_sep ?? ',')
  const decimalSep = String(opts.decimal_sep ?? cfg.decimal_sep ?? '.')
  const decimalsRaw = opts.decimals ?? cfg.decimals
  const decimals = Number.isFinite(Number(decimalsRaw)) ? Math.max(0, Number(decimalsRaw)) : 2

  const n = toNumberLoose(value)
  const fixed = n.toFixed(decimals)
  const [intPart, fracPart] = fixed.split('.')
  const withSep = addThousandSep(intPart, thousandSep)
  const numText = decimals > 0 ? `${withSep}${decimalSep}${fracPart || ''.padEnd(decimals, '0')}` : withSep
  const space = symbolSpace ? ' ' : ''

  if (!symbol) return numText
  if (symbolPosition === 'suffix') return `${numText}${space}${symbol}`
  return `${symbol}${space}${numText}`
}

export const getRateToIdr = () => {
  const cfg = appSettings.currency || {}
  const rate = toNumberLoose(cfg.rate_to_idr)
  return rate > 0 ? rate : 0
}
