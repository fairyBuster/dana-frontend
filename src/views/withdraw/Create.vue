<template>
  <div class="withdraw-page">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" aria-label="Go back" @click="goBack">
          <img src="/assets/images/21_33.svg" alt="">
        </button>
        <h1 class="header-title">Dana saya</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-content">
        <h2 class="hero-title">Tarik Dana</h2>
        <p class="hero-subtitle">Tarik saldo Anda dengan aman dan cepat.</p>

        <div class="balance-card">
          <div class="balance-info">
            <p class="balance-label">Saldo Tersedia</p>
            <p class="balance-amount">{{ balanceDisplay }}</p>
            <p class="balance-desc">Dana siap ditarik ke rekening Anda.</p>
          </div>
          <img src="/assets/images/9f4d7b8ace034cd96bb6b037dd50538b5db64b68.png" alt="" class="balance-img">
        </div>
      </div>
    </section>

    <!-- Account -->
    <section id="section-account">
      <div class="section-container">
        <div class="card">
          <h3 class="card-title">Pilih Rekening Tujuan</h3>

          <div v-if="selectedUserBank" class="selected-bank-card" @click="handleBankSelectClick">
            <div class="selected-bank-info">
              <span class="selected-bank-name">{{ selectedUserBank.account_name || '-' }}</span>
              <span class="selected-bank-number">{{ selectedUserBank.account_number || '-' }}</span>
              <span class="selected-bank-code">{{ selectedUserBank.bank_name || selectedUserBank.bank_code || '-' }}</span>
            </div>
            <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="" class="icon-wallet">
          </div>

          <button v-else class="add-account-btn" @click="handleBankSelectClick">
            <div class="add-account-left">
              <img src="/assets/images/24_195.svg" alt="" class="icon-plus">
              <span class="add-account-text">Tambah rekening baru</span>
            </div>
            <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="" class="icon-wallet">
          </button>
        </div>
      </div>
    </section>

    <!-- Amount -->
    <section id="section-amount">
      <div class="section-container">
        <div class="card">
          <h3 class="card-title">Masukkan Nominal</h3>

          <div class="input-wrapper">
            <input
              type="text"
              class="amount-input"
              placeholder="Masukkan jumlah tarik dana yang Anda inginkan"
              :value="displayAmount"
              @input="handleAmountInput"
              inputmode="numeric"
            >
          </div>

          <div class="quick-amounts">
            <button
              v-for="amt in quickAmounts"
              :key="amt.value"
              class="quick-amount-btn"
              :class="{ active: selectedQuickAmount === amt.value }"
              @click="selectQuickAmount(amt.value)"
            >
              {{ amt.label }}
            </button>
          </div>

          <div class="info-box">
            <img src="/assets/images/0124373b87358a593909a03ffafd020b5948dccd.png" alt="" class="info-icon">
            <span class="info-text">Minimum penarikan Rp 30.000</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Summary -->
    <section id="section-summary">
      <div class="section-container">
        <div class="card">
          <h3 class="card-title">Ringkasan Penarikan</h3>

          <div class="summary-details">
            <div class="summary-row">
              <span class="summary-label">Nominal Penarikan</span>
              <span class="summary-value">{{ summaryNominal }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Biaya Admin</span>
              <span class="summary-value">{{ summaryFee }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Estimasi Tiba</span>
              <span class="summary-value">1-24 jam</span>
            </div>
          </div>

          <hr class="summary-divider">

          <div class="summary-total">
            <span class="total-label">Total Diterima</span>
            <span class="total-value">{{ summaryTotal }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer">
      <footer class="footer">
        <div class="info-box footer-info">
          <img src="/assets/images/0124373b87358a593909a03ffafd020b5948dccd.png" alt="" class="info-icon">
          <span class="info-text">Penarikan akan diproses setelah verifikasi selesai.</span>
        </div>

        <button
          class="submit-btn"
          :disabled="isSubmitting"
          @click="handleWithdraw"
        >
          <LoadingSpinner v-if="isSubmitting" :visible="true" message="" />
          <span v-else>Tarik Uang Sekarang</span>
        </button>
      </footer>
    </section>
  </div>

  <!-- Bottom Sheet for Bank Selection -->
  <section v-if="isBottomSheetOpen" id="section-bottom-sheet">
    <div class="overlay" @click="closeBottomSheet"></div>
    <div class="bottom-sheet">
      <div class="drag-handle"></div>

      <template v-if="(userBanks?.length || 0) > 0">
        <div
          v-for="bank in userBanks"
          :key="bank?.id || `${bank?.bank_code}-${bank?.account_number}`"
          class="account-card"
          @click="selectBank(bank)"
        >
          <div class="account-details">
            <span class="account-label">Rekening Bank</span>
            <span class="account-number">{{ bank?.account_number || '-' }}</span>
            <span class="account-bank">{{ bank?.bank_name || bank?.bank_code || '-' }}</span>
            <span class="account-name">{{ bank?.account_name || '-' }}</span>
          </div>
          <img
            v-if="selectedUserBankId === bank?.id"
            src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png"
            alt=""
            class="radio-icon"
          >
        </div>

        <button type="button" class="btn-add" @click="handleAddBank">Tambah Rekening Baru</button>
      </template>

      <template v-else>
        <h3 class="sheet-title">Rekening Penarikan</h3>
        <p class="sheet-desc">Belum ada rekening tersedia. Tambahkan rekening baru.</p>
        <button type="button" class="btn-add" @click="handleAddBank">Tambah Rekening Baru</button>
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
import { computed, onActivated, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, bankAPI, withdrawalAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import SuccessModal from '@/components/modals/AppSuccessModal.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import { appSettings, formatAppCurrency, getRateToIdr } from '@/utils/settings'

const router = useRouter()

const withdrawableBalance = ref(0)
const userBanks = ref([])
const selectedUserBankId = ref(null)
const withdrawAmount = ref('')
const selectedQuickAmount = ref(null)
const isSubmitting = ref(false)
const serviceId = ref(null)
const successModalOpen = ref(false)
const errorModalOpen = ref(false)
const isBottomSheetOpen = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)
const usdtToIdrRate = ref(getRateToIdr() || 16000)
const currencyRateLoaded = ref(false)
let successRedirectTimeoutId = 0
let hasRedirectedAfterSuccess = false

const quickAmounts = [
  { value: 30000, label: 'Rp 30.000' },
  { value: 500000, label: 'Rp 500.000' },
  { value: 1000000, label: 'Rp 1.000.000' },
  { value: 5000000, label: 'Rp 5.000.000' }
]

const SERVICE_FEE_RATE = 0.10
const MIN_WITHDRAW_IDR = 30000
const MAX_WITHDRAW_IDR = 100000000
const MIN_WITHDRAW_USDT_FOR_IDR = 3
const MAX_WITHDRAW_USDT = 1000000

watch(
  () => appSettings.currency?.rate_to_idr,
  () => {
    const next = getRateToIdr()
    if (next > 0) usdtToIdrRate.value = next
  },
  { immediate: true }
)

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const numericAmount = computed(() => {
  const raw = String(withdrawAmount.value || '').replace(/[^0-9]/g, '')
  return Number.parseInt(raw, 10) || 0
})

const displayAmount = computed(() => withdrawAmount.value || '')

const balanceDisplay = computed(() => formatAppCurrency(withdrawableBalance.value * (usdtToIdrRate.value || 16000), { symbol: 'Rp', decimals: 0 }))

const usdAmountToSubmit = computed(() => {
  const rate = Number(usdtToIdrRate.value || 0)
  if (!rate) return 0
  return Number((numericAmount.value / rate).toFixed(2))
})

const summaryNominal = computed(() => {
  if (!numericAmount.value) return 'Rp 0'
  return formatAppCurrency(numericAmount.value, { symbol: 'Rp', decimals: 0 })
})

const summaryFee = computed(() => {
  if (!numericAmount.value) return 'Rp 0'
  const fee = Math.round(numericAmount.value * SERVICE_FEE_RATE)
  return formatAppCurrency(fee, { symbol: 'Rp', decimals: 0 })
})

const summaryTotal = computed(() => {
  if (!numericAmount.value) return 'Rp 0'
  const fee = Math.round(numericAmount.value * SERVICE_FEE_RATE)
  const total = Math.max(0, numericAmount.value - fee)
  return formatAppCurrency(total, { symbol: 'Rp', decimals: 0 })
})

const isValidAmount = computed(() => {
  if (isSubmitting.value) return false
  if (!selectedUserBankId.value) return false
  const amount = numericAmount.value
  if (amount < MIN_WITHDRAW_IDR || amount > MAX_WITHDRAW_IDR) return false
  const rate = Number(usdtToIdrRate.value || 0)
  if (!rate) return false
  const amountUsd = amount / rate
  if (amountUsd < MIN_WITHDRAW_USDT_FOR_IDR || amountUsd > MAX_WITHDRAW_USDT) return false
  if (amountUsd > withdrawableBalance.value) return false
  return true
})

const selectedUserBank = computed(() => {
  const id = selectedUserBankId.value
  return (userBanks.value || []).find((b) => String(b?.id) === String(id)) || null
})

const goBack = () => {
  router.push('/hn/home')
}

const handleAmountInput = (event) => {
  const raw = event?.target?.value?.replace(/[^0-9]/g, '') || ''
  if (!raw) {
    withdrawAmount.value = ''
    selectedQuickAmount.value = null
    return
  }
  const num = Number.parseInt(raw, 10)
  if (!Number.isFinite(num) || num <= 0) {
    withdrawAmount.value = ''
    selectedQuickAmount.value = null
    return
  }
  withdrawAmount.value = formatAppCurrency(num, { symbol: '', decimals: 0 })
  const match = quickAmounts.find(a => a.value === num)
  selectedQuickAmount.value = match ? match.value : null
}

const selectQuickAmount = (value) => {
  selectedQuickAmount.value = value
  withdrawAmount.value = formatAppCurrency(value, { symbol: '', decimals: 0 })
}

const handleBankSelectClick = () => {
  const hasBanks = (userBanks.value?.length || 0) > 0
  if (!hasBanks) {
    router.push('/hn/connect/add')
    return
  }
  router.push('/hn/user/account')
}

const closeBottomSheet = () => {
  isBottomSheetOpen.value = false
}

const selectBank = (bank) => {
  const id = bank?.id ?? null
  if (!id) return
  selectedUserBankId.value = id
  closeBottomSheet()
}

const handleAddBank = () => {
  closeBottomSheet()
  router.push('/hn/connect/add')
}

const handleSuccessConfirm = () => {
  if (hasRedirectedAfterSuccess) return
  hasRedirectedAfterSuccess = true
  if (successRedirectTimeoutId) {
    window.clearTimeout(successRedirectTimeoutId)
    successRedirectTimeoutId = 0
  }
  router.push('/hn/home')
}

const normalizeWithdrawErrorMessage = (err) => {
  const data = err?.response?.data
  const nfe = data?.non_field_errors
  const nfeText = Array.isArray(nfe) ? String(nfe[0] || '') : String(nfe || '')
  const nfeLower = nfeText.toLowerCase().replace(/\s+/g, ' ').trim()
  if ((nfeLower.includes('setidaknya') && nfeLower.includes('produk') && nfeLower.includes('aktif')) ||
      (nfeLower.includes('at least') && nfeLower.includes('active') && nfeLower.includes('product'))) {
    return 'Belum ada proteksi aktif'
  }
  const raw = (typeof data === 'string' && data) || data?.detail || data?.message || err?.message || ''
  const s = String(raw || '').toLowerCase()
  if (s.includes('saldo') || s.includes('balance') || s.includes('insufficient') || s.includes('tidak cukup')) {
    return 'Saldo Anda tidak mencukupi'
  }
  if (s.includes('1 kali') || s.includes('sekali') || s.includes('daily') || s.includes('hari')) {
    return 'Anda hanya dapat melakukan 1 penarikan per hari.'
  }
  if (s.includes('minimum') || s.includes('maksimum') || s.includes('maximum') || s.includes('min')) {
    return 'Minimal tarik tunai tidak sesuai'
  }
  if (raw) return String(raw)
  return 'Permintaan gagal, silakan coba lagi'
}

const handleWithdraw = async () => {
  if (!numericAmount.value) {
    errorMessage.value = 'Nominal tarik tunai belum diisi'
    errorModalOpen.value = true
    return
  }
  if (!selectedUserBankId.value) {
    errorMessage.value = 'Atur rekening Anda dahulu'
    errorModalOpen.value = true
    return
  }

  const amountIdr = numericAmount.value
  if (amountIdr < MIN_WITHDRAW_IDR) {
    errorMessage.value = 'Minimal tarik tunai tidak sesuai'
    errorModalOpen.value = true
    return
  }
  if (amountIdr > MAX_WITHDRAW_IDR) {
    errorMessage.value = 'Nominal melebihi batas'
    errorModalOpen.value = true
    return
  }

  const rate = Number(usdtToIdrRate.value || 0)
  if (rate > 0) {
    const amountUsd = amountIdr / rate
    if (amountUsd < MIN_WITHDRAW_USDT_FOR_IDR) {
      errorMessage.value = 'Minimal tarik tunai tidak sesuai'
      errorModalOpen.value = true
      return
    }
    if (amountUsd > MAX_WITHDRAW_USDT) {
      errorMessage.value = 'Nominal melebihi batas'
      errorModalOpen.value = true
      return
    }
    if (amountUsd > withdrawableBalance.value) {
      errorMessage.value = 'Saldo Anda tidak mencukupi'
      errorModalOpen.value = true
      return
    }
  }

  const amountUsd = usdAmountToSubmit.value
  isSubmitting.value = true
  try {
    await withdrawalAPI.createWithdrawal({
      amount: String(amountUsd),
      bank_account_id: selectedUserBankId.value,
      pin: '',
      service_id: serviceId.value ?? 0
    })
    successMessage.value = 'Permintaan tarik uang sudah dibuat'
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
      router.push('/hn/app/settlement/history')
    }, 1200)
  } catch (err) {
    errorMessage.value = normalizeWithdrawErrorMessage(err)
    errorModalOpen.value = true
  } finally {
    isSubmitting.value = false
  }
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
    const candidates = [first?.usdt_to_idr_rate, first?.usd_to_idr_rate, first?.exchange_rate, first?.rate, first?.idr_rate]
    const picked = candidates.map((v) => parseNumber(v)).find((n) => n >= 1000 && n <= 1000000) || 0
    if (!currencyRateLoaded.value && picked) usdtToIdrRate.value = picked
  } catch (_) {
    serviceId.value = null
  }
}

const fetchCurrencySettings = async () => {
  try {
    const resp = await authAPI.getCurrencySettings()
    const data = resp?.data
    if (!data || typeof data !== 'object') return
    appSettings.currency = {
      currency_code: String(data.currency_code || appSettings.currency?.currency_code || 'USD'),
      rate_to_idr: String(data.rate_to_idr || appSettings.currency?.rate_to_idr || '1'),
      symbol: String(data.symbol || appSettings.currency?.symbol || ''),
      symbol_position: String(data.symbol_position || appSettings.currency?.symbol_position || 'prefix'),
      symbol_space: Boolean(data.symbol_space ?? appSettings.currency?.symbol_space),
      thousand_sep: String(data.thousand_sep || appSettings.currency?.thousand_sep || ','),
      decimal_sep: String(data.decimal_sep || appSettings.currency?.decimal_sep || '.'),
      decimals: Number.isFinite(Number(data.decimals)) ? Number(data.decimals) : Number(appSettings.currency?.decimals || 2)
    }
    const next = getRateToIdr()
    if (next > 0) {
      usdtToIdrRate.value = next
      currencyRateLoaded.value = true
    }
  } catch (_) {}
}

const fetchUserBanks = async () => {
  try {
    const resp = await bankAPI.getUserBanks()
    const data = resp?.data
    const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []
    if (!list.length) {
      userBanks.value = []
      selectedUserBankId.value = null
      router.push('/hn/connect/add')
      return
    }
    userBanks.value = list
    const defaultBank = list.find((b) => Boolean(b?.is_default))
    const pick = defaultBank || list[0] || null
    selectedUserBankId.value = pick?.id ?? null
  } catch (_) {
    userBanks.value = []
    selectedUserBankId.value = null
    router.push('/hn/connect/add')
  }
}

const refreshWithdrawData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    await Promise.all([fetchAccountInfo(), fetchCurrencySettings(), fetchDefaultService(), fetchUserBanks()])
  } finally {
    lastRefreshedAt.value = Date.now()
    isRefreshing.value = false
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.withdraw-page {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  max-width: 412px;
  background-color: #fbfaf7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  font-weight: 600;
  color: #000;
  margin: 0;
}

/* Hero */
.hero-content {
  padding: 0 20px 24px;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin: 0 0 8px 0;
}

.hero-subtitle {
  font-size: 14px;
  color: #635f5f;
  margin: 0 0 24px 0;
}

.balance-card {
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
  width: 65%;
}

.balance-label {
  color: #fff;
  font-size: 14px;
  margin: 0 0 4px 0;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
}

.balance-amount {
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
}

.balance-desc {
  color: #7d7d7d;
  font-size: 10px;
  margin: 0;
}

.balance-img {
  position: absolute;
  right: -10px;
  top: -40px;
  width: 180px;
  z-index: 1;
  pointer-events: none;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

/* Account */
#section-account .section-container {
  padding: 0 20px 24px;
}

#section-account .card {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
  padding: 16px;
}

#section-account .card-title {
  font-size: 14px;
  font-weight: 600;
  color: #060606;
  margin: 0 0 16px 0;
}

.add-account-btn {
  width: 100%;
  background-color: #fefefe;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.add-account-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-plus {
  width: 20px;
  height: 20px;
}

.add-account-text {
  font-size: 14px;
  color: #060606;
}

.icon-wallet {
  width: 24px;
  height: 24px;
}

.selected-bank-card {
  width: 100%;
  background-color: #fefefe;
  border: 1px solid #f4bd40;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.selected-bank-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.selected-bank-name {
  font-size: 14px;
  font-weight: 600;
  color: #060606;
}

.selected-bank-number {
  font-size: 12px;
  color: #635f5f;
}

.selected-bank-code {
  font-size: 12px;
  color: #8a8888;
}

/* Amount */
#section-amount .section-container {
  padding: 0 20px 24px;
}

#section-amount .card {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
  padding: 16px;
}

#section-amount .card-title {
  font-size: 14px;
  font-weight: 600;
  color: #060606;
  margin: 0 0 16px 0;
}

.input-wrapper {
  margin-bottom: 16px;
}

.amount-input {
  width: 100%;
  padding: 16px;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  font-size: 12px;
  color: #333;
  background-color: #fefefe;
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
  gap: 8px;
  margin-bottom: 16px;
}

.quick-amount-btn {
  width: 100%;
  padding: 12px;
  background-color: #fefefe;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  font-size: 14px;
  color: #000;
  cursor: pointer;
  text-align: center;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
}

.quick-amount-btn.active {
  border-color: #f4bd40;
  color: #f4bd40;
}

.quick-amount-btn:hover {
  border-color: #f4bd40;
}

.info-box {
  background-color: #fbefd8;
  border-radius: 5px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
}

.info-text {
  font-size: 12px;
  color: #635f5f;
}

/* Summary */
#section-summary .section-container {
  padding: 0 20px 24px;
}

#section-summary .card {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
  padding: 16px;
}

#section-summary .card-title {
  font-size: 14px;
  font-weight: 600;
  color: #060606;
  margin: 0 0 16px 0;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8a8888;
}

.summary-divider {
  border: none;
  border-top: 1px dashed rgba(0, 0, 0, 0.5);
  margin: 0 0 16px 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-label {
  font-size: 14px;
  font-weight: 600;
  color: #060606;
}

.total-value {
  font-size: 16px;
  font-weight: 700;
  color: #060606;
}

/* Footer */
.footer {
  padding: 0 20px 40px;
  margin-top: auto;
}

.footer-info {
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  background-color: #f3b73f;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.submit-btn:active {
  opacity: 0.8;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Bottom Sheet */
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
}

#section-bottom-sheet .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  pointer-events: auto;
}

#section-bottom-sheet .bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  min-height: 40vh;
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
  background-color: #f9f9fc;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  cursor: pointer;
}

#section-bottom-sheet .account-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

#section-bottom-sheet .account-label {
  font-size: 12px;
  color: #f4bd40;
  font-weight: 600;
}

#section-bottom-sheet .account-number {
  font-size: 16px;
  font-weight: 700;
  color: #000;
}

#section-bottom-sheet .account-bank,
#section-bottom-sheet .account-name {
  font-size: 12px;
  color: #000;
}

#section-bottom-sheet .radio-icon {
  width: 20px;
  height: 20px;
}

#section-bottom-sheet .sheet-title {
  font-size: 22px;
  font-weight: 700;
  color: #000;
  margin: 0 0 12px 0;
  text-align: center;
}

#section-bottom-sheet .sheet-desc {
  font-size: 15px;
  color: #7b7b7b;
  text-align: center;
  margin: 0 0 32px 0;
  line-height: 1.5;
}

#section-bottom-sheet .btn-add {
  width: 100%;
  background-color: #f3b73f;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
  margin-top: 12px;
}
</style>
