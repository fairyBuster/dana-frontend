<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="top-bar">
        <img src="/assets/images/63_149.svg" alt="" class="back-icon" @click="goBack">
        <span class="header-title">Reward Box</span>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-content">
        <h1 class="main-title">Reward Blind Box</h1>
        <p class="subtitle">Klaim hadiah setelah teman yang Anda undang aktif.</p>
      </div>
      <div class="image-wrapper">
        <img src="/assets/images/68c2be2206a4f5902d14b9909706770db36b8116.png" alt="" class="gift-box">
      </div>
    </section>

    <!-- Action -->
    <section id="section-action">
      <div class="action-container">
        <div class="claim-button" :class="{ disabled: isLoading || remainingChances <= 0 }" @click="handleClaim">
          <img src="/assets/images/a37dd03310f239f4d877133c0d7e34c39ee385bd.png" alt="" class="button-bg">
          <span class="button-text">{{ isLoading ? 'Membuka...' : 'Buka Kotak Disini' }}</span>
        </div>
        <p class="footer-text">Kesempatan membuka kotak adalah: {{ remainingChances }}</p>
      </div>
    </section>
  </div>

  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <VoucherSuccessModal v-model="showSuccessModal" :amount="claimedAmount" :title="successTitle" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { voucherAPI, transactionAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import VoucherSuccessModal from '@/components/modals/VoucherSuccessModal.vue'
import { formatAppCurrency } from '@/utils/settings'

const router = useRouter()
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const claimedAmount = ref(0)
const successTitle = ref('Berhasil menerima bonus')
const remainingChances = ref(1)

const goBack = () => {
  router.go(-1)
}

const formatCurrency = (value) => {
  const num = Number(String(value ?? 0).replace(/[^0-9.-]/g, ''))
  if (!Number.isFinite(num)) return formatAppCurrency(0, { decimals: 0 })
  return formatAppCurrency(num, { decimals: 0 })
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, silakan coba lagi'
  const normalizeText = (msg) => String(msg ?? '').trim()
  const findAnyString = (v) => {
    if (v === null || v === undefined) return ''
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return normalizeText(v)
    if (Array.isArray(v)) {
      for (const item of v) {
        const found = findAnyString(item)
        if (found) return found
      }
      return ''
    }
    if (typeof v === 'object') {
      for (const key of Object.keys(v)) {
        const found = findAnyString(v[key])
        if (found) return found
      }
    }
    return ''
  }

  const mapVoucherErrorToLabel = (message) => {
    const raw = normalizeText(message)
    if (!raw) return ''
    const m = raw.toLowerCase()

    if (m.includes('user invalid')) return 'Kode salah'
    if (m.includes('voucher tidak ditemukan')) return 'Kode salah'
    if (m.includes('nominal voucher tidak valid')) return 'Kode salah'

    if (m.includes('kuota voucher harian telah habis')) return 'Kesempatan habis'
    if (m.includes('voucher telah mencapai batas penggunaan')) return 'Kesempatan habis'
    if (m.includes('anda sudah klaim voucher ini hari ini')) return 'Sudah diklaim hari ini'
    if (m.includes('voucher ini sudah digunakan oleh akun anda')) return 'Sudah diklaim'

    if (m.includes('voucher tidak aktif')) return 'Tidak aktif'
    if (m.includes('voucher belum dapat diklaim')) return 'Belum tersedia'

    if (m.includes('voucher sudah kedaluwarsa') || m.includes('kedaluwarsa')) return 'Sudah kedaluwarsa'

    return ''
  }

  const msg =
    (typeof data === 'string' ? normalizeText(data) : '') ||
    normalizeText(data?.error) ||
    normalizeText(data?.detail) ||
    normalizeText(data?.message) ||
    findAnyString(data) ||
    ''

  const mapped = mapVoucherErrorToLabel(msg)
  return mapped || msg || err?.message || 'Permintaan gagal, silakan coba lagi'
}

const fetchChances = async () => {
  try {
    const resp = await voucherAPI.getChances?.()
    const data = resp?.data || {}
    const chances = Number(data?.remaining ?? data?.chances ?? 1)
    remainingChances.value = Number.isFinite(chances) ? Math.max(0, chances) : 1
  } catch (_) {
    remainingChances.value = 1
  }
}

const handleClaim = async () => {
  if (isLoading.value || remainingChances.value <= 0) return

  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const resp = await voucherAPI.claim({})
    const data = resp?.data || {}
    const amountRaw = Number(data?.amount ?? 0)
    claimedAmount.value = Number.isFinite(amountRaw) ? amountRaw : 0
    successTitle.value = 'Berhasil menerima bonus'
    showSuccessModal.value = true
    remainingChances.value = Math.max(0, remainingChances.value - 1)
    fetchChances()
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchChances()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  background-color: #f4ca76;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.top-bar {
  display: flex;
  align-items: center;
  padding: 23px 20px;
  gap: 8px;
}

.back-icon {
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
  padding: 24px 25px 0;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: #635f5f;
  line-height: 1.3;
  max-width: 210px;
}

.image-wrapper {
  margin-top: 28px;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

.gift-box {
  width: 461px;
  max-width: none;
  flex-shrink: 0;
}

/* Action */
.action-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
}

.claim-button {
  position: relative;
  width: 285px;
  height: 89px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: transform 0.1s ease;
}

.claim-button:active:not(.disabled) {
  transform: scale(0.96);
}

.claim-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  object-fit: contain;
}

.button-text {
  position: relative;
  z-index: 2;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  margin-top: -4px;
}

.footer-text {
  margin-top: 14px;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  text-align: center;
}
</style>
