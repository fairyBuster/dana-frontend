<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/2018_1451.svg" alt="Back">
        </button>
        <h1 class="page-title">Riwayat pembelian aset</h1>
      </header>
    </section>

    <section id="section-history-list">
      <div v-if="orders.length === 0 && !isLoading" class="empty-state">
        <p class="empty-text">Belum ada riwayat pembelian</p>
      </div>

      <div class="history-container">
        <article v-for="order in orders" :key="order.id" class="transaction-card">
          <div class="transaction-date">Date trx: {{ order.date }}</div>
          <div class="transaction-details">
            <img class="transaction-icon" src="/assets/images/51c612507498a1350e8a34d624b4f99146ecdfe9.png" alt="Asset Icon">
            <div class="transaction-info">
              <div class="transaction-name">{{ order.orderId }}</div>
              <div class="transaction-price">{{ formatCurrency(order.price) }}</div>
            </div>
          </div>
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
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'
import PaginationBar from '@/components/partials/PaginationBar.vue'

const router = useRouter()

const orders = ref([])
const isLoading = ref(false)
const pageSize = 20
const currentPage = ref(1)
const totalPages = ref(1)
const hasNext = ref(false)
const hasPrev = ref(false)

const showPagination = computed(() => {
  if (isLoading.value) return false
  if (!orders.value.length) return false
  return hasNext.value || hasPrev.value || totalPages.value > 1
})

const goBack = () => {
  router.go(-1)
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return 'Rp 0'
  return `Rp ${new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)}`
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

const loadPage = async (page) => {
  isLoading.value = true
  try {
    const resp = await transactionAPI.getTransactions({ type: 'INVESTMENTS', page })
    const paged = normalizeTransactionsResponse(resp?.data)
    orders.value = paged.results.map((t) => ({
      id: t?.id ?? t?.trx_id ?? `${t?.created_at || ''}-${t?.amount || ''}`,
      orderId: t?.product_name ? `Aktivasi aset ${t.product_name}` : (t?.trx_id || '-'),
      date: formatDateTime(t?.created_at),
      price: t?.amount,
      createdAtRaw: t?.created_at || null
    }))
    currentPage.value = Math.max(1, Number(page || 1))
    hasNext.value = Boolean(paged.next)
    hasPrev.value = Boolean(paged.previous)
    totalPages.value = Math.max(1, Math.ceil((paged.count || 0) / pageSize))
  } catch (_) {
    orders.value = []
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

onMounted(() => {
  loadPage(1)
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70px;
  padding: 20px 16px 0;
  position: relative;
}

.back-button {
  position: absolute;
  left: 7px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.page-title {
  font-size: 15px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  text-align: center;
}

/* History List */
.history-container {
  padding: 0 13px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.transaction-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 15px 16px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.transaction-date {
  color: #004d43;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.transaction-details {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.transaction-icon {
  width: 31px;
  height: 28px;
  object-fit: contain;
  margin-top: 2px;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.transaction-name {
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

.transaction-price {
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 16px 13px 20px;
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
