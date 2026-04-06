<template>
  <div id="app-screen">
    <div class="screen-container">
      <!-- Header -->
      <header class="app-header">
        <div class="back-button" @click="goBack">
          <img src="/assets/image/178_1300.svg" alt="Back">
        </div>
        <h1 class="screen-title">Catatan pesanan</h1>
      </header>

      <!-- Order Cards -->
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-details">
          <div class="order-id">{{ order.orderId }}</div>
          <div class="order-date">{{ order.date }}</div>
        </div>
        <div class="order-price">{{ formatCurrency(order.price) }}</div>
      </div>

      <div v-if="orders.length === 0" class="empty-state">
        <img src="/assets/image/empty.png" alt="No Data" class="empty-icon">
       
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { transactionAPI } from '@/services/api'

const router = useRouter()

const orders = ref([])

const goBack = () => {
  router.go(-1)
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

const normalizeTransactionsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const fetchInterestTransactions = async () => {
  try {
    const resp = await transactionAPI.getTransactions({ type: 'INTEREST', page: 1 })
    const items = normalizeTransactionsResponse(resp?.data)
    orders.value = items.map((t) => ({
      id: t?.id ?? t?.trx_id ?? `${t?.created_at || ''}-${t?.amount || ''}`,
      orderId: t?.product_name || t?.trx_id || '-',
      date: formatDateTime(t?.created_at),
      price: t?.amount
    }))
  } catch (_) {
    orders.value = []
  }
}

onMounted(() => {
  fetchInterestTransactions()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

/* Screen Container */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #000;
  color: #fff;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

#app-screen {
  display: flex;
  justify-content: center;
  background-color: #000;
  min-height: 100vh;
}

.screen-container {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  padding: 20px 11px;
  position: relative;
  height: 64px;
}

.back-button {
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 10;
}

.screen-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  pointer-events: none;
}

/* Order Card */
.order-card {
  background-color: #1d2138;
  border-radius: 10px;
  margin: 7px 10px 0 10px;
  padding: 12px 13px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 59px;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  color: #a296ff;
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;
}

.order-date {
  color: #ffffff;
  font-size: 12px;
  line-height: 15px;
  opacity: 1;
}

.order-price {
  color: #ffffff;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;

  margin-top: 5px;
}

.empty-state {
  width: 100%;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
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
}
</style>
