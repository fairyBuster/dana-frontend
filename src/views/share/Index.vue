<template>
  <div class="app-container">
    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Tim saya</h1>
          <p class="hero-subtitle">Pantau perkembangan tim dan bagikan link undangan Anda.</p>
        </div>
        <div class="hero-image">
          <img src="/assets/images/9f4d7b8ace034cd96bb6b037dd50538b5db64b68.png" alt="">
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section id="section-stats">
      <div class="section-inner">
        <div class="stats-card">
          <div class="stat-column">
            <div class="stat-header">
              <div class="stat-icon">
                <img src="/assets/images/46_756.svg" class="icon-bg" alt="">
                <img src="/assets/images/User check.png" class="icon-fg" alt="">
              </div>
              <span class="stat-title">Total Tim</span>
            </div>
            <div class="card-value">
              <div class="stat-value">{{ teamStats.totalMembers }}</div>
              <div class="stat-unit">orang</div>
            </div>
          </div>

          <div class="stat-column">
            <div class="stat-header">
              <div class="stat-icon">
                <img src="/assets/images/46_756.svg" class="icon-bg" alt="">
                <img src="/assets/images/Users.png" class="icon-fg" alt="">
              </div>
              <span class="stat-title">Anggota </span>
            </div>
            <div class="stat-value">{{ teamStats.activeMembers }}</div>
            <div class="stat-unit">orang</div>
          </div>

          <div class="stat-column last">
            <div class="stat-header">
               <div class="stat-icon">
                <img src="/assets/images/46_756.svg" class="icon-bg" alt="">
                <img src="/assets/images/User plus.png" class="icon-fg" alt="">
              </div>
      
              <span class="stat-title">Bonus Tim</span>
            </div>
            <div class="stat-value">{{ teamStats.totalBonus }}</div>
            <div class="stat-unit">Total bonus terkumpul</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Invite Link -->
    <section id="section-invite-link">
      <div class="section-inner">
        <div class="invite-card">
          <div class="invite-header">
            <div class="invite-icon-block"></div>
            <h2 class="invite-title">Link Undangan</h2>
          </div>
          <div class="invite-actions">
            <div class="invite-input-wrapper">
              <span class="invite-url" translate="no">{{ inviteLink }}</span>
            </div>
            <button class="btn-action btn-copy" @click="copyLink" aria-label="Copy">
              <img src="/assets/images/46_843.svg" alt="">
            </button>
            <button class="btn-action btn-share" @click="shareLink" aria-label="Share">
              <img src="/assets/images/46_848.svg" alt="">
            </button>
          </div>
          <div class="invite-code-wrapper">
            <span class="invite-code-text">Kode undangan: {{ referralCode || '-' }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Bonus -->
    <section id="section-team-bonus">
      <div class="section-inner">
        <div class="bonus-card">
          <h2 class="bonus-title">Bonus Tim</h2>
          <div class="bonus-levels">
            <div class="level-box level-1">
              <span class="level-name">Level 1</span>
              <span class="level-value">{{ commissionLevels.level1 }}%</span>
            </div>
            <div class="level-box level-2">
              <span class="level-name">Level 2</span>
              <span class="level-value">{{ commissionLevels.level2 }}%</span>
            </div>
            <div class="level-box level-3">
              <span class="level-name">Level 3</span>
              <span class="level-value">{{ commissionLevels.level3 }}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Member List -->
    <section id="section-member-list">
      <div class="section-inner">
        <div class="member-list-card">
          <span class="member-list-title">Daftar Anggota</span>
          <router-link to="/hn/network/community" class="member-list-link" aria-label="Lihat semua anggota">
            Lihat semua
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2.5L8 6L4.5 9.5" stroke="#cd8c09" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Invite Banner -->
    <section id="section-invite-banner">
      <div class="section-inner">
        <div class="invite-banner-card">
          <div class="banner-content">
            <img src="/assets/images/image 88.png" alt="" class="banner-icon">
            <div class="banner-text">
              <h3 class="banner-title">Undang teman dan dapatkan bonus tim!</h3>
              <p class="banner-subtitle">Bagikan link undangan Anda untuk mendapatkan bonus dari setiap anggota aktif.</p>
            </div>
          </div>
          <button class="btn-invite-now" @click="shareLink">Undang</button>
        </div>
      </div>
    </section>

    <FooterBar />
  </div>

  <SuccessModal
    v-model="successModalOpen"
    :message="successMessage"
    @confirm="successModalOpen = false"
  />
</template>

<script setup>
import { computed, onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import { getFrontendUrl, formatAppCurrency } from '@/utils/settings'
import FooterBar from '@/components/partials/AppFooter.vue'
import SuccessModal from '@/components/modals/AppSuccessModal.vue'

const router = useRouter()
const referralCode = ref('')
const inviteLink = ref('')
const frontendBaseUrl = ref('')
const successModalOpen = ref(false)
const successMessage = ref('')
const accountData = ref(null)

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

const teamStats = computed(() => {
  const data = accountData.value || {}
  const total = Number(data.team_count ?? data.total_team ?? 0)
  const active = Number(data.active_team ?? data.active_members ?? 0)
  const bonus = Number(data.team_bonus ?? data.total_commission ?? 0)
  return {
    totalMembers: total,
    activeMembers: active,
    totalBonus: formatRupiah(bonus)
  }
})

const commissionLevels = computed(() => {
  const data = accountData.value || {}
  return {
    level1: data.commission_level1 ?? data.level1_rate ?? 33,
    level2: data.commission_level2 ?? data.level2_rate ?? 2,
    level3: data.commission_level3 ?? data.level3_rate ?? 1
  }
})

const ensureFrontendBaseUrl = async () => {
  if (frontendBaseUrl.value) return frontendBaseUrl.value
  try {
    const resp = await authAPI.getSettings()
    const apiUrl = String(resp?.data?.frontend_url || '').trim()
    if (apiUrl) {
      frontendBaseUrl.value = apiUrl.replace(/\/+$/, '')
      return frontendBaseUrl.value
    }
  } catch (_) {}
  frontendBaseUrl.value = getFrontendUrl()
  return frontendBaseUrl.value
}

const buildInviteLink = (code) => {
  const base = String(frontendBaseUrl.value || '').replace(/\/+$/, '')
  const safeCode = String(code || '').trim()
  const hashPath = safeCode
    ? `#/hn/network/${encodeURIComponent(safeCode)}`
    : '#/hn/network'
  return base ? `${base}/${hashPath}` : `/${hashPath}`
}

const loadAccountInfo = async () => {
  await ensureFrontendBaseUrl()
  try {
    const resp = await authAPI.getAccountInfo()
    const data = resp?.data || {}
    accountData.value = data
    referralCode.value = String(data.referral_code || '').trim()
    inviteLink.value = buildInviteLink(referralCode.value)
  } catch (_) {
    referralCode.value = ''
    inviteLink.value = buildInviteLink('')
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink.value).then(() => {
    successMessage.value = 'Link undangan berhasil disalin'
    successModalOpen.value = true
  }).catch(() => {})
}

const shareLink = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Dana Proteksi',
      text: `Bergabung bersama saya di Dana Proteksi! Gunakan kode undangan: ${referralCode.value}`,
      url: inviteLink.value
    }).then(() => {
      successMessage.value = 'Link undangan berhasil dibagikan'
      successModalOpen.value = true
    }).catch(() => {})
  } else {
    copyLink()
  }
}

onMounted(() => {
  loadAccountInfo()
})

onActivated(() => {
  loadAccountInfo()
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
  min-height: 100vh;
  position: relative;
  margin: 0 auto;
  padding-bottom: 80px;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, p {
  margin: 0;
}

button {
  font-family: inherit;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}

.section-inner {
  padding: 0 24px;
  margin-bottom: 16px;
}

/* Hero */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 24px 20px 24px;
}

.hero-content {
  flex: 1;
  padding-right: 16px;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
}

.hero-subtitle {
  font-size: 13px;
  line-height: 1.4;
  color: #635f5f;
}

.hero-image {
  width: 120px;
  flex-shrink: 0;
}

.hero-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* Stats */
.stats-card {
  background: linear-gradient(90deg, #F4C142 0%, #F8DD89 46.63%, #F5CA51 100%);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
}

.stat-column {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-column .stat-value,
.stat-column .stat-unit {
  text-align: center;
}

.stat-column.last {
  flex: 1.5;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stat-icon {
  position: relative;
  width: 36px;
  height: 36px;
}

.icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.icon-fg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  object-fit: contain;
  display: block;
}

.stat-icon-single {
  width: 36px;
  height: 36px;
}

.stat-icon-rp {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #000000;
  flex-shrink: 0;
}

.stat-title {
  font-size: 11px;
  font-weight: 400;
  color: #000000;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2px;
}

.stat-unit {
  font-size: 10px;
  color: #4e4e4e;
}

/* Invite Link */
.invite-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
}

.invite-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.invite-icon-block {
  width: 32px;
  height: 26px;
  background-color: #fcf2dd;
  border-radius: 5px;
}

.invite-title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.invite-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.invite-input-wrapper {
  flex: 1;
  border: 0.5px solid #9a9a9a;
  border-radius: 5px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
}

.invite-url {
  font-size: 11px;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-action {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-action img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.btn-copy {
  border: 0.5px solid #9a9a9a;
  background-color: transparent;
}

.btn-share {
  background-color: #f3b73f;
}

.invite-code-wrapper {
  display: inline-block;
  background-color: #fdfaf5;
  border: 0.5px solid #dadada;
  border-radius: 5px;
  padding: 4px 12px;
}

.invite-code-text {
  font-size: 11px;
  color: #000000;
}

/* Team Bonus */
.bonus-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
}

.bonus-title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 16px;
}

.bonus-levels {
  display: flex;
  gap: 12px;
}

.level-box {
  flex: 1;
  border-radius: 5px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-1 {
  background-color: #f8fafe;
  border: 1px solid #b4dcff;
}

.level-2 {
  background-color: #fcfef8;
  border: 1px solid #a8e0ba;
}

.level-3 {
  background-color: #faf9fc;
  border: 1px solid #b7adff;
}

.level-name {
  font-size: 11px;
  color: #000000;
}

.level-value {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
}

/* Member List */
.member-list-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.member-list-title {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.member-list-link {
  font-size: 12px;
  color: #cd8c09;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
  cursor: pointer;
}

/* Invite Banner */
#section-invite-banner .section-inner {
  margin-bottom: 24px;
}

.invite-banner-card {
  background-color: #fdf5e6;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.banner-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-icon {
  width: 65px;
  margin-top: 30px;
  height: 48px;
  flex-shrink: 0;
  object-fit: contain;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 13px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
  line-height: 1.3;
}

.banner-subtitle {
  font-size: 10px;
  color: #000000;
  line-height: 1.4;
}

.btn-invite-now {
  background: linear-gradient(90deg, #F4C142 0%, #F8DD89 47%, #F5CA51 100%);
  border-radius: 10px;
  padding: 8px 16px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
