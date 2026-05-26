<template>
  <div class="notification-page">
    <section id="section-header">
      <header class="header">
        <button class="back-btn" aria-label="Go back" @click="goBack">
          <img src="/assets/images/18_96.svg" alt="" aria-hidden="true">
        </button>
        <h1 class="header-title">Notifikasi</h1>
      </header>
    </section>

    <section id="section-notifications">
      <div class="notifications-list">
        <article
          v-for="item in notifications"
          :key="item.id"
          class="notification-card"
        >
          <div class="icon-wrapper" :class="item.type === 'WITHDRAW' ? 'icon-green' : 'icon-yellow'">
            <img :src="getNotificationIcon(item.type)" alt="">
          </div>
          <div class="card-content">
            <h2 class="card-title">{{ item.name }}</h2>
            <p class="card-desc">{{ getNotificationDesc(item) }}</p>
          </div>
        </article>

        <div v-if="notifications.length === 0 && !loading" class="empty-state">
          <img src="/assets/images/empty.jpg" alt="" class="empty-icon">
          <p>Belum ada notifikasi.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'

const router = useRouter()
const notifications = ref([])
const loading = ref(false)

const goBack = () => {
  router.push('/hn/home')
}

// Format currency
const formatCurrency = (amount) => {
  const n = Number(amount) || 0
  const val = Math.floor(Math.abs(n))
  return `Rp ${val.toLocaleString('id-ID')}`
}

// Get notification icon based on type
const getNotificationIcon = (type) => {
  if (type === 'WITHDRAW') {
    return '/assets/images/68686d40172d7b9fc895cae1e61e9f3cd6b7c651.png'
  }
  return '/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png'
}

// Get notification description
const getNotificationDesc = (item) => {
  const amount = formatCurrency(Math.abs(item.amount))
  if (item.type === 'WITHDRAW') {
    return `Saldo penarikan Anda sebesar ${amount} telah berhasil dikirim.`
  }
  return `Saldo isi ulang Anda sebesar ${amount} telah berhasil masuk.`
}

// Get transaction title
const getTransactionTitle = (type, item) => {
  const titles = {
    'WITHDRAW': 'Penarikan berhasil',
    'DEPOSIT': 'Isi ulang berhasil'
  }
  return titles[type] || item.name || 'Transaksi'
}

// Fetch transactions
const fetchNotifications = async () => {
  loading.value = true
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
    notifications.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.notification-page {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  max-width: 412px;
  background-color: #fbfaf7;
  min-height: 100vh;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
#section-header .header {
  display: flex;
  align-items: center;
  padding: 24px 22px;
  gap: 8px;
}

#section-header .back-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

#section-header .header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  line-height: 20px;
  margin: 0;
}

/* Notifications */
#section-notifications .notifications-list {
  padding: 15px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

#section-notifications .notification-card {
  background-color: #fefffe;
  border-radius: 10px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
  padding: 19px 16px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

#section-notifications .icon-wrapper {
  width: 50px;
  height: 51px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

#section-notifications .icon-yellow {
  background-color: #fef7e3;
}

#section-notifications .icon-green {
  background-color: #e1ebde;
}

#section-notifications .icon-wrapper img {
  width: 21px;
  height: 21px;
  object-fit: contain;
}

#section-notifications .card-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

#section-notifications .card-title {
  font-size: 14px;
  font-weight: 600;
  color: #060606;
  line-height: 18px;
  margin: 0;
}

#section-notifications .card-desc {
  font-size: 12px;
  font-weight: 400;
  color: #7d7d7d;
  line-height: 14px;
  margin: 0;
  max-width: 242px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  width: 160px;
  height: auto;
  display: block;
  margin: 0 auto 12px;
}

.empty-state p {
  font-size: 14px;
  color: #7d7d7d;
}
</style>
