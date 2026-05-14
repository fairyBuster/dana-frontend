<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <a href="#/hn/user" class="back-btn" aria-label="Go to profile">
          <img src="/assets/image/181_194.svg" alt="Back" class="icon-back">
        </a>
        <button type="button" ref="menuAnchorEl" class="header-title-group" @click.stop="toggleRecordMenu">
          <h1 class="header-title">{{ currentRecordLabel }}</h1>
          <img
            src="/assets/image/4252_211.svg"
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
        <div class="header-spacer"></div>
      </header>
    </section>

    <!-- Record List -->
    <section id="section-record-list">
      <div class="table-header">
        <div class="col-status">Status</div>
        <div class="col-amount">Amount</div>
        <div class="col-type">Type</div>
      </div>

      <div v-if="!isLoading && transactions.length === 0" class="empty-state">
   
      </div>

      <div class="record-list">
        <div v-for="transaction in transactions" :key="transaction.id" class="record-item">
          <div class="col-status status-success">Succeed</div>
          <div class="col-amount amount">{{ transaction.amount }}</div>
          <div class="col-type type-info">
            <div class="type-name">TopUp Balance</div>
            <div class="type-date">{{ transaction.date }}</div>
          </div>
        </div>
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { depositAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
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

const showPagination = computed(() => {
  if (isLoading.value) return false
  if (!transactions.value.length) return false
  return hasNext.value || hasPrev.value || totalPages.value > 1
})

const goBack = () => {
  router.go(-1)
}

const recordMenuOpen = ref(false)
const menuAnchorEl = ref(null)

const recordMenuItems = [
  { key: 'recharge', label: 'Record recharge', to: '/hn/app/charge/history' },
  { key: 'mining', label: 'Mining record', to: '/hn/hall/outputhall/history' },
  { key: 'payout', label: 'Payout record', to: '/hn/app/settlement/history' },
  { key: 'purchase', label: 'Purchase record', to: '/hn/orders' },
  { key: 'commission', label: 'Commision friend', to: '/hn/commission/history' },
  { key: 'other', label: 'Other record', to: '/hn/user/history' }
]

const currentRecordKey = computed(() => {
  const p = String(route.path || '')
  const normalized = p.startsWith('/hn/') ? p.slice('/hn'.length) : p
  if (normalized.startsWith('/app/charge')) return 'recharge'
  if (normalized.startsWith('/hall/outputhall')) return 'mining'
  if (normalized.startsWith('/app/settlement')) return 'payout'
  if (normalized.startsWith('/orders')) return 'purchase'
  if (normalized.startsWith('/commission')) return 'commission'
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

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Request failed, please refresh the page'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Request failed, please refresh the page'
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}.${pad2(d.getMinutes())}`
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const raw = String(value).trim()
  if (!raw) return 0
  let s = raw.replace(/\s+/g, '')
  s = s.replace(/[^0-9,.-]/g, '')
  const dots = (s.match(/\./g) || []).length
  const commas = (s.match(/,/g) || []).length

  if (dots > 0 && commas > 0) {
    const lastDot = s.lastIndexOf('.')
    const lastComma = s.lastIndexOf(',')
    const decimalSep = lastDot > lastComma ? '.' : ','
    const groupSep = decimalSep === '.' ? ',' : '.'
    s = s.split(groupSep).join('')
    if (decimalSep === ',') s = s.replace(',', '.')
  } else if (dots > 1 && commas === 0) {
    s = s.split('.').join('')
  } else if (commas > 1 && dots === 0) {
    s = s.split(',').join('')
  } else if (commas === 1 && dots === 0) {
    const idx = s.indexOf(',')
    const digitsAfter = s.length - idx - 1
    if (digitsAfter === 3) s = s.replace(',', '')
    else s = s.replace(',', '.')
  } else if (dots === 1 && commas === 0) {
    const idx = s.indexOf('.')
    const digitsAfter = s.length - idx - 1
    if (digitsAfter === 3) s = s.replace('.', '')
  }

  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

const getFractionDigitsFromRaw = (value) => {
  if (value === null || value === undefined) return null
  const raw = String(value).trim()
  if (!raw) return null
  const lastDot = raw.lastIndexOf('.')
  const lastComma = raw.lastIndexOf(',')
  const lastSep = Math.max(lastDot, lastComma)
  if (lastSep <= -1) return 0
  const frac = raw.slice(lastSep + 1).replace(/[^0-9]/g, '')
  if (!frac) return 0
  return Math.min(8, frac.length)
}

const formatUSD = (value) => {
  const num = parseNumber(value)
  const rawDecimals = getFractionDigitsFromRaw(value)
  const decimals = rawDecimals === null ? 2 : rawDecimals
  return formatAppCurrency(num, { decimals })
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
  const channel = String(t?.payment_method || t?.channel || t?.payment_channel || '').trim()
  if (channel) return channel
  return 'Recharge'
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
  const p = Math.max(1, Number(page || 1))
  loadPage(p)
}

onMounted(() => {
  loadPage(1)
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
  margin: 0 auto;
  padding: 0;
  min-height: 100vh;
  background-color: #f8f8f8;
  width: 100%;
  max-width: 412px;
  position: relative;
}

h1, p {
  margin: 0;
}

/* Header */
#section-header {
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 16px;
  position: relative;
  min-height: 60px;
}

.back-btn {
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

.icon-back {
  width: 20px;
  height: 20px;
  display: block;
}

.header-title-group {
  display: flex;
  align-items: center;
  gap: 4px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
}

.header-title {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.icon-dropdown {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.icon-dropdown.open {
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

.header-spacer {
  width: 20px;
}

/* Record List */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 5px;
  margin: 10px 15px;
  padding: 10px 15px;
}

.table-header > div {
  font-size: 13px;
  font-weight: 700;
  color: #000000;
}

.col-status {
  flex: 1;
  text-align: left;
}

.col-amount {
  flex: 1;
  text-align: center;
}

.col-type {
  flex: 1.2;
  text-align: right;
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
  padding: 0 15px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 15px;
  border-bottom: 1px dotted #999;
}

.status-success {
  color: #0cb300;
  font-size: 13px;
  font-weight: 600;
}

.amount {
  color: #010101;
  font-size: 13px;
  font-weight: 700;
}

.type-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.type-name {
  color: #010101;
  font-size: 13px;
  font-weight: 600;
}

.type-date {
  color: rgba(1, 1, 1, 0.4);
  font-size: 11px;
  font-weight: 400;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0px;
  padding: 0 15px;
}
</style>
