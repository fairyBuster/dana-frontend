<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/4249_729.svg" alt="">
        </button>
        <h1 class="title">Very Important Person</h1>
      </header>
    </section>

    <!-- Tier Cards (horizontal scroll) -->
    <section id="section-tiers">
      <div class="tiers-container">
        <div
          v-for="(level, idx) in rankLevels"
          :key="level.rank"
          class="tier-card"
        >
          <img :src="getTierBg(level.rank)" alt="LV Background" class="tier-bg">
          <div class="tier-content">
            <div class="tier-name" :class="getTierNameClass(idx)">{{ level.title || `LV${level.rank}` }}</div>
            <div class="tier-desc" :class="getTierDescClass(idx)">{{ getTierDesc(level) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Progress Banner -->
    <section id="section-progress">
      <div class="progress-banner">
        <img src="/assets/image/d0e10a0dbf286808cb8fb9c02f1cd15da31de7e1.png" alt="Progress Background" class="progress-bg">
        <div class="progress-content">
          <div class="progress-level">{{ currentLevel }}</div>
          <div class="progress-track">
            <span class="progress-label">Your Progress</span>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
              <div class="progress-bar-dot" :style="{ left: progressPercent + '%' }"></div>
            </div>
            <span class="progress-value">{{ progressCurrent }}/{{ progressTotal }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Card -->
    <section id="section-content">
      <div class="content-card">
        <div v-for="(level, idx) in rankLevels" :key="'c-' + level.rank" class="content-row">
          <p class="content-text-bold">{{ level.title || `LV${level.rank}` }}</p>
          <p class="content-text-regular">
            <span>Recharge: ${{ formatUSD(level.deposit_self_total_required) }}</span>
            <template v-if="toNumber(level.downlines_total_required) > 0">
              <span class="content-sep">|</span>
              <span>Referrals: {{ level.downlines_total_required }}</span>
            </template>
            <template v-if="toNumber(level.missions_required_total) > 0">
              <span class="content-sep">|</span>
              <span>Missions: {{ level.missions_required_total }}</span>
            </template>
          </p>
          <div v-if="idx < rankLevels.length - 1" class="content-divider"></div>
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
  const username = String(d.username || d.phone || d.name || '').trim()
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
  const n = Math.floor(toNumber(d.current_rank))
  return Number.isFinite(n) ? `LV${n}` : 'LV0'
})

const progressPercent = computed(() => {
  const d = rankStatus.value || {}
  const current = toNumber(d.deposit_self_total)
  const nextLevel = rankLevels.value.find(l => !l.is_current_rank && l.is_unlocked) || rankLevels.value[0]
  if (!nextLevel) return 0
  const required = toNumber(nextLevel.deposit_self_total_required)
  if (required <= 0) return 0
  return Math.min(100, (current / required) * 100)
})

const progressCurrent = computed(() => {
  const d = rankStatus.value || {}
  return toNumber(d.deposit_self_total)
})

const progressTotal = computed(() => {
  const nextLevel = rankLevels.value.find(l => !l.is_current_rank && l.is_unlocked) || rankLevels.value[0]
  if (!nextLevel) return 0
  return toNumber(nextLevel.deposit_self_total_required)
})

const formatUSD = (value) => {
  const num = toNumber(value)
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num)
}

const getTierBg = (rank) => {
  const n = Math.floor(toNumber(rank))
  const clamped = Math.min(8, Math.max(1, Number.isFinite(n) ? n : 1))
  return `/assets/image/lv${clamped}.png`
}

const getTierNameClass = (idx) => {
  return idx % 2 === 0 ? 'tier-name-lv1' : 'tier-name-lv2'
}

const getTierDescClass = (idx) => {
  return idx % 2 === 0 ? 'tier-desc-lv1' : 'tier-desc-lv2'
}

const getTierDesc = (level) => {
  const referrals = toNumber(level.downlines_total_required)
  if (referrals > 0) return `Unlock by inviting ${referrals} members`
  const deposit = toNumber(level.deposit_self_total_required)
  if (deposit > 0) return `Unlock by recharging $${formatUSD(deposit)}`
  return `Level ${level.rank}`
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
    const raw = Array.isArray(resp?.data) ? resp.data : []
    const byRank = new Map()
    for (const item of raw) {
      const rank = Math.floor(toNumber(item?.rank))
      if (!Number.isFinite(rank) || rank < 1 || rank > 8) continue
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
    for (let r = 1; r <= 8; r += 1) {
      const level = byRank.get(r)
      if (level) {
        normalized.push(level)
      } else {
        normalized.push({
          rank: r,
          title: `LV${r}`,
          deposit_self_total_required: 0,
          deposit_self_total: 0,
          downlines_total_required: 0,
          missions_required_total: 0,
          is_unlocked: false,
          is_current_rank: false
        })
      }
    }

    rankLevels.value = normalized
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
* {
  box-sizing: border-box;
}

.app-container {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f8f8f8;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

h1, p {
  margin: 0;
}

/* Header */
#section-header {
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  position: relative;
  padding: 0 16px;
}

.back-btn {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 20px;
  height: 20px;
}

.title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Tiers */
#section-tiers {
  width: 100%;
  margin-top: 8px;
}

.tiers-container {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tiers-container::-webkit-scrollbar {
  display: none;
}

.tier-card {
  position: relative;
  width: 184px;
  height: 116px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
}

.tier-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 0;
}

.tier-content {
  display: none;
}

.tier-name {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
  line-height: 1.2;
}

.tier-desc {
  font-size: 10px;
  font-weight: 400;
  line-height: 1.2;
}

.tier-name-lv1 { color: #a96a04; }
.tier-desc-lv1 { color: #965e06; }
.tier-name-lv2 { color: #fd627b; }
.tier-desc-lv2 { color: #c4001f; }

/* Progress */
#section-progress {
  width: 100%;
  padding: 16px;
}

.progress-banner {
  position: relative;
  width: 100%;
  height: 87px;
  border-radius: 12px;
  overflow: hidden;
}

.progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.progress-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 102px;
  padding-top: 18px;
  padding-right: 16px;
}

.progress-level {
  color: #747474;
  font-size: 14px;
  font-weight: 800;
  font-style: italic;
  margin-bottom: 9px;
  margin-left: 3px;
  line-height: 1;
}

.progress-track {
  background-color: rgba(56, 53, 53, 0.4);
  border-radius: 20px;
  height: 22px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  gap: 8px;
  width: 100%;
  max-width: 211px;
}

.progress-label, .progress-value {
  color: #ffffff;
  font-size: 10px;
  font-weight: 400;
  white-space: nowrap;
}

.progress-bar-container {
  flex: 1;
  height: 9px;
  position: relative;
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #144cdf;
  border-radius: 20px;
  transition: width 0.3s ease;
}

.progress-bar-dot {
  position: absolute;
  top: 0;
  width: 9px;
  height: 9px;
  background-color: #ffffff;
  border-radius: 50%;
  transition: left 0.3s ease;
}

/* Content Card */
#section-content {
  width: 100%;
  padding: 0 16px 24px 16px;
}

.content-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
  min-height: 539px;
  padding: 12px 13px;
  width: 100%;
}

.content-row {
  padding: 8px 0;
}

.content-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin-top: 10px;
}

.content-text-bold {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.content-text-regular {
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

.content-sep {
  margin: 0 6px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
