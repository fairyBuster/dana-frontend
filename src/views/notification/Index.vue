<!-- <template>
  <div class="main-container">
    <section id="section-header" class="main-container">
      <header class="app-header">
        <button class="back-button" @click="router.back()">
          <img src="/assets/img/21_69.svg" alt="Back" width="41" height="41">
        </button>
        <h1 class="page-title">Notifikasi</h1>
      </header>

    <section id="section-notification-list" class="main-container">
      <div class="notification-list">
        <article 
          v-for="item in notifications" 
          :key="item.id" 
          class="notification-item"
        >
          <div class="icon-wrapper">
            <img 
              :src="getNotificationIcon(item.type)" 
              :alt="item.type === 'WITHDRAW' ? 'Money Withdrawal Icon' : 'Money Deposit Icon'" 
              class="notif-icon">
          </div>
          <div class="content-wrapper">
            <h2 class="notif-title">{{ item.name }}</h2>
            <p class="notif-desc">
              {{ item.type === 'WITHDRAW' ? 'Penarikan' : 'Pengisian Saldo' }} sebesar 
              {{ formatCurrency(Math.abs(item.amount)) }} {{ item.type === 'WITHDRAW' ? 'Rupiah sudah terkirim ke akun rekening Anda.' : 'Rupiah telah berhasil' }}
            </p>
            <time class="notif-date">{{ formatDateIndonesia(item.date) }}</time>
          </div>
        </article>
      </div>
    </section>
        </section>
  </div>
</template> -->


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'

const router = useRouter()
const notifications = ref([])

// Format currency
const formatCurrency = (amount) => {
  const n = Number(amount) || 0
  const val = Math.floor(Math.abs(n))
  return `Rp${val.toLocaleString('id-ID')}`
}

// Format date in Indonesian format
const formatDateIndonesia = (dateString) => {
  try {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day} ${month} ${year} ${hours}:${minutes}`
  } catch (e) {
    return dateString
  }
}

// Get notification icon based on type
const getNotificationIcon = (type) => {
  if (type === 'WITHDRAW') {
    return '/assets/img/5de2c766592d83b0a7e85acf2e30f605f05a0cf5.png'
  } else {
    return '/assets/img/0104600baa584b2acff01c7886e7cfc154f222d1.png'
  }
}

// Get transaction title
const getTransactionTitle = (type, item) => {
  const transactionTitles = {
    'WITHDRAW': 'Penarikan Berhasil',
    'DEPOSIT': 'Pengisian Saldo'
  }
  return transactionTitles[type] || item.name || 'Transaksi'
}

// Fetch transactions
const fetchNotifications = async () => {
  try {
    const response = await transactionAPI.getTransactions({})
    const rawData = response.data.results ? response.data.results : response.data

    const allTransactions = Array.isArray(rawData) ? rawData.map(item => {
      const type = String(item.type || 'UNKNOWN').toUpperCase()
      const status = String(item.status || '').toUpperCase()
      return {
        id: item.id || Math.random(),
        name: getTransactionTitle(type, item),
        date: item.created_at || item.date || new Date().toISOString(),
        amount: parseFloat(item.amount) || 0,
        type,
        status
      }
    }) : []

    notifications.value = allTransactions.filter(t => {
      if (t.type === 'DEPOSIT') {
        return t.status === 'COMPLETED'
      }
      return t.type === 'WITHDRAW'
    })
    
    // Sort by date (newest first)
    notifications.value.sort((a, b) => {
      const da = new Date(a.date)
      const db = new Date(b.date)
      return db - da
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    // Fallback to mock data
    const mockData = [
       { id: 1, name: 'Penarikan Berhasil', date: new Date().toISOString(), amount: -50000, type: 'WITHDRAW', status: 'COMPLETED' },
       { id: 2, name: 'Isi Ulang Berhasil', date: new Date(Date.now() - 86400000).toISOString(), amount: 100000, type: 'DEPOSIT', status: 'COMPLETED' }
    ]
    notifications.value = mockData
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0d0920;
  color: #ffffff;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

.main-container {
  width: 100%;
  max-width: 100%;
  background-color: #0d0920;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}
/* CSS for section section:Header */
.app-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px; /* Based on y=12 positioning */
    position: relative;
    width: 100%;
    height: 65px; /* Approximate height based on content */
  }

  .back-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    position: absolute;
    left: 0px; /* Aligned with content padding */
    top: 50%;
    transform: translateY(-50%);
  }

  .page-title {
    font-size: 18px; /* Estimated from height 23px */
    font-weight: 700;
    margin: 0;
    color: #ffffff;
    text-align: center;
  }

/* CSS for section section:NotificationList */
.notification-list {
    display: flex;
    flex-direction: column;
    padding: 20px 14px; /* Top padding adjusted for visual spacing from header */
    gap: 14px; /* Calculated from y positions: 187 - (88 + 85) */
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    width: 100%;
  }

  .icon-wrapper {
    flex-shrink: 0;
    margin-right: 8px; /* Calculated gap ~6px, adjusted for visual breathing room */
  }

  .notif-icon {
    width: 43px;
    height: 43px;
    object-fit: contain;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .notif-title {
    font-size: 16px; /* Estimated from height 20px */
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 2px 0;
    line-height: 1.25;
  }

  .notif-desc {
    font-size: 14px; /* Estimated from height 39px (2 lines) */
    color: #ffffff;
    margin: 0 0 4px 0;
    line-height: 1.4;
  }

  .notif-date {
    font-size: 12px; /* Estimated from height 18px */
    color: #c8c8c8; /* style_5 */
    margin: 0;
  }
</style>
