<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Kembali">
          <img src="/assets/images/58_125.svg" alt="">
        </button>
        <h1 class="page-title">Profil Saya</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-container">
        <h2 class="hero-title">VIP</h2>
        <p class="hero-subtitle">Nikmati berbagai keuntungan eksklusif untuk member VIP</p>

        <div class="status-card">
          <div class="status-content">
            <div class="status-label">Status Anda</div>
            <div class="status-level">{{ currentLevel }}</div>
            <p class="status-desc">Buka keuntungan eksklusif, prioritas layanan, dan benefit tambahan.</p>
          </div>
          <img class="status-image" src="/assets/images/3f51baafda70ac03a228fd746dca7054e504d89b.png" alt="">
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="section-features">
      <div class="features-container">
        <img src="/assets/images/78a25ede58c960176ffed2fa80e1df82e93169ab.png" alt="VIP Features" class="features-img">
      </div>
    </section>

    <!-- VIP Levels -->
    <section id="section-vip-levels">
      <div class="vip-list">
        <div
          v-for="level in vipLevelCards"
          :key="level.rank"
          class="vip-card"
          :class="{ active: level.isCurrent }"
        >
          <img src="/assets/images/33dd6484afb9e890391e4c5b0548521621a35b4a.png" alt="" class="vip-icon">
          <div class="vip-info">
            <h3 class="vip-name">{{ level.title }}</h3>
            <p class="vip-req-label">Minimal total premi</p>
            <p class="vip-req-amount">{{ level.requiredText }}</p>
          </div>
          <div v-if="level.isCurrent" class="vip-badge">Aktif</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, commissionAPI } from '@/services/api'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()
const accountInfo = ref(null)
const rankStatus = ref(null)
const rankLevels = ref([])
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)

const goBack = () => {
  router.go(-1)
}

const toNumber = (value) => {
  const raw = String(value ?? '').trim()
  if (!raw) return 0
  const n = Number(raw.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const currentLevel = computed(() => {
  const d = rankStatus.value || {}
  const title = String(d.current_title ?? d.currentTitle ?? '').trim()
  if (title) return title
  const n = Math.floor(toNumber(d.current_rank))
  return Number.isFinite(n) && n > 0 ? `VIP-${n}` : 'VIP-0'
})

const currentRankNumber = computed(() => {
  const d = rankStatus.value || {}
  const n = Math.floor(toNumber(d.current_rank))
  return Number.isFinite(n) && n >= 0 ? n : 0
})

const getDefaultTitleByRank = (rank) => {
  const r = Math.floor(toNumber(rank))
  if (!Number.isFinite(r) || r <= 0) return 'VIP-0'
  return `VIP-${r}`
}

const vipLevelCards = computed(() => {
  const list = Array.isArray(rankLevels.value) ? rankLevels.value : []

  if (list.length === 0) {
    // Show default levels 0-4
    return Array.from({ length: 5 }, (_, i) => ({
      rank: i,
      title: `VIP-${i}`,
      requiredText: formatAppCurrency(50000 * (i + 1)),
      isCurrent: i === currentRankNumber.value
    }))
  }

  return list
    .map((level) => {
      const rank = Math.floor(toNumber(level?.rank))
      const safeRank = Number.isFinite(rank) && rank >= 0 ? rank : 0
      const title = String(level?.title || '').trim() || getDefaultTitleByRank(safeRank)
      const deposit = toNumber(level?.deposit_self_total_required)
      const requiredText = deposit > 0 ? formatAppCurrency(deposit) : formatAppCurrency(0)
      const isCurrent = level?.is_current_rank === true || safeRank === currentRankNumber.value

      return {
        rank: safeRank,
        title,
        requiredText,
        isCurrent
      }
    })
    .sort((a, b) => a.rank - b.rank)
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

const fetchRankLevels = async () => {
  try {
    const resp = await authAPI.getRankLevels()
    const raw = Array.isArray(resp?.data) ? resp.data : []
    const byRank = new Map()
    for (const item of raw) {
      const rank = Math.floor(toNumber(item?.rank))
      if (!Number.isFinite(rank) || rank < 0 || rank > 9) continue
      const prev = byRank.get(rank)
      if (!prev) {
        byRank.set(rank, item)
        continue
      }
      const prevReq = toNumber(prev?.deposit_self_total_required)
      const nextReq = toNumber(item?.deposit_self_total_required)
      if (nextReq >= prevReq) {
        byRank.set(rank, item)
      }
    }

    const normalized = []
    for (const [, level] of byRank) {
      normalized.push(level)
    }

    rankLevels.value = normalized
  } catch (_) {
    rankLevels.value = []
  }
}

const refreshSvipData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    await Promise.all([
      fetchAccountInfo(),
      fetchRankStatus(),
      fetchRankLevels()
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  background-color: #fdfaf4;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  padding: 24px 20px;
  gap: 16px;
}

.back-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

/* Hero */
.hero-container {
  padding: 0 20px;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
}

.hero-subtitle {
  font-size: 14px;
  color: #635f5f;
  margin: 0 0 24px 0;
  line-height: 1.4;
  max-width: 85%;
}

.status-card {
  background: linear-gradient(90deg, #f4c142 0%, #f8dd89 46.63%, #f5ca51 100%);
  border-radius: 10px;
  padding: 20px;
  position: relative;
  display: flex;
  min-height: 170px;
  overflow: hidden;
}

.status-content {
  width: 65%;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.status-label {
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 4px;
}

.status-level {
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 12px 0;
}

.status-desc {
  font-size: 12px;
  color: #737373;
  line-height: 1.4;
  margin: 0;
}

.status-image {
  position: absolute;
  right: -10px;
  bottom: -10px;
  width: 149px;
  height: 139px;
  z-index: 1;
  object-fit: contain;
}

/* Features */
.features-container {
  padding: 16px 20px;
}

.features-img {
  width: 100%;
  height: auto;
  display: block;
}

/* VIP Levels */
.vip-list {
  padding: 0 20px 32px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vip-card {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  gap: 16px;
}

.vip-card.active {
  background-color: #fdf5e6;
  border: 1px solid #f3b73f;
  box-shadow: none;
}

.vip-icon {
  width: 64px;
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
}

.vip-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vip-name {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.vip-req-label {
  font-size: 11px;
  color: #635f5f;
  margin: 0;
}

.vip-req-amount {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

.vip-badge {
  background-color: #82c968;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 8px;
  white-space: nowrap;
}
</style>
