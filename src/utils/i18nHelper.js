/**
 * Utilitas untuk membantu konversi teks statis ke i18n
 * dan memastikan bahasa diperbarui di seluruh aplikasi
 */

import { useI18n } from 'vue-i18n'
import { setLanguage } from '../i18n'

/**
 * Hook untuk menggunakan i18n dengan fungsi tambahan
 * @returns {Object} i18n utilities
 */
export function useI18nHelper() {
  const { t, locale } = useI18n()
  
  /**
   * Mengubah bahasa dan memastikan perubahan diterapkan ke seluruh aplikasi
   * @param {string} lang - Kode bahasa ('id', 'zh', dll)
   * @returns {boolean} Sukses atau tidak
   */
  const changeLanguage = (lang) => {
    return setLanguage(lang)
  }
  
  /**
   * Mendapatkan bahasa saat ini
   * @returns {string} Kode bahasa saat ini
   */
  const getCurrentLanguage = () => {
    return locale.value
  }
  
  /**
   * Mengonversi teks statis ke i18n dengan namespace
   * @param {string} text - Teks statis
   * @param {string} namespace - Namespace untuk kunci i18n
   * @returns {string} Kunci i18n yang disarankan
   */
  const suggestI18nKey = (text, namespace = 'common') => {
    // Buat key dari teks (lowercase, hapus karakter khusus, ganti spasi dengan underscore)
    const key = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .trim()
      .replace(/\s+/g, '_')
    
    return `${namespace}.${key}`
  }
  
  return {
    t,
    locale,
    changeLanguage,
    getCurrentLanguage,
    suggestI18nKey
  }
}

/**
 * Memeriksa apakah objek terjemahan memiliki kunci tertentu
 * @param {Object} translations - Objek terjemahan
 * @param {string} key - Kunci yang akan diperiksa (format: 'namespace.key')
 * @returns {boolean} Apakah kunci ada
 */
export function hasTranslationKey(translations, key) {
  const parts = key.split('.')
  let current = translations
  
  for (const part of parts) {
    if (current[part] === undefined) {
      return false
    }
    current = current[part]
  }
  
  return true
}

/**
 * Menambahkan kunci terjemahan baru ke objek terjemahan
 * @param {Object} translations - Objek terjemahan
 * @param {string} key - Kunci yang akan ditambahkan (format: 'namespace.key')
 * @param {string} value - Nilai terjemahan
 * @returns {Object} Objek terjemahan yang diperbarui
 */
export function addTranslationKey(translations, key, value) {
  const parts = key.split('.')
  let current = translations
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]
    if (!current[part]) {
      current[part] = {}
    }
    current = current[part]
  }
  
  current[parts[parts.length - 1]] = value
  
  return translations
}
