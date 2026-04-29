<template>
  <div class="app-container">
    <section id="section-header">
      <header class="site-header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/17_14.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Deposito</h1>
      </header>
    </section>

    <section id="section-deposit-form">
      <div class="form-container">
        <div class="input-group">
          <label class="input-label">Nominal Pengisian</label>
          <div class="input-wrapper">
            <span class="input-prefix">Rp</span>
            <input 
              type="text" 
              class="amount-input" 
              :value="displayAmount"
              @input="formatInput"
              placeholder="0"
            >
          </div>
          <p v-if="showWarning" class="warning-message">Minimal transaksi Rp 50.000,00</p>
        </div>

        <div class="quick-amounts-grid">
          <button 
            v-for="option in quickAmounts" 
            :key="option.value"
            class="amount-option"
            :class="{ selected: selectedAmount === option.value }"
            @click="selectAmount(option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="info-notes">
          <p>* Penyetoran isi ulang dilakukan secara otomatis</p>
          <p>* Penyetoran isi ulang terbuka selama 24 jam</p>
          <p>* Setelah berhasil melakukan setoran isi ulang, silakan segarkan halaman Anda</p>
          <p>* Simpan bukti transaksi Anda demi keamanan atau validasi ketika dibutuhkan</p>
          <p>* Transaksi aman dan terlindungi</p>
        </div>
      </div>
    </section>

    <section id="section-footer">
      <div class="footer-container">
        <div class="terms-condition">
          <img src="/assets/images/d9b41d54b13e3f872bf656657234e30868c2d994.png" alt="Agree Icon" class="terms-icon">
          <p class="terms-text">
            Dengan melanjutkan proses ini, kamu menyetujui <router-link to="/terms" class="text-highlight">Syarat & Ketentuan</router-link> yang berlaku
          </p>
        </div>
        <button class="btn-primary" @click="handleDeposit" :disabled="!isValidAmount || isLoading">
          <LoadingSpinner v-if="isLoading" :visible="true" message="" />
          <span v-else>Bayar</span>
        </button>
      </div>
    </section>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { depositAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const depositAmount = ref('')
const selectedAmount = ref(null)
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const quickAmounts = [
  { value: 100000, label: 'Rp100.000' },
  { value: 500000, label: 'Rp500.000' },
  { value: 1000000, label: 'Rp1.000.000' },
  { value: 2000000, label: 'Rp2.000.000' }
]

const numericAmount = computed(() => {
  const raw = depositAmount.value.replace(/[^0-9]/g, '')
  return Number.parseInt(raw, 10) || 0
})

const displayAmount = computed(() => {
  const num = numericAmount.value
  if (!num) return ''
  return new Intl.NumberFormat('id-ID').format(num)
})

const showWarning = computed(() => {
  return numericAmount.value > 0 && numericAmount.value < 50000
})

const isValidAmount = computed(() => {
  return numericAmount.value >= 50000
})

const goBack = () => {
  router.go(-1)
}

const selectAmount = (value) => {
  selectedAmount.value = value
  depositAmount.value = new Intl.NumberFormat('id-ID').format(value)
}

const formatInput = (event) => {
  const raw = event?.target?.value?.replace(/[^0-9]/g, '') || ''
  selectedAmount.value = null
  if (raw) {
    const num = Number.parseInt(raw, 10)
    depositAmount.value = new Intl.NumberFormat('id-ID').format(num)
    const match = quickAmounts.find((q) => q.value === num)
    if (match) selectedAmount.value = num
  } else {
    depositAmount.value = ''
  }
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal memproses deposito'
  if (typeof data === 'string') return data
  const detail = data?.detail ? String(data.detail) : ''
  const message = data?.message ? String(data.message) : ''
  const combined = `${detail} ${message}`.trim()
  const s = combined.toLowerCase()
  if (s.includes('verify signature failed') || (s.includes('jayapay') && s.includes('signature') && s.includes('failed'))) {
    return 'Parameter pembayaran salah. Silakan coba lagi'
  }
  if (detail) return detail
  if (message) return message
  return 'Gagal memproses deposito'
}

const handleDeposit = async () => {
  if (!isValidAmount.value) return

  const amount = numericAmount.value
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
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  background-color: #f8f8f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 412px;
}

* {
  box-sizing: border-box;
}

h1,
h2,
p {
  margin: 0;
}

/* Header Section */
.site-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  position: relative;
  padding: 0 16px;
}

.back-button {
  position: absolute;
  left: 5px;
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
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Deposit Form Section */
#section-deposit-form {
  padding: 24px 16px 0;
}

.input-group {
  margin-bottom: 24px;
  flex-direction: column;
}

.input-label {
  display: block;
  font-size: 14px;
  color: #000000;
  margin-bottom: 10px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.21);
  border-radius: 10px;
  padding: 0 16px;
  height: 61px;
}

.input-prefix {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin-right: 4px;
}

.amount-input {
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  width: 100%;
  outline: none;
  font-family: inherit;
}

.amount-input::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.warning-message {
  color: #ff0000;
  font-size: 12px;
  margin: 10px 0 0 4px;
}

.quick-amounts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 13px;
  margin-bottom: 24px;
}

.amount-option {
  height: 38px;
  border-radius: 50px;
  border: 1px solid #cecece;
  background-color: #ffffff;
  color: #000000;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.amount-option.selected {
  background-color: rgba(76, 164, 85, 0.1);
  border-color: #4ca455;
  color: #004d43;
}

.info-notes {
  margin-top: 24px;
}

.info-notes p {
  font-size: 12px;
  color: #000000;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

/* Footer Section */
#section-footer {
  padding: 40px 16px 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.terms-condition {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.terms-icon {
  width: 26px;
  height: 25px;
  object-fit: contain;
  flex-shrink: 0;
}

.terms-text {
  font-size: 12px;
  color: #000000;
  line-height: 1.4;
  margin: 0;
}

.text-highlight {
  color: #4ca455;
  font-weight: 600;
  text-decoration: none;
}

.btn-primary {
  width: 100%;
  height: 58px;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.btn-primary:active {
  opacity: 0.8;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

