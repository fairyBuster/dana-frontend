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
          v-for="(level, idx) in displayRankLevels"
          :key="level.rank"
          class="tier-card"
        >
          <img :src="getTierBg(level)" alt="LV Background" class="tier-bg">
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
        <div class="vip-table">
          <div class="vip-row vip-header">
            <div class="vip-cell">Very Important Person</div>
            <div class="vip-cell">Collection Downline</div>
            <div class="vip-cell">Daily Sign</div>
            <div class="vip-cell">Commision Upgrade</div>
          </div>

          <div v-for="row in svipRows" :key="row.rank" class="vip-row">
            <div class="vip-cell">
              <div>If you</div>
              <div class="vip-blue">{{ row.lv }}</div>
            </div>
            <div class="vip-cell">
              <div>Collection</div>
              <div class="vip-blue">{{ row.downlines }} people</div>
            </div>
            <div class="vip-cell">
              <div>Everyday</div>
              <div class="vip-blue">{{ formatAppCurrency(row.dailySign, { decimals: 2 }) }}</div>
            </div>
            <div class="vip-cell">
              <div>Got <span class="vip-blue">{{ formatAppCurrency(row.upgrade, { decimals: 0 }) }}</span></div>
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
import { formatAppCurrency } from '@/utils/settings'

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
  const title = String(d.current_title ?? d.currentTitle ?? '').trim()
  if (title) return title
  const n = Math.floor(toNumber(d.current_rank))
  return Number.isFinite(n) ? `LV${n}` : 'LV0'
})

const progressPercent = computed(() => {
  const d = rankStatus.value || {}
  const nextRequiredDeposit = toNumber(d.next_required_deposit_self_total)
  const nextRequiredDownlinesActive = toNumber(d.next_required_downlines_active)
  const nextRequiredDownlinesTotal = toNumber(d.next_required_downlines_total)
  const nextRequiredMissions = toNumber(d.next_required_missions)

  const currentDeposit = toNumber(d.deposit_self_total)
  const currentDownlinesActive = toNumber(d.downlines_active)
  const currentDownlinesTotal = toNumber(d.downlines_total)
  const currentMissions = toNumber(d.completed_missions)

  let current = 0
  let required = 0

  if (nextRequiredDeposit > 0) {
    current = currentDeposit
    required = nextRequiredDeposit
  } else if (nextRequiredDownlinesActive > 0) {
    current = currentDownlinesActive
    required = nextRequiredDownlinesActive
  } else if (nextRequiredDownlinesTotal > 0) {
    current = currentDownlinesTotal
    required = nextRequiredDownlinesTotal
  } else if (nextRequiredMissions > 0) {
    current = currentMissions
    required = nextRequiredMissions
  } else {
    return 0
  }

  if (required <= 0) return 0
  return Math.min(100, (current / required) * 100)
})

const progressCurrent = computed(() => {
  const d = rankStatus.value || {}
  const nextRequiredDeposit = toNumber(d.next_required_deposit_self_total)
  const nextRequiredDownlinesActive = toNumber(d.next_required_downlines_active)
  const nextRequiredDownlinesTotal = toNumber(d.next_required_downlines_total)
  const nextRequiredMissions = toNumber(d.next_required_missions)

  if (nextRequiredDeposit > 0) return toNumber(d.deposit_self_total)
  if (nextRequiredDownlinesActive > 0) return toNumber(d.downlines_active)
  if (nextRequiredDownlinesTotal > 0) return toNumber(d.downlines_total)
  if (nextRequiredMissions > 0) return toNumber(d.completed_missions)
  return 0
})

const progressTotal = computed(() => {
  const nextLevel = rankLevels.value.find(l => !l.is_current_rank && l.is_unlocked) || rankLevels.value[0]
  if (!nextLevel) return 0

  const d = rankStatus.value || {}
  const nextRequiredDeposit = toNumber(d.next_required_deposit_self_total)
  const nextRequiredDownlinesActive = toNumber(d.next_required_downlines_active)
  const nextRequiredDownlinesTotal = toNumber(d.next_required_downlines_total)
  const nextRequiredMissions = toNumber(d.next_required_missions)

  if (nextRequiredDeposit > 0) return nextRequiredDeposit
  if (nextRequiredDownlinesActive > 0) return nextRequiredDownlinesActive
  if (nextRequiredDownlinesTotal > 0) return nextRequiredDownlinesTotal
  if (nextRequiredMissions > 0) return nextRequiredMissions
  return 0
})

const DAILY_SIGN_BY_LEVEL = Object.freeze({
  0: 0.03,
  1: 0.05,
  2: 0.1,
  3: 0.2,
  4: 0.4,
  5: 0.5,
  6: 0.8,
  7: 2,
  8: 10
})

const UPGRADE_BY_LEVEL = Object.freeze({
  0: 0,
  1: 1,
  2: 3,
  3: 10,
  4: 20,
  5: 30,
  6: 50,
  7: 100,
  8: 500
})

const getLevelNumberFromTitle = (title, rank) => {
  const t = String(title || '').trim()
  const digits = t.replace(/[^0-9]/g, '')
  if (digits) {
    const n = Number.parseInt(digits, 10)
    if (Number.isFinite(n)) return n
  }
  const r = Math.floor(toNumber(rank))
  return Number.isFinite(r) ? Math.max(0, r - 1) : 0
}

const getDefaultTitleByRank = (rank) => {
  const r = Math.floor(toNumber(rank))
  if (!Number.isFinite(r) || r <= 0) return 'LV0'
  if (r === 1) return 'LV0'
  return `LV${String(r - 1).padStart(2, '0')}`
}

const displayRankLevels = computed(() => {
  const list = Array.isArray(rankLevels.value) ? rankLevels.value : []
  return list.filter((level) => {
    const title = String(level?.title || '').trim()
    const levelNum = getLevelNumberFromTitle(title, level?.rank)
    return levelNum >= 1 && levelNum <= 8
  })
})

const svipRows = computed(() => {
  const baseList = displayRankLevels.value.length
    ? displayRankLevels.value
    : Array.from({ length: 9 }, (_, i) => ({ rank: i + 1, title: getDefaultTitleByRank(i + 1), downlines_active_required: 0 }))

  return baseList
    .map((level) => {
      const rank = Math.floor(toNumber(level?.rank))
      const safeRank = Number.isFinite(rank) && rank > 0 ? rank : 0
      const title = String(level?.title || getDefaultTitleByRank(safeRank)).trim() || getDefaultTitleByRank(safeRank)
      const downlines = Math.floor(toNumber(level?.downlines_active_required ?? level?.downlines_total_required ?? 0))
      const levelNum = getLevelNumberFromTitle(title, safeRank)
      return {
        rank: safeRank,
        lv: title,
        downlines: downlines > 0 ? downlines : 0,
        dailySign: Number(DAILY_SIGN_BY_LEVEL[levelNum] ?? 0),
        upgrade: Number(UPGRADE_BY_LEVEL[levelNum] ?? 0)
      }
    })
    .filter((x) => x.rank > 0)
    .sort((a, b) => a.rank - b.rank)
})

const getTierBg = (level) => {
  const levelNum = getLevelNumberFromTitle(level?.title, level?.rank)
  const clamped = Math.min(8, Math.max(1, Number.isFinite(levelNum) ? levelNum : 1))
  return `/assets/image/level${clamped}.png`
}

const getTierNameClass = (idx) => {
  return idx % 2 === 0 ? 'tier-name-lv1' : 'tier-name-lv2'
}

const getTierDescClass = (idx) => {
  return idx % 2 === 0 ? 'tier-desc-lv1' : 'tier-desc-lv2'
}

const getTierDesc = (level) => {
  const referrals = toNumber(level.downlines_active_required ?? level.downlines_total_required)
  if (referrals > 0) return `Unlock by inviting ${referrals} members`
  const deposit = toNumber(level.deposit_self_total_required)
  if (deposit > 0) return `Unlock by recharging ${formatAppCurrency(deposit, { decimals: 0 })}`
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
      if (!Number.isFinite(rank) || rank < 1 || rank > 9) continue
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
    for (let r = 1; r <= 9; r += 1) {
      const level = byRank.get(r)
      if (level) {
        normalized.push(level)
      } else {
        normalized.push({
          rank: r,
          title: getDefaultTitleByRank(r),
          deposit_self_total_required: 0,
          deposit_self_total: 0,
          downlines_total_required: 0,
          downlines_active_required: 0,
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

.vip-table {
  width: 100%;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
}

.vip-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.vip-cell {
  padding: 12px 6px;
  text-align: center;
  font-size: 11px;
  color: #000000;
  border-right: 1px solid rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  line-height: 1.2;
}

.vip-row:last-child .vip-cell {
  border-bottom: none;
}

.vip-cell:last-child {
  border-right: none;
}

.vip-header .vip-cell {
  font-size: 10px;
  font-weight: 600;
  background: #fafafa;
}

.vip-blue {
  color: #1b46f5;
  font-weight: 700;
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
