<template>
  <div class="app-wrapper">
    <!-- Header Section -->
    <header class="app-header">
      <div class="user-profile">
        <div class="avatar-container">
          <img :src="avatarSrc" alt="User Avatar" class="avatar">
        </div>
        <div class="user-info">
          <div class="username-row">
            <span class="username">{{ displayUsername }}</span>
            <div class="vip-badge">
            
              <img src="/assets/image/5fb42ec97aec809c1357f284f6344e0829f4ad5e.png" class="vip-icon" alt="vip">
                <span class="vip-text">{{ vipText }}</span>
            </div>
          </div>
          <div class="user-id-row">
            <span class="user-id">ID akun: {{ displayUid }}</span>
          
            <a href="#/pages/account/settings" class="edit-row" @click.prevent="router.push('/pages/account/settings')">
              <span class="edit-text">Lihat atau edit profil</span>
              <img src="/assets/image/146_1420.svg" class="edit-icon" alt="edit">
            </a>
          </div>
        </div>
      </div>
      <div class="header-menu">
        <div class="menu-icon-wrapper" @click="isDrawerOpen = true">
          <img src="/assets/image/145_1355.svg" class="menu-bg" alt="bg">
          <img src="/assets/image/145_1359.svg" class="menu-lines" alt="menu">
        </div>
      </div>
    </header>

    <!-- Balance Actions -->
    <section class="balance-actions">
      <div class="action-card gradient-card-1">
        <div class="action-content">
          <div class="action-header">
            <img src="/assets/image/c2e540a593496a59006c57a512b91431fca799d8.png" class="action-bg-icon" alt="icon">
            <span class="action-title">Isi ulang saldo</span>
            <a href="#/pages/balance/recharge" class="action-tag" @click.prevent="router.push('/pages/balance/recharge')">
              <span>Deposito</span>
              <img src="/assets/image/145_1391.svg" alt="arrow">
            </a>
          </div>
          <span class="action-value">{{ balanceDepositText }}</span>
        </div>
      </div>

      <div class="action-card gradient-card-1">
        <div class="action-content">
          <div class="action-header">
            <img src="/assets/image/89fbbbabd9999be65f129c983484f1a335bc24e1.png" class="mini-chart" alt="chart">
            <span class="action-title">Saldo kuantitatif</span>
          </div>
          <div class="action-value-row">
            <span class="action-value">{{ balanceText }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Balance Card -->
    <section class="main-balance-card">
      <div class="balance-details">
        <div class="balance-text-col">
          <p>Bertambah hari ini:</p>
          <p>Saldo bisa ditarik:</p>
          <p>Akumulasi saldo:</p>
        </div>
        <div class="balance-num-col">
          <p>{{ todayTotalIncomeText }}</p>
          <p>{{ balanceText }}</p>
          <p>{{ totalIncomeText }}</p>
        </div>
      </div>
      
      <div class="card-footer">
        <div class="detail-link" role="button" tabindex="0" @click="isDrawerOpen = true">
          <span>Lihat detail saldo</span>
          <img src="/assets/image/155_1476.svg" alt="arrow">
        </div>
          <a href="#/pages/assets/release" class="withdraw-btn" @click.prevent="router.push('/pages/assets/release')">
            <span>Tarik</span>
            <img src="/assets/image/149_1447.svg" alt="arrow">
          </a>
      </div>
    </section>


    <!-- Announcement -->
    <div class="announcement-bar">
      <img src="/assets/image/154_1458.svg" alt="speaker">
      <div class="marquee">
        <div class="marquee-track">
          <span class="marquee-text">Por favor, complete algumas missões disponíveis abaixo untuk obter muita</span>
          <span class="marquee-text">Por favor, complete algumas missões disponíveis abaixo untuk obter muita</span>
        </div>
      </div>
    </div>

    <!-- Feature Grid -->
    <section class="feature-grid">
      <!-- Item 1 -->
      <div class="feature-item" @click="router.push('/pages/invite/invite')">
        <div class="feature-text">
          <h3>Undang pengguna</h3>
          <p>Bagikan undangan Anda</p>
        </div>
        <img src="/assets/image/fd750d08b7e90034c1977da9ec7d41041d4ec384.png" class="feature-icon" alt="icon">
      </div>

      <!-- Item 2 -->
     
      <!-- Item 3 -->
      <div class="feature-item" @click="router.push('/pages/benefits/premium')">
        <div class="feature-text">
          <h3>VIP</h3>
          <p>Dapatkan hak eksklusif lebih banyak!</p>
        </div>
        <img src="/assets/image/vip.png" class="feature-icon" alt="icon">
      </div>
       <div class="feature-item" @click="router.push('/pages/assets/bind')">
        <div class="feature-text">
          <h3>Manajemen</h3>
          <p>Atur kartu bank Anda untuk menarik uang!</p>
        </div>
        <img src="/assets/image/management.png" class="feature-icon" alt="icon">
      </div>


      <!-- Item 4 -->
      <div class="feature-item" @click="router.push('/pages/invite/team')">
        <div class="feature-text">
          <h3>Tim</h3>
          <p>Bentuk tim dan lihat mereka disini!</p>
        </div>
        <img src="/assets/image/teamm.png" class="feature-icon" alt="icon">
      </div>
    </section>

    <!-- Menu Lists -->
    <section class="menu-section">
      <div class="menu-group">
        <a href="#/pages/history/records" class="menu-item" @click.prevent="router.push('/pages/history/records')">
          <img src="/assets/image/i1.png" class="menu-icon" alt="icon">
          <span class="menu-label">Catatan Penerbangan</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </a>
        <div class="menu-divider"></div>
        
        <div class="menu-item" @click="router.push('/pages/account/missions')">
          <img src="/assets/image/i2.png" class="menu-icon" alt="icon">
          <span class="menu-label">Tantangan</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </div>
        <div class="menu-divider"></div>

        <a href="#/pages/account/news" class="menu-item" @click.prevent="router.push('/pages/account/news')">
          <img src="/assets/image/i3.png" class="menu-icon" alt="icon">
          <span class="menu-label">Pemberitahuan Pesan</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </a>
        <div class="menu-divider"></div>

          <div class="menu-item" @click="router.push('/pages/account/bonus')">
          <img src="/assets/image/i4.png" class="menu-icon" alt="icon">
          <span class="menu-label">Keberuntungan</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </div>
        <div class="menu-divider"></div>
         <div class="menu-item" @click="router.push('/pages/account/attendance')">
          <img src="/assets/image/i5.png" class="menu-icon" alt="icon">
          <span class="menu-label">Check-in</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </div>
      </div>
            <div class="menu-group">
        <div class="menu-item" @click="router.push('/pages/account/terms')">
          <img src="/assets/image/i6.png" class="menu-icon" alt="icon">
          <span class="menu-label">Terms of Service</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </div>
        <div class="menu-divider"></div>
        
        <div class="menu-item" @click="router.push('/pages/account/privacy')">
          <img src="/assets/image/i7.png" class="menu-icon" alt="icon">
          <span class="menu-label">Privacy Policy</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </div>
        <div class="menu-divider"></div>

        <a href="#/pages/account/company/security" class="menu-item" @click.prevent="router.push('/pages/account/company/security')">
          <img src="/assets/image/i8.png" class="menu-icon" alt="icon">
          <span class="menu-label">Perjanjian anggota VIP</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </a>
        
        <div class="menu-divider"></div>
         <div class="menu-item" @click="router.push('/pages/account/about')">
          <img src="/assets/image/i9.png" class="menu-icon" alt="icon">
          <span class="menu-label">Tentang kami</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </div>
        <div class="menu-divider"></div>
        <a href="#/pages/account/support/bot" class="menu-item" @click.prevent="router.push('/pages/account/support/bot')">
          <img src="/assets/image/i10.png" class="menu-icon" alt="icon">
          <span class="menu-label">Pelayanan Pelanggan</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </a>
      </div>
      <div class="menu-group">
        <a href="#/pages/account/settings" class="menu-item" @click.prevent="router.push('/pages/account/settings')">
          <img src="/assets/image/i11.png" class="menu-icon" alt="icon">
          <span class="menu-label">Pengaturan</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </a>
        <div class="menu-divider"></div>
        
        <div class="menu-item" @click="router.push('/pages/account/download-app')">
          <img src="/assets/image/i12.png" class="menu-icon" alt="icon">
          <span class="menu-label">Unduh aplikasi</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </div>
        

       
      </div>


      <div class="menu-group logout-group">
        <div class="menu-item" @click="router.push('/pages/account/access')">
          <img src="/assets/image/i13.png" class="menu-icon" alt="icon">
          <span class="menu-label">Keluar</span>
          <img src="/assets/image/155_1476.svg" class="menu-arrow" alt="arrow">
        </div>
      </div>
    </section>

    <!-- Drawer Overlay (Top Layer) -->
    <div class="drawer-overlay" v-if="isDrawerOpen" @click="isDrawerOpen = false">
      <div class="drawer-content" @click.stop>
        <div class="drawer-body">
          <div class="drawer-header-custom">
            <div class="drawer-top-row">
              <img src="/assets/image/161_396.svg" alt="Close" class="close-icon" @click="isDrawerOpen = false">
            </div>
            <div class="user-profile-row">
              <div class="user-info">
                <div class="phone-vip-row">
                  <span class="phone-number">{{ displayPhone }}</span>
                  <div class="vip-badge">
                    <span class="vip-text">{{ vipText }}</span>
                    <img src="/assets/image/5fb42ec97aec809c1357f284f6344e0829f4ad5e.png" class="vip-crown" alt="VIP">
                  </div>
                </div>
                <div class="user-id">ID akun: {{ displayUid }}</div>
              </div>
              <div class="user-avatar">
                <img :src="avatarSrc" alt="Avatar">
              </div>
            </div>
          </div>

          <!-- Info Card -->
          <div class="info-card">
            <div class="info-row">
              <span class="label">Drone aktif:</span>
              <span class="value">{{ activeDroneText }}</span>
            </div>
            <div class="info-row">
              <span class="label">Bergabung sejak:</span>
              <span class="value">{{ joinedSinceText }}</span>
            </div>
          </div>

          <!-- Menu List -->
          <nav class="drawer-menu-card">
            <a href="#/pages/history/recharge" class="menu-item" @click.prevent="router.push('/pages/history/recharge')">
              <span class="menu-text">Catatan deposito</span>
              <img src="/assets/image/155_1476.svg" class="chevron-icon" alt=">">
            </a>
            <a href="#/pages/history/release" class="menu-item" @click.prevent="router.push('/pages/history/release')">
              <span class="menu-text">Catatan menarik</span>
              <img src="/assets/image/155_1476.svg" class="chevron-icon" alt=">">
            </a>
            <a href="#/pages/history/order" class="menu-item" @click.prevent="router.push('/pages/history/order')">
              <span class="menu-text">Catatan pesanan</span>
              <img src="/assets/image/155_1476.svg" class="chevron-icon" alt=">">
            </a>
            <a href="#/pages/history/teams" class="menu-item" @click.prevent="router.push('/pages/history/teams')">
              <span class="menu-text">Catatan komisi</span>
              <img src="/assets/image/155_1476.svg" class="chevron-icon" alt=">">
            </a>
            <a href="#/pages/history/attendance" class="menu-item" @click.prevent="router.push('/pages/history/attendance')">
              <span class="menu-text">Catatan kehadiran</span>
              <img src="/assets/image/155_1476.svg" class="chevron-icon" alt=">">
            </a>
            <a href="#/pages/history/rewards" class="menu-item" @click.prevent="router.push('/pages/history/rewards')">
              <span class="menu-text">Catatan menukar</span>
              <img src="/assets/image/155_1476.svg" class="chevron-icon" alt=">">
            </a>
            <a href="#/pages/history/transaction" class="menu-item" @click.prevent="router.push('/pages/history/transaction')">
              <span class="menu-text">Catatan lainnya</span>
              <img src="/assets/image/155_1476.svg" class="chevron-icon" alt=">">
            </a>
          </nav>

          <!-- Logout Button -->
          <div class="logout-container">
            <button class="logout-btn" @click="router.push('/pages/account/access')">
              <span>Keluar</span>
              <img src="/assets/image/155_1476.svg" class="chevron-icon" alt=">">
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <FooterBar />
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FooterBar from '../../components/partials/FooterBar.vue'
import { avatarSrc } from '@/utils/avatar'
import { authAPI } from '@/services/api'

const router = useRouter()
const isDrawerOpen = ref(false)

const accountInfo = ref(null)
const currentRank = ref(null)
const currentTitle = ref(null)
const balanceStats = ref(null)
const todayStats = ref(null)
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)

const displayUsername = computed(() => {
  const d = accountInfo.value || {}
  const username = String(d.username || d.full_name || d.name || '').trim()
  return username || 'Username'
})

const displayUid = computed(() => {
  const d = accountInfo.value || {}
  const uid = d.referral_code ?? d.id ?? d.user_id ?? null
  if (uid === null || uid === undefined || uid === '') return '-'
  return String(uid)
})

const displayPhone = computed(() => {
  const d = accountInfo.value || {}
  const p = String(d.phone || d.phone_number || d.user_phone || '').trim()
  return p || '-'
})

const vipText = computed(() => {
  const title = String(currentTitle.value || '').trim()
  if (title) return title
  const r = currentRank.value
  if (r === null || r === undefined || r === '') return 'V0'
  const n = Number(r)
  return Number.isFinite(n) ? `V${n}` : String(r)
})

const activeDroneText = computed(() => {
  const n = Number(accountInfo.value?.active_investments_count ?? 0)
  const cnt = Number.isFinite(n) ? n : 0
  return `${cnt} drone`
})

const joinedSinceText = computed(() => {
  const raw = accountInfo.value?.created_at || null
  if (!raw) return '-'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
})

const toNumber = (v) => {
  const n = Number(String(v ?? 0).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}
const formatIDR = (v) => {
  return 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(toNumber(v))
}

const balanceText = computed(() => formatIDR(balanceStats.value?.balance))
const balanceDepositText = computed(() => formatIDR(balanceStats.value?.balance_deposit))
const totalIncomeText = computed(() => formatIDR(balanceStats.value?.total_income))
const todayTotalIncomeText = computed(() => formatIDR(todayStats.value?.total_income))

const fetchAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    accountInfo.value = resp?.data || null
  } catch (_) {
    accountInfo.value = null
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

const fetchBalanceStats = async () => {
  try {
    const resp = await authAPI.getBalanceStatistics('all-time')
    balanceStats.value = resp?.data || null
  } catch (_) {
    balanceStats.value = null
  }
}

const fetchTodayStats = async () => {
  try {
    const resp = await authAPI.getBalanceStatistics('today')
    todayStats.value = resp?.data || null
  } catch (_) {
    todayStats.value = null
  }
}

const refreshProfileData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    await Promise.all([
      fetchAccountInfo(),
      fetchRankStatus(),
      fetchBalanceStats(),
      fetchTodayStats()
    ])
  } finally {
    lastRefreshedAt.value = Date.now()
    isRefreshing.value = false
  }
}

onMounted(() => {
  refreshProfileData()
})

onActivated(() => {
  const now = Date.now()
  if (now - lastRefreshedAt.value < 300) return
  refreshProfileData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-bg: #1d2138;
  --text-white: #ffffff;
  --text-grey: #c4c4c4;
  --text-muted: #7e7e7e;
  --accent-purple: #746a9a;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0f0f1e;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Main Wrapper */
.app-wrapper {
  width: 100%;
  max-width: 412px;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: relative;
  padding-bottom: 80px;
  overflow-x: hidden;
}

/* Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 31px 20px 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar-container {
  width: 56px;
  height: 57px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

.vip-badge {
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px 6px;
  background-color: #a296ff;
  border-radius: 10px;
  height: 12px;
  gap: 4px;
}

.vip-text {
  font-size: 10px;
  color: #301f80;
  font-weight: 700;
  line-height: 1;
}

.vip-icon {
  width: 16px;
  height: 12px;
}

.user-id-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0px;
}

.user-id {
  color: #fff;
  font-size: 12px;
}

.edit-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  cursor: pointer;
  line-height: 1;
}

.edit-icon {
  width: 6px;
  height: 6px;
}

.edit-text {
  color: #7e7e7e;
  font-size: 11px;
}

.menu-icon-wrapper {
  position: relative;
  width: 30px;
  height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-bg {
  position: absolute;
  width: 100%;
  height: 100%;
}

.menu-lines {
  position: relative;
  width: 20px;
  height: 20px;
  z-index: 1;
}

/* Balance Actions */
.balance-actions {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 16px;
}

.action-card {
  width: 48%;
  height: 71px;
  border-radius: 10px;
  padding: 11px 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.gradient-card-1 {
  background: linear-gradient(90deg, #2b2a62 0%, #0f132e 48%, #0a1025 100%);
}

.action-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 1;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.action-header .action-tag {
  margin-left: auto;
}

.action-title {
  color: #fff;
  font-size: 10px;
}

.action-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  padding: 2px 6px;
  width: fit-content;
}

.action-tag span {
  color: #fff;
  font-size: 9px;
}

.action-tag img {
  width: 12px;
  height: 12px;
}

.action-value {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-top: auto;
  margin-left: 5px;
}

.action-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.action-bg-icon {
  width: 21px;
  height: 20px;
  opacity: 0.8;
}

.mini-chart {
  width: 18px;
  height: 15px;
}

/* Main Balance Card */
.main-balance-card {
  margin: 0 16px 16px;
  height: 119px;
  border-radius: 10px;
  background-image: url('/assets/image/8ba466c0b79a0e8b82f25581ddfdcb6dbc460ad2.png');
  background-size: cover;
  background-position: center;
  padding: 16px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.balance-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: auto;
}

.balance-text-col p, .balance-num-col p {
  margin: 0 0 4px 0;
  font-size: 12px;
  line-height: 1.5;
}

.balance-text-col p {
  color: #000;
}

.balance-num-col p {
  color: #000;
  font-weight: 600;
  text-align: right;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.detail-link {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.detail-link span {
  color: #7e7e7e;
  font-size: 11px;
}

.detail-link img {
  width: 6px;
  height: 6px;
}

.withdraw-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  padding: 4px 12px;
  color: white;
  font-size: 12px;
  cursor: pointer;
}

.withdraw-btn img {
  width: 12px;
  height: 12px;
}

/* Announcement */
.announcement-bar {
  margin: 0 16px 16px;
  height: 29px;
  background: linear-gradient(90deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border-radius: 2px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 8px;
  overflow: hidden;
}

.announcement-bar img {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.marquee {
  white-space: nowrap;
  overflow: hidden;
  color: #c4c4c4;
  font-size: 11px;
  flex-grow: 1;
}

.marquee-track {
  display: flex;
  width: max-content;
  gap: 28px;
  animation: profileMarquee 14s linear infinite;
  will-change: transform;
}

.marquee-text {
  white-space: nowrap;
}

@keyframes profileMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 0 23px;
  margin-bottom: 20px;
}

.feature-item {
  background-color: #1d2138;
  border-radius: 10px;
  padding: 8px 10px;
  height: 57px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 70%;
}

.feature-text h3 {
  margin: 0;
  color: #fff;
  font-size: 12px;
  font-weight: 400;
}

.feature-text p {
  margin: 0;
  color: #acacac;
  font-size: 9px;
  line-height: 1.2;
}

.feature-icon {
  width: 44px;
  height: 42px;
  object-fit: contain;
}

/* Menu Lists */
.menu-section {
  padding: 0 23px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-group {
  background-color: #1d2138;
  border-radius: 10px;
  padding: 0 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 12px 0;
}

.menu-icon {
  width: 23px;
  height: 22px;
  margin-right: 12px;
  object-fit: contain;
}

.menu-label {
  flex-grow: 1;
  color: #fff;
  font-size: 13px;
}

.menu-arrow {
  width: 7px;
  height: 11px;
}

.menu-divider {
  height: 1px;
  background-color: #746a9a;
  opacity: 0.4;
  width: 100%;
}

.logout-group {
  margin-bottom: 20px;
}

/* Bottom Nav */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  height: 63px;
  background: linear-gradient(180deg, #0f0b2e 0%, #2b1b6f 100%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.nav-icon-wrapper {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.3;
}

.nav-item span {
  font-size: 10px;
  color: #c4c4c4;
}

.nav-item.active img {
  opacity: 1;
}

.nav-item.active span {
  color: #fff;
}

/* Drawer Overlay Styles */
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer-content {
  width: 320px;
  max-width: 85%;
  height: 100%;
  background-color: #35395a;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease forwards;
  color: #fff;
  overflow-y: auto;
}

.drawer-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Drawer Header */
.drawer-header-custom {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 4px;
}

.drawer-top-row {
  display: flex;
  justify-content: flex-start;
}

.close-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.user-profile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.phone-vip-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.phone-number {
  font-size: 16px;
  font-weight: 500;
}

.vip-badge {
  background: linear-gradient(90deg, #a296ff 0%, #7d6aff 100%);
  border-radius: 10px;
  padding: 2px 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 16px;
}

.vip-text {
  font-size: 10px;
  color: #301f80;
  font-weight: 700;
  line-height: 1;
}

.vip-crown {
  width: 14px;
  height: 14px;
}

.user-id {
  font-size: 12px;
  color: #c4c4c4;
}

.user-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

/* Cards */
.info-card, .drawer-menu-card, .logout-btn {
  background-color: #1d2138;
  border-radius: 10px;
  padding: 16px;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-row .label {
  color: #c4c4c4;
  font-size: 12px;
}

.info-row .value {
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  font-style: italic;
}

/* Menu List */
.drawer-menu-card {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
}

.menu-text {
  font-size: 13px;
  color: #ffffff;
}

.chevron-icon {
  width: 6px;
  height: 10px;
  opacity: 0.6;
}

/* Logout Button */
.logout-container {
  margin-bottom: 20px;
}

.logout-btn {
  width: 100%;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.logout-btn span {
  font-size: 13px;
  color: #ffffff;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>
