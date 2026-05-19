<template>
  <div class="app-container" translate="no" data-no-translate="true">
    <!-- Header -->
    <header class="top-header">
      <div class="header-left">
        <img src="/assets/image/Logo01.png" alt="Logo" class="logo">
        <span class="hidden-text" translate="no" data-no-translate="true">{{ isBalanceVisible ? phone : maskedPhone }}</span>
        <img
          :src="isBalanceVisible ? 'https://api.iconify.design/mdi/eye.svg?color=%230073FF' : 'https://api.iconify.design/mdi/eye-off.svg?color=%230073FF'"
          alt="Eye"
          class="icon-eye"
          @click="toggleBalanceVisibility"
        >
      </div>
      <div class="header-right">
         <a href="/assets/android/hue.apk" download>
          <img src="/assets/image/16636ddcfe5bc7cbc19b06c1725abcf55b1768ac.png" alt="Download" class="icon-download">
        </a>
        <div ref="langWrapEl" class="lang-wrap" translate="no" data-no-translate="true">
          <button
            ref="langBtnEl"
            type="button"
            class="lang-btn"
            aria-label="Language"
            :aria-expanded="langMenuOpen ? 'true' : 'false'"
            @click.stop="toggleLangMenu"
          >
            <img src="/assets/image/4028_592.svg" alt="Globe" class="icon-globe">
          </button>
          <div v-if="langMenuOpen" class="lang-menu" @click.stop>
            <button type="button" class="lang-item" style="border-top: none;" @click="changeLanguage('en')">English</button>
            <button type="button" class="lang-item" @click="changeLanguage('id')">Indonesia</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Banner -->
    <section class="hero-banner">
      <img src="/assets/image/52aad9cf689ec4ad84ac7de1bc77dda058088e02.png" alt="Hero Banner">
    </section>

    <!-- Notice -->
    <section class="notice-bar">
      <img src="/assets/image/4089_249.svg" alt="Volume Icon">
      <div class="notice-marquee">
        <div class="notice-marquee-track">
          <span class="notice-text">Urgent notice about HUE account</span>
        </div>
      </div>
    </section>

    <!-- Active Assets -->
    <section class="active-assets">
      <div class="assets-card">
        <div class="card-header">
          <h2>Currently Active</h2>
          <img
            :src="isActiveAssetsVisible ? 'https://api.iconify.design/mdi/eye.svg?color=%230073FF' : 'https://api.iconify.design/mdi/eye-off.svg?color=%230073FF'"
            alt="Eye Icon"
            class="card-eye"
            @click="toggleActiveAssetsVisibility"
          >
        </div>
        <p class="subtitle">Monitor and manage your active assets</p>

        <div class="assets-list">
          <div class="asset-item">
            <img src="/assets/image/aa28bcde8ac527e890849db55646811a1317c33b.png" alt="Coin Icon">
            <span class="amount">{{ activeBalanceText }}</span>
          </div>
          <div class="asset-item">
            <img src="/assets/image/fee3f6a5edc515a6b9f31e5028f69dd361e33f15.png" alt="Robot Icon">
            <div class="asset-text">
              <span class="count">{{ activeCountText }}</span>
              
            </div>
          </div>
          <span class="label" style="font-size: 16px;">Assets</span>
        </div>

        <button class="btn-start" @click="goToMining">Start</button>

        <img src="/assets/image/42bef0878ebebe8f0f21dd07dc75448235b97fad.png" alt="3D Vault" class="vault-image">
      </div>
    </section>

    <!-- Track Funds -->
    <section class="track-funds">
      <div class="track-card" @click="goToPortfolio">
        <div class="track-text">
          <h3>Stay on Track</h3>
          <p>Keep your progress moving forward</p>
        </div>
        <img src="/assets/image/bdf7586ea609229c9a92b2fa57542fdec9653c52.png" alt="Clipboard" class="clipboard-img">
        <img src="/assets/image/4044_150.svg" alt="Arrow" class="icon-arrow-right arrow-bottom-right">
      </div>

      <div class="funds-card">
        <div class="fund-row" @click="goToWithdraw">
          <div class="fund-info">
            <div class="fund-label">
              <span>Available funds</span>
              <img
                :src="isFundsVisible ? 'https://api.iconify.design/mdi/eye.svg?color=%230073FF' : 'https://api.iconify.design/mdi/eye-off.svg?color=%230073FF'"
                alt="Eye"
                class="fund-eye"
                @click.stop="toggleFundsVisibility"
              >
            </div>
            <span class="fund-amount">{{ availableFundsText }}</span>
          </div>
          <img src="/assets/image/4044_150.svg" alt="Arrow" class="icon-arrow-right arrow-large">
        </div>

        <div class="fund-divider"></div>

        <div class="fund-row" @click="goToDeposit">
          <div class="fund-info">
            <div class="fund-label">
              <span>Recharge funds</span>
              <img
                :src="isFundsVisible ? 'https://api.iconify.design/mdi/eye.svg?color=%230073FF' : 'https://api.iconify.design/mdi/eye-off.svg?color=%230073FF'"
                alt="Eye"
                class="fund-eye"
                @click.stop="toggleFundsVisibility"
              >
            </div>
            <span class="fund-amount">{{ rechargeFundsText }}</span>
          </div>
          <img src="/assets/image/4044_141.svg" alt="Arrow" class="icon-arrow-right arrow-large">
        </div>
      </div>
    </section>

    <!-- Action Grid -->
    <section class="action-grid">
      <router-link to="/hn/user/help" class="action-item">
        <div class="icon-box">
          <img src="/assets/image/guide.png" alt="Recharge">
        </div>
        <span class="action-label">Guide</span>
      </router-link>
      <router-link to="/hn/app/charge" class="action-item">
        <div class="icon-box">
          <img src="/assets/image/recharge.png" alt="Payout">
        </div>
        <span class="action-label">Recharge</span>
      </router-link>
      <router-link to="/hn/app/settlement" class="action-item">
        <div class="icon-box">
          <img src="/assets/image/payout.png" alt="Mining">
        </div>
        <span class="action-label">Payout</span>
      </router-link>
      <router-link to="/hn/network/invite" class="action-item">
        <div class="icon-box">
          <img src="/assets/image/invite.png" alt="Missions">
        </div>
        <span class="action-label">Invite friends</span>
      </router-link>
   
    </section>

    <!-- Daily Sign In -->
    <section class="daily-signin" @click="goToSignIn">
      <img src="/assets/image/daily1.png" alt="Daily Sign" class="signin-icon">
      <div class="signin-content">
        <h3>Daily Sign-in</h3>
        <p>Sign in daily to earn rewards and bonuses</p>
      </div>
      <button class="btn-sign">
        <img src="/assets/image/btn.png" alt="Sign" class="btn-bg">
        <span class="btn-text">Sign</span>
      </button>
    </section>

  

    <!-- News Section -->
    <section class="news-section">
      <div class="news-header">
        <h3>See updated now</h3>
        <router-link to="/hn/home/news" class="more-link">
          more details here
          <img src="/assets/image/4044_138.svg" alt="Arrow">
        </router-link>
      </div>
      <div class="news-card">
        <div class="accent-line"></div>
        <div class="news-text">
          <h4>{{ newsTitle }}</h4>
          <p>{{ newsBodyShort }}</p>
        </div>
        <div class="news-image-box">
          <img
            v-if="newsImageUrl"
            :src="newsImageUrl"
            alt=""
            class="news-thumb-img"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
            @error="handleNewsThumbError"
          >
        </div>
      </div>
    </section>
    <section class="market-section">
      <div class="market-header">
        <h3>Market</h3>
       
      </div>

      <div v-if="marketError" class="market-state market-error">{{ marketError }}</div>
      <div v-else-if="marketLoading && marketItems.length === 0" class="market-state">Loading market...</div>

      <div v-else class="market-grid">
        <div v-for="item in marketItems" :key="item.id" class="market-card">
          <div class="market-row">
            <div class="market-left">
              <div class="market-symbol">{{ item.symbol }}</div>
              <div class="market-name">{{ item.name }}</div>
            </div>
            <div class="market-right">
              <div class="market-price">{{ formatMarketPrice(item.priceUsd) }}</div>
              <div class="market-change" :class="item.change24h >= 0 ? 'pos' : 'neg'">
                {{ formatChange(item.change24h) }}
              </div>
              <svg
                v-if="item.sparkline && item.sparkline.length > 1"
                class="market-sparkline"
                viewBox="0 0 100 30"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polyline
                  :points="sparklinePoints(item.sparkline)"
                  fill="none"
                  :class="item.change24h >= 0 ? 'pos' : 'neg'"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  

  <button type="button" class="voucher-fab" aria-label="Open voucher" @click="openVoucherModal">
    <img src="/assets/image/gift.png" alt="Voucher" class="voucher-fab-img">
  </button>

 

  <VoucherModal v-model="isVoucherModalOpen" @submit="handleVoucherSubmit" />

  <FooterBar />
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import FooterBar from '@/components/partials/AppFooter.vue'
import VoucherModal from '@/components/modals/VoucherModal.vue'
import AnnouncementModal from '@/components/modals/AnnouncementModal.vue'
import { authAPI, newsAPI } from '@/services/api'
import { setLanguage } from '@/i18n'
import { appSettings, formatAppCurrency } from '@/utils/settings'
import { resolveImageUrl } from '@/utils/imageCache'

const router = useRouter()
const { locale } = useI18n()

const username = ref('Username')
const phone = ref('•••••••')
const mainBalance = ref(0)
const depositBalance = ref(0)
const interestTotal = ref(0)
const activeAssetCount = ref(0)
const isBalanceVisible = ref(false)
const isActiveAssetsVisible = ref(true)
const isFundsVisible = ref(true)
const isVoucherModalOpen = ref(false)
const isAnnouncementOpen = ref(false)

const newsTitle = ref('')
const newsBody = ref('')
const newsImage = ref('')

const newsImageUrl = computed(() => {
  const raw = String(newsImage.value || '').trim()
  if (!raw) return ''
  return resolveImageUrl(raw)
})

const marketLoading = ref(false)
const marketError = ref('')
const marketItems = ref([])

const newsBodyShort = computed(() => {
  const text = String(newsBody.value || '').replace(/\s+/g, ' ').trim()
  if (!text) return ''
  const MAX_LEN = 90
  if (text.length <= MAX_LEN) return text
  return `${text.slice(0, MAX_LEN).trimEnd()}...`
})

const maskPhoneAll = (raw) => {
  const p = String(raw || '').trim()
  if (!p) return '**********'
  const digits = p.replace(/\D/g, '')
  if (!digits) return '**********'
  const masked = '*'.repeat(digits.length)
  return p.startsWith('+') ? `${masked}` : masked
}

const maskedPhone = computed(() => maskPhoneAll(phone.value))

const langMenuOpen = ref(false)
const langWrapEl = ref(null)
const langBtnEl = ref(null)

const toggleLangMenu = () => {
  langMenuOpen.value = !langMenuOpen.value
}

const changeLanguage = (lang) => {
  setLanguage(lang)
  locale.value = lang
  langMenuOpen.value = false
}

const onDocumentClick = (event) => {
  if (!langMenuOpen.value) return
  const target = event.target
  if (langWrapEl.value?.contains(target) || langBtnEl.value?.contains(target)) return
  langMenuOpen.value = false
}

const pickFirstText = (obj, keys) => {
  for (const key of keys) {
    const v = obj?.[key]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}

const fetchNews = async () => {
  try {
    const res = await newsAPI.getNews({ page: 1, page_size: 1 })
    const data = res?.data
    const list = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : [])
    const first = list[0]
    if (!first) return

    const title = pickFirstText(first, ['title', 'name', 'headline'])
    const body = pickFirstText(first, ['summary', 'excerpt', 'description', 'content', 'body', 'text'])
    const image = pickFirstText(first, ['image', 'thumbnail', 'thumb', 'cover', 'banner'])

    if (title) newsTitle.value = title
    if (body) newsBody.value = body
    if (image) newsImage.value = image
  } catch (_) {}
}

const handleNewsThumbError = (e) => {
  const el = e?.target
  if (!el) return
  el.src = '/assets/image/Logo01.svg'
}

const MARKET_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' }
]

const formatMarketPrice = (value) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return formatAppCurrency(0)
  const decimals = n >= 1 ? 2 : 6
  return formatAppCurrency(n, { decimals })
}

const formatChange = (value) => {
  const n = Number(value)
  if (!Number.isFinite(n)) return '0%'
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

const sparklinePoints = (values) => {
  const arr = Array.isArray(values) ? values.map(Number).filter(Number.isFinite) : []
  if (arr.length <= 1) return ''
  const width = 100
  const height = 30
  const pad = 1
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const v of arr) {
    if (v < min) min = v
    if (v > max) max = v
  }
  const range = max - min || 1
  const stepX = width / (arr.length - 1)
  const usableH = height - pad * 2
  return arr.map((v, i) => {
    const x = i * stepX
    const y = height - pad - ((v - min) / range) * usableH
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}

const fetchMarket = async () => {
  marketLoading.value = true
  marketError.value = ''
  try {
    const ids = MARKET_COINS.map(c => c.id).join(',')
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(ids)}&order=market_cap_desc&per_page=${MARKET_COINS.length}&page=1&sparkline=true&price_change_percentage=24h`
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) {
      if (res.status === 429) throw new Error('Terlalu banyak request, coba lagi sebentar')
      throw new Error('Gagal ambil data market')
    }
    const data = await res.json()
    const list = Array.isArray(data) ? data : []
    const byId = {}
    for (const row of list) {
      const id = String(row?.id || '')
      if (id) byId[id] = row
    }
    const next = MARKET_COINS.map((coin) => {
      const row = byId[coin.id] || {}
      const spark = row?.sparkline_in_7d?.price
      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        priceUsd: Number(row?.current_price ?? NaN),
        change24h: Number(row?.price_change_percentage_24h ?? NaN),
        sparkline: Array.isArray(spark) ? spark : []
      }
    }).filter((x) => Number.isFinite(x.priceUsd))
    marketItems.value = next
    if (next.length === 0) marketError.value = 'Data market kosong'
  } catch (err) {
    marketError.value = String(err?.message || 'Gagal ambil data market')
  } finally {
    marketLoading.value = false
  }
}

const balanceDisplay = computed(() => {
  return formatAppCurrency(mainBalance.value)
})

const toggleBalanceVisibility = () => {
  isBalanceVisible.value = !isBalanceVisible.value
}

const maskAppCurrency = (mask = '********') => {
  const cfg = appSettings.currency || {}
  const symbol = String(cfg.symbol || '')
  const symbolPosition = String(cfg.symbol_position || 'prefix')
  const symbolSpace = Boolean(cfg.symbol_space ?? false)
  const space = symbolSpace ? ' ' : ''
  if (!symbol) return mask
  if (symbolPosition === 'suffix') return `${mask}${space}${symbol}`
  return `${symbol}${space}${mask}`
}

const activeBalanceText = computed(() => {
  if (!isActiveAssetsVisible.value) return maskAppCurrency()
  return formatAppCurrency(interestTotal.value)
})

const activeCountText = computed(() => {
  if (!isActiveAssetsVisible.value) return '***'
  return String(activeAssetCount.value ?? 0)
})

const toggleActiveAssetsVisibility = () => {
  isActiveAssetsVisible.value = !isActiveAssetsVisible.value
}

const availableFundsText = computed(() => {
  if (!isFundsVisible.value) return maskAppCurrency()
  return formatAppCurrency(mainBalance.value)
})

const rechargeFundsText = computed(() => {
  if (!isFundsVisible.value) return maskAppCurrency()
  return formatAppCurrency(depositBalance.value)
})

const toggleFundsVisibility = () => {
  isFundsVisible.value = !isFundsVisible.value
}

const toAmount = (value) => {
  const n = Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const fetchAccountInfo = async () => {
  try {
    const [accountRes, statsAllTimeRes] = await Promise.allSettled([
      authAPI.getAccountInfo(),
      authAPI.getBalanceStatistics('all-time')
    ])

    if (accountRes.status === 'fulfilled') {
      const data = accountRes.value?.data || {}
      username.value = data?.username || 'Username'
      phone.value = data?.phone || '+62 81239402453'
      mainBalance.value = toAmount(data?.balance ?? 0)
      depositBalance.value = toAmount(data?.balance_deposit ?? data?.deposit_balance ?? 0)
      activeAssetCount.value = Number.isFinite(Number(data?.active_investments_count))
        ? Number(data.active_investments_count)
        : 0
    }

    if (statsAllTimeRes.status === 'fulfilled') {
      const stats = statsAllTimeRes.value?.data || {}
      interestTotal.value = toAmount(stats?.interest_total ?? 0)
    }
  } catch (_) {
    // Use defaults
  }
}

const goToDeposit = () => {
  router.push('/hn/app/charge')
}

const goToWithdraw = () => {
  router.push('/hn/app/settlement')
}

const goToPortfolio = () => {
  router.push('/hn/hall/taskhall')
}

const goToMining = () => {
  router.push('/hn/hall/outputhall')
}

const goToSignIn = () => {
  router.push('/hn/hall/sign')
}

const openVoucherModal = () => {
  isVoucherModalOpen.value = true
}

const handleVoucherSubmit = () => {
  isVoucherModalOpen.value = false
}

onMounted(() => {
  isAnnouncementOpen.value = true
  fetchAccountInfo()
  fetchNews()
  fetchMarket()
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

a {
  text-decoration: none;
}

.icon-arrow-right {
  transform: rotate(90deg);
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f8f8;
  max-width: 100%;
  position: relative;
  min-height: 100vh;
  padding-bottom: 68px;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
}

.voucher-fab {
  position: fixed;
  right: 16px;
  bottom: 88px;
  width: 56px;
  height: 56px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  z-index: 1200;
}

.voucher-fab-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
  display: block;
}

/* Header */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f8f8;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 34px;
  height: 36px;
  object-fit: cover;
}

.hidden-text {
  
  font-size: 16px;
  color: #000;
  letter-spacing: 1px;
  
}

.icon-eye {
  width: 16px;
  height: 15px;
  cursor: pointer;
}

.icon-download {
  width: 23px;
  height: 23px;
  cursor: pointer;
}

.icon-globe {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.lang-wrap {
  position: relative;
}

.lang-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.lang-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border: 2px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
  padding: 6px;
  min-width: 140px;
  z-index: 2000;
}

.lang-item {
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  padding: 10px 12px;
  border-top: 1px solid #000;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  cursor: pointer;

  font-family: inherit;
}

.lang-item:hover {
  background: rgba(33, 77, 243, 0.08);
}

/* Hero Banner */
.hero-banner {
  width: 100%;
}

.hero-banner img {
  width: 100%;
  height: auto;
  display: block;
}

/* Notice */
.notice-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px;
  background: #f8f8f8;
}

.notice-bar img {
  width: 20px;
  height: 20px;
}

.notice-marquee {
  flex: 1;
  overflow: hidden;
}

.notice-marquee-track {
  display: inline-block;
  white-space: nowrap;
  padding-left: 100%;
  animation: notice-scroll 12s linear infinite;
}

.notice-text {
  color: #0073ff;
  margin-bottom: 3px;
  font-size: 14px;
  font-weight: 500;
}

@keyframes notice-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .notice-marquee-track {
    padding-left: 0;
    animation: none;
  }
}

/* Active Assets */
.active-assets {
  padding: 0 12px 1px;
}

.assets-card {
  background: #ffffff;
  border-radius: 5px;
  padding: 20px;
  position: relative;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.02);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header h2 {
  font-size: 17px;
  font-weight: 600;
  color: #000;
}

.card-header img {
  width: 16px;
  height: 16px;
}

.card-eye {
  cursor: pointer;
}

.subtitle {
  font-size: 14px;
  color: #000;
  margin-top: 4px;
  margin-bottom: 20px;
}

.assets-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.asset-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.asset-item img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.asset-item .amount {
  font-size: 25px;
  font-weight: 700;
  color: #000;
}

.asset-text {
  display: flex;
  flex-direction: column;
}

.asset-text .count {
  font-size: 25px;
  margin-top: 5px;
  font-weight: 700;
  color: #000;
  line-height: 1;
}

.asset-text .label {
  font-size: 8px;
  color: #666;
  margin-top: 2px;
}

.btn-start {
  background-color: #1b46f5;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px 0;
  width: 140px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  display: block;
}

.vault-image {
  position: absolute;
  right: -10px;
  bottom: 1px;
  width: 205px;
  margin-bottom: -30px;
  height: auto;
  z-index: 1;
}

/* Track Funds */
.track-funds {
  display: flex;
  gap: 10px;
   margin-top: 10px;
  padding: 0 12px 12px;
}

.track-card {
  flex: 1;
  background: linear-gradient(180deg, rgba(125, 198, 183, 0.47) 0%, rgba(168, 228, 219, 0.47) 100%);
  border-radius: 12px;
  padding: 18px 14px;
  position: relative;
  overflow: hidden;
  min-height: 150px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.track-text {
  position: relative;
  z-index: 2;
  top: -40px;
  text-align: right;
  width: 100%;
}

.track-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 0px;
  color: #000000;
  line-height: 1.1;
}

.track-card p {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.25;
  max-width: 170px;
  margin: 0 auto;
}

.clipboard-img {
  position: absolute;
  bottom: -18px;
  left: -30px;
  width: 155px;
  height: auto;
  z-index: 1;
}

.arrow-bottom-right {
  position: absolute;
  right: 14px;
  top: 70%;
  transform: translateY(-50%);
  width: 35px;
  height: 35px;
}

.funds-card {
 
  flex: 1.2;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.fund-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 14px 14px;
}

.fund-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fund-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #000;
}

.fund-label img {
  width: 16px;
  height: 15px;
}

.fund-eye {
  cursor: pointer;
}

.fund-amount {
  font-size: 16px;
  font-weight: 500;
  color: #000;
}

.arrow-large {
  width: 35px;
  height: 35px;
  rotate: 270deg;
}

.fund-divider {
  height: 1px;
  background-color: #000000;
  opacity: 0.2;
  margin: 0 14px;
  width: 100%;
}

/* Action Grid */
.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 12px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.icon-box {
  width: 74px;
  height: 71px;
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-box img {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.action-label {
  font-size: 12px;
  color: #000;
  text-align: center;
}

/* Daily Sign In */
.daily-signin {
  display: flex;
  align-items: center;
  padding: 16px;
  margin: 0 12px 12px;
  background-color: transparent;
  cursor: pointer;
}

.signin-icon {
  width: 64px;
  height: 74px;
  margin-right: 12px;
}

.signin-content {
  flex: 1;
}

.signin-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
}

.signin-content p {
  font-size: 14px;
  color: #333;
  line-height: 1.3;
}

.btn-sign {
  position: relative;
  width: 113px;
  height: 35px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: inherit;
}

.btn-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 18px;
}

.btn-text {
  position: relative;
  z-index: 1;
  color: #000;
  font-size: 14px;
  font-weight: 500;
}

/* Voucher Banner */
.voucher-banner-section {
  padding: 0 12px 12px;
}

.voucher-banner {
  background: linear-gradient(90deg, #1b46f5 0%, #2757b7 100%);
  border-radius: 5px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.voucher-content h3 {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.voucher-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
}

.voucher-arrow {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

/* News Section */
.news-section {
  padding: 0 12px 20px;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.news-header h3 {
  font-size: 15px;
  font-weight: 500;
  color: #000;
}

.more-link {
  font-size: 14px;
  color: #747474;
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}

.more-link img {
  width: 12px;
  height: 12px;
}

.news-card {
  background-color: #ffffff;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  position: relative;
  min-height: 92px;
}

.accent-line {
  width: 6px;
  background-color: #1b46f5;
  border-radius: 2px;
  margin-right: 25px;
  margin-left: -15px;
  margin-top: -10px;
  height: 40px;
  margin-top: 0px;
}

.news-text {
  flex: 1;
  padding-right: 120px;
}

.news-text h4 {
  font-size: 14px;
  font-weight: 600;
  color: #000;
  margin-bottom: 6px;
}

.news-text p {
  font-size: 11px;
  color: #000;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-image-box {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 110px;
  height: 64px;
  background-color: #d9d9d9;
  border-radius: 2px;
  overflow: hidden;
}

.news-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Market */
.market-section {
  padding: 0 12px 20px;
}

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.market-header h3 {
  font-size: 15px;
  font-weight: 500;
  color: #000;
}

.market-refresh {
  border: none;
  background: rgba(27, 70, 245, 0.1);
  color: #1b46f5;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
}

.market-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.market-state {
  background: #ffffff;
  border-radius: 5px;
  padding: 14px 16px;
  font-size: 12px;
  color: #747474;
}

.market-error {
  color: #c91d1d;
}

.market-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.market-card {
  background: #ffffff;
  border-radius: 5px;
  padding: 14px 14px;
}

.market-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.market-left {
  min-width: 0;
}

.market-symbol {
  font-size: 15px;
  font-weight: 800;
  color: #000000;
}

.market-name {
  font-size: 15px;
  color: #747474;
  margin-top: 3px;
}

.market-right {
  text-align: right;
}

.market-price {
  font-size: 15px;
  font-weight: 700;
  color: #000000;
}

.market-change {
  font-size: 15px;
  margin-top: 3px;
  font-weight: 700;
}

.market-change.pos {
  color: #0f9d58;
}

.market-change.neg {
  color: #c91d1d;
}

.market-sparkline {
  width: 86px;
  height: 22px;
  margin-top: 6px;
}

.market-sparkline polyline {
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.market-sparkline polyline.pos {
  stroke: #0f9d58;
}

.market-sparkline polyline.neg {
  stroke: #c91d1d;
}
</style>
