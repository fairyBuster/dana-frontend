<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="header-section">
      <div class="header-container">
        <button class="back-btn" @click="goBack">
          <img src="/assets/image/172_391.svg" alt="Back">
        </button>
        <h1 class="page-title">Detail tim {{ teamId }}</h1>
      </div>
    </section>

    <!-- Stats Section -->
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

    <!-- Transactions Section -->
    <section id="transactions-section">
      <div class="transactions-wrapper">
        <div v-if="transactions.length === 0 && !isLoading" class="empty-state">
          <img src="/assets/image/empty.png" alt="No Data" class="empty-icon">
        </div>
        <article v-for="transaction in visibleTransactions" :key="transaction.id" class="transaction-card">
          <div class="card-row top-row">
            <span class="id-text">{{ transaction.id }}</span>
            <span class="amount-text">Deposito: RP {{ formatCurrency(transaction.amount) }}</span>
          </div>
          <div class="card-row">
            <span class="date-text">{{ transaction.date }}</span>
          </div>
          <div v-if="transaction.note" class="card-row">
            <span class="desc-text">{{ transaction.note }}</span>
          </div>
          <!-- <div class="card-row">
            <span class="desc-text">{{ transaction.description }}</span>
          </div> -->
        </article>

        <div v-if="transactions.length > 0 && canLoadMore" class="pagination-row">
          <button class="load-more-btn" @click="loadMore">
            Memuat lebih banyak
          </button>
        </div>
      </div>
    </section>
  </div>
  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI, investmentAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const route = useRoute()
const teamId = ref('1')
const overview = ref(null)
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const myMaxOrderAmount = ref(null)
const currentPage = ref(1)
const pageSize = 20

const teamLevel = computed(() => {
  const raw = route.params?.id ?? route.query?.id ?? teamId.value
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : 1
})

const levelData = computed(() => {
  const levels = Array.isArray(overview.value?.levels) ? overview.value.levels : []
  return levels.find((l) => Number(l?.level) === Number(teamLevel.value)) || null
})

const teamDescriptions = {
  1: 'Anggota yang bergabung langsung melalui tautan undangan Anda.',
  2: 'Anggota yang bergabung melalui undangan dari Tim Tingkat 1 Anda',
  3: 'Anggota yang bergabung melalui undangan dari Tim Tingkat 2 Anda',
  4: 'Anggota yang bergabung melalui undangan dari Tim Tingkat 3 Anda',
  5: 'Anggota yang bergabung melalui undangan dari Tim Tingkat 4 Anda'
}

const teamData = computed(() => {
  const l = levelData.value
  const lvl = Number(teamLevel.value)
  return {
    name: `Team ${lvl}`,
    size: Number(l?.member_count || 0),
    effective: Number(l?.active_member_count || 0),
    deposit: l?.total_deposit_amount ?? '0',
    description: teamDescriptions[lvl] || 'Ikhtisar tim.'
  }
})

const pad2 = (n) => String(n).padStart(2, '0')
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const parseAmount = (value) => {
  if (value === null || value === undefined || value === '') return null
  const num = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(num) ? num : null
}

const transactions = computed(() => {
  const members = Array.isArray(levelData.value?.members) ? levelData.value.members : []
  const myMax = myMaxOrderAmount.value
  const list = members.map((m, i) => {
    const phone = String(m?.phone || '').trim()
    const username = String(m?.username || '').trim()
    const rawDate = m?.registration_date || null
    const d = rawDate ? new Date(rawDate) : null
    const ts = d && !Number.isNaN(d.getTime()) ? d.getTime() : 0

    const totalInv = parseAmount(m?.total_investment_amount)
    const totalInvCount = parseAmount(m?.total_investments)
    const memberEstimatedMax = totalInv !== null
      ? (totalInvCount && totalInvCount > 0 ? totalInv / totalInvCount : totalInv)
      : null
    const hasHigherOrder = myMax !== null && memberEstimatedMax !== null && memberEstimatedMax > myMax

    return {
      id: phone || username || String(i + 1),
      amount: m?.total_deposit_amount ?? '0',
      date: formatDate(rawDate),
      description: username || '-',
      note: hasHigherOrder ? 'Teman anda memiliki pesanan lebih tinggi' : '',
      ts
    }
  })
  return list.sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0))
})

const visibleTransactions = computed(() => {
  const end = currentPage.value * pageSize
  return transactions.value.slice(0, end)
})

const canLoadMore = computed(() => visibleTransactions.value.length < transactions.value.length)

const loadMore = () => {
  if (!canLoadMore.value) return
  currentPage.value += 1
}

const goBack = () => {
  router.go(-1)
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return '0'
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num)
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal mengambil data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal mengambil data'
}

const fetchOverview = async () => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  currentPage.value = 1
  try {
    const resp = await authAPI.getDownlineOverview()
    overview.value = resp?.data || null
  } catch (err) {
    overview.value = null
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
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

onMounted(() => {
  const raw = route.params?.id ?? route.query?.id
  if (raw) teamId.value = String(raw)
  fetchOverview()
  fetchMyMaxOrderAmount()
})

watch(
  () => route.params?.id ?? route.query?.id,
  (v, oldV) => {
    if (v && v !== oldV) {
      teamId.value = String(v)
      fetchOverview()
    }
  }
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0f0f1c;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  position: relative;
  overflow-x: hidden;
  margin: 0 auto;
}

* {
  box-sizing: border-box;
}

p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

/* Header Section */
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
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  pointer-events: none;
  white-space: nowrap;
}

/* Stats Section */
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

/* Transactions Section */
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
</style>
