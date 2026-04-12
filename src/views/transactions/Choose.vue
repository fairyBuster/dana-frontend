<!-- <template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <div class="header-content">
          <img src="/assets/images/135_66.svg" alt="Back" class="back-icon" @click="goBack">
          <h1 class="page-title">Ringkasan Saldo</h1>
        </div>
      </header>
    </section>
    
    <section id="section-content">
      <div class="content-container">
        
  
        <div class="card">
         
          <div class="card-body with-icon">
            <h2 class="card-title">Saldo Isi Ulang</h2>
            <p class="card-desc">Saldo yang tersedia untuk melakukan pembelian aset dana.</p>
            <div class="card-footer">
              <span class="amount">Rp {{ formatBalance(reloadBalance) }}</span>
              <a href="#" class="action-link" @click.prevent="goToDeposit">
                Deposit
                <img src="/assets/images/137_59.svg" alt="Arrow" class="link-arrow">
              </a>
            </div>
          </div>
        </div>

     
        <div class="card">
          <div class="card-body with-icon">
            <h2 class="card-title">Saldo Tersedia</h2>
            <p class="card-desc">Saldo yang dapat digunakan untuk menarik uang ke rekening tujuan Anda.</p>
            <div class="card-footer">
              <span class="amount">Rp {{ formatBalance(availableBalance) }}</span>
              <a href="#" class="action-link" @click.prevent="goToWithdraw">
                Tarik uang
                <img src="/assets/images/137_55.svg" alt="Arrow" class="link-arrow">
              </a>
            </div>
          </div>
        </div>

   
        <h3 class="section-heading">Hitungan Detail Saldo</h3>

      
        <div class="card">
          <div class="card-body with-icon">
            <h2 class="card-title">Saldo Kliring</h2>
            <p class="card-desc">Saldo yang sedang dalam proses kliring. Saldo ini bisa ditarik ketika aset Anda berakhir.</p>
            <div class="card-footer">
              <span class="amount">Rp {{ formatBalance(clearingBalance) }}</span>
              <a href="#" class="action-link" @click.prevent="checkAssets">
                Periksa aset
                <img src="/assets/images/140_67.svg" alt="Arrow" class="link-arrow">
              </a>
            </div>
          </div>
        </div>


        <div class="card">
          <div class="card-body with-icon">
            <h2 class="card-title">Saldo Yang Sudah Ditarik</h2>
            <p class="card-desc">Saldo ini menunjukkan total nominal yang sudah pernah Anda tarik sebelumnya.</p>
            <div class="card-footer">
              <span class="amount">Rp {{ formatBalance(withdrawnBalance) }}</span>
              <a href="#" class="action-link" @click.prevent="checkHistory">
                Periksa riwayat
                <img src="/assets/images/140_59.svg" alt="Arrow" class="link-arrow">
              </a>
            </div>
          </div>
        </div>

       
        <div class="card">
          <div class="card-body with-icon">
            <h2 class="card-title">Saldo Komisi Undangan</h2>
            <p class="card-desc">Saldo ini menunjukkan total nominal yang sudah pernah Anda tarik sebelumnya.</p>
            <div class="card-footer">
              <span class="amount">Rp {{ formatBalance(commissionBalance) }}</span>
              <a href="#" class="action-link" @click.prevent="checkHistory">
                Periksa riwayat
                <img src="/assets/images/140_63.svg" alt="Arrow" class="link-arrow">
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
    <LoadingSpinner :visible="loading" :overlay="true" message="" />
  </div>
</template> -->

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import { authAPI } from '@/services/api'

const router = useRouter()
const loading = ref(false)

// Sample balance data - these would typically come from an API
const reloadBalance = ref(0)
const availableBalance = ref(0)
const clearingBalance = ref(0)
const withdrawnBalance = ref(0)
const commissionBalance = ref(0)

const formatBalance = (value) => {
  return new Intl.NumberFormat('id-ID').format(value || 0)
}

const goBack = () => {
  router.go(-1)
}

const goToDeposit = () => {
  router.push('/pages/balance/recharge')
}

const goToWithdraw = () => {
  router.push('/pages/assets/release')
}

const checkAssets = () => {
  router.push('/pages/account/panel')
}

const checkHistory = () => {
  router.push('/pages/history/transaction')
}

onMounted(async () => {
  loading.value = true
  try {
    const resp = await authAPI.getBalanceStatistics('all-time')
    const d = resp?.data || {}
    const toNum = (v) => {
      const n = typeof v === 'string' ? parseFloat(v) : Number(v || 0)
      return Number.isFinite(n) ? n : 0
    }
    reloadBalance.value = toNum(d.balance_deposit)
    availableBalance.value = toNum(d.balance)
    clearingBalance.value = toNum(d.balance_hold)
    withdrawnBalance.value = toNum(d.total_withdraw_completed)
    commissionBalance.value = toNum(d.total_commission)
  } catch (e) {
    reloadBalance.value = 0
    availableBalance.value = 0
    clearingBalance.value = 0
    withdrawnBalance.value = 0
    commissionBalance.value = 0
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

 

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  max-width: 412px;
  background-color: #ffffff;
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  min-height: 100vh;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  display: block;
  max-width: 100%;
}

/* Header Section */
#section-header {
  width: 100%;
  max-width: 412px;
  background-color: #fff;
}

.app-header {
  background: linear-gradient(180deg, #7791DE 0%, #5D7BCF 49%, #4061BE 100%);
  padding: 16px 5px;
  color: #ffffff;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-icon {
  width: 45px;
  height: 45px;
  cursor: pointer;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

/* Content Section */
#section-content {
  width: 100%;
  max-width: 412px;
  background-color: #ffffff;
  min-height: calc(100vh - 100px);
}

.content-container {
  padding: 13px 13px 40px 13px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Card Styles */
.card {
  background-color: #ffffff;
  border: 1px solid #D9E4F7;
  border-radius: 10px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.06);
  padding: 0;
  display: flex;
  align-items: flex-start;
  gap: 13px;
  position: relative;
}

/* Icon Wrapper */
.card-icon-wrapper {
  position: relative;
  width: 42px;
  height: 38px;
  flex-shrink: 0;
  margin-top: 0;
}

.icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 15px;
}

.gradient-bg {
  background: linear-gradient(180deg, #DEE7F7 0%, #ADC6F5 100%);
}

.icon-img {
 display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 31px;
  object-fit: contain;
}

/* Card Body */
.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
}
.card-body.with-icon {
  position: relative;
  padding-left: 62px;
}
.card-body.with-icon::before {
  content: "";
  position: absolute;
  left: 12px;
  top: 12px;
  width: 42px;
  height: 42px;
  background-image: url('/assets/images/Group 45.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}

.card-desc {
  font-size: 12px;
  color: #979797;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  background: none;
}

.amount {
  font-size: 16px;
  font-weight: 700;
  color: #3255b6;
}

.action-link {
  font-size: 14px;
  font-weight: 600;
  color: #3255b6;
  display: flex;
  align-items: center;
  gap: 4px;
}

.link-arrow {
  width: 16px;
  height: 16px;
}

/* Section Heading */
.section-heading {
  font-size: 14px;
  font-weight: 700;
  color: #070707;
  margin: 10px 0 0 0;
}

</style>
