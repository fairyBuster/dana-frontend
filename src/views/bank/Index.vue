<template>
  <div class="section-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Kembali">
          <img src="/assets/images/60_272.svg" alt="">
        </button>
        <h1 class="header-title">Ikat Bank</h1>
      </header>
    </section>

    <!-- Intro -->
    <section id="section-intro">
      <h2 class="intro-title">Ikat Bank</h2>
      <p class="intro-subtitle">Kelola rekening bank untuk isi ulang dan tarik uang dengan aman.</p>
    </section>

    <!-- Main Account -->
    <section id="section-main-account">
      <div class="main-account-card">
        <div class="card-content">
          <span class="tag">Rekening Utama</span>
          <h3 class="bank-name">{{ mainAccount ? (mainAccount.bank_name || mainAccount.bank_label || 'Nama Bank') : 'Nama Bank' }}</h3>
          <p class="account-number">{{ mainAccount ? maskAccountNumber(mainAccount.account_number || mainAccount.account_no || '') : '—' }}</p>
          <p class="account-name">{{ mainAccount ? (mainAccount.account_holder || mainAccount.holder_name || '—') : '—' }}</p>
        </div>
        <div class="card-image">
          <img src="/assets/images/ff8ec6de6b36b2f7d2c1090894503bd976133e33.png" alt="">
        </div>
      </div>
    </section>

    <!-- Account List -->
    <section id="section-account-list">
      <h3 class="section-title">Daftar Rekening</h3>

      <div v-if="isLoading" class="empty-state">Memuat...</div>

      <div v-else-if="userBanks.length === 0" class="empty-state">Belum ada rekening terdaftar</div>

      <div
        v-else
        v-for="bank in userBanks"
        :key="bank.id"
        class="account-list-card"
        @click="goToEdit(bank)"
      >
        <div class="list-card-content">
          <h4 class="list-bank-name">{{ formatBankCardTitle(bank) }}</h4>
          <p class="list-account-name">{{ bank.account_holder || bank.holder_name || '—' }}</p>
        </div>
        <div class="list-card-icon">
          <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="">
        </div>
      </div>

      <button class="btn-add" :disabled="isNavigating" @click="goToAdd">
        + Tambah Rekening
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bankAPI } from '@/services/api'

const router = useRouter()
const isNavigating = ref(false)
const isLoading = ref(false)
const userBanks = ref([])

const goBack = () => {
  router.go(-1)
}

const normalizeBanksResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const mainAccount = computed(() => userBanks.value[0] || null)

const maskAccountNumber = (num) => {
  const s = String(num || '').replace(/\s/g, '')
  if (!s) return '—'
  if (s.length <= 4) return s
  return '*'.repeat(s.length - 4) + s.slice(-4)
}

const formatBankCardTitle = (bank) => {
  const bankName = String(bank.bank_name || bank.bank_label || 'Bank').trim()
  const accNum = String(bank.account_number || bank.account_no || '').replace(/\s/g, '')
  if (!accNum) return bankName
  const masked = '*'.repeat(Math.max(0, accNum.length - 4)) + accNum.slice(-4)
  return `${bankName}-${masked}`
}

const fetchUserBanks = async () => {
  isLoading.value = true
  try {
    const resp = await bankAPI.getUserBanks()
    userBanks.value = normalizeBanksResponse(resp?.data)
  } catch (_) {
    userBanks.value = []
  } finally {
    isLoading.value = false
  }
}

const goToEdit = async (bank) => {
  if (isNavigating.value) return
  isNavigating.value = true
  try {
    const currencyCode = bank.currency_code || bank.currency || 'IDR'
    router.push({ path: '/hn/connect/edit', query: { currency_code: currencyCode, id: String(bank.id) } })
  } finally {
    isNavigating.value = false
  }
}

const goToAdd = async () => {
  if (isNavigating.value) return
  isNavigating.value = true
  try {
    const [userResp, banksResp] = await Promise.allSettled([
      bankAPI.getUserBanks(),
      bankAPI.getBanks({ currency_code: 'IDR' })
    ])
    const userList = userResp.status === 'fulfilled' ? normalizeBanksResponse(userResp.value?.data) : []
    const bankList = banksResp.status === 'fulfilled' ? normalizeBanksResponse(banksResp.value?.data) : []

    const allowedIds = new Set(bankList.map((b) => String(b?.id ?? '')).filter(Boolean))
    const filtered = allowedIds.size
      ? userList.filter((ub) => allowedIds.has(String(ub?.bank ?? ub?.bank_id ?? '')))
      : userList

    const existing = filtered[0] || null
    if (existing?.id) {
      router.push({ path: '/hn/connect/edit', query: { currency_code: 'IDR', id: String(existing.id) } })
      return
    }
    router.push({ path: '/hn/connect/add', query: { currency_code: 'IDR' } })
  } catch (_) {
    router.push({ path: '/hn/connect/add', query: { currency_code: 'IDR' } })
  } finally {
    isNavigating.value = false
  }
}

onMounted(() => {
  fetchUserBanks()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.section-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background-color: #fdfaf4;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  display: block;
}

/* Header */
#section-header {
  padding: 23px 20px 0 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  line-height: 20px;
}

/* Intro */
#section-intro {
  padding: 24px 25px;
}

.intro-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
  line-height: 33px;
}

.intro-subtitle {
  font-size: 14px;
  color: #635f5f;
  line-height: 18px;
  max-width: 251px;
}

/* Main Account */
#section-main-account {
  padding: 0 9px 0 25px;
}

.main-account-card {
  background-color: #fdf5e6;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  width: 100%;
  max-width: 378px;
  height: 142px;
  position: relative;
  padding: 18px 14px;
  overflow: hidden;
}

.card-content {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

.tag {
  font-size: 12px;
  font-weight: 600;
  color: #ab7200;
  margin-bottom: 6px;
  line-height: 16px;
}

.bank-name {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
  line-height: 20px;
}

.account-number {
  font-size: 14px;
  color: #737373;
  margin-bottom: 6px;
  line-height: 20px;
}

.account-name {
  font-size: 14px;
  color: #737373;
  line-height: 20px;
}

.card-image {
  position: absolute;
  top: 9px;
  right: 8px;
  width: 187px;
  height: 119px;
  z-index: 1;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Account List */
#section-account-list {
  padding: 12px 17px 24px 17px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  line-height: 20px;
  margin-bottom: -4px;
}

.account-list-card {
  background-color: #fdfcf8;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  width: 100%;
  max-width: 378px;
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.account-list-card:active {
  background-color: #fdf5e6;
}

.list-card-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.list-bank-name {
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  line-height: 16px;
}

.list-account-name {
  font-size: 12px;
  color: #635f5f;
  line-height: 15px;
}

.list-card-icon {
  width: 29px;
  height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.list-card-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.empty-state {
  font-size: 13px;
  color: #737373;
  text-align: center;
  padding: 20px 0;
}

.btn-add {
  width: 100%;
  max-width: 378px;
  padding: 14px;
  background: linear-gradient(90deg, #f4c142 0%, #f5ca51 100%);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  margin-top: 4px;
  transition: opacity 0.2s ease;
}

.btn-add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-add:not(:disabled):active {
  opacity: 0.85;
}
</style>
