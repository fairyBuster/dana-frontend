<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <img src="/assets/images/61_330.svg" alt="" class="icon-back" @click="goBack">
        <h1 class="header-title">Challenge</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-container">
        <div class="hero-content">
          <h2 class="hero-title">Misi Undang<br>Teman</h2>
          <p class="hero-desc">Selesaikan challenge undangan dan raih bonus tambahan.</p>
        </div>
        <img src="/assets/images/f462977532c9ff3d01b3c239760208eb37fc3160.png" alt="" class="hero-image">
      </div>
    </section>

    <!-- Stats -->
    <section id="section-stats">
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <img src="/assets/images/62_344.svg" class="bg-ellipse" alt="">
            <img src="/assets/images/62_347.svg" class="fg-icon" alt="">
          </div>
          <div class="stat-label">Total Undangan</div>
          <div class="stat-value">{{ totalInvites }}</div>
          <div class="stat-sub">teman tim pertama</div>
        </div>
        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <img src="/assets/images/62_345.svg" class="bg-ellipse" alt="">
            <img src="/assets/images/62_378.svg" class="fg-icon" alt="">
          </div>
          <div class="stat-label">Challenge Selesai</div>
          <div class="stat-value">{{ completedCount }}</div>
          <div class="stat-sub">tantangan</div>
        </div>
        <div class="stat-item">
          <div class="stat-icon-wrapper">
            <img src="/assets/images/62_346.svg" class="bg-ellipse" alt="">
            <img src="/assets/images/62_402.svg" class="fg-icon" alt="">
          </div>
          <div class="stat-label">Bonus Challenge Terkumpul</div>
          <div class="stat-value">{{ totalBonusText }}</div>
          <div class="stat-sub">Total bonus terkumpul</div>
        </div>
      </div>
    </section>

    <!-- Invite Link -->
    <section id="section-invite">
      <div class="invite-card">
        <div class="invite-header">
          <div class="icon-wrapper">
            <img src="/assets/images/62_370.svg" alt="">
          </div>
          <h3 class="invite-title">Link Undangan</h3>
        </div>
        <div class="invite-actions">
          <div class="input-box">{{ inviteLink }}</div>
          <button class="btn-action btn-copy" @click="copyLink">
            <img src="/assets/images/62_365.svg" alt="">
          </button>
          <button class="btn-action btn-share" @click="shareLink">
            <img src="/assets/images/62_363.svg" alt="">
          </button>
        </div>
        <div class="invite-code-wrapper">
          <div class="invite-code">
            Kode undangan: <span class="highlight">{{ inviteCode }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Rewards -->
    <section id="section-rewards">
      <div class="rewards-card">
        <h3 class="rewards-title">Hadiah Challenge</h3>
        <div class="rewards-grid">
          <template v-for="(mission, idx) in sortedMissions" :key="mission.id">
            <div class="reward-item">
              <div class="reward-header">
                <img src="/assets/images/62_419.svg" alt="">
                <span>{{ getMissionLabel(mission) }}</span>
              </div>
              <div class="reward-amount">{{ formatCurrency(mission.reward) }}</div>
              <div v-if="isMissionCompleted(mission)" class="reward-status success">
                <div class="status-dot"></div> Tercapai
              </div>
              <div v-else class="reward-progress">
                <div class="progress-text">{{ getMissionProgressText(mission) }}</div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" :style="{ width: getMissionProgressPercent(mission) + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-if="idx < sortedMissions.length - 1 && (idx + 1) % 3 !== 0" class="arrow-wrapper">
              <img src="/assets/images/62_434.svg" alt="">
            </div>
          </template>

          <div v-if="!sortedMissions.length" class="empty-state">
            <p>Belum ada challenge tersedia</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer">
      <button
        class="btn-claim"
        :disabled="!hasClaimable || isClaiming"
        @click="claimNextMission"
      >
        {{ isClaiming ? 'Mengklaim...' : 'Klaim Hadiah' }}
      </button>
    </section>
  </div>

  <SuccessModal v-model="successModalOpen" :message="successMessage" />
  <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, missionAPI, commissionAPI } from '@/services/api'
import SuccessModal from '@/components/modals/AppSuccessModal.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()

const accountInfo = ref(null)
const rankStatus = ref(null)
const missions = ref([])
const downlineStats = ref(null)
const isClaiming = ref(false)
const successModalOpen = ref(false)
const successMessage = ref('')
const errorModalOpen = ref(false)
const errorMessage = ref('')

const goBack = () => {
  router.go(-1)
}

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value) => {
  const num = toNumber(value)
  const hasFraction = Math.abs(num % 1) > 1e-9
  return formatAppCurrency(num, { decimals: hasFraction ? 2 : 0 })
}

// Stats
const totalInvites = computed(() => {
  const d = downlineStats.value || accountInfo.value || {}
  return toNumber(d.total_downlines ?? d.downlines_total ?? d.total_referrals ?? 0)
})

const completedCount = computed(() => {
  return sortedMissions.value.filter(m => isMissionCompleted(m)).length
})

const totalBonusText = computed(() => {
  const total = sortedMissions.value
    .filter(m => isMissionCompleted(m))
    .reduce((acc, m) => acc + toNumber(m.reward), 0)
  return formatCurrency(total)
})

// Invite
const inviteCode = computed(() => {
  const d = accountInfo.value || {}
  return String(d.referral_code || d.invite_code || d.id || '').trim() || '-'
})

const inviteLink = computed(() => {
  const code = inviteCode.value
  if (!code || code === '-') return '-'
  const base = window.location.origin
  return `${base}/#/invite/${code}`
})

const copyLink = () => {
  if (!inviteLink.value || inviteLink.value === '-') return
  navigator.clipboard.writeText(inviteLink.value).catch(() => {})
}

const shareLink = async () => {
  if (!inviteLink.value || inviteLink.value === '-') return
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Dana Proteksi', text: 'Gabung sekarang!', url: inviteLink.value })
    } catch (_) {}
  } else {
    copyLink()
  }
}

// Missions
const isMissionRepeatable = (mission) => Boolean(mission?.is_repeatable)

const isMissionCompleted = (mission) => {
  if (isMissionRepeatable(mission)) return false
  return Boolean(mission?.claimed)
}

const isMissionCurrentlyClaimable = (mission) => {
  if (!mission) return false
  if (!Boolean(mission?.can_claim)) return false
  if (!Boolean(mission?.claimed)) return true
  return isMissionRepeatable(mission)
}

const normalizeMissionsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const getMissionProgress = (mission) => {
  return toNumber(mission?.progress_amount ?? mission?.progress ?? 0)
}

const getMissionRequirement = (mission) => {
  return toNumber(mission?.requirement_amount ?? mission?.requirement ?? mission?.target_amount ?? 0)
}

const getMissionCurrent = (mission) => {
  const req = getMissionRequirement(mission)
  if (req <= 0) return getMissionProgress(mission)
  const rawRemaining = mission?.remaining
  const hasRemaining = rawRemaining !== null && rawRemaining !== undefined && rawRemaining !== ''
  if (hasRemaining) {
    const rem = toNumber(rawRemaining)
    if (Number.isFinite(rem)) return Math.min(req, Math.max(0, req - rem))
  }
  return Math.min(req, Math.max(0, getMissionProgress(mission)))
}

const getMissionProgressPercent = (mission) => {
  const req = getMissionRequirement(mission)
  if (req <= 0) return 0
  const curr = getMissionCurrent(mission)
  return Math.min(100, Math.round((curr / req) * 100))
}

const getMissionProgressText = (mission) => {
  const req = getMissionRequirement(mission)
  if (req <= 0) return String(getMissionCurrent(mission))
  return `${getMissionCurrent(mission)}/${req}`
}

const getMissionLabel = (mission) => {
  const req = getMissionRequirement(mission)
  if (req > 0) return `${req} Teman`
  const title = String(mission?.title || '').trim()
  return title || 'Challenge'
}

const getMissionRemaining = (mission) => {
  const fromApi = toNumber(mission?.remaining)
  if (fromApi > 0) return fromApi
  const req = getMissionRequirement(mission)
  const prog = getMissionProgress(mission)
  if (req <= 0) return 0
  return Math.max(0, req - prog)
}

const hasClaimable = computed(() => {
  return sortedMissions.value.some(m => isMissionCurrentlyClaimable(m))
})

const sortedMissions = computed(() => {
  const list = Array.isArray(missions.value) ? [...missions.value] : []
  list.sort((a, b) => {
    const aCompleted = isMissionCompleted(a)
    const bCompleted = isMissionCompleted(b)
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1

    const aCan = isMissionCurrentlyClaimable(a)
    const bCan = isMissionCurrentlyClaimable(b)
    if (aCan !== bCan) return aCan ? -1 : 1

    const ar = getMissionRemaining(a)
    const br = getMissionRemaining(b)
    if (ar !== br) return ar - br

    const reqA = getMissionRequirement(a)
    const reqB = getMissionRequirement(b)
    if (reqA !== reqB) return reqA - reqB

    return Number(a?.id ?? 0) - Number(b?.id ?? 0)
  })
  return list
})

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, silakan coba lagi'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Permintaan gagal, silakan coba lagi'
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

const fetchMissions = async () => {
  errorModalOpen.value = false
  errorMessage.value = ''
  try {
    const resp = await missionAPI.getMissions()
    missions.value = normalizeMissionsResponse(resp?.data)
  } catch (err) {
    missions.value = []
    errorMessage.value = extractErrorMessage(err)
    errorModalOpen.value = true
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

const claimNextMission = async () => {
  if (isClaiming.value) return
  const mission = sortedMissions.value.find(m => isMissionCurrentlyClaimable(m))
  if (!mission?.id) return

  isClaiming.value = true
  errorModalOpen.value = false
  errorMessage.value = ''
  try {
    const resp = await missionAPI.claimMission(mission.id)
    const data = resp?.data || {}
    const amount = toNumber(data.reward_amount ?? data.reward ?? mission.reward)
    successMessage.value = `Berhasil mengklaim ${formatCurrency(amount)}`
    successModalOpen.value = true
    await fetchMissions()
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    errorModalOpen.value = true
  } finally {
    isClaiming.value = false
  }
}

onMounted(() => {
  Promise.all([fetchAccountInfo(), fetchRankStatus(), fetchMissions(), fetchDownlineStats()])
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
  max-width: 412px;
  background-color: #fdfaf4;
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px;
  overflow-x: hidden;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
#section-header .app-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  gap: 16px;
}

.icon-back {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
}

/* Hero */
#section-hero .hero-container {
  position: relative;
  padding: 10px 24px 30px;
  min-height: 160px;
}

.hero-content {
  width: 60%;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  line-height: 1.2;
  margin-bottom: 8px;
}

.hero-desc {
  font-size: 12px;
  color: #635f5f;
  line-height: 1.4;
  max-width: 180px;
}

.hero-image {
  position: absolute;
  right: 0;
  top: 0;
  width: 210px;
  z-index: 1;
}

/* Stats */
#section-stats {
  padding: 0 20px;
  margin-bottom: 20px;
}

.stats-card {
  background: linear-gradient(90deg, #f4c142 0%, #f8dd89 46.63%, #f5ca51 100%);
  border-radius: 10px;
  padding: 16px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 4px;
}

.stat-icon-wrapper {
  position: relative;
  width: 36px;
  height: 36px;
  margin-bottom: 8px;
}

.bg-ellipse {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.fg-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
}

.stat-label {
  font-size: 10px;
  color: #000000;
  font-weight: 600;
  margin-bottom: 4px;
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2px;
}

.stat-sub {
  font-size: 9px;
  color: #4e4e4e;
}

/* Invite Link */
#section-invite {
  padding: 0 20px;
  margin-bottom: 20px;
}

.invite-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
}

.invite-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.icon-wrapper {
  background-color: #fcf2dd;
  border-radius: 5px;
  width: 32px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper img {
  width: 16px;
  height: 16px;
}

.invite-title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.invite-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.input-box {
  flex: 1;
  border: 0.5px solid #9a9a9a;
  border-radius: 5px;
  padding: 0 12px;
  font-size: 12px;
  color: #000000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 30px;
}

.btn-action {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  border: none;
}

.btn-copy {
  background-color: transparent;
  border: 0.5px solid #9a9a9a !important;
}

.btn-share {
  background-color: #f3b73f;
}

.btn-action img {
  width: 16px;
  height: 16px;
}

.invite-code-wrapper {
  display: flex;
}

.invite-code {
  background-color: #fdfaf5;
  border: 0.5px solid #dadada;
  border-radius: 5px;
  padding: 4px 12px;
  font-size: 12px;
  color: #000000;
}

.highlight {
  color: #f3b73f;
  font-weight: 600;
}

/* Rewards */
#section-rewards {
  padding: 0 20px;
}

.rewards-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px 16px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
}

.rewards-title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16px;
}

.rewards-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  gap: 16px 4px;
  align-items: center;
}

.reward-item {
  background-color: #fcf9ee;
  border: 1px solid #e6d2aa;
  border-radius: 10px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  justify-content: space-between;
}

.reward-header {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #000000;
}

.reward-header img {
  width: 16px;
  height: 16px;
}

.reward-amount {
  font-size: 13px;
  font-weight: 700;
  color: #000000;
}

.reward-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
}

.reward-status.success {
  color: #008332;
}

.status-dot {
  width: 12px;
  height: 12px;
  background-color: #00b144;
  border-radius: 50%;
}

.reward-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.progress-text {
  font-size: 10px;
  color: #000000;
}

.progress-bar-bg {
  width: 100%;
  height: 5px;
  background-color: #cfcfcf;
  border-radius: 20px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: #f3b73f;
  border-radius: 20px;
  transition: width 0.3s ease;
}

.arrow-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-wrapper img {
  width: 16px;
  height: 16px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 20px;
  color: #737373;
  font-size: 13px;
}

/* Footer */
#section-footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  padding: 20px;
  background-color: #fdfaf4;
  z-index: 10;
}

.btn-claim {
  width: 100%;
  background-color: #976709;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.2s ease;
}

.btn-claim:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-claim:not(:disabled):active {
  opacity: 0.85;
}
</style>
