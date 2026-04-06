<template>
  <div class="app-container">
    <section id="header-section">
      <div class="header-container">
        <button class="back-btn" @click="goBack">
          <img src="/assets/image/172_391.svg" alt="Back">
        </button>
        <h1 class="page-title">Detail tim {{ teamId }}</h1>
      </div>
    </section>

    <section id="stats-section">
      <div class="stats-wrapper">
        <div class="stats-card">
          <div class="stats-top">
            <div class="avatar-col">
              <img src="/assets/image/cce62d9ede0d2eb5043f2e6d3fbdbf6eaa437582.png" alt="Team Avatar" class="team-avatar">
            </div>
            <div class="info-col">
              <h2 class="team-name">{{ teamData.name }}</h2>
              <p class="team-metric">Team size: {{ formatNumber(teamData.size) }}</p>
              <p class="team-metric">Team effective: {{ formatNumber(teamData.effective) }}</p>
            </div>
            <div class="deposito-col">
              <p class="deposito-label">Deposito team:</p>
              <p class="deposito-value">RP {{ formatCurrency(teamData.deposit) }}</p>
            </div>
          </div>

          <div class="divider"></div>

          <p class="card-footer-text">
            {{ teamData.description }}
          </p>
        </div>
      </div>
    </section>

    <section id="transactions-section">
      <div class="transactions-wrapper">
        <div v-if="members.length === 0 && !loading" class="empty-state">
          <img src="/assets/image/empty.png" alt="No Data" class="empty-icon">
        </div>

        <article v-for="member in visibleMembers" :key="member.id" class="transaction-card">
          <div class="card-row top-row">
            <span class="id-text">{{ member.phone || member.username || '-' }}</span>
            <span class="amount-text">Deposito: RP {{ formatCurrency(member.total_deposit || 0) }}</span>
          </div>
          <div class="card-row">
            <span class="date-text">{{ formatDate(member.registration_date) }}</span>
          </div>
          <div v-if="member.note" class="card-row">
            <span class="desc-text">{{ member.note }}</span>
          </div>
          <!-- <div class="card-row">
            <span class="desc-text">{{ member.username || '-' }}</span>
          </div> -->
        </article>

        <div v-if="!loading && canLoadMore" class="pagination-row">
          <button class="load-more-btn" @click="loadMore">
            Memuat lebih banyak
          </button>
        </div>
        <div v-if="loading" class="loading-state"></div>
      </div>
    </section>
  </div>
  <LoadingSpinner :visible="loading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, investmentAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const teamId = ref('2')
const members = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 20
const showErrorModal = ref(false)
const errorMessage = ref('')
const myMaxOrderAmount = ref(null)

const parseAmount = (value) => {
  if (value === null || value === undefined || value === '') return null
  const num = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(num) ? num : null
}

const memberEstimatedMaxOrder = (member) => {
  const totalInv = parseAmount(member?.total_investment_amount)
  const totalInvCount = parseAmount(member?.total_investments)
  if (totalInv === null) return null
  if (totalInvCount && totalInvCount > 0) return totalInv / totalInvCount
  return totalInv
}

const annotatedMembers = computed(() => {
  const myMax = myMaxOrderAmount.value
  return members.value.map((m) => {
    const memberMax = memberEstimatedMaxOrder(m)
    const hasHigher = myMax !== null && memberMax !== null && memberMax > myMax
    return {
      ...m,
      note: hasHigher ? 'Teman anda memiliki pesanan lebih tinggi' : ''
    }
  })
})

const visibleMembers = computed(() => {
  const end = currentPage.value * pageSize
  return annotatedMembers.value.slice(0, end)
})

const canLoadMore = computed(() => visibleMembers.value.length < annotatedMembers.value.length)
const level2Members = ref(0)
const level2Active = ref(0)
const level2Deposit = ref(0)

const teamData = computed(() => ({
  name: `Team ${teamId.value}`,
  size: level2Members.value,
  effective: level2Active.value,
  deposit: level2Deposit.value,
  description: 'Anggota yang bergabung melalui undangan dari Tim Tingkat 1 Anda'
}))

const goBack = () => {
  router.go(-1)
}

const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(Number(value || 0))

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return '0'
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal mengambil data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal mengambil data'
}

const normalizeInvestmentsResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const fetchMyMaxOrderAmount = async () => {
  try {
    const respActive = await investmentAPI.getInvestments({ status: 'ACTIVE' })
    const activeItems = normalizeInvestmentsResponse(respActive?.data)

    let expiredItems = []
    try {
      const respExpired = await investmentAPI.getInvestments({ status: 'EXPIRED' })
      expiredItems = normalizeInvestmentsResponse(respExpired?.data)
    } catch (_) {}

    const all = [...activeItems, ...expiredItems]
    const maxVal = all.reduce((acc, inv) => {
      const v = parseAmount(inv?.product_price ?? inv?.total_amount)
      if (v === null) return acc
      return acc === null ? v : Math.max(acc, v)
    }, null)
    myMaxOrderAmount.value = maxVal
  } catch (_) {
    myMaxOrderAmount.value = null
  }
}

const fetchMembers = async () => {
  try {
    loading.value = true
    showErrorModal.value = false
    errorMessage.value = ''
    currentPage.value = 1
    const response = await authAPI.getDownlineOverview()
    const data = response.data || {}
    
    const levels = data.levels || []
    const level2Data = levels.find(l => l.level === 2) || {}

    level2Members.value = Number(level2Data.member_count || 0)
    level2Active.value = Number(level2Data.active_member_count || 0)
    level2Deposit.value = Number(level2Data.total_deposit_amount || 0)

    if (level2Data.members) {
      members.value = level2Data.members.map((m, index) => ({
        id: m.phone || m.username || String(index + 1),
        phone: m.phone || '',
        username: m.username || '',
        registration_date: m.registration_date || null,
        total_deposit: m.total_deposit_amount ?? '0',
        total_investment_amount: m.total_investment_amount ?? '0',
        total_investments: m.total_investments ?? 0
      }))
    } else {
      members.value = []
    }
  } catch (error) {
    members.value = []
    errorMessage.value = extractErrorMessage(error)
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  if (!canLoadMore.value) return
  currentPage.value += 1
}

onMounted(() => {
  fetchMyMaxOrderAmount()
  fetchMembers()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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

.app-container {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  margin: 0 auto;
}

p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

#header-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.header-container {
  min-height: auto;
  background: transparent;
  display: flex;
  align-items: center;
  padding: 18px 10px;
  position: relative;
  width: 100%;
}

.back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  z-index: 10;
}

.page-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  pointer-events: none;
  white-space: nowrap;
}

#stats-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.stats-wrapper {
  min-height: auto;
  background: transparent;
  padding: 24px 18px 0 18px;
  width: 100%;
}

.stats-card {
  width: 100%;
  background: linear-gradient(180deg, #100F2C 0%, #0F132E 47.6%, #0A1025 100%);
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(158, 158, 158, 0.25);
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stats-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.avatar-col {
  flex-shrink: 0;
  margin-right: 8px;
}

.team-avatar {
  width: 27px;
  height: 26px;
  object-fit: contain;
  display: block;
}

.info-col {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.team-name {
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 3px;
}

.team-metric {
  color: #FFFFFF;
  font-size: 11px;
  line-height: 1.2;
}

.deposito-col {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.deposito-label, .deposito-value {
  color: #FFFFFF;
  font-size: 11px;
  line-height: 1.2;
}

.deposito-value {
  font-weight: 600;
}

.divider {
  height: 1px;
  background-color: #746A9A;
  width: 100%;
  border-radius: 15px;
  opacity: 0.5;
  margin: 5px 0;
}

.card-footer-text {
  color: #746A9A;
  font-size: 10px;
  line-height: 1.3;
}

#transactions-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.transactions-wrapper {
  min-height: auto;
  background: transparent;
  padding: 11px 18px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.transaction-card {
  background: linear-gradient(90deg, #100F2C 0%, #0F132E 48%, #0A1025 100%);
  border-radius: 10px;
  padding: 10px 13px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 57px;
  justify-content: center;
  box-shadow: 0px 4px 4px 0px rgba(158, 158, 158, 0.25);
}

.card-row {
  display: flex;
  width: 100%;
}

.top-row {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.id-text {
  color: #A296FF;
  font-size: 14px;
  font-weight: 500;
}

.amount-text {
  color: #FFFFFF;
  font-size: 10px;
  text-align: right;
}

.date-text {
  color: #FFFFFF;
  font-size: 10px;
  opacity: 0.9;
}

.desc-text {
  color: #FFFFFF;
  font-size: 10px;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
}

.empty-icon {
  width: 120px;
  height: auto;
  opacity: 0.8;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

.load-more-btn {
  width: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #746a9a 0%, #272434 100%);
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  padding: 10px 0;
}

.loading-state {
  text-align: center;
  padding: 20px 0;
  color: #c4c4c4;
  font-size: 12px;
}
</style>
