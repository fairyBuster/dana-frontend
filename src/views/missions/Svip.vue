<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left" @click="goBack">
        <img src="/assets/image/163_146.svg" alt="Back" class="icon-back">
      </div>
      <h1 class="header-title">VIP</h1>
      <div class="header-right"></div>
    </header>

    <!-- Profile Card Section -->
    <section class="profile-card">
      <!-- User Info -->
      <div class="user-info">
        <div class="avatar-container">
          <img :src="avatarSrc" alt="User Avatar" class="avatar">
        </div>
        <div class="user-details">
          <div class="username-row">
            <span class="username">{{ displayUsername }}</span>
          </div>
          <div class="user-id">ID akun: {{ displayUid }}</div>
          <div class="user-badge">
            <span class="badge-text">{{ currentLevel }}</span>
            <div class="badge-icon">
              <img src="/assets/image/5fb42ec97aec809c1357f284f6344e0829f4ad5e.png" alt="Crown">
            </div>
          </div>
        </div>
      </div>

      <!-- Current Level Banner -->
      <div class="level-banner">
        <img src="/assets/image/5fb42ec97aec809c1357f284f6344e0829f4ad5e.png" alt="Crown Large" class="level-crown-img">
        <span class="level-v-text">{{ currentLevel }}</span>
        <span class="level-right-label">Level Anda saat ini</span>
      </div>

      <!-- Progress Stats -->
      <div class="stats-container">
        <!-- Team Size Progress -->
        <div class="progress-group">
          <div class="progress-label">Ukuran tim Anda saat ini;</div>
          <div class="progress-value">{{ teamSizeText }}</div>
          <div class="progress-track">
            <div class="progress-fill fill-gradient-1" :style="{ width: `${teamProgressPercent}%` }">
              <img src="/assets/image/5fb42ec97aec809c1357f284f6344e0829f4ad5e.png" alt="Marker" class="progress-marker">
            </div>
          </div>
        </div>

        <!-- Deposit Progress -->
        <div class="progress-group">
          <div class="progress-label">Deposito Anda saat ini</div>
          <div class="progress-value">RP {{ formatCurrency(currentDeposit) }}</div>
          <div class="progress-track">
            <div class="progress-fill fill-gradient-2" :style="{ width: `${depositProgressPercent}%` }">
              <img src="/assets/image/5fb42ec97aec809c1357f284f6344e0829f4ad5e.png" alt="Marker" class="progress-marker">
            </div>
          </div>
        </div>

        <!-- Upgrade Info -->
        <div class="upgrade-info">
          <p class="upgrade-title">Untuk upgrade ke {{ nextLevelLabel }} Anda perlu:</p>
          <p class="upgrade-details">Ukuran tim: {{ requiredTeamSize }}<br>Deposito saya: RP {{ formatCurrency(requiredDeposit) }}</p>
        </div>
      </div>
    </section>

    <!-- Level Requirements Table -->
    <section class="level-table-section">
      <h2 class="section-title">Penjelasan Pra-syarat Level</h2>
      
      <div class="level-grid">
        <!-- Header -->
        <div class="grid-header">Level</div>
        <div class="grid-header">Syarat tim</div>
        <div class="grid-header">Syarat deposito</div>
        <div class="grid-header">Hadiah capai</div>
        <div class="grid-header">Subsidi minggu</div>

        <template v-for="row in levelTableRows" :key="row.level">
          <div class="grid-cell">{{ row.level }}</div>
          <div class="grid-cell">{{ row.team }}</div>
          <div class="grid-cell">{{ row.deposit }}</div>
          <div class="grid-cell">{{ row.reward }}</div>
          <div class="grid-cell">{{ row.subsidy }}</div>
        </template>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section">
      <div class="benefits-badge">
        <span>Manfaat VIP</span>
      </div>
      <div class="benefits-text">
        <p>-Saat Anda sudah memenuhi syarat, naik level akan dilakukan secara otomatis</p>
        <p>-Ketika level Anda sudah berubah secara otomatis, ambil hadiah capai Anda ke manajer setempat untuk mengajukan hadiah capai tersebut</p>
        <p>-Ketika level Anda sudah mencapai target dari subsidi, hubungi manajer untuk mengajukan gaji bulanan tetap</p>
         <p>-Membuat banyak akun untuk menipu sistem dilarang, pelanggaran akan dikenai sanksi!</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { avatarSrc } from '@/utils/avatar'
import { authAPI, commissionAPI } from '@/services/api'

const router = useRouter()
const accountInfo = ref(null)
const rankStatus = ref(null)
const downlineStats = ref(null)
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)

const displayUsername = computed(() => {
  const d = accountInfo.value || {}
  const username = String(d.full_name || d.username || d.phone || d.name || '').trim()
  return username || 'Username'
})

const displayUid = computed(() => {
  const d = accountInfo.value || {}
  const uid = d.referral_code ?? d.id ?? d.user_id ?? null
  if (uid === null || uid === undefined || uid === '') return '-'
  return String(uid)
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
  return Number.isFinite(n) ? `V${n}` : 'V0'
})

const nextLevelLabel = computed(() => {
  const d = rankStatus.value || {}
  const title = String(d.next_title || '').trim()
  if (title) return title
  const n = toNumber(d.next_rank)
  if (Number.isFinite(n) && n > 0) return `V${n}`
  return 'level berikutnya'
})

const currentDeposit = computed(() => {
  const d = rankStatus.value || {}
  return toNumber(d.deposit_self_total)
})

const requiredDeposit = computed(() => {
  const d = rankStatus.value || {}
  return toNumber(d.next_required_deposit_self_total)
})

const requiredTeamSize = computed(() => {
  const d = rankStatus.value || {}
  const n = toNumber(d.next_required_downlines_total)
  if (n > 0) return n
  const m = toNumber(d.next_required_downlines_active)
  return m > 0 ? m : 0
})

const teamSize = computed(() => {
  const d = rankStatus.value || {}
  const fromRank = toNumber(
    d.downlines_active ??
    d.downlines_active_total ??
    d.downlines_active_count ??
    d.downlines_effective ??
    d.downlines_members_active
  )
  if (fromRank > 0) return fromRank
  const levels = Array.isArray(downlineStats.value?.levels) ? downlineStats.value.levels : []
  return levels.reduce((acc, l) => {
    const membersArray = Array.isArray(l?.members) ? l.members : null
    const activeFromMembers = membersArray ? membersArray.filter(m => m && m.is_active === true).length : null
    const active =
      activeFromMembers !== null
        ? activeFromMembers
        : toNumber(l?.members_active ?? l?.active_member_count ?? l?.active_members_total ?? 0)
    return acc + active
  }, 0)
})

const teamSizeText = computed(() => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(teamSize.value))

const teamProgressPercent = computed(() => {
  const required = requiredTeamSize.value
  if (!required) return 0
  const pct = (teamSize.value / required) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))
})

const depositProgressPercent = computed(() => {
  const required = requiredDeposit.value
  if (!required) return 0
  const pct = (currentDeposit.value / required) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))
})

const levelTableRows = [
  { level: 'V0', team: '0', deposit: '0', reward: 'Tidak ada hadiah', subsidy: 'Tidak ada subsidi' },
  { level: 'V1', team: '6', deposit: '130000', reward: '15000', subsidy: 'Tidak ada subsidi' },
  { level: 'V2', team: '20', deposit: '130000', reward: '30000', subsidy: 'Tidak ada subsidi' },
  { level: 'V3', team: '35', deposit: '590000', reward: '70000', subsidy: 'Tidak ada subsidi' },
  { level: 'V4', team: '50', deposit: '1540000', reward: '100000', subsidy: 'Tidak ada subsidi' },
  { level: 'V5', team: '80', deposit: '3690000', reward: '100000', subsidy: '100000' },
  { level: 'V6', team: '100', deposit: '3690000', reward: '100000', subsidy: '250000' },
  { level: 'V7', team: '250', deposit: '8240000', reward: '100000', subsidy: '400000' },
  { level: 'V8', team: '400', deposit: '15760000', reward: '400000', subsidy: '700000' },
  { level: 'V9', team: '600', deposit: '16040000', reward: '400000', subsidy: '1000000' },
  { level: 'V10', team: '1000', deposit: '17895000', reward: '1000000', subsidy: '1500000' },
  { level: 'V11', team: '1500', deposit: '21555000', reward: '1000000', subsidy: '3000000' },
  { level: 'V12', team: '2000', deposit: '26605000', reward: '2500000', subsidy: '4000000' },
  { level: 'V13', team: '4000', deposit: '27105000', reward: '3000000', subsidy: '5000000' },
  { level: 'V14', team: '7000', deposit: '35269000', reward: '3500000', subsidy: '6000000' },
  { level: 'V15', team: '10000', deposit: '45469000', reward: '5000000', subsidy: '7500000' }
]

const goBack = () => {
  router.go(-1)
}

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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #050505;
  color: #ffffff;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

/* Container */
.app-container {
  width: 100%;
  max-width: 412px;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  padding-bottom: 40px;
  position: relative;
}

/* Header */
.app-header {
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  padding: 18px 20px 14px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  margin: 0;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.header-right {
  width: 24px;
}

/* Profile Card */
.profile-card {
  background: rgba(29, 33, 56, 0.88);
  margin: 0 20px 20px;
  border-radius: 12px;
  padding: 18px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

.avatar-container {
  width: 74px;
  height: 74px;
  border-radius: 999px;
  padding: 4px;
  background: radial-gradient(circle at 30% 30%, rgba(144, 71, 224, 0.9) 0%, rgba(63, 72, 197, 0.6) 45%, rgba(15, 19, 46, 0.8) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.username {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
}

.user-id {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.user-badge {
  display: flex;
  align-items: center;
  background: rgba(162, 150, 255, 0.25);
  border: 1px solid rgba(162, 150, 255, 0.7);
  border-radius: 999px;
  padding: 2px 8px 2px 8px;
  width: fit-content;
  gap: 4px;
}

.badge-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.badge-icon img {
  width: 12px;
  height: auto;
}

/* Level Banner */
.level-banner {
  background: linear-gradient(90deg, rgba(10, 16, 37, 0.85) 0%, rgba(15, 19, 46, 0.92) 48%, rgba(10, 16, 37, 0.85) 100%);
  border-radius: 12px;
  padding: 12px 14px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  border: 1px solid rgba(116, 106, 154, 0.35);
}

.level-crown-img {
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: auto;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
}

.level-v-text {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.1;
  color: #fff;
  margin-left: 44px;
}

.level-right-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.75);
  font-style: italic;
}

/* Stats Container */
.stats-container {
  background: linear-gradient(180deg, rgba(10, 16, 37, 0.85) 0%, rgba(15, 19, 46, 0.92) 100%);
  border-radius: 12px;
  padding: 14px 14px 12px;
  border: 1px solid rgba(116, 106, 154, 0.35);
}

.progress-group {
  margin-bottom: 12px;
}

.progress-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.2;
}

.progress-value {
  margin-top: 4px;
  margin-bottom: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

.progress-track {
  height: 3px;
  background-color: rgba(116, 106, 154, 0.5);
  border-radius: 999px;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  position: relative;
}

.fill-gradient-1, .fill-gradient-2 {
  background: linear-gradient(270deg, #9047e0 0%, #6135c4 30%, #3f48c5 100%);
}

.progress-marker {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: auto;
}

.upgrade-info {
  margin-top: 8px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.85);
}

.upgrade-title {
  margin-bottom: 4px;
}

.upgrade-details {
  line-height: 1.4;
  opacity: 0.75;
}

/* Level Table */
.level-table-section {
  margin: 0 20px 20px;
}

.section-title {
  font-size: 14px;
  margin-bottom: 10px;
  color: #fff;
}

.level-grid {
  display: grid;
  grid-template-columns: 0.5fr 0.8fr 1.2fr 1fr 1.5fr;
  gap: 0px;
  background-color: transparent;
  font-size: 9px;
  text-align: center;
  color: #fff;
}

.grid-header {
  background-color: #746a9a;
  padding: 8px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0px;
}

.grid-cell {
  padding: 8px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Benefits */
.benefits-section {
  margin: 0 20px;
}

.benefits-badge {
  background: linear-gradient(90deg, #746a9a 0%, #272434 100%);
  display: inline-block;
  padding: 6px 15px;
  border-radius: 0 15px 15px 0;
  margin-bottom: 15px;
  margin-left: -20px;
  padding-left: 20px;
}

.benefits-badge span {
  font-size: 14px;
  font-weight: 600;
}

.benefits-text {
  font-size: 11px;
  line-height: 1.6;
  color: #e0e0e0;
}

.benefits-text p {
  margin-bottom: 8px;
}
</style>
