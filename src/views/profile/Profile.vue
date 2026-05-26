<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="site-header">
        <div class="logo-container">
          <img src="/assets/images/108294978d9cad25785261933372f80a0602c03d.png" alt="" class="logo">
        </div>
        <div class="header-actions">
          <div class="action-item">
            <img src="/assets/images/f5801c8058fb78330691ba1b7f6aacffd756c5c0.png" alt="" class="action-icon">
            <span class="action-text">Unduh aplikasi</span>
          </div>
          <div class="action-item" @click="handleLogout">
            <div class="merged-icon logout-icon-wrap">
              <img src="/assets/images/51_112.svg" alt="" class="icon-bg">
              <img src="/assets/images/53_213.svg" alt="" class="icon-fg">
            </div>
            <span class="action-text">Keluar</span>
          </div>
        </div>
      </header>
    </section>

    <!-- Account Info -->
    <section id="section-account-info" class="section-padding">
      <div class="account-header">
        <h1 class="page-title">Akun</h1>
        <p class="page-subtitle">Kelola profil dan pengaturan akun Anda.</p>
      </div>

      <div class="user-card">
        <img src="/assets/images/108294978d9cad25785261933372f80a0602c03d.png" alt="" class="user-avatar">
        <div class="user-details">
          <h2 class="user-name">{{ displayUsername }}</h2>
          <p class="user-contact">{{ displayPhone }}<br>ID: {{ displayUid }}</p>
        </div>
        <div class="user-vip-status" @click="router.push('/hn/network/invite')">
          <span class="vip-level">{{ vipText }}</span>
          <img src="/assets/images/49_1111.svg" alt="" class="arrow-icon">
        </div>
      </div>

      <div class="vip-upgrade-card" @click="router.push('/hn/user/person')">
        <img src="/assets/images/33dd6484afb9e890391e4c5b0548521621a35b4a.png" alt="" class="vip-shield">
        <div class="vip-upgrade-info">
          <h3 class="vip-upgrade-title">Upgrade ke VIP</h3>
          <p class="vip-upgrade-desc">Nikmati berbagai keuntungan eksklusif khusus untuk member VIP.</p>
        </div>
        <button class="btn-lihat-vip">Lihat VIP</button>
      </div>
    </section>

    <!-- My Account -->
    <section id="section-my-account" class="section-padding">
      <h3 class="section-title">Akun Saya</h3>
      <div class="white-card">
        <div class="my-account-grid">
          <div class="grid-item" @click="router.push('/hn/user/account')">
            <div class="grid-icon-wrap">
              <img src="/assets/images/51_120.svg" alt="" class="icon-bg">
              <img src="/assets/images/bank.png" alt="" class="icon-fg-lg">
            </div>
            <span class="item-label">Ikat Bank</span>
          </div>
          <div class="divider"></div>
          <div class="grid-item" @click="router.push('/hn/hall/taskhall')">
            <div class="grid-icon-wrap">
              <img src="/assets/images/51_163.svg" alt="" class="icon-bg">
              <img src="/assets/images/challege.png" alt="" class="icon-fg-lg">
            </div>
            <span class="item-label">Challenge</span>
          </div>
          <div class="divider"></div>
          <div class="grid-item" @click="router.push('/hn/rewards')">
            <div class="grid-icon-wrap">
              <img src="/assets/images/51_165.svg" alt="" class="icon-bg">
              <img src="/assets/images/reward.png" alt="" class="icon-fg-lg">
            </div>
            <span class="item-label">Reward</span>
          </div>
          <div class="divider"></div>
           <div class="grid-item" @click="showAttendanceModal = true">
            <div class="grid-icon-wrap">
              <img src="/assets/images/51_165.svg" alt="" class="icon-bg">
              <img src="/assets/images/attedance.png" alt="" class="icon-fg-lg">
            </div>
            <span class="item-label">Absen Hari ini</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Formal Services -->
    <section id="section-formal-services" class="section-padding">
      <h3 class="section-title">Layanan</h3>
      <div class="white-card">
        <div class="services-grid">
          <div class="service-item" @click="router.push('/hn/review')">
            <img src="/assets/images/Sidebar.png" alt="" class="service-icon">
            <span class="service-label">Testimoni Nasabah</span>
          </div>
          <div class="service-item" @click="router.push('/hn/company')">
            <img src="/assets/images/Smartphone.png" alt="" class="service-icon">
            <span class="service-label">Legal Perusahaan</span>
          </div>
          <div class="service-item" @click="router.push('/hn/settings/device-info')">
            <img src="/assets/images/Eye.png" alt="" class="service-icon">
            <span class="service-label">Profil Saya</span>
          </div>
          <div class="service-item" @click="router.push('/hn/user/change')">
            <img src="/assets/images/Edit.png" alt="" class="service-icon">
            <span class="service-label">Ubah Kata Sandi</span>
          </div>
          <div class="service-item" @click="router.push('/hn/legal/terms')">
            <img src="/assets/images/Book open.png" alt="" class="service-icon">
            <span class="service-label">Syarat Layanan</span>
          </div>
          <div class="service-item" @click="router.push('/hn/legal/privacy')">
            <img src="/assets/images/Alert triangle.png" alt="" class="service-icon">
            <span class="service-label">Kebijakan Privasi</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Security Banner -->
    <section id="section-security-banner" class="section-padding">
      <div class="security-banner">
        <div class="banner-content">
          <h3 class="banner-title">Keamanan akun Anda adalah prioritas kami</h3>
          <p class="banner-desc">Pastikan informasi akun Anda selalu terkini dan aman.</p>
          <button class="btn-learn-more" @click="router.push('/hn/user/help')">
            Pelajari lebih lanjut
            <img src="/assets/images/49_1111.svg" alt="" class="btn-arrow">
          </button>
        </div>
        <div class="banner-image-container">
          <img src="/assets/images/9f4d7b8ace034cd96bb6b037dd50538b5db64b68.png" alt="" class="banner-image">
        </div>
      </div>
    </section>

    <FooterBar />
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
    <EditUsernameModal
      v-model="showUsernameModal"
      :current-username="accountInfo?.username || ''"
      @success="handleUsernameUpdate"
    />
    <AttendanceModal :show="showAttendanceModal" @close="showAttendanceModal = false" />
  </div>
</template>

<script setup>
import { computed, onActivated, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import FooterBar from '@/components/partials/AppFooter.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import EditUsernameModal from '@/components/modals/EditUsernameModal.vue'
import AttendanceModal from '@/components/AttendanceModal.vue'
import { authAPI } from '@/services/api'
import { appSettings, formatAppCurrency } from '@/utils/settings'

const router = useRouter()

const accountInfo = ref(null)
const currentRank = ref(null)
const currentTitle = ref(null)
const isRefreshing = ref(false)
const lastRefreshedAt = ref(0)

const showErrorModal = ref(false)
const errorMessage = ref('')
const showUsernameModal = ref(false)
const showAttendanceModal = ref(false)

const handleUsernameUpdate = (newUsername) => {
  if (accountInfo.value) {
    accountInfo.value.username = newUsername
  }
}

const rawUid = computed(() => {
  const d = accountInfo.value || {}
  const uid = d.referral_code ?? d.id ?? d.user_id ?? null
  if (uid === null || uid === undefined || uid === '') return null
  return uid
})

const displayUid = computed(() => {
  if (rawUid.value === null) return '-'
  return String(rawUid.value)
})

const displayUsername = computed(() => {
  const d = accountInfo.value || {}
  const name = String(d.username || d.name || '').trim()
  return name || 'Pengguna'
})

const displayPhone = computed(() => {
  const d = accountInfo.value || {}
  const p = String(d.phone || d.phone_number || d.user_phone || '').trim()
  return p || '-'
})

const displayEmail = computed(() => {
  const d = accountInfo.value || {}
  const e = String(d.email || d.user_email || d.mail || '').trim()
  return e || '-'
})

const showVipPlaceholder = computed(() => {
  const title = String(currentTitle.value || '').trim()
  if (title) return false
  return currentRank.value === null || currentRank.value === undefined || currentRank.value === ''
})

const vipText = computed(() => {
  if (showVipPlaceholder.value) return 'VIP-0'
  const title = String(currentTitle.value || '').trim()
  if (title) return title
  const r = currentRank.value
  if (r === null || r === undefined || r === '') return 'VIP-0'
  const n = Number(r)
  return Number.isFinite(n) ? `VIP-${n}` : String(r)
})

const handleLogout = () => {
  router.push('/hn/console')
}

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

const refreshProfileData = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  try {
    await Promise.all([
      fetchAccountInfo(),
      fetchRankStatus()
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #fdfaf4;
  position: relative;
  min-height: 100vh;
  padding-bottom: 80px;
  overflow-x: hidden;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.section-padding {
  padding: 0 20px;
}

h1, h2, h3, h4, p {
  margin: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  border: none;
  background: none;
  font-family: inherit;
  cursor: pointer;
}

/* Header */
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 20px 10px 20px;
}

.logo {
  width: 152px;
  height: auto;
  object-fit: contain;
}

.header-actions {
  display: flex;
  gap: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
 
}

.action-icon {
  width: 39px;
  height: 39px;
  margin-bottom: 4px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.action-text {
  font-size: 10px;
  color: #000000;
  max-width: 60px;
  line-height: 1.2;
}

.logout-icon-wrap {
  position: relative;
  width: 37px;
  height: 37px;
  
  margin: 0 auto 4px;
}

.logout-icon-wrap .icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  
  width: 100%;
  height: 100%;
}

.logout-icon-wrap .icon-fg {
  position: absolute;
  top: 50%;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
}

/* Account Info */
#section-account-info .account-header {
  margin-bottom: 15px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 12px;
  color: #635f5f;
}

.user-card {
  background-color: #fdf5e6;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.user-avatar {
  width: 53px;
  height: 62px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 4px;
}

.user-contact {
  font-size: 10px;
  color: #000000;
  line-height: 1.4;
}

.user-vip-status {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.vip-level {
  font-size: 14px;
  font-weight: 700;
  color: #875a00;
  font-style: italic;
  margin-right: 5px;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}

.vip-upgrade-card {
  background-color: #fdf5e6;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  cursor: pointer;
}

.vip-shield {
  width: 70px;
  height: 52px;
  object-fit: contain;
  margin-right: 10px;
}

.vip-upgrade-info {
  flex: 1;
}

.vip-upgrade-title {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
}

.vip-upgrade-desc {
  font-size: 9px;
  color: #000000;
  line-height: 1.3;
  max-width: 160px;
}

.btn-lihat-vip {
  background-color: #f0b03d;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 10px;
  white-space: nowrap;
}

/* My Account */
.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 10px;
}

.white-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  padding: 15px 10px;
  margin-bottom: 25px;
}

.my-account-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
  cursor: pointer;
}

.grid-icon-wrap {
  position: relative;
  width: 42px;
  height: 42px;
  margin: 0 auto 8px;
}

.grid-icon-wrap .icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.grid-icon-wrap .icon-fg-lg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 29px;
  height: 27px;
  object-fit: contain;
}

.item-label {
  font-size: 10px;
  color: #000000;
}

.divider {
  width: 1px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.1);
}

/* Formal Services */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px 10px;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.service-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
}

.service-label {
  font-size: 10px;
  color: #000000;
  max-width: 90px;
}

/* Security Banner */
#section-security-banner {
  margin-bottom: 30px;
}

.security-banner {
  background-color: #fcf3df;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.banner-content {
  flex: 1;
  z-index: 2;
  max-width: 60%;
}

.banner-title {
  font-size: 14px;
  font-weight: 700;
  color: #060606;
  margin-bottom: 8px;
  line-height: 1.3;
}

.banner-desc {
  font-size: 10px;
  color: #494949;
  margin-bottom: 12px;
  line-height: 1.4;
}

.btn-learn-more {
  background: linear-gradient(90deg, #f4c142 0%, #f5ca51 100%);
  border-radius: 10px;
  padding: 6px 12px;
  display: inline-flex;
  align-items: center;
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
}

.btn-arrow {
  width: 16px;
  height: 16px;
  margin-left: 4px;
}

.banner-image-container {
  position: absolute;
  right: -10px;
  bottom: 0;
  width: 151px;
  height: 97px;
  z-index: 1;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
