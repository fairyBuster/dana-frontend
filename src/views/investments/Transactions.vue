<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <button class="back-icon" @click="goBack" aria-label="Back">
          <img src="/assets/images/18_153.svg" alt="Back">
        </button>
        <h1 class="header-title">Riwayat keuntungan</h1>
      </header>
    </section>

    <!-- History List -->
    <section id="section-history-list">
      <div v-if="transactions.length === 0 && !isLoading" class="empty-state">
        <p class="empty-text">Belum ada riwayat transaksi</p>
      </div>

      <div class="history-list">
        <div v-for="transaction in transactions" :key="transaction.id" class="history-card">
          <div class="card-date">Date trx: {{ transaction.date }}</div>
          <div class="card-body">
            <img src="/assets/images/51c612507498a1350e8a34d624b4f99146ecdfe9.png" alt="Transaction Icon" class="card-icon">
            <div class="card-info">
              <div class="card-title">{{ transaction.title }}</div>
              <div class="card-amount">{{ transaction.amount }}</div>
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
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'
import PaginationBar from '@/components/partials/PaginationBar.vue'

const router = useRouter()

const transactions = ref([])
const isLoading = ref(false)
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

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

const formatCurrency = (value) => {
  const num = Number(value || 0)
  if (!Number.isFinite(num)) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
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

const mapToTransaction = (t) => {
  return {
    id: t?.id ?? t?.trx_id ?? `${t?.created_at || ''}-${t?.amount || ''}`,
    date: formatDateTime(t?.created_at),
    title: t?.product_name || t?.description || 'Keuntungan dari nama produk',
    amount: formatCurrency(t?.amount || t?.profit_amount || 0)
  }
}

const loadPage = async (page) => {
  isLoading.value = true
  try {
    const resp = await transactionAPI.getTransactions({ type: 'INTEREST', page })
    const paged = normalizeTransactionsResponse(resp?.data)
    transactions.value = paged.results.map(mapToTransaction)
    currentPage.value = Math.max(1, Number(page || 1))
    hasNext.value = Boolean(paged.next)
    hasPrev.value = Boolean(paged.previous)
    totalPages.value = Math.max(1, Math.ceil((paged.count || 0) / pageSize))
  } catch (err) {
    transactions.value = []
    hasNext.value = false
    hasPrev.value = false
    totalPages.value = 1
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page) => {
  const p = Math.max(1, Number(page || 1))
  loadPage(p)
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  loadPage(1)
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  background-color: #f8f8f8;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

/* Header */
#section-header {
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  background-color: #f8f8f8;
}

.app-header {
  position: relative;
  height: 70px;
  width: 100%;
}

.back-icon {
  position: absolute;
  left: 7px;
  top: 21px;
  width: 41px;
  height: 41px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.back-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 31px;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  line-height: 20px;
  white-space: nowrap;
}

/* History List */
#section-history-list {
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  background-color: #f8f8f8;
  padding: 0 13px 20px 13px;
  min-height: calc(100vh - 86px);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 15px 16px 10px 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.card-date {
  color: #004d43;
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  margin-bottom: 9px;
}

.card-body {
  display: flex;
  align-items: flex-start;
}

.card-icon {
  width: 31px;
  height: 28px;
  object-fit: contain;
  margin-right: 15px;
  margin-top: 2px;
  flex-shrink: 0;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-title {
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.card-amount {
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  margin-top: -1px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 16px;
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
