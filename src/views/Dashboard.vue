<template>
  <div class="mobile-container" translate="no" data-no-translate="true">
    <!-- Header -->
    <section id="section-header">
      <div class="header-container">
        <img src="/assets/images/108294978d9cad25785261933372f80a0602c03d.png" alt="Dana Proteksi Logo" class="header-logo">
        <router-link to="/hn/notifications" class="notification-wrapper" aria-label="Notifikasi">
          <img src="/assets/images/10_54.svg" alt="" class="notif-bg">
          <img src="/assets/images/10_52.svg" alt="Notification" class="notif-icon">
        </router-link>
      </div>
    </section>

    <!-- Greeting -->
    <section id="section-greeting">
      <div class="greeting-container">
        <h1 class="greeting-name">{{ displayUsername }} 👋🏻</h1>
        <p class="greeting-text">Selamat datang!<br>Kelola dana Anda dengan aman.</p>
      </div>
    </section>

    <!-- Total Balance -->
    <section id="section-total-balance">
      <div class="total-balance-card">
        <div class="tb-content">
          <p class="tb-label">Total Saldo</p>
          <h2 class="tb-amount">{{ isBalanceVisible ? totalBalanceDisplay : maskedBalance }}</h2>
        </div>
        <img src="/assets/images/7210a5369195691e3aa63bd1fb6d8c025d233ccc.png" alt="" class="tb-illustration">
        <div class="tb-badge" @click="toggleBalanceVisibility">
          <img src="/assets/images/fa1800cc8068d38a4e791f8733e51b3026dd8546.png" alt="" class="tb-badge-icon">
          <span class="tb-badge-text">Aman & Terproteksi</span>
        </div>
      </div>
    </section>

    <!-- Balance List -->
    <section id="section-balance-list">
      <div class="balance-list-container">
        <!-- Saldo Isi Ulang -->
        <div class="bl-card" @click="goToDeposit">
          <div class="bl-icon-wrapper bg-yellow">
            <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="">
          </div>
          <div class="bl-info">
            <h3 class="bl-title">Saldo Isi Ulang</h3>
            <p class="bl-amount">{{ isBalanceVisible ? depositBalanceDisplay : maskedBalance }}</p>
            <p class="bl-desc">Dana siap digunakan untuk transaksi</p>
          </div>
          <img src="/assets/images/10_81.svg" alt="" class="bl-arrow">
        </div>

        <!-- Saldo Proteksi -->
        <div class="bl-card" @click="goToPortfolio">
          <div class="bl-icon-wrapper bg-blue">
            <img src="/assets/images/10_104.svg" alt="">
          </div>
          <div class="bl-info">
            <h3 class="bl-title">Saldo Proteksi</h3>
            <p class="bl-amount">{{ isBalanceVisible ? mainBalanceDisplay : maskedBalance }}</p>
            <p class="bl-desc">Dana dalam proses verifikasi/penyelesaian</p>
          </div>
          <img src="/assets/images/10_90.svg" alt="" class="bl-arrow">
        </div>

        <!-- Saldo Real-Time -->
        <div class="bl-card" @click="goToMining">
          <div class="bl-icon-wrapper bg-green">
            <img src="/assets/images/10_109.svg" alt="">
          </div>
          <div class="bl-info">
            <h3 class="bl-title">Saldo Real-Time</h3>
            <p class="bl-amount">{{ isBalanceVisible ? interestDisplay : maskedBalance }}</p>
            <p class="bl-desc">Keuntungan yang sudah pasti menjadi milik Anda</p>
          </div>
          <img src="/assets/images/10_99.svg" alt="" class="bl-arrow">
        </div>
      </div>
    </section>

    <!-- Action Grid -->
    <section id="section-action-grid">
      <div class="action-grid-container">
        <router-link to="/hn/app/charge" class="action-item">
          <div class="action-icon-box">
            <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="">
          </div>
          <span class="action-label">Isi Ulang</span>
        </router-link>
        <router-link to="/hn/app/settlement" class="action-item">
          <div class="action-icon-box">
            <img src="/assets/images/ac38be83c38ff4c980108ab039eb773cc5ad6bb4.png" alt="">
          </div>
          <span class="action-label">Pencairan<br>Dana</span>
        </router-link>
        <router-link to="/hn/user/history" class="action-item">
          <div class="action-icon-box">
            <img src="/assets/images/90e5a727cd9d3661692eee43d92cd502f933c397.png" alt="">
          </div>
          <span class="action-label">Riwayat</span>
        </router-link>
        <router-link to="/hn/hall/outputhall" class="action-item">
          <div class="action-icon-box">
            <img src="/assets/images/c69f62f86e02f56d1a4e81fdfbdebe2fe7250450.png" alt="">
          </div>
          <span class="action-label">Proteksi<br>Saya</span>
        </router-link>
        <router-link to="/user/help" class="action-item">
          <div class="action-icon-box">
            <img src="/assets/images/77d0671ec600386d429d57f4d5d6bbae75556961.png" alt="">
          </div>
          <span class="action-label">Bantuan</span>
        </router-link>
      </div>
    </section>

    <!-- Promo Banner -->
    <section id="section-promo">
      <div class="promo-card" @click="goToMining">
        <div class="promo-content">
          <h3 class="promo-title">Dana Anda Aman,Tenang Setiap Saat</h3>
          <p class="promo-desc">Dana Proteksi menggunakan sistem keamanan berlapis untuk melindungi aset Anda.</p>
          <div class="promo-btn">
            <span>Mulai Sekarang</span>
            <img src="/assets/images/10_81.svg" alt="">
          </div>
        </div>
        <img src="/assets/images/788.png" alt="" class="promo-illustration">
      </div>
    </section>
  </div>

  <FooterBar />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FooterBar from '@/components/partials/AppFooter.vue'
import { authAPI } from '@/services/api'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()

const username = ref('')
const mainBalance = ref(0)
const depositBalance = ref(0)
const interestTotal = ref(0)
const isBalanceVisible = ref(true)

const formatRupiah = (value) => {
  return formatAppCurrency(value, {
    symbol: 'Rp',
    symbol_position: 'prefix',
    symbol_space: true,
    thousand_sep: '.',
    decimal_sep: ',',
    decimals: 0
  })
}

const toAmount = (value) => {
  const n = Number(String(value ?? '').replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const totalBalanceDisplay = computed(() => {
  return formatRupiah(mainBalance.value + depositBalance.value + interestTotal.value)
})

const depositBalanceDisplay = computed(() => {
  return formatRupiah(depositBalance.value)
})

const mainBalanceDisplay = computed(() => {
  return formatRupiah(mainBalance.value)
})

const interestDisplay = computed(() => {
  return formatRupiah(interestTotal.value)
})

const maskedBalance = computed(() => '••••••••')

const toggleBalanceVisibility = () => {
  isBalanceVisible.value = !isBalanceVisible.value
}

const normalizePhoneTo08 = (raw) => {
  const s = String(raw ?? '').trim()
  if (!s) return ''
  const digits = s.replace(/[^\d]/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) return digits
  if (digits.startsWith('62')) return `0${digits.slice(2)}`
  if (digits.startsWith('8')) return `0${digits}`
  return digits
}

const maskMiddle = (text) => {
  const s = String(text ?? '')
  if (s.length <= 7) return s
  const left = s.slice(0, 4)
  const right = s.slice(-3)
  const mid = '*'.repeat(Math.max(0, s.length - (4 + 3)))
  return `${left}${mid}${right}`
}

const displayUsername = computed(() => {
  const normalized = normalizePhoneTo08(username.value)
  if (!normalized) return ''
  if (normalized.startsWith('08')) return maskMiddle(normalized)
  return maskMiddle(normalized)
})

const fetchAccountInfo = async () => {
  try {
    const [accountRes, statsAllTimeRes] = await Promise.allSettled([
      authAPI.getAccountInfo(),
      authAPI.getBalanceStatistics('all-time')
    ])

    if (accountRes.status === 'fulfilled') {
      const data = accountRes.value?.data || {}
      username.value = data?.phone || ''
      mainBalance.value = toAmount(data?.balance ?? 0)
      depositBalance.value = toAmount(data?.balance_deposit ?? data?.deposit_balance ?? 0)
    }

    if (statsAllTimeRes.status === 'fulfilled') {
      const stats = statsAllTimeRes.value?.data || {}
      interestTotal.value = toAmount(stats?.interest_total ?? 0)
    }
  } catch (_) {}
}

const goToDeposit = () => router.push('/hn/app/charge')
const goToWithdraw = () => router.push('/hn/app/settlement')
const goToPortfolio = () => router.push('/hn/hall/outputhall')
const goToMining = () => router.push('/shop')

onMounted(() => {
  fetchAccountInfo()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6, p {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

.mobile-container {
  max-width: 412px;
  margin: 0 auto;
  background-color: #fbfaf7;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  padding-bottom: 80px;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px 15px 20px;
}

.header-logo {
  height: 42px;
  width: auto;
  object-fit: contain;
}

.notification-wrapper {
  position: relative;
  width: 37px;
  height: 37px;
  cursor: pointer;
}

.notif-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
}

.notif-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
}

/* Greeting */
.greeting-container {
  padding: 5px 20px 15px 20px;
}

.greeting-name {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 6px;
}

.greeting-text {
  font-size: 14px;
  color: #635f5f;
  line-height: 1.4;
}

/* Total Balance */
.total-balance-card {
  margin: 10px 17px 20px 17px;
  height: 120px;
  background: linear-gradient(90deg, #f4c142 0%, #f8dd89 46.6%, #f5ca51 100%);
  border-radius: 10px;
  position: relative;
  padding: 25px 20px;
}

.tb-content {
  position: relative;
  z-index: 2;
}

.tb-label {
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 5px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
}

.tb-amount {
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
}

.tb-illustration {
  position: absolute;
  right: 0;
  top: -48px;
  width: 154px;
  height: 123px;
  pointer-events: none;
  z-index: 1;
}

.tb-badge {
  position: absolute;
  right: 16px;
  bottom: 16px;
  background-color: rgba(248, 248, 248, 0.5);
  border-radius: 10px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 2;
  cursor: pointer;
}

.tb-badge-icon {
  width: 11px;
  height: 11px;
}

.tb-badge-text {
  color: #535353;
  font-size: 10px;
  font-weight: 600;
}

/* Balance List */
.balance-list-container {
  padding: 0 17px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bl-card {
  background-color: #fefffe;
  border-radius: 10px;
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.04);
  padding: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.bl-icon-wrapper {
  width: 57px;
  height: 51px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.bl-icon-wrapper img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.bg-yellow { background-color: #fef7e3; }
.bg-blue { background-color: #f0f6fc; }
.bg-green { background-color: #eef8e6; }

.bl-info {
  margin-left: 15px;
  flex-grow: 1;
}

.bl-title {
  font-size: 12px;
  color: #060606;
  margin-bottom: 4px;
  font-weight: 600;
}

.bl-amount {
  font-size: 18px;
  font-weight: 700;
  color: #060606;
  margin-bottom: 4px;
}

.bl-desc {
  font-size: 10px;
  color: #7d7d7d;
}

.bl-arrow {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

/* Action Grid */
.action-grid-container {
  padding: 25px 17px;
  display: flex;
  justify-content: space-between;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 69px;
  cursor: pointer;
  text-decoration: none;
}

.action-icon-box {
  width: 69px;
  height: 69px;
  background-color: #fefffe;
  border-radius: 10px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.action-icon-box img {
  width: 29px;
  height: 29px;
  object-fit: contain;
}

.action-label {
  font-size: 10px;
  color: #060606;
  text-align: center;
  font-weight: 600;
  line-height: 1.3;
}

/* Promo Banner */
.promo-card {
  margin: 0 17px 20px 17px;
  background-color: #fcf3df;
  border-radius: 10px;
  padding: 20px 15px;
  position: relative;
  min-height: 138px;
  cursor: pointer;
}

.promo-content {
  width: 65%;
  position: relative;
  z-index: 2;
}

.promo-title {
  font-size: 18px;
  font-weight: 700;
  color: #060606;
  margin-bottom: 8px;
  line-height: 1.4;
}

.promo-desc {
  font-size: 10px;
  color: #7d7d7d;
  margin-bottom: 15px;
  line-height: 1.5;
}

.promo-btn {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #f4c142 0%, #f8dd89 47%, #f5ca51 100%);
  border-radius: 10px;
  padding: 4px 8px 4px 12px;
}

.promo-btn span {
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
}

.promo-btn img {
  width: 20px;
  height: 20px;
  margin-left: 4px;
}

.promo-illustration {
  position: absolute;
  right: -4px;
  bottom: 15px;
  width: 151px;
  height: 97px;
  z-index: 1;
  pointer-events: none;
  object-fit: contain;
}
</style>
