<template>
  <div class="app-container">
    <div class="content-wrapper">
      <!-- Header -->
      <header class="app-header">
        <div class="back-btn" @click="goBack">
          <img src="/assets/image/172_391.svg" alt="Back">
        </div>
        <h1 class="page-title">Tim</h1>
        <div class="header-spacer"></div>
      </header>

      <!-- Main Card -->
      <main class="main-card">
        <!-- Tab Label -->
        <a
          href="#/pages/history/teams"
          class="benefit-tag"
          @click.prevent="goToCommissionTrx"
        >
          <span>Catatan manfaat</span>
        </a>

        <!-- Profile Section -->
        <div class="profile-section">
          <div class="avatar-container">
            <img :src="avatarSrc" alt="Avatar" class="avatar">
          </div>
          <div class="user-info">
            <h2 class="username">{{ displayUsername }}</h2>
            <p class="user-id">ID akun: {{ displayUid }}</p>
            <div class="vip-badge">
              <span class="vip-text">{{ vipText }}</span>
              <div class="vip-icon">
                <img src="/assets/image/5fb42ec97aec809c1357f284f6344e0829f4ad5e.png" alt="VIP">
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="stats-container">
          <!-- Commission Row -->
          <div class="stat-row commission-card">
            <span class="stat-label">Total komisi tim (terhitung 1-3)</span>
            <span class="stat-value">{{ formatCurrency(totalCommission) }}</span>
          </div>

          <!-- Detailed Stats Block -->
          <div class="stats-block">
            <!-- Stat Item 1 -->
            <div class="stat-group">
              <div class="stat-header">
                <span class="stat-label">Total ukuran tim efektif (terhitung 1-3) :</span>
                <span class="stat-sub-label">Total tim</span>
              </div>
              <div class="stat-values">
                <span class="stat-number">{{ effectiveTeamSize }}</span>
                <span class="stat-number">{{ totalTeamSize }}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bg"></div>
                <div class="progress-fill" :style="{ width: teamProgress + '%' }"></div>
              </div>
            </div>

            <!-- Stat Item 2 -->
            <div class="stat-group mt-15">
              <div class="stat-header">
                <span class="stat-label">Deposito tim Anda hari ini (terhitung 1-3) :</span>
              </div>
              <div class="stat-values">
                <span class="stat-number">{{ formatCurrency(teamDepositToday) }}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bg"></div>
                <div class="progress-fill" :style="{ width: depositProgress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team List Section -->
        <div class="team-list-section">
          <h3 class="section-title">Ikhtisar team</h3>

          <!-- Team Card 1 -->
          <div class="team-card" v-for="team in teams" :key="team.id">
            <div class="team-card-top">
              <div class="team-icon">
                <img src="/assets/image/cce62d9ede0d2eb5043f2e6d3fbdbf6eaa437582.png" alt="Team Icon">
              </div>
              <div class="team-info">
                <h4 class="team-name">{{ team.name }}</h4>
                <p class="team-stat">Team size: {{ team.size }}</p>
                <p class="team-stat">Team effective: {{ team.effective }}</p>
              </div>
              <div class="team-action">
                <a :href="'#/pages/invite/team/level/' + team.id" class="btn-detail" @click.prevent="viewDetail(team)">Detail</a>
              </div>
            </div>
            <div class="divider"></div>
            <p class="team-desc">{{ team.description }}</p>
          </div>
        </div>
      </main>

      <!-- Bottom Action -->
      <div class="bottom-action">
        <button class="btn-invite" @click="inviteMembers">
          Undang anggota
        </button>
      </div>
    </div>
  </div>
  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { avatarSrc } from '@/utils/avatar'
import { authAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()

const accountInfo = ref(null)
const currentRank = ref(null)
const currentTitle = ref(null)
const downlineOverview = ref(null)
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const displayUsername = computed(() => {
  const d = accountInfo.value || {}
  const username = String(d.full_name || d.username || d.phone || d.name || '').trim()
  return username || 'Username'
})

const displayUid = computed(() => {
  const d = accountInfo.value || {}
  const uid = d.referral_code ?? d.id ?? d.user_id ?? null
  if (uid === null || uid === undefined || uid === '') return '-'
  return String(uid)
})

const vipText = computed(() => {
  const title = String(currentTitle.value || '').trim()
  if (title) return title
  const n = Number(currentRank.value)
  return Number.isFinite(n) ? `V${n}` : 'V0'
})

const toNumber = (value) => {
  const n = Number(String(value ?? 0).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const level1to3 = computed(() => {
  const levels = Array.isArray(downlineOverview.value?.levels) ? downlineOverview.value.levels : []
  return levels.filter((l) => [1, 2, 3].includes(Number(l?.level)))
})

const totalCommission = computed(() => {
  return level1to3.value.reduce((acc, l) => {
    return acc + toNumber(l?.total_profit_commission) + toNumber(l?.total_purchase_commission)
  }, 0)
})

const effectiveTeamSize = computed(() => {
  return level1to3.value.reduce((acc, l) => acc + Number(l?.active_member_count || 0), 0)
})

const totalTeamSize = computed(() => {
  return level1to3.value.reduce((acc, l) => acc + Number(l?.member_count || 0), 0)
})

const teamDepositToday = computed(() => {
  return level1to3.value.reduce((acc, l) => acc + toNumber(l?.total_deposit_amount), 0)
})

const teams = computed(() => {
  const desc = {
    1: 'Anggota yang bergabung langsung melalui tautan undangan Anda.',
    2: 'Anggota yang bergabung melalui undangan dari Tim Tingkat 1 Anda',
    3: 'Anggota yang bergabung melalui undangan dari Tim Tingkat 2 Anda'
  }
  const levels = level1to3.value
  const byLevel = (lvl) => levels.find((l) => Number(l?.level) === Number(lvl)) || null
  return [1, 2, 3].map((lvl) => {
    const l = byLevel(lvl)
    return {
      id: lvl,
      name: `Team ${lvl}`,
      size: Number(l?.member_count || 0),
      effective: Number(l?.active_member_count || 0),
      description: desc[lvl] || 'Ikhtisar tim.'
    }
  })
})

const teamProgress = computed(() => {
  const total = Number(totalTeamSize.value || 0)
  if (!total) return 0
  return Math.min((Number(effectiveTeamSize.value || 0) / total) * 100, 100)
})

const depositProgress = computed(() => {
  return Math.min((Number(teamDepositToday.value || 0) / 150000) * 100, 100)
})

const goBack = () => {
  router.go(-1)
}

const goToCommissionTrx = () => {
  router.push('/pages/history/teams')
}

const viewDetail = (team) => {
  // Navigate to team detail page
  console.log('View detail for:', team.name)
  router.push(`/pages/invite/team/level/${team.id}`)
}

const inviteMembers = () => {
  router.push('/pages/invite/invite')
}

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
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

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal mengambil data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal mengambil data'
}

const fetchDownlineOverview = async () => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const resp = await authAPI.getDownlineOverview()
    downlineOverview.value = resp?.data || null
  } catch (err) {
    downlineOverview.value = null
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAccountInfo()
  fetchRankStatus()
  fetchDownlineOverview()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Layout & Container */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0f0f1c;
  color: #ffffff;
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

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

.app-container {
  position: relative;
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: #000;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding: 18px 10px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Header */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

.back-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.header-spacer {
  width: 24px;
}

/* Main Card */
.main-card {
  background-color: #1d2138;
  border-radius: 10px;
  width: 100%;
  padding: 20px 10px;
  position: relative;
  margin-bottom: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

/* Benefit Tag */
.benefit-tag {
  position: absolute;
  top: 18px;
  left: 0;
  background: linear-gradient(90deg, #746a9a 0%, #272434 100%);
  padding: 6px 15px;
  border-radius: 0 15px 15px 0;
  display: inline-block;
  text-decoration: none;
}

.benefit-tag span {
  font-size: 12px;
  color: #fff;
}

/* Profile Section */
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 25px;
  margin-top: 10px;
}

.avatar-container {
  width: 56px;
  height: 57px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  text-align: center;
}

.username {
  font-size: 14px;
  margin: 0 0 4px 0;
  font-weight: 600;
  color: #fff;
}

.user-id {
  font-size: 12px;
  margin: 0 0 8px 0;
  opacity: 0.9;
  color: #fff;
}

.vip-badge {
  display: inline-flex;
  align-items: center;
  background-color: #a296ff;
  border-radius: 10px;
  padding: 2px 8px;
  gap: 4px;
  box-shadow: inset 0px 4px 30px rgba(0, 0, 0, 0.3);
}

.vip-text {
  font-size: 10px;
  font-weight: 700;
  color: #301f80;
}

.vip-icon img {
  width: 16px;
  height: 12px;
}

/* Stats Section */
.stats-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.stat-row, .stats-block, .team-card {
  background: linear-gradient(90deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(158, 158, 158, 0.25);
}

.commission-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
}

.stat-label {
  font-size: 11px;
  color: #fff;
}

.stat-value {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.stats-block {
  padding: 15px;
}

.stat-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mt-15 {
  margin-top: 15px;
}

.stat-header {
  display: flex;
  justify-content: space-between;
}

.stat-sub-label {
  font-size: 11px;
  color: #fff;
}

.stat-values {
  display: flex;
  justify-content: space-between;
}

.stat-number {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
}

.progress-bar-container {
  position: relative;
  height: 4px;
  width: 100%;
  margin-top: 4px;
}

.progress-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #746a9a;
  border-radius: 15px;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 31%, #9047e0 100%);
  border-radius: 10px;
}

/* Team List Section */
.team-list-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-size: 12px;
  margin: 0 0 5px 5px;
  font-weight: 500;
  color: #fff;
}

.team-card {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-card-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.team-icon {
  width: 27px;
  height: 26px;
  flex-shrink: 0;
}

.team-info {
  flex-grow: 1;
}

.team-name {
  font-size: 12px;
  margin: 0 0 4px 0;
  color: #fff;
}

.team-stat {
  font-size: 11px;
  margin: 2px 0;
  opacity: 0.9;
  color: #fff;
}

.btn-detail {
  display: inline-block;
  text-decoration: none;
  background: linear-gradient(90deg, #746a9a 0%, #272434 100%);
  color: #fff;
  font-size: 10px;
  padding: 4px 12px;
  border-radius: 2px;
}

.divider {
  height: 1px;
  background-color: #746a9a;
  width: 100%;
  opacity: 0.5;
}

.team-desc {
  font-size: 10px;
  color: #888;
  margin: 0;
  line-height: 1.3;
}

/* Bottom Action */
.bottom-action {
  width: 100%;
  margin-top: 10px;
}

.btn-invite {
  width: 100%;
  height: 41px;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 31%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
