<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <button class="back-button" @click="goBack">
          <img src="/assets/image/178_1300.svg" alt="Back">
        </button>
        <h1 class="header-title">Catatan lainnya</h1>
        <div class="header-spacer"></div>
      </header>
    </section>
<br>
    <main class="content-area">
      <LoadingSpinner v-if="isLoading" :visible="true" :overlay="true" message="" />

      <div v-else-if="displayedTransactions.length === 0" class="empty-state">
        <img src="/assets/image/empty.png" alt="No Data" class="empty-icon">
     
        
      </div>

      <template v-else>
        <article v-for="(item, idx) in displayedTransactions" :key="getKey(item, idx)" class="transaction-card">
          <div class="card-details">
            <h2 class="card-title">{{ getTitle(item) }}</h2>
            <time class="card-date">{{ formatDate(item.created_at) }}</time>
          </div>
          <div class="card-value">
            <span class="amount">{{ formatCurrency(item.amount) }}</span>
          </div>
        </article>

        <div v-if="totalPages > 1" class="pagination-controls">
          <button class="pagination-btn" @click="prevPage" :disabled="currentPage === 1">
            &lt;
          </button>
          <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
          <button class="pagination-btn" @click="nextPage" :disabled="currentPage === totalPages">
            &gt;
          </button>
        </div>
      </template>
    </main>
  </div>
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const transactions = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalPages = ref(1)
const showErrorModal = ref(false)
const errorMessage = ref('')

const displayedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return transactions.value.slice(start, end)
})

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value) => {
  const num = parseNumber(value)
  return '' + new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const getTitle = (trx) => {
  const t = String(trx?.type || '').toUpperCase()
  const desc = String(trx?.description || '')
  if (t === 'MISSIONS') return 'Selesaikan tantangan'
  if (t === 'BONUS') return 'Keberuntungan'
  if (t === 'CREDIT' || t === 'BALANCE_PLUS') return 'Penambahan saldo'
  if (t === 'DEBIT' || t === 'BALANCE_MINUS') return 'Pengurangan saldo'
  if (desc) return desc
  if (t) return t.replace(/_/g, ' ')
  return 'Aktivitas'
}

const getKey = (item, idx) => {
  const v = item?.id ?? item?.trx_id ?? idx
  return String(v)
}

const goBack = () => {
  try {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/h5/profile')
    }
  } catch (_) {
    router.push('/h5/profile')
  }
}

const fetchTransactions = async () => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  
  try {
    const TYPES = ['MISSIONS', 'DEBIT', 'CREDIT', 'BONUS']
    const settled = await Promise.allSettled(
      TYPES.map((type) => transactionAPI.getTransactions({ type, page: 1, page_size: itemsPerPage.value }))
    )
    const combined = settled.flatMap((r) => {
      if (r.status !== 'fulfilled') return []
      const data = r.value?.data
      if (Array.isArray(data?.results)) return data.results
      if (Array.isArray(data)) return data
      if (Array.isArray(data?.data)) return data.data
      return []
    })
    const deduped = []
    const seenKeys = new Set()
    for (const item of combined) {
      const key = String(item?.id ?? item?.trx_id ?? '')
      if (!key) continue
      if (seenKeys.has(key)) continue
      seenKeys.add(key)
      deduped.push(item)
    }

    deduped.sort((a, b) => {
      const da = new Date(a?.created_at || 0).getTime()
      const db = new Date(b?.created_at || 0).getTime()
      return db - da
    })

    transactions.value = deduped
    totalPages.value = Math.max(1, Math.ceil(transactions.value.length / itemsPerPage.value))
    currentPage.value = 1
    
  } catch (error) {
    errorMessage.value = error?.response?.data?.detail || error?.message || 'Gagal mengambil data'
    showErrorModal.value = true
    transactions.value = []
    totalPages.value = 1
    currentPage.value = 1
  } finally {
    isLoading.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #121212;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top center;
  min-height: 100vh;
  flex-direction: column;
  display: flex;
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

h1, h2, h3, p {
  margin: 0;
}

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

.back-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.back-button img {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  margin: 0;
  flex-grow: 1;
}

.header-spacer {
  width: 24px;
}

/* Content area copied style from voucher */
.content-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  gap: 10px;
}

.transaction-card {
  background-color: #1d2138;
  border-radius: 10px;
  padding: 12px 11px 10px 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.card-title {
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;
  color: #a296ff;
  margin: 0;
}

.card-date {
  font-size: 12px;
  line-height: 15px;
  color: #ffffff;
  display: block;
}

.card-value {
  display: flex;
  align-items: center;
}

.amount {
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  color: #ffffff;
  white-space: nowrap;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
  width: 100%;
  flex-direction: column;
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
  text-align: center;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  gap: 15px;
  padding: 10px 0;
}

.pagination-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: rgba(255, 255, 255, 0.05);
}

.pagination-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.pagination-info {
  color: #fff;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  min-width: 60px;
  text-align: center;
}
</style>
