<template>
  <div class="app-container">
    <LoadingSpinner :visible="isLoading && !product" :overlay="true" message="" />

    <!-- Header -->
    <section id="section-header">
      <img src="/assets/images/d12178a34823422429be6c52b5ae0c8d2966fadb.png" class="header-illustration" alt="">
      <header class="top-nav">
        <img src="/assets/images/46_697.svg" alt="Back" class="back-icon" @click="goBack">
        <span class="nav-title">Detail Pembayaran</span>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-content">
        <h1 class="page-title">Detail Pembayaran</h1>
        <p class="page-subtitle">Periksa detail produk dan lanjutkan pembayaran Anda.</p>
      </div>
    </section>

    <!-- Product -->
    <section id="section-product" v-if="product">
      <div class="product-card">
        <div class="product-top">
          <div class="product-image-placeholder">
            <img
              :src="getProductImage(product)"
              :alt="product.name || 'Produk'"
              class="product-thumb"
              @error="handleProductImageError"
            >
          </div>
          <div class="product-info">
            <h2 class="product-name">{{ product.name || '-' }}</h2>
            <p class="product-desc">{{ product.description || 'Produk proteksi aset digital' }}</p>
            <p class="product-price">{{ formatPrice(product.price) }}</p>
          </div>
        </div>

        <div class="product-stats">
          <div class="stat-item">
            <img src="/assets/images/46_711.svg" alt="" class="stat-icon">
            <div class="stat-text">
              <span class="stat-label">Periode</span>
              <span class="stat-value">{{ durationText }}</span>
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <img src="/assets/images/46_716.svg" alt="" class="stat-icon">
            <div class="stat-text">
              <span class="stat-label">Proteksi harian</span>
              <span class="stat-value">{{ profitPerDay }}</span>
            </div>
          </div>
        </div>

        <hr class="card-divider">

        <div class="product-total">
          <div class="total-info">
            <img src="/assets/images/0124373b87358a593909a03ffafd020b5948dccd.png" alt="" class="info-icon">
            <span class="total-label">Estimasi hasil akhir keseluruhan proteksi</span>
          </div>
          <span class="total-price">{{ totalEstimate }}</span>
        </div>
      </div>
    </section>

    <!-- Summary -->
    <section id="section-summary" v-if="product">
      <div class="summary-card">
        <h3 class="summary-title">Rincian Pembayaran</h3>
        <div class="summary-row">
          <span class="summary-label">Harga Produk</span>
          <span class="summary-value">{{ formatPrice(product.price) }}</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer" v-if="product">
      <div class="terms-checkbox" @click="toggleConfirm">
        <div class="checkbox-box" :class="{ unchecked: !isConfirmed }">
          <img v-if="isConfirmed" src="/assets/images/I46_738_51859_5632.svg" alt="">
        </div>
        <p class="terms-text">Saya setuju dengan <span class="highlight">Kebijakan Privasi</span> dan <span class="highlight">Syarat Layanan</span></p>
      </div>

      <button class="pay-button" :disabled="!isConfirmed || isPurchasing" @click="confirmPurchase">
        {{ isPurchasing ? 'Memproses...' : 'Bayar Sekarang' }}
      </button>
    </section>

    <ConfirmationModal
      v-model="showPurchaseModal"
      message="Apakah Anda yakin ingin membeli produk ini?"
      :amount="purchaseAmountDisplay"
      @confirm="executePurchase"
    />

    <SuccessModal
      v-model="successModalOpen"
      :message="successMessage"
      @confirm="handleSuccessConfirm"
    />
    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI } from '@/services/api'
import SuccessModal from '@/components/modals/AppSuccessModal.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import { appSettings, formatAppCurrency } from '@/utils/settings'
import { resolveImageUrl } from '@/utils/imageCache'

const router = useRouter()
const route = useRoute()

const product = ref(null)
const isLoading = ref(false)
const isConfirmed = ref(false)
const showPurchaseModal = ref(false)
const isPurchasing = ref(false)
const successModalOpen = ref(false)
const errorModalOpen = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const redirectInvestmentId = ref(null)

const toggleConfirm = () => {
  isConfirmed.value = !isConfirmed.value
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const raw = String(value).trim()
  if (!raw) return null
  const s = raw.replace(/\s+/g, '')
  const sign = s.startsWith('-') ? '-' : ''
  const unsigned = s.replace(/^[+-]/, '')
  const lastDot = unsigned.lastIndexOf('.')
  const lastComma = unsigned.lastIndexOf(',')
  const lastSep = Math.max(lastDot, lastComma)
  if (lastSep > -1) {
    const intPart = unsigned.slice(0, lastSep).replace(/[.,]/g, '').replace(/[^0-9]/g, '')
    const fracPart = unsigned.slice(lastSep + 1).replace(/[^0-9]/g, '')
    const normalized = fracPart ? `${sign}${intPart || '0'}.${fracPart}` : `${sign}${intPart || '0'}`
    const n = Number(normalized)
    return Number.isFinite(n) ? n : null
  }
  const digitsOnly = unsigned.replace(/[^0-9]/g, '')
  if (!digitsOnly) return null
  const n = Number(`${sign}${digitsOnly}`)
  return Number.isFinite(n) ? n : null
}

const getFractionDigitsFromRaw = (value) => {
  const raw = String(value ?? '').trim()
  const lastSep = Math.max(raw.lastIndexOf('.'), raw.lastIndexOf(','))
  if (lastSep <= -1) return 0
  const frac = raw.slice(lastSep + 1).replace(/[^0-9]/g, '')
  return Math.min(8, frac.length || 0)
}

const getAppDefaultDecimals = () => {
  const d = Number(appSettings?.currency?.decimals)
  return Number.isFinite(d) ? Math.max(0, d) : 0
}

const formatPrice = (value) => {
  const n = parseNumber(value)
  if (n === null) return formatAppCurrency(0, { decimals: 0 })
  return formatAppCurrency(n, { decimals: 0 })
}

const purchaseAmountDisplay = computed(() => {
  const priceRaw = product.value?.price
  const n = parseNumber(priceRaw)
  if (n === null) return ''
  const decimalsFromRaw = getFractionDigitsFromRaw(priceRaw)
  const decimals = decimalsFromRaw > 0 ? decimalsFromRaw : getAppDefaultDecimals()
  return formatAppCurrency(n, { decimals })
})

const profitPerDay = computed(() => {
  if (!product.value) return '-'
  const profitType = String(product.value?.profit_type || '').toLowerCase()
  if (profitType === 'random') {
    const min = parseNumber(product.value?.profit_random_min)
    const max = parseNumber(product.value?.profit_random_max)
    if (min !== null && max !== null) return `${formatAppCurrency(min, { decimals: 0 })}~${formatAppCurrency(max, { decimals: 0 })}`
    if (min !== null) return formatAppCurrency(min, { decimals: 0 })
  }
  const rate = parseNumber(product.value?.profit_rate)
  if (rate !== null && rate > 0) return formatAppCurrency(rate, { decimals: 0 })
  return '-'
})

const durationText = computed(() => {
  const d = parseNumber(product.value?.duration)
  if (d === null) return '-'
  return `${d} Hari`
})

const totalEstimate = computed(() => {
  if (!product.value) return '-'
  const profitType = String(product.value?.profit_type || '').toLowerCase()
  const duration = parseNumber(product.value?.duration) || 0
  let dailyProfit = 0
  if (profitType === 'random') {
    const max = parseNumber(product.value?.profit_random_max)
    dailyProfit = max !== null ? max : 0
  } else {
    const rate = parseNumber(product.value?.profit_rate)
    dailyProfit = rate !== null ? rate : 0
  }
  const total = dailyProfit * duration
  if (total <= 0) return '-'
  return formatAppCurrency(total, { decimals: 0 })
})

const getProductImage = (prod) => {
  const raw = String(prod?.image || '').trim()
  const resolved = raw ? resolveImageUrl(raw) : ''
  return resolved || '/assets/images/1ea41e69edf9909600bc1dea02f90a88a2cbf679.png'
}

const handleProductImageError = (e) => {
  const el = e?.target
  if (!el) return
  el.src = '/assets/images/1ea41e69edf9909600bc1dea02f90a88a2cbf679.png'
}

const fetchProduct = async () => {
  const id = Number(route.params.id)
  if (!Number.isFinite(id)) return
  isLoading.value = true
  try {
    const resp = await productAPI.getProduct(id)
    product.value = resp?.data || null
  } catch (_) {
    product.value = null
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.id, fetchProduct, { immediate: true })

const goBack = () => {
  router.go(-1)
}

const confirmPurchase = () => {
  if (!isConfirmed.value) return
  errorMessage.value = ''
  errorModalOpen.value = false
  showPurchaseModal.value = true
}

const extractPurchaseErrorMessage = (data) => {
  if (!data) return ''
  if (typeof data === 'string') return data
  const detail = data?.detail ?? data?.message ?? ''
  if (detail) return String(detail)

  const values = []
  for (const v of Object.values(data)) {
    if (Array.isArray(v)) values.push(...v)
    else if (typeof v === 'string') values.push(v)
  }
  const combined = values.map((x) => String(x || '').trim()).filter(Boolean).join(' ')
  if (!combined) return ''

  const s = combined.toLowerCase()
  if (s.includes('no news matches to this query') || s.includes('no product matches to this query') || s.includes('no matches to this query')) {
    return 'Silakan refresh koneksi atau logout terlebih dahulu.'
  }
  if (s.includes('balance') || s.includes('insufficient') || s.includes('saldo')) {
    return 'Silakan isi ulang saldo Anda terlebih dahulu.'
  }
  if (s.includes('batas pembelian tercapai') || s.includes('hanya bisa membeli produk ini') || s.includes('purchase limit') || s.includes('maximum')) {
    return 'Batas pembelian tercapai'
  }

  return combined
}

const executePurchase = async () => {
  if (isPurchasing.value) return
  const productId = Number(route.params.id)
  if (!Number.isFinite(productId)) return
  showPurchaseModal.value = false
  errorMessage.value = ''
  errorModalOpen.value = false
  isPurchasing.value = true
  try {
    const resp = await productAPI.purchaseProduct({
      product_id: productId,
      quantity: 1,
      withdraw_pin: ''
    })
    const inv = resp?.data
    redirectInvestmentId.value = inv?.id ?? inv?.investment_id ?? null
    successMessage.value = 'Berhasil'
    successModalOpen.value = true
  } catch (err) {
    const data = err?.response?.data
    errorMessage.value = extractPurchaseErrorMessage(data) || 'Pembelian gagal'
    errorModalOpen.value = true
  } finally {
    isPurchasing.value = false
  }
}

const handleSuccessConfirm = () => {
  const id = redirectInvestmentId.value
  redirectInvestmentId.value = null
  if (id) {
    router.push('/hn/hall/outputhall')
    return
  }
  router.push('/hn/hall/outputhall')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  max-width: 412px;
  margin: 0 auto;
  background-color: #fdfaf4;
  min-height: 100vh;
  position: relative;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

section {
  padding: 0 20px;
  position: relative;
}

/* Header */
#section-header {
  padding-top: 20px;
  padding-bottom: 10px;
}

.header-illustration {
  position: absolute;
  top: 0;
  right: 0;
  width: 171px;
  height: 123px;
  z-index: 0;
  pointer-events: none;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.back-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.nav-title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

/* Hero */
#section-hero {
  padding-top: 10px;
  padding-bottom: 20px;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #635f5f;
  line-height: 1.4;
  max-width: 280px;
}

/* Product */
#section-product {
  padding-bottom: 16px;
}

.product-card {
  background-color: #fdf7ed;
  border: 1px solid #ffe9bd;
  border-radius: 10px;
  padding: 16px;
}

.product-top {
  display: flex;
  gap: 16px;
}

.product-image-placeholder {
  width: 57px;
  height: 70px;
  background-color: #dadada;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.product-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.product-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.product-name {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

.product-desc {
  font-size: 12px;
  color: #635f5f;
}

.product-price {
  font-size: 14px;
  font-weight: 700;
  color: #c88600;
}

.product-stats {
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding-left: 73px;
}

.stat-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.stat-icon {
  width: 16px;
  height: 16px;
  margin-top: 2px;
}

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 10px;
  color: #000000;
}

.stat-value {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0 16px;
}

.card-divider {
  border: none;
  border-top: 1px solid #f3b73f;
  opacity: 0.5;
  margin: 16px 0;
}

.product-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 200px;
}

.info-icon {
  width: 16px;
  height: 16px;
  margin-top: 2px;
}

.total-label {
  font-size: 11px;
  line-height: 1.3;
  color: #000000;
}

.total-price {
  font-size: 14px;
  font-weight: 700;
  color: #c88600;
}

/* Summary */
#section-summary {
  padding-bottom: 24px;
}

.summary-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.summary-title {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 12px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 12px;
  color: #000000;
}

.summary-value {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

/* Footer */
#section-footer {
  padding-bottom: 40px;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 32px;
  padding: 0 4px;
  cursor: pointer;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  background-color: #f4bd40;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  transition: background-color 0.2s;
}

.checkbox-box.unchecked {
  background-color: #cccccc;
}

.checkbox-box img {
  width: 14px;
  height: 14px;
}

.terms-text {
  font-size: 12px;
  color: #635f5f;
  line-height: 1.5;
}

.terms-text .highlight {
  color: #c88600;
  font-weight: 600;
}

.pay-button {
  width: 100%;
  height: 48px;
  background-color: #f3b740;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: opacity 0.2s;
}

.pay-button:hover {
  opacity: 0.9;
}

.pay-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
