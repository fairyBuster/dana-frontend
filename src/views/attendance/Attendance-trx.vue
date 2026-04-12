<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <header class="app-header">
        <div class="icon-container" @click="goBack">
          <img src="/assets/image/178_1322.svg" alt="Back" class="back-icon">
        </div>
        <h1 class="page-title">Catatan kehadiran</h1>
        <div class="header-spacer"></div>
      </header>
    </section>

    <!-- Transaction List Section -->
    <section id="section-transaction-list">
      <div v-if="!attendances.length" class="empty-state">
        <img src="/assets/image/empty.png" alt="No Data" class="empty-icon">
       
        <div v-if="loadError" class="empty-sub">{{ loadError }}</div>
      </div>
      <div v-for="attendance in attendances" :key="attendance.id" class="card">
        <div class="card-details">
          <h2 class="card-title">Masuk hari ini</h2>
          <div class="card-date">{{ attendance.date }}</div>
        </div>
        <div class="card-amount">{{ formatCurrency(attendance.amount) }}</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { attendanceAPI, transactionAPI } from '@/services/api'

const router = useRouter()

const attendances = ref([])
const loadError = ref('')
const status = ref(null)
const settings = ref(null)

const goBack = () => {
  router.go(-1)
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value) => {
  const num = parseNumber(value)
  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
  return `${formatted}`
}

const parseIntSafe = (v) => {
  const n = Number(String(v || '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const cycleDays = computed(() => {
  const fromStatus = parseIntSafe(status.value?.cycle_days)
  if (fromStatus > 0) return fromStatus
  const fromSettings = parseIntSafe(settings.value?.daily_cycle_days)
  return fromSettings > 0 ? fromSettings : 0
})

const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(d)
}

const mapTrxToAttendance = (trx) => {
  const title = trx?.description || trx?.type || 'Attendance'
  return {
    id: trx?.id ?? trx?.trx_id ?? `${trx?.type || 'ATT'}-${trx?.created_at || ''}`,
    title,
    date: formatDateTime(trx?.created_at),
    amount: parseNumber(trx?.amount),
    createdAtRaw: trx?.created_at || null
  }
}

const looksLikeAttendance = (trx) => {
  const t = String(trx?.type || '').toUpperCase()
  if (t === 'ATTENDANCE') return true
  const desc = String(trx?.description || '').toLowerCase()
  return desc.includes('attendance') || desc.includes('kehadiran') || desc.includes('masuk hari') || desc.includes('check in') || desc.includes('check-in')
}

const normalizeTransactionsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const fetchCycleContext = async () => {
  try {
    const [streakResp, activeResp] = await Promise.all([
      attendanceAPI.getStreak(),
      attendanceAPI.getActiveSettings()
    ])
    status.value = streakResp?.data || null
    settings.value = activeResp?.data || null
  } catch (_) {
    status.value = null
    settings.value = null
  }
}

const fetchAttendanceTransactions = async () => {
  loadError.value = ''
  try {
    const resp = await transactionAPI.getTransactions({ type: 'ATTENDANCE', page: 1 })
    const results = normalizeTransactionsResponse(resp?.data)
    const mapped = results.filter(looksLikeAttendance).map(mapTrxToAttendance)
    if (mapped.length) {
      assignDayTitles(mapped)
      return
    }
  } catch (err) {
    loadError.value = err?.response?.data?.detail || err?.message || 'Gagal mengambil data'
  }

  try {
    const resp = await transactionAPI.getTransactions({ page: 1 })
    const results = normalizeTransactionsResponse(resp?.data)
    const mapped = results.filter(looksLikeAttendance).map(mapTrxToAttendance)
    assignDayTitles(mapped)
  } catch (err) {
    if (!loadError.value) loadError.value = err?.response?.data?.detail || err?.message || 'Gagal mengambil data'
    attendances.value = []
  }
}

const assignDayTitles = (items) => {
  const list = Array.isArray(items) ? items.slice() : []
  // Sort by created_at ascending to assign day index from oldest -> newest
  list.sort((a, b) => {
    const ta = new Date(a.createdAtRaw || a.date).getTime()
    const tb = new Date(b.createdAtRaw || b.date).getTime()
    return ta - tb
  })
  const seenDates = new Set()
  let dayIdx = 0
  for (const it of list) {
    const d = new Date(it.createdAtRaw || it.date)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const key = `${y}-${m}-${day}`
    if (!seenDates.has(key)) {
      dayIdx += 1
      seenDates.add(key)
    }
    const total = cycleDays.value
    const currentDay = total > 0 ? ((dayIdx - 1) % total) + 1 : dayIdx
    it.title = `Masuk hari ${currentDay} hadiah`
  }
  // Sort back to newest first for display
  list.sort((a, b) => {
    const ta = new Date(a.createdAtRaw || a.date).getTime()
    const tb = new Date(b.createdAtRaw || b.date).getTime()
    return tb - ta
  })
  attendances.value = list.map(({ createdAtRaw, ...rest }) => rest)
}

onMounted(() => {
  fetchCycleContext().finally(fetchAttendanceTransactions)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  min-height: 100vh;
  background-color: #121212;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  color: #ffffff;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

img {
  display: block;
  max-width: 100%;
}

.app-container {
  width: 100%;
  max-width: 412px;
  display: flex;
  flex-direction: column;
}

/* Header Section */
#section-header {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 10px;
}

.app-header {
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  padding: 0 16px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-icon {
  width: 24px;
  height: 24px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  margin: 0;
  white-space: nowrap;
}

.header-spacer {
  width: 24px;
}

/* Transaction List Section */
#section-transaction-list {
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  padding: 18px 14px;
  border-radius: 10px;
 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-icon {
  width: 140px;
  height: auto;
  display: block;
  opacity: 0.9;
}

.empty-title {
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
}

.empty-sub {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  line-height: 1.35;
}

.card {
  background-color: #1d2138;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  color: #a296ff;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.card-date {
  color: #ffffff;
  font-size: 11px;
  opacity: 0.9;
  line-height: 1.2;
}

.card-amount {
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  margin-top: -20px;
  margin-left: auto;
  text-align: right;
  align-self: flex-start;
}
</style>
