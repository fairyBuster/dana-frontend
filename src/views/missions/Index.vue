<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header" class="container">
      <header class="app-header">
        <div class="back-button" @click="goBack">
          <img src="/assets/image/135_592.svg" alt="Back">
        </div>
        <h1 class="page-title">Tantangan</h1>
      </header>
    </section>

    <!-- Notification Section -->
    <section id="section-notification" class="container">
      <div class="notification-bar">
        <img src="/assets/image/137_598.svg" alt="Speaker" class="notification-icon">
        <div class="notification-text">
          <div class="notification-marquee">
            <div class="notification-marquee-inner">
              Por favor, complete algumas missões disponíveis abaixo para obter muita sorte para você
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Order Tasks Section -->
    <section v-if="orderMissions.length" id="section-order-tasks" class="container">
      <div class="task-groups">
        <div v-for="(group, groupIdx) in orderMissionGroups" :key="`order-${groupIdx}`" class="task-card">
          <div v-for="mission in group" :key="mission.id" class="task-item">
            <div class="task-header">
              <div class="task-header-left">
                <span class="task-desc">{{ mission.description || mission.title }}</span>
                <div class="reward-badge">
                  <img src="/assets/image/bf8b81ef2600b30e06ec0a2ae89fa57be2e4397a.png" alt="Diamond" class="diamond-icon">
                  <div class="reward-pill">Rp {{ formatCurrency(mission.reward) }}</div>
                </div>
              </div>
              <div class="task-header-right"></div>
            </div>
            <div class="task-body">
              <div class="task-progress-row">
                <div class="progress-track">
                  <div class="progress-fill" :style="{ width: `${getProgressPercent(mission)}%` }"></div>
                </div>
                <button class="btn-claim" :disabled="!mission.can_claim || mission.claimed || isClaiming" @click="claimMission(mission)">Terima</button>
              </div>
              <div class="task-status">{{ getStatusText(mission) }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Referral Tasks Section -->
    <section v-if="referralMissions.length" id="section-referral-tasks" class="container">
      <div class="task-groups">
        <div v-for="(group, groupIdx) in referralMissionGroups" :key="`ref-${groupIdx}`" class="task-card">
          <div v-for="mission in group" :key="mission.id" class="task-item">
            <div class="task-header">
              <div class="task-header-left">
                <span class="task-desc">{{ mission.description || mission.title }}</span>
                <div class="reward-badge">
                  <img src="/assets/image/bf8b81ef2600b30e06ec0a2ae89fa57be2e4397a.png" alt="Diamond" class="diamond-icon">
                  <div class="reward-pill">Rp {{ formatCurrency(mission.reward) }}</div>
                </div>
              </div>
              <div class="task-header-right"></div>
            </div>
            <div class="task-body">
              <div class="task-progress-row">
                <div class="progress-track">
                  <div class="progress-fill" :style="{ width: `${getProgressPercent(mission)}%` }"></div>
                </div>
                <button class="btn-claim" :disabled="!mission.can_claim || mission.claimed || isClaiming" @click="claimMission(mission)">Terima</button>
              </div>
              <div class="task-status">{{ getStatusText(mission) }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <br>
    <br>
    <br>

    <SuccessModal v-model="successModalOpen" :message="successMessage" />
    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { missionAPI } from '@/services/api'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}

const missions = ref([])
const isClaiming = ref(false)
const successModalOpen = ref(false)
const successMessage = ref('')
const errorModalOpen = ref(false)
const errorMessage = ref('')

const normalizeMissionsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

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

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value) => {
  const num = parseNumber(value)
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

const isDepositMission = (mission) => String(mission?.type || '').toLowerCase() === 'deposit'

const orderMissions = computed(() => missions.value.filter((m) => !isDepositMission(m)))
const referralMissions = computed(() => missions.value.filter((m) => isDepositMission(m)))

const sortByIdAsc = (items) => {
  return [...(items || [])].sort((a, b) => {
    const av = parseNumber(a?.id)
    const bv = parseNumber(b?.id)
    if (av < bv) return -1
    if (av > bv) return 1
    return 0
  })
}

const chunkList = (items, size) => {
  const arr = Array.isArray(items) ? items : []
  const n = Number(size)
  const chunkSize = Number.isFinite(n) && n > 0 ? Math.floor(n) : 1
  const out = []
  for (let i = 0; i < arr.length; i += chunkSize) out.push(arr.slice(i, i + chunkSize))
  return out
}

const orderMissionGroups = computed(() => chunkList(sortByIdAsc(orderMissions.value), 4))
const referralMissionGroups = computed(() => chunkList(sortByIdAsc(referralMissions.value), 4))

const getProgressPercent = (mission) => {
  const requirement = parseNumber(mission?.requirement)
  if (!requirement) return 0
  const progress = isDepositMission(mission) ? parseNumber(mission?.progress_amount) : parseNumber(mission?.progress)
  return Math.min(Math.max((progress / requirement) * 100, 0), 100)
}

const getStatusText = (mission) => {
  if (isDepositMission(mission)) {
    const lvl = Array.isArray(mission?.referral_levels) && mission.referral_levels.length ? mission.referral_levels[0] : 1
    return `Terhitung teman saya di tingkat ${lvl} Rp ${formatCurrency(mission?.progress_amount)}`
  }
  return `Anda saat ini sudah memiliki ${parseNumber(mission?.progress)} drone`
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
    const amount = parseNumber(data.reward_amount ?? data.reward ?? mission.reward)
    successMessage.value = `Adicionar Rp ${formatCurrency(amount)}`
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
  fetchMissions()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app-container {
  font-family: 'Inter', sans-serif;
  background-color: #0a0a1a;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 150vh;
  color: #ffffff;
  margin: 0 !important;
  padding: 0 !important;
  
  display: flex;
  flex-direction: column;
  align-items: center;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

.container {
  width: 100%;
  max-width: 412px;
  position: relative;
  padding: 0 12px;
}

/* Header Section */
.app-header {
  display: flex;
  align-items: center;
  padding: 20px 0;
  position: relative;
}

.back-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  left: 0px;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

/* Notification Bar */
.notification-bar {
  margin: 5px 0;
  height: 29px;
  background: linear-gradient(180deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border-radius: 2px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 8px;
  overflow: hidden;
}

.notification-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.notification-text {
  flex: 1;
  font-size: 12px;
  color: #c4c4c4;
  overflow: hidden;
  line-height: 14px;
}

.notification-marquee {
  width: 100%;
  overflow: hidden;
}

.notification-marquee-inner {
  display: inline-block;
  white-space: nowrap;
  padding-left: 100%;
  animation: notification-marquee 12s linear infinite;
}

@keyframes notification-marquee {
  to { transform: translateX(-100%) }
}

/* Task Card */
.task-groups {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.task-card {
  margin: 0;
  padding: 14px 12px;
  background: linear-gradient(180deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
margin-bottom: 6px;
  box-shadow: 0px 4px 4px 0px rgba(158, 158, 158, 0.25);
}

.task-item {
  padding: 14px 0;

}

.task-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-header-left {
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
}

.task-header-right {
  width: 20%;
  flex-shrink: 0;
}

.task-desc {
  font-size: 10px;
  color: #ffffff;
  max-width: 90%;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reward-badge {
  position: relative;
  display: flex;
  align-items: center;
  height: 26px;
}

.diamond-icon {
  width: 29px;
  height: 26px;
  position: absolute;
  left: -10px;
  z-index: 2;
}

.reward-pill {
  background-color: #a296ff;
  border-radius: 10px;
  padding: 2px 8px 2px 12px;
  font-size: 10px;
  color: #301f80;
  font-weight: 700;
  height: 18px;
  display: flex;
  align-items: center;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
}

.task-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.task-progress-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-track {
  flex: 1;
  height: 5px;
  background-color: rgba(116, 106, 154, 0.55);
  border-radius: 15px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 31%, #9047e0 100%);
  border-radius: 15px;
}

.task-status {
  font-size: 11px;
  color: #ffffff;
  text-align: center;
  opacity: 0.95;
}

.btn-claim {
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 31%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 14px;
  color: white;
  font-size: 13px;
  padding: 0 16px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
  flex: 0 0 20%;
  width: auto;
  min-width: 76px;
}

.btn-claim:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
