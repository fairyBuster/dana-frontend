<template>
  <div class="app-container">
    <LoadingSpinner :visible="isLoading && !product" :overlay="true" message="Memuat data drone..." />
    <!-- Header Section -->
    <section id="header">
      <div class="header-content">
        <div class="icon-back" @click="goBack">
          <img src="/assets/image/118_937.svg" alt="Back">
        </div>
        <h1 class="page-title">{{ productTitle }}</h1>
      </div>
    </section>

    <!-- Hero Section -->
    <section id="hero">
      <div class="hero-image-container">
        <img v-if="productImage" :src="productImage" :alt="productTitle" class="hero-drone" @error="onImageError">
      </div>
    </section>

    <!-- Status Section -->
    <section id="status">
      <h2 class="section-label">DRONE TERSEDIA</h2>
      
      <div class="drone-card">
        <div class="drone-thumb">
          <img v-if="productImage" :src="productImage" alt="Drone Thumbnail" @error="onImageError">
        </div>
        <div class="drone-details">
          <h3 class="drone-name">{{ productTitle }}</h3>
          <div class="badges">
            <div class="badge badge-rent">
              <span>Sewa</span>
            </div>
            <div class="badge badge-status">
              <span>{{ availabilityText }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>
    </section>

    <!-- Stats Section -->
    <section id="stats">
      <h2 class="stats-title">Informasi drone</h2>
      <div class="stats-grid">
        <!-- Card 1 -->
        <div class="stat-card">
          <span class="stat-label">Masa pelayanan</span>
          <span class="stat-value">{{ durationText }}</span>
        </div>
        <!-- Card 2 -->
        <div class="stat-card">
          <span class="stat-label">Estimasi sewa</span>
          <span class="stat-value">{{ priceText }}</span>
        </div>
        <!-- Card 3 -->
        <div class="stat-card">
          <span class="stat-label">Kapasitas</span>
          <span class="stat-value">{{ capacityText }}</span>
        </div>
        <!-- Card 4 -->
        <div class="stat-card">
          <span class="stat-label">Suku pokok</span>
          <span class="stat-value">{{ profitText }}</span>
        </div>
        <!-- Card 5 -->
        <div class="stat-card">
          <span class="stat-label">Area pelayanan</span>
          <span class="stat-value">{{ product?.golongan || '-' }}</span>
        </div>
      </div>
    </section>

    <!-- Terms Section -->
    <section id="terms">
      <h2 class="terms-title">Hak Pendapatan Suku Pokok Drone</h2>
      <div class="terms-content">
        <ol class="terms-sections">
          <li class="terms-section">
            <div class="terms-section-title">Pendahuluan</div>
            <p class="terms-paragraph">
              Dokumen ini menjelaskan mengenai hak pendapatan suku pokok drone dalam sistem operasional SENT. Setiap pengguna yang melakukan penyewaan atau kepemilikan hak operasional drone berhak memperoleh manfaat sesuai dengan ketentuan yang berlaku dalam platform.
            </p>
            <p class="terms-paragraph">
              Suku pokok drone mengacu pada nilai dasar aset yang digunakan dalam kegiatan operasional pemetaan dan analisis berbasis teknologi kecerdasan buatan.
            </p>
          </li>

          <li class="terms-section">
            <div class="terms-section-title">Ketentuan Manfaat</div>
            <p class="terms-paragraph">Pengguna yang memiliki hak atas suku pokok drone berhak memperoleh manfaat berupa:</p>
            <ul class="terms-bullets">
              <li>Pendapatan operasional berdasarkan aktivitas drone</li>
              <li>Akses terhadap sistem pemantauan dan kontrol drone</li>
              <li>Pembaruan sistem dan peningkatan performa berbasis AI</li>
              <li>Dukungan teknis selama masa operasional</li>
            </ul>
            <p class="terms-paragraph">
              Manfaat diberikan sesuai dengan tingkat produk (level drone) dan durasi penggunaan.
            </p>
          </li>

          <li class="terms-section">
            <div class="terms-section-title">Hasil yang Diharapkan</div>
            <p class="terms-paragraph">Dengan kepemilikan hak suku pokok drone, pengguna diharapkan memperoleh:</p>
            <ul class="terms-bullets">
              <li>Pendapatan yang stabil dari aktivitas operasional</li>
              <li>Efisiensi dalam pemanfaatan teknologi drone</li>
              <li>Transparansi dalam pemantauan kinerja</li>
              <li>Pengalaman penggunaan sistem berbasis AI yang terintegrasi</li>
            </ul>
          </li>

          <li class="terms-section">
            <div class="terms-section-title">Alokasi Dana</div>
            <p class="terms-paragraph">Dana yang dialokasikan dalam sistem ini digunakan untuk:</p>
            <ul class="terms-bullets">
              <li>Operasional drone dan pemeliharaan perangkat</li>
              <li>Pengembangan teknologi kecerdasan buatan</li>
              <li>Infrastruktur sistem dan server</li>
              <li>Pengelolaan data pemetaan dan analisis</li>
            </ul>
            <p class="terms-paragraph">
              Alokasi dilakukan secara terstruktur untuk menjaga keberlangsungan sistem.
            </p>
          </li>

          <li class="terms-section">
            <div class="terms-section-title">Risiko dan Pengungkapan</div>
            <p class="terms-paragraph">
              Pengguna memahami bahwa terdapat risiko dalam penggunaan sistem, termasuk namun tidak terbatas pada:
            </p>
            <ul class="terms-bullets">
              <li>Gangguan teknis atau operasional</li>
              <li>Perubahan kondisi lingkungan (cuaca, sinyal, dll)</li>
              <li>Fluktuasi hasil operasional</li>
              <li>Risiko sistem atau jaringan</li>
            </ul>
            <p class="terms-paragraph">
              Dengan ini pengguna menyatakan telah memahami dan menerima seluruh risiko yang ada.
            </p>
          </li>

          <li class="terms-section">
            <div class="terms-section-title">Kepemilikan dan Strategi Keluar</div>
            <p class="terms-paragraph">
              Hak atas suku pokok drone bersifat terbatas pada periode penggunaan yang telah ditentukan.
            </p>
            <p class="terms-paragraph">Pengguna memiliki opsi untuk:</p>
            <ul class="terms-bullets">
              <li>Mengakhiri penggunaan setelah periode selesai</li>
              <li>Melanjutkan dengan pembaruan periode</li>
              <li>Menghentikan partisipasi sesuai ketentuan sistem</li>
            </ul>
          </li>

          <li class="terms-section">
            <div class="terms-section-title">Hak dan Tanggung Jawab Pihak Penerima Suku Pokok</div>
            <p class="terms-paragraph">Pengguna memiliki hak untuk:</p>
            <ul class="terms-bullets">
              <li>Mengakses informasi operasional secara transparan</li>
              <li>Menerima manfaat sesuai ketentuan</li>
              <li>Mendapatkan dukungan sistem</li>
            </ul>
            <p class="terms-paragraph">Pengguna juga bertanggung jawab untuk:</p>
            <ul class="terms-bullets">
              <li>Menggunakan sistem sesuai aturan</li>
              <li>Tidak menyalahgunakan platform</li>
              <li>Mematuhi kebijakan yang berlaku</li>
            </ul>
          </li>

          <li class="terms-section">
            <div class="terms-section-title">Kepatuhan Hukum dan Peraturan, Izin dan Persetujuan</div>
            <p class="terms-paragraph">
              SENT beroperasi dengan mengacu pada ketentuan hukum dan peraturan yang berlaku.
            </p>
            <p class="terms-paragraph">Pengguna dengan ini menyatakan:</p>
            <ul class="terms-bullets">
              <li>Menyetujui seluruh syarat dan ketentuan</li>
              <li>Memahami kebijakan penggunaan sistem</li>
              <li>Memberikan persetujuan atas pemrosesan data yang diperlukan</li>
            </ul>
          </li>
        </ol>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="footer">
      <div class="footer-bg">
        <div class="footer-content">
          <div class="price-info">
            <span class="price-label">Harga sewa</span>
            <span class="price-value">{{ priceTextUpper }}</span>
          </div>
          <button class="btn-pay" type="button" @click="openPurchaseModal" :disabled="isPurchasing">
            Membayar dan menerima seluruh ketentuan
          </button>
        </div>
      </div>
    </section>

    <teleport to="body">
      <div v-if="showPurchaseModal" class="purchase-modal-overlay" @click.self="showPurchaseModal = false">
        <div class="purchase-modal">
          <div class="purchase-modal-title">Status</div>
          <div class="purchase-modal-desc">Apakah akan membayar dan menerima seluruh ketentuan?</div>
          <div class="purchase-modal-actions">
            <button type="button" class="purchase-btn cancel" @click="showPurchaseModal = false" :disabled="isPurchasing">Membatalkan</button>
            <button type="button" class="purchase-btn ok" @click="confirmPurchase" :disabled="isPurchasing">OK</button>
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
import { resolveImageUrl } from '@/utils/imageCache'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()

const product = ref(null)
const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
const isLoading = ref(false)
const showPurchaseModal = ref(false)
const isPurchasing = ref(false)
const successModalOpen = ref(false)
const errorModalOpen = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const redirectInvestmentId = ref(null)
const redirectInvestmentData = ref(null)

const productBlobUrl = ref('')

const fetchImageAsBlob = async (url) => {
  if (!url) return
  const resolved = resolveImageUrl(url)
  try {
    const resp = await fetch(resolved)
    if (!resp.ok) throw new Error('Failed to fetch image')
    const blob = await resp.blob()
    const blobUrl = URL.createObjectURL(blob)
    productBlobUrl.value = blobUrl
  } catch (err) {
    console.error('Error loading blob image:', err)
  }
}

watch(
  () => product.value?.image,
  (url) => {
    if (url) {
      fetchImageAsBlob(url)
    }
  }
)

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(n)) return null
  return n
}

const formatNumber = (value) => {
  const n = parseNumber(value)
  if (n === null) return '-'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

const productTitle = computed(() => product.value?.name || 'Drone')

const productImage = computed(() => {
  if (productBlobUrl.value) return productBlobUrl.value
  const raw = String(product.value?.image || '').trim()
  if (!raw) return ''
  return String(resolveImageUrl(raw) || '').trim()
})

const onImageError = (e) => {
  const el = e?.target
  if (!el || !el.src) return
  el.alt = ''
  el.src = transparentPixel
  el.style.opacity = '0'
}

const durationText = computed(() => {
  const d = parseNumber(product.value?.duration)
  if (d === null) return '-'
  return `${d}D`
})

const priceText = computed(() => {
  const p = parseNumber(product.value?.price)
  if (p === null) return 'Rp -'
  return `Rp ${formatNumber(p)}`
})

const priceTextUpper = computed(() => {
  const p = parseNumber(product.value?.price)
  if (p === null) return 'RP -'
  return `RP ${formatNumber(p)}`
})

const capacityText = computed(() => {
  const limit = parseNumber(product.value?.purchase_limit)
  if (limit === null) return '1Ha'
  return `${Math.max(1, Math.round(limit))}Ha`
})

const profitText = computed(() => {
  const profitType = String(product.value?.profit_type || '').toLowerCase()
  if (profitType === 'random') {
    const min = parseNumber(product.value?.profit_random_min)
    const max = parseNumber(product.value?.profit_random_max)
    if (min !== null && max !== null) return `Rp${formatNumber(min)} ~ Rp${formatNumber(max)}`
    if (min !== null) return `Rp${formatNumber(min)} ~ Rp${formatNumber(min)}`
  }
  const rate = parseNumber(product.value?.profit_rate)
  if (rate !== null && rate > 0) return `Rp${formatNumber(rate)}`
  return 'Rp-'
})

const availabilityText = computed(() => {
  const enabled = product.value?.stock_enabled
  const stock = parseNumber(product.value?.stock)
  if (enabled && stock !== null && stock <= 0) return 'Stok habis'
  return 'Menunggu pelayanan'
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

onBeforeUnmount(() => {
  if (productBlobUrl.value) {
    URL.revokeObjectURL(productBlobUrl.value)
  }
})

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
    // Gunakan id (PK) sebagai prioritas utama
    redirectInvestmentId.value = inv?.id ?? inv?.investment_id ?? null
    redirectInvestmentData.value = inv || null
    successMessage.value = 'Drone telah ditambahkan ke akun Anda.'
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
  redirectInvestmentData.value = null
  if (id) {
    router.push(`/pages/account/panel/${id}`)
    return
  }
  router.push('/pages/account/panel')
}
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
  background-color: #000;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.app-container {
  --primary-bg: #1d2138;
  --text-white: #ffffff;
  --text-gray: #adadad;
  --text-light-gray: #c2c2c2;
  --text-dim: #b7b7b7;
  --accent-purple: #746a9a;
  width: 100%;
  max-width: 412px;
  background-color: var(--primary-bg);
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

img {
  display: block;
  max-width: 100%;
}

h1, h2, h3, p {
  margin: 0;
}

/* Header Section */
#header {
  padding: 13px 20px;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-back {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-white);
  flex: 1;
  text-align: center;
  margin-right: 24px;
}

.purchase-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.purchase-modal {
  width: 100%;
  max-width: 320px;
  background: #1d2138;
  border-radius: 10px;
  padding: 14px 14px 12px;
}

.purchase-modal-title {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 8px;
}

.purchase-modal-desc {
  text-align: left;
  font-size: 12px;
  color: rgba(255,255,255,0.75);
  line-height: 1.4;
  margin-bottom: 12px;
}

.purchase-modal-input-wrap {
  width: 100%;
  margin-bottom: 10px;
}

.purchase-modal-input {
  width: 100%;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(0,0,0,0.2);
  color: #ffffff;
  font-size: 12px;
  padding: 0 12px;
  outline: none;
}

.purchase-modal-error {
  text-align: center;
  font-size: 11px;
  color: rgba(255,120,120,0.95);
  margin-bottom: 10px;
}

.purchase-modal-actions {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.purchase-btn {
  flex: 1;
  height: 34px;
  border-radius: 8px;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
}

.purchase-btn.cancel {
 background-color: #5d5d5d;
  color: rgba(255,255,255,0.85);
}

.purchase-btn.ok {
  background: rgba(153,153,255,0.6);
  color: #ffffff;
}

/* Hero Section */
#hero {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.hero-image-container {
  width: 233px;
  height: 155px;
  position: relative;
}

.hero-drone {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Status Section */
#status {
  padding: 0 20px;
  margin-top: 20px;
}

.section-label {
  font-size: 12px;
  color: var(--text-gray);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.drone-card {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.drone-thumb {
  width: 120px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.drone-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drone-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.drone-name {
  font-size: 14px;
  color: var(--text-white);
  font-weight: 600;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 10px;
  color: var(--text-white);
  height: 17px;
}

.badge-rent {
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid var(--accent-purple);
}

.badge-status {
  background-color: #1d2138;
  border: 1px solid var(--accent-purple);
  border-radius: 2px;
}

.divider {
  height: 1px;
  background-color: var(--accent-purple);
  opacity: 0.3;
  width: 100%;
  margin-top: 10px;
}

/* Stats Section */
#stats {
  padding: 20px 20px;
}

.stats-title {
  font-size: 14px;
  color: var(--text-light-gray);
  margin-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: linear-gradient(180deg, rgba(15, 11, 46, 1) 0%, rgba(43, 27, 111, 1) 100%);
  border-radius: 2px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 57px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
}

.stat-label {
  font-size: 10px;
  color: var(--text-light-gray);
  margin-bottom: 4px;
  text-align: center;
}

.stat-value {
  font-size: 11px;
  color: var(--text-white);
  font-weight: 600;
  text-align: center;
}

/* Terms Section */
#terms {
  padding: 0 20px 140px 20px;
}

.terms-title {
  font-size: 14px;
  color: var(--text-white);
  margin-bottom: 12px;
  font-weight: 600;
}

.terms-content {
  font-size: 12px;
  color: var(--text-dim);
  line-height: 1.6;
  text-align: justify;
}

.terms-sections {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.terms-sections > li::marker {
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
}

.terms-section-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 6px;
}

.terms-paragraph {
  margin: 0 0 8px;
}

.terms-paragraph:last-child {
  margin-bottom: 0;
}

.terms-bullets {
  margin: 6px 0 8px;
  padding-left: 18px;
}

.terms-bullets li {
  margin: 4px 0;
}

/* Footer Section */
#footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 412px;
  z-index: 10;
}

.footer-bg {
  background-color: #1d2138;
  padding: 16px 20px 24px 20px;
  border-top: 1px solid rgba(116, 106, 154, 0.2);
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  font-size: 14px;
  color: var(--text-white);
}

.price-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-white);
}

.btn-pay {
  width: 100%;
  background-color: #746a9a;
  background: #746a9a;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}
</style>
