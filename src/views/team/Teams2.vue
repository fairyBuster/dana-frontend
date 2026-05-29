<template>
  <div class="mobile-container">
    <section id="section-header">
      <div class="header-container">
        <div class="header-text">
          <div class="header-top">
            <button type="button" class="back-btn" aria-label="Kembali" @click="goBack">
              <img src="/assets/images/34_129.svg" alt="" class="back-icon">
            </button>
            <h1 class="header-title">{{ teamTitle }}</h1>
          </div>
          <p class="header-subtitle">{{ teamSubtitle }}</p>
        </div>
        <div class="header-image">
          <img src="/assets/images/9f4d7b8ace034cd96bb6b037dd50538b5db64b68.png" alt="">
        </div>
      </div>
    </section>

    <section id="section-stats">
      <div class="stats-card">
        <div class="stats-header">
          <div class="stats-icon-wrapper">
            <img src="/assets/images/49_950.svg" class="icon-bg" alt="">
            <img src="/assets/images/49_951.svg" class="icon-fg" alt="">
          </div>
          <h2 class="stats-title">{{ teamTitle }}</h2>
        </div>
        <div class="stats-inner-box">
          <div class="stat-item">
            <div class="stat-item-header">
              <img src="/assets/images/49_978.svg" alt="">
              <span class="stat-label">Total Tim</span>
            </div>
            <div class="stat-value">{{ teamData.size }}</div>
            <div class="stat-unit">orang</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-header">
              <img src="/assets/images/49_988.svg" alt="">
              <span class="stat-label">Anggota aktif</span>
            </div>
            <div class="stat-value">{{ teamData.effective }}</div>
            <div class="stat-unit">orang</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-header">
              <img src="/assets/images/49_989.svg" alt="">
              <span class="stat-label">Bonus Tim</span>
            </div>
            <div class="stat-value">{{ teamData.bonus }}</div>
            <div class="stat-unit">Total bonus terkumpul</div>
          </div>
        </div>
      </div>
    </section>

    <section id="section-member-list">
      <h3 class="list-title">Daftar Anggota</h3>

      <div v-if="members.length === 0 && !isLoading" class="empty-state">
        <img src="/assets/images/empty.jpg" alt="" class="empty-icon">
        <p class="empty-text">Belum ada anggota</p>
      </div>

      <div
        v-for="member in members"
        :key="member.id"
        class="member-card"
      >
        <div class="member-icon-wrapper">
          <img :src="member.isActive ? '/assets/images/49_1010.svg' : '/assets/images/49_998.svg'" class="icon-bg" alt="">
          <img :src="member.isActive ? '/assets/images/49_1011.svg' : '/assets/images/49_999.svg'" class="icon-fg" alt="">
        </div>
        <div class="member-info">{{ member.username }}\n{{ member.phone }}\nID: {{ member.code }}</div>
        <div class="member-status" :class="member.isActive ? 'status-active' : 'status-inactive'">
          <img :src="member.isActive ? '/assets/images/49_1012.svg' : '/assets/images/49_1004.svg'" class="status-dot" alt="">
          <span>{{ member.isActive ? 'Aktif' : 'Tidak aktif' }}</span>
        </div>
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
    </section>

    <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import PaginationBar from '@/components/partials/PaginationBar.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()

const overview = ref(null)
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const membersPage = ref(1)
const membersTotalPages = ref(1)
const membersHasNext = ref(false)
const membersHasPrev = ref(false)

const goBack = () => {
  router.push('/hn/home')
}

const teamLevel = computed(() => 2)

const teamTitle = computed(() => {
  const titles = { 1: 'Tim Utama', 2: 'Tim Kedua', 3: 'Tim Ketiga' }
  return titles[teamLevel.value] || `Tim ${teamLevel.value}`
})

const teamSubtitle = computed(() => {
  const subs = {
    1: 'Tim berasal dari undangan langsung Anda',
    2: 'Anggota dari undangan tim pertama Anda',
    3: 'Anggota dari undangan tim kedua Anda'
  }
  return subs[teamLevel.value] || 'Anggota tim Anda'
})

const levelData = computed(() => {
  const levels = Array.isArray(overview.value?.levels) ? overview.value.levels : []
  return levels.find((l) => Number(l?.level) === Number(teamLevel.value)) || null
})

const teamData = computed(() => {
  const l = levelData.value
  const total = Number(l?.member_count || 0)
  const active = Number(l?.active_member_count || 0)
  const bonusRaw = Number(String(l?.total_earned_commission ?? l?.total_commission ?? 0).replace(/[^0-9.-]/g, '')) || 0
  return {
    size: total,
    effective: active,
    bonus: bonusRaw > 0 ? formatAppCurrency(bonusRaw, { decimals: 0 }) : 'Rp 0'
  }
})

const members = computed(() => {
  const raw = Array.isArray(levelData.value?.members) ? levelData.value.members : []
  const list = raw.map((m, i) => {
    const phone = String(m?.phone || '').trim()
    const username = String(m?.username || m?.name || '').trim()
    const code = String(m?.referral_code || m?.id || '').trim()
    const rawDate = m?.registration_date || null
    const d = rawDate ? new Date(rawDate) : null
    const ts = d && !Number.isNaN(d.getTime()) ? d.getTime() : 0
    const isActive = m?.is_active === true

    return {
      id: phone || username || String(i + 1),
      phone: phone || '-',
      username: username || 'Pengguna',
      code: code || '-',
      isActive,
      ts
    }
  })
  return list.sort((a, b) => Number(b.ts || 0) - Number(a.ts || 0))
})

const showPagination = computed(() => {
  if (isLoading.value) return false
  if (!members.value.length) return false
  return membersTotalPages.value > 1
})

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

onMounted(() => {
  membersPage.value = 1
  fetchOverview()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.mobile-container {
  font-family: 'Inter', sans-serif;
  max-width: 412px;
  margin: 0 auto;
  background-color: #fdfaf4;
  position: relative;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, p {
  margin: 0;
}

/* Header */
#section-header {
  padding: 40px 22px 30px 22px;
  overflow: hidden;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.header-text {
  width: 235px;
  position: relative;
  z-index: 2;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.back-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.back-icon {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.header-subtitle {
  font-size: 14px;
  color: #635f5f;
  line-height: 1.4;
}

.header-image {
  position: absolute;
  top: -17px;
  right: -13px;
  width: 151px;
  height: 97px;
  z-index: 1;
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

/* Stats */
#section-stats {
  padding: 0 22px 24px 22px;
}

.stats-card {
  background-color: #fcf0d4;
  border: 1px solid #ffe9bd;
  border-radius: 10px;
  padding: 16px 12px;
}

.stats-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.stats-icon-wrapper {
  position: relative;
  width: 36px;
  height: 36px;
  margin-right: 8px;
}

.stats-icon-wrapper .icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.stats-icon-wrapper .icon-fg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
}

.stats-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

.stats-inner-box {
  background-color: #fcf9f0;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
  padding: 12px 8px;
  gap: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-item-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
}

.stat-item-header img {
  width: 20px;
  height: 20px;
}

.stat-label {
  font-size: 10px;
  font-weight: 600;
  color: #000000;
}

.stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 2px;
}

.stat-unit {
  font-size: 9px;
  color: #4e4e4e;
}

/* Member List */
#section-member-list {
  padding: 0 22px 40px 22px;
}

.list-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 16px;
}

.member-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
}

.member-icon-wrapper {
  position: relative;
  width: 36px;
  height: 36px;
  margin-right: 12px;
  flex-shrink: 0;
}

.member-icon-wrapper .icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.member-icon-wrapper .icon-fg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
}

.member-info {
  flex-grow: 1;
  font-size: 12px;
  color: #000000;
  line-height: 1.4;
  white-space: pre-line;
}

.member-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.status-dot {
  width: 5px;
  height: 5px;
}

.status-inactive {
  color: #909090;
}

.status-active {
  color: #42c207;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-icon {
  width: 160px;
  height: auto;
  display: block;
  margin: 0 auto 12px;
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
</style>
