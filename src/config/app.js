/**
 * Application configuration
 */

export default {
  // API base URL
  apiBaseUrl: (import.meta?.env?.VITE_API_URL) || '/api',
  
  // Referral configuration
  referral: {
    // Base URL for referral links
    baseUrl: (import.meta?.env?.VITE_FRONTEND_URL) || (typeof window !== 'undefined' ? window.location.origin : '/'),
    
    // Path format for referral links (configurable via env)
    // Use {code} as a placeholder for the referral code
    pathFormat: (import.meta?.env?.VITE_REFERRAL_PATH_FORMAT) || '/register/{code}',
    
    // Alternative path format (can be switched in the future if needed)
    alternativePathFormat: '/ref={code}'
  },
  
  // Default language
  defaultLanguage: 'id',
  
  // Default currency
  defaultCurrency: 'USD',
  
  // App version
  version: '1.0.0'
}


