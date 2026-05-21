<template>
  <div class="trx-page">
    <!-- Top Nav -->
    <section id="section-topnav">
      <div class="mobile-container">
        <header class="top-nav">
          <button class="back-button" aria-label="Go back" @click="goBack">
            <img src="/assets/images/25_265.svg" alt="">
          </button>
          <h1 class="nav-title">Riwayat</h1>
        </header>
      </div>
    </section>

    <!-- Page Header -->
    <section id="section-pageheader">
      <div class="mobile-container">
        <div class="page-header">
          <h2 class="page-title">Riwayat</h2>
          <p class="page-subtitle">Lihat semua aktivitas transaksi Anda.</p>
        </div>
      </div>
    </section>

    <!-- Filter Tabs -->
    <section id="section-filtertabs">
      <div class="mobile-container">
        <div class="filter-tabs">
          <button
            v-for="item in filterItems"
            :key="item.key"
            class="filter-chip"
            :class="{ active: item.key === currentFilterKey }"
            @click="selectFilter(item)"
          >
            {{ item.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- History List -->
    <section id="section-historylist">
      <div class="mobile-container">
        <div v-if="!isLoading && transactions.length === 0" class="empty-state">
          <p class="empty-text">Belum ada transaksi.</p>
        </div>

        <div class="history-list">
          <article v-for="trx in transactions" :key="trx.id" class="history-card">
            <div class="card-left">
              <div class="icon-box">
                <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="" class="icon-img">
              </div>
              <div class="card-info">
                <div class="card-title-status">
                  Tarik tunai<br>
                  Status: {{ trx.statusText }}
                </div>
                <div class="card-date">{{ trx.date }}</div>
              </div>
            </div>
            <div class="card-amount">{{ trx.amount }}</div>
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
      </div>
    </section>
  </div>

  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { computed, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { withdrawalAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const transactions = ref([])
let refreshIntervalId = 0
const pageSize = 20
const currentPage = ref(1)
const totalPages = ref(1)
const hasNext = ref(false)
const hasPrev = ref(false)

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

const showPagination = computed(() => {
  if (isLoading.value) return false
  if (!transactions.value.length) return false
  return hasNext.value || hasPrev.value || totalPages.value > 1
})

const goBack = () => {
  try {
    if (window.history.length > 1) {
      router.back()
      return
    }
  } catch (_) {}
  router.push('/hn/user')
}

const selectFilter = (item) => {
  if (item?.to) router.push(item.to)
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal memuat data, silakan coba lagi'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal memuat data, silakan coba lagi'
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

const mapStatus = (status) => {
  const s = String(status || '').toUpperCase()
  if (s === 'COMPLETED' || s === 'SUCCESS' || s === 'PAID') return 'Sukses dikirim'
  if (s === 'PENDING' || s === 'UNPAID') return 'Menunggu proses'
  if (s === 'PROCESSING') return 'Sedang proses'
  if (s === 'FAILED' || s === 'EXPIRED' || s === 'CANCELLED') return 'Gagal'
  if (s === 'REJECT' || s === 'REJECTED') return 'Dikembalikan'
  return status || '-'
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

const loadPage = async (page, { silent = false } = {}) => {
  if (!silent) {
    isLoading.value = true
    showErrorModal.value = false
    errorMessage.value = ''
  }
  try {
    const resp = await withdrawalAPI.getTransactions({ page })
    const paged = normalizeResponse(resp?.data)
    transactions.value = paged.results.map((t) => ({
      id: t.id ?? t.trx_id ?? `${t.created_at || ''}-${t.amount || ''}`,
      statusText: mapStatus(t.status),
      date: formatDateTime(t.created_at),
      amount: formatUSD(t.amount)
    }))
    currentPage.value = Math.max(1, Number(page || 1))
    hasNext.value = Boolean(paged.next)
    hasPrev.value = Boolean(paged.previous)
    totalPages.value = Math.max(1, Math.ceil((paged.count || 0) / pageSize))
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
    transactions.value = []
    hasNext.value = false
    hasPrev.value = false
    totalPages.value = 1
    currentPage.value = 1
  } finally {
    if (!silent) isLoading.value = false
  }
}

const goToPage = (page) => {
  loadPage(Math.max(1, Number(page || 1)))
}

const refreshFirstPage = async () => {
  if (isLoading.value) return
  if (currentPage.value !== 1) return
  await loadPage(1, { silent: true })
}

const startAutoRefresh = () => {
  if (refreshIntervalId) return
  refreshIntervalId = window.setInterval(() => {
    refreshFirstPage()
  }, 8000)
}

const stopAutoRefresh = () => {
  if (!refreshIntervalId) return
  window.clearInterval(refreshIntervalId)
  refreshIntervalId = 0
}

onMounted(() => {
  loadPage(1)
  startAutoRefresh()
})

onActivated(() => {
  loadPage(1)
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

.mobile-container {
  padding: 0 22px;
}

/* Top Nav */
.top-nav {
  padding: 24px 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 24px;
  height: 24px;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

/* Page Header */
.page-header {
  padding: 0 0 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 13px;
  color: #635f5f;
  margin: 0;
}

/* Filter Tabs */
.filter-tabs {
  padding: 0 0 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
}

.filter-chip {
  padding: 6px 14px;
  border-radius: 10px;
  border: 1px solid #cfcfcf;
  background-color: #fefefe;
  color: #000000;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.filter-chip.active {
  border-color: #f3b73f;
  color: #f3b73f;
}

.filter-chip:hover {
  border-color: #f3b73f;
}

/* History List */
#section-historylist {
  padding-bottom: 40px;
  min-height: calc(100vh - 250px);
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
  justify-content: space-between;
  align-items: center;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-box {
  width: 51px;
  height: 43px;
  background-color: #fef7e3;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.icon-box img {
  width: 29px;
  height: 29px;
  object-fit: contain;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title-status {
  font-size: 13px;
  color: #060606;
  line-height: 1.4;
  font-weight: 500;
}

.card-date {
  font-size: 11px;
  color: #7d7d7d;
}

.card-amount {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  white-space: nowrap;
}

/* Empty State */
.empty-state {
  padding: 40px 0;
  text-align: center;
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
