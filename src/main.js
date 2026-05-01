import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './styles/global.css'

const app = createApp(App).use(router).use(i18n)

router.isReady().then(() => {
  app.mount('#app')
  const splash = document.getElementById('app-splash')
  if (splash) splash.style.display = 'none'

  try {
    let lastHiddenAt = 0
    const RELOAD_AFTER_MS = 30 * 60 * 1000
    const RELOAD_COOLDOWN_MS = 10 * 1000
    let lastReloadAt = 0
    try {
      lastReloadAt = Number(sessionStorage.getItem('__last_reload_at') || 0) || 0
    } catch (_) {
      lastReloadAt = 0
    }

    const hasBlockingOverlay = () => {
      try {
        return !!document.querySelector('.spinner-overlay.is-overlay, .modal-overlay, .notification-screen, #section-voucher-modal')
      } catch (_) {
        return false
      }
    }

    const safeReload = (bustCache = false) => {
      const now = Date.now()
      if (now - lastReloadAt < RELOAD_COOLDOWN_MS) return
      lastReloadAt = now
      try {
        sessionStorage.setItem('__last_reload_at', String(now))
      } catch (_) {}

      if (document.readyState !== 'complete') {
        window.addEventListener('load', () => safeReload(bustCache), { once: true })
        return
      }

      if (bustCache) {
        try {
          const url = new URL(window.location.href)
          url.searchParams.set('_r', String(now))
          window.location.replace(url.toString())
          return
        } catch (_) {}
      }

      window.location.reload()
    }

    const maybeReload = (force = false) => {
      const elapsed = lastHiddenAt ? Date.now() - lastHiddenAt : 0
      const shouldReload =
        force ||
        (elapsed > 0 && elapsed >= RELOAD_AFTER_MS) ||
        (elapsed > 0 && elapsed >= 10 * 60 * 1000 && hasBlockingOverlay())
      if (!shouldReload) return
      lastHiddenAt = 0
      safeReload(false)
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

    window.addEventListener('freeze', () => {
      lastHiddenAt = Date.now()
    })

    window.addEventListener('resume', () => {
      maybeReload()
    })

    window.addEventListener('pageshow', (e) => {
      if (e && e.persisted) {
        safeReload(true)
      }
    })

    window.addEventListener('vite:preloadError', () => {
      safeReload(true)
    })

    window.addEventListener(
      'error',
      (e) => {
        const target = e?.target
        if (!target) return
        const tag = String(target.tagName || '').toUpperCase()
        if (tag === 'LINK') {
          const rel = String(target.rel || '').toLowerCase()
          if (rel === 'stylesheet') safeReload(true)
        } else if (tag === 'SCRIPT') {
          safeReload(true)
        }
      },
      true
    )

    window.addEventListener('unhandledrejection', (e) => {
      const reason = e?.reason
      const msg = String(reason?.message ?? reason ?? '').toLowerCase()
      if (
        msg.includes('chunkloaderror') ||
        msg.includes('loading chunk') ||
        msg.includes('failed to fetch dynamically imported module') ||
        msg.includes('importing a module script failed') ||
        msg.includes('css chunk') ||
        (msg.includes('stylesheet') && msg.includes('failed'))
      ) {
        safeReload(true)
      }
    })
  } catch (_) {}
if (Capacitor.isNativePlatform()) {
  PushNotifications.requestPermissions().then(result => {
    if (result.receive === 'granted') {
      PushNotifications.register()
    }
  })

  PushNotifications.addListener('registration', token => {
    console.log('FCM token', token.value)
  })

  PushNotifications.addListener('registrationError', err => {
    console.error('Registration error', err)
  })

  PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('Push received', notification)
  })
}