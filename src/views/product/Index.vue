<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <div class="header-container">
        <div class="filter-row">
          <div class="filter-label">Saring</div>
          
          <div class="filter-group">
            <span class="filter-label">Harga</span>
            <div class="sort-arrows">
              <img src="/assets/image/114_584.svg" alt="Sort Up" class="arrow-up" @click="setSort('price', 'asc')">
              <img src="/assets/image/113_552.svg" alt="Sort Down" class="arrow-down" @click="setSort('price', 'desc')">
            </div>
          </div>

          <div class="filter-group">
            <span class="filter-label">Hari melayani</span>
            <div class="sort-arrows">
              <img src="/assets/image/114_592.svg" alt="Sort Up" class="arrow-up" @click="setSort('duration', 'asc')">
              <img src="/assets/image/114_591.svg" alt="Sort Down" class="arrow-down" @click="setSort('duration', 'desc')">
            </div>
          </div>

          <button class="filter-open-btn" type="button" @click="openFilterModal">
            <span>Filter</span>
            <img src="/assets/image/Icon.png" alt="Filter" class="filter-open-icon">
          </button>
        </div>

        <div class="dropdown-area">
          <button class="dropdown-btn" type="button" @click.stop="openAreaModal">
            <img src="/assets/image/114_581.svg" alt="Icon" class="dropdown-icon">
            <span>{{ selectedArea }}</span>
          </button>
        </div>
      </div>
    </section>

    <teleport to="body">
      <div v-if="areaModalOpen" class="area-selector-overlay" @click.self="cancelArea">
        <section id="area-selector-section">
          <div class="area-mobile-container">
            <div class="area-bottom-sheet">
              <header class="area-sheet-header">
                <button type="button" class="area-sheet-action" @click="cancelArea">Membatalkan</button>
                <div class="area-sheet-spacer"></div>
                <button type="button" class="area-sheet-action area-sheet-action--primary" @click="confirmArea">Tentu</button>
              </header>

              <div class="area-picker-wrapper">
                <div class="area-picker-indicator"></div>
                <div ref="areaPickerEl" class="area-picker" @scroll="onAreaScroll">
                  <ul class="area-picker-list">
                    <li v-for="(opt, idx) in areaOptions" :key="opt" class="area-picker-row">
                      <button
                        type="button"
                        class="area-picker-item"
                        :class="{ active: tempSelectedArea === opt }"
                        @click="selectAreaAndScroll(idx)"
                      >
                        {{ opt }}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="filterModalOpen" class="filter-modal-overlay" @click="closeFilterModal">
        <div class="filter-modal" @click.stop>
         

          <div class="filter-modal-body">
            <div class="filter-block">
              <div class="filter-block-title">Kisaran harga sewa drone ({{ priceFilterCount }})</div>
              <input
                v-model.number="priceValue"
                type="range"
                class="range-input"
                :min="PRICE_MIN"
                :max="PRICE_MAX"
                :step="1000000"
              >
              <div class="range-scale">
                <span>{{ formatNumber(PRICE_MIN) }}</span>
                <span class="range-current">{{ formatNumber(priceValue) }}</span>
                <span>{{ formatNumber(PRICE_MAX) }}</span>
              </div>
            </div>

            <div class="filter-block">
              <div class="filter-block-title">Hari pelayanan ({{ dayFilterCount }})</div>
              <input
                v-model.number="dayValue"
                type="range"
                class="range-input"
                :min="DAY_MIN"
                :max="DAY_MAX"
                :step="1"
              >
              <div class="range-scale">
                <span>{{ DAY_MIN }}</span>
                <span class="range-current">{{ dayValue }}</span>
                <span>{{ DAY_MAX }}</span>
              </div>
            </div>
          </div>

          <div class="filter-modal-actions">
            <button type="button" class="btn-reset" @click="resetFilters">Mengatur ulang</button>
            <button type="button" class="btn-ok" @click="applyFilters">OK</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Product List Section -->
    <section id="section-product-list">
      <!-- Product Item 1 -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <img src="/assets/image/empty.png" alt="No Data" class="empty-icon" @error="onEmptyError">
      </div>

      <template v-else v-for="(product, idx) in filteredProducts" :key="product.id">
        <div class="product-card">
          <div class="product-info">
            <div class="product-header">
              <h3 class="product-title">{{ product.name || '-' }}</h3>
              <div class="badge-pro">
                <span>{{product.description || '-'}}</span>
              </div>
            </div>
            
            <div class="product-tags">
              <div class="tag">
                <span>{{ formatProfitTag(product) }}</span>
              </div>
              <div class="tag">
                <span>{{ product.specifications || `Melayani hingga ${product.duration ?? '-'}D` }}</span>
              </div>
            </div>

            <div class="product-price">{{ formatCurrencyRp(product.price) }}</div>
          </div>

          <div class="product-action">
            <div class="product-image-wrapper">
              <img :src="getProductImage(product)" :alt="product.name || 'Product'" class="product-img" @error="onImageError">
            </div>
            <div v-if="isOutOfStock(product)" class="btn-lock">
              <img src="/assets/image/Lock.png" alt="Locked" class="lock-icon">
            </div>
            <button v-else class="btn-buy" type="button" @click="buyProduct(product)">Membeli</button>
          </div>
        </div>
        <div v-if="idx !== filteredProducts.length - 1" class="separator"></div>
      </template>
    </section>

    <!-- Footer Section -->
    <FooterBar />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { productAPI } from '@/services/api'
import { resolveImageUrl } from '@/utils/imageCache'
import FooterBar from '@/components/partials/FooterBar.vue'

const router = useRouter()

const filterModalOpen = ref(false)
const areaModalOpen = ref(false)
const selectedArea = ref('Area A1')
const tempSelectedArea = ref(selectedArea.value)
const areaOptions = ref(['Area A1', 'Area A2', 'Area A3'])
const areaPickerEl = ref(null)
const activeAreaIndex = ref(0)
const areaRowHeight = 36
let areaRafId = 0

const PRICE_MIN = 0
const PRICE_MAX = 150000000
const DEFAULT_PRICE = 50000000
const DAY_MIN = 0
const DAY_MAX = 365
const DEFAULT_DAY = 150

const priceValue = ref(DEFAULT_PRICE)
const dayValue = ref(DEFAULT_DAY)

const products = ref([])
const sortBy = ref('price')
const sortDir = ref('asc')

const openFilterModal = () => {
  filterModalOpen.value = true
}
const closeFilterModal = () => {
  filterModalOpen.value = false
}
const resetFilters = () => {
  priceValue.value = DEFAULT_PRICE
  dayValue.value = DEFAULT_DAY
  fetchProducts()
}
const applyFilters = () => {
  filterModalOpen.value = false
  fetchProducts()
}

const priceFilterCount = computed(() => (priceValue.value === DEFAULT_PRICE ? 0 : 1))
const dayFilterCount = computed(() => (dayValue.value === DEFAULT_DAY ? 0 : 1))

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(n)) return null
  return n
}

const formatCurrencyRp = (value) => {
  const n = parseNumber(value)
  if (n === null) return 'RP -'
  return `RP ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)}`
}

const isOutOfStock = (product) => {
  const stock = parseNumber(product?.stock)
  return stock !== null && stock <= 0
}

const formatProfitTag = (product) => {
  const profitType = String(product?.profit_type || '').toLowerCase()
  if (profitType === 'random') {
    const min = parseNumber(product?.profit_random_min)
    const max = parseNumber(product?.profit_random_max)
    if (min !== null && max !== null) return `RP ${formatNumber(min)}~${formatNumber(max)}`
    if (min !== null) return `RP ${formatNumber(min)}~${formatNumber(min)}`
  }
  const rate = parseNumber(product?.profit_rate)
  if (rate !== null && rate > 0) return `RP ${formatNumber(rate)}`
  return 'RP -'
}

const fallbackImage = '/assets/image/27c56f86fe1c8990e4a0be8a57a8835a3a1bc1b9.png'
const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
const getProductImage = (product) => {
  const raw = String(product?.image || '').trim()
  if (!raw) return fallbackImage
  return resolveImageUrl(raw)
}

const onImageError = (e) => {
  const el = e?.target
  if (!el || !el.src) return
  const src = String(el.src)
  if (!src.includes(fallbackImage)) {
    el.src = fallbackImage
    return
  }
  el.alt = ''
  el.src = transparentPixel
  el.style.opacity = '0'
}

const fallbackEmptyImage = '/assets/images/34646.png'
const onEmptyError = (e) => {
  const el = e?.target
  if (el && el.src && !String(el.src).includes(fallbackEmptyImage)) {
    el.src = fallbackEmptyImage
  }
}

const openAreaModal = () => {
  tempSelectedArea.value = selectedArea.value
  areaModalOpen.value = true
  nextTick(() => {
    const idx = Math.max(0, areaOptions.value.findIndex((v) => v === tempSelectedArea.value))
    activeAreaIndex.value = idx >= 0 ? idx : 0
    const el = areaPickerEl.value
    if (!el) return
    el.scrollTo({ top: activeAreaIndex.value * areaRowHeight, behavior: 'auto' })
  })
}

const cancelArea = () => {
  areaModalOpen.value = false
}

const confirmArea = () => {
  selectedArea.value = tempSelectedArea.value
  areaModalOpen.value = false
}

const syncAreaFromScroll = () => {
  const el = areaPickerEl.value
  if (!el) return
  const list = areaOptions.value
  if (!list.length) return
  const idx = Math.min(Math.max(Math.round(el.scrollTop / areaRowHeight), 0), list.length - 1)
  activeAreaIndex.value = idx
  tempSelectedArea.value = list[idx]
}

const onAreaScroll = () => {
  if (areaRafId) return
  areaRafId = window.requestAnimationFrame(() => {
    areaRafId = 0
    syncAreaFromScroll()
  })
}

const selectAreaAndScroll = (idx) => {
  const list = areaOptions.value
  const next = list[idx]
  if (!next) return
  tempSelectedArea.value = next
  activeAreaIndex.value = idx
  const el = areaPickerEl.value
  if (!el) return
  el.scrollTo({ top: idx * areaRowHeight, behavior: 'smooth' })
}

const setBodyScrollLocked = (locked) => {
  const body = document?.body
  if (!body) return
  body.style.overflow = locked ? 'hidden' : ''
  body.style.touchAction = locked ? 'none' : ''
}

watch(
  () => [filterModalOpen.value, areaModalOpen.value],
  ([isFilterOpen, isAreaOpen]) => {
    setBodyScrollLocked(!!(isFilterOpen || isAreaOpen))
  },
  { immediate: true }
)

const normalizeProductsResponse = (data) => {
  if (!data) return { count: null, results: [] }
  if (Array.isArray(data)) return { count: data.length, results: data }
  if (Array.isArray(data.results)) return { count: Number(data.count ?? null), results: data.results }
  return { count: null, results: [] }
}

const buildProductQuery = () => {
  const params = { page: 1 }
  if (priceValue.value !== DEFAULT_PRICE) params.max_price = priceValue.value
  if (dayValue.value !== DEFAULT_DAY) params.max_duration = dayValue.value
  return params
}

const fetchProducts = async () => {
  try {
    const baseParams = buildProductQuery()
    const first = await productAPI.getProducts(baseParams)
    const parsedFirst = normalizeProductsResponse(first?.data)
    const all = [...parsedFirst.results]
    const total = parsedFirst.count

    if (total !== null && all.length >= total) {
      products.value = all
      return
    }

    for (let page = 2; page <= 20; page += 1) {
      const resp = await productAPI.getProducts({ ...baseParams, page })
      const parsed = normalizeProductsResponse(resp?.data)
      if (!parsed.results.length) break
      all.push(...parsed.results)
      if (total !== null && all.length >= total) break
    }

    products.value = all
    const golongans = Array.from(
      new Set(
        all
          .map((p) => String(p?.golongan || '').trim())
          .filter((g) => g && g !== '-' && g.toLowerCase() !== 'null')
      )
    ).sort((a, b) => a.localeCompare(b))
    areaOptions.value = golongans.length ? golongans.map((g) => `Area ${g}`) : ['Area A1', 'Area A2', 'Area A3']
    if (!areaOptions.value.includes(selectedArea.value)) {
      selectedArea.value = areaOptions.value[0]
    }
    tempSelectedArea.value = selectedArea.value
  } catch (_) {
    products.value = []
    areaOptions.value = ['Area A1', 'Area A2', 'Area A3']
    selectedArea.value = 'Area A1'
    tempSelectedArea.value = selectedArea.value
  }
}

const filteredProducts = computed(() => {
  const selectedGolongan = String(selectedArea.value || '')
    .replace(/^Area\s+/i, '')
    .trim()
    .toUpperCase()

  const arr = [...products.value].filter((p) => {
    const g = String(p?.golongan || '').trim().toUpperCase()
    if (!selectedGolongan) return true
    return g === selectedGolongan
  })
  const field = sortBy.value
  const dir = sortDir.value
  if (!field) return arr

  const sign = dir === 'desc' ? -1 : 1
  arr.sort((a, b) => {
    const av = parseNumber(a?.[field]) ?? 0
    const bv = parseNumber(b?.[field]) ?? 0
    if (av < bv) return -1 * sign
    if (av > bv) return 1 * sign
    return 0
  })
  return arr
})

const buyProduct = (product) => {
  if (!product || !product.id) return
  router.push(`/pages/account/products/${product.id}`)
}

const setSort = (field, dir) => {
  sortBy.value = field
  sortDir.value = dir
}

const onKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (areaModalOpen.value) {
      cancelArea()
      return
    }
    closeFilterModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  fetchProducts()
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
  setBodyScrollLocked(false)
  if (areaRafId) window.cancelAnimationFrame(areaRafId)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0b0b15;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.app-container {
  --primary-purple: #746a9a;
  --text-white: #ffffff;
  --text-grey: #c4c4c4;
  --bg-dark: #1d2138;
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  overflow-x: hidden;
  padding-bottom: 140px;
  display: flex;
  flex-direction: column;
}

img {
  display: block;
  max-width: 100%;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

/* Header Section */
#section-header {
  padding: 20px 18px 10px;
}

.header-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.filter-label {
  font-size: 14px;
  color: var(--text-white);
}

.filter-group .filter-label {
  color: var(--text-grey);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.sort-arrows {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 15px;
}

.arrow-up {
  margin-bottom: -10px;
}

.filter-open-btn {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-grey);
}

.filter-open-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.filter-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 999;
}

.area-selector-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 1050;
  display: flex;
  align-items: flex-end;
}

#area-selector-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.area-mobile-container {
  width: 100%;
  max-width: 412px;
  height: 40vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.area-bottom-sheet {
  background: linear-gradient(180deg, #1a1f3a 0%, #0b0d1e 100%);
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.area-sheet-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.02);
}

.area-sheet-spacer {
  flex: 1;
}

.area-sheet-action {
  background: transparent;
  border: none;
  padding: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
}

.area-sheet-action--primary {
  color: rgba(255, 255, 255, 0.95);
}

.area-picker-wrapper {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.area-picker {
  width: 100%;
  height: 168px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
}

.area-picker::-webkit-scrollbar {
  display: none;
}

.area-picker-list {
  list-style: none;
  margin: 0;
  padding: 66px 0;
}

.area-picker-row {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
}

.area-picker-item {
  width: 100%;
  max-width: 260px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  line-height: 18px;
  opacity: 0.35;
  transition: opacity 0.12s ease, color 0.12s ease;
}

.area-picker-item.active {
  opacity: 1;
  color: rgba(255, 255, 255, 1);
}

.area-picker-indicator {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 36px;
  transform: translateY(-50%);
  border-top: 0.5px solid rgba(255, 255, 255, 0.5);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.filter-modal {
  position: fixed;
  left: 50%;
  top: 10px;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  background: #1d2138;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 14px 14px 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
}

.filter-modal-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.filter-tabs {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

.tab.active {
  color: #ffffff;
}

.filter-modal-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255,255,255,0.75);
}

.filter-modal-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.filter-modal-body {
  padding: 14px 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.filter-block-title {
  font-size: 10px;
  color: rgba(255,255,255,0.75);
  margin-bottom: 8px;
}

.range-input {
  width: 100%;
}

.range-scale {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: rgba(255,255,255,0.55);
  margin-top: 6px;
}

.range-current {
  color: #ffffff;
}

.filter-modal-actions {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.btn-reset {
  flex: 1;
  height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.75);
  font-size: 12px;
}

.btn-ok {
  flex: 1;
  height: 36px;
  border-radius: 8px;
  background: rgba(144,71,224,0.85);
  color: #ffffff;
  font-size: 12px;
}

.dropdown-area {
  margin-top: 5px;
}

.dropdown-btn {
  display: flex;
  align-items: center;
  gap: 2px;
  background-color: var(--bg-dark);
  border: 1px solid var(--primary-purple);
  border-radius: 2px;
  padding: 4px 10px;
  color: var(--text-white);
  font-size: 14px;
  height: 26px;
}

.dropdown-icon {
  width: 24px;
  height: 24px;
}

/* Product List Section */
#section-product-list {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.empty-state {
  display: flex;
  justify-content: center;
  padding: 40px 0 10px;
}

.empty-icon {
  width: 210px;
  height: auto;
  opacity: 0.9;
}

.product-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-info {
  flex: 1;
  padding-right: 10px;
}

.product-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.product-title {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-white);
}

.badge-pro {
  background: linear-gradient(90deg, #3f48c5 0%, #6133c4 30%, #9047e0 100%);
  border: 1px solid var(--primary-purple);
  border-radius: 10px;
  padding: 0 8px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-pro span {
  font-size: 10px;
  color: var(--text-white);
  line-height: 1;
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  background-color: var(--bg-dark);
  border: 1px solid var(--primary-purple);
  border-radius: 2px;
  padding: 2px 8px;
  height: 17px;
  display: flex;
  align-items: center;
}

.tag span {
  font-size: 10px;
  color: var(--text-white);
}

.product-price {
  font-size: 14px;
  color: var(--text-white);
  font-weight: 600;
}

.product-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  width: 90px;
  flex-shrink: 0;
}

.product-image-wrapper {
  width: 87px;
  height: 58px;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-buy {
  background-color: var(--primary-purple);
  color: var(--text-white);
  border: none;
  border-radius: 15px;
  height: 23px;
  padding: 0 15px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 87px;
}

.btn-lock {
  width: 87px;
  height: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-icon {
  width: auto;
  height: 23px;
  display: block;
  object-fit: contain;
}

.separator {
  height: 1px;
  background-color: var(--primary-purple);
  opacity: 0.5;
  width: 100%;
  margin-top: 5px;
}

/* Footer Section */
#section-footer {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100%;
  max-width: 412px;
  z-index: 20;
  padding: 20px 16px 30px;
  background-color: rgba(29, 33, 56, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-desc {
  color: var(--text-grey);
  font-size: 10px;
  margin: 0 0 5px 0;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-wrapper {
  width: 90px;
  height: 37px;
  position: relative;
  overflow: hidden;
}

.footer-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: left center;
}

.copyright {
  color: var(--text-white);
  font-size: 10px;
}
</style>
