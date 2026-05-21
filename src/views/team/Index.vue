<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header" class="header-section">
      <div class="header-content">
        <div class="header-text">
          <h1 class="header-title">Tim saya</h1>
          <p class="header-subtitle">Lihat perkembangan dan rincian anggota tim Anda.</p>
        </div>
        <img src="/assets/images/9f4d7b8ace034cd96bb6b037dd50538b5db64b68.png" class="header-image" alt="">
      </div>
    </section>

    <!-- Team List -->
    <section id="section-team-list" class="team-list-section">
      <div class="team-list">
        <div
          v-for="item in teamItems"
          :key="item.level"
          class="team-item"
          @click="navigateToTeam(item)"
        >
          <div class="team-item-left">
            <div class="team-icon-wrapper">
              <img :src="item.iconBg" class="team-icon-bg" alt="">
              <img :src="item.iconFg" class="team-icon-fg" alt="">
            </div>
            <span class="team-item-title">{{ item.label }}</span>
          </div>
          <div class="team-item-right">
            <span class="team-item-link">Lihat Semua</span>
            <img :src="item.arrow" class="team-arrow" alt="">
          </div>
        </div>
      </div>
    </section>

    <!-- Invite Banner -->
    <section id="section-invite-banner" class="invite-banner-section">
      <div class="invite-banner">
        <img src="/assets/images/dba756c2250617618cdf9a99b6d762d631cb7023.png" class="invite-image" alt="">
        <div class="invite-content">
          <h3 class="invite-title">Undang teman dan kembangkan tim Anda</h3>
          <p class="invite-desc">Semakin banyak anggota, semakin besar bonus Anda!</p>
        </div>
        <button class="invite-button" @click="inviteMembers">Undang sekarang</button>
      </div>
    </section>

    <FooterBar />
    <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI, commissionAPI } from '@/services/api'
import FooterBar from '@/components/partials/AppFooter.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const overview = ref(null)
const accountInfo = ref(null)
const downlineStats = ref([])
const isLoading = ref(false)

const teamItems = [
  {
    level: 1,
    label: 'Tim Utama',
    iconBg: '/assets/images/49_904.svg',
    iconFg: '/assets/images/49_905.svg',
    arrow: '/assets/images/49_910.svg',
    to: '/hn/network/community/1'
  },
  {
    level: 2,
    label: 'Tim Kedua',
    iconBg: '/assets/images/49_918.svg',
    iconFg: '/assets/images/49_919.svg',
    arrow: '/assets/images/49_915.svg',
    to: '/hn/network/community/2'
  },
  {
    level: 3,
    label: 'Tim Ketiga',
    iconBg: '/assets/images/49_927.svg',
    iconFg: '/assets/images/49_928.svg',
    arrow: '/assets/images/49_924.svg',
    to: '/hn/network/community/3'
  }
]

const navigateToTeam = (item) => {
  if (!item?.to) return
  router.push(item.to)
}

const inviteMembers = () => {
  router.push('/hn/network/invite')
}

const normalizeDownlineStatsResponse = (data) => {
  const levels = Array.isArray(data?.levels) ? data.levels : Array.isArray(data) ? data : []
  return levels.filter(Boolean)
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
  try {
    const resp = await authAPI.getDownlineOverview({ page: 1 })
    overview.value = resp?.data || null
  } catch (_) {
    overview.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAccountInfo()
  fetchDownlineStats()
  fetchOverview()
})

watch(
  () => route.params?.id ?? route.query?.id,
  (v, oldV) => {
    if (v && v !== oldV) {
      fetchOverview()
    }
  }
)
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
  margin: 0 auto;
  position: relative;
  padding-bottom: 80px;
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

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Header */
.header-section {
  padding: 24px 9px 20px 22px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.header-text {
  margin-top: 17px;
  flex: 1;
  max-width: 235px;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 14px;
  color: #635f5f;
  line-height: 1.4;
}

.header-image {
  width: 151px;
  height: 97px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

/* Team List */
.team-list-section {
  padding: 10px 22px;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-item {
  width: 100%;
  background-color: #fcf0d4;
  border: 1px solid #ffe9bd;
  border-radius: 10px;
  height: 76px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px 0 17px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.team-item:active {
  transform: scale(0.98);
}

.team-item-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.team-icon-wrapper {
  position: relative;
  width: 36px;
  height: 36px;
}

.team-icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}

.team-icon-fg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
}

.team-item-title {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

.team-item-right {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}

.team-item-link {
  font-size: 12px;
  font-weight: 700;
  color: #cd8c09;
}

.team-arrow {
  width: 18px;
  height: 18px;
}

/* Invite Banner */
.invite-banner-section {
  padding: 20px 20px 40px 20px;
}

.invite-banner {
  position: relative;
  width: 100%;
  background-color: #fdf5e6;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  min-height: 117px;
  display: flex;
  align-items: center;
  padding: 14px 5px 14px 103px;
  gap: 8px;
}

.invite-image {
  position: absolute;
  left: 0;
  bottom: 3px;
  width: 108px;
  height: 83px;
  object-fit: contain;
  z-index: 1;
}

.invite-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  z-index: 2;
}

.invite-title {
  font-size: 13px;
  font-weight: 700;
  color: #000000;
  line-height: 18px;
}

.invite-desc {
  font-size: 11px;
  color: #000000;
  line-height: 14px;
}

.invite-button {
  flex: 0 0 auto;
  background: linear-gradient(180deg, #f4c142 0%, #f4c142 47.11%, #f5ca51 100%);
  border-radius: 10px;
  border: none;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
  z-index: 2;
  transition: opacity 0.2s ease;
}

.invite-button:hover {
  opacity: 0.9;
}

.invite-button:active {
  opacity: 0.8;
}

@media (max-width: 360px) {
  .invite-banner {
    padding-left: 90px;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .invite-button {
    margin-top: 10px;
    align-self: flex-start;
  }
}
</style>
