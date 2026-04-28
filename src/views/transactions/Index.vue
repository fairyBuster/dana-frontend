<template>
  <div class="app-container">
    <section id="section-header">
      <header class="header-container">
        <button class="back-button" @click="goBack" aria-label="Kembali">
          <img src="/assets/images/2018_1480.svg" alt="Back">
        </button>
        <h1 class="page-title">Riwayat lainnya</h1>
      </header>
    </section>

    <section id="section-history-list">
      <div v-if="isLoading" class="loading-state">
        <LoadingSpinner :visible="true" :overlay="false" message="" />
      </div>

      <div v-else-if="displayTransactions.length === 0" class="empty-state">
        <p class="empty-text">Belum ada riwayat transaksi</p>
      </div>

      <div v-else class="list-container">
        <article v-for="(item, idx) in displayTransactions" :key="getKey(item, idx)" class="history-card">
          <time class="card-date">Date trx: {{ formatDate(item.created_at) }}</time>
          <div class="card-content">
            <img src="/assets/images/51c612507498a1350e8a34d624b4f99146ecdfe9.png" alt="" class="card-icon" aria-hidden="true">
            <div class="card-info">
              <h2 class="card-title">{{ getTitle(item) }}</h2>
              <p class="card-amount">{{ formatCurrency(item.amount) }}</p>
            </div>
          </div>
        </article>

        <div v-if="showPagination" class="pagination-controls">
          <PaginationBar
            :page="currentPage"
            :total-pages="totalPages"
            :has-prev="hasPrev"
            :has-next="hasNext"
            :loading="isLoading"
            @change="goToPage"
          />
        </div>
      </div>
    </section>
  </div>
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'

const router = useRouter()
const allTransactions = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const showErrorModal = ref(false)
const errorMessage = ref('')
const PAGE_SIZE = 20
const MAX_PAGES = 200

const ALLOWED_TRANSACTION_TYPES = new Set([
  'MISSIONS',
  'BONUS',
  'VOUCHER',
  'CREDIT',
  'BALANCE_PLUS',
  'DEBIT',
  'BALANCE_MINUS',
  'ATTENDANCE'
])

const filteredTransactions = computed(() => {
  return (allTransactions.value || []).filter((trx) => {
    const t = String(trx?.type || '').toUpperCase()
    return ALLOWED_TRANSACTION_TYPES.has(t)
  })
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredTransactions.value.length / PAGE_SIZE))
})

const hasPrev = computed(() => currentPage.value > 1)
const hasNext = computed(() => currentPage.value < totalPages.value)

const displayTransactions = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  return filteredTransactions.value.slice(start, end)
})

const showPagination = computed(() => {
  if (isLoading.value) return false
  return totalPages.value > 1
})

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value) => {
  const num = parseNumber(value)
  return `Rp ${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)}`
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

const getTitle = (trx) => {
  const t = String(trx?.type || '').toUpperCase()
  const desc = String(trx?.description || '')
  if (t === 'MISSIONS') return 'Tugas berhadiah -Undang teman'
  if (t === 'BONUS') return 'Bonus daftar'
  if (t === 'VOUCHER') return 'Kode voucher'
  if (t === 'CREDIT' || t === 'BALANCE_PLUS') return 'Tambah saldo'
  if (t === 'DEBIT' || t === 'BALANCE_MINUS') return 'Pengurangan saldo'
  if (t === 'ATTENDANCE') return 'Hadiah harian'
  if (desc) return desc
  if (t) return t.replace(/_/g, ' ')
  return 'Aktivitas'
}

const getKey = (item, idx) => {
  const v = item?.id ?? item?.trx_id ?? idx
  return String(v)
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

const goBack = () => {
  try {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/profile')
    }
  } catch (_) {
    router.push('/profile')
  }
}

const fetchTransactions = async () => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''

  try {
    const all = []
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const resp = await transactionAPI.getTransactions({ page, page_size: PAGE_SIZE })
      const paged = normalizeTransactionsResponse(resp?.data)
      if (paged.results?.length) all.push(...paged.results)
      if (!paged.next) break
    }
    allTransactions.value = all
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  } catch (error) {
    errorMessage.value = error?.response?.data?.detail || error?.message || 'Gagal mengambil data'
    showErrorModal.value = true
    allTransactions.value = []
    currentPage.value = 1
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page) => {
  currentPage.value = Math.max(1, Math.min(totalPages.value, Number(page || 1)))
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchTransactions()
})
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

button {
  font-family: inherit;
}

.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
}

/* Header */
#section-header {
  background-color: #f8f8f8;
  display: flex;
  justify-content: center;
  width: 100%;
}

.header-container {
  width: 100%;
  max-width: 412px;
  height: 86px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 21px;
  left: 7px;
  width: 41px;
  height: 41px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.page-title {
  position: absolute;
  top: 30px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  pointer-events: none;
}

/* History List */
#section-history-list {
  background-color: #f8f8f8;
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 86px);
}

.loading-state {
  padding: 40px 0;
  text-align: center;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.list-container {
  width: 100%;
  max-width: 412px;
  padding: 0 13px 20px 13px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.history-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 15px 16px 16px 16px;
  display: flex;
  flex-direction: column;
}

.card-date {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #004d43;
  margin-bottom: 11px;
  line-height: 1.2;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card-icon {
  width: 31px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-title {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
  margin: 0;
  line-height: 1.2;
}

.card-amount {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.2;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  gap: 15px;
  padding: 10px 0;
}

.pagination-btn {
  background-color: #eeeeee;
  border: none;
  color: #004d43;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: 600;
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  background-color: #e0e0e0;
}

.pagination-info {
  color: #000000;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  min-width: 60px;
  text-align: center;
}
</style>
