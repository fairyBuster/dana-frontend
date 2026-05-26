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

  try {
    if (import.meta.env.PROD) {
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault()
      })

      window.addEventListener('keydown', (e) => {
        const key = String(e.key || '').toLowerCase()
        const ctrlOrCmd = e.ctrlKey || e.metaKey
        const blockDevtools =
          e.key === 'F12' ||
          e.keyCode === 123 ||
          (ctrlOrCmd && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
          (ctrlOrCmd && key === 'u')
        if (blockDevtools) {
          e.preventDefault()
          e.stopPropagation()
        }
      }, true)

      const ua = String(navigator?.userAgent || '')
      const isLikelyMobile = /android|iphone|ipad|ipod|mobi/i.test(ua)
      if (!isLikelyMobile) {
        let blocked = false
        const DEVTOOLS_GAP = 160
        const isDevtoolsOpen = () => {
          const w = window
          const widthGap = Math.abs((w.outerWidth || 0) - (w.innerWidth || 0))
          const heightGap = Math.abs((w.outerHeight || 0) - (w.innerHeight || 0))
          return widthGap > DEVTOOLS_GAP || heightGap > DEVTOOLS_GAP
        }
        const blockUi = () => {
          if (blocked) return
          blocked = true
          try { document.documentElement.innerHTML = '' } catch (_) {}
        }
        setInterval(() => {
          try {
            if (isDevtoolsOpen()) blockUi()
          } catch (_) {}
        }, 800)
      }
    }
  } catch (_) {}

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
