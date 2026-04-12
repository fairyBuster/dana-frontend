<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <div class="header-container">
        <button class="back-button" @click="goBack">
          <img src="/assets/image/173_658.svg" alt="Back">
        </button>
        <h1 class="page-title">Catatan penerbangan</h1>
        <div class="header-spacer"></div>
      </div>
    </section>

    <!-- Flight List Section -->
    <section id="section-flight-list">
      <div class="list-container">
        <div v-if="flights.length === 0" class="empty-state">
          <img src="/assets/image/empty.png" alt="No Data" class="empty-icon">
          <div v-if="loadError" class="empty-text">{{ loadError }}</div>
        </div>
        <article v-for="flight in flights" :key="flight.id" class="flight-card">
          <div class="card-content">
            <div class="card-info">
              <h2 class="drone-name">{{ flight.droneName }}</h2>
              <p class="info-text">Waktu pemesanan: {{ flight.orderTime }}</p>
              <p class="info-text">Misi selesai: {{ flight.missionEnd }}</p>
              <p class="info-text">Kuantitas pembelian: {{ flight.quantity }}</p>
            </div>
            
            <div class="card-media">
              <img :src="flight.droneImage" :alt="flight.droneName" class="drone-image" @error="onFlightImageError">
            </div>

            <div class="card-status">
              <div :class="['badge', flight.badgeClass]">
                <span>{{ flight.badgeText }}</span>
              </div>
            </div>
          </div>
        </article>
        <div v-if="flights.length > 0 && hasMore" class="pagination-row">
          <button class="load-more-btn" @click="loadMore" :disabled="isLoading">
            Memuat lebih banyak
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { investmentAPI, transactionAPI } from '@/services/api'
import { resolveImageUrl } from '@/utils/imageCache'

const router = useRouter()

const flights = ref([])
const allFlights = ref([])
const loadError = ref('')
const isLoading = ref(false)
const pageSize = 20
const hasMore = ref(true)
const nextFetchPage = ref(1)
const visibleCount = ref(pageSize)
const investmentStatusByTransactionId = new Map()

const fallbackImage = '/assets/image/27c56f86fe1c8990e4a0be8a57a8835a3a1bc1b9.png'

const normalizeTransactionsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const normalizeInvestmentsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (value) => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const mapStatusToBadge = (status) => {
  const s = String(status || '').toUpperCase()
  if (s === 'COMPLETED' || s === 'SUCCESS') return 'finished'
  if (s === 'FAILED' || s === 'CANCELLED' || s === 'REJECTED') return 'finished'
  return 'active'
}

const addHours = (iso, hours) => {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const h = Number(hours)
  if (!Number.isFinite(h) || h <= 0) return null
  d.setTime(d.getTime() + h * 3600000)
  return d.toISOString()
}

const getTransactionImageRaw = (t) => {
  const candidates = [
    t?.product_image,
    t?.product?.image,
    t?.product?.product_image,
    t?.product?.thumbnail,
    t?.product_thumbnail,
    t?.product_image_url,
    t?.image,
    t?.image_url,
    t?.thumbnail
  ]
  for (const c of candidates) {
    const s = String(c || '').trim()
    if (s) return s
  }
  return ''
}

const resolveTransactionImageUrl = (t) => {
  const raw = getTransactionImageRaw(t)
  const resolved = raw ? String(resolveImageUrl(raw) || '').trim() : ''
  return resolved || fallbackImage
}

const onFlightImageError = (e) => {
  const el = e?.target
  if (el && el.src && !String(el.src).includes(fallbackImage)) el.src = fallbackImage
}

const mapToFlight = (t) => {
  const statusRaw = t?.status
  const badge = mapStatusToBadge(statusRaw)
  const createdAt = t?.created_at
  const durationHours = t?.withdrawal_service_duration_hours
  const endAt = addHours(createdAt, durationHours)

  let badgeClass = badge === 'active' ? 'badge-active' : 'badge-finished'
  let badgeText = badge === 'active' ? 'Aktif' : 'Selesai'
  const investmentStatus = t?._investment_status
  if (investmentStatus === 'ACTIVE') {
    badgeClass = 'badge-active'
    badgeText = 'Aktif'
  } else if (investmentStatus === 'EXPIRED') {
    badgeClass = 'badge-finished'
    badgeText = 'Kedaluwarsa'
  }

  return {
    id: t?.id ?? t?.trx_id ?? `${createdAt || ''}-${t?.amount || ''}`,
    droneName: t?.product_name || t?.trx_id || '-',
    orderTime: formatDateTime(createdAt),
    missionEnd: endAt ? formatDateTime(endAt) : '-',
    quantity: Number.isFinite(Number(t?.investment_quantity)) ? Number(t.investment_quantity) : 1,
    badgeClass,
    badgeText,
    droneImage: resolveTransactionImageUrl(t),
    createdAtRaw: createdAt || null
  }
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal mengambil data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal mengambil data'
}

const ensureInvestmentStatusMap = async () => {
  if (investmentStatusByTransactionId.size > 0) return
  try {
    const [respActive, respExpired] = await Promise.all([
      investmentAPI.getInvestments({ status: 'ACTIVE' }),
      investmentAPI.getInvestments({ status: 'EXPIRED' })
    ])
    const allInv = [
      ...normalizeInvestmentsResponse(respActive?.data),
      ...normalizeInvestmentsResponse(respExpired?.data)
    ]
    allInv.forEach((inv) => {
      const key = inv?.transaction_id
      if (!key) return
      investmentStatusByTransactionId.set(String(key), String(inv?.status || '').toUpperCase())
    })
  } catch (_) {}
}

const fetchTransactionsPage = async (page) => {
  const tryFetch = async (type) => {
    const resp = await transactionAPI.getTransactions({ type, page, page_size: pageSize })
    const items = normalizeTransactionsResponse(resp?.data)
    return items
  }
  let combined = []
  const types = ['INVESTMENTS', 'INVESTMENT', 'INTEREST']
  const settled = await Promise.allSettled(types.map((t) => tryFetch(t)))
  settled.forEach((r) => {
    if (r.status === 'fulfilled') combined = combined.concat(r.value)
  })
  return combined
}

const mergeFlights = (items) => {
  const withStatus = items.map((t) => {
    const trxKey = t?.trx_id || t?.transaction_id
    const invStatus = trxKey ? investmentStatusByTransactionId.get(String(trxKey)) : null
    return { ...t, _investment_status: invStatus || null }
  })
  const mapped = withStatus.map(mapToFlight)
  const seen = new Set(allFlights.value.map((x) => String(x.id)))
  const append = mapped.filter((m) => !seen.has(String(m.id)))
  if (!append.length) return false
  const merged = [...allFlights.value, ...append]
  merged.sort((a, b) => new Date(b.createdAtRaw || 0).getTime() - new Date(a.createdAtRaw || 0).getTime())
  allFlights.value = merged
  return true
}

const loadPage = async (page) => {
  await ensureInvestmentStatusMap()
  const items = await fetchTransactionsPage(page)
  if (!items.length) return false
  return mergeFlights(items)
}

const fetchInvestmentTransactions = async () => {
  loadError.value = ''
  isLoading.value = true
  hasMore.value = true
  flights.value = []
  allFlights.value = []
  nextFetchPage.value = 1
  visibleCount.value = pageSize
  try {
    let tries = 0
    while (allFlights.value.length < visibleCount.value && tries < 5) {
      const ok = await loadPage(nextFetchPage.value)
      if (ok) nextFetchPage.value += 1
      tries += 1
      if (!ok) break
    }
    flights.value = allFlights.value.slice(0, visibleCount.value)
    hasMore.value = allFlights.value.length >= visibleCount.value
  } catch (err) {
    flights.value = []
    loadError.value = extractErrorMessage(err)
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  if (!hasMore.value || isLoading.value) return
  isLoading.value = true
  visibleCount.value += pageSize
  try {
    let tries = 0
    while (allFlights.value.length < visibleCount.value && tries < 5) {
      const ok = await loadPage(nextFetchPage.value)
      if (ok) nextFetchPage.value += 1
      tries += 1
      if (!ok) break
    }
    flights.value = allFlights.value.slice(0, visibleCount.value)
    hasMore.value = allFlights.value.length >= visibleCount.value
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  fetchInvestmentTransactions()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #121212;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Section */
#section-header {
  width: 100%;
  max-width: 412px;
  padding: 18px 10px;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: #FFFFFF;
  margin: 0;
  text-align: center;
  flex-grow: 1;
}

.header-spacer {
  width: 24px; /* Matches back button width */
}

/* Flight List Section */
#section-flight-list {
  width: 100%;
  max-width: 412px;
  padding: 0 15px 20px 15px;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty-state {
  width: 100%;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-icon {
  width: 140px;
  height: auto;
  display: block;
  opacity: 0.9;
}

.empty-text {
  font-size: 14px;
  color: #a0a0a0;
}

.flight-card {
  background-color: #1d2138;
  border-radius: 10px;
  padding: 12px;
  width: 100%;
  position: relative;
}

.card-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
}

.card-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0; /* Prevents flex item from overflowing */
}

.drone-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 14px;
  color: #a296ff;
  margin: 0 0 8px 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info-text {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  line-height: 1.5;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.info-text:last-child {
  margin-bottom: 0;
}

.card-media {
  flex-shrink: 0;
  width: 87px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drone-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-status {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
}

.badge {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 10px;
  height: 15px;
  border-radius: 10px;
  font-size: 10px;
  line-height: 1;
  font-weight: 500;
}

.badge-active {
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30.77%, #9047e0 100%);
  border: 1px solid #746a9a;
  color: #ffffff;
}

.badge-finished {
  background-color: #b4b8e3;
  border: 1px solid #746a9a;
  color: #000000;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0 0 0;
}

.load-more-btn {
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #746a9a 0%, #272434 100%);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 10px 0;
}
</style>
