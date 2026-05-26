<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="main-header">
        <img src="/assets/images/108294978d9cad25785261933372f80a0602c03d.png" alt="Dana Proteksi" class="header-logo">
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-container">
        <h1 class="hero-title">Dana Proteksi</h1>
        <p class="hero-subtitle">Pilih produk perlindungan yang sesuai dengan kebutuhan Anda.</p>
      </div>
    </section>

    <!-- Categories -->
    <section id="section-categories">
      <div class="categories-container">
        <button
          v-for="(tab, idx) in tabs"
          :key="idx"
          class="category-btn"
          :class="{ active: activeTab === idx }"
          @click="setActiveTab(idx)"
        >
          {{ tab.label }}
        </button>
      </div>
    </section>

    <!-- Product List -->
    <section id="section-product-list">
      <div class="product-list-container">
        <div v-if="sortedProducts.length === 0" class="empty-state">
          <img src="/assets/images/empty.jpg" alt="" class="empty-icon">
          <p class="empty-text">Tidak ada produk tersedia</p>
        </div>

        <div
          v-for="product in sortedProducts"
          :key="product.id"
          class="product-card"
          @click="buyProduct(product)"
        >
          <div class="card-main">
            <div class="card-image-placeholder">
              <img
                :src="getProductImage(product)"
                :alt="product.name || 'Produk'"
                class="card-product-img"
                loading="lazy"
                @error="handleProductImageError"
              >
            </div>
            <div class="card-details">
              <h2 class="product-name">{{ product.name || '-' }}</h2>
              <p class="product-desc">{{ product.description || 'Produk proteksi aset digital' }}</p>
              <div class="product-meta">
                <div class="meta-item">
                  <span class="meta-label"><img src="/assets/images/44_560.svg" alt=""> Mulai dari</span>
                  <span class="meta-value">{{ formatPrice(product.price) }}</span>
                </div>
                <div class="meta-divider"></div>
                <div class="meta-item">
                  <span class="meta-label"><img src="/assets/images/44_570.svg" alt=""> Periode</span>
                  <span class="meta-value">{{ product.duration || '-' }} Hari</span>
                </div>
                <button class="btn-select" @click.stop="buyProduct(product)" :disabled="isOutOfStock(product)">
                  Pilih Produk <img src="/assets/images/44_579.svg" alt="">
                </button>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="footer-item">
              <img src="/assets/images/Bar chart.png" alt="" class="footer-icon">
              <div class="footer-text">
                <span class="footer-label">Proteksi harian</span>
                <div class="footer-value-row">
                  <span v-if="getFooterAmountText(formatProfitValue(product)).showCurrency" class="footer-currency">Rp</span>
                  <span class="footer-value">{{ getFooterAmountText(formatProfitValue(product)).text }}</span>
                </div>
              </div>
            </div>
            <div class="footer-divider"></div>
            <div class="footer-item right-align">
              <img src="/assets/images/Award.png" alt="" class="footer-icon">
              <div class="footer-text">
                <span class="footer-label">Estimasi Keseluruhan</span>
                <div class="footer-value-row">
                  <span v-if="getFooterAmountText(formatTotalEstimate(product)).showCurrency" class="footer-currency">Rp</span>
                  <span class="footer-value">{{ getFooterAmountText(formatTotalEstimate(product)).text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterBar />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { productAPI } from '@/services/api'
import FooterBar from '@/components/partials/AppFooter.vue'
import { resolveImageUrl } from '@/utils/imageCache'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()

const products = ref([])
const activeTab = ref(0)
const normalizeCategory = (value) => {
  const s = String(value ?? '').trim()
  return s.replace(/\s+/g, ' ')
}

const tabs = computed(() => {
  const set = new Set()
  for (const p of products.value || []) {
    const raw = p?.product_golongan ?? p?.golongan ?? p?.category ?? ''
    const v = normalizeCategory(raw)
    if (v) set.add(v)
  }
  const categories = Array.from(set)
  categories.sort((a, b) => a.localeCompare(b, 'id-ID'))
  return [{ label: 'Semua', key: '__all__' }, ...categories.map((c) => ({ label: c, key: c }))]
})

/* ─── Helpers ─── */
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

const formatPrice = (value) => {
  const n = parseNumber(value)
  if (n === null) return formatAppCurrency(0, { decimals: 0 })
  return formatAppCurrency(n, { decimals: 0 })
}

const formatProfitAmount = (value) => {
  const n = parseNumber(value)
  if (n === null) return '-'
  const decimals = getFractionDigitsFromRaw(value)
  return formatAppCurrency(n, { decimals })
}

const formatProfitValue = (product) => {
  const profitType = String(product?.profit_type || '').toLowerCase()
  if (profitType === 'random') {
    const min = formatProfitAmount(product?.profit_random_min)
    const max = formatProfitAmount(product?.profit_random_max)
    if (min !== '-' && max !== '-') return `${min}~${max}`
    if (min !== '-') return min
  }
  const rate = parseNumber(product?.profit_rate)
  if (rate !== null && rate > 0) return formatProfitAmount(product?.profit_rate)
  return '-'
}

const formatTotalEstimate = (product) => {
  const profitType = String(product?.profit_type || '').toLowerCase()
  const duration = parseNumber(product?.duration) || 0
  let dailyProfit = 0
  if (profitType === 'random') {
    const max = parseNumber(product?.profit_random_max)
    dailyProfit = max !== null ? max : 0
  } else {
    const rate = parseNumber(product?.profit_rate)
    dailyProfit = rate !== null ? rate : 0
  }
  const total = dailyProfit * duration
  if (total <= 0) return '-'
  return formatAppCurrency(total, { decimals: 0 })
}

const getFooterAmountText = (value) => {
  const raw = String(value ?? '').trim()
  if (!raw || raw === '-') return { showCurrency: false, text: '-' }
  const withoutRp = raw.replace(/\bRp\b\s*/g, '').trim()
  if (!withoutRp || withoutRp === '-') return { showCurrency: false, text: '-' }
  return { showCurrency: true, text: withoutRp }
}

const isOutOfStock = (product) => {
  const enabled = product?.stock_enabled
  if (enabled === false) return false
  const stock = parseNumber(product?.stock)
  return stock !== null && stock <= 0
}

const normalizeProductsResponse = (data) => {
  if (!data) return { count: null, results: [] }
  if (Array.isArray(data)) return { count: data.length, results: data }
  if (Array.isArray(data.results)) return { count: Number(data.count ?? null), results: data.results }
  return { count: null, results: [] }
}

const filteredProducts = computed(() => {
  const key = tabs.value?.[activeTab.value]?.key ?? '__all__'
  if (key === '__all__') return products.value
  const target = normalizeCategory(key)
  return products.value.filter((p) => {
    const raw = p?.product_golongan ?? p?.golongan ?? p?.category ?? ''
    return normalizeCategory(raw) === target
  })
})

const sortedProducts = computed(() => {
  const list = Array.isArray(filteredProducts.value) ? [...filteredProducts.value] : []
  list.sort((a, b) => {
    const priceA = parseNumber(a?.price)
    const priceB = parseNumber(b?.price)
    const pa = priceA === null ? Number.POSITIVE_INFINITY : priceA
    const pb = priceB === null ? Number.POSITIVE_INFINITY : priceB
    if (pa !== pb) return pa - pb
    const outA = isOutOfStock(a)
    const outB = isOutOfStock(b)
    if (outA !== outB) return outA ? 1 : -1
    const idA = Number(a?.id ?? 0)
    const idB = Number(b?.id ?? 0)
    return idA - idB
  })
  return list
})

const setActiveTab = (idx) => {
  const n = Number(idx)
  if (!Number.isFinite(n)) return
  activeTab.value = Math.max(0, Math.min(tabs.value.length - 1, n))
}

watch(
  () => tabs.value.length,
  (len) => {
    const n = Number(len || 0)
    if (!n) {
      activeTab.value = 0
      return
    }
    if (activeTab.value > n - 1) activeTab.value = 0
  },
  { immediate: true }
)

const getProductImage = (product) => {
  const raw = String(product?.image || '').trim()
  const resolved = raw ? resolveImageUrl(raw) : ''
  return resolved || '/assets/images/1ea41e69edf9909600bc1dea02f90a88a2cbf679.png'
}

const handleProductImageError = (e) => {
  const el = e?.target
  if (!el) return
  el.src = '/assets/images/1ea41e69edf9909600bc1dea02f90a88a2cbf679.png'
}

const buyProduct = (product) => {
  if (!product || !product.id) return
  if (isOutOfStock(product)) return
  router.push({ name: 'ProductDetails', params: { id: String(product.id) } })
}

const fetchProducts = async () => {
  try {
    const first = await productAPI.getProducts({ page: 1 })
    const parsedFirst = normalizeProductsResponse(first?.data)
    const all = [...parsedFirst.results]
    const total = parsedFirst.count

    if (total !== null && all.length >= total) {
      products.value = all
      return
    }

    for (let page = 2; page <= 20; page += 1) {
      const resp = await productAPI.getProducts({ page })
      const parsed = normalizeProductsResponse(resp?.data)
      if (!parsed.results.length) break
      all.push(...parsed.results)
      if (total !== null && all.length >= total) break
    }

    products.value = all
  } catch (_) {
    products.value = []
    activeTab.value = 0
  }
}

onMounted(() => {
  fetchProducts()
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
  max-width: 412px;
  margin: 0 auto;
  background-color: #fdfaf4;
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.main-header {
  padding: 28px 20px 10px 20px;
}

.header-logo {
  height: 52px;
  width: auto;
  display: block;
}

/* Hero */
.hero-container {
  padding: 10px 20px;
}

.hero-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #000000;
}

.hero-subtitle {
  font-size: 13px;
  color: #635f5f;
  line-height: 1.4;
}

/* Categories */
.categories-container {
  padding: 12px 20px;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.category-btn {
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background-color: #fefefe;
  border: 1px solid #cfcfcf;
  color: #000000;
  font-family: inherit;
  transition: all 0.2s;
}

.category-btn.active {
  border-color: #f3b73f;
  color: #f3b73f;
}

/* Product List */
.product-list-container {
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.product-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: pointer;
}

.card-main {
  display: flex;
  gap: 16px;
}

.card-image-placeholder {
  width: 57px;
  height: 70px;
  background-color: #fef7e3;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.card-product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.card-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2px;
}

.product-desc {
  font-size: 11px;
  color: #635f5f;
  margin-bottom: 12px;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 9px;
  color: #000;
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-label img {
  width: 12px;
  height: 12px;
}

.meta-value {
  font-size: 11px;
  font-weight: 700;
  color: #000000;
}

.meta-divider {
  width: 1px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.1);
}

.btn-select {
  background: linear-gradient(90deg, #f4c142 0%, #f4c142 47%, #f5ca51 100%);
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 6px 8px 6px 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}

.btn-select img {
  width: 16px;
  height: 16px;
}

.btn-select:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.card-footer {
  background-color: #ecf3fc;
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-item.right-align {
  justify-content: flex-start;
}

.footer-item.right-align .footer-text {
  text-align: left;
  align-items: flex-start;
}

.footer-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.footer-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-value-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-currency {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
}

.footer-label {
  font-size: 10px;
  color: #000;
}

.footer-value {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
}

.footer-divider {
  width: 1px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.1);
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-icon {
  width: 160px;
  height: auto;
  display: block;
  margin: 0 auto 12px;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}
</style>
