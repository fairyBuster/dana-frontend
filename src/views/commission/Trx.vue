<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <a href="#/hn/user" class="back-btn" aria-label="Go to profile">
          <img src="/assets/image/4252_299.svg" alt="Back">
        </a>
        <button type="button" ref="menuAnchorEl" class="title-group" @click.stop="toggleRecordMenu">
          <h1>{{ currentRecordLabel }}</h1>
          <img
            src="/assets/image/4252_317.svg"
            alt="Toggle dropdown"
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

    <!-- Commission List -->
    <section id="section-commission-list">
      <div class="table-header">
        <div class="col-status">Status</div>
        <div class="col-amount">Amount</div>
        <div class="col-type">Type</div>
      </div>

      <div v-if="commissions.length === 0 && !isLoading" class="empty-state">
        <p class="empty-text">No commission records yet</p>
      </div>

      <div class="list-body">
        <div v-for="commission in commissions" :key="commission.id" class="list-item">
          <div class="col-status status-success">Succeed</div>
          <div class="col-amount font-bold">{{ commission.amount }}</div>
          <div class="col-type">
            <div class="type-phone">{{ commission.memberId }}</div>
            <div class="type-date">{{ commission.date }}</div>
          </div>
        </div>
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
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
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

/* Record menu dropdown */
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

const goBack = () => {
  router.go(-1)
}

const COMMISSION_TYPES = ['PURCHASE_COMMISSION', 'PROFIT_COMMISSION']

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
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}.${pad2(d.getMinutes())}`
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Request failed, please refresh the page'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Request failed, please refresh the page'
}

const mapTransactionToCommission = (trx) => {
  const memberId = trx?.upline_phone || trx?.user_phone || trx?.trx_id || '-'
  return {
    id: trx?.id ?? trx?.trx_id,
    memberId: memberId,
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
        const da = new Date(a?.createdAtRaw || a?.date || 0).getTime()
        const db = new Date(b?.createdAtRaw || b?.date || 0).getTime()
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
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
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
  background-color: #f8f8f8;
  max-width: 412px;
  min-height: 100vh;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

h1, p {
  margin: 0;
}

/* Header */
#section-header {
  width: 100%;
}

.app-header {
  display: flex;
  align-items: center;
  padding: 18px 16px;
  position: relative;
  min-height: 60px;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.back-btn img {
  width: 20px;
  height: 20px;
  display: block;
}

.title-group {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
  position: relative;
}

.title-group h1 {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
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

/* Commission List */
#section-commission-list {
  padding: 8px 16px 32px 16px;
  min-height: calc(100vh - 64px);
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 12px 16px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #000000;
}

.col-status { text-align: left; }
.col-amount { text-align: center; }
.col-type { text-align: right; }

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.list-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
  align-items: center;
  padding: 16px 8px;
  position: relative;
}

.list-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 8px;
  right: 8px;
  border-bottom: 1px dotted #888888;
}

.status-success {
  color: #0cb300;
  font-size: 13px;
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
  font-size: 13px;
  color: #010101;
  text-align: center;
}

.col-type {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.type-phone {
  font-size: 13px;
  font-weight: 600;
  color: #010101;
  margin-bottom: 4px;
}

.type-date {
  font-size: 11px;
  color: rgba(1, 1, 1, 0.4);
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px 0 0;
}
</style>
