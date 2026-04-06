<!-- <template>
  <main id="ranking-page">
    <section id="header-section">
      <header class="app-header">
        <div class="header-icon" @click="goBack">
          <img src="/assets/img/77_414.svg" alt="Back">
        </div>
        <h1 class="header-title">Peringkat akun</h1>
      </header>
    </section>
    <section id="ranking-info">
      <div class="info-container">
        <div class="info-icon">
          <img src="/assets/img/fd1666934a8869b1349ae080d871c5732a83fb4c.png" alt="Ranking Icon">
        </div>
        <div class="info-text">
          <h2 class="info-title">Daftar peringkat</h2>
          <span class="info-date">{{ currentDate }}</span>
        </div>
      </div>
    </section>
    <section id="top-rankings">
    
      <div class="rank-card">
        <div class="rank-badge">
          <img src="/assets/img/4a2597de718c843c0aaeceb0290f564dec6b008f.png" alt="Rank 1">
        </div>
        <div class="rank-details">
          <span class="username">{{ censorPhone(topUsers[0]?.phone) }}</span>
          <span class="amount">{{ formatCurrency(topUsers[0]?.score) }}</span>
        </div>
      </div>

     
      <div class="rank-card">
        <div class="rank-badge">
          <img src="/assets/img/4ed8104c993fc5169e0ad8467fd2c0fbb7117679.png" alt="Rank 2">
        </div>
        <div class="rank-details">
          <span class="username">{{ censorPhone(topUsers[1]?.phone) }}</span>
          <span class="amount">{{ formatCurrency(topUsers[1]?.score) }}</span>
        </div>
      </div>

    
      <div class="rank-card">
        <div class="rank-badge">
          <img src="/assets/img/470ed3fc4eaaa8a2e79b11775dab40b7c4b9a996.png" alt="Rank 3">
        </div>
        <div class="rank-details">
          <span class="username">{{ censorPhone(topUsers[2]?.phone) }}</span>
          <span class="amount">{{ formatCurrency(topUsers[2]?.score) }}</span>
        </div>
      </div>
    </section>
    <section id="list-rankings">
      <ol class="ranking-list" start="4">
        <li v-for="(user, index) in otherUsers" :key="index">
          <span class="list-username">{{ censorPhone(user.phone) }}</span>
          <span class="list-amount">{{ formatCurrency(user.score) }}</span>
        </li>
      </ol>
    </section>
    <section id="footer-section">
      <p class="footer-text">-Sudah sampai akhir-</p>
    </section>
  </main>
</template> -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const censorPhone = (phone) => {
  if (!phone) return '081234****56'
  const str = String(phone)
  if (str.length <= 8) return str // Too short to censor middle effectively
  // Keep first 4 and last 2, censor middle
  const start = str.substring(0, 4)
  const end = str.substring(str.length - 2)
  return `${start}****${end}`
}

const formatCurrency = (value) => {
  if (!value) return 'IDR 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

// Get current date in DD/MM/YYYY format
const currentDate = computed(() => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  return `${day}/${month}/${year}`
})

// Ranking Data
const rankingData = ref([])

const fetchRanking = async () => {
  try {
    const response = await authAPI.getTopDepositors()
    const data = response.data || []
    // Ensure data is an array
    const list = Array.isArray(data) ? data : (data.results || [])
    
    rankingData.value = list.map(item => ({
      phone: item.phone,
      username: item.username,
      score: item.total_deposit || item.amount || item.score || 0
    }))
  } catch (error) {
    console.error('Failed to fetch top depositors:', error)
    // Fallback to empty or keep initial state if needed
    rankingData.value = [] 
  }
}

onMounted(() => {
  fetchRanking()
})

const topUsers = computed(() => rankingData.value.slice(0, 3))
const otherUsers = computed(() => rankingData.value.slice(3))

// Define props and emits if needed
// defineProps({})
// defineEmits([])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
#ranking-page{
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
body {
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

main {
  width: 100%;
  max-width: 100%;
  background-color: #0d0920;
  position: relative;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}
/* CSS for section section:Header */
#header-section {
    padding: 10px 0px;
    width: 100%;
  }
  
  .app-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 41px; /* Ensure fixed height for vertical centering */
  }

  .header-icon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 41px;
    height: 41px;
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Align icon to left within container */
    cursor: pointer;
    z-index: 10; /* Ensure icon is above title if overlap occurs */
  }

  .header-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    text-align: center;
    color: #ffffff;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
  }

/* CSS for section section:RankingInfo */
#ranking-info {
    padding: 20px 0px;
  }

  .info-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .info-icon {
    width: 31px;
    height: 32px;
    flex-shrink: 0;
  }

  .info-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: #ffffff;
  }

  .info-date {
    font-size: 12px;
    color: #b4b4b4;
  }

/* CSS for section section:TopRankings */
#top-rankings {
    padding: 10px;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .rank-card {
    background: linear-gradient(90deg, #233474 0%, #32489a 100%);
    border-radius: 10px;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    height: 74px;
    position: relative;
  }

  .rank-badge {
    width: 35px;
    height: 35px;
    flex-shrink: 0;
    margin-right: 15px;
  }

  .rank-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex-wrap: wrap;
  }

  .username {
    font-size: 14px;
    color: #ffffff;
    margin-right: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .amount {
    font-size: 14px;
    font-weight: 700;
    color: #ffdd63;
    margin-left: auto;
  }

/* CSS for section section:ListRankings */
#list-rankings {
    padding: 20px 15px;
  }

  .ranking-list {
    list-style: none;
    padding: 0;
    margin: 0;
    counter-reset: rank-counter 3;
  }

  .ranking-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    counter-increment: rank-counter;
  }

  .ranking-list li::before {
    content: counter(rank-counter) ". ";
    color: #ffffff;
    font-size: 14px;
    margin-right: 8px;
    min-width: 20px;
  }

  .list-username {
    font-size: 14px;
    color: #ffffff;
    flex-grow: 1;
  }

  .list-amount {
    font-size: 14px;
    color: #ffffff;
    font-weight: 400;
  }

/* CSS for section section:Footer */
#footer-section {
    padding: 30px 20px 50px;
    text-align: center;
  }

  .footer-text {
    font-size: 12px;
    color: #ffffff;
    opacity: 0.8;
    margin: 0;
  }
</style>
