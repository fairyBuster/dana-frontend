<!-- <template>
  <div class="app-container">
    <LoadingSpinner :visible="isLoading && !investment" :overlay="true" message="Memuat data drone..." />
  
    <header class="header-section">
      <div class="top-nav">
        <a class="nav-left" href="/pages/portfolio">
          <img src="/assets/images/2023_1661.svg" alt="Back" class="icon-back">
          <span class="nav-text">Kembali ke beranda</span>
        </a>
      </div>
      
      <div class="hero-content">
        <h1 class="drone-title" @click="goToProduct">{{ investmentTitle }}</h1>
        <div class="hero-image-wrapper" @click="goToProduct">
          <img :src="investmentImage" :alt="investmentTitle" class="hero-drone-img" @error="onImageError">
        </div>
      </div>
    </header>


    <section class="active-drone-section">
      <h2 class="section-label">DRONE AKTIF</h2>
      
      <div class="active-drone-card">
        <div class="drone-thumbnail" @click="goToProduct">
          <img :src="investmentImage" alt="Drone Thumbnail" @error="onImageError">
        </div>
        
        <div class="drone-details">
          <h3 class="drone-name" @click="goToProduct">{{ investmentTitle }}</h3>
          
          <div class="badges-row">
            <div class="badge badge-mapping">
              <span>{{ mappingBadgeText }}</span>
            </div>
            <div class="badge badge-rent">
              <span>Sewa</span>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-col">
              <span class="label">Waktu penyewaan</span>
              <span class="value">{{ startDateText }}</span>
            </div>
            <div class="info-col">
              <span class="label">Berakhir</span>
              <span class="value">{{ endDateText }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="separator-line"></div>
    </section>

    <section class="stats-section">
      <h3 class="section-title">Informasi drone</h3>
      
      <div class="stats-grid">
 
        <div class="stat-card">
          <span class="stat-label">Hari melayani</span>
          <span class="stat-value">{{ daysServedText }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Hari ini</span>
          <span class="stat-value">{{ todayProfitText }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Total</span>
          <span class="stat-value">{{ totalProfitText }}</span>
        </div>

        <div class="stat-card">
          <span class="stat-label">Kapasitas</span>
          <span class="stat-value">{{ capacityText }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Waktu penyewaan</span>
          <span class="stat-value">{{ startDateText }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Berakhir</span>
          <span class="stat-value">{{ endDateText }}</span>
        </div>

     
        <div class="stat-card">
          <span class="stat-label">Akumulasi melayani</span>
          <span class="stat-value">{{ accumulatedServingText }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Masa berlaku</span>
          <span class="stat-value">{{ remainingDaysText }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Kecepatan</span>
          <span class="stat-value">{{ speedText }}</span>
        </div>
      </div>
    </section>


    <section class="orders-section">
      <div class="orders-header">
        <h3 class="section-title">Pesanan 3 hari terakhir</h3>
        <button class="btn-see-more" @click="goToTransactions">
          <span>Lihat lagi</span>
          <img src="/assets/images/2038_161.svg" alt="Arrow Right">
        </button>
      </div>

      <div class="orders-table">
        <div class="table-header">
          <div class="th col-time">Waktu</div>
          <div class="th col-cap">Kapasitas pemetaan</div>
          <div class="th col-price">Sukuk pokok</div>
        </div>
        
        <div v-for="row in recentOrders" :key="row.key" class="table-row">
          <div class="td col-time">{{ row.date }}<br>{{ row.time }}</div>
          <div class="td col-cap">{{ row.capacity }}</div>
          <div class="td col-price">{{ row.amount }}</div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="footer-content">
        <div class="footer-logo-row">
          <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Logo" class="footer-logo">
          <p class="copyright">© 2026 OT-SENT. All Rights Reserved</p>
        </div>
        <p class="footer-desc">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
      </div>
    </footer>

    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template> -->

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { investmentAPI, transactionAPI } from '@/services/api'
import { resolveImageUrl } from '@/utils/imageCache'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()
const route = useRoute()

const investment = ref(null)
const isLoading = ref(false)
const fallbackImage = ''
const errorModalOpen = ref(false)
const errorMessage = ref('')
const goBackOnClose = ref(false)
const interestTransactions = ref([])
const sessionSeed = ref(String(Date.now()))
const serverOffsetMs = ref(0)
const getNowMs = () => Date.now() + (serverOffsetMs.value || 0)
const nowMs = ref(getNowMs())
let nowIntervalId = null
const startedAtMs = ref(null)

const investmentBlobUrl = ref('')

const fetchImageAsBlob = async (url) => {
  if (!url) return
  const resolved = resolveImageUrl(url)
  try {
    const resp = await fetch(resolved)
    if (!resp.ok) throw new Error('Failed to fetch image')
    const blob = await resp.blob()
    const blobUrl = URL.createObjectURL(blob)
    investmentBlobUrl.value = blobUrl
  } catch (err) {
    console.error('Error loading blob image:', err)
  }
}

watch(
  () => investment.value?.product_image,
  (url) => {
    if (url) {
      fetchImageAsBlob(url)
    }
  }
)

onMounted(() => {
  nowIntervalId = window.setInterval(() => {
    nowMs.value = getNowMs()
  }, 1000)
})

onBeforeUnmount(() => {
  if (nowIntervalId) window.clearInterval(nowIntervalId)
  nowIntervalId = null
})

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const num = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(num)) return null
  return num
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatYmd = (d) => {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const formatCurrencyCompact = (value) => {
  const num = parseNumber(value)
  if (num === null) return '-'
  return formatAppCurrency(num, { decimals: 0 })
}

const hashToUint32 = (input) => {
  const str = String(input ?? '')
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const mulberry32 = (a) => {
  let t = a >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = t
    r = Math.imul(r ^ (r >>> 15), r | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const getRandomInRange = (seedKey, min, max) => {
  const minNum = parseNumber(min)
  const maxNum = parseNumber(max)
  const lo = minNum === null ? null : Math.floor(minNum)
  const hi = maxNum === null ? null : Math.floor(maxNum)
  if (lo !== null && hi !== null && hi >= lo) {
    const rand = mulberry32(hashToUint32(seedKey))()
    const span = hi - lo + 1
    return lo + Math.floor(rand * span)
  }
  const rand = mulberry32(hashToUint32(seedKey))()
  return Math.floor(10000 + rand * 90000)
}

const getDisplayAmountValue = (raw, seedKey, fallbackRaw = null, range = null) => {
  const n = parseNumber(raw)
  if (n !== null && n !== 0) return n
  const fb = parseNumber(fallbackRaw)
  if (fb !== null && fb !== 0) return fb
  if (range && (range.min !== undefined || range.max !== undefined)) {
    return getRandomInRange(seedKey, range.min, range.max)
  }
  return getRandomInRange(seedKey, null, null)
}

const formatHms = (totalSeconds) => {
  const secs = Math.max(0, Math.floor(Number(totalSeconds) || 0))
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`
}

const normalizeInvestmentsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, segarkan halaman'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Permintaan gagal, segarkan halaman'
}

const normalizeNotFoundMessage = (msg) => {
  const s = String(msg || '').toLowerCase()
  if (s.includes('no investment matches')) return 'Investasi tidak ditemukan'
  return String(msg || 'Permintaan gagal, segarkan halaman')
}

const updateServerOffsetFromHeaders = (headers) => {
  const headerDate = headers?.date || headers?.Date || null
  if (!headerDate) return
  const d = new Date(headerDate)
  if (Number.isNaN(d.getTime())) return
  const nextOffset = d.getTime() - Date.now()
  if (Math.abs(nextOffset) > 12 * 3600 * 1000) return
  serverOffsetMs.value = nextOffset
  nowMs.value = getNowMs()
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const isInvestmentNotFoundError = (err) => {
  const status = err?.response?.status
  if (status !== 404) return false
  const msg = String(extractErrorMessage(err) || '').toLowerCase()
  // DRF standard "No Investment matches the given query." or common "Not found"
  return msg.includes('no investment matches') || msg.includes('not found') || msg === ''
}

const fetchInvestment = async () => {
  const rawId = route.params.id
  if (!rawId) return
  
  isLoading.value = true
  errorModalOpen.value = false
  errorMessage.value = ''
  goBackOnClose.value = false
  interestTransactions.value = []

  let lastErr = null
  const delays = [0, 500, 1000, 1500, 2000, 3000, 5000, 8000]
  for (let attempt = 0; attempt < delays.length; attempt += 1) {
    if (attempt > 0) await sleep(delays[attempt])
    
    // Strategi 1: Coba ambil detail langsung
    try {
      const resp = await investmentAPI.getInvestment(rawId)
      updateServerOffsetFromHeaders(resp?.headers)
      if (resp?.data) {
        investment.value = resp.data
        isLoading.value = false
        return
      }
    } catch (err) {
      lastErr = err
    }

    // Strategi 2: Jika detail gagal, coba cari di list ACTIVE (mungkin ID di URL adalah transaction_id)
    try {
      const respActive = await investmentAPI.getInvestments({ status: 'ACTIVE' })
      const activeItems = normalizeInvestmentsResponse(respActive?.data)
      const found = activeItems.find((i) => 
        String(i?.id) === String(rawId) || 
        String(i?.investment_id) === String(rawId) || 
        String(i?.transaction) === String(rawId) || 
        String(i?.transaction_id) === String(rawId)
      )
      if (found) {
        investment.value = found
        isLoading.value = false
        return
      }
    } catch (_) {}

    // Jika ini percobaan terakhir dan masih gagal, hentikan
    const status = lastErr?.response?.status
    if (status && status !== 404) break // Jika error selain 404, jangan retry
  }

  // Fallback final: Coba cari di list EXPIRED atau list umum jika semua strategi di atas gagal
  try {
    const respExpired = await investmentAPI.getInvestments({ status: 'EXPIRED' })
    const expiredItems = normalizeInvestmentsResponse(respExpired?.data)
    const foundExpired = expiredItems.find((i) => 
      String(i?.id) === String(rawId) || 
      String(i?.investment_id) === String(rawId) || 
      String(i?.transaction) === String(rawId) || 
      String(i?.transaction_id) === String(rawId)
    )
    if (foundExpired) {
      investment.value = foundExpired
      isLoading.value = false
      return
    }
  } catch (_) {}

  try {
    const resp = await investmentAPI.getInvestments({ page: 1 })
    const items = normalizeInvestmentsResponse(resp?.data)
    const found = items.find((i) => 
      String(i?.id) === String(rawId) || 
      String(i?.investment_id) === String(rawId) || 
      String(i?.transaction) === String(rawId) || 
      String(i?.transaction_id) === String(rawId)
    )
    if (found) {
      investment.value = found
      isLoading.value = false
      return
    }
  } catch (_) {}

  isLoading.value = false
  if (!investment.value) {
    investment.value = null
    errorMessage.value = normalizeNotFoundMessage(extractErrorMessage(lastErr))
    errorModalOpen.value = true
    goBackOnClose.value = true
  }
}

const normalizeTransactionsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const fetchInterestTransactions = async () => {
  try {
    const invId = investment.value?.id
    if (!invId) {
      interestTransactions.value = []
      return
    }
    const resp = await investmentAPI.getInvestmentInterestTransactions(invId, { limit: 3 })
    interestTransactions.value = normalizeTransactionsResponse(resp?.data)
  } catch (_) {
    interestTransactions.value = []
  }
}

watch(
  () => route.params.id,
  async () => {
    await fetchInvestment()
    if (investment.value?.id) {
      await fetchInterestTransactions()
    }
  },
  { immediate: true }
)

watch(
  () => investment.value?.id,
  () => {
    const startRaw = investment.value?.created_at || investment.value?.updated_at
    if (!startRaw) {
      startedAtMs.value = null
      return
    }
    const d = new Date(startRaw)
    startedAtMs.value = Number.isNaN(d.getTime()) ? null : d.getTime()
  },
  { immediate: true }
)

watch(
  () => errorModalOpen.value,
  (open) => {
    if (!open && goBackOnClose.value) {
      goBackOnClose.value = false
      router.go(-1)
    }
  }
)

const goBack = () => {
  // Jika history cuma 1 (misal abis refresh atau link langsung), arahkan ke panel
  if (window.history.length <= 1) {
    router.push('/hn/hall/outputhall')
  } else {
    router.go(-1)
  }
}

const goToTransactions = () => {
  router.push('/hn/orders')
}

const goToProduct = () => {
  const productId = investment.value?.product
  if (productId) {
    router.push(`/hn/shop/detail/${productId}`)
  }
}

const investmentTitle = computed(() => investment.value?.product_name || 'Drone')

const investmentImage = computed(() => {
  if (investmentBlobUrl.value) return investmentBlobUrl.value
  const raw = String(investment.value?.product_image || '').trim()
  if (!raw) return fallbackImage
  return resolveImageUrl(raw)
})

const onImageError = (e) => {
  const el = e?.target
  if (el && el.src && !String(el.src).includes(fallbackImage)) {
    el.src = fallbackImage
  }
}

const mappingBadgeText = computed(() => {
  const s = String(investment.value?.status || '').toUpperCase()
  if (s === 'ACTIVE') return 'Sedang memetakan'
  if (s === 'COMPLETED') return 'Selesai'
  if (s === 'EXPIRED') return 'Kedaluwarsa'
  if (s === 'CANCELLED') return 'Dibatalkan'
  return 'Sedang memetakan'
})

const startDateText = computed(() => formatDate(investment.value?.created_at))
const endDateText = computed(() => formatDate(investment.value?.expires_at))

const daysServed = computed(() => {
  const duration = parseNumber(investment.value?.duration_days)
  const remaining = parseNumber(investment.value?.remaining_days)
  if (duration === null || remaining === null) return null
  return Math.max(0, Math.round(duration - remaining))
})

const daysServedText = computed(() => {
  const n = daysServed.value
  return n === null ? '-' : String(n)
})

const todayProfitText = computed(() => formatCurrencyCompact(investment.value?.daily_profit))
const totalProfitText = computed(() => formatCurrencyCompact(investment.value?.total_claimed_profit))

const capacityText = computed(() => {
  const q = parseNumber(investment.value?.quantity)
  if (q === null) return '-'
  return `${q}Ha`
})

const remainingDaysText = computed(() => {
  const n = parseNumber(investment.value?.remaining_days)
  if (n === null) return '-'
  return `${n}D`
})

const speedText = computed(() => {
  const n = parseNumber(investment.value?.profit_rate)
  if (n === null) return '-'
  return `${Math.max(1, Math.round(n))} km/j`
})

const accumulatedServingText = computed(() => {
  const startMs = startedAtMs.value
  if (startMs === null) return '-'
  const diffMs = nowMs.value - startMs
  return formatHms(Math.max(0, Math.floor(diffMs / 1000)))
})

const capacityKmFromInvestment = computed(() => {
  const rate = parseNumber(investment.value?.profit_rate)
  const qty = parseNumber(investment.value?.quantity)
  const base = (rate || 0) * 3 + 20
  const scaled = base * (qty || 1)
  return `${Math.max(1, Math.round(scaled))} km`
})

const capacityKmNumberForQty = (qtyInput) => {
  const rate = parseNumber(investment.value?.profit_rate)
  const qty = parseNumber(qtyInput)
  const base = (rate || 0) * 3 + 20
  const scaled = base * (qty || 1)
  return Math.max(1, Math.round(scaled))
}

const capacityKmForQty = (qtyInput) => {
  const n = capacityKmNumberForQty(qtyInput)
  return `${n} km`
}

const capacityKmRandomForRow = (rowKey, qtyInput) => {
  const base = capacityKmNumberForQty(qtyInput)
  const min = Math.max(1, base - 5)
  const max = base + 10
  const seedKey = `${sessionSeed.value}:${String(rowKey || '')}:cap`
  const km = getRandomInRange(seedKey, min, max)
  return `${km} km`
}

const recentOrders = computed(() => {
  const inv = investment.value
  if (!inv) return []

  const txs = Array.isArray(interestTransactions.value) ? interestTransactions.value : []
  const seen = new Set()
  const deduped = txs.filter((t) => {
    const key = t?.trx_id || t?.id
    if (!key) return true
    const k = String(key)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
  const invName = String(inv?.product_name || '').trim()
  const invProductId = inv?.product ?? null
  const filtered = invName
    ? deduped.filter((t) => String(t?.product_name || '').trim() === invName)
    : deduped
  const filteredByProduct = invProductId
    ? filtered.filter((t) => String(t?.product ?? '') === String(invProductId))
    : filtered
  const list = (filteredByProduct.length ? filteredByProduct : filtered.length ? filtered : deduped)
    .slice()
    .sort((a, b) => new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime())
    .slice(0, 3)

  if (list.length) {
    return list.map((t, idx) => ({
      key: t?.trx_id || t?.id || `interest-${idx}`,
      date: formatDate(t?.created_at),
      time: formatTime(t?.created_at),
      capacity: capacityKmRandomForRow(t?.trx_id || t?.id || `interest-${idx}`, t?.investment_quantity ?? inv?.quantity),
      amount: formatAppCurrency(getDisplayAmountValue(t?.amount, t?.trx_id || t?.id || `interest-${idx}`, inv?.daily_profit, { min: inv?.profit_random_min, max: inv?.profit_random_max }), { decimals: 0 })
    })).filter(r => r.date !== '-' && r.time !== '-')
  }
  return []
})

</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #0f0b29;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  display: block;
}

h1, h2, h3, h4, p {
  margin: 0;
}

.app-container {
  width: 100%;
  max-width: 412px;
  background-image: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  color: #ffffff;
  padding-bottom: 40px;
}

/* Header Section */
.header-section {
  padding: 22px 10px 20px;
}

.top-nav {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.nav-text {
  font-size: 14px;
  color: #a6a6a6;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.drone-title {
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 20px;
}

.hero-image-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.hero-drone-img {
  width: 202px;
  height: auto;
  object-fit: contain;
}

/* Active Drone Section */
.active-drone-section {
  padding: 0 24px;
  margin-bottom: 20px;
}

.section-label {
  font-size: 12px;
  color: #adadad;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.active-drone-card {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.drone-thumbnail {
  width: 120px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
}

.drone-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drone-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.drone-name {
  font-size: 14px;
  color: #ffffff;
  margin-bottom: 8px;
  font-weight: 500;
}

.badges-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 10px;
  height: 17px;
}

.badge-mapping {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  color: #ffffff;
}

.badge-rent {
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  color: #ffffff;
  height: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.info-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-col .label {
  font-size: 10px;
  color: #c2c2c2;
}

.info-col .value {
  font-size: 12px;
  color: #ffffff;
}

.separator-line {
  width: 100%;
  height: 1px;
  background-color: #746a9a;
  opacity: 0.3;
  margin-top: 10px;
}

/* Stats Section */
.stats-section {
  padding: 0 24px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 12px;
  color: #c2c2c2;
  margin-bottom: 12px;
  font-weight: 400;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: linear-gradient(180deg, rgba(15, 11, 46, 1) 0%, rgba(43, 27, 111, 1) 100%);
  border-radius: 2px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 57px;
  text-align: center;
}

.stat-label {
  font-size: 10px;
  color: #c2c2c2;
  margin-bottom: 4px;
  line-height: 1.2;
}

.stat-value {
  font-size: 12px;
  color: #ffffff;
  font-weight: 600;
}

/* Orders Section */
.orders-section {
  padding: 0 24px;
  margin-bottom: 40px;
}

.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.btn-see-more {
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  height: 31px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: white;
  font-family: inherit;
  font-size: 12px;
}

.btn-see-more img {
  width: 16px;
  height: 16px;
}

.orders-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(116, 106, 154, 0.2);
}

.table-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.th {
  font-size: 10px;
  color: #c2c2c2;
}

.td {
  font-size: 12px;
  color: #ffffff;
}

.col-time {
  width: 35%;
  text-align: left;
}

.col-cap {
  width: 35%;
  text-align: center;
}

.col-price {
  width: 30%;
  text-align: right;
}

/* Footer */
.site-footer {
  padding: 20px 24px;
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
}

.copyright {
  font-size: 10px;
  color: #ffffff;
}

.footer-desc {
  font-size: 10px;
  color: #c4c4c4;
  line-height: 1.4;
}

</style>


