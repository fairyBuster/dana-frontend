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
        <img :src="giftImageSrc" alt="" class="gift-box">
      </div>
    </section>

    <!-- Action -->
    <section id="section-action">
      <div class="action-container">
        <div class="claim-button" :class="{ disabled: isLoading }" @click="handleClaim">
          <img src="/assets/images/a37dd03310f239f4d877133c0d7e34c39ee385bd.png" alt="" class="button-bg">
          <span class="button-text">{{ isLoading ? 'Membuka...' : 'Buka Kotak Disini' }}</span>
        </div>
        <p class="footer-text">Kesempatan membuka kotak adalah: {{ remainingChancesDisplay }}</p>
      </div>
    </section>
  </div>

  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <VoucherSuccessModal v-model="showSuccessModal" :amount="claimedAmount" :title="successTitle" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { rouletteAPI } from '@/services/api'
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
const remainingChances = ref(null)
const hasClaimed = ref(false)
const hasLoadedInitialTickets = ref(false)

const remainingChancesDisplay = computed(() => {
  if (remainingChances.value === null || remainingChances.value === undefined) return '-'
  const n = Number(remainingChances.value)
  return Number.isFinite(n) ? String(n) : '-'
})

const giftImageSrc = computed(() => {
  return hasClaimed.value ? '/assets/images/gift-open.png' : '/assets/images/68c2be2206a4f5902d14b9909706770db36b8116.png'
})

const goBack = () => {
  router.go(-1)
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const raw = String(value).trim()
  if (!raw) return null
  const sign = raw.startsWith('-') ? '-' : ''
  const unsigned = raw.replace(/^[+-]/, '')
  const digitsOnly = unsigned.replace(/[^0-9]/g, '')
  if (!digitsOnly) return null
  const n = Number(`${sign}${digitsOnly}`)
  return Number.isFinite(n) ? n : null
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

    if (m.includes('cannot spin') || m.includes('tidak bisa spin') || m.includes('tidak dapat spin')) return 'Kesempatan habis'
    if (m.includes('ticket') && m.includes('habis')) return 'Kesempatan habis'

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

const handleClaim = async () => {
  if (isLoading.value) return

  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const resp = await rouletteAPI.spin()
    const data = resp?.data || {}
    const before = Number(data?.tickets_before ?? null)
    const after = Number(data?.tickets_after ?? null)
    remainingChances.value = Number.isFinite(after) ? after : (Number.isFinite(before) ? before : remainingChances.value)
    hasLoadedInitialTickets.value = true

    const prizeAmount = parseNumber(data?.prize_amount)
    claimedAmount.value = prizeAmount !== null ? prizeAmount : 0
    successTitle.value = 'Anda mendapatkan'
    showSuccessModal.value = true
    hasClaimed.value = true
  } catch (err) {
    const msg = extractErrorMessage(err)
    errorMessage.value = msg
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!hasLoadedInitialTickets.value) remainingChances.value = null
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
