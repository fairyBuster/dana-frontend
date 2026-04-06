<template>
  <div v-if="isMobile" id="app">
    <router-view v-slot="{ Component }">
      <keep-alive :exclude="['ProductDetails']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <div v-else class="desktop-restriction">
    <div class="desktop-shell">
      <div class="desktop-card">
        <p class="desktop-text">Sorry</p>
        <div class="desktop-divider"></div>
        <p class="desktop-hint">Access is only permitted using Android/IOS mobile because the user area can only be accessed when the user has registered independently.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Capacitor } from '@capacitor/core'
import { initSettings } from '@/utils/settings'

const { locale } = useI18n()
const isMobile = ref(true)
const debugInfo = ref('')

const checkMobile = () => {
  // 1. Always allow native app context
  if (Capacitor.isNativePlatform()) return true

  // 2. Check for touch capabilities
  const hasTouch = (
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
  )

  // 3. Check for coarse pointer (finger vs mouse)
  const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches

  // 4. User Agent check (as a filter)
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  const isMobileUA = /android|ipad|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent)

  // 5. Screen size check (as a fallback, but stricter)
  const isSmallScreen = window.innerWidth <= 768

  // Strict Logic:
  // Must be Mobile UA AND (Have Touch OR Coarse Pointer)
  // OR be a very small screen with Touch (to cover edge cases)
  
  const isMobileDevice = isMobileUA && (hasTouch || isCoarsePointer)

  // For debugging (hidden in production usually, but helpful here if user asks)
  // debugInfo.value = `UA:${isMobileUA} Touch:${hasTouch} Coarse:${isCoarsePointer}`

  return isMobileDevice
}

const handleResize = () => {
  // Re-check on resize, but don't be too aggressive if keyboard opens
  isMobile.value = checkMobile()
}

onMounted(() => {
  initSettings()
  isMobile.value = checkMobile()
  window.addEventListener('resize', handleResize)
  
  // Set initial HTML lang attribute
  document.documentElement.setAttribute('lang', locale.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.desktop-restriction {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0b0b15;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Inter', sans-serif;
  color: #ffffff;
}

.desktop-shell {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.desktop-card {
  width: 100%;
  background: linear-gradient(180deg, rgba(16, 15, 44, 0.95) 0%, rgba(15, 19, 46, 0.95) 48%, rgba(10, 16, 37, 0.95) 100%);
  border: 1px solid rgba(116, 106, 154, 0.6);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  padding: 22px 18px;
  text-align: center;
}

.desktop-logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.desktop-logo-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.desktop-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: rgba(255, 255, 255, 0.95);
}

.desktop-text {
  margin: 0 0 6px 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.88);
}

.desktop-text--muted {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
}

.desktop-divider {
  width: 100%;
  height: 1px;
  margin: 14px 0 12px;
  background: rgba(116, 106, 154, 0.55);
  border-radius: 999px;
  opacity: 0.8;
}

.desktop-hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.75);
}

#app {
  min-height: 100vh;
}
</style>
