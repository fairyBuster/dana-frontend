<template>
  <div class="app-container">
    <section id="section-header">
      <div class="section-inner">
        <header class="header-content">
          <button class="back-button" type="button" @click="goBack" aria-label="Kembali">
            <img src="/assets/images/2023_1661.svg" alt="Back Icon">
          </button>
          <div class="user-info">
            <h1 class="greeting">Hai, {{ displayUsername }}</h1>
            <div class="level-status">
              <span class="level-label">Level saat ini:</span>
              <span class="level-value">{{ currentLevel }}</span>
            </div>
          </div>
          <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Trivex Logo" class="logo">
        </header>
      </div>
    </section>

    <section id="section-level-list">
      <div class="section-inner">
        <div class="level-cards-container">
          <div
            v-for="level in rankLevels"
            :key="level.rank"
            class="level-card"
            :class="{ 'current-rank': level.is_current_rank, 'locked': !level.is_unlocked }"
          >
            <div class="card-header">
              <img src="/assets/images/35c8b6a18c2ca182842dd2334e0d97ca5f0a270c.png" alt="Level Icon" class="level-icon">
              <div class="level-title-group">
                <span class="level-subtitle">Level anggota</span>
                <span class="level-title">{{ level.title }}</span>
              </div>
              <div v-if="level.is_current_rank" class="current-badge">Level Anda</div>
            </div>
            <div class="card-body">
              <div class="requirement-item">
                <p class="requirement">Syarat isi ulang: Rp {{ formatCurrency(level.deposit_self_total_required) }}</p>
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: Math.min(100, (toNumber(level.user_progress_deposit_self_total) / toNumber(level.deposit_self_total_required)) * 100) + '%' }"></div>
                </div>
                <p class="progress-text">Progres: Rp {{ formatCurrency(level.user_progress_deposit_self_total) }} / Rp {{ formatCurrency(level.deposit_self_total_required) }}</p>
              </div>

              <div v-if="toNumber(level.downlines_total_required) > 0" class="requirement-item">
                <p class="requirement">Syarat total bawahan: {{ level.downlines_total_required }}</p>
                <p class="progress-text">Progres: {{ level.user_progress_downlines_total }} / {{ level.downlines_total_required }}</p>
              </div>

              <div v-if="toNumber(level.missions_required_total) > 0" class="requirement-item">
                <p class="requirement">Syarat total misi: {{ level.missions_required_total }}</p>
                <p class="progress-text">Progres: {{ level.user_progress_missions }} / {{ level.missions_required_total }}</p>
              </div>
            </div>
            <div class="card-footer" v-if="!level.is_unlocked">
              <span class="lock-status">Belum Terbuka</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, commissionAPI } from '@/services/api'

const router = useRouter()
const accountInfo = ref(null)
const rankStatus = ref(null)
const rankLevels = ref([])
const downlineStats = ref(null)
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)

const goBack = () => {
  router.go(-1)
}

const displayUsername = computed(() => {
  const d = accountInfo.value || {}
  const username = String(d.username || d.username || d.phone || d.name || '').trim()
  return username || 'Username'
})

const toNumber = (value) => {
  const raw = String(value ?? '').trim()
  if (!raw) return 0
  const n = Number(raw.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const currentLevel = computed(() => {
  const d = rankStatus.value || {}
  const title = String(d.current_title || '').trim()
  if (title) return title
  const n = toNumber(d.current_rank)
  return Number.isFinite(n) ? `LV${n}` : 'LV0'
})

const currentDeposit = computed(() => {
  const d = rankStatus.value || {}
  return toNumber(d.deposit_self_total)
})

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

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

const fetchRankLevels = async () => {
  try {
    const resp = await authAPI.getRankLevels()
    rankLevels.value = Array.isArray(resp?.data) ? resp.data : []
  } catch (_) {
    rankLevels.value = []
  }
}

const fetchDownlineStats = async () => {
  try {
    const resp = await commissionAPI.getDownlineStats()
    downlineStats.value = resp?.data || null
  } catch (_) {
    downlineStats.value = null
  }
}

const refreshSvipData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    await Promise.all([
      fetchAccountInfo(),
      fetchRankStatus(),
      fetchRankLevels(),
      fetchDownlineStats()
    ])
  } finally {
    lastRefreshedAt.value = Date.now()
    isRefreshing.value = false
  }
}

onMounted(() => {
  refreshSvipData()
})

onActivated(() => {
  const now = Date.now()
  if (now - lastRefreshedAt.value < 300) return
  refreshSvipData()
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, #0a4345 0%, #0b6563 100%);
  min-height: 100vh;
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

h1, h2, p {
  margin: 0;
}

.section-inner {
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  padding: 0 10px;
}

/* Header Section */
#section-header {
  padding-top: 28px;
  padding-bottom: 40px;
}

.header-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
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

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.greeting {
  margin: 0;
  color: #ffffff;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
}

.level-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.level-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.level-value {
  color: #de6f00;
  font-size: 14px;
  font-weight: 700;
}

.logo {
  width: 100px;
  height: 32px;
  object-fit: contain;
  border-radius: 50px;
  margin-left: auto;
}

/* Level List Section */
#section-level-list {
  padding-bottom: 40px;
}

.level-cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level-card {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.level-card.current-rank {
  background: linear-gradient(135deg, rgba(222, 111, 0, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%);
  border: 1px solid rgba(222, 111, 0, 0.5);
}

.level-card.locked {
  opacity: 0.8;
  filter: grayscale(0.5);
}

.current-badge {
  background-color: #de6f00;
  color: #ffffff;
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 700;
  margin-left: auto;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.level-icon {
  width: 39px;
  height: 39px;
  object-fit: contain;
}

.level-title-group {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.level-subtitle {
  color: #ffffff;
  font-size: 11px;
  opacity: 0.9;
}

.level-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.requirement-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.requirement {
  margin: 0;
  color: #ffffff;
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.9;
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin: 4px 0;
}

.progress-bar {
  height: 100%;
  background-color: #de6f00;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  margin: 0;
  color: #ffbd7b;
  font-size: 10px;
  font-weight: 600;
}

.card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 10px;
  text-align: center;
}

.lock-status {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
}
</style>
