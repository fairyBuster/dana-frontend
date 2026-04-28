<template>
  <div class="app-container">
    <section id="section-header">
      <header class="header-content">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/37_53.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Riwayat penarikan</h1>
      </header>
    </section>

    <section id="section-history-list">
      <div v-if="!isLoading && transactions.length === 0" class="empty-state">
        <p class="empty-text">Belum ada riwayat penarikan</p>
      </div>

      <div class="history-list">
        <article v-for="transaction in transactions" :key="transaction.id" class="history-card">
          <div class="card-date">Date trx: {{ transaction.date }}</div>
          <div class="card-body">
            <img
              class="card-icon"
              src="/assets/images/6654fac0bc0ae58a8a9019ca9e89e747fe3de1c2.png"
              alt="Transaction Icon"
            >
            <div class="card-details">
              <div class="details-top">
                <div class="details-left">
                  <h2 class="status-text">{{ transaction.status }}</h2>
                  <div class="amount-text">{{ formatCurrency(transaction.amount) }}</div>
                </div>
                <span class="after-fee-text">{{ transaction.afterFeeText }}</span>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="bank-info">{{ maskName(transaction.accountName) }}<br>{{ transaction.bankName }}</div>
            <div class="account-info">{{ maskAccountNumber(transaction.accountNumber) }}<br>No. Rekening</div>
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
  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { computed, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { withdrawalAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'

const router = useRouter()

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

const goBack = () => {
  router.go(-1)
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal mengambil data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal mengambil data'
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
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

const maskAccountNumber = (value) => {
  const raw = String(value ?? '').trim()
  if (!raw || raw === '-') return '-'
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 6) {
    return raw.replace(/.(?=.{2})/g, '*')
  }
  const head = digits.slice(0, 2)
  const tail = digits.slice(-2)
  const masked = `${head}${'*'.repeat(Math.max(2, digits.length - 4))}${tail}`
  return masked
}

const maskName = (value) => {
  const raw = String(value ?? '').trim()
  if (!raw || raw === '-') return '-'
  const parts = raw.split(/\s+/).filter(Boolean)
  const maskedParts = parts.map((p) => {
    if (p.length <= 1) return '*'
    if (p.length === 2) return `${p[0]}*`
    return `${p[0]}${'*'.repeat(p.length - 2)}${p[p.length - 1]}`
  })
  return maskedParts.join(' ')
}

const mapStatus = (status) => {
  const s = String(status || '').toUpperCase()
  if (s === 'COMPLETED' || s === 'SUCCESS' || s === 'PAID') return 'Penarikan sudah terkirim'
  if (s === 'PENDING' || s === 'UNPAID') return 'Permintaan penarikan'
  if (s === 'PROCESSING') return 'Transfer berlangsung'
  if (s === 'FAILED' || s === 'EXPIRED' || s === 'CANCELLED' || s === 'REJECT' || s === 'REJECTED') return 'Penarikan gagal'
  return status || '-'
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
    transactions.value = paged.results.map((t) => ({
      id: t.id ?? t.trx_id ?? `${t.created_at || ''}-${t.amount || ''}`,
      status: mapStatus(t.status),
      date: formatDate(t.created_at),
      amount: t.amount,
      afterFeeText: (() => {
        const amountNum = typeof t.amount === 'string' ? parseFloat(String(t.amount).replace(/[^0-9.-]/g, '')) : Number(t.amount)
        if (!Number.isFinite(amountNum)) return 'Setelah biaya: -'
        const net = Math.max(0, amountNum * 0.9)
        return `Setelah biaya: ${formatCurrency(net)}`
      })(),
      accountName: t.account_name || t.bank_account_name || '-',
      bankName: t.bank_name || '-',
      accountNumber: t.account_number || t.bank_account_number || '-'
    }))
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#section-history-list {
  width: 100%;
  padding-bottom: 24px;
}

/* Header */
.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  background-color: #f8f8f8;
}

.back-button {
  position: absolute;
  left: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
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
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

/* History List */
.history-list {
  padding: 8px 16px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.card-date {
  color: #004d43;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
}

.card-body {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.card-icon {
  width: 31px;
  height: 26px;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: 2px;
}

.card-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.details-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.details-left {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.status-text {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
  line-height: 1.3;
}

.after-fee-text {
  font-size: 10px;
  color: #004d43;
  text-align: right;
  white-space: nowrap;
  line-height: 1.2;
  margin-top: 2px;
}

.amount-text {
  font-size: 14px;
  color: #000000;
  font-weight: 600;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.bank-info,
.account-info {
  font-size: 12px;
  color: #000000;
  line-height: 1.4;
}

.account-info {
  text-align: right;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 16px 24px;
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
