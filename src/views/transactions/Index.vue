<template>
  <div class="trx-page">
    <!-- Header -->
    <section id="section-header">
      <div class="header-content">
        <button type="button" class="back-icon-btn" aria-label="Kembali" @click="goBack">
          <img src="/assets/images/34_129.svg" alt="" class="back-icon">
        </button>
        <h1 class="header-title">Riwayat</h1>
      </div>
    </section>

    <!-- Title -->
    <section id="section-title">
      <h2 class="main-title">Riwayat</h2>
      <p class="subtitle">Lihat semua aktivitas transaksi Anda.</p>
    </section>

    <!-- Filters -->
    <section id="section-filters">
      <div class="filters-row">
        <button
          v-for="item in filterItems.slice(0, 3)"
          :key="item.key"
          class="filter-chip"
          :class="{ active: item.key === currentFilterKey }"
          @click="selectFilter(item)"
        >
          {{ item.label }}
        </button>
      </div>
      <div class="filters-row">
        <button
          v-for="item in filterItems.slice(3)"
          :key="item.key"
          class="filter-chip"
          :class="{ active: item.key === currentFilterKey }"
          @click="selectFilter(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </section>

    <!-- History List -->
    <section id="section-history">
      <div v-if="isLoading" class="loading-state">
        <LoadingSpinner :visible="true" :overlay="false" message="" />
      </div>

      <div v-else-if="displayTransactions.length === 0" class="empty-state">
        <img src="/assets/images/empty.jpg" alt="" class="empty-icon">
        <p class="empty-text">Belum ada transaksi.</p>
      </div>

      <div v-else class="history-list">
        <article v-for="(item, idx) in displayTransactions" :key="getKey(item, idx)" class="history-card">
          <div class="card-icon-wrapper">
            <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="" class="card-icon">
          </div>
          <div class="card-info">
            <h3 class="card-title">{{ getTitle(item) }}</h3>
            <p class="card-time">{{ formatDateTime(item.created_at) }}</p>
          </div>
          <div class="card-amount">{{ formatUSD(item.amount) }}</div>
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

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()
const route = useRoute()

const allTransactions = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const showErrorModal = ref(false)
const errorMessage = ref('')
const PAGE_SIZE = 20
const MAX_PAGES = 200

const filterItems = [
  { key: 'recharge', label: 'Isi Ulang', to: '/hn/app/charge/history' },
  { key: 'payout', label: 'Tarik Uang', to: '/hn/app/settlement/history' },
  { key: 'mining', label: 'Keuntungan', to: '/hn/hall/outputhall/history' },
  { key: 'commission', label: 'Bonus', to: '/hn/commission/history' },
  { key: 'other', label: 'Lainnya', to: '/hn/user/history' }
]

const currentFilterKey = computed(() => {
  const p = String(route.path || '')
  const normalized = p.startsWith('/hn/') ? p.slice('/hn'.length) : p
  if (normalized.startsWith('/app/charge')) return 'recharge'
  if (normalized.startsWith('/app/settlement')) return 'payout'
  if (normalized.startsWith('/hall/outputhall')) return 'mining'
  if (normalized.startsWith('/commission')) return 'commission'
  return 'other'
})

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

const goBack = () => {
  router.push('/hn/home')
}

const selectFilter = (item) => {
  if (item?.to) router.push(item.to)
}

const pad2 = (n) => String(n).padStart(2, '0')

const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = d.toDateString() === yesterday.toDateString()
  const time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  if (isToday) return `Hari ini, ${time}`
  if (isYesterday) return `Kemarin, ${time}`
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${time}`
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const raw = String(value).trim()
  if (!raw) return 0
  let s = raw.replace(/\s+/g, '').replace(/[^0-9,.-]/g, '')
  const dots = (s.match(/\./g) || []).length
  const commas = (s.match(/,/g) || []).length
  if (dots > 0 && commas > 0) {
    const lastDot = s.lastIndexOf('.')
    const lastComma = s.lastIndexOf(',')
    const decimalSep = lastDot > lastComma ? '.' : ','
    const groupSep = decimalSep === '.' ? ',' : '.'
    s = s.split(groupSep).join('')
    if (decimalSep === ',') s = s.replace(',', '.')
  } else if (dots > 1) {
    s = s.split('.').join('')
  } else if (commas > 1) {
    s = s.split(',').join('')
  } else if (commas === 1 && dots === 0) {
    const idx = s.indexOf(',')
    const digitsAfter = s.length - idx - 1
    if (digitsAfter === 3) s = s.replace(',', '')
    else s = s.replace(',', '.')
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

const formatUSD = (value) => {
  const num = parseNumber(value)
  return formatAppCurrency(num)
}

const getTitle = (trx) => {
  const t = String(trx?.type || '').toUpperCase()
  const desc = String(trx?.description || '')
  if (t === 'MISSIONS') return 'Selesaikan misi saya'
  if (t === 'BONUS') return 'Saldo hadiah'
  if (t === 'VOUCHER') return 'Hadiah spin saya'
  if (t === 'CREDIT' || t === 'BALANCE_PLUS') return 'Saldo hadiah'
  if (t === 'DEBIT' || t === 'BALANCE_MINUS') return 'Potongan saldo'
  if (t === 'ATTENDANCE') return 'Aktivitas absen'
  if (desc) return desc
  if (t) return t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  return 'Aktivitas'
}

const getKey = (item, idx) => {
  const v = item?.id ?? item?.trx_id ?? idx
  return String(v)
}

const normalizeResponse = (data) => {
  if (!data) return { results: [], count: 0, next: null, previous: null }
  if (Array.isArray(data)) return { results: data, count: data.length, next: null, previous: null }
  if (Array.isArray(data.results)) {
    const c = Number(data.count || 0)
    return { results: data.results, count: Number.isFinite(c) ? c : 0, next: data.next || null, previous: data.previous || null }
  }
  return { results: [], count: 0, next: null, previous: null }
}

const fetchTransactions = async () => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const all = []
    for (let page = 1; page <= MAX_PAGES; page += 1) {
      const resp = await transactionAPI.getTransactions({ page, page_size: PAGE_SIZE })
      const paged = normalizeResponse(resp?.data)
      if (paged.results?.length) all.push(...paged.results)
      if (!paged.next) break
    }
    allTransactions.value = all
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  } catch (error) {
    errorMessage.value = error?.response?.data?.detail || error?.message || 'Gagal memuat data, silakan coba lagi'
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.trx-page {
  font-family: 'Inter', sans-serif;
  max-width: 412px;
  margin: 0 auto;
  background-color: #fbfaf7;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, p {
  margin: 0;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
}

/* Header */
#section-header {
  padding: 24px 22px 16px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

/* Title */
#section-title {
  padding: 16px 22px;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 12px;
  color: #635f5f;
}

/* Filters */
#section-filters {
  padding: 8px 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filters-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-chip {
  background-color: #fefefe;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  width: 88px;
  height: 30px;
  font-size: 11px;
  font-weight: 600;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.filter-chip.active {
  border-color: #f3b73f;
  color: #f3b73f;
}

.filter-chip:hover {
  border-color: #f3b73f;
}

/* History */
#section-history {
  padding: 0 22px 40px;
  min-height: calc(100vh - 280px);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-card {
  background-color: #fefffe;
  border-radius: 10px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon-wrapper {
  width: 51px;
  height: 43px;
  background-color: #f3e2ff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.card-icon {
  width: 29px;
  height: 29px;
  object-fit: contain;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #060606;
}

.card-time {
  font-size: 11px;
  color: #7d7d7d;
}

.card-amount {
  font-size: 13px;
  font-weight: 700;
  color: #20407c;
  white-space: nowrap;
}

/* Loading & Empty */
.loading-state {
  padding: 40px 0;
  text-align: center;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-icon {
  width: 160px;
  height: auto;
  display: block;
  margin: 0 auto 12px;
}

.empty-text {
  color: #7d7d7d;
  font-size: 14px;
}

/* Pagination */
.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
