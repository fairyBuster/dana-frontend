<template>
  <div class="app-container">
    <LoadingSpinner :visible="isLoading" :overlay="true" />

    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <div class="header-left">
          <button class="icon-back-btn" aria-label="Go back" @click="goBack">
            <img src="/assets/images/35_176.svg" alt="" class="icon-back">
          </button>
          <h1 class="header-title">Proteksi Saya</h1>
        </div>
        <a class="btn-explore" @click.prevent="goToExplore">
          Jelajah produk lain
          <img src="/assets/images/36_248.svg" alt="" class="icon-arrow-up">
        </a>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-container">
        <h2 class="hero-title">Proteksi Saya</h2>
        <p class="hero-subtitle">Lihat detail aset yang Anda miliki.</p>

        <div class="summary-card">
          <div class="summary-info">
            <p class="summary-label">Total Nilai Aset</p>
            <p class="summary-value">{{ totalAssetDisplay }}</p>
          </div>
          <img src="/assets/images/7210a5369195691e3aa63bd1fb6d8c025d233ccc.png" alt="" class="summary-image">
        </div>
      </div>
    </section>

    <!-- Asset List -->
    <section id="section-asset-list">
      <div class="asset-list-container">
        <h3 class="section-title">Daftar Aset Saya</h3>

        <div v-if="!isLoading && investments.length === 0" class="empty-state">
          <img src="/assets/images/empty.jpg" alt="" class="empty-icon">
          <p class="empty-text">Belum ada aset proteksi.</p>
        </div>

        <div v-for="inv in investments" :key="inv.id" class="asset-card">
          <div class="ac-image">
            <img :src="getProductImage(inv)" alt="" class="ac-product-img" @error="onImageError">
          </div>
          <div class="ac-info">
            <h4 class="product-name">{{ inv.product_name || 'Produk' }}</h4>
            <p class="product-category">{{ inv.product_golongan || 'Proteksi' }}</p>
          </div>
          <div class="ac-top-right">
            <div class="status-badge" :class="getStatusBadgeClass(inv)">
              <img :src="getStatusIcon(inv)" alt="">
              <span>{{ getStatusText(inv) }}</span>
            </div>
            <button class="icon-expand-btn" @click="openInvestmentDetails(inv)">
              <img :src="getExpandIcon(inv)" alt="" class="icon-expand">
            </button>
          </div>
          <div class="ac-daily">
            Nilai aset harian: <strong>{{ formatCurrency(inv.daily_profit) }}</strong>
          </div>
          <div class="ac-period">
            <img :src="getClockIcon(inv)" alt="" class="period-clock">
            <span>Periode: {{ getDurationDays(inv) }} hari</span>
          </div>
          <div class="ac-desc">{{ inv.product_specification || 'Proteksi aset' }}</div>
          <div class="ac-dates">
            Mulai kontrak: {{ formatDate(inv.created_at || inv.start_date) }}<br>
            Kontrak Selesai: {{ formatDate(inv.expires_at) }}
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer">
      <div class="footer-badges">
        <div class="summary-badge badge-funds-active">
          <img src="/assets/images/552b9c2c92e8ecd90fce0a7240313cf5e1b429da.png" alt="">
          <span>Dana aktif: {{ activeCount }}</span>
        </div>
        <div class="summary-badge badge-funds-completed">
          <img src="/assets/images/4eb13057902734a11ebe69cff84520cbba91cfbf.png" alt="">
          <span>Dana selesai: {{ completedCount }}</span>
        </div>
      </div>
      <img src="/assets/images/4eb13057902734a11ebe69cff84520cbba91cfbf.png" alt="" class="bg-shield-watermark">
    </section>
  </div>

  <FooterBar />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { ref, computed, onActivated, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { resolveImageUrl } from '@/utils/imageCache'
import FooterBar from '@/components/partials/AppFooter.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import { investmentAPI } from '@/services/api'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()

const isLoading = ref(false)
const investments = ref([])
const showErrorModal = ref(false)
const errorMessage = ref('')

const goBack = () => {
  router.push('/hn/home')
}

const goToExplore = () => {
  router.push('/shop')
}

const normalizeResponse = (data) => {
  if (!data) return { results: [], next: null }
  if (Array.isArray(data)) return { results: data, next: null }
  if (Array.isArray(data.results)) return { results: data.results, next: data.next || null }
  return { results: [], next: null }
}

const fetchInvestments = async () => {
  if (isLoading.value) return
  isLoading.value = true
  showErrorModal.value = false
  try {
    let page = 1
    const all = []
    let hasNext = true
    while (hasNext && page <= 50) {
      const resp = await investmentAPI.getInvestments({ page })
      const parsed = normalizeResponse(resp?.data)
      all.push(...parsed.results)
      hasNext = Boolean(parsed.next) && parsed.results.length > 0
      page += 1
    }
    investments.value = all
  } catch (err) {
    investments.value = []
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal memuat data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal memuat data'
}

const activeCount = computed(() => {
  return investments.value.filter((inv) => {
    const s = String(inv?.status || '').toUpperCase()
    return s === 'ACTIVE'
  }).length
})

const completedCount = computed(() => {
  return investments.value.filter((inv) => {
    const s = String(inv?.status || '').toUpperCase()
    return s === 'COMPLETED' || s === 'EXPIRED'
  }).length
})

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const raw = String(value).trim()
  if (!raw) return 0
  let s = raw.replace(/\s+/g, '').replace(/[^0-9,.-]/g, '')
  const dots = (s.match(/\./g) || []).length
  const commas = (s.match(/,/g) || []).length
  if (dots > 0 && commas > 0) {
    const lastDot = s.lastIndexOf('.')
    const lastComma = s.lastIndexOf(',')
    const decimalSep = lastDot > lastComma ? '.' : ','
    const groupSep = decimalSep === '.' ? ',' : '.'
    s = s.split(groupSep).join('')
    if (decimalSep === ',') s = s.replace(',', '.')
  } else if (dots > 1) {
    s = s.split('.').join('')
  } else if (commas > 1) {
    s = s.split(',').join('')
  } else if (commas === 1 && dots === 0) {
    const idx = s.indexOf(',')
    const digitsAfter = s.length - idx - 1
    if (digitsAfter === 3) s = s.replace(',', '')
    else s = s.replace(',', '.')
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value) => {
  const num = parseNumber(value)
  return formatAppCurrency(num, {
    symbol: 'Rp',
    symbol_position: 'prefix',
    symbol_space: true,
    thousand_sep: '.',
    decimal_sep: ',',
    decimals: 0
  })
}

const totalAssetDisplay = computed(() => {
  const total = investments.value.reduce((sum, inv) => {
    return sum + parseNumber(inv.total_amount || inv.product_price || 0)
  }, 0)
  return formatCurrency(total)
})

const pad2 = (n) => String(n).padStart(2, '0')

const formatDate = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

const getDurationDays = (inv) => {
  return Number(inv?.duration_days || 0)
}

const isActive = (inv) => {
  const s = String(inv?.status || '').toUpperCase()
  return s === 'ACTIVE'
}

const getStatusBadgeClass = (inv) => {
  return isActive(inv) ? 'badge-active' : 'badge-completed'
}

const getStatusText = (inv) => {
  return isActive(inv) ? 'Berjalan' : 'Selesai'
}

const getStatusIcon = (inv) => {
  return isActive(inv)
    ? '/assets/images/36_208.svg'
    : '/assets/images/36_244.svg'
}

const getExpandIcon = (inv) => {
  return isActive(inv)
    ? '/assets/images/36_200.svg'
    : '/assets/images/36_229.svg'
}

const getClockIcon = (inv) => {
  return isActive(inv)
    ? '/assets/images/36_212.svg'
    : '/assets/images/36_237.svg'
}

const fallbackImage = '/assets/images/7210a5369195691e3aa63bd1fb6d8c025d233ccc.png'

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
  if (el && el.src && !el.src.includes('7210a5369195691e3aa63bd1fb6d8c025d233ccc')) {
    el.src = fallbackImage
  }
}

const openInvestmentDetails = (inv) => {
  if (!inv) return
  router.push('/hn/hall/outputhall/history')
}

onMounted(() => {
  fetchInvestments()
})

onActivated(() => {
  fetchInvestments()
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
  background-color: #fdfaf4;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

p, h1, h2, h3, h4 {
  margin: 0;
}

/* Header */
#section-header {
  padding: 24px 22px 16px;
  position: relative;
  z-index: 10;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.btn-explore {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(90deg, #c8971d 0%, #d49a0d 47%, #dba30a 100%);
  padding: 4px 8px 4px 12px;
  border-radius: 12px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-decoration: none;
}

.icon-arrow-up {
  width: 16px;
  height: 16px;
}

/* Hero */
#section-hero {
  padding: 8px 22px 24px;
  position: relative;
  z-index: 10;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
}

.hero-subtitle {
  font-size: 14px;
  color: #635f5f;
  margin-bottom: 24px;
}

.summary-card {
  background: linear-gradient(90deg, #f2c040 0%, #f8dc87 47%, #f5ca4f 100%);
  border-radius: 10px;
  padding: 20px;
  height: 102px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.summary-label {
  color: #ffffff;
  font-size: 12px;
  margin-bottom: 4px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.summary-value {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.summary-image {
  position: absolute;
  right: 5px;
  top: -35px;
  width: 142px;
  height: auto;
  max-height: 140px;
  object-fit: contain;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

/* Asset List */
#section-asset-list {
  padding: 0 22px 24px;
  position: relative;
  z-index: 10;
  flex: 1;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16px;
}

.asset-card {
  display: grid;
  grid-template-columns: 57px 1fr auto;
  gap: 10px 12px;
  padding: 14px;
  background-color: #fefffe;
  border-radius: 10px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.ac-image {
  grid-column: 1;
  grid-row: 1;
  width: 57px;
  height: 70px;
  background-color: #fef7e3;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ac-product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.ac-info {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 2px;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 2px;
}

.product-category {
  font-size: 11px;
  color: #818181;
}

.ac-top-right {
  grid-column: 3;
  grid-row: 1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-top: 2px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 500;
}

.status-badge img {
  width: 10px;
  height: 10px;
}

.badge-active {
  background-color: #e9f2fe;
  color: #0f32be;
}

.badge-completed {
  background-color: #d9d9d9;
  color: #575757;
}

.icon-expand-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.icon-expand {
  width: 18px;
  height: 18px;
}

.ac-daily {
  grid-column: 2;
  grid-row: 2;
  font-size: 12px;
  color: #000000;
  align-self: center;
}

.ac-period {
  grid-column: 3;
  grid-row: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 11px;
  color: #818181;
}

.period-clock {
  width: 10px;
  height: 10px;
}

.ac-desc {
  grid-column: 1 / span 2;
  grid-row: 3;
  font-size: 11px;
  color: #818181;
  align-self: end;
  margin-top: 4px;
}

.ac-dates {
  grid-column: 2 / span 2;
  grid-row: 3;
  font-size: 10px;
  color: #000000;
  text-align: right;
  line-height: 1.4;
  margin-top: 4px;
}

/* Footer */
#section-footer {
  padding: 0 22px 40px;
  position: relative;
}

.footer-badges {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 10;
}

.summary-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.summary-badge img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.badge-funds-active {
  background-color: #e1ebe5;
  color: #008332;
}

.badge-funds-completed {
  background-color: #e6e6e6;
  color: #212121;
}

.bg-shield-watermark {
  position: absolute;
  bottom: -30px;
  right: -60px;
  width: 256px;
  height: 256px;
  opacity: 0.4;
  z-index: 0;
  pointer-events: none;
}

/* Empty State */
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
  color: #7d7d7d;
  font-size: 14px;
}
</style>
