<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <div class="header-content">
        <div class="user-profile">
          <div class="avatar-wrapper">
            <img src="/assets/image/4195_135.svg" class="avatar-bg" alt="Avatar Background">
            <img src="/assets/image/Logo02.png" class="avatar-img" alt="Logo">
          </div>
          <div class="user-details">
            <div class="uid-row">
              <span class="uid-text">
                UID:
                <span v-if="showUidPlaceholder" class="uid-placeholder"></span>
                <span v-else class="uid-value">{{ displayUid }}</span>
              </span>
              <img
                src="/assets/image/4182_140.svg"
                class="copy-icon"
                :class="{ disabled: showUidPlaceholder }"
                alt="Copy UID"
                @click="copyUid"
              >
            </div>
            <span class="site-text">Site: AVR Mining</span>
          </div>
        </div>
        <img src="/assets/image/4200_222.svg" class="logout-icon" alt="Logout" @click="handleLogout">
      </div>
    </section>

    <!-- Wallet -->
    <section id="section-wallet">
      <div class="balance-card">
        <div class="balance-info">
          <div class="balance-label-row">
            <span class="label-text">Available</span>
            <button
              type="button"
              ref="currencyAnchorEl"
              class="currency-selector"
              @click.stop="toggleCurrencyMenu"
            >
              <span class="currency-text">{{ currency }}</span>
              <img src="/assets/image/4195_147.svg" class="arrow-down" alt="Select Currency">
              <div v-if="currencyMenuOpen" class="currency-menu" @click.stop>
                <button
                  v-for="opt in currencyOptions"
                  :key="opt.value"
                  type="button"
                  class="currency-menu-item"
                  :class="{ active: opt.value === currency }"
                  @click.stop="selectCurrency(opt.value)"
                >
                  {{ opt.label }}
                </button>
              </div>
            </button>
          </div>
          <div class="balance-amount">{{ isBalanceVisible ? balanceCurrencyText : maskedBalanceText }}</div>
        </div>
        <img src="/assets/image/2009e2edfb1a4a5ac8e1c8bf45271524e72442d9.png" class="wallet-img" alt="Wallet Illustration">
      </div>
      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-label">Recharge balance</span>
          <span class="stat-value">{{ balanceDepositCurrencyText }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Today's</span>
          <span class="stat-value">{{ todayIncomeCurrencyText }}</span>
        </div>
      </div>
    </section>

    <!-- Navigation -->
    <section id="section-navigation">
      <div class="tabs-container">
        <div class="tab active" @click="activeTab = 'account'">
          <div v-if="activeTab === 'account'" class="tab-indicator"></div>
          <span>Account</span>
          <div v-if="activeTab === 'account'" class="tab-underline"></div>
        </div>
        <div class="tab" :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">
          <div v-if="activeTab === 'settings'" class="tab-indicator"></div>
          <span>Settings</span>
          <div v-if="activeTab === 'settings'" class="tab-underline"></div>
        </div>
        <div class="tab" :class="{ active: activeTab === 'more' }" @click="activeTab = 'more'">
          <div v-if="activeTab === 'more'" class="tab-indicator"></div>
          <span>More</span>
          <div v-if="activeTab === 'more'" class="tab-underline"></div>
        </div>
      </div>

      <ul v-if="activeTab === 'account'" class="menu-list">
        <li class="menu-item" @click="router.push('/sign')">
          <div class="menu-left">
            <img src="/assets/image/a89d4d597bbcfa2080814db6f2b22dc98cc2aa65.png" class="menu-icon" alt="Sign in">
            <span class="menu-text">Sign in</span>
          </div>
          <img src="/assets/image/4200_180.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item readonly">
          <div class="menu-left">
            <img src="/assets/image/f9741da13cb7ba61137fbfae1bfdafaa779d6375.png" class="menu-icon" alt="Identity account">
            <span class="menu-text">Email</span>
          </div>
          <span v-if="showEmailPlaceholder" class="menu-value-placeholder"></span>
          <span v-else class="menu-value">{{ displayEmail }}</span>
        </li>
        <li class="menu-item" @click="router.push('/vp')">
          <div class="menu-left">
            <img src="/assets/image/c77f7559be360dd336d02cac1b1feb037dbf2473.png" class="menu-icon" alt="My VIP">
            <span class="menu-text">My VIP</span>
          </div>
          <div class="menu-right">
            <span v-if="showVipPlaceholder" class="menu-value-placeholder"></span>
            <span v-else class="menu-value">{{ vipText }}</span>
            <img src="/assets/image/4200_191.svg" class="menu-arrow" alt="Arrow Right">
          </div>
        </li>
        <li class="menu-item" @click="router.push('/dep/history')">
          <div class="menu-left">
            <img src="/assets/image/b7f92aac3d47e07c483ba586f4ae265e804616e5.png" class="menu-icon" alt="Record Transaction">
            <span class="menu-text">Record Transaction</span>
          </div>
          <img src="/assets/image/4200_200.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="router.push('/team')">
          <div class="menu-left">
            <img src="/assets/image/9801361d06ddf02bf17ce55932f161747ec5d791.png" class="menu-icon" alt="Your Community">
            <span class="menu-text">Your Community</span>
          </div>
          <img src="/assets/image/4200_210.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="router.push('/about')">
          <div class="menu-left">
            <img src="/assets/image/95222c8971643839be1f21df87741382dab85559.png" class="menu-icon" alt="Company Community">
            <span class="menu-text">Company Community</span>
          </div>
          <img src="/assets/image/4200_216.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="handleKycClick">
          <div class="menu-left">
            <img src="/assets/image/85bcea1b2cc4669b33e6a90d1ea50f45593297fa.png" class="menu-icon" alt="Complete Verification">
            <span class="menu-text">Complete Verification</span>
          </div>
          <img src="/assets/image/4200_226.svg" class="menu-arrow" alt="Arrow Right">
        </li>
      </ul>

      <ul v-if="activeTab === 'settings'" class="menu-list">
        <li class="menu-item" @click="router.push('/connect')">
          <div class="menu-left">
            <img src="/assets/image/f9741da13cb7ba61137fbfae1bfdafaa779d6375.png" class="menu-icon" alt="My Data">
            <span class="menu-text">Bind Payout Account</span>
          </div>
          <img src="/assets/image/4200_180.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="router.push('/settings/change-password')">
          <div class="menu-left">
            <img src="/assets/image/85bcea1b2cc4669b33e6a90d1ea50f45593297fa.png" class="menu-icon" alt="Add Bank Account">
            <span class="menu-text">Change Password</span>
          </div>
          <img src="/assets/image/4200_191.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="showUsernameModal = true">
          <div class="menu-left">
            <img src="/assets/image/usr.png" class="menu-icon" alt="Account Security">
            <span class="menu-text">Username</span>
          </div>
          <img src="/assets/image/4200_200.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="router.push('/settings')">
          <div class="menu-left">
            <img src="/assets/image/cache.png" class="menu-icon" alt="Account Security">
            <span class="menu-text">Delete Cache</span>
          </div>
          <img src="/assets/image/4200_200.svg" class="menu-arrow" alt="Arrow Right">
        </li>
      </ul>

      <ul v-if="activeTab === 'more'" class="menu-list">
        <li class="menu-item" @click="router.push('/support/platform')">
          <div class="menu-left">
            <img src="/assets/image/help.png" class="menu-icon" alt="Help Center">
            <span class="menu-text">Help Center</span>
          </div>
          <img src="/assets/image/4200_210.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="router.push('/portfolio')">
          <div class="menu-left">
            <img src="/assets/image/my-mining.png" class="menu-icon" alt="Rewarded Tasks">
            <span class="menu-text">My Mining</span>
          </div>
          <img src="/assets/image/4200_216.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="router.push('/settings/device-info')">
          <div class="menu-left">
            <img src="/assets/image/detail.png" class="menu-icon" alt="My Portfolio">
            <span class="menu-text">Detail Information</span>
          </div>
          <img src="/assets/image/4200_226.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="router.push('/sign')">
          <div class="menu-left">
            <img src="/assets/image/daily.png" class="menu-icon" alt="Help Center">
            <span class="menu-text">Daily Sign In</span>
          </div>
          <img src="/assets/image/4200_210.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="router.push('/solution')">
          <div class="menu-left">
            <img src="/assets/image/customer.png" class="menu-icon" alt="Rewarded Tasks">
            <span class="menu-text">Customer Agreement</span>
          </div>
          <img src="/assets/image/4200_216.svg" class="menu-arrow" alt="Arrow Right">
        </li>
        <li class="menu-item" @click="router.push('/privacy')">
          <div class="menu-left">
            <img src="/assets/image/privacy.png" class="menu-icon" alt="My Portfolio">
            <span class="menu-text">Privacy Policy</span>
          </div>
          <img src="/assets/image/4200_226.svg" class="menu-arrow" alt="Arrow Right">
        </li>
      </ul>
    </section>
  </div>

  <FooterBar />
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
    <EditUsernameModal 
      v-model="showUsernameModal" 
      :current-username="accountInfo?.username || ''" 
      @success="handleUsernameUpdate"
    />
  </template>

<script setup>
import { computed, onActivated, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FooterBar from '../../components/partials/FooterBar.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import EditUsernameModal from '@/components/modals/EditUsernameModal.vue'
import { authAPI } from '@/services/api'

const router = useRouter()
const isBalanceVisible = ref(false)
const activeTab = ref('account')
const currency = ref('USD')
const currencyMenuOpen = ref(false)
const currencyAnchorEl = ref(null)
const usdToIdrRate = ref(17000)

const accountInfo = ref(null)
const currentRank = ref(null)
const currentTitle = ref(null)
const balanceStats = ref(null)
const todayStats = ref(null)
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)

const showErrorModal = ref(false)
const errorMessage = ref('')
const showUsernameModal = ref(false)

const handleKycClick = () => {
  errorMessage.value = 'KYC is not active'
  showErrorModal.value = true
}

const handleUsernameUpdate = (newUsername) => {
  if (accountInfo.value) {
    accountInfo.value.username = newUsername
  }
}

const rawUid = computed(() => {
  const d = accountInfo.value || {}
  const uid = d.referral_code ?? d.id ?? d.user_id ?? null
  if (uid === null || uid === undefined || uid === '') return null
  return uid
})

const showUidPlaceholder = computed(() => rawUid.value === null)

const displayUid = computed(() => {
  if (rawUid.value === null) return ''
  return String(rawUid.value)
})

const rawPhone = computed(() => {
  const d = accountInfo.value || {}
  const p = String(d.phone || d.phone_number || d.user_phone || '').trim()
  return p || null
})

const showPhonePlaceholder = computed(() => rawPhone.value === null)

const displayPhone = computed(() => {
  if (rawPhone.value === null) return ''
  return String(rawPhone.value)
})

const rawEmail = computed(() => {
  const d = accountInfo.value || {}
  const e = String(d.email || d.user_email || d.mail || '').trim()
  return e || null
})

const showEmailPlaceholder = computed(() => rawEmail.value === null)

const displayEmail = computed(() => {
  if (rawEmail.value === null) return ''
  return String(rawEmail.value)
})

const showVipPlaceholder = computed(() => {
  const title = String(currentTitle.value || '').trim()
  if (title) return false
  return currentRank.value === null || currentRank.value === undefined || currentRank.value === ''
})

const vipText = computed(() => {
  if (showVipPlaceholder.value) return ''
  const title = String(currentTitle.value || '').trim()
  if (title) return title
  const r = currentRank.value
  if (r === null || r === undefined || r === '') return '0'
  const n = Number(r)
  return Number.isFinite(n) ? String(n) : String(r)
})

const toNumber = (v) => {
  const n = Number(String(v ?? 0).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatUSD = (v) => {
  return '$' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(toNumber(v))
}

const formatIDR = (v) => {
  return 'Rp' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(toNumber(v))
}

const maskedBalanceText = computed(() => (currency.value === 'IDR' ? 'Rp********' : '$********'))

const applyCurrency = (usdValue) => {
  if (currency.value === 'IDR') return formatIDR(toNumber(usdValue) * usdToIdrRate.value)
  return formatUSD(usdValue)
}

const balanceCurrencyText = computed(() => applyCurrency(balanceStats.value?.balance))
const balanceDepositCurrencyText = computed(() => applyCurrency(balanceStats.value?.balance_deposit))
const todayIncomeCurrencyText = computed(() => applyCurrency(todayStats.value?.total_income))

const currencyOptions = computed(() => [
  { value: 'USD', label: 'USD' },
  { value: 'IDR', label: 'IDR' }
])

const toggleCurrencyMenu = () => {
  currencyMenuOpen.value = !currencyMenuOpen.value
}

const closeCurrencyMenu = () => {
  currencyMenuOpen.value = false
}

const selectCurrency = (val) => {
  currency.value = val === 'IDR' ? 'IDR' : 'USD'
  closeCurrencyMenu()
}

const onDocumentClick = (e) => {
  if (!currencyMenuOpen.value) return
  const anchor = currencyAnchorEl.value
  const target = e?.target
  if (anchor && target && anchor.contains(target)) return
  closeCurrencyMenu()
}

const copyUid = () => {
  if (showUidPlaceholder.value) return
  navigator.clipboard.writeText(displayUid.value).catch(() => {})
}

const handleLogout = () => {
  router.push('/login')
}

const fetchAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    accountInfo.value = resp?.data || null
  } catch (_) {
    accountInfo.value = null
  }
}

const fetchRankStatus = async () => {
  try {
    const resp = await authAPI.getRankStatus()
    currentRank.value = resp?.data?.current_rank ?? null
    currentTitle.value = resp?.data?.current_title ?? null
  } catch (_) {
    currentRank.value = null
    currentTitle.value = null
  }
}

const fetchBalanceStats = async () => {
  try {
    const resp = await authAPI.getBalanceStatistics('all-time')
    balanceStats.value = resp?.data || null
  } catch (_) {
    balanceStats.value = null
  }
}

const fetchTodayStats = async () => {
  try {
    const resp = await authAPI.getBalanceStatistics('today')
    todayStats.value = resp?.data || null
  } catch (_) {
    todayStats.value = null
  }
}

const refreshProfileData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    await Promise.all([
      fetchAccountInfo(),
      fetchRankStatus(),
      fetchBalanceStats(),
      fetchTodayStats()
    ])
  } finally {
    lastRefreshedAt.value = Date.now()
    isRefreshing.value = false
  }
}

onMounted(() => {
  refreshProfileData()
  document.addEventListener('click', onDocumentClick)
})

onActivated(() => {
  const now = Date.now()
  if (now - lastRefreshedAt.value < 300) return
  refreshProfileData()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f8f8f8;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  padding-bottom: 68px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  overflow-x: hidden;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

h1, h2, h3, p {
  margin: 0;
}

/* Header */
#section-header {
  padding: 25px 20px 15px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-wrapper {
  position: relative;
  width: 31px;
  height: 29px;
}

.avatar-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.avatar-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95px;
  height: 47px;
  object-fit: contain;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.uid-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.uid-text {
  font-size: 16px;
  color: #000;
  font-weight: 500;
}

.uid-placeholder {
  display: inline-block;
  width: 92px;
  height: 18px;
  background: #f6f0dd;
  border-radius: 8px;
  margin-left: 0px;
  vertical-align: middle;
}

.uid-value {
  margin-left: 6px;
}

.copy-icon {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.copy-icon.disabled {
  opacity: 0.35;
  pointer-events: none;
}

.site-text {
  font-size: 12px;
  color: #737373;
}

.logout-icon {
  width: 26px;
  height: 31px;
  cursor: pointer;
}

/* Wallet */
#section-wallet {
  padding: 0 20px;
}

.balance-card {
  background: linear-gradient(90deg, #f1faf9 0%, #f8fbfb 50%, #f1fbf9 100%);
  border: 1px solid #ededed;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: visible;
}

.balance-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
}

.balance-label-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.label-text {
  font-size: 14px;
  color: #000;
}

.currency-selector {
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  position: relative;
  z-index: 3;
  -webkit-tap-highlight-color: transparent;
}

.currency-text {
  font-size: 12px;
  color: #767676;
}

.arrow-down {
  width: 14px;
  height: 14px;
  transform: rotate(270deg);
}

.currency-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 140px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  z-index: 9999;
}

.currency-menu-item {
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  font-family: inherit;
}

.currency-menu-item + .currency-menu-item {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.currency-menu-item.active {
  font-weight: 700;
}

.balance-amount {
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin-top: 4px;
}

.wallet-img {
  width: 296px;
  height: 66px;
  object-fit: contain;
  z-index: 1;
}

.stats-container {
  display: grid;
  grid-template-columns: 240px 1fr;
  padding: 20px 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 14px;
  color: #000;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #000;
}

/* Navigation */
#section-navigation {
  padding: 10px 0;
}

.tabs-container {
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 35px;
  margin-bottom: 15px;
}

.tab {
  font-size: 14px;
  color: #686868;
  cursor: pointer;
  position: relative;
  padding: 5px 0;
}

.tab.active {
  color: #000;
  font-weight: 500;
}

.tab-indicator {
  position: absolute;
  left: -11px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #1b46f5;
}

.tab-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 28px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-item.readonly {
  cursor: default;
}

.menu-item.readonly:active {
  background-color: transparent;
}

.menu-item:active {
  background-color: rgba(0, 0, 0, 0.05);
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.menu-text {
  font-size: 14px;
  color: #000;
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-value {
  font-size: 14px;
  color: #686868;
}

.menu-value-placeholder {
  display: inline-block;
  width: 96px;
  height: 16px;
  background: #f6f0dd;
  border-radius: 8px;
}

.menu-arrow {
  width: 18px;
  height: 18px;
  transform: rotate(0deg);
}
</style>
