<template>
  <div class="app-container">
    <LoadingSpinner :visible="isLoading" :overlay="true" message="Memuat data..." />
    <!-- Map Header Section -->
    <section id="section-map-header" class="map-header">
      <!-- Map Background Image -->
      <div class="map-bg-container">
        <img src="/assets/image/fcce4a8a0bda529ddbaaf1ae15403872cceb140c.png" alt="Map Background" class="map-bg">
      </div>

      <!-- Top Left Status Pills -->
      <div class="status-overlay">
        <div class="status-pill">
          <span class="pill-text">{{ serverDateText }}</span>
        </div>
        <div class="status-pill" @click.stop="showStatusModal = true">
          <span class="pill-text status-text">Status: Sedang Memetakan</span>
        </div>
      </div>

      <!-- Top Center Hint -->
      <div class="tap-hint" @click="openSanFranciscoMap">
        Tap untuk melihat area
      </div>

      <!-- Floating Area Pill -->
      <div class="area-pill">
        <img src="/assets/image/106_155.svg" alt="Arrow Up" class="icon-svg">
        <span class="pill-text">{{ selectedArea }}</span>
      </div>
    </section>

    <!-- Dashboard Section -->
    <section id="section-dashboard" class="dashboard">
      <!-- Dashboard Header -->
      <div class="dashboard-header">
        <div class="title-group">
          <h2 class="section-title">Alat milik saya</h2>
          <span class="count-badge">({{ activeCount }}/{{ expiredCount }})</span>
        </div>
        <div class="filter-dropdown">
          <div class="dropdown-button" @click.stop="openAreaModal">
            <span class="caret"></span>
            <span class="dropdown-label">{{ selectedArea }}</span>
          </div>
        </div>
      </div>
      <teleport to="body">
        <div v-if="openDropdown" class="area-selector-overlay" @click.self="cancelArea">
          <section id="area-selector-section">
            <div class="mobile-container">
              <div class="bottom-sheet">
                <header class="sheet-header">
                  <button type="button" class="sheet-action" @click="cancelArea">Membatalkan</button>
                  <div class="sheet-spacer"></div>
                  <button type="button" class="sheet-action sheet-action--primary" @click="confirmArea">Tentu</button>
                </header>

                <div class="picker-wrapper">
                  <div class="picker-indicator"></div>
                  <div ref="areaPickerEl" class="picker" @scroll="onAreaScroll">
                    <ul class="picker-list">
                      <li v-for="(opt, idx) in areaOptions" :key="opt" class="picker-row">
                        <button
                          type="button"
                          class="picker-item"
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
        <div v-if="showStatusModal" class="status-modal-overlay" @click.self="showStatusModal = false">
          <div class="status-modal">
            <div class="status-modal-title">Status</div>
            <div class="status-modal-body">
              <div class="status-modal-item">
                <div class="status-modal-item-title">Status layanan perangkat</div>
                <div class="status-modal-item-desc">Sedang Memetakan: Drone sedang menjalankan misi pemetaan</div>
              </div>
              <div class="status-modal-item">
                <div class="status-modal-item-title">Pemrosesan AI</div>
                <div class="status-modal-item-desc">Data hasil penerbangan sedang dianalisis sistem</div>
              </div>
              <div class="status-modal-item">
                <div class="status-modal-item-title">Standby</div>
                <div class="status-modal-item-desc">Drone aktif tetapi belum menjalankan misi</div>
              </div>
              <div class="status-modal-item">
                <div class="status-modal-item-title">Perawatan</div>
                <div class="status-modal-item-desc">Drone sedang dalam pengecekan atau perbaikan</div>
              </div>
              <div class="status-modal-item">
                <div class="status-modal-item-title">Offline</div>
                <div class="status-modal-item-desc">Drone tidak terhubung ke sistem saat ini</div>
              </div>
              <div class="status-modal-item">
                <div class="status-modal-item-title">Misi Selesai</div>
                <div class="status-modal-item-desc">Tugas telah selesai dan hasil dapat ditinjau</div>
              </div>
            </div>
            <button type="button" class="status-modal-btn" @click="showStatusModal = false">Paham</button>
          </div>
        </div>
      </teleport>

      <!-- Drone List -->
      <div v-if="filteredInvestments.length === 0" class="empty-state">
        <img src="/assets/image/empty.png" alt="No Data" class="empty-icon" @error="onEmptyError">
      </div>

      <div v-else class="drone-list">
        <div v-for="(inv, idx) in filteredInvestments" :key="inv.id" class="drone-card">
          <div class="card-top">
            <h3 class="drone-name">{{ inv.product_name || '-' }}</h3>
            <div class="card-badges">
              <div class="badge-sewa"><span>Sewa</span></div>
              <div class="badge-status">
                <span class="status-dot"></span>
                <span>Status: {{ getDisplayStatus(inv) }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-content">
            <div class="drone-image-wrapper">
              <img :src="getProductImage(inv)" alt="Drone" class="drone-img" @error="onImageError">
            </div>
            
            <div class="stats-container">
              <div class="stat-item">
                <span class="stat-label">Area {{ inv.product_golongan || '-' }}</span>
                <span class="stat-value">{{ formatArea(inv.quantity) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Kecepatan</span>
                <span class="stat-value">{{ formatSpeed(inv.profit_rate) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Masa berlaku</span>
                <span class="stat-value">{{ formatDays(inv.remaining_days) }}</span>
              </div>
            </div>

            <div class="action-arrow">
              <div class="arrow-btn" @click="openInvestmentDetails(inv)">
                <img :src="idx % 2 === 0 ? '/assets/image/108_205.svg' : '/assets/image/108_215.svg'" alt="Go" class="arrow-icon">
              </div>
            </div>
          </div>
          <div class="card-divider"></div>
        </div>

      </div>

      <!-- List Footer -->
      <div v-if="filteredInvestments.length > 0" class="list-footer">
        <p>Tidak lebih</p>
      </div>

        <!-- <div class="footer-brand">
          <div class="brand-row">
            <img src="/assets/image/983276.png" alt="Ot-Sent" class="footer-logo">
            <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
          </div>
          <p class="tagline">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        </div> -->

    </section>

  
  </div>
  <FooterBar />
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import FooterBar from '@/components/partials/FooterBar.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import { investmentAPI } from '@/services/api'

const router = useRouter()

const openDropdown = ref(false)
const selectedArea = ref('Area A1')
const tempSelectedArea = ref(selectedArea.value)
const areaOptions = ref(['Area A1'])
const areaPickerEl = ref(null)
const activeAreaIndex = ref(0)
const areaRowHeight = 36
let areaRafId = 0

const showStatusModal = ref(false)
const serverDateText = ref('-')

const investments = ref([])
const allInvestments = ref([])
const isLoading = ref(false)

const extractGolongan = (label) => {
  const v = String(label || '').trim()
  if (!v) return ''
  return v.replace(/^Area\s+/i, '').trim()
}

const selectedGolongan = computed(() => extractGolongan(selectedArea.value))

const filteredInvestments = computed(() => {
  const g = selectedGolongan.value
  if (!g) return investments.value
  return investments.value.filter((inv) => String(inv?.product_golongan || '').trim() === g)
})

const activeCount = computed(() => {
  return allInvestments.value.filter(i => String(i?.status || '').toUpperCase() === 'ACTIVE').length
})

const expiredCount = computed(() => {
  return allInvestments.value.filter(i => String(i?.status || '').toUpperCase() === 'EXPIRED').length
})

const openAreaModal = () => {
  tempSelectedArea.value = selectedArea.value
  openDropdown.value = true
  nextTick(() => {
    const idx = Math.max(0, areaOptions.value.findIndex((v) => v === tempSelectedArea.value))
    activeAreaIndex.value = idx >= 0 ? idx : 0
    const el = areaPickerEl.value
    if (!el) return
    el.scrollTo({ top: activeAreaIndex.value * areaRowHeight, behavior: 'auto' })
  })
}

const cancelArea = () => {
  openDropdown.value = false
}

const confirmArea = () => {
  selectedArea.value = tempSelectedArea.value
  openDropdown.value = false
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

const onKeyDown = (e) => {
  if (e.key === 'Escape') {
    if (showStatusModal.value) {
      showStatusModal.value = false
      return
    }
    cancelArea()
  }
}

const setBodyScrollLocked = (locked) => {
  const body = document?.body
  if (!body) return
  body.style.overflow = locked ? 'hidden' : ''
  body.style.touchAction = locked ? 'none' : ''
}

watch(
  () => [openDropdown.value, showStatusModal.value],
  ([isAreaOpen, isStatusOpen]) => {
    setBodyScrollLocked(!!(isAreaOpen || isStatusOpen))
  },
  { immediate: true }
)

const normalizeInvestmentsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const formatServerDate = (dateInput) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (Number.isNaN(date.getTime())) return '-'
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date)

  const lookup = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]))
  const yyyy = lookup.year || ''
  const m = lookup.month || ''
  const d = lookup.day || ''
  const hh = lookup.hour || '00'
  const mm = lookup.minute || '00'
  if (!yyyy || !m || !d) return '-'
  return `${yyyy}/${m}/${d} ${hh}:${mm} UTC +7`
}

const applyInvestments = (items = [], headerDate = null) => {
  allInvestments.value = items
  investments.value = items.filter(i => String(i?.status || '').toUpperCase() === 'ACTIVE')
  const d = headerDate ? new Date(headerDate) : new Date()
  serverDateText.value = formatServerDate(d)
}

const updateAreaOptionsFromInvestments = (activeItems) => {
  const golongans = Array.from(
    new Set(
      (Array.isArray(activeItems) ? activeItems : [])
        .map((i) => String(i?.product_golongan || '').trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b))

  const opts = golongans.length ? golongans.map((g) => `Area ${g}`) : ['Area A1']
  areaOptions.value = opts

  if (!opts.includes(selectedArea.value)) {
    selectedArea.value = opts[0]
  }
  if (!opts.includes(tempSelectedArea.value)) {
    tempSelectedArea.value = selectedArea.value
  }
}

const fetchInvestments = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const respActive = await investmentAPI.getInvestments({ status: 'ACTIVE' })
    const activeItems = normalizeInvestmentsResponse(respActive?.data)

    let expiredItems = []
    let respExpired = null
    try {
      respExpired = await investmentAPI.getInvestments({ status: 'EXPIRED' })
      expiredItems = normalizeInvestmentsResponse(respExpired?.data)
    } catch (_) {}

    if (activeItems.length || expiredItems.length) {
      allInvestments.value = [...activeItems, ...expiredItems]
      investments.value = activeItems
      updateAreaOptionsFromInvestments(activeItems)
      const headerDate = respActive?.headers?.date || respExpired?.headers?.date
      const d = headerDate ? new Date(headerDate) : new Date()
      serverDateText.value = formatServerDate(d)
      return
    }

    const respAll = await investmentAPI.getInvestments({ page: 1 })
    const allItems = normalizeInvestmentsResponse(respAll?.data)
    applyInvestments(allItems, respAll?.headers?.date)
    updateAreaOptionsFromInvestments(allItems.filter(i => String(i?.status || '').toUpperCase() === 'ACTIVE'))
  } catch (_) {
    investments.value = []
    allInvestments.value = []
    serverDateText.value = formatServerDate(new Date())
  } finally {
    isLoading.value = false
  }
}

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '0'
  const num = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(num)) return String(value)
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

const formatArea = (quantity) => {
  const n = Number(quantity)
  if (Number.isNaN(n)) return '-'
  return `${n}Ha`
}

const formatSpeed = (profitRate) => {
  const num = Number(String(profitRate ?? '').replace(/,/g, ''))
  if (Number.isNaN(num)) return '-'
  const kmh = Math.max(1, Math.round(num))
  return `${kmh} km/j`
}

const formatDays = (days) => {
  const n = Number(days)
  if (Number.isNaN(n)) return '-'
  return `${n}D`
}

const getDisplayStatus = (inv) => {
  if (inv?.profit_holiday_active && inv?.profit_holiday_is_blocked_today) return 'Standby'
  return inv?.status || '-'
}

const fallbackImage = '/assets/image/27c56f86fe1c8990e4a0be8a57a8835a3a1bc1b9.png'
const fallbackEmptyImage = '/assets/images/34646.png'
const getProductImage = (inv) => {
  const url = String(inv?.product_image || '').trim()
  return url || fallbackImage
}

const onImageError = (e) => {
  const el = e?.target
  if (el && el.src && !String(el.src).includes(fallbackImage)) {
    el.src = fallbackImage
  }
}

const onEmptyError = (e) => {
  const el = e?.target
  if (el && el.src && !String(el.src).includes(fallbackEmptyImage)) {
    el.src = fallbackEmptyImage
  }
}

const openInvestmentDetails = (inv) => {
  if (!inv) return
  // Gunakan id (PK) sebagai prioritas utama untuk detail endpoint
  const id = inv?.id || inv?.investment_id
  if (!id) return
  router.push(`/pages/account/panel/${id}`)
}

const openSanFranciscoMap = () => {
  const url = 'https://www.google.com/maps?q=San+Francisco&z=12'
  window.location.href = url
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  fetchInvestments()
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

img {
  display: block;
  max-width: 100%;
}

.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  padding: 0;
  background-color: #1d2138;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}

/* Map Header */
.map-header {
  position: relative;
  width: 100%;
  height: 176px;
  z-index: 1;
}

.map-bg-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.map-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-overlay {
  position: absolute;
  top: 15px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.status-pill {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 10px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  height: 26px;
}

.pill-text {
  font-size: 10px;
  color: #ffffff;
  white-space: nowrap;
}

.status-text {
  color: #777777;
}

.tap-hint {
  position: absolute;
  top: 15px;
  right: 8px;
  color: #d8d8d8;
  font-size: 12px;
  text-align: right;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  cursor: pointer;
}

.area-pill {
  position: absolute;
  bottom: -13px;
  right: 20px;
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 10px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 26px;
  z-index: 10;
}

.icon-svg {
  width: 24px;
  height: 24px;
}

/* Dashboard */
.dashboard {
  position: relative;
  margin-top: -37px;
  z-index: 2;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  min-height: 800px;
  padding: 20px 15px 100px 15px;
  color: white;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-top: 15px;
}

.title-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.count-badge {
  color: #a1a1a1;
  font-size: 14px;
  text-align: left;
}

.filter-icon {
  width: 39px;
  height: 33px;
  object-fit: contain;
}

.filter-dropdown {
  position: relative;
}

.dropdown-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 9999px;
  height: 26px;
  padding: 4px 12px;
  cursor: pointer;
}

.caret {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #ffffff;
  opacity: 0.9;
}

.dropdown-label {
  font-size: 12px;
  color: #ffffff;
  white-space: nowrap;
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

.mobile-container {
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

.bottom-sheet {
  background: linear-gradient(180deg, #1a1f3a 0%, #0b0d1e 100%);
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sheet-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.02);
}

.sheet-spacer {
  flex: 1;
}

.sheet-action {
  background: transparent;
  border: none;
  padding: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
}

.sheet-action--primary {
  color: rgba(255, 255, 255, 0.95);
}

.picker-wrapper {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.picker {
  width: 100%;
  height: 168px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
}

.picker::-webkit-scrollbar {
  display: none;
}

.picker-list {
  list-style: none;
  margin: 0;
  padding: 66px 0;
}

.picker-row {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
}

.picker-item {
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

.picker-item.active {
  opacity: 1;
  color: rgba(255, 255, 255, 1);
}

.picker-indicator {
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

.status-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.status-modal {
  width: 100%;
  max-width: 320px;
  background: #1D2138;
  border-radius: 4px;
  padding: 16px 16px 14px;
}

.status-modal-title {
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 12px;
}

.status-modal-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.status-modal-item-title {
  font-size: 11px;
  color: #ffffff;
  margin-bottom: 2px;
}

.status-modal-item-desc {
  font-size: 10px;
  color: rgba(255,255,255,0.7);
  line-height: 1.35;
}

.status-modal-btn {
  width: 100%;
  height: 34px;
  background: rgba(153, 153, 255, 0.6);
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
}

/* Drone Card */
.drone-card {
  margin-bottom: 20px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.drone-name {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  flex: 1;
  min-width: 150px;
  color: #ffffff;
}

.card-badges {
  display: flex;
  gap: 8px;
  align-items: center;
}

.badge-sewa {
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  padding: 2px 10px;
  font-size: 10px;
  height: 15px;
  display: flex;
  align-items: center;
}

.badge-status {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 2px;
  padding: 2px 8px;
  font-size: 10px;
  height: 17px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background-color: #4ade80;
  border-radius: 50%;
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.drone-image-wrapper {
  width: 87px;
  height: 58px;
  flex-shrink: 0;
}

.drone-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  flex: 1;
  margin: 0 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 10px;
  color: #a0a0a0;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
}

.action-arrow {
  flex-shrink: 0;
}

.arrow-btn {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  width: 34px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}

.card-divider {
  height: 1px;
  background-color: #746a9a;
  opacity: 0.3;
  width: 100%;
  margin-top: 10px;
}

.empty-state {
  display: flex;
  justify-content: center;
  padding: 40px 0 20px;
}

.empty-icon {
  width: 210px;
  height: auto;
  opacity: 0.9;
}

.list-footer {
  display: flex;
  justify-content: center;
  text-align: center;
  color: #a1a1a1;
  font-size: 12px;
  margin: 30px 0;
  padding-bottom: 120px;
}

.footer-brand {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 100%;
  max-width: 412px;
  background-color: #1d2138;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding: 20px 20px;
  margin-bottom: 60px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.footer-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
  object-position: left;
}

.copyright {
  font-size: 10px;
  color: #fff;
}

.tagline {
  font-size: 10px;
  color: #c4c4c4;
  margin: 0;
}
</style>
