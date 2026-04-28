<template>
  <div class="app-container">
    <section id="section-header">
      <header class="top-header">
        <img src="/assets/images/2011_986.svg" alt="Back" class="back-icon" @click="goBack">
        <h1 class="header-title">Tambah Rekening</h1>
      </header>
    </section>

    <section id="section-info-banner">
      <div class="banner-container">
        <p class="banner-text">Pastikan nama pemilik rekening sudah sesuai dengan milik Anda.</p>
      </div>
    </section>

    <section id="section-account-details">
      <div class="account-card" v-if="userBank">
        <h2 class="card-label">Data Rekening</h2>
        <p class="account-number">{{ userBank.account_number || '-' }}</p>
        <p class="bank-name">{{ userBank.bank_name || userBank.bank_code || '-' }}</p>
        <p class="owner-name">{{ userBank.account_name || '-' }}</p>
      </div>
      <div class="account-card" v-else>
        <h2 class="card-label">Data Rekening</h2>
        <p class="account-number">-</p>
        <p class="bank-name">Belum ada rekening terdaftar</p>
        <p class="owner-name">-</p>
      </div>

      <div class="add-btn-container" v-if="!userBank">
        <button class="btn-add" @click="router.push('/connect/add')">
          Tambah Rekening Baru
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { bankAPI } from '@/services/api'

const router = useRouter()
const userBank = ref(null)

const goBack = () => {
  router.go(-1)
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
    const list = normalizeBanksResponse(resp?.data)
    const chosen = list.find((b) => b?.is_default) || list[0] || null
    if (chosen) {
      userBank.value = {
        id: chosen.id,
        account_number: chosen.account_number || '-',
        account_name: chosen.account_name || '-',
        bank_name: chosen.bank_name || chosen.bank_code || '-',
        bank_code: chosen.bank_code || '',
        is_default: chosen.is_default || false
      }
    }
  } catch (_) {
    userBank.value = null
  }
}

onMounted(() => {
  fetchUserBanks()
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  min-height: 100vh;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

h1, h2, p {
  margin: 0;
}

section {
  max-width: 412px;
  margin: 0 auto;
  background-color: #f8f8f8;
  width: 100%;
}

/* Header Section */
#section-header {
  height: 60px;
  position: relative;
}

.top-header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  box-sizing: border-box;
}

.back-icon {
  position: absolute;
  left: 5px;
  top: 15px;
  width: 41px;
  height: 41px;
  cursor: pointer;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  line-height: 20px;
}

/* Info Banner Section */
#section-info-banner {
  margin-top: 20px;
  padding-left: 21px;
  padding-right: 6px;
  box-sizing: border-box;
}

.banner-container {
  background: linear-gradient(90deg, rgba(209, 233, 226, 1) 0%, rgba(209, 233, 226, 1) 42.79%, rgba(223, 239, 233, 1) 68.27%, rgba(214, 235, 229, 1) 82.69%, rgba(232, 244, 239, 1) 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 385px;
  height: 54px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-sizing: border-box;
}

.banner-text {
  font-size: 13px;
  font-weight: 400;
  color: #000000;
  line-height: 22px;
}

/* Account Details Section */
#section-account-details {
  padding: 14px 21px 6px 21px;
  box-sizing: border-box;
}

.account-card {
  background-color: #eeeeee;
  border-radius: 20px;
  width: 100%;
  max-width: 385px;
  padding: 19px 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 13px;
  font-weight: 400;
  color: #004d43;
  margin: 0 0 12px 0;
  line-height: 17px;
}

.account-number {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 11px 0;
  line-height: 17px;
}

.bank-name {
  font-size: 13px;
  font-weight: 400;
  color: #000000;
  margin: 0 0 5px 0;
  line-height: 17px;
}

.owner-name {
  font-size: 13px;
  font-weight: 400;
  color: #000000;
  margin: 0;
  line-height: 17px;
}

.add-btn-container {
  margin-top: 24px;
}

.btn-add {
  width: 100%;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 15px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  font-family: inherit;
}

.btn-add:active {
  opacity: 0.8;
}
</style>


