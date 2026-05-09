<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="top-bar">
        <div class="top-bar-left">
          <img src="/assets/image/Logo01.png" alt="Logo" class="logo">
          <span class="masked-account">{{ maskedAccount }}</span>
          <img src="/assets/image/4364_188.svg" alt="Show" class="icon-sm" @click="toggleAccount">
        </div>
        <div class="top-bar-right">
          <img src="/assets/image/16636ddcfe5bc7cbc19b06c1725abcf55b1768ac.png" alt="Download" class="icon-md">
          <div ref="langWrapEl" class="lang-wrap">
            <button
              ref="langBtnEl"
              type="button"
              class="lang-btn"
              aria-label="Language"
              :aria-expanded="langMenuOpen ? 'true' : 'false'"
              @click.stop="toggleLangMenu"
            >
              <img src="/assets/image/4364_186.svg" alt="Language" class="icon-md">
            </button>
            <div v-if="langMenuOpen" class="lang-menu" @click.stop>
              <button type="button" class="lang-item" @click="changeLanguage('en')">English</button>
              <button type="button" class="lang-item" @click="changeLanguage('id')">Indonesia</button>
            </div>
          </div>
        </div>
      </header>
      <div v-if="tabs.length" class="tabs-container">
        <div
          v-for="(tab, idx) in tabs"
          :key="idx"
          class="tab"
          :class="{ active: activeTab === idx, inactive: activeTab !== idx }"
          @click="setActiveTab(idx)"
        >
          {{ tab.label }}
        </div>
      </div>
    </section>

    <!-- Product List -->
    <section id="section-products">
      <div class="product-list-container">
        <div v-if="sortedProducts.length === 0" class="empty-state">
          <p class="empty-text">No products available</p>
        </div>

        <div
          v-for="product in sortedProducts"
          :key="product.id"
          class="product-card"
          @click="buyProduct(product)"
        >
          <div class="badge">{{ isOutOfStock(product) ? 'Sold out' : `Stock: ${product.stock || 0}` }}</div>
          <h3 class="product-title">{{ product.name || '-' }}</h3>
          <div class="card-content">
            <div class="image-wrapper">
              <img :src="getProductImage(product)" :alt="product.name || 'Product'" class="product-image" loading="lazy" decoding="async">
            </div>
            
            <div class="info-wrapper">
              
              <div class="stats-grid">
                <div class="stat-col">
                  <div class="stat-item">
                    <span class="stat-label">Mining Output</span>
                    <span class="stat-value"><span class="text-blue">${{ formatProfitValue(product) }}</span> <span class="text-sm">/day</span></span>
                  </div>
                </div>
                <div class="stat-col">
                  <div class="stat-item">
                    <span class="stat-label">Rental Period</span>
                    <span class="stat-value"><span class="text-blue">{{ product.duration || '-' }}</span> <span class="text-sm">/day</span></span>
                  </div>
                </div>
              </div>
                <br>
               <div class="stats-grid">
                <div class="stat-col">
                  <div class="stat-item">
                    <span class="stat-label">Mining Speed</span>
                    <span class="stat-value" style="font-size: 14px; font-style: italic;"><span>≈0.6949 PH/s</span></span>
                  </div>
                </div>
                <div class="stat-col">
                  <div class="stat-item">
                    <span class="stat-label">Mining Duration</span>
                    <span class="stat-value" style="font-size: 14px; font-style: italic;"><span>≈24 hour</span></span>
                  </div>
                </div>
                
              </div>
                <br>
               <div class="stats-grid">
                <div class="stat-col">
                  <div class="stat-item">
                    <span class="stat-label">Block reward(s)</span>
                    <span class="stat-value" style="font-size: 12px; font-style: italic;"><span>Added to the blockchain, on average, every 00 AM</span></span>
                  </div>
                </div>
              
                
              </div>

            </div>
          </div>
          <div class="divider"></div>
          <div class="card-footer">
            <div class="price-wrap">
              <span class="price-label">Price:</span>
              <span class="price-value">${{ formatPrice(product.price) }}</span>
            </div>
            <button class="btn-buy" :disabled="isOutOfStock(product)" @click.stop="buyProduct(product)">
              {{ isOutOfStock(product) ? 'Sold Out' : 'See Featured' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <FooterBar />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authAPI, productAPI } from '@/services/api'
import FooterBar from '@/components/partials/FooterBar.vue'
import { resolveImageUrl } from '@/utils/imageCache'
import { setLanguage } from '@/i18n'

const router = useRouter()
const { locale } = useI18n()

const products = ref([])
const activeTab = ref(0)
const tabs = ref([
  { label: 'Cloud Computing', key: 'active' },
  { label: 'Sold out', key: 'inactive' }
])
const accountVisible = ref(false)
const accountInfo = ref(null)

const langMenuOpen = ref(false)
const langWrapEl = ref(null)
const langBtnEl = ref(null)

const getPhone = (data) => {
  const d = data || {}
  const p = String(d.phone || d.phone_number || d.user_phone || '').trim()
  return p
}

const maskPhone = (phone) => {
  const p = String(phone || '').trim()
  if (!p) return '**********'
  const digits = p.replace(/\D/g, '')
  if (!digits) return '**********'
  const masked = '*'.repeat(digits.length)
  return p.startsWith('') ? `${masked}` : masked
}

const maskedAccount = computed(() => {
  const phone = getPhone(accountInfo.value)
  return accountVisible.value ? (phone || '-') : maskPhone(phone)
})

const toggleAccount = () => {
  accountVisible.value = !accountVisible.value
}

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

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(n)) return null
  return n
}

const formatPrice = (value) => {
  const n = parseNumber(value)
  if (n === null) return '0'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

const formatProfitValue = (product) => {
  const profitType = String(product?.profit_type || '').toLowerCase()
  if (profitType === 'random') {
    const min = parseNumber(product?.profit_random_min)
    const max = parseNumber(product?.profit_random_max)
    if (min !== null && max !== null) return `${formatPrice(min)}~${formatPrice(max)}`
    if (min !== null) return formatPrice(min)
  }
  const rate = parseNumber(product?.profit_rate)
  if (rate !== null && rate > 0) return formatPrice(rate)
  return '-'
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
  const key = String(tabs.value?.[activeTab.value]?.key || 'active').toLowerCase()
  if (key === 'inactive') return products.value.filter((p) => isOutOfStock(p))
  return products.value.filter((p) => !isOutOfStock(p))
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

const getProductImage = (product) => {
  const raw = String(product?.image || '').trim()
  const resolved = raw ? resolveImageUrl(raw) : ''
  return resolved || '/assets/image/1ea41e69edf9909600bc1dea02f90a88a2cbf679.png'
}

const buyProduct = (product) => {
  if (!product || !product.id) return
  if (isOutOfStock(product)) return
  router.push(`/products/${product.id}`)
}

const fetchAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    accountInfo.value = resp?.data || null
  } catch (_) {
    accountInfo.value = null
  }
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
  fetchAccountInfo()
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

.app-container {
  font-family: 'Inter', sans-serif;
  max-width: 100%;
  margin: 0 auto;
  background-color: #f8f8f8;
  position: relative;
  min-height: 100vh;
  padding-bottom: 60px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.top-bar-left,
.top-bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.masked-account {
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  letter-spacing: 1px;
}

.icon-sm {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.icon-md {
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
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  border-radius: 8px;
  font-family: inherit;
}

.lang-item:hover {
  background: rgba(33, 77, 243, 0.08);
}

.tabs-container {
  display: flex;
  gap: 24px;
  padding: 8px 24px 16px;
}

.tab {
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding-bottom: 4px;
}

.tab.active {
  color: #000000;
}

.tab.inactive {
  color: #737373;
}

/* Product List */
.product-list-container {
  padding: 8px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: calc(100vh - 100px);
}

.product-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  padding: 16px;
  padding-top: 28px;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #1b46f5;
  color: #ffffff;
  font-size: 9px;
  font-weight: 600;
  padding: 5px 12px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.card-content {
  display: flex;
  gap: 16px;
  align-items: center;
}

.image-wrapper {
  flex: 0 0 130px;
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.info-wrapper {
  flex: 1;
}

.product-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e1e1e;
  margin-top: -10px;
  text-align: center;
  margin-bottom: 12px;
}

.stats-grid {
  display: flex;
  gap: 16px;
}

.stat-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 28px;
}

.stat-label {
  font-size: 10px;
  color: #737373;
}

.stat-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.text-blue {
  color: #2d5eaf;
  font-size: 14px;
  font-weight: 700;
}

.text-sm {
  font-size: 9px;
  color: #737373;
  font-weight: 400;
}

.divider {
  border-top: 1px dashed #e0e0e0;
  margin: 16px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-label {
  font-size: 12px;
  color: #737373;
}

.price-value {
  font-size: 18px;
  font-weight: 700;
  color: #2d5eaf;
}

.btn-buy {
  background: linear-gradient(90deg, #4084e0 0%, #2656b5 100%);
  color: #ffffff;
  border: none;
  border-radius: 15px;
  padding: 8px 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
}

.btn-buy:hover {
  opacity: 0.9;
}

.btn-buy:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}
</style>
