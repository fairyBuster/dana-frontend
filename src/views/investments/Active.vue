<template>
  <div class="app-container">
    <LoadingSpinner :visible="isLoading" :overlay="true" message="Memuat data..." />

    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <button class="back-btn" @click="goBack">
          <img src="/assets/images/18_219.svg" alt="Back">
        </button>
        <h1 class="page-title">Portofolio saya</h1>
      </header>
    </section>

    <!-- Tabs -->
    <section id="section-tabs">
      <div class="tabs-container">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </section>

    <!-- Filter -->
    <section id="section-filter">
      <div class="filter-container">
        <p class="filter-label">Pilih status aset saya</p>
        <div class="filter-buttons">
          <button
            class="filter-btn"
            :class="{ active: activeFilter === 'ACTIVE' }"
            @click="activeFilter = 'ACTIVE'"
          >
            Aktif
          </button>
          <button
            class="filter-btn"
            :class="{ active: activeFilter === 'EXPIRED' }"
            @click="activeFilter = 'EXPIRED'"
          >
            Berakhir
          </button>
        </div>
      </div>
    </section>

    <!-- Cards -->
    <section id="section-cards">
      <div v-if="filteredInvestments.length === 0" class="empty-state">
        <p class="empty-text">Belum ada aset</p>
      </div>

      <div v-else class="cards-container">
        <div v-for="inv in filteredInvestments" :key="inv.id" class="portfolio-card">
          <div class="card-inner">
            <div class="card-badge">{{ inv.product_golongan || inv.product_category || 'Deskripsi produk' }}</div>

            <div class="card-header">
              <img :src="getProductImage(inv)" alt="Icon" class="card-icon" @error="onImageError">
              <div class="card-title-area">
                <h3 class="card-title">{{ inv.product_name || '-' }}</h3>
                <p class="card-subtitle">{{ inv.product_specification || inv.specifications || inv.product_spec || 'Spesifikasi produk' }}</p>
              </div>
                 </div>

            <div class="card-section">
              <h4 class="section-title">Hasil yang diharapkan</h4>
              <div class="data-row">
                <div class="data-labels">
                  <p>Pengembalian:</p>
                  <p>Harga Beli:</p>
                  <p>Jatuh Tempo Sejak Pembelian:</p>
                </div>
                <div class="data-values">
                  <p>{{ formatCurrency(inv.daily_profit) }}/24 Jam</p>
                  <p>{{ formatCurrency(inv.total_amount || inv.product_price) }}</p>
                  <p>{{ formatDate(inv.expires_at) }}</p>
                </div>
              </div>
            </div>

            <div class="card-divider"></div>

            <div class="card-section">
              <h4 class="section-title active-title">Hasil Aktual Saat Ini</h4>
              <div class="data-row">
                <div class="data-labels">
                  <p>Total Pengembalian Diterima:</p>
                  <p>Jumlah Hari:</p>
                  <p>Waktu Penerimaan Selanjutnya:</p>
                </div>
                <div class="data-values active-values">
                  <p>{{ formatCurrency(inv.total_claimed_profit) }}</p>
                  <p>{{ getDaysActive(inv) }} Hari</p>
                  <p>{{ formatDate(inv.next_claim_time_calculated || inv.next_claim_time) }}</p>
                </div>
              </div>
            </div>

            <button class="action-btn" @click="openInvestmentDetails(inv)">Periksa Riwayat Transaksi</button>
          </div>
        </div>
      </div>
    </section>
  </div>
  <FooterBar />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { resolveImageUrl } from '@/utils/imageCache'
import FooterBar from '@/components/partials/FooterBar.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import { investmentAPI } from '@/services/api'

const router = useRouter()

const isLoading = ref(false)
const investments = ref([])
const tabs = [
  { key: 'growth', label: 'Seri Pertumbuhan', golongan: 'Seri Pertumbuhan' },
  { key: 'fast', label: 'Seri Cepat', golongan: 'Seri Cepat' },
  { key: 'promo', label: 'Seri Promo', golongan: 'Seri Promo' }
]

const activeTab = ref(tabs[0].key)
const activeFilter = ref('ACTIVE')

const goBack = () => {
  router.go(-1)
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
        status: activeFilter.value,
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
  const statusFiltered = investments.value.filter((inv) => {
    const status = String(inv?.status || '').toUpperCase()
    return status === activeFilter.value
  })

  const tab = tabs.find((t) => t.key === activeTab.value) || tabs[0]
  const gol = String(tab?.golongan || '').trim().toLowerCase()
  if (!gol) return statusFiltered

  return statusFiltered.filter((inv) => {
    const g = String(inv?.product_golongan || '').trim().toLowerCase()
    return g === gol
  })
})

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return 'Rp 0'
  const num = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(num)) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const fallbackImage = '/assets/images/d8ec3d5fc11c15ebc75de9b67990d7f0d2d8eb0b.png'

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
  if (el && el.src && !String(el.src).includes(fallbackImage)) {
    el.src = fallbackImage
  }
}

const openInvestmentDetails = (inv) => {
  if (!inv) return
  const id = inv?.id || inv?.investment_id
  if (!id) return
  router.push(`/portfolio/history`)
}

const getDaysActive = (inv) => {
  const remaining = Number(inv?.remaining_days ?? 0)
  const duration = Number(inv?.duration_days ?? 0)
  if (Number.isFinite(duration) && Number.isFinite(remaining) && duration >= remaining) {
    return duration - remaining
  }
  return 0
}

watch(activeFilter, () => {
  fetchInvestments()
})

onMounted(() => {
  fetchInvestments()
})
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #e0e0e0;
}

.app-container {
  max-width: 412px;
  margin: 0 auto;
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-bottom: 80px;
}

* {
  box-sizing: border-box;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  position: relative;
}

.back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  height: 41px;
}

.back-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.page-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* Tabs */
.tabs-container {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px 20px;
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
  white-space: nowrap;
}

.tab.active {
  background-color: #004d43;
  color: #ffffff;
  border-color: #004d43;
}

/* Filter */
.filter-container {
  padding: 0 16px 20px;
}

.filter-label {
  font-size: 12px;
  color: #004d43;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.filter-buttons {
  display: flex;
  gap: 12px;
}

.filter-btn {
  padding: 6px 24px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.5);
}

.filter-btn.active {
  background-color: transparent;
  color: #004d43;
  border: 1px solid #004d43;
}

/* Cards */
.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.cards-container {
  padding: 0 16px 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.portfolio-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 8px;
}

.card-inner {
  background-color: #f8f8f8;
  border-radius: 16px;
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.card-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #004d43;
  color: #ffffff;
  font-size: 10px;
  padding: 4px 12px;
  border-radius: 0 16px 0 16px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  margin-top: 8px;
}

.card-icon {
  width: 49px;
  height: 49px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
}

.card-title-area {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #004d43;
  margin: 0 0 4px 0;
  font-weight: 700;
}

.card-subtitle {
  font-size: 10px;
  color: #000000;
  margin: 0;
}

.card-fee {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
  margin-top: 2px;
}

.card-section {
  margin-bottom: 12px;
}

.section-title {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
  margin: 0 0 8px 0;
  font-weight: normal;
}

.section-title.active-title {
  color: #000000;
  font-weight: 600;
}

.data-row {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  line-height: 1.6;
}

.data-labels p, .data-values p {
  margin: 0;
}

.data-labels {
  color: rgba(0, 0, 0, 0.8);
}

.data-values {
  text-align: right;
  color: rgba(0, 0, 0, 0.5);
}

.data-values.active-values {
  color: #004d43;
  font-weight: 600;
}

.card-divider {
  height: 4px;
  background-color: #004d43;
  margin: 12px 0;
  border-radius: 2px;
}

.action-btn {
  background-color: #004d43;
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
</style>


