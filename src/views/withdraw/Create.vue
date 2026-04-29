<template>
  <div class="app-container">
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/images/17_36.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Withdraw</h1>
      </header>
    </section>

    <section id="section-balance">
      <div class="balance-card">
        <div class="balance-info">
          <p class="balance-label">Saldo rekening utama saya</p>
          <p class="balance-amount">{{ formatCurrency(withdrawableBalance) }}</p>
        </div>
        <img
          src="/assets/images/3949bfaf68a457f5031cbc2104b43e4f33f5e668.png"
          alt="Wallet Icon"
          class="wallet-icon"
        >
      </div>
    </section>

    <section id="section-form">
      <div class="form-container">
        <h2 class="section-title">Data Pengguna</h2>

        <div class="form-group bank-select" @click="handleBankSelectClick">
          <div class="input-content">
            <label>Rekening Penarikan</label>
            <template v-if="selectedUserBank">
              <p class="placeholder">
                {{ selectedUserBank.bank_name || selectedUserBank.bank_code || '-' }} · {{ selectedUserBank.account_number || '-' }}
              </p>
            </template>
            <template v-else>
              <p class="placeholder">Pilih rekening bank</p>
            </template>
          </div>
          <img src="/assets/images/2010_849.svg" alt="Select Bank" class="dropdown-icon">
        </div>

        <div class="form-group amount-input-group">
          <div class="amount-input-inner">
            <label>Nominal Penarikan</label>
            <input
              type="text"
              class="amount-value"
              :value="displayAmount"
              @input="formatInput"
              placeholder="Rp 0"
            >
          </div>
          <div class="fee-info">
            <span class="fee-rate">Fee transaksi: 10%</span>
            <span class="fee-total">Setelah biaya: Rp {{ formatCurrency(afterFeeAmount) }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="section-info">
      <div class="info-container">
        <ul class="rules-list">
          <li>Minimal penarikan 35.000</li>
          <li>Penarikan terbuka dalam waktu 24 jam setiap hari tanpa hari libur meskipun akhir pekan atau hari libur nasional</li>
          <li>Biaya pengiriman operasional 10%</li>
          <li>Transaksi penarikan otomatis yang dikirim melalui saluran pembayaran Trivex</li>
        </ul>

        <div class="terms-container">
          <img src="/assets/images/d9b41d54b13e3f872bf656657234e30868c2d994.png" alt="Agree" class="check-icon">
          <p class="terms-text">
            Dengan melanjutkan proses ini, kamu menyetujui
            <router-link to="/terms" class="text-green">Syarat & Ketentuan</router-link>
            yang berlaku
          </p>
        </div>
      </div>
    </section>

    <section id="section-action">
      <div class="action-container">
        <button class="submit-btn" @click="handleWithdraw" :disabled="!isValidAmount || isSubmitting">
          <LoadingSpinner v-if="isSubmitting" :visible="true" message="" />
          <span v-else>Lanjutkan</span>
        </button>
      </div>
    </section>
  </div>

  <section v-if="isBottomSheetOpen" id="section-bottom-sheet">
    <div class="overlay" @click="closeBottomSheet"></div>
    <div class="bottom-sheet">
      <div class="drag-handle"></div>

      <template v-if="(userBanks?.length || 0) > 0">
        <div
          v-for="bank in userBanks"
          :key="bank?.id || `${bank?.bank_code || ''}-${bank?.account_number || ''}`"
          class="account-card"
          @click="selectBank(bank)"
        >
          <div class="account-details">
            <span class="account-label">Data Rekening</span>
            <span class="account-number">{{ bank?.account_number || '-' }}</span>
            <span class="account-bank">{{ bank?.bank_name || bank?.bank_code || '-' }}</span>
            <span class="account-name">{{ bank?.account_name || '-' }}</span>
          </div>
          <img class="radio-icon" src="/assets/images/2011_1066.svg" alt="Selected">
        </div>
      </template>

      <template v-else>
        <img
          src="/assets/images/d634ba55ee38309526b6d657b8e1a5a382ef7c60.png"
          alt="Wallet Illustration"
          class="illustration"
        >
        <h3 class="sheet-title">Rekening Penarikan</h3>
        <p class="sheet-desc">Yuk, tambahkan rekening penarikan Anda untuk melakukan transaksi penarikan!</p>
        <button type="button" class="btn-add" @click="handleAddBank">Tambah Rekening Penarikan</button>
      </template>
    </div>
  </section>

  <SuccessModal
    v-model="successModalOpen"
    :message="successMessage"
    @confirm="handleSuccessConfirm"
  />
  <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
</template>

<script setup>
import { computed, onActivated, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, bankAPI, withdrawalAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
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
const isBottomSheetOpen = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)
let successRedirectTimeoutId = 0
let hasRedirectedAfterSuccess = false

const MIN_WITHDRAW = 30000
const MAX_WITHDRAW = 100000000
const SERVICE_FEE_RATE = 0.10

const numericAmount = computed(() => {
  const raw = withdrawAmount.value.replace(/[^0-9]/g, '')
  return Number.parseInt(raw, 10) || 0
})

const displayAmount = computed(() => {
  const num = numericAmount.value
  if (!num) return ''
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`
})

const feeAmount = computed(() => {
  return Math.round(numericAmount.value * SERVICE_FEE_RATE)
})

const afterFeeAmount = computed(() => {
  return Math.max(0, numericAmount.value - feeAmount.value)
})

const isValidAmount = computed(() => {
  if (isSubmitting.value) return false
  if (!selectedUserBankId.value) return false
  const amount = numericAmount.value
  if (amount <= 0) return false
  if (amount < MIN_WITHDRAW || amount > MAX_WITHDRAW) return false
  if (amount > withdrawableBalance.value) return false
  return true
})

const goBack = () => {
  router.go(-1)
}

const goToBindBank = () => {
  router.push('/connect')
}

const closeBottomSheet = () => {
  isBottomSheetOpen.value = false
}

const handleAddBank = () => {
  closeBottomSheet()
  goToBindBank()
}

const selectBank = (bank) => {
  const id = bank?.id ?? null
  if (!id) return
  selectedUserBankId.value = id
  closeBottomSheet()
}

const handleBankSelectClick = () => {
  isBottomSheetOpen.value = true
}

const formatInput = (event) => {
  const raw = event?.target?.value?.replace(/[^0-9]/g, '') || ''
  if (raw) {
    withdrawAmount.value = new Intl.NumberFormat('id-ID').format(Number.parseInt(raw, 10))
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

const normalizeWithdrawErrorMessage = (err) => {
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
  router.push('/dashboard')
}

const handleWithdraw = async () => {
  if (!isValidAmount.value) return
  if (!selectedUserBankId.value) {
    errorMessage.value = 'Silakan pilih rekening bank penerima'
    errorModalOpen.value = true
    return
  }

  const amount = numericAmount.value
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
      router.push('/flow/history')
    }, 1200)
  } catch (err) {
    errorMessage.value = normalizeWithdrawErrorMessage(err)
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
.app-container {
  --bg-color: #f8f8f8;
  --text-main: #000000;
  --text-light: #ffffff;
  --text-muted: rgba(0, 0, 0, 0.5);
  --primary-color: #004d43;
  --card-bg: #eeeeee;
  --input-bg: #f8f8f8;

  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  background-color: var(--bg-color);
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

section {
  width: 100%;
}

/* Header Section */
#section-header .header {
  display: flex;
  align-items: center;
  padding: 20px 10px;
  position: relative;
  height: 60px;
}

#section-header .back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  z-index: 1;
}

#section-header .back-btn img {
  width: 35px;
  height: 35px;
}

#section-header .page-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  pointer-events: none;
}

/* Balance Section */
#section-balance {
  padding: 0 16px;
}

#section-balance .balance-card {
  background: linear-gradient(90deg, #4e733f 0%, #60995b 100%);
  border-radius: 15px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-light);
}

#section-balance .balance-label {
  font-size: 12px;
  margin: 0 0 4px 0;
  font-weight: 400;
}

#section-balance .balance-amount {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
}

#section-balance .wallet-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

/* Form Section */
#section-form {
  padding: 24px 16px 0;
}

#section-form .section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 12px 0;
}

#section-form .form-group {
  background-color: var(--card-bg);
  border-radius: 20px;
  margin-bottom: 12px;
}

#section-form .bank-select {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

#section-form .input-content label {
  display: block;
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 4px;
}

#section-form .input-content .placeholder {
  font-size: 12px;
  color: var(--text-muted);
  background-color: transparent;
  margin: 0;
}

#section-form .dropdown-icon {
  width: 24px;
  height: 24px;
}

#section-form .amount-input-group {
  padding: 16px;
}

#section-form .amount-input-inner {
  background-color: var(--input-bg);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
}

#section-form .amount-input-inner label {
  display: block;
  font-size: 12px;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 8px;
}

#section-form .amount-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  width: 100%;
}

#section-form .amount-value::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}

#section-form .fee-info {
  display: flex;
  justify-content: space-between;
  padding: 0 4px;
  font-size: 10px;
}

#section-form .fee-rate {
  color: var(--text-muted);
}

#section-form .fee-total {
  color: var(--primary-color);
  font-weight: 600;
}

/* Info Section */
#section-info {
  padding: 24px 20px;
}

#section-info .rules-list {
  margin: 0 0 24px 0;
  padding-left: 16px;
  font-size: 10px;
  color: var(--text-main);
  line-height: 1.6;
}

#section-info .rules-list li {
  margin-bottom: 4px;
  padding-left: 4px;
}

#section-info .terms-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

#section-info .check-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

#section-info .terms-text {
  font-size: 10px;
  color: var(--text-main);
  margin: 0;
  line-height: 1.5;
  font-weight: 600;
}

.text-green {
  color: #4caf50;
  text-decoration: none;
}

/* Action Section */
#section-action {
  padding: 16px 20px 40px;
}

#section-action .submit-btn {
  width: 100%;
  background-color: var(--primary-color);
  color: var(--text-light);
  border: none;
  border-radius: 20px;
  padding: 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.2s;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

#section-action .submit-btn:active {
  opacity: 0.8;
}

#section-action .submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#section-bottom-sheet {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  height: 100vh;
  pointer-events: none;
  z-index: 2000;
  background: transparent;
}

#section-bottom-sheet .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(217, 217, 217, 0.6);
  pointer-events: auto;
}

#section-bottom-sheet .bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 50vh;
  background-color: #ffffff;
  border-radius: 24px 24px 0 0;
  padding: 16px 20px 40px;
  pointer-events: auto;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
}

#section-bottom-sheet .drag-handle {
  width: 60px;
  height: 6px;
  background-color: #d9d9d9;
  border-radius: 10px;
  margin: 0 auto 24px;
}

#section-bottom-sheet .account-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#section-bottom-sheet .account-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

#section-bottom-sheet .account-label {
  font-size: 12px;
  color: #004d43;
  font-weight: 600;
}

#section-bottom-sheet .account-number {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

#section-bottom-sheet .account-bank,
#section-bottom-sheet .account-name {
  font-size: 12px;
  color: #000000;
}

#section-bottom-sheet .radio-icon {
  width: 24px;
  height: 24px;
}

#section-bottom-sheet .illustration {
  width: 139px;
  height: 139px;
  margin-bottom: 28px;
  object-fit: contain;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#section-bottom-sheet .sheet-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 12px 0;
  text-align: center;
}

#section-bottom-sheet .sheet-desc {
  font-size: 14px;
  color: #7b7b7b;
  text-align: center;
  margin: 0 0 32px 0;
  line-height: 1.5;
  max-width: 368px;
  margin-left: auto;
  margin-right: auto;
}

#section-bottom-sheet .btn-add {
  width: 100%;
  max-width: 387px;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  height: 58px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

