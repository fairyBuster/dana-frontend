<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <button class="back-button" type="button" @click="goBack" aria-label="Kembali">
          <img src="/assets/images/2023_1661.svg" alt="Back Icon">
        </button>
        <div class="header-info">
          <h1 class="greeting">Hai, {{ displayUsername }}</h1>
          <p class="level-info">Level saat ini: <span class="level-badge">{{ currentLevel }}</span></p>
        </div>
        <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Trivex Logo" class="header-logo">
      </header>
    </section>

    <section id="section-profile-data">
      <div class="data-card">
        <div class="card-header">
          <img src="/assets/images/28513e18289d675dfcb2092e17ef5f318ad3ee70.png" alt="Shield Icon" class="card-icon">
          <h2 class="card-title">Data Saya</h2>
        </div>
        <div class="data-list">
          <div class="data-item">
            <div class="data-label">Username</div>
            <div class="data-value">{{ displayUsername }}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Nomor ponsel</div>
            <div class="data-value">{{ displayPhone }}</div>
          </div>
          <div class="data-item">
            <div class="data-label">Atasan saya</div>
            <div class="data-value">{{ supervisor }}</div>
          </div>
          <div class="data-item no-border">
            <div class="data-label">Tanggal pendaftaran</div>
            <div class="data-value">{{ joinDate }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'

const router = useRouter()
const accountInfo = ref(null)
const rankStatus = ref(null)

const goBack = () => {
  router.go(-1)
}

const toNumber = (v) => {
  const n = Number(String(v ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const displayUsername = computed(() => {
  const d = accountInfo.value || {}
  const username = String(d.username || d.full_name || d.name || '').trim()
  return username || '-'
})

const displayPhone = computed(() => {
  const d = accountInfo.value || {}
  const p = String(d.phone || d.phone_number || d.user_phone || '').trim()
  if (!p) return '-'
  const digits = p.replace(/\D/g, '')
  if (digits.length <= 6) return p
  const headLen = Math.min(4, Math.max(1, digits.length - 4))
  const tailLen = 4
  const head = digits.slice(0, headLen)
  const tail = digits.slice(-tailLen)
  const masked = `${head}${'*'.repeat(Math.max(0, digits.length - headLen - tailLen))}${tail}`
  return p.startsWith('+') ? `+${masked}` : masked
})

const currentLevel = computed(() => {
  const d = rankStatus.value || {}
  const title = String(d.current_title || '').trim()
  if (title) return title
  const n = toNumber(d.current_rank)
  return Number.isFinite(n) ? `LV${n}` : 'LV0'
})

const supervisor = computed(() => {
  const d = accountInfo.value || {}
  const s = String(d.referral_by_phone || d.upline || d.parent_phone || d.referrer_phone || '').trim()
  if (!s) return '-'
  const digits = s.replace(/\D/g, '')
  if (digits.length <= 6) return s
  const headLen = Math.min(4, Math.max(1, digits.length - 4))
  const tailLen = 4
  const head = digits.slice(0, headLen)
  const tail = digits.slice(-tailLen)
  const masked = `${head}${'*'.repeat(Math.max(0, digits.length - headLen - tailLen))}${tail}`
  return s.startsWith('+') ? `+${masked}` : masked
})

const joinDate = computed(() => {
  const raw = accountInfo.value?.created_at || null
  if (!raw) return '-'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\./g, '/')
})

const fetchAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    accountInfo.value = resp?.data || null
  } catch (_) {
    accountInfo.value = null
  }
}

const fetchRankStatus = async () => {
  try {
    const resp = await authAPI.getRankStatus()
    rankStatus.value = resp?.data || null
  } catch (_) {
    rankStatus.value = null
  }
}

onMounted(() => {
  Promise.all([fetchAccountInfo(), fetchRankStatus()])
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  min-height: 100vh;
  background: linear-gradient(180deg, #0a4345 0%, #0b6563 100%);
  display: flex;
  flex-direction: column;
  position: relative;
}

* {
  box-sizing: border-box;
}

h1, h2, p {
  margin: 0;
}

/* Header Section */
.app-header {
  display: flex;
  gap: 0px;
  align-items: flex-start;
  padding: 28px 10px;
}

.back-button {
  width: 35px;
  height: 35px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.back-button img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.greeting {
  color: #ffffff;
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.level-info {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  margin: 0;
}

.level-badge {
  color: #de6f00;
  font-weight: 700;
  font-size: 16px;
}

.header-logo {
  height: 32px;
  object-fit: contain;
  border-radius: 50px;
  margin-left: auto;
}

/* Profile Data Section */
#section-profile-data {
  padding: 10px 20px 30px 20px;
  flex: 1;
}

.data-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 24px 20px;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  gap: 12px;
}

.card-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.card-title {
  color: #121212;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

.data-list {
  display: flex;
  flex-direction: column;
}

.data-item {
  padding: 14px 0;
  border-bottom: 1px solid rgba(5, 5, 5, 0.15);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.data-item.no-border {
  border-bottom: none;
  padding-bottom: 0;
}

.data-label {
  font-size: 12px;
  color: #555555;
}

.data-value {
  font-size: 15px;
  color: #121212;
  font-weight: 600;
}
</style>
