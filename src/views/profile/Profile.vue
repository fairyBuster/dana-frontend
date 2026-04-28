<template>
  <div class="app-wrapper">
    <section id="section-header">
      <div class="header-container">
        <div class="user-info">
          <h1 class="username">Hai, {{ displayUsername }}</h1>
          <div class="user-meta">
            <span class="reff-label">Reff ID: <span class="reff-val">{{ displayUid }}</span></span>
            <div class="divider-vert"></div>
            <span class="phone">{{ displayPhone }}</span>
          </div>
        </div>
        <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Trivex Logo" class="header-logo">
      </div>
    </section>

    <section id="section-referral">
      <div class="referral-card">
        <div class="ref-row" @click="router.push('/vp')">
          <img src="/assets/images/35c8b6a18c2ca182842dd2334e0d97ca5f0a270c.png" alt="Level Icon" class="ref-icon">
          <div class="ref-content">
            <div class="ref-title">Level anggota</div>
            <div class="ref-value">{{ vipText }}</div>
          </div>
          <img src="/assets/images/2038_126.svg" alt="Arrow Right" class="ref-arrow">
        </div>
        <div class="ref-divider"></div>
        <div class="ref-row" @click="router.push('/share')">
          <img src="/assets/images/99155724c1b89458bc852e2a45ac1027d8bfda23.png" alt="Referral Icon" class="ref-icon">
          <div class="ref-content">
            <div class="ref-title">Program Referral</div>
            <div class="ref-value">Berikan tautan undangan Anda</div>
          </div>
          <img src="/assets/images/2038_167.svg" alt="Arrow Right" class="ref-arrow">
        </div>
      </div>
    </section>

    <section id="section-asset">
      <div class="asset-card">
        <div class="asset-header">
          <div class="asset-title-wrap">
            <img src="/assets/images/581d456ba831527e9d5b0cbe542825e6c12d42e1.png" alt="Asset Icon" class="asset-main-icon">
            <span class="asset-main-title">Total Aset Saya</span>
            <img src="/assets/images/2039_329.svg" alt="Toggle Visibility" class="asset-eye-icon" @click="isBalanceVisible = !isBalanceVisible">
          </div>
          <div class="asset-badges">
            <img src="/assets/images/image 61 (2).png" alt="Bappebti Logo" class="badge-bappebti">
            <img src="/assets/images/a648e454f7e6e93caec0f833a59b7dcec155605e.png" alt="SK Logo" class="badge-sk">
          </div>
        </div>

        <div class="asset-list">
          <div class="asset-item" @click="router.push('/flow')">
            <div class="asset-info">
              <div class="asset-label">Saldo Utama</div>
              <div class="asset-val">{{ isBalanceVisible ? balanceText : 'Rp********' }}</div>
            </div>
            <img src="/assets/images/2038_144.svg" alt="Arrow Right" class="asset-arrow">
          </div>
          <div class="asset-divider"></div>

          <div class="asset-item" @click="router.push('/dep')">
            <div class="asset-info">
              <div class="asset-label">Saldo Deposito</div>
              <div class="asset-val">{{ isBalanceVisible ? balanceDepositText : 'Rp********' }}</div>
            </div>
            <img src="/assets/images/2038_149.svg" alt="Arrow Right" class="asset-arrow">
          </div>
          <div class="asset-divider"></div>

          <div class="asset-item" @click="router.push('/portfolio/history')">
            <div class="asset-info">
              <div class="asset-label">Saldo Titip</div>
              <div class="asset-val">{{ isBalanceVisible ? totalIncomeText : 'Rp********' }}</div>
            </div>
            <img src="/assets/images/2038_155.svg" alt="Arrow Right" class="asset-arrow">
          </div>
          <div class="asset-divider"></div>

          <div class="asset-item" @click="router.push('/flow/history')">
            <div class="asset-info">
              <div class="asset-label">Total Penarikan Sukses</div>
              <div class="asset-val">{{ isBalanceVisible ? todayTotalIncomeText : 'Rp********' }}</div>
            </div>
            <img src="/assets/images/2038_161.svg" alt="Arrow Right" class="asset-arrow">
          </div>
        </div>
      </div>
    </section>

    <section id="section-menu">
      <div class="menu-container">
        <div class="security-notice">
          <img src="/assets/images/a876a13410d4439d34944ad319f54081e6d9ecf9.png" alt="Security Shield" class="sec-icon">
          <p class="sec-text">Data Anda dilindungi dengan sistem enkripsi dan protokol keamanan SSL untuk menjaga kerahasiaan dan keamanan informasi.</p>
        </div>

        <div class="menu-list">
          <div class="menu-item" @click="router.push('/settings')">
            <img src="/assets/images/28513e18289d675dfcb2092e17ef5f318ad3ee70.png" alt="Data Saya" class="menu-icon">
            <span class="menu-label">Data Saya</span>
            <img src="/assets/images/2039_173.svg" alt="Arrow Right" class="menu-arrow">
          </div>
          <div class="menu-divider"></div>

          <div class="menu-item" @click="router.push('/connect')">
            <img src="/assets/images/d41cb37f383e118edae5c6a973ae9f86b1382288.png" alt="Tambah Rekening" class="menu-icon">
            <span class="menu-label">Tambah Rekening</span>
            <img src="/assets/images/2039_179.svg" alt="Arrow Right" class="menu-arrow">
          </div>
          <div class="menu-divider"></div>

          <div class="menu-item" @click="router.push('/settings/change-password')">
            <img src="/assets/images/fcd9fe1e45be040eb1fd3a3e8ca65794171b72a5.png" alt="Keamanan Akun" class="menu-icon">
            <span class="menu-label">Keamanan Akun</span>
            <img src="/assets/images/2039_186.svg" alt="Arrow Right" class="menu-arrow">
          </div>
          <div class="menu-divider"></div>

          <div class="menu-item" @click="router.push('/support/platform')">
            <img src="/assets/images/dbf0ca110a19eb0771d0f64fec6d8bbad1c44406.png" alt="Pusat Bantuan" class="menu-icon">
            <span class="menu-label">Pusat Bantuan</span>
            <img src="/assets/images/2039_193.svg" alt="Arrow Right" class="menu-arrow">
          </div>
          <div class="menu-divider"></div>

          <div class="menu-item" @click="router.push('/task')">
            <img src="/assets/images/df083f3660cadeed4ff1250b110dd29ba5b04bfa.png" alt="Tugas Berhadiah" class="menu-icon">
            <span class="menu-label">Tugas Berhadiah-Undang Teman</span>
            <img src="/assets/images/2039_312.svg" alt="Arrow Right" class="menu-arrow">
          </div>
          <div class="menu-divider"></div>

          <div class="menu-item" @click="router.push('/portfolio')">
            <img src="/assets/images/d0494c7e58523da03bf49ec763727b638b172bd1.png" alt="Portofolio Saya" class="menu-icon">
            <span class="menu-label">Portofolio Saya</span>
            <img src="/assets/images/2040_335.svg" alt="Arrow Right" class="menu-arrow">
          </div>
        </div>

        <button class="btn-logout" @click="router.push('/login')">Keluar</button>
      </div>
    </section>
  </div>

  <FooterBar />
</template>

<script setup>
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import FooterBar from '../../components/partials/FooterBar.vue'
import { avatarSrc } from '@/utils/avatar'
import { authAPI } from '@/services/api'

const router = useRouter()
const isBalanceVisible = ref(false)

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
  return username || ''
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
  if (r === null || r === undefined || r === '') return 'LV0'
  const n = Number(r)
  return Number.isFinite(n) ? `LV${n}` : String(r)
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
const totalIncomeText = computed(() => formatIDR(balanceStats.value?.balance_hold))
const todayTotalIncomeText = computed(() => formatIDR(todayStats.value?.total_withdraw_completed))

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
.app-wrapper {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  min-height: 100vh;
  background: linear-gradient(180deg, #0A4345 0%, #0B6563 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

/* Header Section */
.header-container {
  padding: 24px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.username {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.user-meta {
  display: flex;
  align-items: center;
  font-size: 12px;
}

.reff-label {
  color: rgba(255, 255, 255, 0.5);
}

.reff-val {
  color: #ffffff;
}

.divider-vert {
  width: 1px;
  height: 12px;
  background-color: #ffffff;
  margin: 0 8px;
}

.phone {
  color: #ffffff;
}

.header-logo {
  height: 24px;
  border-radius: 50px;
  object-fit: contain;
}

/* Referral Section */
#section-referral {
  padding: 0 20px;
}

.referral-card {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 16px;
}

.ref-row {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.ref-icon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.ref-content {
  flex-grow: 1;
}

.ref-title {
  color: #ffffff;
  font-size: 12px;
  margin-bottom: 4px;
}

.ref-value {
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
}

.ref-arrow {
  width: 24px;
  height: 24px;
}

.ref-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 12px 0;
}

/* Asset Section */
#section-asset {
  padding: 20px 20px 0;
}

.asset-card {
  background-color: #eeeeee;
  border-radius: 16px;
  padding: 16px;
}

.asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.asset-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.asset-main-icon {
  width: 24px;
  height: 24px;
}

.asset-main-title {
  color: rgba(18, 18, 18, 0.6);
  font-size: 14px;
  font-weight: 700;
}

.asset-eye-icon {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.asset-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-bappebti {
  height: 16px;
  object-fit: contain;
}

.badge-sk {
  height: 16px;
  object-fit: contain;
}

.asset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
}

.asset-info {
  flex-grow: 1;
}

.asset-label {
  color: #121212;
  font-size: 14px;
  margin-bottom: 4px;
}

.asset-val {
  color: #121212;
  font-size: 14px;
  font-weight: 700;
}

.asset-arrow {
  width: 24px;
  height: 24px;
}

.asset-divider {
  height: 1px;
  background-color: rgba(5, 5, 5, 0.1);
  margin: 4px 0;
}

/* Menu Section */
#section-menu {
  flex-grow: 1;
  margin-top: 24px;
  background-color: #f8f8f8;
  border-radius: 24px 24px 0 0;
  padding: 24px 20px 80px;
}

.security-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.sec-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sec-text {
  color: #121212;
  font-size: 10px;
  line-height: 1.4;
  opacity: 0.7;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
}

.menu-icon {
  width: 28px;
  height: 28px;
  margin-right: 16px;
}

.menu-label {
  flex-grow: 1;
  color: #121212;
  font-size: 14px;
  font-weight: 700;
}

.menu-arrow {
  width: 24px;
  height: 24px;
}

.menu-divider {
  height: 1px;
  background-color: rgba(5, 5, 5, 0.1);
}

.btn-logout {
  width: 100%;
  margin-top: 32px;
  padding: 14px;
  border-radius: 24px;
  background: linear-gradient(90deg, #4e733f 0%, #60995b 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
}

.btn-logout:active {
  opacity: 0.8;
}
</style>


