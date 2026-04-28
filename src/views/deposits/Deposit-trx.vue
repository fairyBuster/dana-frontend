<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/17_14.svg" alt="Back">
        </button>
        <h1 class="page-title">Riwayat isi ulang</h1>
      </header>
    </section>

    <section id="section-transaction-list">
      <div v-if="!isLoading && transactions.length === 0" class="empty-state">
        <p class="empty-text">Belum ada riwayat isi ulang</p>
      </div>

      <div class="transaction-list">
        <article v-for="transaction in transactions" :key="transaction.id" class="transaction-card">
          <div class="transaction-date">Date trx: {{ transaction.date }}</div>
          <div class="transaction-details">
            <div class="transaction-icon">
              <img src="/assets/images/cde3277fa2769528c9be71b8b0840666c070bbdb.png" alt="Transaction Icon">
            </div>
            <div class="transaction-info">
              <p class="transaction-type">Isi ulang</p>
              <p class="transaction-amount">{{ formatCurrency(transaction.amount) }}</p>
            </div>
          </div>
        </article>
      </div>

      <div v-if="showPagination" class="pagination-row">
        <PaginationBar
          :page="currentPage"
          :total-pages="totalPages"
          :has-prev="hasPrev"
          :has-next="hasNext"
          :loading="isLoading"
          @change="goToPage"
        />
      </div>
    </section>
  </div>
  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { depositAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'

const router = useRouter()

const transactions = ref([])
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const pageSize = 20
const currentPage = ref(1)
const totalPages = ref(1)
const hasNext = ref(false)
const hasPrev = ref(false)

const showPagination = computed(() => {
  if (isLoading.value) return false
  if (!transactions.value.length) return false
  return hasNext.value || hasPrev.value || totalPages.value > 1
})

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
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return 'Rp 0'
  return `Rp ${new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)}`
}

const normalizeTransactionsResponse = (data) => {
  if (!data) return { results: [], count: 0, next: null, previous: null }
  if (Array.isArray(data)) return { results: data, count: data.length, next: null, previous: null }
  if (Array.isArray(data.results)) {
    const c = Number(data.count || 0)
    return { results: data.results, count: Number.isFinite(c) ? c : 0, next: data.next || null, previous: data.previous || null }
  }
  return { results: [], count: 0, next: null, previous: null }
}

const mapTitle = (t) => {
  const desc = String(t?.description || '').trim()
  if (desc) return desc
  return 'Isi ulang'
}

const loadPage = async (page) => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const resp = await depositAPI.getTransactions({ page })
    const paged = normalizeTransactionsResponse(resp?.data)
    const completedOnly = paged.results.filter((t) => {
      const s = String(t?.status || t?.state || t?.payment_status || '').toUpperCase()
      return s === 'COMPLETED' || s === 'COMPLATED'
    })
    transactions.value = completedOnly.map((t) => ({
      id: t?.id ?? t?.trx_id ?? `${t?.created_at || ''}-${t?.amount || ''}`,
      title: mapTitle(t),
      date: formatDateTime(t?.created_at),
      amount: t?.amount
    }))
    currentPage.value = Math.max(1, Number(page || 1))
    hasNext.value = Boolean(paged.next)
    hasPrev.value = Boolean(paged.previous)
    totalPages.value = Math.max(1, Math.ceil((paged.count || 0) / pageSize))
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page) => {
  const p = Math.max(1, Number(page || 1))
  loadPage(p)
}

onMounted(() => {
  loadPage(1)
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  min-height: 100vh;
  background-color: #f8f8f8;
  width: 100%;
  max-width: 412px;
  position: relative;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

#section-transaction-list {
  width: 100%;
  padding-bottom: 24px;
}

/* Header Section */
#section-header {
  width: 100%;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 86px;
  position: relative;
  padding: 0 15px;
}

.back-button {
  position: absolute;
  left: 7px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 41px;
  height: 41px;
  object-fit: contain;
}

.page-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

/* Transaction List */
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 0px;
  padding: 0 15px 14px;
}

.transaction-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 5px 16px;
  display: flex;
  flex-direction: column;
}

.transaction-date {
  color: #004d43;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.transaction-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.transaction-icon {
  width: 32px;
  height: 30px;
  flex-shrink: 0;
}

.transaction-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.transaction-type,
.transaction-amount {
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-weight: 500;
}
.transaction-amount {
    color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-weight: 500;
  margin-top: -10px;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0px;
  padding: 0 15px;
}

.load-more-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background-color: #004d43;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
