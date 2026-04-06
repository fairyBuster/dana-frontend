/**
 * Plugin untuk menangani perubahan bahasa secara global
 * Plugin ini akan memastikan bahasa diperbarui di seluruh aplikasi
 */

import { setLanguage } from '../i18n'

export default {
  install: (app) => {
    // Tambahkan metode global untuk mengubah bahasa
    app.config.globalProperties.$changeLanguage = (lang) => {
      return setLanguage(lang)
    }

    // Tambahkan direktif untuk memastikan elemen diperbarui saat bahasa berubah
    app.directive('i18n-watch', {
      mounted(el, binding, vnode) {
        // Tandai elemen untuk diperbarui saat bahasa berubah
        el.dataset.i18nWatch = true
      }
    })

    // Deteksi bahasa dari localStorage saat startup
    const savedLanguage = localStorage.getItem('user_language')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }
}
