<template>
  <div class="app-container">
    
    <!-- Hero Section -->
    <section class="hero">
      <img src="/assets/image/bg.png" alt="Drone Mapping Hero" class="hero-bg">
      <!-- Status Bar Overlapping Hero -->
      <div class="status-bar">
        <div class="status-text">
          <span class="status-dot"></span>
          {{ statusText }}
        </div>
        <div class="status-online">{{ statusOnlineText }}</div>
      </div>
    </section>

    <!-- Quick Actions Section -->
    <section class="quick-actions">
      <div class="section-header">
        <h3 class="section-title">Aksi cepat</h3>
        <div class="section-link" @click="goToInvestments">
          <span>Periksa drone saya</span>
          <img src="/assets/image/120_1292.svg" alt="arrow" class="icon-arrow">
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn btn-primary" type="button" @click="goToMissions">Mulai misi</button>
        <button class="btn btn-secondary" type="button" @click="goToProducts">Sewa drone</button>
      </div>
    </section>

    <!-- Notification Ticker -->
    <section class="ticker-section">
      <div class="ticker-content">
        <img src="/assets/image/126_114.svg" alt="volume" class="icon-volume">
        <div class="ticker-marquee">
          <div class="ticker-marquee-track">
            <span class="ticker-marquee-text">{{ tickerText }}</span>
            <span class="ticker-marquee-text">{{ tickerText }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Progress Card -->
    <section class="progress-card">
      <div class="progress-top">
        <div class="progress-title">
          <img src="/assets/image/bf8b81ef2600b30e06ec0a2ae89fa57be2e4397a.png" alt="Gem" class="gem-icon">
          <span>Progress Penerbangan</span>
        </div>
        <span class="level-text">{{ levelDroneText }}</span>
      </div>

      
      <div class="progress-mid">
        <div class="progress-desc">
          <span>Terbang {{ targetDays }} hari untuk dapatkan</span>
          <span class="reward-inline">
            <img src="/assets/image/bf8b81ef2600b30e06ec0a2ae89fa57be2e4397a.png" alt="Gem" class="gem-inline">
            <span class="progress-reward">Rp {{ rewardText }}</span>
          </span>
        </div>
      </div>

      <div class="progress-bar-row">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
        </div>
            <a class="btn-more" href="/#/pages/account/attendance">
              <span>Lebih banyak</span>
              <img src="/assets/image/120_1292.svg" alt="arrow" class="icon-arrow-small">
            </a>
      </div>

      <div class="progress-pill">Anda sudah aktif bersama kami selama {{ daysActiveText }} hari</div>
    </section>
    

    <!-- Exclusive Grid Section -->
    <section class="exclusive-section">
      <h2 class="gradient-text">Eksklusif untuk Anda</h2>
      <div class="grid-menu">
        <div class="grid-card" role="button" tabindex="0" @click="goToMissions">
          <div class="grid-card-bg">
            <span class="grid-title">Tantangan</span>
          </div>
          <img src="/assets/image/gift 2.png" alt="Tantangan" class="grid-img img-tantangan">
        </div>
        <div class="grid-card" role="button" tabindex="0" @click="goToVoucher">
          <div class="grid-card-bg">
            <span class="grid-title">Menukarkan</span>
          </div>
          <img src="/assets/image/gift 1.png" alt="Menukarkan" class="grid-img img-menukarkan">
        </div>
        <div class="grid-card" role="button" tabindex="0" @click="goToPoints">
          <div class="grid-card-bg">
            <span class="grid-title">Keberuntungan</span>
          </div>
          <img src="/assets/image/gift 3.png" alt="Keberuntungan" class="grid-img img-keberuntungan">
        </div>
      </div>
    </section>

    <!-- Insight Card -->
    <section class="info-card insight-ai-card">
      <div class="insight-header">
        <img src="/assets/image/star.png" alt="Insight AI" class="insight-icon" style="width: 24px;">
        <h3 class="insight-title">Insight AI</h3>
      </div>
      <div class="insight-body">
        <div class="insight-main">Efisiensi pemetaan meningkat 12% dibanding kemarin</div>
        <div class="insight-sub">Tidak ada gangguan - Sistem berjalan normal.</div>
      </div>
    </section>

    <a class="info-card notice-card notice-link" href="/#/pages/account/news">
      <div class="notice-header">
        <div class="notice-title-row">
          <img src="/assets/image/bell.png" alt="bell" class="icon-bell" style="width: 20px;">
          <h3 class="notice-title">Pemberitahuan pesan</h3>
        </div>
        <div class="notice-meta">
          <span class="notice-age">{{ newsAgeText }}</span>
          <img src="/assets/image/120_1292.svg" alt="arrow" class="icon-arrow">
        </div>
      </div>
      <div class="notice-body">
        <div class="notice-headline">{{ newsTitleText }}</div>
        <div class="notice-text">{{ newsBodyText }}</div>
      </div>
    </a>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-logo-row">
        <img src="/assets/image/983276.png" alt="OT-Sent Logo" class="footer-logo">
        <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
      </div>
      <p class="footer-desc">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
    </footer>

   
  </div>
  <FooterBar />
</template>

<script setup>
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FooterBar from '@/components/partials/FooterBar.vue'
import { authAPI, attendanceAPI, newsAPI } from '@/services/api'

const router = useRouter()

const activeInvestmentsCount = ref(0)
const accountCreatedAt = ref(null)
const currentRank = ref(null)
const currentTitle = ref(null)
const latestNews = ref(null)
const attendanceStatus = ref(null)
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)

const tickerText = ref('Por favor, complete algumas missões disponíveis abaixo para obter muita sorte para você')
const targetDays = 14
const rewardAmount = 15000

const statusOnlineText = computed(() => `${activeInvestmentsCount.value} Drone Online`)
const statusText = computed(() => {
  if (activeInvestmentsCount.value > 0) return 'Drone sedang aktif saat ini'
  return 'Tidak ada drone aktif'
})

const toNumber = (value) => {
  const n = Number(String(value ?? 0).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const attendanceDaysActive = computed(() => {
  const d = attendanceStatus.value || {}
  const cycleDay = toNumber(d.cycle_day)
  if (cycleDay > 0) return cycleDay
  const streak = toNumber(d.streak ?? d.streak_count ?? d.current_streak ?? d.current_streak_count)
  if (streak > 0) return streak
  return 0
})

const daysActive = computed(() => {
  if (attendanceDaysActive.value > 0) return attendanceDaysActive.value
  if (!accountCreatedAt.value) return 0
  const d = new Date(accountCreatedAt.value)
  if (Number.isNaN(d.getTime())) return 0
  const diffMs = Date.now() - d.getTime()
  return Math.max(0, Math.floor(diffMs / 86400000))
})

const daysActiveText = computed(() => String(daysActive.value))

const progressPercent = computed(() => {
  if (!targetDays) return 0
  return Math.max(0, Math.min(100, Math.round((daysActive.value / targetDays) * 100)))
})

const rewardText = computed(() => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(rewardAmount))
const levelDroneText = computed(() => {
  const r = currentRank.value
  const title = String(currentTitle.value || '').trim()
  if (title) return `Level drone: ${title}`
  if (r === null || r === undefined || r === '') return 'Level drone: -'
  const n = Number(r)
  if (!Number.isFinite(n)) return `Level drone: ${String(r)}`
  return `Level drone: V${n}`
})

const newsTitleText = computed(() => {
  const title = String(latestNews.value?.title || '').trim()
  return title || 'Belum ada berita'
})

const newsBodyText = computed(() => {
  const body = String(latestNews.value?.body || '').replace(/\s+/g, ' ').trim()
  if (!body) return 'Silakan cek halaman berita untuk info terbaru.'
  return body.length > 70 ? `${body.slice(0, 70)}...` : body
})

const newsAgeText = computed(() => {
  const raw = latestNews.value?.published_at || latestNews.value?.updated_at || null
  if (!raw) return '-'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return '-'
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (diffDays <= 0) return 'Hari ini'
  return `${diffDays} hari lalu`
})

const fetchAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    const n = Number(resp?.data?.active_investments_count ?? 0)
    activeInvestmentsCount.value = Number.isFinite(n) ? n : 0
    accountCreatedAt.value = resp?.data?.created_at || null
  } catch (_) {
    activeInvestmentsCount.value = 0
    accountCreatedAt.value = null
  }
}

const fetchLatestNews = async () => {
  try {
    const resp = await newsAPI.getNews({ page: 1 })
    const results = Array.isArray(resp?.data?.results) ? resp.data.results : []
    const published = results.filter((x) => x && (x.is_published === undefined || x.is_published === true))
    published.sort((a, b) => {
      const ad = new Date(a?.published_at || a?.updated_at || 0).getTime()
      const bd = new Date(b?.published_at || b?.updated_at || 0).getTime()
      return bd - ad
    })
    latestNews.value = published[0] || results[0] || null
  } catch (_) {
    latestNews.value = null
  }
}

const fetchRankStatus = async () => {
  try {
    const resp = await authAPI.getRankStatus()
    currentRank.value = resp?.data?.current_rank ?? null
    currentTitle.value = resp?.data?.current_title ?? null
  } catch (_) {
    currentRank.value = null
    currentTitle.value = null
  }
}

const fetchAttendanceStreak = async () => {
  try {
    const resp = await attendanceAPI.getStreak()
    attendanceStatus.value = resp?.data || null
  } catch (_) {
    attendanceStatus.value = null
  }
}

const goToProducts = () => {
  router.push('/pages/account/products')
}

const goToMissions = () => {
  router.push('/pages/account/missions')
}

const goToVoucher = () => {
  router.push('/pages/account/rewards')
}

const goToAttendance = () => {
  router.push('/pages/account/attendance')
}

const goToPoints = () => {
  router.push('/pages/account/bonus')
}

const goToInvestments = () => {
  router.push('/pages/account/panel')
}

const refreshDashboardData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    await Promise.all([
      fetchAccountInfo(),
      fetchRankStatus(),
      fetchLatestNews(),
      fetchAttendanceStreak()
    ])
  } finally {
    lastRefreshedAt.value = Date.now()
    isRefreshing.value = false
  }
}

onMounted(() => {
  refreshDashboardData()
})

onActivated(() => {
  const now = Date.now()
  if (now - lastRefreshedAt.value < 300) return
  refreshDashboardData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #050510;
  color: #ffffff;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

img {
  max-width: 100%;
  display: block;
}

h1, h2, h3, p {
  margin: 0;
}

.material-icons {
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* App Container */
.app-container {
  width: 100%;
  max-width: 412px;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  position: relative;
  padding-bottom: 80px;
  overflow-x: hidden;
}

.notice-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

/* Hero */
.hero {
  position: relative;
  width: 100%;
  height: 195px;
}

.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.status-bar {
  position: absolute;
  bottom: -18px;
  left: 16px;
  right: 16px;
  height: 36px;
  background: linear-gradient(90deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(137, 137, 137, 0.25);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  font-size: 12px;
}

.status-text {
  background: linear-gradient(90deg, #8265e3 0%, #8a77c9 35%, #9085b5 62%, #8c6cff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #4ade80;
  border-radius: 50%;
  display: inline-block;
}

.status-online {
  color: #c4c4c4;
  font-size: 11px;
}

/* Quick Actions */
.quick-actions {
  margin-top: 35px;
  padding: 0 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-title {
  font-size: 14px;
  color: #c4c4c4;
  font-weight: 500;
}

.section-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #777777;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  height: 37px;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0px 4px 30px rgba(0, 0, 0, 0.3);
}

.btn-primary {
  background: linear-gradient(180deg, #0f0b2e 0%, #2b1b6f 100%);
}

.btn-secondary {
  background-color: #736da6;
  border: 0.5px solid #6975ae;
}

/* Ticker */
.ticker-section {
  margin: 15px 16px;
  height: 29px;
  background: linear-gradient(90deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border-radius: 2px;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.ticker-content {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.ticker-marquee {
  flex: 1;
  overflow: hidden;
}

.ticker-marquee-track {
  display: flex;
  width: max-content;
  animation: tickerScroll 14s linear infinite;
  gap: 28px;
  will-change: transform;
}

.ticker-marquee-text {
  font-size: 10px;
  color: #c4c4c4;
  white-space: nowrap;
}

@keyframes tickerScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Progress Card */
.progress-card {
  margin: 0 16px 15px;
  background: linear-gradient(180deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(158, 158, 158, 0.25);
  padding: 12px 14px;
  position: relative;
  
}

.progress-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.progress-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}

.gem-icon {
  width: 32px;
  margin-left: -20px;
margin-top: -4px;
  height: auto;
}

.level-text {
  font-size: 11px;
  color: #c4c4c4;
}

.progress-mid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  
  margin-bottom: 10px;
}

.progress-desc {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  
  gap: 6px;
  font-size: 11px;
  color: rgba(255,255,255,0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.reward-inline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.gem-inline {
  width: 14px;
  height: 14px;
}

.progress-reward {
  color: #a296ff;
  font-weight: 600;
}

.progress-bar-row {
  display: flex;
  
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 0px;
}

.progress-track {
  height: 4px;
  border-radius: 10px;
  background: rgba(255,255,255,0.12);
  overflow: hidden;
  width: 70%;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 31%, #9047e0 100%);
}

.progress-pill {
  height: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px;
 
  color: rgba(255,255,255,0.85);
  font-size: 10px;

  width: 70%;
  margin-top: 0;
  align-self: flex-end;
}

.btn-more {
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 31%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  color: white;
  font-size: 10px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  white-space: nowrap;
}

.icon-arrow-small {
  width: 12px;
  height: 12px;
}

/* Exclusive Grid */
.exclusive-section {
  margin: 0 16px 15px;
}

.gradient-text {
  background: linear-gradient(90deg, #8265e3 0%, #8a77c9 35%, #9085b5 62%, #8c6cff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 14px;
  margin-bottom: 12px;
}

.grid-menu {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.grid-card {
  position: relative;
  height: 144px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
}

.grid-card-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border-radius: 10px;
  padding-top: 12px;
  text-align: center;
}

.grid-title {
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-align: left;
}

.grid-img {
  position: absolute;
  bottom: 0;
  z-index: 2;
}

.img-tantangan {
  width: 90%;
  bottom: 10px;
}

.img-menukarkan {
  width: 85%;
  bottom: 0px;
}

.img-keberuntungan {
  width: 80%;
  bottom: 10px;
}

/* Info Cards */
.info-card {
  margin: 0 16px 12px;
  background: linear-gradient(180deg, #0f0b2e 0%, #2b1b6f 100%);
  border-radius: 10px;
  box-shadow: inset 0px 4px 30px rgba(0, 0, 0, 0.3);
  padding: 14px;
}

 .insight-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.insight-icon {
  font-size: 18px;
  color: rgba(180, 160, 255, 1);
}

.insight-title {
  font-size: 13px;
  color: #ffffff;
  font-weight: 600;
}

.insight-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.insight-main {
  font-size: 12px;
  color: rgba(255,255,255,0.9);
  line-height: 1.35;
}

.insight-sub {
  font-size: 10px;
  color: rgba(255,255,255,0.65);
  line-height: 1.35;
}

.notice-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.notice-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.notice-icon {
  font-size: 18px;
  color: rgba(180, 160, 255, 1);
}

.notice-title {
  font-size: 12px;
  color: rgba(255,255,255,0.9);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.55);
  font-size: 10px;
  white-space: nowrap;
}

.notice-chevron {
  font-size: 14px;
  color: rgba(255,255,255,0.55);
}

.notice-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.notice-headline {
  font-size: 14px;
  color: #ffffff;
  font-weight: 500;
}

.notice-text {
  font-size: 11px;
  color: rgba(255,255,255,0.7);
}

.news-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon-small {
  width: 20px;
  height: auto;
}

.news-title-group h3 {
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.news-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #777777;
}

.icon-calendar {
  width: 14px;
  height: 14px;
}

.news-headline {
  font-size: 15px;
  margin-bottom: 4px;
}

.news-snippet {
  font-size: 12px;
  color: #c4c4c4;
}

/* Footer */
.site-footer {
  padding: 20px 16px;
  margin-bottom: 20px;
}

.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.footer-logo {
  height: 24px;
  width: auto;
}

.copyright {
  font-size: 11px;
  color: white;
}

.footer-desc {
  font-size: 11px;
  color: #c4c4c4;
}
</style>
