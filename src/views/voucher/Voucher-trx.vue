<!-- <template>
  <div class="app-container">
    <section id="header-section">
      <header class="app-header">
        <div class="header-left" @click="goBack">
          <img src="/assets/images/2023_1661.svg" alt="Back" class="icon-back">
        </div>
        <h1 class="header-title">Catatan menukar</h1>
      </header>
    </section>

    <main class="content-area">
      <LoadingSpinner v-if="loading" :visible="true" :overlay="true" message="" />

      <div v-else-if="displayedTransactions.length === 0" class="empty-state">
        <img src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="No Data" class="empty-icon">

      </div>

      <template v-else>
        <article v-for="(item, idx) in displayedTransactions" :key="getKey(item, idx)" class="transaction-card">
          <div class="card-details">
            <h2 class="card-title">Tukarkan Hadiah</h2>
            <time class="card-date">{{ formatDate(item.created_at || item.date) }}</time>
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
</template> -->
<script setup>
import { ref, onMounted, computed } from 'vue'
import { transactionAPI } from '@/services/api'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const loading = ref(false)
const transactions = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(20)
const totalPages = ref(1)
const isServerSidePagination = ref(true)

const displayedTransactions = computed(() => {
  if (isServerSidePagination.value) {
    return transactions.value
  } else {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return transactions.value.slice(start, end)
  }
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (e) {
    return dateString
  }
}

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0'
  const numVal = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value)
  if (!Number.isFinite(numVal)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numVal)
}

const getTitle = (item) => item?.title || item?.voucher_name || item?.reward_name || item?.description || 'Tukarkan hadiah'

const getKey = (item, idx) => {
  const v = item?.id ?? item?.trx_id ?? item?.voucher_code ?? idx
  return String(v)
}

const fetchTransactions = async (page = 1) => {
  loading.value = true
  try {
    const response = await transactionAPI.getTransactions({ 
      type: 'VOUCHER',
      page: page,
      page_size: itemsPerPage.value
    })
    
    if (response.data && Array.isArray(response.data.results)) {
      // Case 1: Server-side pagination supported
      isServerSidePagination.value = true
      transactions.value = response.data.results
      
      if (response.data.count !== undefined) {
        const count = parseInt(response.data.count)
        totalPages.value = Math.ceil(count / itemsPerPage.value) || 1
      }
      
      // Fallback: if next link exists but we calculated 1 page
      if (response.data.next && totalPages.value <= page) {
        totalPages.value = page + 1
      }
      
      currentPage.value = page
      
    } else if (Array.isArray(response.data)) {
      // Case 2: API returns flat array (all data) - Switch to Client-side pagination
      isServerSidePagination.value = false
      transactions.value = response.data
      totalPages.value = Math.ceil(response.data.length / itemsPerPage.value) || 1
      // For client-side, we reset to page 1 if we just fetched fresh data, 
      // or keep requested page if within bounds (logic handled by caller usually)
      if (page === 1) currentPage.value = 1
    } else {
      transactions.value = []
      totalPages.value = 1
    }
  } catch (error) {
    console.error('Failed to fetch voucher transactions:', error)
    transactions.value = []
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    if (isServerSidePagination.value) {
      fetchTransactions(currentPage.value + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      currentPage.value++
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    if (isServerSidePagination.value) {
      fetchTransactions(currentPage.value - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      currentPage.value--
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

onMounted(() => {
  fetchTransactions(1)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background-color: #000;
  background-image: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  color: #ffffff;
}

* {
  box-sizing: border-box;
}

p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

.app-header {
  display: flex;
  align-items: center;
  padding: 20px 11px;
  position: relative;
  height: 64px;
}

.header-left {
  position: relative;
  z-index: 2;
  cursor: pointer;
}

.icon-back {
  width: 24px;
  height: 24px;
  display: block;
  cursor: pointer;
}

.header-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  color: #ffffff;
  z-index: 1;
  white-space: nowrap;
  pointer-events: none;
}

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

.empty-state p {
  font-size: 14px;
  color: #a0a0a0;
  text-align: center;
}

.empty-icon {
  width: 140px;
  height: auto;
  display: block;
  opacity: 0.9;
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
