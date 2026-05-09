<template>
  <div class="app-container">
    <LoadingSpinner :visible="isLoading" :overlay="true" />

    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button type="button" class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/4244_332.svg" alt="">
        </button>
        <h1 class="page-title">Mining Hall</h1>
        <div class="header-spacer"></div>
      </header>
    </section>

    <!-- Hero Section -->
    <section id="section-hero">
      <div class="timer-section">
        <p class="timer-label">Reset hall in</p>
        <div class="timer-box">
          <div class="time-display" translate="no" data-no-translate="true">{{ timerDisplay }}</div>
          <div class="time-units">
            <span>Hours</span>
            <span>Minutes</span>
            <span>Seconds</span>
          </div>
        </div>
      </div>

      <div class="main-image-container">
        <img src="/assets/image/b806113c7073eba602582af3f484970faaea4125.png" alt="Mining Machine" class="main-image">
      </div>

      <div class="action-section">
        <button class="claim-btn" :disabled="isLoading || isClaiming" @click="openClaimConfirm">Claim hall</button>
       
      </div>
    </section>

    <!-- Active Mining Section -->
    <section id="section-active-mining">
      <div class="banner-container">
        <div class="banner-content">
          <div class="banner-text">
            <h2>My Active Mining</h2>
            <p>View and manage your active mining hall</p>
          </div>
          <img
            src="/assets/image/4244_348.svg"
            alt="Toggle"
            class="toggle-icon"
            :class="{ rotated: !showActiveMining }"
            @click="showActiveMining = !showActiveMining"
          >
        </div>
      </div>

      <div v-if="showActiveMining" class="products-list">
        <div v-if="filteredInvestments.length === 0" class="empty-state">
          <p class="empty-text">No active mining</p>
        </div>

        <div v-for="inv in filteredInvestments" :key="inv.id" class="product-card">
          <h3 class="product-title">{{ inv.product_name || 'Product' }}</h3>
          <div class="product-info-top">
            <img :src="getProductImage(inv)" alt="Product" class="product-img" @error="onImageError">
            <div class="stats-columns">
              <div class="stats-col-left">
                {{ inv.product_golongan || inv.product_category || 'Category' }}<br>
                Already running<br>
                Daily hall<br>
                Amount total
              </div>
              <div class="stats-col-right">
                {{ inv.product_specification || inv.specifications || inv.product_spec || '-' }}<br>
                {{ getDaysActive(inv) }}<br>
                {{ formatCurrency(inv.daily_profit) }}<br>
                {{ formatCurrency(inv.total_amount || inv.product_price) }}
              </div>
            </div>
          </div>
          <hr class="card-divider">
          <div class="status-columns">
            <div class="status-col-left">
              Time start<br>
              Time end<br>
              Status
            </div>
            <div class="status-col-right">
              {{ formatDate(inv.created_at || inv.start_date) }}<br>
              {{ formatDate(inv.expires_at) }}<br>
              {{ inv.status || 'Active' }}
            </div>
          </div>
          <button class="action-btn" @click="openInvestmentDetails(inv)">Check Transaction History</button>
        </div>
      </div>
    </section>
  </div>
  <FooterBar />

  <Teleport to="body">
    <div v-if="claimConfirmOpen" class="claim-confirm-overlay" @click.self="closeClaimConfirm">
      <div class="claim-confirm-card" role="dialog" aria-modal="true" @click.stop>
        <div class="claim-confirm-top">
          <img
            src="/assets/image/b806113c7073eba602582af3f484970faaea4125.png"
            alt=""
            class="claim-confirm-image"
          >
          <p class="claim-confirm-text">
            You are about to claim your output. Next claim will be available after reset.
          </p>
        </div>
        <div class="claim-confirm-amount">{{ claimAmountDisplay }}</div>
        <div class="claim-confirm-actions">
          <button type="button" class="claim-confirm-btn claim-confirm-btn--primary" :disabled="isClaiming" @click="confirmClaim">
            {{ isClaiming ? 'Processing...' : 'Claim' }}
          </button>
          <button type="button" class="claim-confirm-btn claim-confirm-btn--secondary" :disabled="isClaiming" @click="goHomeFromClaim">Back home</button>
        </div>
      </div>
    </div>
  </Teleport>

  <SuccessModal v-model="claimSuccessOpen" message="Claim complete" />
  <ErrorModal v-model="claimErrorOpen" :message="claimErrorMessage" />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { resolveImageUrl } from '@/utils/imageCache'
import FooterBar from '@/components/partials/FooterBar.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import { investmentAPI } from '@/services/api'

const router = useRouter()

const isLoading = ref(false)
const isClaiming = ref(false)
const investments = ref([])
const showActiveMining = ref(true)
const claimConfirmOpen = ref(false)
const claimSuccessOpen = ref(false)
const claimErrorOpen = ref(false)
const claimErrorMessage = ref('')

// Timer logic
const now = ref(Date.now())
let timerInterval = null

const timerDisplay = computed(() => {
  const nowMs = now.value
  const endOfDay = new Date(nowMs)
  endOfDay.setHours(23, 59, 59, 999)
  const diff = Math.max(0, endOfDay.getTime() - nowMs)
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`
})

const goBack = () => {
  try {
    if (window?.history?.length > 1) {
      router.go(-1)
      return
    }
  } catch (_) {}
  router.push('/dashboard')
}

const normalizeInvestmentsResponse = (data) => {
  if (!data) return { results: [], next: null }
  if (Array.isArray(data)) return { results: data, next: null }
  if (Array.isArray(data.results)) return { results: data.results, next: data.next || null }
  return { results: [], next: null }
}

const fetchInvestments = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    let page = 1
    const all = []
    let hasNext = true

    while (hasNext && page <= 50) {
      const resp = await investmentAPI.getInvestments({
        status: 'ACTIVE',
        page
      })
      const parsed = normalizeInvestmentsResponse(resp?.data)
      all.push(...parsed.results)
      hasNext = Boolean(parsed.next) && parsed.results.length > 0
      page += 1
    }

    investments.value = all
  } catch (_) {
    investments.value = []
  } finally {
    isLoading.value = false
  }
}

const filteredInvestments = computed(() => {
  return investments.value.filter((inv) => {
    const status = String(inv?.status || '').toUpperCase()
    return status === 'ACTIVE'
  })
})

const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const num = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(num)) return 0
  return num
}

const claimAmount = computed(() => {
  return filteredInvestments.value.reduce((sum, inv) => sum + toNumber(inv?.daily_profit), 0)
})

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '$0'
  const num = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(num)) return '$0'
  return '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

const claimAmountDisplay = computed(() => formatCurrency(claimAmount.value))

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}, ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

const fallbackImage = '/assets/image/ec8f4f750f7870953cc451116089e362db722833.png'

const getProductImage = (inv) => {
  let raw = String(inv?.product_image || '').trim()
  if (raw.length >= 2) {
    const first = raw[0]
    const last = raw[raw.length - 1]
    if ((first === '`' && last === '`') || (first === '"' && last === '"') || (first === "'" && last === "'")) {
      raw = raw.slice(1, -1).trim()
    }
  }
  raw = raw.replace(/^http:\/\/backend\.scagerwebsite\.uk/i, 'https://backend.scagerwebsite.uk')
  if (!raw) return fallbackImage
  return String(resolveImageUrl(raw) || '').trim() || fallbackImage
}

const onImageError = (e) => {
  const el = e?.target
  if (el && el.src && !String(el.src).includes('ec8f4f750f7870953cc451116089e362db722833')) {
    el.src = fallbackImage
  }
}

const openInvestmentDetails = (inv) => {
  if (!inv) return
  router.push('/portfolio/history')
}

const getDaysActive = (inv) => {
  const remaining = Number(inv?.remaining_days ?? 0)
  const duration = Number(inv?.duration_days ?? 0)
  if (Number.isFinite(duration) && Number.isFinite(remaining) && duration >= remaining) {
    return duration - remaining
  }
  return 0
}

const openClaimConfirm = () => {
  if (isClaiming.value) return
  claimConfirmOpen.value = true
}

const closeClaimConfirm = () => {
  if (isClaiming.value) return
  claimConfirmOpen.value = false
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return String(err?.message || '').trim() || 'Claim failed'
  if (typeof data === 'string') return data
  if (data?.detail) return String(data.detail)
  if (data?.message) return String(data.message)
  if (data?.error) return String(data.error)
  const firstKey = Object.keys(data || {})[0]
  const firstVal = firstKey ? data[firstKey] : null
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal !== null && firstVal !== undefined) return String(firstVal)
  return 'Claim failed'
}

const toNumberLoose = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const confirmClaim = async () => {
  if (isClaiming.value) return
  claimErrorOpen.value = false
  claimErrorMessage.value = ''

  isClaiming.value = true
  try {
    const resp = await investmentAPI.claimProfitAll()
    const data = resp?.data || {}
    const claimedCount = toNumberLoose(data?.claimed_count)
    const totalClaimedAmount = toNumberLoose(data?.total_claimed_amount)
    const nothingClaimed = claimedCount <= 0 || totalClaimedAmount <= 0

    try {
      await fetchInvestments()
    } catch (_) {}
    claimConfirmOpen.value = false

    if (nothingClaimed) {
      claimErrorMessage.value = 'Gagal'
      claimErrorOpen.value = true
      return
    }

    claimSuccessOpen.value = true
    setTimeout(() => {
      router.push('/portfolio/history')
    }, 800)
  } catch (err) {
    claimConfirmOpen.value = false
    claimErrorMessage.value = extractErrorMessage(err)
    claimErrorOpen.value = true
  } finally {
    isClaiming.value = false
  }
}

const goHomeFromClaim = () => {
  if (isClaiming.value) return
  claimConfirmOpen.value = false
  router.push('/dashboard')
}

onMounted(() => {
  fetchInvestments()
  timerInterval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  min-height: 100vh;
  background-image: url('/assets/image/d8005907735c42c2d39c64e885e050497bc21e69.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: #eef2f9;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  padding-bottom: 80px;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  position: relative;
  z-index: 2;
}

.back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 3;
  touch-action: manipulation;
}

.back-btn img {
  width: 20px;
  height: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  flex: 1;
  text-align: center;
  margin-left: -20px;
}

.header-spacer {
  width: 20px;
}

/* Hero Section */
.timer-section {
  text-align: center;
  margin-top: 10px;
}

.timer-label {
  color: #555555;
  font-size: 12px;
  margin: 0 0 8px 0;
}

.timer-box {
  background-color: #f3f6fc;
  border: 1px solid #ffffff;
  border-radius: 5px;
  width: 191px;
  height: 64px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.time-display {
  color: #144cdf;
  font-size: 22px;
  font-weight: 700;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
  letter-spacing: 1px;
  line-height: 1;
  width: 100%;
  white-space: nowrap;
  text-align: center;
  margin-bottom: 2px;
}

.time-units {
  display: flex;
  justify-content: space-between;
  width: 110px;
  color: #1b46f5;
  font-size: 10px;
  font-weight: 600;
}

.main-image-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.main-image {
  width: 295px;
  height: auto;
  filter: drop-shadow(0px 4px 4px rgba(97, 157, 236, 0.3));
  animation: float-y 3s ease-in-out infinite;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .main-image {
    animation: none;
  }
}

@keyframes float-y {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.action-section {
  text-align: center;
  margin-bottom: 30px;
}

.claim-btn {
  background: linear-gradient(90deg, #4085e1 0%, #2757b7 100%);
  border-radius: 30px;
  width: 242px;
  padding: 15px 0;
  border: none;
  color: #ffffff;
  font-size: 19px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease;
  font-family: inherit;
}

.claim-btn:active {
  transform: scale(0.98);
}

.claim-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.eligible-text {
  color: #ffffff;
  font-size: 12px;
  margin-top: 15px;
  opacity: 0.9;
}

/* Active Mining Section */
#section-active-mining {
  padding: 10px;
  background: transparent;
}

.banner-container {
  position: relative;
  width: 100%;
  height: 88px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  background-image: url('/assets/image/343e34909cc9a17c2c445000677852ce7a6419d3.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.banner-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0px;
  position: relative;
  z-index: 1;
}

.banner-left-img {
  width: 180px;
  height: 62px;
  object-fit: contain;
  flex: 0 0 auto;
  z-index: 1;
}

.banner-text {
  text-align: center;
  min-width: 0;
}

.banner-text h2 {
  color: #144cdf;
  text-align: left;
  padding-left: 20px;
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.banner-text p {
  color: #000000;
  text-align: center;
  font-size: 10px;
  padding-left: 20px;
  margin: 0;
}

.toggle-icon {
  position: absolute;
  right: 15px;
  width: 34px;
  height: 34px;
  transform: rotate(90deg);
  transition: transform 0.15s ease;
  cursor: pointer;
  flex: 0 0 auto;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-card {
  background-color: #f9f9fc;
  border-radius: 10px;
  padding: 15px 20px;
  box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.05);
}

.product-title {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 12px 0;
}

.product-info-top {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.product-img {
  width: 109px;
  height: 62px;
  object-fit: cover;
  border-radius: 4px;
}

.stats-columns {
  display: flex;
  justify-content: space-between;
  flex: 1;
  font-size: 10px;
  line-height: 1.6;
  color: #000000;
}

.stats-col-right {
  text-align: right;
  font-weight: 600;
}

.card-divider {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 15px 0;
}

.status-columns {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  line-height: 1.6;
  color: #000000;
}

.status-col-right {
  text-align: right;
  font-weight: 600;
}

.action-btn {
  background-color: #1b46f5;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  margin: 16px 0 0 auto;
  font-family: 'Inter', sans-serif;
}

/* Empty State */
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
}

.claim-confirm-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: calc(16px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) calc(16px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));
}

.claim-confirm-card {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
  padding: 16px 16px 18px;
}

.claim-confirm-top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.claim-confirm-image {
  width: 64px;
  height: 64px;
  object-fit: contain;
  flex-shrink: 0;
}

.claim-confirm-text {
  margin: 0;
  color: #000000;
  font-size: 14px;
  line-height: 1.35;
}

.claim-confirm-amount {
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 14px;
}

.claim-confirm-actions {
  display: flex;
  gap: 12px;
}

.claim-confirm-btn {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.claim-confirm-btn--primary {
  background: linear-gradient(180deg, #377fe7 0%, #2a66c6 100%);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(28, 86, 190, 0.35);
}

.claim-confirm-btn--secondary {
  background: linear-gradient(180deg, #16b200 0%, #0b8a00 100%);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(11, 138, 0, 0.3);
}
</style>
