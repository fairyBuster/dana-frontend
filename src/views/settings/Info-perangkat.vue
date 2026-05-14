<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/4280_552.svg" alt="Back">
        </button>
        <h1 class="title">About Us</h1>
      </header>
    </section>

    <!-- Logo -->
    <section id="section-logo">
      <div class="logo-container">
        <div class="logo-box">
          <img src="/assets/image/d6fdfec9af71120ed69cee9c9560f6254901b2e8.png" alt="HUE Logo" class="logo-img">
        </div>
        <h2 class="app-name">HUE</h2>
      </div>
    </section>

    <!-- Actions -->
    <section id="section-actions">
      <div class="action-row" @click="syncUpdates">
        <img src="/assets/image/163ded71fa3ded61681ee0f37f5fc6e9217ad3de.png" alt="Sync Icon" class="action-icon">
        <span class="action-text">Check for Sync Updates</span>
        <img src="/assets/image/4283_657.svg" alt="Arrow Right" class="action-arrow">
      </div>
    </section>

    <!-- Info -->
    <section id="section-info">
      <div class="info-list">
        <div class="info-item">
          <div class="info-label">App Version</div>
          <div class="info-value">{{ appVersion }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Information of Device</div>
          <div class="info-value">{{ deviceInfo }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">UTC</div>
          <div class="info-value">{{ utcTime }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Username</div>
          <div class="info-value">{{ userInfo.username || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Phone</div>
          <div class="info-value">{{ userInfo.phone || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">{{ userInfo.email || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Registration Date</div>
          <div class="info-value">{{ formattedRegistrationDate || '-' }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Referral By</div>
          <div class="info-value">{{ userInfo.referral_by_phone || '-' }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'

const router = useRouter()

const userInfo = ref({
  phone: '',
  referral_by_phone: '',
  root_parent_phone: '',
  username: '',
  email: '',
  registration_date: ''
})

const formattedRegistrationDate = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const utcTime = ref('')
let utcTimer = null

const appVersion = ref('1.11.0, 20260501')

const deviceInfo = ref('Mobile')

const updateUtcTime = () => {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, '0')
  const d = String(now.getUTCDate()).padStart(2, '0')
  const h = String(now.getUTCHours()).padStart(2, '0')
  const min = String(now.getUTCMinutes()).padStart(2, '0')
  const s = String(now.getUTCSeconds()).padStart(2, '0')
  utcTime.value = `${y}-${m}-${d} ${h}:${min}:${s}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

const fetchAccountInfo = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await authAPI.getAccountInfo()
    userInfo.value = response.data
    if (response.data.created_at || response.data.registration_date) {
      formattedRegistrationDate.value = formatDate(response.data.created_at || response.data.registration_date)
    }
  } catch (error) {
    console.error('Error fetching account info:', error)
    errorMessage.value = 'Failed to fetch device information'
  } finally {
    isLoading.value = false
  }
}

const syncUpdates = () => {
  window.location.reload()
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  fetchAccountInfo()
  updateUtcTime()
  utcTimer = setInterval(updateUtcTime, 1000)
})

onBeforeUnmount(() => {
  if (utcTimer) clearInterval(utcTimer)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  -webkit-font-smoothing: antialiased;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 10px;
  position: relative;
  height: 50px;
}

.back-btn {
  position: absolute;
  left: 10px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.back-btn img {
  width: 20px;
  height: 20px;
}

.title {
  font-size: 17px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Logo */
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 31px;
}

.logo-box {
  width: 88px;
  height: 82px;
  background-color: #cfdef5;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-img {
  width: 44px;
  height: 46px;
  object-fit: contain;
}

.app-name {
  margin-top: 8px;
  font-size: 17px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0;
}

/* Actions */
.action-row {
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-top: 27px;
  cursor: pointer;
}

.action-icon {
  width: 25px;
  height: 25px;
  margin-right: 15px;
}

.action-text {
  flex-grow: 1;
  font-size: 15px;
  color: #000000;
  font-weight: 400;
}

.action-arrow {
  width: 20px;
  height: 20px;
}

/* Info */
.info-list {
  padding: 0 10px;
  margin-top: 20px;
}

.info-item {
  padding-bottom: 13px;
  margin-bottom: 8px;
  border-bottom: 1px dotted #999;
}

.info-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.info-label {
  font-size: 15px;
  color: #000000;
  margin-bottom: 4px;
  font-weight: 400;
}

.info-value {
  font-size: 13px;
  color: #737373;
  font-weight: 400;
}
</style>
