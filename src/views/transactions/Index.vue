<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <a href="/profile" class="back-btn" aria-label="Go to profile">
          <img src="/assets/image/4252_325.svg" alt="Back" class="icon-back">
        </a>
        <button type="button" ref="menuAnchorEl" class="title-group" @click.stop="toggleRecordMenu">
          <h1>{{ currentRecordLabel }}</h1>
          <img
            src="/assets/image/4252_343.svg"
            alt="Dropdown"
            class="icon-dropdown"
            :class="{ open: recordMenuOpen }"
          >
          <div v-if="recordMenuOpen" class="record-menu" @click.stop>
            <button
              v-for="item in recordMenuItems"
              :key="item.key"
              type="button"
              class="record-menu-item"
              :class="{ active: item.key === currentRecordKey }"
              @click.stop="selectRecord(item)"
            >
              {{ item.label }}
            </button>
          </div>
        </button>
      </header>
    </section>

    <!-- Record List -->
    <section id="section-record-list">
      <div class="record-header">
        <div class="col-status">Status</div>
        <div class="col-amount">Amount</div>
        <div class="col-type">Type</div>
      </div>

      <div v-if="isLoading" class="loading-state">
        <LoadingSpinner :visible="true" :overlay="false" message="" />
      </div>

      <div v-else-if="displayTransactions.length === 0" class="empty-state">
        <p class="empty-text">No transaction records yet</p>
      </div>

      <div v-else class="record-list">
        <template v-for="(item, idx) in displayTransactions" :key="getKey(item, idx)">
          <div class="record-item">
            <div class="col-status success">Succeed</div>
            <div class="col-amount">{{ formatUSD(item.amount) }}</div>
            <div class="col-type">
              <div class="type-name">{{ getTitle(item) }}</div>
              <div class="type-date">{{ formatDate(item.created_at) }}</div>
            </div>
          </div>
          <div v-if="idx < displayTransactions.length - 1" class="separator"></div>
        </template>
      </div>

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
    </section>
  </div>
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'

const router = useRouter()
const route = useRoute()

const allTransactions = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const showErrorModal = ref(false)
const errorMessage = ref('')
const PAGE_SIZE = 20
const MAX_PAGES = 200

/* Record menu dropdown */
const recordMenuOpen = ref(false)
const menuAnchorEl = ref(null)

const recordMenuItems = [
  { key: 'recharge', label: 'Record recharge', to: '/dep/history' },
  { key: 'mining', label: 'Mining record', to: '/portfolio/history' },
  { key: 'payout', label: 'Payout record', to: '/flow/history' },
  { key: 'purchase', label: 'Purchase record', to: '/orders' },
  { key: 'commission', label: 'Commision friend', to: '/commission/history' },
  { key: 'other', label: 'Other record', to: '/trx' }
]

const currentRecordKey = computed(() => {
  const p = String(route.path || '')
  if (p.startsWith('/dep')) return 'recharge'
  if (p.startsWith('/portfolio')) return 'mining'
  if (p.startsWith('/flow')) return 'payout'
  if (p.startsWith('/orders')) return 'purchase'
  if (p.startsWith('/commission')) return 'commission'
  return 'other'
})

const currentRecordLabel = computed(() => {
  const found = recordMenuItems.find((x) => x.key === currentRecordKey.value)
  return found?.label || 'Other record'
})

const toggleRecordMenu = () => {
  recordMenuOpen.value = !recordMenuOpen.value
}

const closeRecordMenu = () => {
  recordMenuOpen.value = false
}

const selectRecord = (item) => {
  closeRecordMenu()
  if (item?.to) router.push(item.to)
}

const onDocumentClick = (e) => {
  if (!recordMenuOpen.value) return
  const anchor = menuAnchorEl.value
  const target = e?.target
  if (anchor && target && anchor.contains(target)) return
  closeRecordMenu()
}

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

const formatUSD = (value) => {
  const num = parseNumber(value)
  return '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}.${pad2(d.getMinutes())}`
}

const getTitle = (trx) => {
  const t = String(trx?.type || '').toUpperCase()
  const desc = String(trx?.description || '')
  if (t === 'MISSIONS') return 'Task hall'
  if (t === 'BONUS') return 'Registration bonus'
  if (t === 'VOUCHER') return 'Envelope'
  if (t === 'CREDIT' || t === 'BALANCE_PLUS') return 'Add balance'
  if (t === 'DEBIT' || t === 'BALANCE_MINUS') return 'Deduct balance'
  if (t === 'ATTENDANCE') return 'Sign in daily'
  if (desc) return desc
  if (t) return t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  return 'Activity'
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
    errorMessage.value = error?.response?.data?.detail || error?.message || 'Failed to fetch data'
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
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
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
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

h1, p {
  margin: 0;
}

/* Header */
#section-header .app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 16px;
  position: relative;
  min-height: 60px;
}

#section-header .back-btn {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  -webkit-tap-highlight-color: transparent;
}

#section-header .icon-back {
  width: 20px;
  height: 20px;
  display: block;
}

#section-header .title-group {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
  position: relative;
}

#section-header .title-group h1 {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

#section-header .icon-dropdown {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

#section-header .icon-dropdown.open {
  transform: rotate(180deg);
}

.record-menu {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  z-index: 50;
}

.record-menu-item {
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  font-family: inherit;
}

.record-menu-item + .record-menu-item {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.record-menu-item.active {
  font-weight: 700;
}

/* Record List */
#section-record-list {
  padding: 10px 15px 20px;
}

.record-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.record-header div {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
}

.col-status {
  text-align: left;
}

.col-amount {
  text-align: center;
}

.col-type {
  text-align: right;
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

.record-list {
  display: flex;
  flex-direction: column;
}

.record-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding: 16px 10px;
}

.record-item .col-status {
  font-size: 13px;
  font-weight: 400;
}

.record-item .col-status.success {
  color: #0cb300;
}

.record-item .col-amount {
  font-size: 13px;
  font-weight: 700;
  color: #010101;
}

.record-item .col-type {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.type-name {
  font-size: 12px;
  font-weight: 600;
  color: #010101;
}

.type-date {
  font-size: 10px;
  color: rgba(1, 1, 1, 0.4);
}

.separator {
  border-bottom: 1px dotted #a0a0a0;
  margin: 0 10px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  padding: 10px 0;
}
</style>
