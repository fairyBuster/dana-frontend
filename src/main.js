import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './styles/global.css'

import { Capacitor } from '@capacitor/core'
import { PushNotifications } from '@capacitor/push-notifications'

const app = createApp(App).use(router).use(i18n)

// Sembunyikan splash overlay setelah router siap
router.isReady().then(() => {
  app.mount('#app')
  const splash = document.getElementById('app-splash')
  if (splash) splash.style.display = 'none'

  // Inisialisasi Push Notifications (hanya native)
  if (Capacitor.isNativePlatform()) {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register()
      }
    })

    PushNotifications.addListener('registration', token => {
      console.log('FCM token', token.value)
      // TODO: Kirim token ke backend jika diperlukan
    })

    PushNotifications.addListener('registrationError', err => {
      console.error('Registration error', err)
    })

    PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push received', notification)
    })
  }
})
