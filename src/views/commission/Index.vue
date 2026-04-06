<!-- <template>
  <section class="team-commission-page">
    <header class="site-header">
      <a href="#/mainboard" class="back-button" :aria-label="$t('commission.backAria')">
        <img src="/assets/images/Ellipse 1.png" alt="Back arrow">
      </a>
      <h1 class="page-title">{{ $t('commission.title') }}</h1>
    </header>

    <main class="page-content">
      <LoadingSpinner
        v-if="loading"
        containerClass="text-center"
        style="padding: 40px;"
      />

      <div v-else-if="error" class="state-message error">
        {{ error }}
      </div>

      <template v-else>
        <section class="commission-section card-1">
          <div class="commission-intro">
            <div class="commission-text-content">
              <p class="commission-description">
                {{ $t('commission.intro1') }}
                <span>{{ $t('commission.intro2') }}</span>
              </p>
               <div class="commission-summary">
            <p class="commission-label">{{ $t('commission.totalCommissionLabel') }}</p>
            <p class="commission-value">{{ formatCurrency(totalCommission) }}</p>
            <button
              type="button"
              class="btn commission-btn"
              @click="goToCommissionDetails"
            >
              {{ $t('commission.checkDetailCommission') }}
            </button>
          </div>
            </div>
            <img
              src="/assets/image/7c0d37769bc08f51da706d68f37f782e20eaa4f8.png"
              alt="Team and commission illustration"
              class="commission-image"
            >
          </div>
         
        </section>

        <section class="team-stats-section">
          <h2 class="team-stats-title">{{ $t('commission.teamDataTitle') }}</h2>
          <div class="team-cards-container">
            <article
              v-for="team in teamLevels"
              :key="team.id"
              class="team-card card"
            >
              <div class="team-card-header">
                <h3 class="team-card-title">{{ team.title }}</h3>
              
              </div>
              <div class="team-card-stats">
                <div class="stat-item">
                  <span class="stat-label">{{ $t('commission.totalRegistration') }}</span>
                  <span class="stat-value">{{ team.members }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">{{ $t('commission.activeMembers') }}</span>
                  <span class="stat-value">{{ team.active }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">{{ $t('commission.teamRecharge') }}</span>
                  <span class="stat-value">{{ formatCurrency(team.recharge) }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">{{ $t('commission.teamIncome') }}</span>
                  <span class="stat-value">{{ formatCurrency(team.income) }}</span>
                </div>
              </div>
            </article>
          </div>
          <button type="button" class="btn referral-btn" @click="goToReferral">
            {{ $t('commission.checkDetailReferral') }}
          </button>
        </section>
        <section class="information">
          <div class="information-content">
            <p class="information-description" style="font-size: 12px;">
              {{ $t('commission.info1') }}
            </p>
          </div>
        </section>
        
        <section class="rewards-section">
          <div class="rewards-tables-container">
            <table class="rewards-table">
              <thead>
                <tr>
                  <th>{{ $t('commission.table.membershipLevel') }}</th>
                  <th>{{ $t('commission.table.aiAgent') }}</th>
                  <th>{{ $t('commission.table.timeSize') }}</th>
                  <th>{{ $t('commission.table.increasePrize') }}</th>
                  <th>{{ $t('commission.table.weeklySalary') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>LV0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                <tr><td>LV1</td><td>0</td><td>10</td><td>10000</td><td>0</td></tr>
                <tr><td>LV2</td><td>2</td><td>20</td><td>20000</td><td>75000</td></tr>
                <tr><td>LV3</td><td>3</td><td>100</td><td>50000</td><td>300000</td></tr>
                <tr><td>LV4</td><td>4</td><td>400</td><td>150000</td><td>500000</td></tr>
                <tr><td>SVIP1</td><td>5</td><td>1000</td><td>300000</td><td>1000000</td></tr>
                <tr><td>SVIP2</td><td>6</td><td>3000</td><td>600000</td><td>2000000</td></tr>
                <tr><td>SVIP3</td><td>7</td><td>6000</td><td>1000000</td><td>3000000</td></tr>
                <tr><td>SVIP4</td><td>8</td><td>10000</td><td>3000000</td><td>4000000</td></tr>
                <tr><td>MSVIP1</td><td>9</td><td>20000</td><td>5000000</td><td>5000000</td></tr>
              </tbody>
            </table>
          </div>
        </section>
        <section class="information">
          <div class="information-content">
            <p class="information-description" style="font-size: 12px;" v-html="$t('commission.info2Html')"></p>
          </div>
        </section>
      </template>
    </main>
  </section>
</template> -->

<script>
import { commissionAPI } from '@/services/api'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'

export default {
  name: 'CommissionIndex',
  components: {
    LoadingSpinner
  },
  data() {
    return {
      loading: false,
      downlineData: null,
      error: null,
      rewardImages: [
        '/assets/image/94308fa7a9fd3430183b25523d0f05eb0da12914.png',
        '/assets/image/94308fa7a9fd3430183b25523d0f05eb0da12914.png'
      ]
    }
  },
  computed: {
    totalCommission() {
      const levels = this.downlineData?.levels || []
      return levels.reduce((sum, level) => {
        const profit = parseFloat(level.total_profit_commission || 0)
        const purchase = parseFloat(level.total_purchase_commission || 0)
        return sum + profit + purchase
      }, 0)
    },
    teamLevels() {
      const defaults = [
        { id: 'team-b', title: this.$t('commission.teamBTitle'), level: 1 },
        { id: 'team-c', title: this.$t('commission.teamCTitle'), level: 2 },
        { id: 'team-d', title: this.$t('commission.teamDTitle'), level: 3 }
      ]

      const levels = this.downlineData?.levels || []

      return defaults.map((team) => {
        const levelData = levels.find(l => Number(l.level) === team.level) || {}
        const rechargeAmount = parseFloat(levelData.deposits_total_amount || levelData.total_investment_amount || 0)
        const profit = parseFloat(levelData.total_profit_commission || 0)
        const purchase = parseFloat(levelData.total_purchase_commission || 0)
        const membersArray = Array.isArray(levelData.members) ? levelData.members : null
        const membersCount = levelData.member_count || levelData.members_total || (membersArray ? membersArray.length : 0)
        const activeFromMembers = membersArray ? membersArray.filter(m => m && m.is_active === true).length : null

        return {
          ...team,
          members: membersCount,
          // Jika API menyediakan daftar members, hitung aktif berdasarkan is_active
          // Jika tidak, fallback ke aggregate fields yang tersedia
          active: (activeFromMembers !== null ? activeFromMembers : (levelData.members_active || levelData.active_member_count || 0)),
          recharge: rechargeAmount,
          income: profit + purchase
        }
      })
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goToCommissionDetails() {
      this.$router.push('/h5/commission/history')
    },
    goToReferral() {
      this.$router.push('/h5/teams')
    },
    formatCurrency(amount) {
      const numAmount = parseFloat(amount) || 0
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(numAmount).replace('Rp', '').trim()
    },
    async fetchDownlineOverview() {
      this.loading = true
      this.error = null

      try {
        const response = await commissionAPI.getDownlineOverview()
        this.downlineData = response.data
      } catch (err) {
        console.error('Error fetching downline overview:', err)
        this.error = this.$t('commission.loadError')
      } finally {
        this.loading = false
      }
    }
  },
  mounted() {
    this.fetchDownlineOverview()
  }
}
</script>

<style scoped>
/* removed Lato import */

.team-commission-page {
  max-width: 100%;
  min-height: 100vh;
  background-image: url('/assets/image/a545d19c0ef7a51dd8d3593aaf32f06c9a2e24fe.png');
  background-size: cover;
  background-position: center;
  padding: 18px 15px 40px;
  font-family: 'Phetsarath', sans-serif;
  color: var(--text-dark);
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 10px;
  margin-bottom: 26px;
}

.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.back-button img {
  width: 20px;
  height: 20px;
}

.page-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 30px;
  text-align: center;
  color: #000;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card-1{
  background-color:  transparent;
  
  border-radius: 5px;
  padding: 5px;
}
.card {
  background-color:  transparent;
  border: 1px solid #ffffff;
  border-radius: 5px;
  padding: 12px;
}

.commission-section {
  position: relative;
  overflow: hidden;
}

.commission-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5px;
}

.commission-text-content {
  max-width: 230px;
  margin-top: 0px;
}

.commission-description {
  margin: 0;
  font-size: 11px;
  font-weight: 400;
  line-height: 1.35;
  color: #000;
}

.commission-description span {
  font-weight: 700;
}

.commission-image {
  width: 153px;
  height: 120px;
  object-fit: contain;
  margin-right: -15px;
}

.commission-summary {
  margin-top: 12px;
}

.commission-label {
  margin: 0;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
}

.commission-value {
  margin: 6px 0 0;
  font-size: 24px;
  font-weight: 700;
  color: #000;
}

.btn {
  display: inline-block;
  background-color: #619dec;
  color: #fff;
  font-weight: 700;
  font-size: 11px;
  line-height: 15px;
  text-align: center;
  text-decoration: none;
  padding: 2px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn:hover {
  opacity: 0.9;
}

.team-stats-section {
  margin-top: 10px;
}

.team-stats-title {
  margin: 0 0 10px 2px;
  font-size: 12px;
  font-weight: 700;
  color: #000;
}

.team-cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.team-card-title {
  margin: 0;
  font-size: 10px;
  font-weight: 700;
}

.team-level-tag {
  font-size: 10px;
  font-weight: 600;
  color: #619dec;
}

.team-card-stats {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.stat-item {
  flex: 1 1 22%;
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 11px;
  font-weight: 700;
  color: #000;
}

.referral-btn {
  margin-top: 14px;
  width: 160px;
}
.rewards-section {
  margin-top: 0px;
}

.rewards-tables-container { padding: 0px; }

.rewards-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 8px;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.rewards-table thead th {
  background: #619DEC;
  color: #ffffff;
  padding: 8px;
  text-align: center;
}

.rewards-table tbody td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #e6eefc;
}

.rewards-table tbody tr:last-child td { border-bottom: none; }

.state-message {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 14px;
  font-size: 12px;
  text-align: center;
  color: #000;
}

.state-message.error {
  color: #c62828;
}
</style>
