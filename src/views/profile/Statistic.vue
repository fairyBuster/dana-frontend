<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/4252_325.svg" alt="Back">
        </button>
        <h1 class="page-title">Detail tim</h1>
      </header>
    </section>


    <section id="section-team-list">
      <div class="team-list-container">
        <div v-for="team in teams" :key="team.id" class="team-card">
          <div class="team-header">
            <div class="team-name">Tim {{ team.id }}</div>
            <div class="team-stats">
              <div class="stat-item">
                <span class="stat-value">{{ team.effective }}</span>
                <span class="stat-label">Member<br>valid</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ team.size }}</span>
                <span class="stat-label">Total<br>member</span>
              </div>
            </div>
          </div>
          <button class="team-action-btn" @click="viewDetail(team)">Detail tim saya</button>
        </div>
      </div>
    </section>

    <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'

const router = useRouter()

const downlineOverview = ref(null)
const isLoading = ref(false)

const level1to3 = computed(() => {
  const levels = Array.isArray(downlineOverview.value?.levels) ? downlineOverview.value.levels : []
  return levels.filter((l) => [1, 2, 3].includes(Number(l?.level)))
})

const teams = computed(() => {
  const levels = level1to3.value
  const byLevel = (lvl) => levels.find((l) => Number(l?.level) === Number(lvl)) || null

  return [1, 2, 3].map((lvl) => {
    const l = byLevel(lvl)
    return {
      id: lvl,
      size: Number(l?.member_count || 0),
      effective: Number(l?.active_member_count || 0)
    }
  })
})

const goBack = () => {
  router.go(-1)
}

const viewDetail = (team) => {
  router.push(`/team/${team.id}`)
}

const fetchDownlineOverview = async () => {
  isLoading.value = true
  try {
    const resp = await authAPI.getDownlineOverview()
    downlineOverview.value = resp?.data || null
  } catch (err) {
    downlineOverview.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
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
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

/* Header */
#section-header {
  padding-top: 0px;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  position: relative;
  margin-bottom: 10px;
}

.back-btn {
  position: absolute;
  left: 0px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 35px;
  height: 35px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

/* Team List */
#section-team-list {
  flex: 1;
  padding-bottom: 40px;
}

.team-card {
  margin-bottom: 32px;
}

.team-header {
  display: flex;
  padding: 0 24px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.team-name {
  width: 80px;
  font-weight: 700;
  font-size: 16px;
  color: #000000;
  padding-top: 2px;
}

.team-stats {
  display: flex;
  flex: 1;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-value {
  font-weight: 700;
  font-size: 14px;
  color: #000000;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #b2b2b2;
  line-height: 1.2;
}

.team-action-btn {
  width: calc(100% - 24px);
  margin: 0 12px;
  height: 40px;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: inherit;
  transition: background-color 0.2s ease;
}

.team-action-btn:hover {
  background-color: #003831;
}
</style>


