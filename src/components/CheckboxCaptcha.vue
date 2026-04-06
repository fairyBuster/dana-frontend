<template>
  <div class="checkbox-captcha-container">
    <div class="captcha-box" :class="{ 'verified': isVerified }" @click="verify">
      <div class="checkbox-wrapper">
        <div class="spinner" v-if="isLoading"></div>
        <div class="checkmark" v-else-if="isVerified">
          <svg viewBox="0 0 24 24" class="checkmark-icon">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <div class="checkbox" v-else></div>
      </div>
      <span class="captcha-label">I'm not a robot</span>
      <div class="captcha-logo">
        <svg viewBox="0 0 48 48" width="32" height="32" class="captcha-icon">
          <path fill="#4285F4" d="M24 30c3.31 0 6-2.69 6-6 0-3.31-2.69-6-6-6-3.31 0-6 2.69-6 6 0 3.31 2.69 6 6 6zm0-16c5.52 0 10 4.48 10 10 0 5.52-4.48 10-10 10-5.52 0-10-4.48-10-10 0-5.52 4.48-10 10-10zm14 10c0-7.73-6.27-14-14-14-7.73 0-14 6.27-14 14 0 7.73 6.27 14 14 14 7.73 0 14-6.27 14-14zm-4 0c0 5.52-4.48 10-10 10-5.52 0-10-4.48-10-10 0-5.52 4.48-10 10-10 5.52 0 10 4.48 10 10z"/>
          <path fill="#4285F4" d="M44 24c0 11.05-8.95 20-20 20S4 35.05 4 24 12.95 4 24 4s20 8.95 20 20z" opacity=".2"/>
          <path fill="#4285F4" d="M24 4C12.95 4 4 12.95 4 24c0 11.05 8.95 20 20 20 11.05 0 20-8.95 20-20C44 12.95 35.05 4 24 4zm0 36c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"/>
        </svg>
        <span class="privacy-terms">reCAPTCHA</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isVerified = ref(false)
const isLoading = ref(false)

const emit = defineEmits(['verify', 'expire'])

const verify = () => {
  if (isVerified.value || isLoading.value) return

  isLoading.value = true
  
  // Simulate network request/verification delay
  setTimeout(() => {
    isLoading.value = false
    isVerified.value = true
    emit('verify', true)
  }, 1000)
}

const reset = () => {
  isVerified.value = false
  isLoading.value = false
  emit('expire')
}

defineExpose({
  reset,
  isVerified
})
</script>

<style scoped>
.checkbox-captcha-container {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.captcha-box {
  background: #f9f9f9;
  border: 1px solid #d3d3d3;
  border-radius: 3px;
  width: 300px;
  height: 74px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-shadow: 0 0 4px 1px rgba(0,0,0,0.08);
  position: relative;
  user-select: none;
}

.checkbox-wrapper {
  width: 28px;
  height: 28px;
  background: #fff;
  border: 2px solid #c1c1c1;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  cursor: pointer;
}

.checkbox-wrapper:hover {
  border-color: #b2b2b2;
}

.captcha-label {
  font-family: Roboto, helvetica, arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #000;
}

.captcha-logo {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
}

.captcha-logo .captcha-icon {
  width: 32px;
  height: 32px;
  opacity: 0.5;
}

.privacy-terms {
  font-size: 10px;
  color: #555;
  margin-top: 2px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.checkmark-icon {
  width: 24px;
  height: 24px;
  color: #0f9d58;
}

.verified .checkbox-wrapper {
  border: none;
  background: transparent;
}
</style>
