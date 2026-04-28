<template>
  <div class="app-container">
    <section id="section-header">
      <header class="header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/37_82.svg" alt="Back">
        </button>
        <h1 class="page-title">Riwayat komisi undangan</h1>
      </header>
    </section>

    <section id="section-history-list">
      <div v-if="commissions.length === 0 && !isLoading" class="empty-state">
        <p class="empty-text">Belum ada riwayat komisi</p>
      </div>

      <main class="history-list">
        <article v-for="commission in commissions" :key="commission.id" class="history-card">
          <p class="card-date">Date trx: {{ commission.date }}</p>
          <div class="card-content">
            <img src="/assets/images/cde3277fa2769528c9be71b8b0840666c070bbdb.png" alt="Commission Icon" class="card-icon">
            <div class="card-details">
              <p class="card-description">{{ commission.description }}</p>
              <p class="card-amount">{{ formatCurrency(commission.amount) }}</p>
            </div>
          </div>
        </article>
      </main>

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
const hasMore = ref(true)
const nextFetchPage = ref(1)

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
  return `Rp ${new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)}`
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
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
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
  const memberId = trx?.upline_phone || trx?.user_phone || trx?.trx_id || '-'
  return {
    id: trx?.id ?? trx?.trx_id,
    description: `Komisi aset dari ${memberId}`,
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
.app-container {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f8f8f8;
  max-width: 412px;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 16px 20px 16px;
  position: relative;
  background-color: #f8f8f8;
}

.back-button {
  position: absolute;
  left: 7px;
  top: 21px;
  width: 41px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
}

.back-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  text-align: center;
}

/* History List */
.history-list {
  padding: 0 13px 20px 13px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  background-color: #f8f8f8;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.history-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 15px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-date {
  color: #004d43;
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon {
  width: 32px;
  height: 30px;
  object-fit: contain;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-description {
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
  margin: 0;
  line-height: 1.2;
}

.card-amount {
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
  margin: 0;
  line-height: 1.2;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 13px 20px;
}

.load-more-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background-color: #004d43;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
