<template>
  <div class="withdraw-page">
  <section id="header">
    <div class="app-container">
      <header class="top-bar">
        <button class="back-btn" @click="goBack">
          <img src="/assets/image/161_500.svg" alt="Back" width="24" height="24">
        </button>
        <h1 class="page-title">Tarik uang</h1>
      </header>
    </div>
  </section>

  <section id="form-section">
    <div class="app-container">
      
      <!-- Balance Card -->
      <div class="card balance-card">
        <div class="card-row top-row">
          <span class="label">Saldo yang dapat ditarik</span>
          <a href="/#/pages/history/release" class="history-tag" @click.prevent="router.push('/pages/history/release')">
            <span>Catatan tarik saya</span>
            <img src="/assets/image/155_1476.svg" alt="Arrow" width="12" height="12">
          </a>
        </div>
        <div class="amount">{{ formatCurrency(withdrawableBalance) }}</div>
        <div class="fee">Biaya layanan 3% + RP 6500</div>
      </div>

      <!-- Bank Card -->
      <div class="card bank-card">
        <div class="card-row">
          <span class="label">Kartu bank penerima</span>
          <a href="/#/pages/assets/bind" class="view-all-btn" @click.prevent="router.push('/pages/assets/bind')">
            <span>Lihat semua kartu</span>
            <img src="/assets/image/161_524.svg" alt="Arrow" width="6" height="4">
          </a>
        </div>
        <div class="bank-value">
          <template v-if="selectedUserBank">
            <div class="bank-line bank-line--primary">{{ selectedUserBank.bank_name || selectedUserBank.bank_code || '-' }}</div>
            <div class="bank-line">{{ selectedUserBank.account_name || '-' }}</div>
            <div class="bank-line">{{ selectedUserBank.account_number || '-' }}</div>
          </template>
          <template v-else>-</template>
        </div>
      </div>

      <!-- Alert Banner -->
      <div class="alert-banner">
        <img src="/assets/image/161_529.svg" alt="Alert" width="16" height="16">
        <div class="alert-marquee">
          <div class="alert-marquee-track">
            <span class="alert-text">Silakan periksa kembali kartu bank penerima sebelum Anda melanjutkan proses</span>
            <span class="alert-text">Silakan periksa kembali kartu bank penerima sebelum Anda melanjutkan proses</span>
          </div>
        </div>
      </div>

      <!-- Input Field -->
       <label class="input-label">Silakan masukkan jumlah tarik uang</label>
      <div class="input-group">
        
        <div class="input-box">
          <input 
            v-model="withdrawAmount" 
            type="text" 
            placeholder="Silakan masukkan jumlah tarik uang" 
            class="text-input"
            @input="formatInput"
          >
        </div>
      </div>

      <!-- Submit Button -->
      <button class="submit-btn" @click="handleWithdraw" :disabled="!isValidAmount">
        Selesaikan penarikan
      </button>

    </div>
  </section>

  <section id="instructions">
    <div class="app-container">
      <h2 class="instructions-title">Instruksi penarikan</h2>
      <div class="instructions-text">
        Panduan pengajuan penarikan<br>
        -Anda harus mengisi ulang dan membeli drone untuk mengaktifkan akun Anda sebelum Anda dapat mengajukan penarikan.<br>
        -Anda hanya dapat melakukan 1 kali penarikan tunai dalam sehari. Harap rencanakan penarikan Anda dengan bijaksana.<br>
        -Batas jumlah penarikan<br>
        Minimum penarikan= Rp 25.000<br>
        Maksimum penarikan= Rp 100.000.000<br>
        Biaya layanan 3% + Rp 6500<br>
        Pastikan jumlah penarikan Anda berada dalam rentang yang diizinkan<br>
        -Harap konfirmasikan informasi akun yang menguntungkan Anda sebelum melakukan penarikan. Jika informasi Anda salah, perusahaan kami tidak akan bertanggung jawab atas jumlah kerugian.<br>
        -Perusahaan SENT bertugas memantau dan mengawasi prosesi penarikan agar tidak melebihi batas waktu maksimum 72 jam. Masalah cepat atau lambatnya sebuah proses penarikan adalah tanggung jawab bank terkait. Pastikan data rekening Anda sudah diisi dengan benar sebelum mengajukan penarikan.
      </div>
    </div>
  </section>

  <SuccessModal
    v-model="successModalOpen"
    :message="successMessage"
    @confirm="handleSuccessConfirm"
  />
  <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onActivated, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, bankAPI, withdrawalAPI } from '@/services/api'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const withdrawableBalance = ref(0)
const userBanks = ref([])
const selectedUserBankId = ref(null)
const withdrawAmount = ref('')
const isSubmitting = ref(false)
const serviceId = ref(null)
const successModalOpen = ref(false)
const errorModalOpen = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)
let successRedirectTimeoutId = 0
let hasRedirectedAfterSuccess = false

const MIN_WITHDRAW = 25000
const MAX_WITHDRAW = 100000000
const SERVICE_FEE_RATE = 0.06
const FIXED_FEE = 6500

const isValidAmount = computed(() => {
  if (isSubmitting.value) return false
  if (!selectedUserBankId.value) return false
  const amount = parseFloat(withdrawAmount.value.replace(/[^0-9]/g, ''))
  if (isNaN(amount) || amount <= 0) return false
  
  // Check minimum and maximum limits
  if (amount < MIN_WITHDRAW || amount > MAX_WITHDRAW) return false
  
  if (amount > withdrawableBalance.value) return false
  
  return true
})

const goBack = () => {
  router.go(-1)
}

const formatInput = (event) => {
  // Remove non-numeric characters
  const value = event.target.value.replace(/[^0-9]/g, '')
  if (value) {
    // Format with thousand separators
    const formatted = new Intl.NumberFormat('id-ID').format(parseInt(value))
    withdrawAmount.value = formatted
  } else {
    withdrawAmount.value = ''
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

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const normalizeWithdrawErrorMessage = (err, fallbackTotalDeductionText = '') => {
  const data = err?.response?.data
  const raw =
    (typeof data === 'string' && data) ||
    data?.detail ||
    data?.message ||
    err?.message ||
    ''
  const s = String(raw || '').toLowerCase()
  if (
    s.includes('saldo') ||
    s.includes('balance') ||
    s.includes('insufficient') ||
    s.includes('tidak cukup') ||
    s.includes('kurang')
  ) {
    return 'Pastikan jumlah penarikan sesuai dengan saldo yang tersedia.'
  }
  if (s.includes('1 kali') || s.includes('sekali') || s.includes('daily') || s.includes('hari')) {
    return 'Anda hanya bisa melakukan 1 kali penarikan dalam sehari.'
  }
  if (s.includes('minimum') || s.includes('maksimum') || s.includes('maximum') || s.includes('min')) {
    return 'Pastikan jumlah penarikan Anda berada dalam rentang yang diizinkan.'
  }
  if (raw) return String(raw)
  if (fallbackTotalDeductionText) return fallbackTotalDeductionText
  return 'Permintaan gagal, segarkan halaman'
}

const fetchAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    withdrawableBalance.value = parseNumber(resp?.data?.balance)
  } catch (_) {
    withdrawableBalance.value = 0
  }
}

const fetchDefaultService = async () => {
  try {
    const resp = await withdrawalAPI.getServices()
    const data = resp?.data
    const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
    const first = list?.[0]
    if (first?.id) serviceId.value = first.id
  } catch (_) {
    serviceId.value = null
  }
}

const normalizeUserBanksResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const selectedUserBank = computed(() => {
  const id = selectedUserBankId.value
  return (userBanks.value || []).find((b) => String(b?.id) === String(id)) || null
})

const fetchUserBanks = async () => {
  try {
    const resp = await bankAPI.getUserBanks()
    const list = normalizeUserBanksResponse(resp?.data)
    userBanks.value = list
    const defaultBank = list.find((b) => Boolean(b?.is_default))
    const pick = defaultBank || list[0] || null
    selectedUserBankId.value = pick?.id ?? null
  } catch (_) {
    userBanks.value = []
    selectedUserBankId.value = null
  }
}

const refreshWithdrawData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    await Promise.all([
      fetchAccountInfo(),
      fetchDefaultService(),
      fetchUserBanks()
    ])
  } finally {
    lastRefreshedAt.value = Date.now()
    isRefreshing.value = false
  }
}

const handleSuccessConfirm = () => {
  if (hasRedirectedAfterSuccess) return
  hasRedirectedAfterSuccess = true
  if (successRedirectTimeoutId) {
    window.clearTimeout(successRedirectTimeoutId)
    successRedirectTimeoutId = 0
  }
  router.push('/pages/account/active')
}

const handleWithdraw = async () => {
  if (!isValidAmount.value) return
  if (!selectedUserBankId.value) {
    errorMessage.value = 'Silakan pilih kartu bank penerima'
    errorModalOpen.value = true
    return
  }
  
  const amount = parseInt(withdrawAmount.value.replace(/[^0-9]/g, ''))
  const serviceFee = (amount * SERVICE_FEE_RATE) + FIXED_FEE
  const totalDeduction = amount + serviceFee

  isSubmitting.value = true
  try {
    await withdrawalAPI.createWithdrawal({
      amount: String(amount),
      bank_account_id: selectedUserBankId.value,
      pin: '',
      service_id: serviceId.value ?? 0
    })
    successMessage.value = 'Permintaan Anda telah diterima oleh sistem.'
    hasRedirectedAfterSuccess = false
    successModalOpen.value = true
    if (successRedirectTimeoutId) {
      window.clearTimeout(successRedirectTimeoutId)
      successRedirectTimeoutId = 0
    }
    successRedirectTimeoutId = window.setTimeout(() => {
      if (hasRedirectedAfterSuccess) return
      hasRedirectedAfterSuccess = true
      successModalOpen.value = false
      router.push('/pages/history/release')
    }, 1200)
  } catch (err) {
    const fallbackText = `Gagal mengajukan penarikan. Total dipotong: Rp ${formatCurrency(totalDeduction)}`
    errorMessage.value = normalizeWithdrawErrorMessage(err, fallbackText)
    errorModalOpen.value = true
  } finally {
    isSubmitting.value = false
  }
}

onBeforeUnmount(() => {
  if (successRedirectTimeoutId) {
    window.clearTimeout(successRedirectTimeoutId)
    successRedirectTimeoutId = 0
  }
})

onMounted(() => {
  refreshWithdrawData()
})

onActivated(() => {
  const now = Date.now()
  if (now - lastRefreshedAt.value < 300) return
  refreshWithdrawData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.withdraw-page {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0f1020;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 100vh;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

* {
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  max-width: 412px;
  padding: 0 20px;
  position: relative;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  padding: 0;
}

/* Header */
#header {
  width: 100%;
  padding-top: 16px;
  padding-bottom: 20px;
}

.top-bar {
  display: flex;
  align-items: center;
  position: relative;
  height: 24px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

/* Form Section */
#form-section {
  width: 100%;
}

.card {
  background-color: #1d2138;
  border-radius: 10px;
  padding: 16px 12px;
  margin-bottom: 16px;
  position: relative;
}

.balance-card {
  height: 84px;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.label {
  font-size: 10px;
  color: #ffffff;
}

.history-tag {
  display: flex;
  align-items: center;
  gap: 2px;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 11px;
  color: #ffffff;
  position: absolute;
  top: 13px;
  right: 12px;
  height: 23px;
  box-sizing: border-box;
}

.amount {
  font-size: 16px;
  font-weight: 700;
  margin-top: 20px;
  color: #ffffff;
}

.fee {
  font-size: 10px;
  color: #ffffff;
  position: absolute;
  bottom: 10px;
  right: 12px;
}

.bank-card {
  height: auto;
  display: flex;
  flex-direction: column;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7e7e7e;
  font-size: 13px;
}

.bank-value {
  font-size: 13px;
  margin-top: 14px;
  color: #ffffff;
}

.bank-line {
  font-size: 12px;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.9);
}

.bank-line--primary {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.alert-banner {
  background: linear-gradient(90deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border-radius: 2px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  overflow: hidden;
}

.alert-marquee {
  flex: 1;
  overflow: hidden;
}

.alert-marquee-track {
  display: flex;
  width: max-content;
  gap: 28px;
  animation: withdrawAlertMarquee 14s linear infinite;
  will-change: transform;
}

.alert-text {
  font-size: 10px;
  color: #c4c4c4;
  margin: 0;
  white-space: nowrap;
}

@keyframes withdrawAlertMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.input-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  font-size: 10px;
  color: #ffffff;
  margin-bottom: 16px;
}

.input-box {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 10px;
  height: 56px;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 16px;
}

.text-input {
  background: transparent;
  border: none;
  color: #ffffff;
  width: 100%;
  font-size: 14px;
  outline: none;
}

.text-input::placeholder {
  color: #505050;
}

.submit-btn {
  width: 100%;
  height: 51px;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Instructions */
#instructions {
  width: 100%;
  padding-top: 24px;
  padding-bottom: 40px;
}

.instructions-title {
  font-size: 12px;
  color: #ffffff;
  margin: 0 0 8px 0;
  font-weight: 400;
}

.instructions-text {
  font-size: 10px;
  line-height: 1.5;
  color: #b7b7b7;
  white-space: pre-line;
  text-align: justify;
}
</style>
