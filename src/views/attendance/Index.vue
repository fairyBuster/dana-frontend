<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="header-section">
      <header class="top-nav">
        <div class="nav-left" @click="goBack">
          <img src="/assets/image/132_171.svg" alt="Back" class="icon-back">
        </div>
        <h1 class="page-title">Kehadiran</h1>
      </header>

      <div class="user-profile">
        <div class="avatar-container">
          <img :src="avatarSrc" alt="User Avatar" class="avatar">
        </div>
        <div class="user-info">
          <div class="username">{{ displayUsername }}</div>
          <div class="uid">UID {{ displayUid }}</div>
        </div>
      </div>
    </section>

    <!-- Progress Section -->
    <section id="progress-section">
      <div class="card progress-card">
        <div class="progress-header">
          <span class="progress-title">Terbang {{ cycleDaysText }} hari untuk dapatkan</span>
          <div class="reward-badge">
            <div class="reward-pill">
              <img src="/assets/image/bf8b81ef2600b30e06ec0a2ae89fa57be2e4397a.png" alt="Gem" class="gem-icon-sm">
              <span class="reward-text">Rp {{ bonusRewardText }}</span>
            </div>
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
          </div>
        </div>

        <div class="progress-footer">
          <span class="status-text">Anda sudah aktif bersama kami selama {{ streakText }} hari</span>
          <button class="btn-claim" type="button" :disabled="!canClaimBonus" @click="handleClaimBonus">Terima</button>
        </div>
      </div>
    </section>

    <!-- Check-in Section -->
    <section id="checkin-section">
      <div class="card checkin-card">
        <div class="checkin-header">
          <img src="/assets/image/868a72556c0a6003d94f0f0d9ec7951c93a698eb.png" alt="Bag" class="header-icon">
          <p class="checkin-desc">Selesaikan masuk selama {{ cycleDaysText }} hari berturut-turut untuk mendapatkan bonus kumulatif diatas</p>
        </div>

        <div class="days-grid">
          <div v-for="item in dayItems" :key="item.day" class="day-item">
            <div class="day-box" :class="{ special: item.special }">
              <img :src="item.checked ? checkedIconSrc : gemIconSrc" :alt="item.checked ? 'Checked' : 'Gem'" class="day-icon">
              <span class="day-amount">Rp {{ item.amountText }}</span>
            </div>
            <span class="day-label">{{ item.label }}</span>
          </div>
        </div>

        <button class="btn-checkin" type="button" :disabled="isClaiming || !canClaimToday" @click="handleCheckIn">
          <img src="/assets/image/7b8632cb6ba78c8c3ae42b19a7795386bc75f8e1.png" alt="Check" class="btn-icon">
          <span>{{ canClaimToday ? 'Masuk sekarang' : 'Sudah Masuk' }}</span>
        </button>

        <div class="instructions">
          <h3>Petunjuk masuk</h3>
          <p>Masuk setiap hari untuk mendapatkan hadiah.</p>
          <p>Jika pengumpulannya terganggu, maka akan diterbitkan kembali dari pengumpulan pertama.</p>
          <p>Pengguna harus masuk sekali sehari dan hadiah akan masuk secara real-time.</p>
          <p>Hadiah mengikuti distribusi sistem dan tampilan platform.</p>
          <p>Jika ditemukan kecurangan, platform berhak membatalkan partisipasi dan hadiah.</p>
          <p>Platform berhak atas interpretasi akhir acara ini.</p>
        </div>
      </div>
      <div class="footer-brand">
          <div class="brand-row">
            <img src="/assets/image/983276.png" alt="Ot-Sent" class="footer-logo">
            <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
          </div>
          <p class="tagline">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        </div>
    </section>

    <!-- Footer Section -->
    
  </div>
  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <SuccessModal v-model="showSuccessModal" :message="successMessage" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { avatarSrc } from '@/utils/avatar'
import { attendanceAPI, authAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}

const checkedIconSrc = '/assets/image/7b8632cb6ba78c8c3ae42b19a7795386bc75f8e1.png'
const gemIconSrc = '/assets/image/bf8b81ef2600b30e06ec0a2ae89fa57be2e4397a.png'

const isLoading = ref(false)
const isClaiming = ref(false)
const isClaimingBonus = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

const accountInfo = ref(null)
const settings = ref(null)
const status = ref(null)

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

const formatAmount = (value) => {
  const n = parseNumber(value)
  const hasFraction = Math.abs(n % 1) > 1e-9
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: hasFraction ? 0 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0
  }).format(n)
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
  return fromSettings > 0 ? fromSettings : 14
})
const cycleDaysText = computed(() => String(cycleDays.value))

const cycleDay = computed(() => {
  const n = parseNumber(status.value?.cycle_day)
  if (n > 0) return Math.min(n, cycleDays.value)
  return Math.min(streakCount.value, cycleDays.value)
})

const bonusRewardText = computed(() => {
  const s = settings.value
  if (!s) return '0'
  const bonus7 = parseNumber(s.bonus_7_days)
  const bonus30 = parseNumber(s.bonus_30_days)
  const fallback = parseNumber(s.fixed_amount)
  const best = bonus7 || bonus30 || fallback
  return formatAmount(best)
})

const streakCount = computed(() => {
  const d = status.value || {}
  const n = parseNumber(d.streak ?? d.streak_count ?? d.current_streak ?? 0)
  return n >= 0 ? n : 0
})
const streakText = computed(() => String(streakCount.value))

const progressPercent = computed(() => {
  const total = cycleDays.value
  if (!total) return 0
  const pct = (cycleDay.value / total) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))
})

const canClaimToday = computed(() => {
  const d = status.value || {}
  const raw = d.can_claim_today ?? d.can_claim ?? d.claimable ?? null
  if (raw !== null && raw !== undefined) return !!raw
  const claimed = d.claimed_today ?? d.has_claimed_today ?? null
  if (claimed !== null && claimed !== undefined) return !claimed
  return true
})

const hasClaimedToday = computed(() => {
  const d = status.value || {}
  const claimed = d.has_claimed_today ?? d.claimed_today ?? null
  if (claimed !== null && claimed !== undefined) return !!claimed
  return !canClaimToday.value
})

const displayUsername = computed(() => {
  const d = accountInfo.value || {}
  const username = String(d.username || d.name || '').trim()
  return username || 'Username'
})

const displayUid = computed(() => {
  const d = accountInfo.value || {}
  const uid = d.referral_code ?? d.id ?? d.user_id ?? null
  if (uid === null || uid === undefined || uid === '') return '-'
  return String(uid)
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
  const d = Number(day)
  if (!Number.isFinite(d)) return `${day} Day`
  const mod100 = d % 100
  if (mod100 >= 11 && mod100 <= 13) return `${d}th Day`
  const mod10 = d % 10
  if (mod10 === 1) return `${d}st Day`
  if (mod10 === 2) return `${d}nd Day`
  if (mod10 === 3) return `${d}rd Day`
  return `${d}th Day`
}

const dayItems = computed(() => {
  const total = cycleDays.value
  const out = []
  for (let d = 1; d <= total; d += 1) {
    out.push({
      day: d,
      label: getDayLabel(d),
      amountText: formatAmount(getDayAmount(d)),
      checked: d <= cycleDay.value,
      special: d === total
    })
  }
  return out
})

const claimBonusEligible = computed(() => {
  const enabled = settings.value?.consecutive_bonus_enabled
  if (enabled === false) return false
  return cycleDay.value >= cycleDays.value
})

const canClaimBonus = computed(() => {
  if (isLoading.value || isClaimingBonus.value) return false
  if (!claimBonusEligible.value) return false
  if (!hasClaimedToday.value) return false
  return true
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

const fetchAttendance = async () => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const [acc, streakResp, setData] = await Promise.all([
      authAPI.getAccountInfo(),
      attendanceAPI.getStreak(),
      fetchSettings()
    ])
    accountInfo.value = acc?.data || null
    settings.value = setData || null
    status.value = streakResp?.data || null
  } catch (err) {
    accountInfo.value = null
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
    const data = res?.data?.data || res?.data || {}
    const streakResp = await attendanceAPI.getStreak()
    status.value = streakResp?.data || null
    const amountFromResponse = parseNumber(data.amount ?? data.reward ?? data.bonus_amount ?? data.bonus)
    const fallbackAmount = getDayAmount(cycleDay.value)
    const amount = amountFromResponse > 0 ? amountFromResponse : (fallbackAmount > 0 ? fallbackAmount : amountFromResponse)
    successMessage.value = `Adicionar Rp ${formatAmount(amount)}`
    showSuccessModal.value = true
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isClaiming.value = false
  }
}

const handleClaimBonus = async () => {
  if (!canClaimBonus.value) return
  isClaimingBonus.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const res = await attendanceAPI.claimBonus()
    const data = res?.data?.data || res?.data || {}
    const streakResp = await attendanceAPI.getStreak()
    status.value = streakResp?.data || null
    const amountFromResponse = parseNumber(data.amount ?? data.bonus_amount ?? data.bonus ?? data.reward)
    const s = settings.value || {}
    const fallbackAmount =
      parseNumber(s.bonus_7_days) ||
      parseNumber(s.bonus_30_days) ||
      parseNumber(s.fixed_amount) ||
      0
    const amount = amountFromResponse > 0 ? amountFromResponse : (fallbackAmount > 0 ? fallbackAmount : amountFromResponse)
    successMessage.value = `Bonus berhasil diklaim. Rp ${formatAmount(amount)}`
    showSuccessModal.value = true
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isClaimingBonus.value = false
  }
}

onMounted(() => {
  fetchAttendance()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #050510;
  color: #ffffff;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  max-width: 412px;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 120vh;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

img {
  display: block;
  max-width: 100%;
}

.text-sm { font-size: 10px; }
.text-md { font-size: 13px; }
.text-lg { font-size: 15px; }
.font-bold { font-weight: 700; }

/* Header Section */
#header-section {
  padding: 13px 20px 20px;
}

.top-nav {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  position: relative;
}

.nav-left {
  position: absolute;
  left: 0;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-container {
  width: 56px;
  height: 57px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.uid {
  font-size: 14px;
  opacity: 0.8;
  color: white;
}

/* Progress Section */
#progress-section {
  padding: 0 16px;
  margin-bottom: 16px;
}

.card {
  background: linear-gradient(180deg, rgba(16, 15, 44, 1) 0%, rgba(15, 19, 46, 1) 48%, rgba(10, 16, 37, 1) 100%);
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(158, 158, 158, 0.25);
  padding: 15px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-title {
  font-size: 15px;
  font-weight: 500;
  color: white;
}

.reward-badge {
  position: relative;
}

.reward-pill {
  background-color: #a296ff;
  border-radius: 10px;
  padding: 2px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
}

.gem-icon-sm {
  width: 25px;
  height: 25px;
}

.reward-text {
  color: #301f80;
  font-size: 13px;
  font-weight: 700;
}

.progress-bar-container {
  margin-bottom: 10px;
}

.progress-track {
  background-color: #746a9a;
  height: 4px;
  border-radius: 15px;
  width: 100%;
  position: relative;
}

.progress-fill {
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30%, #9047E0 100%);
  height: 100%;
  border-radius: 15px;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-text {
  font-size: 11px;
  max-width: 220px;
  color: white;
}

.btn-claim {
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30%, #9047E0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  color: white;
  padding: 4px 15px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

/* Check-in Section */
#checkin-section {
  padding: 0 16px;
  flex: 1;
}

.checkin-card {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.checkin-header {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
}

.header-icon {
  width: 26px;
  height: 27px;
  flex-shrink: 0;
}

.checkin-desc {
  font-size: 13px;
  line-height: 1.4;
  color: white;
  margin: 0;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px 6px;
  width: 100%;
  margin-bottom: 25px;
}

.day-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.day-box {
  width: 100%;
  aspect-ratio: 36/46;
  background: linear-gradient(180deg, rgba(16, 15, 44, 1) 0%, rgba(15, 19, 46, 1) 48%, rgba(10, 16, 37, 1) 100%);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  padding: 5px 0;
}

.day-box.special {
  background: linear-gradient(180deg, rgba(63, 72, 197, 1) 0%, rgba(97, 53, 196, 1) 48%, rgba(144, 71, 224, 1) 100%);
}

.day-icon {
  width: 35px;
  height: 30px;
  object-fit: contain;
}

.day-item:not(:first-child) .day-icon {
  width: 35px;
  height: 30px;
}

.day-amount {
  font-size: 8px;
  font-weight: 500;
  color: #fff;
}

.day-label {
  font-size: 8px;
  color: #fff;
}

.btn-checkin {
  width: 100%;
  height: 43px;
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30%, #9047E0 100%);
  border: 1px solid #746a9a;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 25px;
}

.btn-icon {
  width: 20px;
  height: 18px;
}

.instructions {
  width: 100%;
  font-size: 10px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.instructions h3 {
  font-size: 12px;
  margin: 0 0 5px 0;
  font-weight: 700;
}

.instructions p {
  margin: 0 0 4px 0;
}

/* Footer Section */
#footer-section {
  padding: 20px 16px 30px;
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.powered-by {
  font-size: 10px;
  color: #c4c4c4;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  height: 23px;
  width: auto;
}

.copyright {
  font-size: 10px;
  color: white;
}

.footer-brand {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 20px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.footer-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
  object-position: left;
}

.copyright {
  font-size: 10px;
  color: #fff;
}

.tagline {
  font-size: 10px;
  color: #c4c4c4;
  margin: 0;
}

</style>
