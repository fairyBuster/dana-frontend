<template>
  <div class="app-screen">
    <!-- Header -->
    <header class="app-header">
      <a class="back-button" href="#/pages/account/account">
        <img src="/assets/image/178_1243.svg" alt="Back">
      </a>
      <h1 class="screen-title">Catatan menarik</h1>
      <div class="header-spacer"></div>
    </header>

    <!-- Transaction List -->
    <section class="transaction-list">
      <div v-if="!isLoading && transactions.length === 0" class="empty-state">
        <img src="/assets/image/empty.png" alt="No Data" class="empty-icon">

      </div>
      <article v-else v-for="transaction in transactions" :key="transaction.id" class="transaction-card">
        <div class="card-content">
          <div class="transaction-info">
            <p :class="['transaction-status', transaction.statusClass]">{{ transaction.status }}</p>
            <p class="transaction-date">{{ transaction.date }}</p>
          </div>
          <div class="transaction-amount">{{ formatCurrency(transaction.amount) }}</div>
        </div>
      </article>
    </section>
  </div>
  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { withdrawalAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()

const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const transactions = ref([])
let refreshIntervalId = 0

const goBack = () => {
  router.go(-1)
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal mengambil data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal mengambil data'
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const mapStatus = (status) => {
  const s = String(status || '').toUpperCase()
  if (s === 'COMPLETED' || s === 'SUCCESS' || s === 'PAID') return 'Pembayaran telah dilakukan'
  if (s === 'PENDING' || s === 'UNPAID') return 'Menunggu pembayaran'
  if (s === 'PROCESSING') return 'Sedang proses transfer'
  if (s === 'FAILED' || s === 'EXPIRED' || s === 'CANCELLED' || s === 'REJECT' || s === 'REJECTED') return 'Dibatalkan'
  return status || '-'
}

const mapStatusClass = (status) => {
  const s = String(status || '').toUpperCase()
  if (s === 'FAILED' || s === 'EXPIRED' || s === 'CANCELLED' || s === 'REJECT' || s === 'REJECTED') return 'status-yellow'
  return 'status-purple'
}

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return 'Rp 0'
  return '' + new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

const fetchWithdrawTransactions = async () => {
  if (isLoading.value) return
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const resp = await withdrawalAPI.getTransactions({ page: 1 })
    const data = resp?.data
    const items = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : [])
    transactions.value = items.map((t) => ({
      id: t.id ?? t.trx_id ?? `${t.created_at || ''}-${t.amount || ''}`,
      status: mapStatus(t.status),
      date: formatDate(t.created_at),
      amount: t.amount,
      statusClass: mapStatusClass(t.status)
    }))
  } catch (err) {
    transactions.value = []
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

const startAutoRefresh = () => {
  if (refreshIntervalId) return
  refreshIntervalId = window.setInterval(() => {
    fetchWithdrawTransactions()
  }, 8000)
}

const stopAutoRefresh = () => {
  if (!refreshIntervalId) return
  window.clearInterval(refreshIntervalId)
  refreshIntervalId = 0
}

onMounted(() => {
  fetchWithdrawTransactions()
  startAutoRefresh()
})

onActivated(() => {
  fetchWithdrawTransactions()
  startAutoRefresh()
})

onDeactivated(() => {
  stopAutoRefresh()
})

onBeforeUnmount(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #000000;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

.app-screen {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px;
  width: 100%;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screen-title {
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #FFFFFF;
  text-align: center;
  flex-grow: 1;
}

.header-spacer {
  width: 24px; /* Balances the back button for centering */
}

/* List Styles */
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 10px;
  width: 100%;
}

.empty-state {
  width: 100%;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-icon {
  width: 140px;
  height: auto;
  display: block;
  opacity: 0.9;
}

.empty-text {
  font-size: 14px;
  color: #a0a0a0;
}

.transaction-card {
  background-color: #1d2138;
  border-radius: 10px;
  width: 100%;
  min-height: 59px;
  display: flex;
  align-items: center;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 13px;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transaction-status {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
}

.status-purple {
  color: #a296ff;
}

.status-yellow {
  color: #ffc156;
}

.transaction-date {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #FFFFFF;
}

.transaction-amount {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #FFFFFF;
  text-align: right;
  white-space: nowrap;
}
</style>
