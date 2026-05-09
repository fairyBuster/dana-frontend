<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <img src="/assets/image/4283_619.svg" alt="Back" class="back-icon" @click="goBack">
        <h1 class="header-title">Payout</h1>
      </header>
    </section>

    <!-- Channel Payout -->
    <section id="section-channel-payout">
      <div class="channel-payout-content">
        <h2 class="section-title" style="margin-bottom: 16px;">Choose channel payout</h2>
        <div class="channel-grid">
          <div
            class="channel-card"
            :class="{ active: selectedChannel === 'USDT' }"
            @click="selectedChannel = 'USDT'"
          >
            <img src="/assets/image/65dd62c6e1300473a49c744e825c21008d000875.png" alt="USDT" class="channel-icon">
            <span class="channel-name">USDT</span>
            <div v-if="selectedChannel === 'USDT'" class="badge">OK</div>
          </div>
          <div
            class="channel-card"
            :class="{ active: selectedChannel === 'IDR' }"
            @click="selectedChannel = 'IDR'"
          >
            <img src="/assets/image/d85fb29e4e19dd899589dbf989e615ca933f1f52.png" alt="Rupiah IDR" class="channel-icon">
            <span class="channel-name">Rupiah IDR</span>
            <div v-if="selectedChannel === 'IDR'" class="badge">OK</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Choose Channel (Bank) -->
    <section id="section-choose-channel">
      <div class="choose-channel-content">
        <div class="section-title-wrapper">
          <div class="section-indicator"></div>
          <h2 class="section-title">Choose channel</h2>
        </div>
        <div v-if="selectedUserBank" class="bank-card" @click="handleBankSelectClick">
          <div class="bank-info">
            <div class="bank-owner">{{ selectedUserBank.account_name || '-' }}</div>
            <div class="bank-details">{{ selectedUserBank.account_number || '-' }}<br>{{ selectedUserBank.bank_name || selectedUserBank.bank_code || '-' }}</div>
          </div>
          <img src="/assets/image/a7278a84dccf299c032e11e26c6bad56b79f5ef7.png" alt="Selected" class="check-icon">
        </div>
        <div v-else class="bank-card" @click="handleBankSelectClick">
          <div class="bank-info">
            <div class="bank-owner">Select bank account</div>
            <div class="bank-details">No bank account selected</div>
          </div>
          <img src="/assets/image/a7278a84dccf299c032e11e26c6bad56b79f5ef7.png" alt="Select" class="check-icon">
        </div>
      </div>
    </section>

    <!-- Enter Amount -->
    <section id="section-enter-amount">
      <div class="enter-amount-content">
        <div class="section-title-wrapper">
          <div class="section-indicator"></div>
          <h2 class="section-title">Enter the payout amount</h2>
        </div>
        <div class="input-group">
          <div class="input-field">
            <span class="currency-label">USDT</span>
            <div class="separator"></div>
            <input
              type="text"
              class="amount-input"
              :value="displayUsdtAmount"
              :readonly="selectedChannel !== 'USDT'"
              inputmode="numeric"
              @input="formatUsdtInput"
              placeholder="Please enter your amount"
            >
          </div>
          <div class="input-field">
            <span class="currency-label">IDR</span>
            <div class="separator"></div>
            <input
              type="text"
              class="amount-input"
              :value="displayIdrAmount"
              :readonly="selectedChannel !== 'IDR'"
              inputmode="numeric"
              @input="formatIdrInput"
              placeholder="Please enter your amount with rupiah"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Summary -->
    <section id="section-summary">
      <div class="summary-content">
        <div class="summary-box">
          <!-- <div class="summary-row">
            <span>Minimum Payout</span>
            <span class="val-with-line">{{ selectedChannel === 'USDT' ? '$3' : 'Rp 35,000' }}</span>
          </div> -->
          <div class="summary-row" style="margin-top: 8px;">
            <span>Payout fee</span>
            <span></span>
          </div>
          <div class="summary-row">
            <span>IDR</span>
            <span>12%</span>
          </div>
          <div class="summary-row">
            <span>USDT</span>
            <span>$3</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Action -->
    <section id="section-action">
      <div class="action-content">
        <button class="btn-payout" @click="handleWithdraw" :disabled="!isValidAmount || isSubmitting">
          <LoadingSpinner v-if="isSubmitting" :visible="true" message="" />
          <span v-else>Payout</span>
        </button>
      </div>
    </section>

    <!-- Instructions -->
    <section id="section-instructions">
      <div class="instructions-content">
        <div class="instructions-box">
          <h3 class="instructions-title">Payout instructions</h3>
          <ul class="instructions-list">
            <li> 🔹 The minimum withdrawal amount is $3 USD for the IDR withdrawal channel.</li>
            <li> 🔹 The minimum withdrawal amount is $10 USD for the USDT withdrawal channel.</li>
            <li> 🔹 All withdrawal transactions are processed automatically in real-time.</li>
            <li> 🔹 Please ensure that your withdrawal account or wallet information is correct before submitting a withdrawal request.</li>
            <li> 🔹 After completing the withdrawal request, refresh the page and check your account balance.</li>
            <li> 🔹 Withdrawals below the minimum amount cannot be processed.</li>
            <li> 🔹 All withdrawal transactions are handled directly through the official AVR company system.</li>
            <li> 🔹 All withdrawal activities must only be carried out through the official AVR platform. Users are advised not to trust unreasonable offers or transactions outside the company.</li>
            <li> 🔹 For security and verification purposes, please keep your withdrawal receipt or transaction proof for future reference if needed.</li>
            <li> 🔹 By making a withdrawal, users are considered to have agreed to all AVR withdrawal rules and policies.</li>
          </ul>
          <p class="instructions-text">
            Every withdrawal on AVR (Autonomous Virtual Resource) is processed automatically in real-time, and users are not required to report or submit any additional confirmation unless the withdrawal has not been received. Users are encouraged to document their withdrawal transactions through the official chat channel for positive and official activity purposes. Please ensure that all withdrawal activities are carried out only through the official AVR platform and keep your transaction proof for security and verification purposes when needed.
          </p>
        </div>
      </div>
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
          :key="bank?.id || `${bank?.bank_code || ''}-${bank?.account_number || ''}`"
          class="account-card"
          @click="selectBank(bank)"
        >
          <div class="account-details">
            <span class="account-label">Bank Account</span>
            <span class="account-number">{{ bank?.account_number || '-' }}</span>
            <span class="account-bank">{{ bank?.bank_name || bank?.bank_code || '-' }}</span>
            <span class="account-name">{{ bank?.account_name || '-' }}</span>
          </div>
          <img class="radio-icon" src="/assets/image/a7278a84dccf299c032e11e26c6bad56b79f5ef7.png" alt="Selected">
        </div>
      </template>

      <template v-else>
        <h3 class="sheet-title">Withdrawal Account</h3>
        <p class="sheet-desc">Add a withdrawal account to process your payout transaction!</p>
        <button type="button" class="btn-add" @click="handleAddBank">Add Withdrawal Account</button>
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
const selectedChannel = ref('IDR')
let successRedirectTimeoutId = 0
let hasRedirectedAfterSuccess = false
const usdtToIdrRate = ref(16000)

const SERVICE_FEE_RATE = 0.10
const MIN_WITHDRAW_IDR = 30000
const MAX_WITHDRAW_IDR = 100000000
const MIN_WITHDRAW_USDT = 10
const MAX_WITHDRAW_USDT = 1000000

const numericAmount = computed(() => {
  const raw = withdrawAmount.value.replace(/[^0-9]/g, '')
  return Number.parseInt(raw, 10) || 0
})

const idrAmountNumber = computed(() => {
  const amount = numericAmount.value
  if (!amount) return 0
  if (selectedChannel.value === 'IDR') return amount
  return Math.round(amount * Number(usdtToIdrRate.value || 0))
})

const usdtAmountNumber = computed(() => {
  const amount = numericAmount.value
  if (!amount) return 0
  if (selectedChannel.value === 'USDT') return amount
  const rate = Number(usdtToIdrRate.value || 0)
  if (!rate) return 0
  return Number((amount / rate).toFixed(2))
})

const displayUsdtAmount = computed(() => {
  const num = usdtAmountNumber.value
  if (!num) return ''
  return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)}`
})

const displayIdrAmount = computed(() => {
  const num = idrAmountNumber.value
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
  if (selectedChannel.value === 'USDT') {
    if (amount < MIN_WITHDRAW_USDT || amount > MAX_WITHDRAW_USDT) return false
    if (amount > withdrawableBalance.value) return false
    return true
  }
  if (amount < MIN_WITHDRAW_IDR || amount > MAX_WITHDRAW_IDR) return false
  const rate = Number(usdtToIdrRate.value || 0)
  if (!rate) return false
  const amountUsd = amount / rate
  if (amountUsd > withdrawableBalance.value) return false
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

const formatUsdtInput = (event) => {
  if (selectedChannel.value !== 'USDT') return
  const raw = event?.target?.value?.replace(/[^0-9]/g, '') || ''
  if (!raw) {
    withdrawAmount.value = ''
    return
  }
  const n = Number.parseInt(raw, 10)
  withdrawAmount.value = Number.isFinite(n) ? new Intl.NumberFormat('en-US').format(n) : ''
}

const formatIdrInput = (event) => {
  if (selectedChannel.value !== 'IDR') return
  const raw = event?.target?.value?.replace(/[^0-9]/g, '') || ''
  if (!raw) {
    withdrawAmount.value = ''
    return
  }
  const n = Number.parseInt(raw, 10)
  withdrawAmount.value = Number.isFinite(n) ? new Intl.NumberFormat('id-ID').format(n) : ''
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
    return 'Make sure the withdrawal amount matches your available balance.'
  }
  if (s.includes('1 kali') || s.includes('sekali') || s.includes('daily') || s.includes('hari')) {
    return 'You can only make 1 withdrawal per day.'
  }
  if (s.includes('minimum') || s.includes('maksimum') || s.includes('maximum') || s.includes('min')) {
    return 'Make sure your withdrawal amount is within the allowed range.'
  }
  if (raw) return String(raw)
  return 'Request failed, please refresh the page'
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
    const candidates = [
      first?.usdt_to_idr_rate,
      first?.usd_to_idr_rate,
      first?.exchange_rate,
      first?.rate,
      first?.idr_rate,
      first?.idr_per_usdt
    ]
    const picked = candidates.map((v) => parseNumber(v)).find((n) => n >= 1000 && n <= 1000000) || 0
    if (picked) usdtToIdrRate.value = picked
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
    errorMessage.value = 'Please select a bank account'
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
    successMessage.value = 'Your request has been received by the system.'
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  background-color: #f8f8f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
}

h1, h2, h3, p {
  margin: 0;
}

section {
  width: 100%;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-indicator {
  width: 4px;
  height: 16px;
  background-color: #1b46f5;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  position: relative;
}

.back-icon {
  position: absolute;
  left: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

/* Channel Payout */
.channel-payout-content {
  padding: 16px 20px;
}

.channel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.channel-card {
  background-color: #ffffff;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  border: 2px solid transparent;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  cursor: pointer;
  transition: border-color 0.2s;
}

.channel-card.active {
  border-color: #1b46f5;
}

.channel-icon {
  width: 53px;
  height: 53px;
  object-fit: contain;
}

.channel-name {
  font-size: 12px;
  color: #000000;
  font-weight: 600;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #1b46f5;
  color: #ffffff;
  font-size: 10px;
  padding: 2px 6px;
  border-bottom-left-radius: 5px;
  font-weight: 600;
}

/* Choose Channel (Bank) */
.choose-channel-content {
  padding: 16px 20px;
}

.bank-card {
  background-color: #ffffff;
  border: 1px solid #f4f4f4;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.bank-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bank-owner {
  font-size: 14px;
  color: #000000;
  font-weight: 600;
}

.bank-details {
  font-size: 14px;
  color: #707070;
  line-height: 1.4;
}

.check-icon {
  width: 25px;
  height: 25px;
  object-fit: contain;
}

/* Enter Amount */
.enter-amount-content {
  padding: 16px 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-field {
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 20px;
  padding: 15px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.currency-label {
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  width: 36px;
}

.separator {
  width: 1px;
  height: 16px;
  background-color: #777777;
  opacity: 0.5;
}

.placeholder-text {
  font-size: 12px;
  color: #aaaaaa;
}

.amount-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 12px;
  color: #000000;
  outline: none;
  font-family: 'Inter', sans-serif;
  min-width: 0;
}

.amount-input::placeholder {
  color: #aaaaaa;
}

.amount-input[readonly] {
  color: #777777;
}

/* Summary */
.summary-content {
  padding: 16px 20px;
}

.summary-box {
  background-color: #f1f5ff;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #727272;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.val-with-line {
  border-bottom: 1px solid #000000;
  padding-bottom: 2px;
  min-width: 50px;
  text-align: right;
  color: #444444;
}

/* Action */
.action-content {
  padding: 16px 20px;
}

.btn-payout {
  width: 100%;
  background-color: #1b46f5;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-payout:hover {
  background-color: #1538c4;
}

.btn-payout:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Instructions */
.instructions-content {
  padding: 16px 10px;
}

.instructions-box {
  background: linear-gradient(360deg, rgba(255, 255, 255, 0.47) 0%, rgba(190, 215, 249, 0.47) 100%);
  border: 1px solid #ffffff;
  border-radius: 5px;
  padding: 16px;
}

.instructions-title {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
}

.instructions-text {
  font-size: 11px;
  color: #5e5e5e;
  line-height: 1.6;
}

.instructions-list {
  margin: 0 0 10px 0;
  padding: 0;
  font-size: 11px;
  color: #5e5e5e;
  line-height: 1.6;
  list-style: none;
}

.instructions-list li + li {
  margin-top: 6px;
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
  color: #1b46f5;
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
  width: 16px;
  height: 16px;
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
}

#section-bottom-sheet .btn-add {
  width: 100%;
  max-width: 387px;
  background-color: #1b46f5;
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
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
}
</style>
