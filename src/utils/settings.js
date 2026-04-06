import { reactive } from 'vue'
import { authAPI } from '@/services/api'

// Reactive state for application settings
export const appSettings = reactive({
  frontendUrl: null,
  isLoaded: false
})

/**
 * Initialize application settings from API
 * Should be called early in the app lifecycle (e.g. App.vue or main.js)
 */
export const initSettings = async () => {
  try {
    const response = await authAPI.getSettings()
    if (response.data && response.data.frontend_url) {
      appSettings.frontendUrl = response.data.frontend_url
    }
    appSettings.isLoaded = true
  } catch (error) {
    // Silent fail, fallback to defaults
    console.warn('Failed to load dynamic settings, using defaults.')
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
