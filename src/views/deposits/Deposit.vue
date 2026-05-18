<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/179_107.svg" alt="Back">
        </button>
        <h1 class="header-title">Recharge</h1>
      </header>
    </section>

    <!-- Channel Recharge Section -->
    <section id="section-channel-recharge">
      <h2 class="section-title">Choose channel recharge</h2>
      <div class="channel-cards">
        <div
          v-for="channel in channels"
          :key="channel.id"
          class="channel-card"
          :class="{ active: selectedChannel === channel.id }"
          @click="selectedChannel = channel.id"
        >
          <div v-if="selectedChannel === channel.id" class="badge">{{ channel.badge || 'OK' }}</div>
          <img :src="channel.icon" :alt="channel.label" class="card-icon">
          <span class="card-label">{{ channel.label }}</span>
        </div>
      </div>
    </section>

    <!-- Choose Channel Section -->
    <section id="section-choose-channel">
      <h2 class="section-title">Choose channel</h2>
      <div class="payment-method-card">
        <div class="payment-info">
          <div class="payment-name">Payment methods {{ currentChannelLabel }}</div>
          <div class="payment-limit">Minimum balance: {{ channelLimitText }}</div>
        </div>
        <img src="/assets/image/a7278a84dccf299c032e11e26c6bad56b79f5ef7.png" alt="Selected" class="check-icon">
      </div>
    </section>

    <!-- Top Up Amount Section -->
    <section id="section-top-up-amount">
      <h2 class="section-title">Enter the top-up amount</h2>

      <div v-if="!isUsdMode" class="input-group">
        <div class="input-prefix">USDT</div>
        <div class="input-divider"></div>
        <input
          type="text"
          :value="displayUsdtAmount"
          @input="formatUsdtInput"
          placeholder="Please enter your amount"
          :readonly="!isUsdtMode"
          inputmode="decimal"
          class="amount-input"
        >
      </div>

      <div v-if="isUsdMode" class="input-group">
        <div class="input-prefix">USD</div>
        <div class="input-divider"></div>
        <input
          type="text"
          :value="displayUsdAmount"
          @input="formatUsdInput"
          placeholder="Please enter your amount"
          inputmode="decimal"
          class="amount-input"
        >
      </div>

      <div v-if="isUsdMode" class="input-group">
        <div class="input-prefix">IDR</div>
        <div class="input-divider"></div>
        <input
          type="text"
          :value="displayUsdIdrAmount"
          placeholder="Converted rupiah"
          readonly
          inputmode="numeric"
          class="amount-input"
        >
      </div>

      <div v-if="!isUsdMode" class="input-group">
        <div class="input-prefix">IDR</div>
        <div class="input-divider"></div>
        <input
          type="text"
          :value="displayIdrAmount"
          @input="formatIdrInput"
          placeholder="Please enter your amount with rupiah"
          :readonly="isUsdtMode"
          inputmode="numeric"
          class="amount-input"
        >
      </div>

      <p v-if="showWarning" class="warning-message">{{ warningText }}</p>

      <button class="btn-primary" @click="handleDeposit" :disabled="!isValidAmount || isLoading">
        <LoadingSpinner v-if="isLoading" :visible="true" message="" />
        <span v-else>Top up</span>
      </button>
    </section>

    <!-- Instructions Section -->
    <section id="section-instructions">
      <div class="instructions-card">
       
        <br>
        <ol class="instructions-list">
          <li>The minimum deposit amount for IDR payments is IDR 51,000.</li>
          <li>The minimum deposit amount for USDT payments is USDT 5.</li>
          <li>All transactions are processed automatically in real-time.</li>
          <li>Please ensure that the payment amount and wallet/account details are correct before making a deposit.</li>
          <li>After completing the transaction, refresh the page and check your balance.</li>
          <li>Deposits below the minimum amount cannot be processed.</li>
          <li>All transactions are processed directly within the HUE company system.</li>
          <li>Deposit processing is automatic for both IDR and USDT payments.</li>
          <li>By making a deposit, users agree to all HUE deposit rules and policies.</li>
        </ol>
        <p class="instructions-text">
          All deposit activities must only be carried out through the official HUE platform, and users are advised not to be tempted by unreasonable offers or transactions outside the company. For security and verification purposes, please keep your transaction receipt or proof of payment for future reference if needed. By making a deposit, users are considered to have agreed to all HUE deposit rules and policies.
        </p>
      </div>
    </section>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { depositAPI } from '@/services/api'
import { appSettings, formatAppCurrency, getRateToIdr } from '@/utils/settings'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'

const router = useRouter()
const depositAmount = ref('')
const usdtAmount = ref('')
const usdAmount = ref('')
const selectedChannel = ref('usdt-trc20')
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const usdtToIdrRate = ref(getRateToIdr() || 17000)
const USD_TO_IDR_RATE = 17000

watch(
  () => appSettings.currency?.rate_to_idr,
  () => {
    const next = getRateToIdr()
    if (next > 0) usdtToIdrRate.value = next
  },
  { immediate: true }
)

const channels = [

  { id: 'usd', label: 'USD', badge: null, icon: '/assets/image/9525994a3170136d2238b0ba554db6cb77f4508e.png' },
  { id: 'rupiah-idr', label: 'Rupiah IDR', badge: null, icon: '/assets/image/d85fb29e4e19dd899589dbf989e615ca933f1f52.png' }
]

const currentChannelLabel = computed(() => {
  const ch = channels.find(c => c.id === selectedChannel.value)
  return ch ? ch.label : ''
})

const isUsdtMode = computed(() => {
  return String(selectedChannel.value || '').toLowerCase().startsWith('usdt')
})

const isUsdMode = computed(() => {
  return String(selectedChannel.value || '').toLowerCase() === 'usd'
})

const MIN_DEPOSIT_USDT = 5
const MAX_DEPOSIT_USDT = 50000
const MIN_DEPOSIT_IDR = 51000
const MAX_DEPOSIT_IDR = 20000000

const channelLimitText = computed(() => {
  if (isUsdtMode.value || isUsdMode.value) return '5-50000'
  return '51K-20000K'
})

const numericAmount = computed(() => {
  const raw = depositAmount.value.replace(/[^0-9]/g, '')
  return Number.parseInt(raw, 10) || 0
})

const numericUsdtAmount = computed(() => {
  const raw = String(usdtAmount.value || '').trim()
  if (!raw) return 0
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 0
})

const numericUsdAmount = computed(() => {
  const raw = String(usdAmount.value || '').trim()
  if (!raw) return 0
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : 0
})

const displayIdrAmount = computed(() => {
  return depositAmount.value || ''
})

const displayUsdtAmount = computed(() => {
  return usdtAmount.value || ''
})

const displayUsdAmount = computed(() => {
  return usdAmount.value || ''
})

const displayUsdIdrAmount = computed(() => {
  const usd = numericUsdAmount.value
  if (!usd) return ''
  const idr = Math.round(usd * USD_TO_IDR_RATE)
  return formatAppCurrency(idr, { symbol: '', decimals: 0 })
})

const showWarning = computed(() => {
  if (isUsdtMode.value) {
    return (
      numericUsdtAmount.value > 0 &&
      (numericUsdtAmount.value < MIN_DEPOSIT_USDT || numericUsdtAmount.value > MAX_DEPOSIT_USDT)
    )
  }
  if (isUsdMode.value) {
    return (
      numericUsdAmount.value > 0 &&
      (numericUsdAmount.value < MIN_DEPOSIT_USDT || numericUsdAmount.value > MAX_DEPOSIT_USDT)
    )
  }
  return (
    numericAmount.value > 0 &&
    (numericAmount.value < MIN_DEPOSIT_IDR || numericAmount.value > MAX_DEPOSIT_IDR)
  )
})

const warningText = computed(() => {
  if (isUsdtMode.value) {
    if (numericUsdtAmount.value > MAX_DEPOSIT_USDT) return `Maximum transaction USDT ${MAX_DEPOSIT_USDT}`
    return `Minimum transaction USDT ${MIN_DEPOSIT_USDT}`
  }
  if (isUsdMode.value) {
    if (numericUsdAmount.value > MAX_DEPOSIT_USDT) return `Maximum transaction USD ${MAX_DEPOSIT_USDT}`
    return `Minimum transaction USD ${MIN_DEPOSIT_USDT}`
  }
  if (numericAmount.value > MAX_DEPOSIT_IDR) return 'Maximum transaction IDR 20,000,000'
  return 'Minimum transaction IDR 51,000'
})

const isValidAmount = computed(() => {
  if (isUsdtMode.value) {
    return numericUsdtAmount.value >= MIN_DEPOSIT_USDT && numericUsdtAmount.value <= MAX_DEPOSIT_USDT
  }
  if (isUsdMode.value) {
    return numericUsdAmount.value >= MIN_DEPOSIT_USDT && numericUsdAmount.value <= MAX_DEPOSIT_USDT
  }
  return numericAmount.value >= MIN_DEPOSIT_IDR && numericAmount.value <= MAX_DEPOSIT_IDR
})

const goBack = () => {
  router.go(-1)
}

const formatUsdtInput = (event) => {
  if (!isUsdtMode.value) return
  let raw = String(event?.target?.value || '')
  raw = raw.replace(/[^0-9.]/g, '')
  const firstDot = raw.indexOf('.')
  if (firstDot !== -1) {
    raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '')
  }
  if (raw.startsWith('.')) raw = `0${raw}`
  if (raw.includes('.')) {
    const [a, b] = raw.split('.')
    raw = `${a}.${String(b || '').slice(0, 2)}`
  }
  usdtAmount.value = raw

  const rate = Number(usdtToIdrRate.value || 0)
  const usdt = Number.parseFloat(raw)
  if (!Number.isFinite(usdt) || usdt <= 0 || !rate) {
    depositAmount.value = ''
    return
  }
  const idr = Math.round(usdt * rate)
  depositAmount.value = formatAppCurrency(idr, { symbol: '', decimals: 0 })
}

const formatIdrInput = (event) => {
  if (isUsdtMode.value || isUsdMode.value) return
  const raw = event?.target?.value?.replace(/[^0-9]/g, '') || ''
  if (!raw) {
    depositAmount.value = ''
    usdtAmount.value = ''
    return
  }
  const num = Number.parseInt(raw, 10)
  if (!Number.isFinite(num) || num <= 0) {
    depositAmount.value = ''
    usdtAmount.value = ''
    return
  }
  depositAmount.value = formatAppCurrency(num, { symbol: '', decimals: 0 })

  const rate = Number(usdtToIdrRate.value || 0)
  if (!rate) {
    usdtAmount.value = ''
    return
  }
  const usdt = num / rate
  const fixed = usdt.toFixed(2).replace(/\.?0+$/, '')
  usdtAmount.value = fixed
}

const formatUsdInput = (event) => {
  if (!isUsdMode.value) return
  let raw = String(event?.target?.value || '')
  raw = raw.replace(/[^0-9.]/g, '')
  const firstDot = raw.indexOf('.')
  if (firstDot !== -1) {
    raw = raw.slice(0, firstDot + 1) + raw.slice(firstDot + 1).replace(/\./g, '')
  }
  if (raw.startsWith('.')) raw = `0${raw}`
  if (raw.includes('.')) {
    const [a, b] = raw.split('.')
    raw = `${a}.${String(b || '').slice(0, 2)}`
  }
  usdAmount.value = raw
}

const normalizeDepositWalletType = (value) => {
  const v = String(value || '').trim().toUpperCase()
  if (v === 'BALANCE' || v === 'BALANCE_DEPOSIT') return v
  return ''
}

const defaultUsdWalletType = computed(() => {
  const s = appSettings.settings || {}
  const candidates = [
    s?.usd_deposit_wallet_type,
    s?.usdDepositWalletType,
    s?.deposit_wallet_type,
    s?.depositWalletType,
    s?.wallet_type_deposit,
    s?.walletTypeDeposit,
    s?.wallet_type,
    s?.walletType
  ]
  const picked = candidates.find((x) => String(x ?? '').trim())
  const normalized = normalizeDepositWalletType(picked)
  return normalized || 'BALANCE_DEPOSIT'
})

watch(
  () => selectedChannel.value,
  (next, prev) => {
    const normalizeMode = (val) => {
      const s = String(val || '').toLowerCase()
      if (s.startsWith('usdt')) return 'USDT'
      if (s === 'usd') return 'USD'
      return 'IDR'
    }
    const nextMode = normalizeMode(next)
    const prevMode = normalizeMode(prev)
    if (nextMode === prevMode) return

    if (nextMode === 'USD') {
      depositAmount.value = ''
      usdtAmount.value = ''
      return
    }
    if (prevMode === 'USD') {
      usdAmount.value = ''
    }

    const nextIsUsdt = nextMode === 'USDT'
    const prevIsUsdt = prevMode === 'USDT'
    if (nextIsUsdt === prevIsUsdt) return

    const rate = Number(usdtToIdrRate.value || 0)
    if (!rate) return

    if (nextIsUsdt) {
      if (!usdtAmount.value && numericAmount.value > 0) {
        const usdt = numericAmount.value / rate
        usdtAmount.value = usdt.toFixed(2).replace(/\.?0+$/, '')
      }
      if (usdtAmount.value) {
        const u = Number.parseFloat(usdtAmount.value)
        if (Number.isFinite(u) && u > 0) {
          depositAmount.value = formatAppCurrency(Math.round(u * rate), { symbol: '', decimals: 0 })
        }
      }
      return
    }

    if (!depositAmount.value && numericUsdtAmount.value > 0) {
      depositAmount.value = formatAppCurrency(Math.round(numericUsdtAmount.value * rate), { symbol: '', decimals: 0 })
    }
    if (numericAmount.value > 0) {
      usdtAmount.value = (numericAmount.value / rate).toFixed(2).replace(/\.?0+$/, '')
    } else {
      usdtAmount.value = ''
    }
  }
)

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Failed to process deposit'
  if (typeof data === 'string') return data
  const detail = data?.detail ? String(data.detail) : ''
  const message = data?.message ? String(data.message) : ''
  const combined = `${detail} ${message}`.trim()
  const s = combined.toLowerCase()
  if (s.includes('verify signature failed') || (s.includes('jayapay') && s.includes('signature') && s.includes('failed'))) {
    return 'Payment parameters incorrect. Please try again'
  }
  if (detail) return detail
  if (message) return message
  return 'Failed to process deposit'
}

const handleDeposit = async () => {
  if (!isValidAmount.value) return

  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    let resp
    if (isUsdMode.value) {
      const fixed = numericUsdAmount.value.toFixed(2)
      resp = await depositAPI.initiateUsd({
        amount: fixed,
        busi_code: '122001',
        wallet_type: defaultUsdWalletType.value
      })
    } else {
      const amount = numericAmount.value
      resp = await depositAPI.initiateJayapay({ amount, wallet_type: 'BALANCE' })
    }

    const paymentUrl = String(resp?.data?.payment_url || resp?.data?.paymentUrl || resp?.data?.url || '').trim()
    if (!paymentUrl) {
      throw new Error('Payment URL not available')
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
* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  background-color: #f8f8f8;
  max-width: 100%;
  min-height: 100vh;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

h1, h2, h3, p {
  margin: 0;
}

/* Header Section */
#section-header {
  padding: 12px 10px;
}

.header {
  display: flex;
  align-items: center;
  position: relative;
  height: 24px;
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
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.header-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin: 0;
}

/* Channel Recharge Section */
#section-channel-recharge {
  padding: 10px 20px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: #000000;
  margin: 0 0 12px 0;
}

.channel-cards {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.channel-card {
  flex: 1;
  background-color: #ffffff;
  border-radius: 5px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.channel-card.active {
  border-color: #1b46f5;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #1b46f5;
  color: #ffffff;
  font-size: 10px;
  width: 32px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 5px 0 5px;
}

.card-icon {
  width: 47px;
  height: 47px;
  margin-bottom: 8px;
  object-fit: contain;
}

.card-label {
  font-size: 11px;
  color: #000000;
  font-weight: bold;
}

/* Choose Channel Section */
#section-choose-channel {
  padding: 10px;
}

.payment-method-card {
  background-color: #ffffff;
  border: 1px solid #f4f4f4;
  border-radius: 5px;
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.payment-name {
  font-size: 15px;
  color: #000000;
  margin-bottom: 10px;
}

.payment-limit {
  font-size: 13px;
  color: #707070;
}

.check-icon {
  width: 25px;
  height: 25px;
}

/* Top Up Amount Section */
#section-top-up-amount {
  padding: 10px 30px 20px 30px;
}

.input-group {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 20px;
 
  margin-bottom: 12px;
  padding: 18px 16px;
}

.input-prefix {
  font-size: 14px;
  color: #000000;
  font-weight: bold;
  width: 36px;
}

.input-divider {
  width: 1px;
  height: 16px;
  background-color: #777777;
  margin: 0 12px;
  opacity: 0.5;
}

.amount-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #000000;
  background: transparent;
  font-family: inherit;
}

.amount-input::placeholder {
  color: #aaaaaa;
}

.amount-input[readonly] {
  color: #777777;
}

.warning-message {
  color: #ff0000;
  font-size: 14px;
  margin: 0 0 8px 4px;
}

.btn-primary {
  width: 100%;
  height: 48px;
  background-color: #1b46f5;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  margin-top: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1538c4;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Instructions Section */
#section-instructions {
  padding: 10px ;
}

.instructions-card {
  background: linear-gradient(360deg, rgba(255, 255, 255, 0.47) 0%, rgba(190, 215, 249, 0.47) 100%);
  border: 1px solid #ffffff;
  border-radius: 5px;
  padding: 16px;
}

.instructions-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 35px;
  color: #000000;
  margin: 0 0 8px 0;
}

.instructions-text {
  font-size: 14px;
  color: #5e5e5e;
  line-height: 1.5;
  margin: 0;
}

.instructions-list {
  margin: 0 0 10px 18px;
  padding: 0;
  font-size: 14px;
  color: #5e5e5e;
  line-height: 1.5;
}

.instructions-list li + li {
  margin-top: 6px;
}
</style>
