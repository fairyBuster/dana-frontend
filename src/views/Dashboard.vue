<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <header class="main-header">
        <div class="top-bar">
          <router-link class="user-pill" to="/settings">
            <div class="user-info">
              <span class="greeting">Hai, {{ username }}</span>
              <span class="phone">{{ phoneDisplay }}</span>
            </div>
            <img src="/assets/images/2010_761.svg" alt="Dropdown" class="icon-dropdown">
          </router-link>
          <router-link to="/news" class="notification-area">
            <div class="notification-icon-wrapper">
              <img src="/assets/images/cb42829baac29d56fa551a762cf2ae5608e0f23c.png" alt="Notification">
            </div>
            <span class="notification-text">Pemberitahuan</span>
          </router-link>
        </div>

        <div class="balance-container">
          <div class="main-balance-area">
            <div class="balance-label-row">
              <span class="label-text">Saldo Utama</span>
              <img src="/assets/images/2013_1238.svg" alt="Toggle Visibility" class="icon-eye" @click="toggleBalanceVisibility">
            </div>
            <div class="main-amount">{{ balanceDisplay }}</div>
          </div>
          <div class="today-balance-area">
            <span class="label-text">Saldo hari ini</span>
            <span class="today-amount">{{ todayBalanceDisplay }}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn-primary" @click="goToDeposit">Deposito</button>
          <button class="btn-secondary" @click="goToWithdraw">Tarik Uang</button>
        </div>
      </header>
    </section>

    <!-- Spacer Section -->
    <section id="section-spacer">
      <img src="/assets/images/image 85.png" alt="Spacer" class="icon-spacer">
    </section>

    <!-- Menu Section -->
    <section id="section-menu">
      <div class="menu-section-wrapper">
        <div class="announcement-bar">
          <img src="/assets/images/13_158.svg" alt="Speaker" class="icon-speaker">
          <div class="announcement-marquee" aria-label="Selamat datang di TRIVEX">
            <div class="marquee-track">
              <span class="announcement-text">Selamat datang di TRIVEX</span>
                  </div>
          </div>
        </div>

        <div class="quick-actions-grid">
          <router-link to="/dep" class="action-item">
            <img src="/assets/images/c1cce73b33fa2a2b6bc94e7f2b82bd66e20b9fa9.png" alt="Deposito">
            <span>Deposito</span>
          </router-link>
          <router-link to="/flow" class="action-item">
            <img src="/assets/images/d634ba55ee38309526b6d657b8e1a5a382ef7c60.png" alt="Tarik dana">
            <span>Tarik dana</span>
          </router-link>
          <router-link to="/about" class="action-item">
            <img src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Tentang kami">
            <span>Tentang kami</span>
          </router-link>
          <router-link to="/support" class="action-item">
            <img src="/assets/images/a45539f924d91cd414fa3d9c7ba05b2beb121149.png" alt="Layanan umum">
            <span>Layanan umum</span>
          </router-link>
          <router-link to="/share" class="action-item">
            <img src="/assets/images/1be34f61fca8018ee484cfa57216986588de26b2.png" alt="Kartu undangan">
            <span>Kartu<br>undangan</span>
          </router-link>
          <a href="/assets/android/trivex.apk" download="trivex.apk" class="action-item">
            <img src="/assets/images/6a724b73fb2c46483c7c2b348fcdc144d1a30b46.png" alt="Aplikasi kami">
            <span>Aplikasi kami</span>
          </a>
          <router-link to="/informations/options" class="action-item">
            <img src="/assets/images/334cb4459143d492b5a8194e9812907fd3771af9.png" alt="Riwayat transaksi">
            <span>Riwayat<br>transaksi</span>
          </router-link>
          <router-link to="/sign" class="action-item">
            <img src="/assets/images/942258d392b49b3593405d1bc54bedbd3b192e38.png" alt="Hadiah harian">
            <span>Hadiah<br>harian</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Banners Section -->
    <section id="section-banners">
      <div class="voucher-banner" @click="openVoucherModal">
        <div class="banner-text-content">
          <h3 class="banner-title">Memiliki voucher?</h3>
          <p class="banner-subtitle">Tukar kode voucher Anda disini</p>
        </div>
      </div>
      
      <div class="portfolio-banner" @click="goToPortfolio">
        <div class="banner-text-content">
          <h3 class="banner-title">Periksa portofolio saya</h3>
          <p class="banner-subtitle">Kembangkan asetmu di TRIVEX sekarang!</p>
        </div>
        <button class="btn-icon-round">
          <img src="/assets/images/2010_761.svg" alt="Arrow">
        </button>
      </div>
    </section>

    <!-- Chart Section -->
    <section id="section-chart">
      <div class="chart-section-wrapper">
        <div class="partners-logos">
          <img src="/assets/images/image 61 (2).png" alt="Bappebti" class="logo-bappebti">
          <img src="/assets/images/a648e454f7e6e93caec0f833a59b7dcec155605e.png" alt="OJK" class="logo-ojk">
        </div>

        <div class="chart-card">
          <div class="chart-image-container">
            <svg
              v-if="chartReady"
              class="main-chart-img"
              viewBox="0 0 300 120"
              preserveAspectRatio="none"
              aria-label="Grafik investor bulanan"
            >
              <defs>
                <linearGradient id="chartFillGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(21, 178, 92, 0.28)" />
                  <stop offset="100%" stop-color="rgba(21, 178, 92, 0)" />
                </linearGradient>
                <filter id="chartShadowGreen" x="-20%" y="-40%" width="140%" height="200%">
                  <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#15B25C" flood-opacity="0.35" />
                </filter>
              </defs>
              <path :d="chartAreaPath" fill="url(#chartFillGreen)" />
              <path :d="chartLinePath" stroke="#15B25C" stroke-width="3" fill="none" filter="url(#chartShadowGreen)" />
            </svg>
            <img v-else src="/assets/images/2012_1128.svg" alt="Chart" class="main-chart-img">
          </div>
          <div class="chart-x-axis">
            <span v-for="m in chartMonthLabels" :key="m">{{ m }} </span>
          </div>
        </div>

        <div class="chart-footer">
          <span class="chart-title">{{ chartTitle }}</span>
        </div>
      </div>
    </section>
  </div>
  <VoucherModal v-model="isVoucherModalOpen" @submit="handleVoucherSubmit" />
  <AnnouncementModal v-model="isAnnouncementOpen" />
  <FooterBar />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FooterBar from '@/components/partials/FooterBar.vue'
import VoucherModal from '@/components/modals/VoucherModal.vue'
import AnnouncementModal from '@/components/modals/AnnouncementModal.vue'
import { authAPI } from '@/services/api'

const router = useRouter()

const username = ref('Username')
const phone = ref('+•••••••')
const mainBalance = ref(0)
const todayBalance = ref(0)
const isBalanceVisible = ref(false)
const isVoucherModalOpen = ref(false)
const isAnnouncementOpen = ref(false)
const investorsMonthly = ref([])
const chartMonthLabels = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'])
const isChartLoading = ref(false)

const phoneDisplay = computed(() => phone.value)

const balanceDisplay = computed(() => {
  if (isBalanceVisible.value) {
    return `Rp ${new Intl.NumberFormat('id-ID').format(mainBalance.value)}`
  }
  return 'Rp *******'
})

const todayBalanceDisplay = computed(() => {
  if (isBalanceVisible.value) {
    return `Rp${new Intl.NumberFormat('id-ID').format(todayBalance.value)}`
  }
  return 'Rp*******'
})

const toggleBalanceVisibility = () => {
  isBalanceVisible.value = !isBalanceVisible.value
}

const toAmount = (value) => {
  const n = Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const fetchAccountInfo = async () => {
  try {
    const [accountRes, statsRes] = await Promise.allSettled([
      authAPI.getAccountInfo(),
      authAPI.getBalanceStatistics('today')
    ])

    if (accountRes.status === 'fulfilled') {
      const data = accountRes.value?.data || {}
      username.value = data?.username || 'Username'
      phone.value = data?.phone || '+62 81239402453'
      mainBalance.value = toAmount(data?.balance ?? 0)
    }

    if (statsRes.status === 'fulfilled') {
      const stats = statsRes.value?.data || {}
      todayBalance.value = toAmount(stats?.total_income ?? 0)
    }
  } catch (_) {
    // Use defaults
  }
}

const formatYYYYMM = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

const getLastMonths = (count = 6) => {
  const end = new Date()
  end.setDate(1)
  const months = []
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(end)
    d.setMonth(d.getMonth() - i)
    months.push(formatYYYYMM(d))
  }
  return months
}

const monthLabel = (yyyyMm) => {
  const [y, m] = String(yyyyMm || '').split('-')
  const mm = Number(m || 0)
  const date = new Date(Number(y || 2000), Math.max(0, mm - 1), 1)
  const label = date.toLocaleString('en-US', { month: 'short' })
  return label.replace('.', '')
}

const chartTitle = computed(() => {
  const labels = chartMonthLabels.value || []
  const list = investorsMonthly.value || []
  
  if (labels.length === 0 || list.length === 0) {
    return 'Data investor 6 bulan terakhir'
  }
  
  // Ambil tahun dari data bulan (format YYYY-MM)
  const startYear = list[0].month.split('-')[0]
  const endYear = list[list.length - 1].month.split('-')[0]
  const yearDisplay = endYear || startYear

  return `Data investor ${labels[0]} - ${labels[labels.length - 1]} ${yearDisplay}`
})

const fetchInvestorsMonthly = async () => {
  isChartLoading.value = true
  try {
    // Panggil API tanpa start/end tetap untuk mendapatkan data terbaru dari server
    const resp = await authAPI.getInvestorsMonthly()
    const points = Array.isArray(resp?.data?.points) ? resp.data.points : []
    
    // Ambil maksimal 6 data terakhir (sliding window)
    const lastSixPoints = points.slice(-6)
    
    // Update data investor dan label bulan berdasarkan respon API
    investorsMonthly.value = lastSixPoints.map((p) => ({
      month: String(p?.month || ''),
      total_investors: Number(p?.total_investors || 0)
    }))
    
    chartMonthLabels.value = lastSixPoints.map((p) => monthLabel(p.month))
  } catch (_) {
    investorsMonthly.value = []
    chartMonthLabels.value = []
  } finally {
    isChartLoading.value = false
  }
}

const chartValues = computed(() => {
  const list = investorsMonthly.value || []
  if (list.length > 0) return list.map((p) => Number(p?.total_investors || 0))
  return [0, 0, 0, 0, 0, 0]
})

const chartPoints = computed(() => {
  const values = chartValues.value
  const count = values.length
  const w = 300
  const h = 120
  const padX = 8
  const padTop = 12
  const padBottom = 18
  const innerW = w - padX * 2
  const innerH = h - padTop - padBottom
  const max = Math.max(1, ...values)
  
  return values.map((v, idx) => {
    const x = padX + (innerW * idx) / Math.max(1, count - 1)
    const y = padTop + innerH * (1 - v / max)
    return { x, y }
  })
})

const chartLinePath = computed(() => {
  const pts = chartPoints.value
  if (!pts.length) return ''
  if (pts.length < 2) return ''
  const path = [`M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`]
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    path.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    )
  }
  return path.join(' ')
})

const chartAreaPath = computed(() => {
  const pts = chartPoints.value
  if (!pts.length) return ''
  const baseY = 120 - 18
  if (pts.length < 2) return ''
  const path = [`M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`]
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    path.push(
      `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    )
  }
  path.push(`L ${pts[pts.length - 1].x.toFixed(2)} ${baseY}`)
  path.push(`L ${pts[0].x.toFixed(2)} ${baseY}`)
  path.push('Z')
  return path.join(' ')
})

const chartReady = computed(() => !isChartLoading.value && (investorsMonthly.value || []).length > 0)

const goToDeposit = () => {
  router.push('/dep')
}

const goToWithdraw = () => {
  router.push('/flow')
}

const goToPortfolio = () => {
  router.push('/portfolio')
}

const openVoucherModal = () => {
  isVoucherModalOpen.value = true
}

const handleVoucherSubmit = () => {
  isVoucherModalOpen.value = false
}

onMounted(() => {
  isAnnouncementOpen.value = true
  fetchAccountInfo()
  fetchInvestorsMonthly()
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  margin: 0 auto;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}

button {
  font-family: inherit;
  cursor: pointer;
}

/* Header Section */
.main-header {
  background-color: #f8f8f8;
  padding: 20px 20px 15px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.user-pill {
  background-color: #004d43;
  border-radius: 25px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.greeting {
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
}

.phone {
  color: #ffffff;
  font-size: 10px;
  opacity: 0.9;
}

.icon-dropdown {
  width: 24px;
  height: 24px;
  rotate: 270deg;
}

.notification-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}

.notification-icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.notification-icon-wrapper img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.notification-text {
  font-size: 10px;
  color: #000000;
}

.balance-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.main-balance-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.balance-label-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-text {
  font-size: 10px;
  color: #000000;
}

.icon-eye {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.main-amount {
  font-size: 18px;
  font-weight: 700;
  color: #de9400;
}

.today-balance-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  text-align: right;
}

.today-amount {
  font-size: 12px;
  font-weight: 600;
  color: #4e733f;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.btn-primary {
  flex: 1;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 10px 0;
  font-size: 12px;
  font-weight: 500;
}

.btn-secondary {
  flex: 1;
  background-color: transparent;
  color: rgba(0, 0, 0, 0.5);
  border: 1px solid #004d43;
  border-radius: 20px;
  padding: 10px 0;
  font-size: 12px;
  font-weight: 500;
}

/* Spacer Section */
#section-spacer {
  width: 100%;
}

.icon-spacer,
.grey-icon-spacer {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  max-height: 140px;
}

/* Menu Section */
.menu-section-wrapper {
  background-color: #f8f8f8;
  padding-top: 15px;
}

.announcement-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 20px;
}

.icon-speaker {
  width: 24px;
  height: 24px;
}

.announcement-text {
  color: #004d43;
  font-size: 14px;
  font-weight: 600;
}

.announcement-marquee {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}

.marquee-track {
  display: inline-block;
  padding-left: 100%;
  animation: announcement-marquee 12s linear infinite;
}

.marquee-gap {
  color: rgba(0, 77, 67, 0.6);
  font-size: 14px;
  font-weight: 600;
}

@keyframes announcement-marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 20px;
  padding: 0 10px 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  gap: 8px;
}

.action-item img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.action-item span {
  color: #000000;
  font-size: 10px;
  text-align: center;
  line-height: 1.2;
}

/* Banners Section */
.voucher-banner {
  background-image: url('/assets/images/eb0223403093bc6b599eb51e245dac92caa46ad3.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 25px 20px;
  min-height: 143px;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.portfolio-banner {
  background: linear-gradient(90deg, #4e733f 0%, #60995b 100%);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  cursor: pointer;
}

.banner-text-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.banner-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.banner-subtitle {
  color: #ffffff;
  font-size: 12px;
  opacity: 0.9;
}

.btn-icon-round {
  width: 44px;
  height: 44px;
  background-color: #004d43;
  border-radius: 50%;
  border: none;
  rotate: 270deg;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.btn-icon-round img {
  width: 24px;
  height: 24px;
}

/* Chart Section */
.chart-section-wrapper {
  background-color: #f8f8f8;
  padding-bottom: 80px;
}

.partners-logos {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
}

.logo-bappebti {
  height: 34px;
  width: auto;
  object-fit: contain;
}

.logo-ojk {
  height: 34px;
  width: auto;
  object-fit: contain;
}

.chart-card {
  background-color: #ffffff;
  border-radius: 10px;
  margin: 0px;


}

.chart-image-container {
  width: 100%;
  margin-bottom: 15px;
}

.main-chart-img {
  width: 100%;
  height: 150px;
  display: block;
}

.chart-x-axis {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

.chart-x-axis span {
  font-size: 10px;
  color: #000000;
}

.chart-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px 20px;
}

.chart-title {
  font-size: 10px;
  color: #000000;
}
</style>

