<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <header class="app-header">
        <button class="btn-back" @click="goBack" aria-label="Go back">
          <img src="/assets/image/358_135.svg" alt="Back">
        </button>
        <h1 class="header-title">Task Hall</h1>
        <div class="header-placeholder"></div>
      </header>
    </section>

    <!-- Hero Section -->
    <section id="section-hero">
      <div class="hero-banner">
        <div class="hero-content">
          <div class="hero-badge">
            <img src="/assets/image/4230_135.svg" alt="Repeatable">
            <span>REPEATABLE TASK</span>
          </div>

          <h2 class="hero-title">Complete, Claim, Repeat</h2>
          <p class="hero-subtitle">Complete the requirements and claim your reward.</p>

          <!-- <div class="hero-progress-wrapper">
            <span class="progress-label">Your Progress</span>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: overallProgressPercent + '%' }"></div>
            </div>
            <span class="progress-value">{{ overallProgressText }}</span>
          </div> -->
        </div>
      </div>
    </section>

    <!-- Requirements Section -->
    <section id="section-requirements">
      <div class="requirements-card">
        <div class="req-header">
          <h3>Requirements</h3>
          <p>Complete all steps below to claim your reward.</p>
        </div>

        <ul class="task-list">
          <li
            v-for="(mission, index) in sortedMissions"
            :key="mission.id"
            class="task-item"
          >
            <div class="task-icon-wrapper">
              <div class="task-icon">
                <img src="/assets/image/4230_163.svg" class="icon-bg" alt="">
                <img v-if="mission.claimed" src="/assets/image/4230_161.svg" class="icon-fg" alt="">
                <span v-else class="icon-text">{{ index + 1 }}</span>
              </div>
              <div v-if="index < sortedMissions.length - 1" class="task-line"></div>
            </div>
            <div class="task-content">
              <h4 class="task-title">{{ mission.title || 'Mission title' }}</h4>
              <p class="task-desc">{{ mission.description || mission.title }}</p>
            </div>
            <div class="task-status">
              <div v-if="isMissionCompleted(mission)" class="status-badge completed">
                <img src="/assets/image/4231_173.svg" alt="Check">
                <span>Completed</span>
              </div>
              <template v-else>
                <span class="status-text">{{ formatCurrency(mission.reward) }}</span>
               
                <div class="task-progress-track">
                  <div class="task-progress-fill" :style="{ width: getMissionProgressPercent(mission) + '%' }"></div>
                </div>
                 <span class="status-text">{{ getMissionProgressText(mission) }}</span>
              </template>
            </div>
          </li>

          <li v-if="!sortedMissions.length" class="empty-state">
            <p class="empty-text">No tasks available</p>
          </li>
        </ul>

        <button class="btn-see-all" @click="goBack">Back to Home</button>
      </div>
    </section>

    <!-- Info Section -->
    <section id="section-info">
      <div class="info-banner">
        <div class="info-content">
          <h3 class="info-title">HUE Mining System</h3>
          <p class="info-desc">Complete daily missions to earn rewards and level up your account.</p>
        </div>
      </div>
    </section>

    <!-- Claim Section -->
    <section id="section-claim">
      <div class="claim-banner">
        <p class="claim-title">Ready to claim your reward?</p>
        <button
          class="btn-claim"
          :disabled="!hasClaimable || isClaiming"
          @click="claimNextMission"
        >
          <img src="/assets/image/4231_173.svg" alt="Claim">
          <span>{{ isClaiming ? 'Claiming...' : 'Claim Reward' }}</span>
        </button>
      </div>
    </section>
  </div>

  <SuccessModal v-model="successModalOpen" :message="successMessage" />
  <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, missionAPI } from '@/services/api'
import SuccessModal from '@/components/modals/AppSuccessModal.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()

const accountInfo = ref(null)
const rankStatus = ref(null)
const missions = ref([])
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

const displayUsername = computed(() => {
  const d = accountInfo.value || {}
  const username = String(d.username || d.full_name || d.name || '').trim()
  return username || ''
})

const currentLevel = computed(() => {
  const d = rankStatus.value || {}
  const title = String(d.current_title || '').trim()
  if (title) return title
  const n = toNumber(d.current_rank)
  return Number.isFinite(n) ? `LV${n}` : 'LV0'
})

const formatCurrency = (value) => {
  const num = toNumber(value)
  const hasFraction = Math.abs(num % 1) > 1e-9
  return formatAppCurrency(num, { decimals: hasFraction ? 2 : 0 })
}

const isMissionRepeatable = (mission) => {
  return Boolean(mission?.is_repeatable)
}

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

const getMissionRemaining = (mission) => {
  const fromApi = toNumber(mission?.remaining)
  if (fromApi > 0) return fromApi
  const req = getMissionRequirement(mission)
  const prog = getMissionProgress(mission)
  if (req <= 0) return 0
  return Math.max(0, req - prog)
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

const overallProgressPercent = computed(() => {
  if (!sortedMissions.value.length) return 0
  const total = sortedMissions.value.reduce((acc, m) => acc + getMissionProgressPercent(m), 0)
  return Math.round(total / sortedMissions.value.length)
})

const overallProgressText = computed(() => {
  const completed = sortedMissions.value.filter(m => isMissionCompleted(m)).length
  return `${completed}/${sortedMissions.value.length}`
})

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

    const idA = Number(a?.id ?? 0)
    const idB = Number(b?.id ?? 0)
    return idA - idB
  })
  return list
})

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Request failed, please refresh'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Request failed, please refresh'
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
    successMessage.value = `Successfully claimed ${formatCurrency(amount)}`
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
  Promise.all([fetchAccountInfo(), fetchRankStatus(), fetchMissions()])
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  --color-bg-main: #f8f8f8;
  --color-white: #ffffff;
  --color-black: #000000;
  --color-text-dark: #464343;
  --color-primary: #1b46f5;
  --color-primary-dark: #144cdf;
  --color-primary-light: #1f44dc;
  --color-success-bg: #e7f5f0;
  --color-gray-light: #dbdbdb;
  --color-gray-border: #bababa;

  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: var(--color-bg-main);
  position: relative;
  overflow-x: hidden;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

button {
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  border: none;
  outline: none;
}

ul {
  list-style: none;
}

h1, h2, h3, h4, p {
  margin: 0;
}

/* Header Section */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: var(--color-bg-main);
}

.btn-back {
  background: transparent;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-back img {
  width: 20px;
  height: 20px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-black);
}

.header-placeholder {
  width: 28px;
}

/* Hero Section */
#section-hero {
  padding: 0 16px 16px;
}

.hero-banner {
  background-image: url('/assets/image/54a14378a7f46725b906d7ba3fd996dedeeed4f4.png');
  width: 100%;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  padding: 40px 10px;
  color: var(--color-white);
  position: relative;
  overflow: hidden;
  margin-top: -20px;
  margin-bottom: -20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 4px 8px;
  border-radius: 20px;

  align-self: flex-start;
}

.hero-badge img {
  width: 12px;
  height: 12px;
}

.hero-badge span {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.hero-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 6px;
  max-width: 200px;
}

.hero-subtitle {
  font-size: 12px;
  font-weight: 400;
  opacity: 0.9;
  max-width: 180px;
  line-height: 1.4;
  margin-bottom: 20px;
}

.hero-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgba(255, 255, 255, 0.4);
  padding: 6px 12px;
  border-radius: 20px;
  width: fit-content;
}

.progress-label {
  font-size: 10px;
  font-weight: 500;
}

.progress-track {
  width: 88px;
  height: 6px;
  background-color: var(--color-primary-dark);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: var(--color-white);
  border-radius: 10px;
  transition: width 0.3s;
}

.progress-value {
  font-size: 10px;
  font-weight: 600;
}

/* Requirements Section */
#section-requirements {
  padding: 0 16px 16px;
}

.requirements-card {
  background-color: var(--color-white);
  border-radius: 10px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.req-header {
  margin-bottom: 24px;
}

.req-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-black);
  margin-bottom: 4px;
}

.req-header p {
  font-size: 14px;
  color: var(--color-black);
  opacity: 0.7;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.task-icon-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.task-icon {
  width: 40px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-icon .icon-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.task-icon .icon-fg {
  position: absolute;
  width: 24px;
  height: 24px;
  z-index: 1;
}

.task-icon .icon-text {
  position: absolute;
  z-index: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-black);
}

.task-line {
  position: absolute;
  top: 40px;
  bottom: -20px;
  width: 1px;
  background-color: var(--color-gray-border);
  z-index: 0;
}

.task-content {
  flex: 1;
  padding-top: 4px;
  min-width: 0;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-black);
  margin-bottom: 4px;
}

.task-desc {
  font-size: 14px;
  color: var(--color-black);
  opacity: 0.6;
}

.task-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-top: 4px;
  flex-shrink: 0;
}

.status-badge.completed {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: var(--color-success-bg);
  padding: 4px 8px;
  border-radius: 20px;
}

.status-badge.completed img {
  width: 12px;
  height: 12px;
}

.status-badge.completed span {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-text-dark);
}

.status-text {
  font-size: 10px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.task-progress-track {
  width: 74px;
  height: 6px;
  background-color: var(--color-gray-light);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.task-progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: var(--color-primary-light);
  border-radius: 10px;
  transition: width 0.3s;
}

.btn-see-all {
  width: 100%;
  background-color: var(--color-primary);
  color: var(--color-white);
  font-size: 14px;
  font-weight: 600;
  padding: 12px;
  border-radius: 30px;
  text-align: center;
  transition: opacity 0.2s;
}

.btn-see-all:active {
  opacity: 0.8;
}

/* Info Section */
#section-info {
  padding: 0 16px 16px;
}

.info-banner {
  background-image: url('/assets/image/d0e10a0dbf286808cb8fb9c02f1cd15da31de7e1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 12px;
  min-height: 87px;
  display: flex;
  align-items: center;
  padding: 16px 20px 16px 105px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.info-desc {
  font-size: 14px;
  line-height: 1.4;
  color: var(--color-black);
  opacity: 0.8;
}

/* Claim Section */
#section-claim {
  padding: 0 16px 24px;
}

.claim-banner {
  background-image: url('/assets/image/c9bb02deee6d6747247a2ebf4049bb0b5108fcd0.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 20px;
  min-height: 116px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.claim-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-white);
  margin-bottom: 12px;
}

.btn-claim {
  background-color: #fefefe;
  color: var(--color-primary-dark);
  font-size: 13px;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 306px;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.1s;
}

.btn-claim:active {
  transform: scale(0.98);
}

.btn-claim:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-claim img {
  width: 16px;
  height: 16px;
}

/* Empty State */
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
}
</style>
