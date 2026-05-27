<template>
  <div class="mobile-container">
    <!-- Header -->
    <section id="section-header">
      <header class="profile-header">
        <img src="/assets/images/54_311.svg" alt="Back" class="icon-back" @click="goBack">
        <h1 class="header-title">Profil Saya</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-content">
        <div class="hero-text">
          <h2 class="hero-title">Profil</h2>
          <p class="hero-subtitle">Lihat data Anda disini</p>
        </div>
        <img src="/assets/images/7210a5369195691e3aa63bd1fb6d8c025d233ccc.png" alt="" class="hero-image">
      </div>
    </section>

    <!-- Profile Details -->
    <section id="section-profile-details">
      <div class="details-list">
        <div class="detail-item">
          <div class="detail-label">ID Pengguna</div>
          <div class="detail-value">{{ displayUid }}</div>
        </div>
       

        <br>
        <div class="detail-item">
          <div class="detail-label">Bank Pencairan Dana</div>
          <div class="detail-value">{{ displayBank }}</div>
        </div>
        <br>

        <div class="detail-item">
          <div class="detail-label">VIP Saat Ini</div>
          <div class="detail-value">{{ displayVip }}</div>
        </div>
        <br>
     

        <div class="detail-item">
          <div class="detail-label">Nama Saya</div>
          <div class="detail-value">{{ displayUsername }}</div>
        </div>
       <br>

        <div class="detail-item">
          <div class="detail-label">Nomor Saya</div>
          <div class="detail-value">{{ displayPhone }}</div>
        </div>
      <br>

        <div class="detail-item">
          <div class="detail-label">Dana Proteksi Saya</div>
          <div class="detail-value">{{ displayProtectionStatus }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, bankAPI } from '@/services/api'

const router = useRouter()

const userInfo = ref({
  phone: '',
  referral_by_phone: '',
  username: '',
  email: '',
  registration_date: '',
  referral_code: '',
  id: '',
  bank_name: '',
  bank_account: '',
  current_rank: null,
  current_title: '',
  has_active_investment: false
})

const isLoading = ref(false)
const userBanks = ref([])

const displayUid = computed(() => {
  const d = userInfo.value
  const uid = d.referral_code || d.id || d.user_id || ''
  return uid ? String(uid) : '-'
})

const displayBank = computed(() => {
  const d = userInfo.value
  const banks = Array.isArray(userBanks.value) ? userBanks.value : []
  const activeBank = banks.find((b) => Boolean(b?.is_default)) || banks[0] || null
  const bankNameFromUserBanks = String(activeBank?.bank_name || activeBank?.bank?.name || activeBank?.name || '').trim()
  const bankAccountFromUserBanks = String(activeBank?.account_number || activeBank?.account_no || '').trim()
  const bankName = bankNameFromUserBanks || d.bank_name || d.payout_bank || ''
  const bankAccount = bankAccountFromUserBanks || d.bank_account || d.payout_account || ''
  if (bankName && bankAccount) return `${bankName}-${bankAccount}`
  if (bankName) return bankName
  if (bankAccount) return bankAccount
  return 'Belum terhubung'
})

const displayVip = computed(() => {
  const d = userInfo.value
  const title = String(d.current_title || '').trim()
  if (title) return title
  const rank = d.current_rank
  if (rank === null || rank === undefined || rank === '') return 'VIP 0'
  const n = Number(rank)
  return Number.isFinite(n) ? `VIP ${n}` : String(rank)
})

const displayUsername = computed(() => {
  const d = userInfo.value
  const name = String(d.username || d.name || '').trim()
  return name || '-'
})

const displayPhone = computed(() => {
  const d = userInfo.value
  const p = String(d.phone || d.phone_number || d.user_phone || '').trim()
  return p || '-'
})

const displayProtectionStatus = computed(() => {
  const d = userInfo.value
  if (d.has_active_investment) return 'Aktif'
  return 'Tidak aktif'
})

const fetchAccountInfo = async () => {
  isLoading.value = true
  try {
    const response = await authAPI.getAccountInfo()
    if (response?.data) {
      userInfo.value = { ...userInfo.value, ...response.data }
    }
  } catch (_) {
    // silent fail
  } finally {
    isLoading.value = false
  }
}

const normalizeBanksResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const fetchUserBanks = async () => {
  try {
    const resp = await bankAPI.getUserBanks()
    userBanks.value = normalizeBanksResponse(resp?.data)
  } catch (_) {
    userBanks.value = []
  }
}

const fetchRankStatus = async () => {
  try {
    const resp = await authAPI.getRankStatus()
    if (resp?.data) {
      userInfo.value.current_rank = resp.data.current_rank ?? null
      userInfo.value.current_title = resp.data.current_title ?? ''
    }
  } catch (_) {
    // silent fail
  }
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  Promise.all([fetchAccountInfo(), fetchRankStatus(), fetchUserBanks()])
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
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background-color: #fdfaf4;
  padding: 0 22px;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.profile-header {
  display: flex;
  align-items: center;
  padding: 20px 0;
  gap: 12px;
}

.icon-back {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

/* Hero */
.hero-content {
  position: relative;
  height: 130px;
  margin-top: 10px;
}

.hero-text {
  position: absolute;
  top: 36px;
  left: 0;
  z-index: 2;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
}

.hero-subtitle {
  font-size: 14px;
  color: #635f5f;
}

.hero-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 154px;
  height: 123px;
  object-fit: contain;
  z-index: 1;
}

/* Profile Details */
#section-profile-details {
  padding-bottom: 40px;
  flex-grow: 1;
}

.details-list {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
}

.detail-value {
  font-size: 14px;
  color: #737373;
}

.divider {
  height: 0;
  border-bottom: 1px dotted #000000;
  opacity: 0.3;
  margin: 12px 0;
}
</style>
