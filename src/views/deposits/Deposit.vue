<template>
  <div class="deposit-page">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" aria-label="Go back" @click="goBack">
          <img src="/assets/images/18_121.svg" alt="">
        </button>
        <h1 class="header-title">Isi Ulang</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-content">
        <h2 class="page-title">Isi Ulang</h2>
        <p class="page-subtitle">Tambahkan saldo ke akun Anda dengan aman dan cepat.</p>

        <div class="balance-card">
          <div class="balance-info">
            <p class="balance-label">Saldo Isi Ulang</p>
            <p class="balance-amount">{{ depositBalanceDisplay }}</p>
            <p class="balance-desc">Dana siap digunakan untuk transaksi</p>
          </div>
          <img src="/assets/images/9f4d7b8ace034cd96bb6b037dd50538b5db64b68.png" alt="" class="balance-img">
        </div>
      </div>
    </section>

    <!-- TopUp Form -->
    <section id="section-topup-form">
      <div class="form-container">
        <div class="topup-card">
          <h3 class="card-title">Masukkan Nominal</h3>

          <div class="input-group">
            <input
              type="text"
              class="amount-input"
              placeholder="Masukkan jumlah isi ulang yang Anda inginkan"
              :value="displayAmount"
              @input="handleAmountInput"
              inputmode="numeric"
            >
          </div>

          <div class="quick-amounts">
            <button
              v-for="amt in quickAmounts"
              :key="amt.value"
              class="amount-btn"
              :class="{ active: selectedQuickAmount === amt.value }"
              :disabled="amt.value < MIN_DEPOSIT || amt.value > MAX_DEPOSIT"
              @click="selectQuickAmount(amt.value)"
            >
              {{ amt.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Info -->
    <section id="section-info">
      <div class="info-container">
        <div class="info-card">
          <h3 class="info-title">Informasi Penting</h3>
          <ul class="info-list">
            <li>Minimal isi ulang Rp 50.000</li>
            <li>Maksimal isi ulang Rp 20.000.000</li>
            <li>Proses isi ulang otomatis dan real-time</li>
            <li>Pastikan nominal dan data pembayaran sudah benar sebelum melanjutkan</li>
            <li>Simpan bukti pembayaran untuk referensi</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer">
      <div class="footer-container">
        <button
          class="submit-btn"
          :disabled="isLoading"
          @click="handleDeposit"
        >
          <LoadingSpinner v-if="isLoading" :visible="true" message="" />
          <span v-else>Isi Ulang Sekarang</span>
        </button>
      </div>
    </section>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, depositAPI } from '@/services/api'
import { formatAppCurrency } from '@/utils/settings'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'

const router = useRouter()

const depositBalance = ref(0)
const depositAmount = ref('')
const selectedQuickAmount = ref(null)
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const quickAmounts = [
  { value: 50000, label: 'Rp 50.000' },
  { value: 500000, label: 'Rp 500.000' },
  { value: 1000000, label: 'Rp 1.000.000' },
  { value: 5000000, label: 'Rp 5.000.000' }
]

const MIN_DEPOSIT = 50000
const MAX_DEPOSIT = 20000000

const toAmount = (value) => {
  const n = Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatRupiah = (value) => {
  return formatAppCurrency(value, {
    symbol: 'Rp',
    symbol_position: 'prefix',
    symbol_space: true,
    thousand_sep: '.',
    decimal_sep: ',',
    decimals: 0
  })
}

const depositBalanceDisplay = computed(() => {
  return formatRupiah(depositBalance.value)
})

const numericAmount = computed(() => {
  const raw = String(depositAmount.value || '').replace(/[^0-9]/g, '')
  return Number.parseInt(raw, 10) || 0
})

const displayAmount = computed(() => {
  return depositAmount.value || ''
})

const isValidAmount = computed(() => {
  return numericAmount.value >= MIN_DEPOSIT && numericAmount.value <= MAX_DEPOSIT
})

const goBack = () => {
  router.push('/hn/home')
}

const handleAmountInput = (event) => {
  const raw = event?.target?.value?.replace(/[^0-9]/g, '') || ''
  if (!raw) {
    depositAmount.value = ''
    selectedQuickAmount.value = null
    return
  }
  const num = Number.parseInt(raw, 10)
  if (!Number.isFinite(num) || num <= 0) {
    depositAmount.value = ''
    selectedQuickAmount.value = null
    return
  }
  depositAmount.value = formatRupiah(num)

  // Check if matches a quick amount
  const match = quickAmounts.find(a => a.value === num)
  selectedQuickAmount.value = match ? match.value : null
}

const selectQuickAmount = (value) => {
  if (value < MIN_DEPOSIT || value > MAX_DEPOSIT) return
  selectedQuickAmount.value = value
  depositAmount.value = formatRupiah(value)
}

const fetchBalance = async () => {
  try {
    const res = await authAPI.getAccountInfo()
    const data = res?.data || {}
    depositBalance.value = toAmount(data?.balance_deposit ?? data?.deposit_balance ?? 0)
  } catch (_) {}
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal memproses isi ulang'
  if (typeof data === 'string') return data
  const detail = data?.detail ? String(data.detail) : ''
  const message = data?.message ? String(data.message) : ''
  const combined = `${detail} ${message}`.trim()
  if (detail) return detail
  if (message) return message
  return 'Gagal memproses isi ulang'
}

const handleDeposit = async () => {
  if (!numericAmount.value) {
    showErrorModal.value = true
    errorMessage.value = 'Nominal isi ulang belum diisi'
    return
  }
  if (!isValidAmount.value) return

  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''

  try {
    const amount = numericAmount.value
    const resp = await depositAPI.initiateJayapay({ amount, wallet_type: 'BALANCE' })

    const paymentUrl = String(
      resp?.data?.payment_url || resp?.data?.paymentUrl || resp?.data?.url || ''
    ).trim()

    if (!paymentUrl) {
      throw new Error('URL pembayaran tidak tersedia')
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
  fetchBalance()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

.deposit-page {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  background-color: #fbfaf7;
  max-width: 412px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  padding: 24px 20px;
  gap: 16px;
}

.back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

/* Hero */
.hero-content {
  padding: 0 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 14px;
  color: #635f5f;
  line-height: 1.4;
  max-width: 80%;
}

.balance-card {
  margin-top: 24px;
  background: linear-gradient(90deg, #f4c142 0%, #f8dd89 46.63%, #f5ca51 100%);
  border-radius: 10px;
  padding: 20px;
  position: relative;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.balance-info {
  position: relative;
  z-index: 2;
}

.balance-label {
  color: #ffffff;
  font-size: 14px;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 4px;
}

.balance-amount {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 8px;
}

.balance-desc {
  color: #7d7d7d;
  font-size: 10px;
}

.balance-img {
  position: absolute;
  right: -10px;
  top: -30px;
  width: 180px;
  z-index: 1;
  pointer-events: none;
}

/* TopUp Form */
.form-container {
  padding: 24px 20px 0;
}

.topup-card {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #060606;
  margin-bottom: 16px;
}

.input-group {
  width: 100%;
}

.amount-input {
  width: 100%;
  padding: 16px;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  background-color: #fefefe;
  font-size: 12px;
  color: #000000;
  font-family: 'Inter', sans-serif;
}

.amount-input::placeholder {
  color: #635f5f;
}

.amount-input:focus {
  outline: none;
  border-color: #f4bd40;
}

.quick-amounts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.amount-btn {
  width: 100%;
  padding: 12px;
  background-color: #fefefe;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
}

.amount-btn.active {
  border-color: #f4bd40;
  color: #f4bd40;
}

.amount-btn:hover {
  border-color: #f4bd40;
}

/* Info */
.info-container {
  padding: 20px;
}

.info-card {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.info-title {
  font-size: 14px;
  font-weight: 700;
  color: #060606;
  margin-bottom: 12px;
}

.info-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #7d7d7d;
  line-height: 1.6;
}

.info-list li + li {
  margin-top: 6px;
}

/* Footer */
#section-footer {
  margin-top: auto;
}

.footer-container {
  padding: 0 20px 30px;
}

.submit-btn {
  width: 100%;
  background-color: #f3b73f;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:active {
  opacity: 0.8;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
