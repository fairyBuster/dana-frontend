<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="icon-btn" @click="goBack">
          <img src="/assets/image/4265_350.svg" alt="Back">
        </button>

        <div class="header-right">
          <button type="button" ref="menuAnchorEl" class="header-title-btn" @click.stop="toggleTeamMenu">
            <span class="header-title-text">Your community</span>
            <span class="header-caret" :class="{ open: teamMenuOpen }"></span>
            <div v-if="teamMenuOpen" class="team-menu" @click.stop>
              <button
                v-for="item in teamMenuItems"
                :key="item.level"
                type="button"
                class="team-menu-item"
                :class="{ active: item.level === teamLevel }"
                @click.stop="selectTeam(item)"
              >
                {{ item.label }}
              </button>
            </div>
          </button>
         
        </div>
      </header>
    </section>

    <!-- User Info -->
    <section id="section-user-info">
      <div class="user-info">
        <div class="avatar">
          <img class="avatar-bg" src="/assets/image/4265_358.svg" alt="">
          <img class="avatar-logo" src="/assets/image/d6fdfec9af71120ed69cee9c9560f6254901b2e8.png" alt="">
        </div>
        <div class="user-details">
          <div class="uid-row">
            <span class="uid">UID: {{ displayUid }}</span>
            <button class="icon-btn copy-btn" @click="copyUid">
              <img src="/assets/image/4265_356.svg" alt="Copy">
            </button>
          </div>
          <span class="site">Site: HUE Mining</span>
        </div>
      </div>
    </section>

    <!-- Team Stats -->
    <section id="section-team-stats">
      <div class="team-stats-wrapper">
        <div class="team-stats-card">
          <img class="card-bg" src="/assets/image/903e99f2fad45f9bb2a35dd802076eabebf956e4.png" alt="Stats Background">
          <div class="card-content">
            <div class="stat-col-1">
              <span class="stat-title">My Team</span>
              <span class="stat-value">{{ teamData.size }}</span>
              <span class="stat-desc">Total members</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-col-2">
              <span class="stat-title">Paid members</span>
              <span class="stat-value">{{ paidMembersCount }}</span>
              <span class="stat-desc">Paid members</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team List -->
    <section id="section-team-list">
      <div class="team-list">
        <div class="list-header">
          <div class="col-user">User</div>
          <div class="col-status">Status</div>
          <div class="col-mining">Mining</div>
        </div>

        <div v-if="transactions.length === 0 && !isLoading" class="empty-state">
        
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

    <FooterBar />
    <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI, commissionAPI, investmentAPI } from '@/services/api'
import FooterBar from '@/components/partials/AppFooter.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()
const route = useRoute()
const teamId = ref('0')
const overview = ref(null)
const accountInfo = ref(null)
const downlineStats = ref([])
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const myMaxOrderAmount = ref(null)
const membersPage = ref(1)
const membersTotalPages = ref(1)
const membersHasNext = ref(false)
const membersHasPrev = ref(false)
const teamMenuOpen = ref(false)
const menuAnchorEl = ref(null)

const teamLevel = computed(() => {
  const raw = route.params?.id ?? route.query?.id
  if (raw === null || raw === undefined || raw === '') return 0
  const n = Number(raw)
  return Number.isFinite(n) && n >= 1 && n <= 5 ? n : 0
})

const teamTitle = computed(() => {
  const lvl = teamLevel.value
  const titles = {
    1: 'Direct team',
    2: 'Second team',
    3: 'Third team',
    4: 'Fourth team',
    5: 'Fifth team'
  }
  return titles[lvl] || `Team ${lvl}`
})

const teamLevelLabel = computed(() => {
  const lvl = teamLevel.value
  const labels = {
    1: 'Direct team',
    2: 'Second team',
    3: 'Third team',
    4: 'Fourth team',
    5: 'Fifth team'
  }
  return labels[lvl] || `Team ${lvl}`
})

const teamMenuItems = computed(() => {
  return [
    { level: 0, label: 'All (1-3)', to: '/hn/network/community' },
    { level: 1, label: 'Direct team', to: '/hn/network/community/1' },
    { level: 2, label: 'Second team', to: '/hn/network/community/2' },
    { level: 3, label: 'Third team', to: '/hn/network/community/3' }
  ]
})

const toggleTeamMenu = () => {
  teamMenuOpen.value = !teamMenuOpen.value
}

const closeTeamMenu = () => {
  teamMenuOpen.value = false
}

const selectTeam = (item) => {
  closeTeamMenu()
  if (!item?.to) return
  router.push(item.to)
}

const onDocumentClick = (e) => {
  if (!teamMenuOpen.value) return
  const anchor = menuAnchorEl.value
  const target = e?.target
  if (anchor && target && anchor.contains(target)) return
  closeTeamMenu()
}

const displayUid = computed(() => {
  const d = accountInfo.value || {}
  const uid = d.referral_code ?? d.id ?? d.user_id ?? null
  if (uid === null || uid === undefined || uid === '') return '-'
  return String(uid)
})

const levelData = computed(() => {
  const levels = Array.isArray(overview.value?.levels) ? overview.value.levels : []
  return levels.find((l) => Number(l?.level) === Number(teamLevel.value)) || null
})

const secondLevelData = computed(() => {
  const levels = Array.isArray(overview.value?.levels) ? overview.value.levels : []
  return levels.find((l) => Number(l?.level) === 2) || null
})

const thirdLevelData = computed(() => {
  const levels = Array.isArray(overview.value?.levels) ? overview.value.levels : []
  return levels.find((l) => Number(l?.level) === 3) || null
})

const normalizeDownlineStatsResponse = (data) => {
  const levels = Array.isArray(data?.levels) ? data.levels : Array.isArray(data) ? data : []
  return levels.filter(Boolean)
}

const selectedLevelsForStats = computed(() => {
  const lvl = teamLevel.value
  if (!lvl) return [1, 2, 3]
  return [lvl]
})

const statsLevelsMap = computed(() => {
  const map = new Map()
  for (const row of downlineStats.value || []) {
    const lvl = Number(row?.level)
    if (!Number.isFinite(lvl)) continue
    map.set(lvl, row)
  }
  return map
})

const totalMembersCount = computed(() => {
  let sum = 0
  for (const lvl of selectedLevelsForStats.value) {
    const row = statsLevelsMap.value.get(lvl)
    sum += Number(row?.members_total || 0)
  }
  return sum
})

const paidMembersCount = computed(() => {
  let sum = 0
  for (const lvl of selectedLevelsForStats.value) {
    const row = statsLevelsMap.value.get(lvl)
    sum += Number(row?.members_active || 0)
  }
  return sum
})

const teamData = computed(() => {
  const l = levelData.value
  const fallbackTotal = Number(l?.member_count || 0)
  const fallbackPaid = Number(l?.active_member_count || 0)
  return {
    size: totalMembersCount.value || fallbackTotal,
    effective: paidMembersCount.value || fallbackPaid,
    deposit: l?.total_deposit_amount ?? '0'
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
    const isActive = myMax !== null && memberEstimatedMax !== null && memberEstimatedMax > 0
    const miningCount = totalInvCount !== null && totalInvCount > 0 ? totalInvCount : 0

    return {
      id: phone || username || String(i + 1),
      amount: m?.total_deposit_amount ?? '0',
      total_deposit_amount: m?.total_deposit_amount ?? '0',
      date: formatDate(rawDate),
      description: username || '-',
      isActive: isActive,
      miningCount: miningCount,
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

const inviteMembers = () => {
  router.push('/hn/network/invite')
}

const copyUid = () => {
  navigator.clipboard.writeText(displayUid.value).catch(() => {})
}

const formatUSD = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : Number(value || 0)
  if (!Number.isFinite(num)) return formatAppCurrency(0, { decimals: 0 })
  return formatAppCurrency(num, { decimals: 0 })
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Failed to fetch data'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Failed to fetch data'
}

const fetchAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    accountInfo.value = resp?.data || null
  } catch (_) {
    accountInfo.value = null
  }
}

const fetchDownlineStats = async () => {
  try {
    const resp = await commissionAPI.getDownlineStats()
    downlineStats.value = normalizeDownlineStatsResponse(resp?.data)
  } catch (_) {
    downlineStats.value = []
  }
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
  const raw = route.params?.id ?? route.query?.id
  if (raw) teamId.value = String(raw)
  membersPage.value = 1
  fetchAccountInfo()
  fetchDownlineStats()
  fetchOverview()
  fetchMyMaxOrderAmount()
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})

watch(
  () => route.params?.id ?? route.query?.id,
  (v, oldV) => {
    if (v && v !== oldV) {
      teamId.value = String(v)
      membersPage.value = 1
      fetchOverview()
    }
  }
)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  padding-bottom: 80px;
}

h1, h2, p {
  margin: 0;
}

button {
  font-family: 'Inter', sans-serif;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 16px;
  position: relative;
  min-height: 60px;
  z-index: 10;
}

.header-main-title {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 11;
}

.header-title-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

.header-title-text {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  white-space: nowrap;
}

.header-caret {
  width: 14px;
  height: 14px;
  position: relative;
}

.header-caret::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 3px;
  width: 5px;
  height: 5px;
  border-right: 1.5px solid #000000;
  border-bottom: 1.5px solid #000000;
  transform: rotate(45deg);
  transition: transform 0.15s ease, top 0.15s ease;
}

.header-caret.open::before {
  top: 6px;
  transform: rotate(-135deg);
}

.team-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 180px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  z-index: 9999;
}

.team-menu-item {
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #000000;
  cursor: pointer;
  font-family: inherit;
}

.team-menu-item + .team-menu-item {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.team-menu-item.active {
  font-weight: 700;
  background-color: #f8f9fa;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.invite-btn {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  gap: 2px;
  font-family: inherit;
}

.invite-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.invite-btn span {
  font-size: 10px;
  color: #000000;
  text-align: center;
}

/* User Info */
.user-info {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-top: 8px;
  gap: 12px;
}

.avatar {
  position: relative;
  width: 31px;
  height: 29px;
}

.avatar-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.avatar-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 17px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.uid-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.uid {
  font-size: 13px;
  font-weight: 400;
  color: #000000;
}

.site {
  font-size: 11px;
  color: #737373;
}

.copy-btn img {
  width: 14px;
  height: 14px;
}

/* Team Stats */
.team-stats-wrapper {
  padding: 20px;
}

.team-stats-card {
  position: relative;
  width: 100%;
  height: 118px;
  border-radius: 5px;
  overflow: hidden;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.stat-col-1 {
  width: 100px;
  display: flex;
  flex-direction: column;
}

.stat-divider {
  height: 50px;
  border-left: 1px dotted #000000;
  margin: 0 20px;
  opacity: 0.5;
}

.stat-col-2 {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 13px;
  color: #000000;
  margin-bottom: 4px;
}

.stat-link {
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
}

.stat-value {
  font-size: 26px;
  font-weight: 400;
  color: #000000;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-desc {
  font-size: 11px;
  color: #737373;
}

/* Team List */
.team-list {
  padding: 0 20px 40px 20px;
}

.list-header {
  display: grid;
  grid-template-columns: 40% 40% 20%;
  padding-bottom: 8px;
  border-bottom: 1px dotted #000000;
  margin-bottom: 16px;
}

.list-header div {
  font-size: 13px;
  font-weight: 400;
  color: #000000;
}

.col-status {
  text-align: left;
}

.col-mining {
  text-align: center;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 15px;
}

.list-row {
  display: grid;
  grid-template-columns: 40% 40% 20%;
  align-items: center;
  margin-bottom: 20px;
}

.col-user-data {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.col-status-data {
  text-align: left;
}

.col-mining-data {
  text-align: center;
}

.user-phone {
  font-size: 13px;
  font-weight: 700;
  color: #000000;
}

.user-name {
  font-size: 11px;
  color: #737373;
}

.status-text {
  font-size: 13px;
  color: #737373;
}

.mining-value {
  font-size: 13px;
  color: #737373;
}

.list-row.active .user-phone,
.list-row.active .user-name,
.list-row.active .status-text,
.list-row.active .mining-value {
  color: #1b46f5;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
</style>
