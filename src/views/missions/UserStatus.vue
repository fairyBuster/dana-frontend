<!-- <template>
  <section id="user-status-page">
    <div class="container">
 
      <header class="page-header">
        <div class="icon-wrapper" @click="goBack">
          <img src="/assets/img/68_563.svg" alt="Back" class="back-icon">
        </div>
        <h1 class="page-title">Status pengguna</h1>
         <div class="nav-right" @click="refreshData" style="cursor: pointer;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <img src="/assets/img/Refresh ccw.png" alt="Refresh" class="icon-refresh" style="width: 15px; height: 15px;">
              <span class="refresh-text" style="font-size: 8px; text-align: center; color: #ffffff;">Tap to refresh</span>
            </div>
          </div>
      </header>


      <img src="/assets/img/image 22.png" alt="Banner" class="banner-placeholder">


      <div class="member-card">
        <div class="card-content">
          <h2 class="member-title">{{ currentRank?.title || 'Anggota' }}</h2>
          <p class="member-desc">Saat ini Anda berada di status {{ currentRank?.title || 'Anggota' }}. Untuk mendapatkan penghasilan tetap setiap bulan Anda harus memenuhi S&K.</p>
        </div>
        <img src="/assets/img/4c358819093da64d255bb602bc00201686c8f0f8.png" alt="Coins" class="coin-decoration">
      </div>

  
      <button class="detail-btn" @click="router.push('/hn/hall/taskhall/status/instructions')">Lihat detail dan aturan</button>
      <div class="agent-list">
        
      <LoadingSpinner v-if="loading" :visible="true" :overlay="true" :size="30" :color="'ffffff'" message="" />
      

        <div 
          v-else
          v-for="mission in activeDownlineMissions" 
          :key="mission.id" 
          class="agent-card"
        >
          <div class="agent-header">
            <h3 class="agent-title">{{ mission.title }}</h3>
            <button 
              class="upgrade-btn" 
              :class="{ 'can-claim': mission.can_claim, 'claimed': mission.claimed }"
              @click="handleClaim(mission)"
              :disabled="mission.claimed"
            >
              {{ mission.claimed ? 'Selesai' : (mission.can_claim ? 'Klaim' : 'Upgrade') }}
            </button>
          </div>
          <div class="progress-section">
            <div class="progress-track"></div>
            <div 
              class="progress-fill" 
              :style="{ width: calculateProgress(mission.progress_amount, mission.requirement) + '%' }"
            ></div>
            <div 
              class="progress-badge" 
              :style="getBadgeStyle(mission.progress_amount, mission.requirement)"
            >
              <span>{{ formatNumber(mission.progress_amount) }}/{{ formatNumber(mission.requirement) }}</span>
            </div>
          </div>
          <p class="agent-desc">{{ mission.description || 'Ketika Anda sudah mencapai target seorang agen kerja, Anda dapat klaim penghasilan tetap setiap bulan.' }}</p>
        </div>
      </div>
    </div>
  </section>
</template> -->

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, missionAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'

const router = useRouter()
const rankLevels = ref([])
const activeDownlineMissions = ref([])
const loading = ref(false)

const currentRank = computed(() => {
  if (!activeDownlineMissions.value || activeDownlineMissions.value.length === 0) return null
  const sortedMissions = [...activeDownlineMissions.value].sort((a, b) => Number(a.requirement) - Number(b.requirement))
  const highestAchieved = [...sortedMissions]
    .reverse()
    .find(m => m.status === 'claimed' || m.claimed === true || String(m.claimed) === 'true')
  if (highestAchieved) return highestAchieved
  return null
})

const goBack = () => {
  router.go(-1)
}

const refreshData = () => {
  fetchData()
}

const fetchData = async () => {
  loading.value = true
  try {
    const [levelsRes, missionsRes] = await Promise.all([
      authAPI.getRankLevels(),
      missionAPI.getMissions()
    ])

    if (levelsRes.data && Array.isArray(levelsRes.data)) {
      rankLevels.value = levelsRes.data
    } else if (levelsRes.data && Array.isArray(levelsRes.data.results)) {
      rankLevels.value = levelsRes.data.results
    } else {
      rankLevels.value = []
    }

    if (missionsRes.data && Array.isArray(missionsRes.data.results)) {
      const missions = missionsRes.data.results
      // Filter for active_downline missions and sort by requirement (lowest to highest)
      activeDownlineMissions.value = missions
        .filter(m => m.type === 'active_downline')
        .sort((a, b) => Number(a.requirement) - Number(b.requirement))
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

const handleClaim = async (mission) => {
  if (mission.can_claim === true || String(mission.can_claim) === 'true') {
    try {
      await missionAPI.claimMission(mission.id)
      // Refresh data after claim
      fetchData()
    } catch (error) {
      console.error('Failed to claim mission:', error)
    }
  }
}

const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return Number(num).toLocaleString('id-ID')
}

const calculateProgress = (current, total) => {
  const cur = Number(current) || 0
  const tot = Number(total) || 1
  if (tot === 0) return 0
  const percent = (cur / tot) * 100
  return Math.min(100, Math.max(0, percent))
}

const getBadgeStyle = (current, total) => {
  const percent = calculateProgress(current, total)
  return {
    left: `${percent}%`,
    transform: `translateX(-${percent}%)`
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0d0920;
  color: #ffffff;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

img {
  max-width: 100%;
  display: block;
}

h1, h2, h3, p {
  margin: 0;
  color: #ffffff;
}

button {
  font-family: inherit;
  cursor: pointer;
}
/* CSS for section section:UserStatus */
#user-status-page {
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    background-color: #0d0920;
  }

  .container {
    width: 100%;
    max-width: 100%;
    padding: 10px 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Header */
  .page-header {
    display: grid;
    grid-template-columns: 40px 1fr 40px;
    align-items: center;
    margin-bottom: 8px;
    margin: 0;
    padding: 0;
  }

  .icon-wrapper {
    width: 41px;
    height: 41px;
    cursor: pointer;
  }

  .back-icon {
    width: 41px;
    height: 41px;
  }

  .page-title {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    color: #ffffff;
  }

  .spacer {
    width: 41px;
  }

  /* Banner */
  .banner-placeholder {
    width: 100%;
    height: auto;
    background-color: #d9d9d9;
    border-radius: 10px;
  }

  /* Member Card */
  .member-card {
    background-color: #182b54;
    border-radius: 10px;
    padding: 18px 10px;
    position: relative;
    min-height: 118px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-content {
    max-width: 75%;
    z-index: 1;
  }

  .member-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .member-desc {
    font-size: 12px;
    line-height: 1.4;
    color: #a9a9a9;
  }

  .coin-decoration {
    position: absolute;
    right: 20px;
    top: 35px;
    width: 69px;
    height: 69px;
    object-fit: contain;
  }

  /* Detail Button */
  .detail-btn {
    width: 100%;
    height: 39px;
    border-radius: 20px;
    border: none;
    background: linear-gradient(90deg, #84A2FF 0%, #2E5FF7 100%);
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
  }

  /* Agent List */
  .agent-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .agent-card {
    background: linear-gradient(90deg, #233474 0%, #32489a 100%);
    border-radius: 10px;
    padding: 16px 16px 20px 16px;
  }

  .agent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .agent-title {
    font-size: 16px;
    font-weight: 600;
  }

  .upgrade-btn {
    background: linear-gradient(90deg, #84A2FF 0%, #2E5FF7 100%);
    border: none;
    border-radius: 20px;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 16px;
    min-width: 95px;
  }

  .upgrade-btn.can-claim {
    background: linear-gradient(90deg, #4caf50 0%, #8bc34a 100%);
  }

  .upgrade-btn.claimed {
    background: #555;
    color: #aaa;
    cursor: not-allowed;
  }

  /* Progress Bar */
  .progress-section {
    position: relative;
    height: 19px;
    display: flex;
    align-items: center; /* Center vertically so track goes through badge */
    margin-bottom: 5px;
  }

  .progress-track {
    width: 100%;
    height: 9px;
    background-color: #ffffff;
    border-radius: 20px;
    position: absolute;
    left: 0;
    z-index: 1;
  }

  .progress-fill {
    height: 9px;
    background: linear-gradient(90deg, #FDC771 0%, #F8D640 100%);
    border-radius: 20px;
    position: absolute;
    left: 0;
    z-index: 2;
  }

  .progress-badge {
    height: 19px;
    min-width: 63px;
    background: linear-gradient(90deg, #FDC771 0%, #F8D640 100%);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 3;
    padding: 0 10px;
    /* transition: left 0.3s ease, transform 0.3s ease; */
  }

  .progress-badge span {
    color: #ffffff;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
  }

  .agent-desc {
    font-size: 12px;
    line-height: 1.4;
    color: #a9a9a9;
  }
</style>
