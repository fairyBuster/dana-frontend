<template>
  <div class="app-container">
    <LoadingSpinner :visible="isLoading && !product" :overlay="true" message="" />

    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/4369_339.svg" alt="Back">
        </button>
        <h1 class="page-title">See Featured</h1>
      </header>
    </section>

    <!-- Breadcrumb -->
    <section id="section-breadcrumb">
      <nav class="breadcrumb">
        <div class="breadcrumb-item">
          <img src="/assets/image/fd891e27e827c0f21ddb395edbc24cfd61c092dc.png" alt="Shop" class="shop-icon">
          <span>Shop</span>
        </div>
        <img src="/assets/image/4369_347.svg" alt=">" class="separator-icon">
        <div class="breadcrumb-item">
          <span>Cloud Computing</span>
        </div>
        <img src="/assets/image/4369_351.svg" alt=">" class="separator-icon">
        <div class="breadcrumb-item active">
          <span>See Featured</span>
        </div>
      </nav>
    </section>

    <!-- Content -->
    <section id="section-content">
      <div class="content-bg">
        <div class="content-wrapper">
          <div class="info-card">
            <p class="card-title" style="padding-bottom: 5px;">Beneficial ownership of the assets</p>
            
            <hr class="card-divider">
            <p class="card-text">
              Dear user,<br>
              To continue with verification, please confirm that you are the rightful owner of the assets associated with your AVR account and activities.
            </p>
          </div>


          <label class="confirmation-checkbox">
            <div class="checkbox-custom" @click.prevent="toggleConfirm">
              <div class="checkbox-bg" :class="{ checked: isConfirmed }"></div>
              <img v-if="isConfirmed" src="/assets/image/a84c69a218ab38138fa855a6c1a8a8dfc114da81.png" alt="Check" class="check-icon">
            </div>
            <span class="checkbox-text" @click.prevent="toggleConfirm">I confirm that I am the authorized owner of the assets to be used.</span>
            <input type="checkbox" class="hidden-input" :checked="isConfirmed">
          </label>

          <div class="action-container">
            <button class="primary-btn" :disabled="!isConfirmed || isPurchasing" @click="confirmPurchase">
              {{ isPurchasing ? 'Processing...' : 'Start Cloud' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <ConfirmationModal
      v-model="showPurchaseModal"
      message="Are you sure you want to purchase this asset?"
      :amount="product ? `$${formatPrice(product.price)}` : ''"
      @confirm="executePurchase"
    />

    <SuccessModal
      v-model="successModalOpen"
      :message="successMessage"
      @confirm="handleSuccessConfirm"
    />
    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productAPI } from '@/services/api'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()

const product = ref(null)
const isLoading = ref(false)
const isConfirmed = ref(false)
const showPurchaseModal = ref(false)
const isPurchasing = ref(false)
const successModalOpen = ref(false)
const errorModalOpen = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const redirectInvestmentId = ref(null)

const toggleConfirm = () => {
  isConfirmed.value = !isConfirmed.value
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const n = Number(String(value).replace(/,/g, ''))
  if (Number.isNaN(n)) return null
  return n
}

const formatPrice = (value) => {
  const n = parseNumber(value)
  if (n === null) return '0'
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

const profitPerDay = computed(() => {
  if (!product.value) return '$-/day'
  const profitType = String(product.value?.profit_type || '').toLowerCase()
  if (profitType === 'random') {
    const min = parseNumber(product.value?.profit_random_min)
    const max = parseNumber(product.value?.profit_random_max)
    if (min !== null && max !== null) return `$${formatPrice(min)}~${formatPrice(max)}`
    if (min !== null) return `$${formatPrice(min)}`
  }
  const rate = parseNumber(product.value?.profit_rate)
  if (rate !== null && rate > 0) return `$${formatPrice(rate)}`
  return '$-'
})

const durationText = computed(() => {
  const d = parseNumber(product.value?.duration)
  if (d === null) return '-'
  return `${d} Days`
})

const dueDateText = computed(() => {
  const d = parseNumber(product.value?.duration)
  if (d === null) return '-'
  const due = new Date()
  due.setDate(due.getDate() + d)
  return `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')}/${due.getFullYear()}`
})

const availabilityText = computed(() => {
  const enabled = product.value?.stock_enabled
  const stock = parseNumber(product.value?.stock)
  if (enabled && stock !== null && stock <= 0) return 'Sold out'
  return 'Available'
})

const fetchProduct = async () => {
  const id = Number(route.params.id)
  if (!Number.isFinite(id)) return
  isLoading.value = true
  try {
    const resp = await productAPI.getProduct(id)
    product.value = resp?.data || null
  } catch (_) {
    product.value = null
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.id, fetchProduct, { immediate: true })

const goBack = () => {
  router.go(-1)
}

const confirmPurchase = () => {
  if (!isConfirmed.value) return
  errorMessage.value = ''
  errorModalOpen.value = false
  showPurchaseModal.value = true
}

const extractPurchaseErrorMessage = (data) => {
  if (!data) return ''
  if (typeof data === 'string') return data
  const detail = data?.detail ?? data?.message ?? ''
  if (detail) return String(detail)

  const values = []
  for (const v of Object.values(data)) {
    if (Array.isArray(v)) values.push(...v)
    else if (typeof v === 'string') values.push(v)
  }
  const combined = values.map((x) => String(x || '').trim()).filter(Boolean).join(' ')
  if (!combined) return ''

  const s = combined.toLowerCase()
  if (
    s.includes('balance') ||
    s.includes('insufficient') ||
    s.includes('saldo')
  ) {
    return 'Please top up your balance first.'
  }
  if (s.includes('purchase limit') || s.includes('maximum')) {
    return 'You have reached the maximum limit for this product.'
  }

  return combined
}

const executePurchase = async () => {
  if (isPurchasing.value) return
  const productId = Number(route.params.id)
  if (!Number.isFinite(productId)) return
  showPurchaseModal.value = false
  errorMessage.value = ''
  errorModalOpen.value = false
  isPurchasing.value = true
  try {
    const resp = await productAPI.purchaseProduct({
      product_id: productId,
      quantity: 1,
      withdraw_pin: ''
    })
    const inv = resp?.data
    redirectInvestmentId.value = inv?.id ?? inv?.investment_id ?? null
    successMessage.value = 'Asset has been added to your account.'
    successModalOpen.value = true
  } catch (err) {
    const data = err?.response?.data
    errorMessage.value = extractPurchaseErrorMessage(data) || 'Purchase failed'
    errorModalOpen.value = true
  } finally {
    isPurchasing.value = false
  }
}

const handleSuccessConfirm = () => {
  const id = redirectInvestmentId.value
  redirectInvestmentId.value = null
  if (id) {
    router.push(`/portfolio`)
    return
  }
  router.push('/portfolio')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 100%;
  background-color: #f8f8f8;
  min-height: 100vh;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
#section-header .header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  position: relative;
  padding: 0 19px;
}

#section-header .back-btn {
  position: absolute;
  left: 19px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

#section-header .back-btn img {
  width: 20px;
  height: 20px;
}

#section-header .page-title {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Breadcrumb */
#section-breadcrumb .breadcrumb {
  display: flex;
  align-items: center;
  padding: 10px 23px;
  gap: 8px;
}

#section-breadcrumb .breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #939393;
}

#section-breadcrumb .breadcrumb-item.active {
  color: #000000;
  font-weight: 700;
}

#section-breadcrumb .shop-icon {
  width: 21px;
  height: 21px;
  object-fit: contain;
}

#section-breadcrumb .separator-icon {
  width: 17px;
  height: 17px;
}

/* Content */
#section-content .content-bg {
  min-height: calc(100vh - 100px);
}

#section-content .content-wrapper {
  padding: 10px 23px 40px 23px;
}

#section-content .info-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  padding: 20px 15px 15px 11px;
  margin-bottom: 15px;
}

#section-content .card-divider {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  margin: 0 0 10px 0;
}

#section-content .card-text {
  font-size: 14px;
  color: #737373;
  line-height: 1.5;
  margin: 0;
}

.detail-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
}

.detail-value {
  font-size: 14px;
  color: #000000;
  font-weight: 700;
}

/* Checkbox */
.confirmation-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 35px;
  padding: 0 6px;
}

.checkbox-custom {
  position: relative;
  width: 19px;
  height: 19px;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #cccccc;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.checkbox-bg.checked {
  background-color: #1b46f5;
}

.check-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.hidden-input {
  display: none;
}

.checkbox-text {
  font-size: 12px;
  color: #000000;
  line-height: 1.4;
}

/* Action Button */
.action-container {
  display: flex;
  justify-content: center;
}

.primary-btn {
  width: 177px;
  height: 45px;
  border-radius: 15px;
  background: linear-gradient(180deg, #4084e0 0%, #2656b5 100%);
  color: #ffffff;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: opacity 0.2s;
}

.primary-btn:hover {
  opacity: 0.9;
}

.primary-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
