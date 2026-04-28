<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <h1 class="page-title">Semua Aset TRIVEX</h1>
      <div v-if="tabs.length" class="tabs">
        <button
          v-for="(tab, idx) in tabs"
          :key="idx"
          :class="['tab', { active: activeTab === idx }]"
          @click="setActiveTab(idx)"
        >
          {{ tab.label }}
        </button>
      </div>
    </section>

    <!-- Product List Section -->
    <section id="section-product-list">
      <div v-if="sortedProducts.length === 0" class="empty-state">
        <p class="empty-text">Belum ada produk tersedia</p>
      </div>

      <div
        v-for="product in sortedProducts"
        :key="product.id"
        class="product-card"
        @click="buyProduct(product)"
      >
        <div class="card-badge-top">{{ product.golongan || 'Deskripsi produk' }}</div>
        <div v-if="!isOutOfStock(product)" class="card-badge-stock">Stok tersedia</div>
        <div v-else class="card-badge-stock out-of-stock">Stok habis</div>

        <div class="card-header">
          <img :src="getProductImage(product)" :alt="product.name || 'Produk'" class="card-icon" loading="lazy" decoding="async">
          <div class="card-title-group">
            <h3 class="card-title">{{ product.name || '-' }}</h3>
            <p class="card-subtitle">{{ product.specifications || 'Spesifikasi produk' }}</p>
          </div>
        </div>

        <hr class="card-divider">

        <div class="card-data">
          <div class="data-col">
            <span class="data-label">Pengembalian</span>
            <span class="data-value">{{ formatProfitValue(product) }}</span>
          </div>
          <div class="data-col">
            <span class="data-label">Harga Beli</span>
            <span class="data-value">{{ formatPrice(product.price) }}</span>
          </div>
          <div class="data-col">
            <span class="data-label">Jatuh tempo</span>
            <span class="data-value">{{ product.duration ? `${product.duration} Hari` : '-' }}</span>
          </div>
        </div>

        <button
          v-if="isOutOfStock(product)"
          type="button"
          class="locked-btn"
          disabled
          @click.stop
        >
          Terkunci
        </button>

        <div :class="['card-footer', getFooterClass(product)]">
          <img src="/assets/images/35ed8a5c43a27ff17d6503af204e87e6abe95fc5.png" alt="Check" class="footer-icon">
          <span class="footer-text">{{ product.description ? product.description : 'Cocok untuk investor di ' + activeTabLabel }}</span>
        </div>
      </div>
    </section>

    <FooterBar />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { productAPI } from '@/services/api'
import FooterBar from '@/components/partials/FooterBar.vue'
import { resolveImageUrl } from '@/utils/imageCache'

const router = useRouter()

const products = ref([])
const activeTab = ref(0)
const tabs = ref([])

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(n)) return null
  return n
}

const formatPrice = (value) => {
  const n = parseNumber(value)
  if (n === null) return '-'
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
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
  const tab = tabs.value?.[activeTab.value] || null
  const gol = String(tab?.golongan || '').trim()
  if (!gol) return products.value
  return products.value.filter((p) => String(p?.golongan || '').trim() === gol)
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

const activeTabLabel = computed(() => {
  const label = tabs.value?.[activeTab.value]?.label
  return label || 'Semua'
})

const setActiveTab = (idx) => {
  const n = Number(idx)
  if (!Number.isFinite(n)) return
  activeTab.value = Math.max(0, Math.min(tabs.value.length - 1, n))
}

const getProductImage = (product) => {
  const raw = String(product?.image || '').trim()
  const resolved = raw ? resolveImageUrl(raw) : ''
  return resolved || '/assets/images/d8ec3d5fc11c15ebc75de9b67990d7f0d2d8eb0b.png'
}

const getFooterClass = (product) => {
  const gol = String(product?.golongan || '').trim()
  if (gol === 'Seri Pertumbuhan') return 'footer-pertumbuhan'
  if (gol === 'Seri Cepat') return 'footer-cepat'
  if (gol === 'Seri Promo') return 'footer-promo'
  return ''
}

const buyProduct = (product) => {
  if (!product || !product.id) return
  if (isOutOfStock(product)) return
  router.push(`/products/${product.id}`)
}

const fetchProducts = async () => {
  try {
    const first = await productAPI.getProducts({ page: 1 })
    const parsedFirst = normalizeProductsResponse(first?.data)
    const all = [...parsedFirst.results]
    const total = parsedFirst.count

    if (total !== null && all.length >= total) {
      products.value = all
      buildTabs(all)
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
    buildTabs(all)
  } catch (_) {
    products.value = []
    tabs.value = []
    activeTab.value = 0
  }
}

const buildTabs = (all) => {
  const golongans = Array.from(
    new Set(
      all
        .map((p) => String(p?.golongan || '').trim())
        .filter((g) => g && g !== '-' && g.toLowerCase() !== 'null')
    )
  )

  const preferredOrder = ['Seri Pertumbuhan', 'Seri Cepat', 'Seri Promo']
  const ordered = preferredOrder.filter((g) => golongans.includes(g))
  if (!ordered.length) {
    golongans.sort((a, b) => a.localeCompare(b))
    ordered.push(...golongans)
  }

  tabs.value = ordered.map((g) => ({
    label: g,
    golongan: g
  }))
  activeTab.value = 0
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  position: relative;
  min-height: 100vh;
  padding-bottom: 60px;
  margin: 0 auto;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

a {
  text-decoration: none;
}

/* Header Section */
#section-header {
  padding: 24px 16px;
  background-color: #f8f8f8;
}

.page-title {
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 20px 0;
}

.tabs {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.tab {
  flex: 1;
  padding: 8px 0;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  border: 1px solid #004d43;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  font-family: inherit;
}

.tab.active {
  background-color: #004d43;
  color: #ffffff;
  border-color: #004d43;
}

/* Product List Section */
#section-product-list {
  padding: 0 16px 24px;
}

.product-card {
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.card-badge-top {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #004d43;
  color: #ffffff;
  font-size: 10px;
  padding: 4px 12px;
  border-bottom-left-radius: 8px;
  font-weight: 600;
}

.card-badge-stock {
  position: absolute;
  top: 32px;
  right: 12px;
  background-color: #fcf1e9;
  color: #de6f00;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.card-badge-stock.out-of-stock {
  background-color: #f0f0f0;
  color: #999999;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  margin-right: 12px;
  object-fit: contain;
}

.card-title-group {
  flex: 1;
  padding-right: 80px;
}

.card-title {
  color: #004d43;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}

.card-subtitle {
  color: #000000;
  font-size: 10px;
}

.card-divider {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0 16px;
}

.card-data {
  display: flex;
  justify-content: space-between;
  padding: 16px;
}

.locked-btn {
  position: absolute;
  left: 50%;
  top: 62%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 32px;
  border: none;
  border-radius: 18px;
  background-color: #1a1a1a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  opacity: 0.85;
  pointer-events: none;
}

.data-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.data-label {
  color: rgba(0, 0, 0, 0.5);
  font-size: 10px;
}

.data-value {
  color: #000000;
  font-size: 14px;
  font-weight: 700;
}

.card-footer {
  background-color: rgba(76, 164, 85, 0.2);
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-footer.footer-pertumbuhan {
  background-color: #4CA45533;
}

.card-footer.footer-cepat {
  background-color: #4C5FA433;
}

.card-footer.footer-promo {
  background-color: #A44C4C33;
}

.footer-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.footer-text {
  color: #000000;
  font-size: 10px;
  font-weight: 500;
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


