<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="site-header">
        <img src="/assets/image/4168_122.svg" alt="Back" class="back-icon" @click="goBack">
        <h1 class="header-title">Daily sign</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-content">
        <h2 class="main-title">Daily Journey</h2>
        <p class="subtitle">Stay consistent and move forward</p>

        <div class="progress-card">
          <span>Progres: {{ streakCount }} / {{ cycleDays }} Days</span>
        </div>
      </div>
    </section>

    <!-- Journey Map -->
    <section id="section-journey">
      <div class="journey-map">
        <img src="/assets/image/4168_137.svg" class="journey-path" alt="Journey Path">

        <div
          v-for="(node, index) in journeyNodes"
          :key="node.day"
          class="node-group"
          :class="`node-${node.day}`"
          @click="handleDayClick(node)"
        >
          <div class="node-circle-wrap" :class="{ 'is-checked': node.checked }">
            <img
              :src="node.checked ? activeNodeIcon : inactiveNodeIcons[index] || inactiveNodeIcons[0]"
              class="node-circle"
              :alt="`Day ${node.day}`"
            >
            <span class="node-text" :class="{ 'is-checked': node.checked }">{{ node.day }}</span>
          </div>
          <span class="node-label">Day {{ node.day }}</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer">
      <div class="footer-container">
        <button
          class="btn-primary"
          :disabled="!canClaimToday || isClaiming"
          @click="handleCheckIn"
        >
          {{ isClaiming ? 'Claiming...' : 'Claim Reward' }}
        </button>
      </div>
    </section>
  </div>

  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <SuccessModal v-model="showSuccessModal" :message="successMessage" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { attendanceAPI, authAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}

const activeNodeIcon = '/assets/image/4168_164.svg'
const inactiveNodeIcons = [
  '/assets/image/4168_164.svg',
  '/assets/image/4168_141.svg',
  '/assets/image/4168_149.svg',
  '/assets/image/4168_161.svg',
  '/assets/image/4168_138.svg',
  '/assets/image/4168_147.svg',
  '/assets/image/4168_144.svg'
]

const isLoading = ref(false)
const isClaiming = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

const settings = ref(null)
const status = ref(null)
const rankStatus = ref(null)

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const raw = String(value).trim()
  if (!raw) return 0
  let s = raw.replace(/\s+/g, '')
  s = s.replace(/[^0-9,.-]/g, '')
  const dots = (s.match(/\./g) || []).length
  const commas = (s.match(/,/g) || []).length

  if (dots > 0 && commas > 0) {
    const lastDot = s.lastIndexOf('.')
    const lastComma = s.lastIndexOf(',')
    const decimalSep = lastDot > lastComma ? '.' : ','
    const groupSep = decimalSep === '.' ? ',' : '.'
    s = s.split(groupSep).join('')
    if (decimalSep === ',') s = s.replace(',', '.')
  } else if (dots > 1 && commas === 0) {
    s = s.split('.').join('')
  } else if (commas > 1 && dots === 0) {
    s = s.split(',').join('')
  } else if (commas === 1 && dots === 0) {
    const idx = s.indexOf(',')
    const digitsAfter = s.length - idx - 1
    if (digitsAfter === 3) {
      s = s.replace(',', '')
    } else {
      s = s.replace(',', '.')
    }
  } else if (dots === 1 && commas === 0) {
    const idx = s.indexOf('.')
    const digitsAfter = s.length - idx - 1
    if (digitsAfter === 3) {
      s = s.replace('.', '')
    }
  }

  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value) => {
  const n = parseNumber(value)
  const hasFraction = Math.abs(n % 1) > 1e-9
  return formatAppCurrency(n, { decimals: hasFraction ? 2 : 0 })
}

const formatRupiah = (value) => {
  return formatCurrency(value)
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Request failed, please refresh'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Request failed, please refresh'
}

const cycleDays = computed(() => {
  const fromStatus = parseNumber(status.value?.cycle_days)
  if (fromStatus > 0) return fromStatus
  const fromSettings = parseNumber(settings.value?.daily_cycle_days)
  return fromSettings > 0 ? fromSettings : 7
})

const cycleDay = computed(() => {
  const n = parseNumber(status.value?.cycle_day)
  if (n > 0) return Math.min(n, cycleDays.value)
  return Math.min(streakCount.value, cycleDays.value)
})

const streakCount = computed(() => {
  const d = status.value || {}
  const n = parseNumber(d.streak ?? d.current_streak ?? d.streak_count ?? d.streak_days ?? 0)
  return n >= 0 ? n : 0
})

const canClaimToday = computed(() => {
  const d = status.value || {}
  const raw = d.can_claim_today ?? d.can_claim ?? d.claimable ?? null
  if (raw !== null && raw !== undefined) return !!raw
  const claimed = d.claimed_today ?? d.has_claimed_today ?? null
  if (claimed !== null && claimed !== undefined) return !claimed
  return true
})

const totalClaimCount = computed(() => {
  const d = status.value || {}
  const n = parseNumber(d.total_claim_count ?? d.total_claimed_count ?? d.claim_count ?? d.total_count ?? 0)
  return n >= 0 ? n : 0
})

const totalEarned = computed(() => {
  const d = status.value || {}
  return parseNumber(d.total_claimed_amount ?? d.total_earned ?? d.total_reward ?? d.total_amount ?? 0)
})

const currentRankNumber = computed(() => {
  const d = rankStatus.value || {}
  const n = parseNumber(d.current_rank ?? d.rank ?? d.level ?? 0)
  const int = Math.floor(n)
  return int > 0 ? int : 0
})

const rankRewardAmount = computed(() => {
  const s = settings.value || {}
  const type = String(s.reward_type || '').toLowerCase()
  if (type !== 'rank') return 0
  const map = s.rank_rewards || {}
  const key = String(currentRankNumber.value || '')
  const raw = map?.[key] ?? map?.[String(parseNumber(key))] ?? 0
  return parseNumber(raw)
})

const journeyNodes = computed(() => {
  const total = Math.min(cycleDays.value, 7)
  const out = []
  for (let d = 1; d <= total; d += 1) {
    out.push({
      day: d,
      checked: d <= cycleDay.value,
      claimable: canClaimToday.value && d === cycleDay.value + 1
    })
  }
  return out
})

const fetchSettings = async () => {
  try {
    const active = await attendanceAPI.getActiveSettings()
    const activeData = active?.data || null
    const id = activeData?.id ?? null
    if (id !== null && id !== undefined && id !== '') {
      try {
        const detail = await attendanceAPI.getSettings(id)
        return detail?.data || activeData
      } catch (_) {
        return activeData
      }
    }
    return activeData
  } catch (_) {
    try {
      const statusResp = await attendanceAPI.checkStatus()
      const d = statusResp?.data || {}
      const id = d?.id ?? d?.settings_id ?? d?.active_settings_id ?? d?.attendance_settings_id ?? null
      if (id !== null && id !== undefined && id !== '') {
        const detail = await attendanceAPI.getSettings(id)
        return detail?.data || null
      }
    } catch (_) {}

    try {
      const detail = await attendanceAPI.getSettings(3)
      return detail?.data || null
    } catch (_) {
      return null
    }
  }
}

const fetchRankStatus = async () => {
  try {
    const resp = await authAPI.getRankStatus()
    return resp?.data || null
  } catch (_) {
    return null
  }
}

const fetchAttendance = async () => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const [streakResp, setData, rankData] = await Promise.all([
      attendanceAPI.getStreak(),
      fetchSettings(),
      fetchRankStatus()
    ])
    settings.value = setData || null
    status.value = streakResp?.data || null
    rankStatus.value = rankData || null
  } catch (err) {
    settings.value = null
    status.value = null
    rankStatus.value = null
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

const handleCheckIn = async () => {
  if (!canClaimToday.value || isClaiming.value) return
  isClaiming.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const res = await attendanceAPI.claim()
    const data = res?.data || {}
    const streakResp = await attendanceAPI.getStreak()
    status.value = streakResp?.data || null
    let claimedAmount = parseNumber(
      data.claimed_amount ??
        data.log?.amount ??
        data.amount ??
        data.reward ??
        data.bonus_amount ??
        data.bonus ??
        0
    )
    if (claimedAmount <= 0) {
      const expected = rankRewardAmount.value
      if (expected > 0) claimedAmount = expected
    }
    successMessage.value = 'Success'
    showSuccessModal.value = true
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isClaiming.value = false
  }
}

const handleDayClick = async (node) => {
  if (!node?.claimable) return
  await handleCheckIn()
}

onMounted(() => {
  fetchAttendance()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 100%;
  min-height: 100vh;
  background-image: url('/assets/image/c8d68c05ae1ea16072599c761dd2bec2540b74f4.png');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f5f7ff;
  position: relative;
  overflow-x: hidden;
  color: #000000;
}

/* Header */
.site-header {
  display: flex;
  align-items: center;
  padding: 20px 20px 0;
  position: relative;
  justify-content: center;
}

.back-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  left: 20px;
}

.header-title {
  margin-left: 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

/* Hero */
.hero-content {
  text-align: center;
  padding-top: 32px;
}

.main-title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 14px;
  font-weight: 400;
  margin-top: 7px;
  color: #1a1a1a;
}

.progress-card {
  width: 324px;
  height: 50px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  margin: 39px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-card span {
  font-size: 14px;
  font-weight: 600;
}

/* Journey Map */
.journey-map {
  position: relative;
  height: 420px;
  margin-top: 32px;
}

.journey-path {
  position: absolute;
  top: 25px;
  left: 50px;
  width: 330px;
  height: 370px;
}

.node-group {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.node-circle-wrap {
  position: absolute;
  display: grid;
  place-items: center;
  z-index: 1;
}

.node-circle {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.node-text {
  position: absolute;
  left: 50%;
  top: var(--node-center-y, 50%);
  transform: translate(-50%, -50%);
  color: #144cdf;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
  z-index: 2;
}

.node-text.is-checked {
  color: #ffffff;
}

.node-circle-wrap.is-checked {
  --node-center-y: 44.3%;
}

.node-label {
  position: absolute;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

/* Node 1 */
.node-1 .node-circle-wrap { top: 0px; left: 33px; width: 62px; height: 62px; }
.node-1 .node-label { top: 72px; left: 32px; }

/* Node 2 */
.node-2 .node-circle-wrap { top: 0px; left: 253px; width: 50px; height: 49px; }
.node-2 .node-label { top: 54px; left: 244px; }

/* Node 3 */
.node-3 .node-circle-wrap { top: 100px; left: 340px; width: 50px; height: 49px; }
.node-3 .node-label { top: 120px; left: 280px; }

/* Node 4 */
.node-4 .node-circle-wrap { top: 195px; left: 307px; width: 50px; height: 49px; }
.node-4 .node-label { top: 267px; left: 307px; }

/* Node 5 */
.node-5 .node-circle-wrap { top: 186px; left: 167px; width: 50px; height: 49px; }
.node-5 .node-label { top: 244px; left: 161px; }

/* Node 6 */
.node-6 .node-circle-wrap { top: 322px; left: 30px; width: 50px; height: 49px; }
.node-6 .node-label { top: 380px; left: 13px; }

/* Node 7 */
.node-7 .node-circle-wrap { top: 346px; left: 319px; width: 50px; height: 49px; }
.node-7 .node-label { top: 395px; left: 317px; }

/* Footer */
.footer-container {
  padding-top: 34px;
  padding-bottom: 30px;
  display: flex;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(90deg, #4085e1 0%, #2757b7 100%);
  color: #ffffff;
  border: none;
  border-radius: 30px;
  padding: 14px 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
