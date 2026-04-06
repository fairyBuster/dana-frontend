<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="header-section">
      <header class="app-header">
        <div class="header-left" @click="goBack">
          <img src="/assets/image/178_1274.svg" alt="Back" class="icon-back">
        </div>
        <h1 class="header-title">Catatan deposito</h1>
        <div class="header-right"></div>
      </header>
    </section>

    <!-- Content Section -->
    <section id="content-section">
      <div v-if="!isLoading && transactions.length === 0" class="empty-state">
        <img src="/assets/image/empty.png" alt="No Data" class="empty-icon">
       
      </div>
      <div v-for="transaction in transactions" :key="transaction.id" class="transaction-card">
        <div class="card-details">
          <h2 class="card-title">Saldo isi ulang</h2>
          <span class="card-date">{{ transaction.date }}</span>
        </div>
        <div class="card-amount">
          <span>{{ formatCurrency(transaction.amount) }}</span>
        </div>
      </div>
    </section>
  </div>
  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { depositAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'

const router = useRouter()

const transactions = ref([])
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const goBack = () => {
  router.go(-1)
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

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

const normalizeTransactionsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const mapTitle = (t) => {
  const desc = String(t?.description || '').trim()
  if (desc) return desc
  return 'Saldo isi ulang'
}

const fetchDepositTransactions = async () => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const resp = await depositAPI.getTransactions({ page: 1 })
    const items = normalizeTransactionsResponse(resp?.data)
    const completedOnly = items.filter((t) => {
      const s = String(t?.status || t?.state || t?.payment_status || '').toUpperCase()
      return s === 'COMPLETED' || s === 'COMPLATED'
    })
    const mapped = completedOnly
      .map((t) => ({
        id: t?.id ?? t?.trx_id ?? `${t?.created_at || ''}-${t?.amount || ''}`,
        title: mapTitle(t),
        date: formatDateTime(t?.created_at),
        amount: t?.amount,
        createdAtRaw: t?.created_at || null
      }))
      .sort((a, b) => new Date(b.createdAtRaw || 0).getTime() - new Date(a.createdAtRaw || 0).getTime())
    transactions.value = mapped
  } catch (err) {
    transactions.value = []
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDepositTransactions()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  min-height: 100vh;
  background-color: #121212;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
  box-sizing: border-box;
  color: #ffffff;
}

* {
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
#header-section {
  padding: 20px 11px 0px;
}

.app-header {
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin: 0;
  color: #ffffff;
  white-space: nowrap;
}

.header-right {
  /* Placeholder to balance the grid */
}

/* Content Section */
#content-section {
  padding: 20px 10px;
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
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  color: #a296ff;
  margin: 0;
}

.card-date {
  font-size: 11px;
  color: #ffffff;
  opacity: 0.9;
}

.card-amount {
  font-size: 15px;
  font-weight: 400;
  color: #ffffff;
  text-align: right;
}
</style>
