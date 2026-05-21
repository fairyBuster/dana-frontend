<template>
  <div class="trx-page">
    <!-- Header -->
    <section id="section-header">
      <div class="mobile-container">
        <header class="top-header">
          <button class="back-btn" aria-label="Go back" @click="goBack">
            <img src="/assets/images/25_204.svg" alt="">
          </button>
          <span class="header-title">Riwayat</span>
        </header>
      </div>
    </section>

    <!-- Title -->
    <section id="section-title">
      <div class="mobile-container">
        <div class="title-area">
          <h1 class="main-title">Riwayat</h1>
          <p class="subtitle">Lihat semua aktivitas transaksi Anda.</p>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section id="section-filters">
      <div class="mobile-container">
        <nav class="filter-nav" aria-label="Transaction filters">
          <button
            v-for="item in filterItems"
            :key="item.key"
            class="filter-btn"
            :class="{ active: item.key === currentFilterKey }"
            @click="selectFilter(item)"
          >
            {{ item.label }}
          </button>
        </nav>
      </div>
    </section>

    <!-- Transactions -->
    <section id="section-transactions">
      <div class="mobile-container">
        <div v-if="!isLoading && transactions.length === 0" class="empty-state">
          <p class="empty-text">Belum ada transaksi.</p>
        </div>

        <div class="transaction-list">
          <article v-for="trx in transactions" :key="trx.id" class="tx-card">
            <div class="tx-icon-wrapper">
              <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="" class="tx-icon">
            </div>
            <div class="tx-details">
              <h3 class="tx-title">{{ trx.title }}</h3>
              <span class="tx-date">{{ trx.date }}</span>
            </div>
            <div class="tx-amount">{{ trx.amount }}</div>
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
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { depositAPI } from '@/services/api'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()
const route = useRoute()

const transactions = ref([])
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
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

const mapTitle = (t) => {
  const desc = String(t?.description || '').trim()
  if (desc) return desc
  const channel = String(t?.payment_method || t?.channel || t?.payment_channel || '').trim()
  if (channel) return channel
  return 'Isi ulang berhasil'
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

const loadPage = async (page) => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const resp = await depositAPI.getTransactions({ page })
    const paged = normalizeResponse(resp?.data)
    const completedOnly = paged.results.filter((t) => {
      const s = String(t?.status || t?.state || t?.payment_status || '').toUpperCase()
      return s === 'COMPLETED' || s === 'COMPLATED'
    })
    transactions.value = completedOnly.map((t) => ({
      id: t?.id ?? t?.trx_id ?? `${t?.created_at || ''}-${t?.amount || ''}`,
      title: mapTitle(t),
      date: formatDateTime(t?.created_at),
      amount: formatUSD(t?.amount)
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
  loadPage(Math.max(1, Number(page || 1)))
}

onMounted(() => {
  loadPage(1)
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

button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  outline: none;
}

/* Header */
.top-header {
  display: flex;
  align-items: center;
  padding: 48px 0 20px 0;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
}

.back-btn img {
  width: 100%;
  height: 100%;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

/* Title */
.title-area {
  padding: 10px 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  line-height: 1.2;
}

.subtitle {
  font-size: 12px;
  color: #635f5f;
  font-weight: 400;
}

/* Filters */
.filter-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 32px;
}

.filter-btn {
  height: 30px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  background-color: #fefefe;
  border: 1px solid #cfcfcf;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.filter-btn.active {
  border-color: #f3b73f;
  color: #f3b73f;
}

.filter-btn:hover {
  border-color: #f3b73f;
}

/* Transactions */
#section-transactions {
  padding-bottom: 40px;
  min-height: calc(100vh - 250px);
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tx-card {
  display: flex;
  align-items: center;
  background-color: #fefffe;
  border-radius: 10px;
  padding: 14px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
  min-height: 70px;
}

.tx-icon-wrapper {
  width: 51px;
  height: 43px;
  background-color: #bfe9cf;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 14px;
}

.tx-icon {
  width: 29px;
  height: 29px;
  object-fit: contain;
}

.tx-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 4px;
  justify-content: center;
}

.tx-title {
  font-size: 14px;
  font-weight: 600;
  color: #060606;
  line-height: 1.2;
}

.tx-date {
  font-size: 11px;
  color: #7d7d7d;
  font-weight: 400;
}

.tx-amount {
  font-size: 14px;
  font-weight: 700;
  color: #008332;
  white-space: nowrap;
  margin-left: 10px;
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
