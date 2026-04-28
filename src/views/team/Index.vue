<template>
  <div class="app-container">
    <!-- Header -->
    <header class="main-header">
      <h1 class="page-title">Tim Saya</h1>
      <button class="invite-btn" @click="inviteMembers">
        <img src="/assets/images/1be34f61fca8018ee484cfa57216986588de26b2.png" alt="Kartu undangan" class="invite-icon">
        <span>Kartu<br>undangan</span>
      </button>
    </header>

    <!-- Overview Section -->
    <div class="overview-section">
      <h2 class="section-subtitle">Gambaran umum data tim</h2>
      <div class="overview-cards">
        <div class="stat-card">
          <div class="stat-card-header">
            <img src="/assets/images/cde3277fa2769528c9be71b8b0840666c070bbdb.png" alt="Icon" class="stat-card-icon">
            <span class="stat-card-label">Total pendaftaran</span>
          </div>
          <div class="stat-card-value">{{ totalTeamSize }}</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <img src="/assets/images/51c612507498a1350e8a34d624b4f99146ecdfe9.png" alt="Icon" class="stat-card-icon">
            <span class="stat-card-label">Total komisi saya</span>
          </div>
          <div class="stat-card-value">{{ formatCurrency(totalCommission) }}</div>
        </div>
      </div>
    </div>

    <!-- Team Data Section -->
    <div class="team-data-container">
      <h2 class="team-data-title">Data singkat tim saya</h2>

      <div v-for="team in teams" :key="team.id" class="team-card">
        <div class="team-badge">Tim {{ team.id }}</div>
        <div class="team-card-title">{{ team.description }}</div>
        <div class="team-stats-grid">
          <div class="team-stat-item">
            <span class="team-stat-val">{{ team.effective }}</span>
            <span class="team-stat-lbl">Tim aktif<br>saya</span>
          </div>
          <div class="team-stat-item">  
            <span class="team-stat-val">{{ formatCurrency(team.deposit) }}</span>
            <span class="team-stat-lbl">Isi ulang tim<br>saya</span>
          </div>
          <!-- <div class="team-stat-item">
            <span class="team-stat-val">{{ formatCurrency(team.asset) }}</span>
            <span class="team-stat-lbl">Aset tim<br>saya</span>
          </div> -->
          <div class="team-stat-item">
            <span class="team-stat-val">{{ team.commissionPct }}%</span>
            <span class="team-stat-lbl">Commision<br>precentage</span>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <router-link class="btn-primary" to="/profile/statistic">Detail tim saya</router-link>
        <a class="btn-primary" @click.prevent="goToCommissionTrx">Detail komisi saya</a>
      </div>
    </div>

    <FooterBar />
    <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import FooterBar from '@/components/partials/FooterBar.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()

const accountInfo = ref(null)
const downlineOverview = ref(null)
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

const toNumber = (value) => {
  const n = Number(String(value ?? 0).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value) => {
  const num = toNumber(value)
  if (num === 0) return 'Rp 0'
  return 'Rp ' + new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
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

const totalTeamSize = computed(() => {
  return level1to3.value.reduce((acc, l) => acc + Number(l?.member_count || 0), 0)
})

const commissionRates = { 1: 33, 2: 2, 3: 1 }

const teams = computed(() => {
  const desc = {
    1: 'Tim yang Anda undang secara langsung',
    2: 'Tim yang diundang oleh Tim 1 Anda',
    3: 'Tim yang diundang oleh Tim 2 Anda'
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
      deposit: toNumber(l?.total_deposit_amount),
      asset: toNumber(l?.total_investment_amount),
      commissionPct: commissionRates[lvl] || 0,
      description: desc[lvl] || 'Ikhtisar tim.'
    }
  })
})

const inviteMembers = () => {
  router.push('/share')
}

const goToTeamDetail = () => {
  router.push('/team/1')
}

const goToCommissionTrx = () => {
  router.push('/commission/history')
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal mengambil data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal mengambil data'
}

const fetchAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    accountInfo.value = resp?.data || null
  } catch (_) {
    accountInfo.value = null
  }
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
  fetchDownlineOverview()
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  padding-bottom: 60px;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

/* Header */
.main-header {
  position: relative;
  padding: 24px 16px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

.invite-btn {
  position: absolute;
  right: 16px;
  top: 16px;
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 4px;
  font-family: inherit;
}

.invite-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.invite-btn span {
  font-size: 10px;
  color: #000000;
  text-align: center;
  line-height: 1.2;
}

/* Overview Section */
.overview-section {
  padding: 16px;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  margin-bottom: 12px;
}

.overview-cards {
  display: flex;
  gap: 12px;
}

.stat-card {
  flex: 1;
  background-color: rgba(0, 77, 67, 0.5);
  border-radius: 5px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-card-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.stat-card-label {
  font-size: 11px;
  color: #ffffff;
}

.stat-card-value {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  padding-left: 24px;
}

/* Team Data Section */
.team-data-container {
  background-color: #ffffff;
  padding: 20px 16px 30px;
  min-height: 500px;
}

.team-data-title {
  font-size: 14px;
  font-weight: 600;
  color: #004d43;
  margin-bottom: 16px;
}

.team-card {
  border: 0.5px solid rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  padding: 16px 5px;
  margin-bottom: 16px;
  position: relative;
}

.team-badge {
  position: absolute;
  top: -1px;
  right: -1px;
  background-color: #004d43;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 0 5px 0 5px;
}

.team-card-title {
  font-size: 11px;
  font-weight: 600;
  color: #004d43;
  margin-bottom: 16px;
  padding-right: 60px;
}

.team-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0px, 1fr));
  column-gap: 0px;
  padding: 0 !important;
  margin: 0 !important;
  align-items: flex-start;
}

.team-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  gap: 0px;
}

.team-stat-val {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
}

.team-stat-lbl {
  font-size: 9px;
  color: #b2b2b2;
  line-height: 1.2;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary {
  display: block;
  width: 100%;
  background-color: #004d43;
  color: #ffffff;
  text-align: center;
  padding: 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
</style>


