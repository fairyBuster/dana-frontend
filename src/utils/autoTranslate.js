/**
 * Utilitas untuk membantu mengkonversi teks statis ke i18n secara otomatis
 */

import idTranslations from '../i18n/locales/id.json'
import zhTranslations from '../i18n/locales/zh.json'
import { addTranslationKey, hasTranslationKey } from './i18nHelper'

/**
 * Mengonversi teks statis ke kunci i18n yang sesuai
 * @param {string} text - Teks statis yang akan dikonversi
 * @param {string} namespace - Namespace untuk kunci i18n
 * @returns {string} Kunci i18n yang disarankan
 */
export function textToI18nKey(text, namespace = 'common') {
  // Buat key dari teks (lowercase, hapus karakter khusus, ganti spasi dengan underscore)
  let key = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
  
  // Jika key terlalu panjang, potong
  if (key.length > 30) {
    key = key.substring(0, 30)
  }
  
  return `${namespace}.${key}`
}

/**
 * Menambahkan terjemahan baru ke file terjemahan
 * @param {string} text - Teks dalam bahasa Indonesia
 * @param {string} zhText - Teks dalam bahasa China
 * @param {string} namespace - Namespace untuk kunci i18n
 * @returns {string} Kunci i18n yang dibuat
 */
export function addNewTranslation(text, zhText, namespace = 'common') {
  const key = textToI18nKey(text, namespace)
  
  // Periksa apakah kunci sudah ada
  if (!hasTranslationKey(idTranslations, key)) {
    // Tambahkan ke terjemahan Indonesia
    addTranslationKey(idTranslations, key, text)
    
    // Tambahkan ke terjemahan China
    addTranslationKey(zhTranslations, key, zhText || text)
  }
  
  return key
}

/**
 * Mengonversi elemen HTML dengan teks statis ke i18n
 * @param {HTMLElement} element - Elemen HTML yang akan dikonversi
 * @param {string} namespace - Namespace untuk kunci i18n
 */
export function convertElementToI18n(element, namespace = 'common') {
  const text = element.innerText.trim()
  if (text) {
    const key = textToI18nKey(text, namespace)
    
    // Ganti teks dengan template i18n
    element.innerHTML = `{{ $t('${key}') }}`
    
    // Tambahkan ke terjemahan jika belum ada
    if (!hasTranslationKey(idTranslations, key)) {
      addTranslationKey(idTranslations, key, text)
      addTranslationKey(zhTranslations, key, text) // Default sama dengan teks asli
    }
  }
}

/**
 * Mengonversi semua teks statis dalam komponen Vue ke i18n
 * Fungsi ini hanya untuk membantu pengembangan, tidak untuk digunakan di produksi
 * @param {Object} component - Komponen Vue yang akan dikonversi
 * @param {string} namespace - Namespace untuk kunci i18n
 */
export function convertComponentToI18n(component, namespace) {
  // Implementasi ini hanya contoh dan tidak akan berfungsi di runtime
  // Dalam praktiknya, ini akan menjadi script terpisah yang dijalankan di luar aplikasi
  console.warn('convertComponentToI18n hanya untuk pengembangan, tidak untuk digunakan di produksi')
}
