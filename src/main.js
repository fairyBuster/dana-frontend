import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './styles/global.css'

const app = createApp(App).use(router).use(i18n)

// Sembunyikan splash overlay setelah router siap
router.isReady().then(() => {
  app.mount('#app')
  const splash = document.getElementById('app-splash')
  if (splash) splash.style.display = 'none'

  // Jika tab di-restore setelah lama (BFCache / session restore), state SPA kadang "nge-freeze"
  // sehingga tombol tidak responsif sampai refresh manual. Auto-reload saat tab aktif kembali.
  try {
    let lastHiddenAt = 0
    const RELOAD_AFTER_MS = 15 * 60 * 1000

    const maybeReload = () => {
      if (!lastHiddenAt) return
      const elapsed = Date.now() - lastHiddenAt
      if (elapsed >= RELOAD_AFTER_MS) {
        lastHiddenAt = 0
        window.location.reload()
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        lastHiddenAt = Date.now()
      } else {
        maybeReload()
      }
    })

    window.addEventListener('focus', () => {
      if (!document.hidden) maybeReload()
    })

    window.addEventListener('pageshow', (e) => {
      if (e && e.persisted) {
        window.location.reload()
      }
    })
  } catch (_) {}

})
