<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <header class="app-header">
        <div class="header-icon" @click="goBack">
          <img src="/assets/image/178_1311.svg" alt="Back">
        </div>
        <h1 class="header-title">Catatan komisi</h1>
        <div class="header-spacer"></div>
      </header>
    </section>

    <!-- Commission List Section -->
    <section id="section-commission-list">
      <div v-if="commissions.length === 0" class="empty-state">
        <img src="/assets/image/empty.png" alt="No Data" class="empty-icon">
   
      </div>
      <div v-for="commission in commissions" :key="commission.id" class="commission-card">
        <div class="card-details">
          <div class="card-id">{{ commission.memberId }}</div>
          <div class="card-date">{{ commission.date }}</div>
        </div>
        <div class="card-amount">{{ formatCurrency(commission.amount) }}</div>
      </div>
      <div v-if="commissions.length > 0 && hasMore" class="pagination-row">
        <button class="load-more-btn" @click="loadMore" :disabled="isLoading">
          Memuat lebih banyak
        </button>
      </div>
    </section>

    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()

const commissions = ref([])
const allCommissions = ref([])
const errorModalOpen = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const pageSize = 20
const visibleCount = ref(pageSize)

const goBack = () => {
  router.go(-1)
}

const COMMISSION_TYPES = ['PURCHASE_COMMISSION', 'PROFIT_COMMISSION']

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value) => {
  const num = parseNumber(value)
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

const normalizeTransactionsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(d)
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, segarkan halaman'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Permintaan gagal, segarkan halaman'
}

const mapTransactionToCommission = (trx) => {
  return {
    id: trx?.id ?? trx?.trx_id,
    memberId: trx?.upline_phone || trx?.user_phone || trx?.trx_id || '-',
    date: formatDateTime(trx?.created_at),
    amount: parseNumber(trx?.amount),
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

const hasMore = ref(true)
const nextFetchPage = ref(1)

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
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  min-height: 100vh;
  background-color: #121212;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  box-sizing: border-box;
}

* {
  box-sizing: inherit;
}

.app-container {
  width: 100%;
  max-width: 412px;
  display: flex;
  flex-direction: column;
}

/* Header Section */
#section-header {
  width: 100%;
  padding-top: 20px;
  padding-left: 11px;
  padding-right: 11px;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 24px;
}

.header-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-icon img {
  width: 100%;
  height: 100%;
  display: block;
}

.header-title {
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #FFFFFF;
  margin: 0;
  text-align: center;
  flex-grow: 1;
}

.header-spacer {
  width: 24px; /* Balances the back icon to ensure title is centered */
}

/* Commission List Section */
#section-commission-list {
  padding: 20px 10px;
  width: 100%;
}

.empty-state {
  width: 100%;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-icon {
  width: 140px;
  height: auto;
  display: block;
  opacity: 0.9;
}

.empty-text {
  font-size: 14px;
  color: #a0a0a0;
}

.commission-card {
  background-color: #1d2138;
  border-radius: 10px;
  width: 100%;
  height: 59px;
  padding: 12px 13px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  margin-bottom: 10px;
}

.card-details {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-id {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 17px;
  color: #a296ff;
  margin-bottom: 4px;
}

.card-date {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 15px;
  color: #ffffff;
}

.card-amount {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 20px;
  color: #ffffff;
  align-self: center;
  font-weight: 400;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.load-more-btn {
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #746a9a 0%, #272434 100%);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 10px 0;
}
</style>
