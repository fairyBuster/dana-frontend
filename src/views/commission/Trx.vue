<template>
  <div class="trx-page">
    <!-- Header -->
    <section id="section-header">
      <header class="top-nav">
        <button type="button" class="back-btn" aria-label="Kembali" @click="goBack">
          <img src="/assets/images/34_100.svg" alt="">
        </button>
        <h1 class="nav-title">Riwayat</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-content">
        <h2 class="page-title">Riwayat</h2>
        <p class="page-subtitle">Lihat semua aktivitas transaksi Anda.</p>
      </div>
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
      <div v-if="!isLoading && commissions.length === 0" class="empty-state">
        <img src="/assets/images/empty.jpg" alt="" class="empty-icon">
        <p class="empty-text">Belum ada transaksi.</p>
      </div>

      <div class="history-list">
        <article v-for="commission in commissions" :key="commission.id" class="history-card">
          <div class="card-icon-wrapper">
            <div class="icon-bg"></div>
            <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="" class="icon-img">
          </div>
          <div class="card-details">
            <h3 class="card-title">Bonus dari {{ commission.memberId }}<br>{{ commission.productName }}</h3>
            <span class="card-date">{{ commission.date }}</span>
          </div>
          <div class="card-amount">{{ commission.amount }}</div>
        </article>
      </div>

      <div v-if="commissions.length > 0 && hasMore" class="pagination-row">
        <PaginationBar
          :page="1"
          :total-pages="1"
          :has-prev="false"
          :has-next="hasMore"
          :loading="isLoading"
          @change="loadMore"
        />
      </div>
    </section>

    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
    <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()
const route = useRoute()

const commissions = ref([])
const allCommissions = ref([])
const errorModalOpen = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const pageSize = 20
const visibleCount = ref(pageSize)
const hasMore = ref(true)
const nextFetchPage = ref(1)

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

const goBack = () => {
  router.push('/hn/home')
}

const selectFilter = (item) => {
  if (item?.to) router.push(item.to)
}

const COMMISSION_TYPES = ['PURCHASE_COMMISSION', 'PROFIT_COMMISSION']

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

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal memuat data, silakan coba lagi'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal memuat data, silakan coba lagi'
}

const normalizeTransactionsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const mapTransactionToCommission = (trx) => {
  const memberId = trx?.upline_phone || trx?.user_phone || trx?.trx_id || '-'
  const productName = trx?.product_name || trx?.description || 'Komisi anggota'
  return {
    id: trx?.id ?? trx?.trx_id,
    memberId,
    productName,
    date: formatDateTime(trx?.created_at),
    amount: formatUSD(trx?.amount),
    createdAtRaw: trx?.created_at || null
  }
}

const isCommissionTransaction = (trx) => {
  const t = String(trx?.type || '').toUpperCase()
  return COMMISSION_TYPES.includes(t)
}

const dedupeAndMap = (transactions) => {
  const seen = new Set()
  const mapped = []
  for (const trx of transactions) {
    const key = trx?.id ?? trx?.trx_id
    if (key === null || key === undefined) continue
    const k = String(key)
    if (seen.has(k)) continue
    seen.add(k)
    mapped.push({ trx, mapped: mapTransactionToCommission(trx) })
  }
  mapped.sort((a, b) => {
    const da = new Date(a.trx?.created_at || 0).getTime()
    const db = new Date(b.trx?.created_at || 0).getTime()
    return db - da
  })
  return mapped.map((x) => x.mapped)
}

const fetchPageByType = async (type, page) => {
  const resp = await transactionAPI.getTransactions({ type, page, page_size: pageSize })
  return normalizeTransactionsResponse(resp?.data)
}

const loadPage = async (page) => {
  if (isLoading.value) return false
  isLoading.value = true
  errorModalOpen.value = false
  errorMessage.value = ''
  try {
    const settled = await Promise.allSettled(COMMISSION_TYPES.map((t) => fetchPageByType(t, page)))
    const combined = settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    const filtered = combined.filter(isCommissionTransaction)
    if (!filtered.length) return false
    const mapped = dedupeAndMap(filtered)
    const seen = new Set(allCommissions.value.map((x) => String(x.id)))
    const append = mapped.filter((m) => !seen.has(String(m.id)))
    if (append.length) {
      const merged = [...allCommissions.value, ...append]
      merged.sort((a, b) => {
        const da = new Date(a?.createdAtRaw || 0).getTime()
        const db = new Date(b?.createdAtRaw || 0).getTime()
        return db - da
      })
      allCommissions.value = merged
      return true
    }
    return false
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    errorModalOpen.value = true
    return false
  } finally {
    isLoading.value = false
  }
}

const fetchCommissionTransactions = async () => {
  commissions.value = []
  allCommissions.value = []
  nextFetchPage.value = 1
  hasMore.value = true
  visibleCount.value = pageSize

  let tries = 0
  while (allCommissions.value.length < visibleCount.value && tries < 5) {
    const ok = await loadPage(nextFetchPage.value)
    if (ok) nextFetchPage.value += 1
    tries += 1
    if (!ok) break
  }
  commissions.value = allCommissions.value.slice(0, visibleCount.value)
  hasMore.value = allCommissions.value.length >= visibleCount.value
}

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return
  visibleCount.value += pageSize
  let tries = 0
  while (allCommissions.value.length < visibleCount.value && tries < 5) {
    const ok = await loadPage(nextFetchPage.value)
    if (ok) nextFetchPage.value += 1
    tries += 1
    if (!ok) break
  }
  commissions.value = allCommissions.value.slice(0, visibleCount.value)
  hasMore.value = allCommissions.value.length >= visibleCount.value
}

onMounted(() => {
  fetchCommissionTransactions()
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

button {
  font-family: inherit;
}

/* Header */
#section-header .top-nav {
  display: flex;
  align-items: center;
  padding: 24px 22px 16px;
  gap: 16px;
}

#section-header .back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.nav-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

/* Hero */
#section-hero .hero-content {
  padding: 16px 22px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 12px;
  color: #635f5f;
  font-weight: 400;
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
  flex-wrap: wrap;
  gap: 6px;
}

.filter-chip {
  width: 88px;
  height: 30px;
  padding: 0;
  border-radius: 10px;
  border: 1px solid #cfcfcf;
  background-color: #fefefe;
  color: #000000;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
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
  position: relative;
  width: 51px;
  height: 43px;
  flex-shrink: 0;
}

.icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #e2ecff;
  border-radius: 5px;
}

.icon-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 29px;
  height: 29px;
  object-fit: contain;
}

.card-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: #060606;
  line-height: 1.3;
}

.card-date {
  font-size: 10px;
  color: #7d7d7d;
  font-weight: 400;
}

.card-amount {
  font-size: 12px;
  font-weight: 700;
  color: #20407c;
  white-space: nowrap;
}

/* Empty State */
.empty-state {
  padding: 40px 22px;
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
  padding: 0 22px 32px;
}
</style>
