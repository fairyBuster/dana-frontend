<template>
  <section id="app-view">
    <div class="mobile-container">
      <!-- Header -->
      <header class="app-header">
        <button class="back-btn" @click="goBack">
          <img src="/assets/image/161_467.svg" alt="Back" width="24" height="24">
        </button>
        <h1 class="page-title">Deposito</h1>
      </header>

      <!-- Balance Card -->
      <div class="balance-card">
        <div class="balance-info">
          <span class="balance-label">Isi ulang saldo</span>
          <span class="balance-amount">{{ formatCurrency(balance) }}</span>
        </div>
        <button class="history-btn" @click="viewHistory">
          <span>Catatan deposito</span>
          <img src="/assets/image/155_1476.svg" alt="Arrow" width="12" height="12">
        </button>
      </div>

      <!-- Deposit Form -->
      <div class="deposit-form">
        <label class="input-label">Silakan masukkan jumlah deposito</label>
        <div class="input-wrapper">
          <input 
            v-model="depositAmount" 
            type="text" 
            placeholder="Silakan masukkan jumlah deposito" 
            class="deposit-input"
            @input="formatInput"
          >
        </div>
      </div>

      <!-- Action Button -->
      <button class="submit-btn" @click="handleDeposit" :disabled="!isValidAmount || isLoading">
        Selesaikan deposito
      </button>
    </div>

    <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, depositAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const balance = ref(0)
const depositAmount = ref('')
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const isValidAmount = computed(() => {
  const amount = parseFloat(depositAmount.value.replace(/[^0-9]/g, ''))
  return !isNaN(amount) && amount > 0
})

const goBack = () => {
  router.go(-1)
}

const viewHistory = () => {
  router.push('/pages/history/recharge')
}

const formatInput = (event) => {
  const value = event?.target?.value?.replace(/[^0-9]/g, '') || ''
  if (value) {
    const formatted = new Intl.NumberFormat('id-ID').format(parseInt(value))
    depositAmount.value = formatted
  } else {
    depositAmount.value = ''
  }
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal memproses deposito'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal memproses deposito'
}

const fetchBalanceDeposit = async () => {
  try {
    const resp = await authAPI.getBalanceStatistics('all-time')
    const d = resp?.data || {}
    const n = typeof d.balance_deposit === 'string' ? parseFloat(d.balance_deposit) : Number(d.balance_deposit || 0)
    balance.value = Number.isFinite(n) ? n : 0
  } catch (_) {
    balance.value = 0
  }
}

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

const handleDeposit = async () => {
  if (!isValidAmount.value) return

  const amount = parseInt(depositAmount.value.replace(/[^0-9]/g, ''))
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const resp = await depositAPI.initiateJayapay({ amount, wallet_type: 'BALANCE' })
    const paymentUrl = String(resp?.data?.payment_url || '').trim()
    if (!paymentUrl) {
      throw new Error('Payment URL tidak tersedia')
    }
    window.location.href = paymentUrl
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchBalanceDeposit()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0f0f1a;
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

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
}

input {
  font-family: inherit;
  border: none;
  outline: none;
  background: none;
}

/* App Section */
#app-view {
  width: 100%;
  display: flex;
  justify-content: center;
}

.mobile-container {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 16px 21px;
  display: flex;
  flex-direction: column;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 40px;
  margin-bottom: 26px;
}

.back-btn {
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 10px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

/* Balance Card */
.balance-card {
  background-color: #1d2138;
  border-radius: 10px;
  padding: 16px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 84px;
  margin-bottom: 30px;
}

.balance-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.balance-label {
  font-size: 12px;
  color: #ffffff;
  opacity: 0.9;
}

.balance-amount {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

.history-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 12px;
  padding: 4px 10px;
  height: 23px;
}

.history-btn span {
  font-size: 10px;
  color: #ffffff;
  white-space: nowrap;
}

/* Form */
.deposit-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.input-label {
  font-size: 14px;
  color: #ffffff;
  padding-left: 8px;
}

.input-wrapper {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 10px;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 18px;
}

.deposit-input {
  width: 100%;
  color: #ffffff;
  font-size: 14px;
}

.deposit-input::placeholder {
  color: #505050;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  height: 51px;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 28px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
