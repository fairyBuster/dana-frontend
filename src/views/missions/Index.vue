<template>
  <div class="app-container">
    <section id="section-header">
      <div class="header-content">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/images/18_219.svg" alt="Back">
        </button>
        <div class="user-info">
          <h1 class="greeting">Hai, {{ displayUsername }}</h1>
          <div class="level-info">
            <span class="level-label">Level saat ini:</span>
            <span class="level-value">{{ currentLevel }}</span>
          </div>
        </div>
        <div class="logo-container">
          <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Trivex Logo" class="logo-img">
        </div>
      </div>
    </section>

    <section id="section-task-list">
      <div class="task-list">
        <div
          v-for="mission in sortedMissions"
          :key="mission.id"
          class="task-card"
        >
          <div class="task-card-header">
            <div class="task-title-group">
              <img src="/assets/images/35c8b6a18c2ca182842dd2334e0d97ca5f0a270c.png" alt="Task Icon" class="task-icon">
              <h2 class="task-title">Tugas berhadiah</h2>
            </div>
            <button
              class="claim-btn"
              :disabled="!mission.can_claim || mission.claimed || isClaiming"
              @click="claimMission(mission)"
            >
              {{ mission.claimed ? 'Diklaim' : 'Klaim' }}
            </button>
          </div>
          <div class="task-card-body">
            <div class="task-desc-row">
              <p class="task-desc">{{ mission.description || mission.title }}</p>
              <span class="task-reward">+Rp {{ formatCurrency(mission.reward) }}</span>
            </div>
            <p class="task-status">{{ getStatusText(mission) }}</p>
          </div>
        </div>

        <div v-if="!sortedMissions.length && !errorModalOpen" class="empty-state">
          <p class="empty-text">Belum ada tugas tersedia</p>
        </div>
      </div>
    </section>

    <SuccessModal v-model="successModalOpen" :message="successMessage" />
    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, missionAPI } from '@/services/api'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

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
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
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

const getMissionRemaining = (mission) => {
  const req = getMissionRequirement(mission)
  const prog = getMissionProgress(mission)
  if (req <= 0) return 0
  return Math.max(0, req - prog)
}

const sortedMissions = computed(() => {
  const list = Array.isArray(missions.value) ? [...missions.value] : []
  list.sort((a, b) => {
    const aClaimed = Boolean(a?.claimed)
    const bClaimed = Boolean(b?.claimed)
    if (aClaimed !== bClaimed) return aClaimed ? 1 : -1

    const aCan = Boolean(a?.can_claim)
    const bCan = Boolean(b?.can_claim)
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
  if (!data) return err?.message || 'Permintaan gagal, segarkan halaman'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Permintaan gagal, segarkan halaman'
}

const getStatusText = (mission) => {
  const isDeposit = String(mission?.type || '').toLowerCase() === 'deposit'
  if (isDeposit) {
    const lvl = Array.isArray(mission?.referral_levels) && mission.referral_levels.length ? mission.referral_levels[0] : 1
    return `Teman aktif tingkat ${lvl}: Rp ${formatCurrency(mission?.progress_amount)}`
  }
  const progress = getMissionProgress(mission)
  const requirement = getMissionRequirement(mission)
  if (requirement > 0) {
    return `Progres saat ini: ${progress}/${requirement}`
  }
  return `Progres saat ini: ${progress}`
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

const claimMission = async (mission) => {
  if (isClaiming.value) return
  if (!mission?.id) return
  if (!mission?.can_claim || mission?.claimed) return

  isClaiming.value = true
  errorModalOpen.value = false
  errorMessage.value = ''
  try {
    const resp = await missionAPI.claimMission(mission.id)
    const data = resp?.data || {}
    const amount = toNumber(data.reward_amount ?? data.reward ?? mission.reward)
    successMessage.value = `Berhasil klaim Rp ${formatCurrency(amount)}`
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
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  max-width: 412px;
  min-height: 100vh;
  background: linear-gradient(180deg, #0a4345 0%, #0b6563 100%);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

h1, h2, p {
  margin: 0;
}

/* Header Section */
#section-header {
  padding: 28px 18px 24px 19px;
  position: relative;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.back-btn {
  position: absolute;
  left: 5px;
  top: 20px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  height: 41px;
}

.back-btn img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.greeting {
  margin: 0;
  color: #ffffff;
  margin-left:25px;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.2;
}

.level-info {
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
  font-size: 16px;
  font-weight: 700;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 100px;
  height: 32px;
  object-fit: contain;
  border-radius: 50px;
}

/* Task List Section */
#section-task-list {
  padding: 0 19px 24px 24px;
}

.task-list {
  display: flex;
  flex-direction: column;
}

.task-card {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 18px 14px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.task-card:last-child {
  margin-bottom: 0;
}

.task-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-title-group {
  display: flex;
  align-items: center;
  gap: 9px;
}

.task-icon {
  width: 39px;
  height: 39px;
  object-fit: contain;
}

.task-title {
  margin: 0;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
}

.claim-btn {
  background: linear-gradient(90deg, #4e733f 0%, #60995b 100%);
  border-radius: 20px;
  width: 86px;
  height: 24px;
  border: none;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-family: inherit;
  transition: opacity 0.2s ease;
}

.claim-btn:hover {
  opacity: 0.9;
}

.claim-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-card-body {
  padding-left: 4px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-desc-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.task-desc {
  flex: 1;
  margin: 0;
  color: #ffffff;
  font-size: 12px;
  line-height: 1.4;
}

.task-reward {
  color: #de9400;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.task-status {
  margin: 0;
  color: #ffbd7b;
  font-size: 12px;
  line-height: 1.4;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}
</style>
