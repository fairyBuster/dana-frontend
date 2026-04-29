<template>
  <div class="app-container">
    <LoadingSpinner :visible="isLoading && !product" :overlay="true" message="" />

    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <button class="back-btn" @click="goBack" aria-label="Kembali">
          <img src="/assets/images/2031_431.svg" alt="Back Icon">
        </button>
        <h1 class="header-title">Detail Aset Pembayaran</h1>
      </header>
    </section>

    <!-- Product Info -->
    <section id="section-product-info">
      <div class="product-info">
        <img
          class="product-icon"
          :src="getProductImage(product)"
          :alt="productTitle"
          loading="lazy"
          decoding="async"
          @error="handleProductImageError"
        >
        <div class="product-text">
          <h2 class="product-title">{{ productTitle }}</h2>
          <p class="product-subtitle">{{ product?.specifications || 'Spesifikasi produk' }}</p>
        </div>
      </div>
    </section>

    <!-- Chart -->
    <section id="section-chart">
      <div class="chart-container">
        <div class="chart-card">
          <svg
            v-if="chartReady"
            class="chart-img"
            viewBox="0 0 300 120"
            preserveAspectRatio="none"
            aria-label="Grafik pertumbuhan aset"
          >
            <defs>
              <linearGradient id="productChartFillGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(21, 178, 92, 0.28)" />
                <stop offset="100%" stop-color="rgba(21, 178, 92, 0)" />
              </linearGradient>
              <filter id="productChartShadowGreen" x="-20%" y="-40%" width="140%" height="200%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#15B25C" flood-opacity="0.35" />
              </filter>
            </defs>
            <path :d="chartAreaPath" fill="url(#productChartFillGreen)" />
            <path :d="chartLinePath" stroke="#15B25C" stroke-width="3" fill="none" filter="url(#productChartShadowGreen)" />
          </svg>
       
        </div>
        <p class="chart-caption">Dana pertumbuhan aset 2026</p>
      </div>
    </section>

    <!-- Price Details -->
    <section id="section-price-details">
      <div class="price-container">
        <div class="price-card-outer">
          <div class="price-card-inner">
            <div class="price-col-left">
              <span class="price-label">Harga Beli</span>
              <span class="price-value">{{ priceText }}</span>
              <span class="price-return">Pengembalian: {{ profitPerDay }}/hari</span>
            </div>
            <div class="price-col-right">
              <span class="price-limit">Maksimal pembelian: {{ purchaseLimitText }}</span>
              <span class="price-due">Jatuh tempo: {{ dueDateText }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Asset Info -->
    <section id="section-asset-info">
      <div class="asset-info-container">
        <h3 class="asset-info-title">Informasi Aset</h3>
        <div class="asset-info-list">
          <div class="asset-info-row">
            <span class="asset-info-label">Nama Aset</span>
            <span class="asset-info-value">{{ product?.name || '-' }}</span>
          </div>
          <div class="asset-info-row">
            <span class="asset-info-label">Durasi</span>
            <span class="asset-info-value">{{ durationText }}</span>
          </div>
          <div class="asset-info-row">
            <span class="asset-info-label">Seri</span>
            <span class="asset-info-value">{{ product?.golongan || '-' }}</span>
          </div>
          <div class="asset-info-row">
            <span class="asset-info-label">Stock</span>
            <span class="asset-info-value">{{ availabilityText }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer">
      <footer class="app-footer">
        <div class="terms-container">
          <img class="terms-icon" src="/assets/images/d9b41d54b13e3f872bf656657234e30868c2d994.png" alt="Checkbox Icon">
          <p class="terms-text">
            Dengan melanjutkan proses ini, kamu menyetujui <router-link to="/terms" class="terms-highlight">Syarat & Ketentuan</router-link> yang berlaku
          </p>
        </div>
        <button class="btn-primary" @click="openPurchaseModal" :disabled="isPurchasing">Bayar</button>
      </footer>
    </section>

    <!-- Purchase Modal -->
    <teleport to="body">
      <div v-if="showPurchaseModal" class="purchase-modal-overlay" @click.self="showPurchaseModal = false">
        <div class="purchase-modal">
          <div class="purchase-modal-title">Pertanyaan</div>
          <div class="purchase-modal-desc">Periksa sebelum melanjutkan apa sudah sesuai?</div>
          <div class="purchase-modal-actions">
            <button type="button" class="purchase-btn cancel" @click="showPurchaseModal = false" :disabled="isPurchasing">Batal</button>
            <button type="button" class="purchase-btn ok" @click="confirmPurchase" :disabled="isPurchasing">Setuju</button>
          </div>
        </div>
      </div>
    </teleport>

    <SuccessModal
      v-model="successModalOpen"
      :message="successMessage"
      @confirm="handleSuccessConfirm"
    />
    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI } from '@/services/api'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import { resolveImageUrl } from '@/utils/imageCache'

const router = useRouter()
const route = useRoute()

const product = ref(null)
const isLoading = ref(false)
const showPurchaseModal = ref(false)
const isPurchasing = ref(false)
const successModalOpen = ref(false)
const errorModalOpen = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const redirectInvestmentId = ref(null)

const fallbackProductImage = ''

const getProductImage = (p) => {
  const raw = String(p?.image || '').trim()
  const resolved = raw ? resolveImageUrl(raw) : ''
  return resolved || fallbackProductImage
}

const handleProductImageError = (e) => {
  const el = e?.target
  if (!el) return
  el.src = fallbackProductImage
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(n)) return null
  return n
}

const formatNumber = (value) => {
  const n = parseNumber(value)
  if (n === null) return '-'
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

const seededRng = (seed) => {
  let s = (Number(seed) || 0) >>> 0
  return () => {
    s = (1664525 * s + 1013904223) >>> 0
    return s / 4294967296
  }
}

const normalizeSeries = (raw) => {
  const list = Array.isArray(raw) ? raw : []
  const values = list
    .map((x) => {
      if (typeof x === 'number') return x
      if (typeof x === 'string') return parseNumber(x)
      if (x && typeof x === 'object') {
        const v = x.value ?? x.amount ?? x.y ?? x.total ?? x.count
        return parseNumber(v)
      }
      return null
    })
    .filter((v) => v !== null && Number.isFinite(Number(v)))
    .map((v) => Number(v))
  return values
}

const chartValues = computed(() => {
  const p = product.value || {}
  const candidates = [
    p.growth,
    p.growth_data,
    p.growth_points,
    p.chart,
    p.chart_data,
    p.chart_points,
    p.points,
    p.graph
  ]
  for (const c of candidates) {
    const values = normalizeSeries(c)
    if (values.length >= 2) return values.slice(-6)
  }

  const idSeed = Number(route.params.id || 0) || 0
  const basePrice = parseNumber(p.price) ?? 0
  const baseProfit = parseNumber(p.profit_rate) ?? (parseNumber(p.profit_random_min) ?? 0)
  const base = Math.max(20, Math.round((basePrice / 100000) * 6 + (baseProfit / 10000) * 2))
  const rand = seededRng(idSeed + Math.round(basePrice) + Math.round(baseProfit * 10))

  const out = []
  let cur = base
  for (let i = 0; i < 6; i += 1) {
    const step = Math.max(1, Math.round(base * (0.04 + rand() * 0.12)))
    const dip = rand() < 0.22 ? Math.round(step * (0.6 + rand() * 0.6)) : 0
    cur = Math.max(1, cur + step - dip)
    out.push(cur)
  }
  return out
})

const chartPoints = computed(() => {
  const values = chartValues.value
  const w = 300
  const h = 120
  const padX = 8
  const padTop = 12
  const padBottom = 18
  const innerW = w - padX * 2
  const innerH = h - padTop - padBottom
  const max = Math.max(1, ...values)
  return values.map((v, idx) => {
    const x = padX + (innerW * idx) / Math.max(1, values.length - 1)
    const y = padTop + innerH * (1 - v / max)
    return { x, y }
  })
})

const chartLinePath = computed(() => {
  const pts = chartPoints.value
  if (pts.length < 2) return ''
  const path = [`M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`]
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    path.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    )
  }
  return path.join(' ')
})

const chartAreaPath = computed(() => {
  const pts = chartPoints.value
  if (pts.length < 2) return ''
  const baseY = 120 - 18
  const path = [`M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`]
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    path.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    )
  }
  path.push(`L ${pts[pts.length - 1].x.toFixed(2)} ${baseY}`)
  path.push(`L ${pts[0].x.toFixed(2)} ${baseY}`)
  path.push('Z')
  return path.join(' ')
})

const chartReady = computed(() => Boolean(product.value) && chartLinePath.value && chartAreaPath.value)

const productTitle = computed(() => product.value?.name || 'Aset')

const priceText = computed(() => {
  const p = parseNumber(product.value?.price)
  if (p === null) return 'Rp -'
  return `Rp ${formatNumber(p)}`
})

const profitPerDay = computed(() => {
  const profitType = String(product.value?.profit_type || '').toLowerCase()
  if (profitType === 'random') {
    const min = parseNumber(product.value?.profit_random_min)
    if (min !== null) return `Rp ${formatNumber(min)}`
  }
  const rate = parseNumber(product.value?.profit_rate)
  if (rate !== null && rate > 0) return `Rp ${formatNumber(rate)}`
  return 'Rp -'
})

const durationText = computed(() => {
  const d = parseNumber(product.value?.duration)
  if (d === null) return '-'
  return `${d} Hari`
})

const purchaseLimitText = computed(() => {
  const limit = parseNumber(product.value?.purchase_limit)
  if (limit === null) return '1'
  return String(Math.max(1, Math.round(limit)))
})

const dueDateText = computed(() => {
  const d = parseNumber(product.value?.duration)
  if (d === null) return '-'
  const due = new Date()
  due.setDate(due.getDate() + d)
  return `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')}/${due.getFullYear()}`
})

const availabilityText = computed(() => {
  const enabled = product.value?.stock_enabled
  const stock = parseNumber(product.value?.stock)
  if (enabled && stock !== null && stock <= 0) return 'Stok habis'
  return 'Tersedia'
})

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

const openPurchaseModal = () => {
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
  if (
    s.includes('saldo') ||
    s.includes('balance') ||
    s.includes('insufficient') ||
    s.includes('tidak cukup') ||
    s.includes('kurang')
  ) {
    return 'Silakan lakukan pengisian saldo terlebih dahulu.'
  }
  if (s.includes('batas pembelian') || s.includes('hanya bisa membeli') || s.includes('kali')) {
    return 'Anda telah mencapai batas maksimal untuk produk ini.'
  }

  return combined
}

const confirmPurchase = async () => {
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
    successMessage.value = 'Aset telah ditambahkan ke akun Anda.'
    successModalOpen.value = true
  } catch (err) {
    const data = err?.response?.data
    errorMessage.value = extractPurchaseErrorMessage(data) || 'Gagal melakukan pembelian'
    errorModalOpen.value = true
  } finally {
    isPurchasing.value = false
  }
}

const handleSuccessConfirm = () => {
  const id = redirectInvestmentId.value
  redirectInvestmentId.value = null
  if (id) {
    router.push(`/portfolio`)
    return
  }
  router.push('/portfolio')
}

onBeforeUnmount(() => {
  // cleanup if needed
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

h1, h2, h3, p {
  margin: 0;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Product Info */
.product-info {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 12px;
}

.product-icon {
  width: 49px;
  height: 49px;
  border-radius: 50%;
  object-fit: cover;
}

.product-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.product-subtitle {
  font-size: 12px;
  color: #666666;
  margin: 0;
}

/* Chart */
.chart-container {
  padding: 8px 0px;
}

.chart-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 24px 0px;
  margin-bottom: 12px;
}

.chart-img {
  width: 100%;
  height: 150px;
  display: block;
}

.chart-caption {
  text-align: right;
  font-size: 12px;
  color: #000000;
  margin: 0;
}

/* Price Details */
.price-container {
  padding: 0 16px 24px;
}

.price-card-outer {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 16px;
}

.price-card-inner {
  background-color: #f8f8f8;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.price-col-left {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 12px;
  color: #004d43;
  font-weight: 600;
  margin-bottom: 4px;
}

.price-value {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 16px;
}

.price-return {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
}

.price-col-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.price-limit, .price-due {
  font-size: 10px;
  color: #004d43;
  font-weight: 600;
}

/* Asset Info */
.asset-info-container {
  padding: 0 16px 32px;
  flex-grow: 1;
}

.asset-info-title {
  font-size: 14px;
  color: #004d43;
  font-weight: 700;
  margin-bottom: 16px;
  margin-top: 0;
}

.asset-info-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.asset-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.asset-info-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}

.asset-info-value {
  font-size: 12px;
  color: #000000;
  font-weight: 700;
}

/* Footer */
#section-footer {
  margin-top: auto;
}

.app-footer {
  padding: 16px;
  background-color: #f8f8f8;
}

.terms-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
}

.terms-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  object-fit: contain;
}

.terms-text {
  font-size: 12px;
  color: #000000;
  line-height: 1.5;
  margin: 0;
}

.terms-highlight {
  color: #004d43;
  font-weight: 600;
}

.btn-primary {
  width: 100%;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 18px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  font-family: inherit;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #003831;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Purchase Modal */
.purchase-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.purchase-modal {
  width: 100%;
  max-width: 320px;
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
}

.purchase-modal-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
}

.purchase-modal-desc {
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.4;
  margin-bottom: 16px;
}

.purchase-modal-actions {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.purchase-btn {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  border: none;
}

.purchase-btn.cancel {
  background-color: #eeeeee;
  color: #000000;
}

.purchase-btn.ok {
  background-color: #004d43;
  color: #ffffff;
}

.purchase-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
