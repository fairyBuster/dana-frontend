<!-- <template>
  <main class="calculation-data-container">
    <header class="page-header">
      <a href="javascript:void(0)" class="back-button" aria-label="Go back" @click.prevent="goBack">
        <img src="/assets/image/434_287.svg" alt="Arrow left">
      </a>
      <h1 class="page-title">Calculation data</h1>
    </header>

    <section class="summary-content">
      <div class="summary-header">
        <h2 class="summary-title">Summary</h2>
        <p class="summary-timestamp">
          (Updated on {{ formattedUpdatedAt || '—' }})
        </p>
      </div>

      <div v-if="loading" class="state-message">Loading summary...</div>
      <div v-else-if="errorMessage" class="state-message error">{{ errorMessage }}</div>

      <div v-else class="summary-grid">
        <div
          v-for="card in summaryCards"
          :key="card.key"
          class="summary-card"
        >
          <span :class="['card-label', { 'card-label--small': card.small }]">
            {{ card.label }}
          </span>
          <p class="card-value">{{ card.value }}</p>
        </div>
      </div>
    </section>
  </main>
</template> -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../../services/api'

const router = useRouter()

const loading = ref(false)
const errorMessage = ref('')
const lastUpdated = ref('')

const stats = ref({
  turnover_amount: 0,
  income_today: 0,
  income_yesterday: 0,
  total_commission: 0,
  ai_agent_quantity: 0,
  total_ai_profit: 0,
  commission_today: 0,
  commission_yesterday: 0,
  total_recharge: 0
})

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0
  const num = Number(value)
  if (!Number.isNaN(num)) return num
  const cleaned = parseFloat(String(value).replace(/[^\d.-]/g, ''))
  return Number.isNaN(cleaned) ? 0 : cleaned
}

const formatNumber = (value) => {
  return parseNumber(value).toLocaleString('id-ID')
}

const summaryCards = computed(() => [
  { key: 'turnover_amount', label: 'Turnover amount', value: formatNumber(stats.value.turnover_amount) },
  { key: 'income_today', label: 'Income today', value: formatNumber(stats.value.income_today) },
  { key: 'total_commission', label: 'Total commision', value: formatNumber(stats.value.total_commission) },
  { key: 'ai_agent_quantity', label: 'Quantity AI Agent', value: formatNumber(stats.value.ai_agent_quantity) },
  { key: 'total_ai_profit', label: 'Total profit AI', value: formatNumber(stats.value.total_ai_profit) },
  { key: 'commission_today', label: 'Commision today', value: formatNumber(stats.value.commission_today) },
  { key: 'total_recharge', label: 'Total recharge', value: formatNumber(stats.value.total_recharge) }
])

const formattedUpdatedAt = computed(() => {
  if (!lastUpdated.value) return ''
  const date = new Date(lastUpdated.value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

const goBack = () => {
  router.back()
}

const fetchStatistics = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // Ambil data all-time dan today secara paralel
    const [allRes, todayRes] = await Promise.all([
      authAPI.getBalanceStatistics('all-time'),
      authAPI.getBalanceStatistics('today')
    ])

    const all = allRes?.data || {}
    const today = todayRes?.data || {}

    stats.value = {
      turnover_amount: parseNumber(
        all.turnover_amount ??
        all.total_turnover ??
        all.turnover ??
        all.interest_total
      ),
      // Khusus income_today ambil dari endpoint 'today' (total_income)
      income_today: parseNumber(
        today.total_income ??
        today.income_today ??
        today.today_income ??
        today.daily_income
      ),
      income_yesterday: parseNumber(all.income_yesterday ?? all.yesterday_income),
      total_commission: parseNumber(all.total_commission),
      ai_agent_quantity: parseNumber(all.ai_agent_quantity ?? all.active_investments_total ?? all.active_investments_count),
      total_ai_profit: parseNumber(all.total_ai_profit ?? all.total_profit_ai ?? all.interest_total),
      // Khusus commission_today ambil dari endpoint 'today' (total_commission)
      commission_today: parseNumber(
        today.total_commission ??
        today.commission_today ??
        today.today_commission
      ),
      commission_yesterday: parseNumber(all.commission_yesterday ?? all.yesterday_commission),
      total_recharge: parseNumber(all.total_recharge ?? all.total_deposit ?? all.total_deposit_completed)
    }

    lastUpdated.value = today.updated_at || all.updated_at || new Date().toISOString()
  } catch (error) {
    console.error('Statistic.vue - Error fetching statistics:', error)
    errorMessage.value = 'Failed to load calculation data. Please try again later.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStatistics()
})
</script>

<style scoped>
/* removed Lato import */

* {
  box-sizing: border-box;
}

.calculation-data-container {
  max-width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  background-image: url('/assets/image/a545d19c0ef7a51dd8d3593aaf32f06c9a2e24fe.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 15px;
  display: flex;
  flex-direction: column;
  font-family: 'Phetsarath', sans-serif;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 22px;
  flex-shrink: 0;
}

.back-button {
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 20px;
  height: 20px;
}

.page-title {
  margin: 0;
  color: #000000;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.4;
  text-align: center;
}

.summary-content {
  margin-top: 35px;
  flex: 1;
}

.summary-header {
  display: flex;
  align-items: baseline;
  gap: 9px;
  margin-bottom: 26px;
}

.summary-title {
  margin: 0;
  color: #000000;
  font-weight: 400;
  font-size: 14px;
  line-height: 1;
}

.summary-timestamp {
  margin: 0;
  color: rgba(0, 0, 0, 0.4);
  font-weight: 400;
  font-size: 10px;
  line-height: 1;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 21px;
}

.summary-card {
  background-color: rgba(255, 255, 255, 0.47);
  border: 1px solid #ffffff;
  border-radius: 5px;
  height: 53px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.card-label {
  color: #000000;
  font-weight: 500;
  font-size: 10px;
  line-height: 1.2;
  margin-bottom: 5px;
  word-break: break-word;
}

.card-label--small {
  font-size: 8px;
  line-height: 1.2;
}

.card-value {
  margin: 0;
  color: #000000;
  font-weight: 700;
  font-size: 11px;
  line-height: 1.2;
}

.state-message {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 12px;
  font-size: 12px;
  color: #333;
}

.state-message.error {
  color: #c20000;
}

@media (min-width: 768px) {
  .calculation-data-container {
    max-width: 700px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .summary-grid {
    gap: 20px;
  }
}

@media (min-width: 1024px) {
  .calculation-data-container {
    max-width: 100%;
  }

  .summary-grid {
    gap: 24px;
  }
}
</style>

