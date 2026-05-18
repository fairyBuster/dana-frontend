<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button type="button" class="back-btn" aria-label="Go to profile" @click.stop="goToProfile">
          <img src="/assets/image/4252_247.svg" alt="Back" class="back-icon">
        </button>
        <button type="button" ref="menuAnchorEl" class="title-wrapper" @click.stop="toggleRecordMenu">
          <h1 class="page-title">{{ currentRecordLabel }}</h1>
          <img
            src="/assets/image/4252_265.svg"
            alt="Dropdown"
            class="dropdown-icon"
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
      <div class="table-header">
        <div class="col-status">Status</div>
        <div class="col-amount">Amount</div>
        <div class="col-type">Type</div>
      </div>

      <div v-if="!isLoading && transactions.length === 0" class="empty-state">
      
      </div>

      <div class="record-list">
        <div v-for="transaction in transactions" :key="transaction.id" class="record-item">
          <div class="grid-row">
            <div class="col-status" :class="transaction.statusClass">{{ transaction.status }}</div>
            <div class="col-amount">{{ transaction.amount }}</div>
            <div class="col-type">
              <div class="type-name">{{ transaction.channelName }}</div>
              <div class="type-date">{{ transaction.date }}</div>
              <button type="button" class="type-details" @click="openDetails(transaction)">See details</button>
            </div>
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

  <Teleport to="body">
    <div v-if="detailsOpen" class="details-modal-overlay" @click.self="closeDetails">
      <div class="details-modal-container" role="dialog" aria-modal="true" @click.stop>
        <div class="details-modal-details">
          <div class="details-rows">
            <div class="details-row">
              <p class="details-label">Name receiptan</p>
              <p class="details-value">{{ detailsName }}</p>
            </div>
            <div class="details-row">
              <p class="details-label">Address</p>
              <p class="details-value">{{ detailsAddress }}</p>
            </div>
            <div class="details-row">
              <p class="details-label">Phone reservation</p>
              <p class="details-value">{{ detailsPhone }}</p>
            </div>
            <div class="details-row">
              <p class="details-label">Status</p>
              <p class="details-value" :class="detailsStatusClass">{{ detailsStatusText }}</p>
            </div>
          </div>
        </div>

        <div class="details-amount-display">
          <span class="details-amount-value">{{ detailsAmount }}</span>
        </div>

        <button type="button" class="details-btn-close" @click="closeDetails">Close</button>
      </div>
    </div>
  </Teleport>
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

const showPagination = computed(() => {
  if (isLoading.value) return false
  if (!transactions.value.length) return false
  return hasNext.value || hasPrev.value || totalPages.value > 1
})

const goToProfile = () => {
  router.push('/hn/user')
}

const detailsOpen = ref(false)
const selectedTransaction = ref(null)

const openDetails = (transaction) => {
  selectedTransaction.value = transaction || null
  detailsOpen.value = true
}

const closeDetails = () => {
  detailsOpen.value = false
  selectedTransaction.value = null
}

const pickFirstText = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k]
    const s = String(v ?? '').trim()
    if (s) return s
  }
  return '-'
}

const detailsName = computed(() => {
  const raw = selectedTransaction.value?.raw || {}
  return pickFirstText(raw, [
    'bank_account_name',
    'account_name',
    'receiver_name',
    'recipient_name',
    'full_name',
    'name',
    'user_name',
    'username'
  ])
})

const detailsAddress = computed(() => {
  const raw = selectedTransaction.value?.raw || {}
  return pickFirstText(raw, [
    'bank_account_number',
    'account_number',
    'wallet_address',
    'to_address',
    'address',
    'bank_account',
    'bank_number',
    'bank_name'
  ])
})

const detailsPhone = computed(() => {
  const raw = selectedTransaction.value?.raw || {}
  return pickFirstText(raw, ['user_phone', 'phone', 'phone_number', 'mobile'])
})

const detailsStatusText = computed(() => {
  return String(selectedTransaction.value?.status || '-')
})

const detailsStatusClass = computed(() => {
  return String(selectedTransaction.value?.statusClass || '')
})

const detailsAmount = computed(() => {
  return String(selectedTransaction.value?.amount || formatAppCurrency(0, { decimals: 0 }))
})

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
  if (!data) return err?.message || 'Failed to fetch data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Failed to fetch data'
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
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

const mapStatus = (status) => {
  const s = String(status || '').toUpperCase()
  if (s === 'COMPLETED' || s === 'SUCCESS' || s === 'PAID') return { text: 'Finish', cls: 'status-finish' }
  if (s === 'PENDING' || s === 'UNPAID') return { text: 'Waiting list', cls: 'status-waiting' }
  if (s === 'PROCESSING') return { text: 'Sending...', cls: 'status-sending' }
  if (s === 'FAILED' || s === 'EXPIRED' || s === 'CANCELLED' || s === 'REJECT' || s === 'REJECTED') return { text: 'Failure', cls: 'status-failure' }
  return { text: status || '-', cls: '' }
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

const loadPage = async (page, { silent = false } = {}) => {
  if (!silent) {
    isLoading.value = true
    showErrorModal.value = false
    errorMessage.value = ''
  }
  try {
    const resp = await withdrawalAPI.getTransactions({ page })
    const paged = normalizeTransactionsResponse(resp?.data)
    transactions.value = paged.results.map((t) => {
      const mapped = mapStatus(t.status)
      return {
        id: t.id ?? t.trx_id ?? `${t.created_at || ''}-${t.amount || ''}`,
        raw: t || null,
        status: mapped.text,
        statusClass: mapped.cls,
        date: formatDate(t.created_at),
        amount: formatUSD(t.amount),
        channelName: t.payment_method || t.channel || t.bank_name || 'USDT-TRC20'
      }
    })
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
  const p = Math.max(1, Number(page || 1))
  loadPage(p)
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
  document.addEventListener('click', onDocumentClick)
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

.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  background-color: #f8f8f8;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
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
  padding: 18px 16px;
  position: relative;
  min-height: 60px;
}

.back-btn {
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
  z-index: 2;
}

.back-icon {
  width: 20px;
  height: 20px;
  display: block;
}

.title-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
  position: relative;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.dropdown-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.dropdown-icon.open {
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
  width: 100%;
  padding-bottom: 24px;
}

.table-header {
  background-color: #ffffff;
  border-radius: 5px;
  margin: 16px 16px 8px;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.record-list {
  padding: 0 16px;
}

.record-item {
  padding: 16px 0;
  border-bottom: 1px dotted #000000;
}

.grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: start;
}

.record-item .col-status {
  font-size: 12px;
  font-weight: 700;
}

.record-item .col-amount {
  font-size: 12px;
  font-weight: 700;
  color: #010101;
}

.record-item .col-type {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.type-name {
  font-size: 12px;
  font-weight: 500;
  color: #010101;
}

.type-date {
  font-size: 10px;
  font-weight: 400;
  color: rgba(1, 1, 1, 0.4);
}

.type-details {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  cursor: pointer;
  margin-top: 4px;
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
}

/* Status Colors */
.status-finish { color: #0cb300; }
.status-failure { color: #f5311b; }
.status-waiting { color: #3f70e0; }
.status-sending { color: #c57d00; }

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 16px 24px;
}

.details-modal-overlay {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.details-modal-container {
  background-color: #f9f9fc;
  border-radius: 10px;
  width: 343px;
  padding: 24px 18px;
  box-sizing: border-box;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
}

.details-modal-details {
  display: flex;
  margin-bottom: 24px;
  font-size: 12px;
}

.details-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.details-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.details-label,
.details-value {
  margin: 0;
  font-size: 14px;
}

.details-label {
  color: #626262;
  flex: 0 0 46%;
}

.details-value {
  color: #000000;
  flex: 1;
  min-width: 0;
  text-align: right;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.details-amount-display {
  background-color: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 5px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
}

.details-amount-value {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
}

.details-btn-close {
  background: linear-gradient(90deg, #4085e1 0%, #2757b6 100%);
  border-radius: 30px;
  color: #ffffff;
  border: none;
  width: 100%;
  height: 44px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
  transition: opacity 0.2s ease;
  font-family: inherit;
}

.details-btn-close:hover {
  opacity: 0.9;
}
</style>
