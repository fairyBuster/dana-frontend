<template>
  <div class="app-container">
    <section id="section-header">
      <div class="section-container">
        <header class="app-header">
          <button class="back-button" @click="goBack" aria-label="Go back">
            <img src="/assets/images/2023_1661.svg" alt="Back Icon">
          </button>
          <h1 class="page-title">Hadiah harian</h1>
        </header>
      </div>
    </section>

    <section id="section-summary">
      <div class="section-container">
        <div class="summary-wrapper">
          <div class="summary-card">
            <div class="summary-item">
              <span class="summary-value">{{ totalClaimCountText }} Hari</span>
              <span class="summary-label">Total berhasil absen</span>
            </div>
            <div class="summary-divider"></div>
            <div class="summary-item">
              <span class="summary-value">{{ formatCurrency(totalEarned) }}</span>
              <span class="summary-label">Total rupiah absen</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="section-calendar">
      <div class="section-container">
        <div class="calendar-wrapper">
          <div class="calendar-card">
            <div class="calendar-header">
              <div class="calendar-icon-bg">
                <img src="/assets/images/da35b1bd478095c4d10f2741cad43f6fbf632e97.png" alt="Calendar Icon" class="calendar-icon">
              </div>
              <p class="calendar-subtitle">{{ canClaimToday ? 'Silakan absen untuk hari ini' : 'Anda sudah absen hari ini' }}</p>
            </div>

            <div class="calendar-grid">
              <button
                v-for="item in visibleDayItems"
                :key="item.day"
                type="button"
                class="day-item"
                :class="{ checked: item.checked, special: item.special, claimable: item.claimable }"
                :disabled="isClaiming || !item.claimable"
                @click="handleDayClick(item)"
              >
                <img class="day-icon" :src="item.checked ? checkedIconSrc : gemIconSrc" alt="Day Icon">
                <div class="day-label">{{ item.label }}</div>
              </button>
            </div>

            <button
              v-if="dayItems.length > collapsedCount"
              type="button"
              class="toggle-calendar-btn"
              @click="toggleCalendarView"
            >
              {{ showAllDays ? 'Tampilkan sedikit' : 'Tampilkan semua' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="section-rules">
      <div class="section-container">
        <div class="rules-wrapper">
          <div class="rules-card">
            <h2 class="rules-title">Petunjuk absen</h2>
            <div class="rules-text">
              <p>Masuk setiap hari untuk mendapatkan hadiah.</p>
              <p>Jika pengumpulannya terganggu, maka akan diterbitkan kembali dari pengumpulan pertama.</p>
              <p>Pengguna harus masuk sekali sehari dan hadiah akan masuk secara real-time.</p>
              <p>Hadiah mengikuti distribusi sistem dan tampilan platform.</p>
              <p>Jika ditemukan kecurangan, platform berhak membatalkan partisipasi dan hadiah.</p>
              <p>Platform berhak atas interpretasi akhir acara ini.</p>
            </div>
          </div>
        </div>
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
import { attendanceAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}

const checkedIconSrc = '/assets/images/d4eaa5839a5872cc4c32f292c0feaee334e99300.png'
const gemIconSrc = '/assets/images/da4151be78469acf27cc0da4d60d3f5fcefd602d.png'

const isLoading = ref(false)
const isClaiming = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

const settings = ref(null)
const status = ref(null)
const showAllDays = ref(false)
const collapsedCount = 14

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
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: hasFraction ? 0 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0
  }).format(n)
}

const formatRupiah = (value) => {
  return `Rp ${formatCurrency(value)}`
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, segarkan halaman'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Permintaan gagal, segarkan halaman'
}

const cycleDays = computed(() => {
  const fromStatus = parseNumber(status.value?.cycle_days)
  if (fromStatus > 0) return fromStatus
  const fromSettings = parseNumber(settings.value?.daily_cycle_days)
  return fromSettings > 0 ? fromSettings : 20
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

const totalClaimCount = computed(() => {
  const d = status.value || {}
  const n = parseNumber(d.total_claim_count ?? d.total_claimed_count ?? d.claim_count ?? d.total_count ?? 0)
  return n >= 0 ? n : 0
})
const totalClaimCountText = computed(() => String(totalClaimCount.value))

const totalEarned = computed(() => {
  const d = status.value || {}
  return parseNumber(d.total_claimed_amount ?? d.total_earned ?? d.total_reward ?? d.total_amount ?? 0)
})

const canClaimToday = computed(() => {
  const d = status.value || {}
  const raw = d.can_claim_today ?? d.can_claim ?? d.claimable ?? null
  if (raw !== null && raw !== undefined) return !!raw
  const claimed = d.claimed_today ?? d.has_claimed_today ?? null
  if (claimed !== null && claimed !== undefined) return !claimed
  return true
})

const getDayAmount = (day) => {
  const s = settings.value || {}
  const rewards = s.daily_rewards || {}
  const key = String(day)
  if (Object.prototype.hasOwnProperty.call(rewards, key)) return parseNumber(rewards[key])
  if (Object.prototype.hasOwnProperty.call(rewards, day)) return parseNumber(rewards[day])
  const fixed = parseNumber(s.fixed_amount)
  return fixed || 0
}

const getDayLabel = (day) => {
  return `${day} Hari`
}

const dayItems = computed(() => {
  const total = cycleDays.value
  const nextClaimDay = canClaimToday.value && cycleDay.value < total ? cycleDay.value + 1 : null
  const out = []
  for (let d = 1; d <= total; d += 1) {
    out.push({
      day: d,
      label: getDayLabel(d),
      amountText: formatCurrency(getDayAmount(d)),
      checked: d <= cycleDay.value,
      claimable: nextClaimDay !== null && d === nextClaimDay,
      special: d === total
    })
  }
  return out
})

const visibleDayItems = computed(() => {
  if (showAllDays.value) return dayItems.value
  return dayItems.value.slice(0, collapsedCount)
})

const toggleCalendarView = () => {
  showAllDays.value = !showAllDays.value
}

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

const fetchAttendance = async () => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const [streakResp, setData] = await Promise.all([
      attendanceAPI.getStreak(),
      fetchSettings()
    ])
    settings.value = setData || null
    status.value = streakResp?.data || null
  } catch (err) {
    settings.value = null
    status.value = null
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
    const claimedAmount = parseNumber(
      data.claimed_amount ??
        data.log?.amount ??
        data.amount ??
        data.reward ??
        data.bonus_amount ??
        data.bonus ??
        0
    )
    const streakAfter = parseNumber(data.streak ?? data.log?.streak_count ?? streakCount.value)
    const baseMsg = String(data.message || 'Klaim absensi berhasil').trim()
    const nextClaimDate = data.next_claim_date ? String(data.next_claim_date) : ''

    let msg = baseMsg || 'Klaim absensi berhasil'
    if (claimedAmount > 0) msg += `! Anda mendapatkan ${formatRupiah(claimedAmount)}.`
    else msg += '!'
    if (streakAfter > 0) msg += ` Streak: ${streakAfter} hari.`
    if (nextClaimDate) msg += ` Klaim berikutnya: ${nextClaimDate}.`
    successMessage.value = msg
    showSuccessModal.value = true
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isClaiming.value = false
  }
}

const handleDayClick = async (item) => {
  if (!item?.claimable) return
  await handleCheckIn()
}

onMounted(() => {
  fetchAttendance()
})
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  max-width: 412px;
  margin: 0 auto;
  width: 100%;
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  position: relative;
  height: 64px;
}

.back-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  position: absolute;
  left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Summary */
.summary-wrapper {
  padding: 8px 16px 16px 16px;
}

.summary-card {
  background-color: #eeeeee;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 16px 0;
}

.summary-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-value {
  color: #004d43;
  font-size: 14px;
  font-weight: 700;
}

.summary-label {
  color: rgba(0, 0, 0, 0.5);
  font-size: 11px;
}

.summary-divider {
  width: 1px;
  height: 36px;
  background-color: rgba(0, 0, 0, 0.15);
}

/* Calendar */
.calendar-wrapper {
  padding: 0 16px 16px 16px;
}

.calendar-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px 16px;
}

.calendar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.calendar-icon-bg {
  width: 36px;
  height: 36px;
  background-color: #e8f5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.calendar-subtitle {
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
  margin: 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px 8px;
  margin-bottom: 8px;
}

.toggle-calendar-btn {
  width: 100%;
  height: 44px;
  margin-top: 10px;
  border-radius: 20px;
  background-color: #004d43;
  border: 1px solid #004d43;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.toggle-calendar-btn:active {
  opacity: 0.85;
}

.day-item {
  position: relative;
  height: 50px;
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: #eeeeee;
  overflow: hidden;
  border: none;
  padding: 0;
  cursor: default;
}

.day-item.checked {
  background-color: rgba(0, 77, 67, 0.3);
}

.day-item.claimable {
  cursor: pointer;
  outline: 2px solid rgba(0, 77, 67, 0.35);
  outline-offset: 2px;
}

.day-item:disabled {
  cursor: default;
}

.day-icon {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.day-label {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15px;
  background-color: #004d43;
  color: #ffffff;
  font-size: 8px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-item.checked .day-label {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Rules */
.rules-wrapper {
  padding: 0 16px 24px 16px;
}

.rules-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 20px 16px;
}

.rules-title {
  color: #004d43;
  font-size: 13px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.rules-text {
  color: rgba(0, 0, 0, 0.5);
  font-size: 11px;
  line-height: 1.6;
}

.rules-text p {
  margin: 0 0 8px 0;
}

.rules-text p:last-child {
  margin-bottom: 0;
}
</style>
