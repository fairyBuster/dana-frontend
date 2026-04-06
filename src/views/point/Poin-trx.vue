<!-- <template>
  <div class="page-container">
    <section id="section-header" class="app-container">
      <header class="top-bar">
        <div class="icon-container" @click="goBack">
          <img src="/assets/img/66_372.svg" alt="Back" class="icon-back">
        </div>
        <h1 class="page-title">Poin saya</h1>
        <div class="icon-container">
          <img src="/assets/img/66_373.svg" alt="Filter" class="icon-filter">
        </div>
      </header>
    </section>

    <section id="section-stats-bar" class="app-container">
      <div class="stats-bar">
        <span class="label-left">Tanggal</span>
        <span class="label-right">Reward terkumpul</span>
      </div>
    </section>

    <section id="section-transaction-list" class="app-container content-container">
      <div class="transaction-list">
        <div v-if="loading" class="loading-state">
          <p></p>
        </div>
        <div v-else-if="transactions.length === 0" class="empty-state">
          <p>Belum ada data</p>
        </div>
        <template v-else>
       
          <div 
            v-for="(item, index) in transactions" 
            :key="index" 
            class="transaction-item"
          >
            <div class="transaction-info">
              <span class="transaction-title">{{ item.description || item.type || 'Tambah poin' }}</span>
              <span class="transaction-date">{{ formatDate(item.created_at) }}</span>
            </div>
            <div class="transaction-amount">{{ formatAmount(item.amount) }} IDR</div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template> -->

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'

const router = useRouter()
const transactions = ref([])
const loading = ref(false)

const goBack = () => {
  router.go(-1)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    // Format: (GMT+07:00) DD/MM/YYYY HH:mm
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `(GMT+07:00) ${day}/${month}/${year} ${hours}:${minutes}`
  } catch (e) {
    return dateString
  }
}

const formatAmount = (value) => {
  if (value === undefined || value === null) return '0'
  // Format: 3.241 (using dot as thousands separator, no decimals if generic IDR)
  // Or match user example "3.241". Assuming it means 3,241 or 3.241? 
  // User example: "3.241 IDR". If it's thousands, it should be 3.241.
  return Number(value).toLocaleString('id-ID')
}

const fetchTransactions = async () => {
  loading.value = true
  try {
    // Fetch transactions with type 'POINT' or generic and let backend filter
    // Assuming 'POINT' is the type for reward points.
    const response = await transactionAPI.getTransactions({ 
      wallet_type: 'POINT',
      page_size: 100 // Fetch reasonably large number for now
    })
    
    if (response.data && Array.isArray(response.data.results)) {
      transactions.value = response.data.results
    } else if (Array.isArray(response.data)) {
      transactions.value = response.data
    } else {
      transactions.value = []
    }
  } catch (error) {
    console.error('Failed to fetch point transactions:', error)
    transactions.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>

<style scoped>
/* Imported Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

/* Base Page Styles */
.page-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0d0920;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

.app-container {
  width: 100%;
  max-width: 100%; /* Typical mobile width */
  background-color: #0d0920;
  position: relative;
  overflow: hidden;
}

.content-container {
  flex: 1; /* Allow content to grow */
}

/* Header */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
  height: 80px;
  position: relative;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.icon-back {
  width: 41px;
  height: 41px;
}

.icon-filter {
  width: 26px;
  height: 26px;
}

/* Stats Bar */
.stats-bar {
  height: 46px;
  width: 100%;
  background: linear-gradient(90deg, rgb(35, 52, 116) 0%, rgb(50, 72, 154) 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
}

.label-left, .label-right {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
}

/* Transaction List */
.transaction-list {
  padding: 15px 13px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transaction-title {
  font-size: 14px;
  font-weight: 400;
}

.transaction-date {
  font-size: 14px;
  font-weight: 400;
  opacity: 0.9;
}

.transaction-amount {
  font-size: 14px;
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
}

/* States */
.loading-state, .empty-state {
  text-align: center;
  padding: 20px;
  color: #a0a0a0;
  font-size: 14px;
}
</style>
