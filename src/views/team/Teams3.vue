<template>
  <div class="app-container">
    <section id="section-header">
      <header class="header-inner">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/images/37_185.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Lihat tim</h1>
      </header>
    </section>

    <section id="section-team-stats">
      <div class="stats-inner">
        <div class="stats-row">
          <h2 class="team-name">Tim {{ teamLevel }}</h2>
          <div class="stat-item member-valid">
            <span class="stat-value">{{ teamData.effective }}</span>
            <span class="stat-label">Member<br>valid</span>
          </div>
          <div class="stat-item total-member">
            <span class="stat-value">{{ teamData.size }}</span>
            <span class="stat-label">Total<br>member</span>
          </div>
        </div>
        <div class="divider"></div>
      </div>
    </section>

    <section id="section-member-list">
      <div class="list-inner">
        <div v-if="transactions.length === 0 && !isLoading" class="empty-state">
          <p class="empty-text">Belum ada anggota tim</p>
        </div>

        <div v-for="transaction in transactions" :key="transaction.id" class="member-card">
          <div class="member-info">
            <span class="member-phone">{{ transaction.id }}</span>
            <span class="member-date">{{ transaction.date }}</span>
          </div>
          <span class="member-amount">Rp {{ formatCurrency(transaction.amount) }}</span>
        </div>

        <div v-if="showPagination" class="pagination-row">
          <PaginationBar
            :page="membersPage"
            :total-pages="membersTotalPages"
            :has-prev="membersHasPrev"
            :has-next="membersHasNext"
            :loading="isLoading"
            @change="goToPage"
          />
        </div>
      </div>
    </section>

    <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, investmentAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'

const router = useRouter()
const overview = ref(null)
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const myMaxOrderAmount = ref(null)
const membersPage = ref(1)
const membersTotalPages = ref(1)
const membersHasNext = ref(false)
const membersHasPrev = ref(false)

const teamLevel = computed(() => 3)

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
  return `${pad2(d.getDate())}-${pad2(d.getMonth() + 1)}-${d.getFullYear()}`
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
      total_deposit_amount: m?.total_deposit_amount ?? '0',
      date: formatDate(rawDate),
      description: username || '-',
      note: hasHigherOrder ? 'Teman anda memiliki pesanan lebih tinggi' : '',
      ts
    }
  })
  return list.sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0))
})

const showPagination = computed(() => {
  if (isLoading.value) return false
  if (!transactions.value.length) return false
  return membersTotalPages.value > 1
})

const goBack = () => {
  router.go(-1)
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
  try {
    const resp = await authAPI.getDownlineOverview({ page: membersPage.value })
    overview.value = resp?.data || null
    const pag = levelData.value?.members_pagination || null
    if (pag) {
      const p = Number(pag.page || membersPage.value || 1)
      const tp = Number(pag.total_pages || 1)
      membersPage.value = Number.isFinite(p) && p > 0 ? p : 1
      membersTotalPages.value = Number.isFinite(tp) && tp > 0 ? tp : 1
      membersHasNext.value = Boolean(pag.has_next)
      membersHasPrev.value = Boolean(pag.has_previous)
    } else {
      membersTotalPages.value = 1
      membersHasNext.value = false
      membersHasPrev.value = false
    }
  } catch (err) {
    overview.value = null
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page) => {
  const p = Math.max(1, Number(page || 1))
  if (p === membersPage.value) return
  membersPage.value = p
  fetchOverview()
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
  membersPage.value = 1
  fetchOverview()
  fetchMyMaxOrderAmount()
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

#section-header {
  background-color: #f8f8f8;
  width: 100%;
}

.header-inner {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 7px;
  top: 50%;
  transform: translateY(-50%);
  width: 41px;
  height: 41px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.page-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

#section-team-stats {
  background-color: #f8f8f8;
  width: 100%;
}

.stats-inner {
  padding-top: 13px;
}

.stats-row {
  position: relative;
  height: 61px;
  margin-bottom: 16px;
}

.team-name {
  position: absolute;
  left: 21px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  font-weight: 700;
  color: #000000;
}

.stat-item {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 74px;
  height: 61px;
}

.stat-item.member-valid {
  left: 102px;
}

.stat-item.total-member {
  left: 317px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #b2b2b2;
  text-align: center;
  line-height: 1.2;
}

.divider {
  height: 4px;
  background-color: #004d43;
  margin: 0 21px 0 14px;
}

#section-member-list {
  background-color: #f8f8f8;
  width: 100%;
  padding-bottom: 40px;
}

.list-inner {
  padding: 11px 13px 0 14px;
}

.member-card {
  background-color: #eeeeee;
  border-radius: 20px;
  height: 67px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 8px;
}

.member-card:last-child {
  margin-bottom: 0;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.member-phone {
  font-size: 14px;
  font-weight: 700;
  color: #004d43;
}

.member-date {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}

.member-amount {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.load-more-btn {
  width: 100%;
  border-radius: 20px;
  background-color: #004d43;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 0;
  border: none;
  cursor: pointer;
  font-family: inherit;
}
</style>
