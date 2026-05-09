import { createI18n } from 'vue-i18n'
import { startDomTranslation, stopDomTranslation } from '../utils/domTranslator'

const messages = {}

const savedLanguage = localStorage.getItem('user_language') || 'id'

document.documentElement.setAttribute('lang', savedLanguage)

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: savedLanguage,
  messages,
  globalInjection: true,
  missing: () => ''
})

export function setLanguage(lang) {
  i18n.global.locale.value = lang
  localStorage.setItem('user_language', lang)
  document.documentElement.setAttribute('lang', lang)
  
  stopDomTranslation()
  startDomTranslation(lang)
  
  return true
}

export default i18n
