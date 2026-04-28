<!-- <template>
  <div class="app-container voucher-page">
   
    <section id="app-header" class="container">
      <header class="top-bar">
        <div class="back-button" @click="goBack">
          <img src="/assets/images/2023_1661.svg" alt="Back">
        </div>
        <h1 class="page-title">Menukarkan</h1>
      </header>
    </section>

  
    <section id="hero-section" class="container">
      <div class="hero-content">
        <h2 class="hero-title">Kami punya hadiah untukmu!</h2>
        <div class="hero-image-wrapper">
          <img src="/assets/images/da4151be78469acf27cc0da4d60d3f5fcefd602d.png" alt="Treasure Chest" class="hero-image">
        </div>
        <p class="hero-description">
          Silakan dapatkan kode penukaran dari halaman kegiatan terhubung. Aturan penukaran tunduk pada instruksi platform.
        </p>
      </div>
    </section>

  
    <section id="redeem-card-section" class="container">
      <div class="card-wrapper">
  
        <div class="card-header">
          <div class="diamond-icon">
            <img src="/assets/images/da4151be78469acf27cc0da4d60d3f5fcefd602d.png" alt="Diamond">
          </div>
          <span class="header-text">Masukkan kode di bawah ini</span>
        </div>

        <div class="card-body">
          <div class="input-container">
            <input 
              v-model="voucherCode" 
              type="text" 
              class="code-input" 
              placeholder="Masukkan kode voucher"
            >
          </div>
          <button class="redeem-button" @click="handleRedeem">
            <span class="btn-text">Tukarkan</span>
          </button>
        </div>
      </div>
    </section>


    <section id="history-section" class="container">
      <div class="history-header">
        <h3 class="history-title">Pesanan 15 hari terakhir</h3>
      </div>
      
      <div class="table-header">
        <span class="col-time">Waktu</span>
        <span class="col-accum">Akumulatif</span>
      </div>

      <div class="empty-state">
        <template v-if="transactions.length === 0">
          <div class="empty-image">
            <img src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Empty Box">
          </div>
          <p class="empty-text">Anda belum memiliki apapun</p>
        </template>
        <template v-else>
          <div class="history-list">
            <div v-for="tx in transactions" :key="tx.id" class="history-row">
              <span class="row-time">{{ formatDate(tx.created_at) }}</span>
              <span class="row-amount">{{ formatCurrency(tx.amount) }}</span>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <VoucherSuccessModal v-model="showSuccessModal" :amount="claimedAmount" :title="successTitle" />
</template> -->

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { voucherAPI, transactionAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import VoucherSuccessModal from '@/components/modals/VoucherSuccessModal.vue'

const router = useRouter()
const voucherCode = ref('')
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const claimedAmount = ref(0)
const successTitle = ref('Voucher berhasil diclaim')
const transactions = ref([])

const goBack = () => {
  router.go(-1)
}

const formatCurrency = (value) => {
  const num = Number(String(value ?? 0).replace(/[^0-9.-]/g, ''))
  if (!Number.isFinite(num)) return 'RP 0'
  return 'RP ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(num)
}

const formatDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, segarkan halaman'
  const normalizeText = (msg) => String(msg ?? '').trim()
  const findAnyString = (v) => {
    if (v === null || v === undefined) return ''
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return normalizeText(v)
    if (Array.isArray(v)) {
      for (const item of v) {
        const found = findAnyString(item)
        if (found) return found
      }
      return ''
    }
    if (typeof v === 'object') {
      for (const key of Object.keys(v)) {
        const found = findAnyString(v[key])
        if (found) return found
      }
    }
    return ''
  }

  const mapVoucherErrorToLabel = (message) => {
    const raw = normalizeText(message)
    if (!raw) return ''
    const m = raw.toLowerCase()

    if (m.includes('user invalid')) return 'Kode salah'
    if (m.includes('voucher tidak ditemukan')) return 'Kode salah'
    if (m.includes('nominal voucher tidak valid')) return 'Kode salah'

    if (m.includes('kuota voucher harian telah habis')) return 'Kode habis'
    if (m.includes('voucher telah mencapai batas penggunaan')) return 'Kode habis'
    if (m.includes('anda sudah klaim voucher ini hari ini')) return 'Kode habis'
    if (m.includes('voucher ini sudah digunakan oleh akun anda')) return 'Kode habis'

    if (m.includes('voucher tidak aktif')) return 'Kode tidak aktif'
    if (m.includes('voucher belum dapat diklaim')) return 'Kode tidak aktif'

    if (m.includes('voucher sudah kedaluwarsa') || m.includes('kedaluwarsa')) return 'Kode expired'

    return ''
  }

  const msg =
    (typeof data === 'string' ? normalizeText(data) : '') ||
      normalizeText(data?.error) ||
      normalizeText(data?.detail) ||
      normalizeText(data?.message) ||
      findAnyString(data) ||
      ''

  const mapped = mapVoucherErrorToLabel(msg)
  return mapped || msg || err?.message || 'Permintaan gagal, segarkan halaman'
}

const isVoucherTransaction = (t) => {
  return t?.voucher_id != null || (t?.voucher_code != null && String(t.voucher_code).trim() !== '')
}

const fetchTransactions = async () => {
  try {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 15)
    const pad = (n) => String(n).padStart(2, '0')
    const startStr = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`
    const endStr = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`
    const resp = await transactionAPI.getTransactions({ start_date: startStr, end_date: endStr, page: 1 })
    const data = resp?.data || {}
    const items = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : [])
    transactions.value = items.filter(isVoucherTransaction)
  } catch (_) {
    transactions.value = []
  }
}

const handleRedeem = async () => {
  const code = String(voucherCode.value || '').trim()
  if (!code) {
    showErrorModal.value = true
    errorMessage.value = 'Silakan isi kode terlebih dahulu.'
    return
  }
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const resp = await voucherAPI.claim({ code })
    const data = resp?.data || {}
    const amountRaw = Number(data?.amount ?? 0)
    claimedAmount.value = Number.isFinite(amountRaw) ? amountRaw : 0
    successTitle.value = 'Berhasil menerima bonus'
    showSuccessModal.value = true
    voucherCode.value = ''
    await fetchTransactions()
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.voucher-page {
  --primary-text: #ffffff;
  --secondary-text: #9f9f9f;
  --tertiary-text: #c2c2c2;
  --quaternary-text: #a1a1a1;
  --input-bg: #1d2138;
  --border-color: #746a9a;

  font-family: 'Inter', sans-serif;
  background-color: #0f0f1e;
  background-image: none;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  display: block;
}

.container {
  width: 100%;
  max-width: 412px;
  position: relative;
  overflow: hidden;
}

/* App Header */
#app-header {
  padding-top: 13px;
  padding-bottom: 10px;
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 0px;
  position: relative;
  height: 44px;
}

.back-button {
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 10;
}

.page-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-text);
  pointer-events: none;
}

/* Hero Section */
#hero-section {
  padding-top: 20px;
  padding-bottom: 20px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-text);
  margin: 0 0 14px 0;
}

.hero-image-wrapper {
  width: 154px;
  height: 106px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.hero-description {
  font-size: 12px;
  line-height: 1.5;
  color: var(--secondary-text);
  max-width: 345px;
  margin: 0;
}

/* Redeem Card Section */
#redeem-card-section {
  padding: 24px 16px;
  display: flex;
  justify-content: center;
}

.card-wrapper {
  width: 100%;
  max-width: 380px;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Card Header Part */
.card-header {
  height: 58px;
  background: linear-gradient(90deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  box-shadow: 0px 4px 4px rgba(158, 158, 158, 0.25);
  border-radius: 10px 10px 0 0;
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 36px;
  z-index: 1;
}

.diamond-icon {
  position: absolute;
  left: -17px;
  top: -15px;
  width: 60px;
  height: 54px;
  z-index: 5;
}

.header-text {
  color: var(--primary-text);
  font-size: 14px;
  font-weight: 500;
  margin-left: 10px;
}

/* Card Body Part */
.card-body {
  height: 94px;
  background: linear-gradient(90deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  box-shadow: 0px 4px 4px rgba(158, 158, 158, 0.25);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 0 0 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 11px;
  margin-top: -2px;
  z-index: 2;
}

.input-container {
  flex-grow: 1;
  height: 33px;
  background-color: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.code-input {
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.code-input::placeholder {
  color: #746a9a;
}

.redeem-button {
  height: 22px;
  background: linear-gradient(180deg, #3f48c5 0%, #6135c4 31%, #9047e0 100%);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-width: 95px;
}

.btn-text {
  color: var(--primary-text);
  font-size: 12px;
  font-weight: 600;
}

/* History Section */
#history-section {
  padding: 20px 26px;
  flex-grow: 1;
}

.history-header {
  margin-bottom: 10px;
}

.history-title {
  font-size: 14px;
  color: var(--tertiary-text);
  font-weight: 400;
  margin: 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-right: 0px;
}

.col-time, .col-accum {
  font-size: 12px;
  color: var(--tertiary-text);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5px;
}

.empty-image {
  width: 179px;
  height: 143px;
  margin-bottom: 0px;
}

.empty-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.empty-text {
  font-size: 14px;
  color: var(--quaternary-text);
  margin-top: -10px;
}

.history-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.history-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
 
 
  border-radius: 8px;
}

.row-time {
  color: var(--tertiary-text);
  font-size: 12px;
}

.row-amount {
  color: var(--primary-text);
  font-size: 12px;
  font-weight: 600;
}
</style>
