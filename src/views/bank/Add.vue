<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/330_251.svg" alt="Back">
        </button>
        <h1 class="header-title">Manage card</h1>
      </header>
    </section>

    <!-- Form -->
    <section id="section-form">
      <div class="form-container">
        <form class="manage-card-form" @submit.prevent="handleSubmit">

          <div class="form-group">
            <label for="bank-name">Bank name</label>
            <div class="input-with-icon">
              <input
                type="text"
                id="bank-name"
                :value="selectedBank"
                placeholder="Tersedia"
                readonly
                @click="showBankModal = true"
                class="clickable-input"
              >
              <button type="button" class="icon-btn" @click="showBankModal = true" aria-label="Select bank">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="bank-address">Address bank</label>
            <input
              type="text"
              id="bank-address"
              v-model="formData.accountNumber"
              placeholder="Please input your bank address"
              @input="onAccountNumberInput"
            >
          </div>

          <div class="form-group">
            <label for="name-holder">Name holder</label>
            <div class="input-with-icon">
              <input
                :type="showHolderName ? 'text' : 'password'"
                id="name-holder"
                v-model="formData.accountHolder"
                placeholder="Please input name holder"
                @input="onAccountHolderInput"
              >
              <button type="button" class="icon-btn" @click="showHolderName = !showHolderName" aria-label="Toggle visibility">
                <svg v-if="!showHolderName" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4C4.5 4 1.5 10 1.5 10C1.5 10 4.5 16 10 16C15.5 16 18.5 10 18.5 10C18.5 10 15.5 4 10 4Z" stroke="#737373" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="10" cy="10" r="3" stroke="#737373" stroke-width="1.2"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4C4.5 4 1.5 10 1.5 10C1.5 10 4.5 16 10 16C15.5 16 18.5 10 18.5 10C18.5 10 15.5 4 10 4Z" stroke="#737373" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="10" cy="10" r="3" fill="#737373"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              v-model="formData.phone"
              placeholder="Please input your number phone"
              inputmode="tel"
            >
          </div>

          <p class="notice-text">Double-check your bank account address to avoid any mistakes.</p>

          <button type="submit" class="submit-btn" :disabled="loading || !canSave">
            {{ loading ? 'Submitting...' : 'Submit' }}
          </button>

        </form>
      </div>
    </section>

    <BankOptionsModal
      :visible="showBankModal"
      :bank-options="bankOptions"
      :selected-bank-id="formData.bankId"
      null-label="Tersedia"
      @close="showBankModal = false"
      @select="selectBank"
    />

    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { bankAPI } from '@/services/api'
import BankOptionsModal from '@/components/partials/BankOptionsModal.vue'
import ErrorModal from '@/components/modals/AppErrorModal.vue'

const router = useRouter()
const route = useRoute()
const showBankModal = ref(false)
const selectedBank = ref('')
const loading = ref(false)
const bankOptions = ref([])
const errorModalOpen = ref(false)
const errorMessage = ref('')
const isAccountVerified = ref(false)
const isVerifying = ref(false)
const showHolderName = ref(false)

const currencyCode = computed(() => {
  const raw = String(route.query.currency_code || route.query.currencyCode || '').trim().toUpperCase()
  if (raw === 'USD') return 'USD'
  return 'IDR'
})

const formData = reactive({
  bankId: null,
  accountHolder: '',
  accountNumber: '',
  phone: ''
})

const canSave = computed(() => {
  return Boolean(
    formData.bankId &&
      String(formData.accountHolder || '').trim() &&
      String(formData.accountNumber || '').trim()
  )
})

const sanitizeAccountHolder = (value) => {
  return String(value || '')
    .replace(/[^\p{L}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trimStart()
}

const sanitizeAccountNumber = (value) => {
  return String(value || '')
    .replace(/[^\p{L}\p{N}\s._-]/gu, '')
    .replace(/\s+/g, ' ')
    .trimStart()
}

const onAccountHolderInput = () => {
  formData.accountHolder = sanitizeAccountHolder(formData.accountHolder)
}

const onAccountNumberInput = () => {
  formData.accountNumber = sanitizeAccountNumber(formData.accountNumber)
  isAccountVerified.value = false
}

const selectBank = (bank) => {
  if (!bank?.id) {
    selectedBank.value = ''
    formData.bankId = null
    showBankModal.value = false
    return
  }

  selectedBank.value = bank.name
  formData.bankId = bank.id
  showBankModal.value = false
}

const goBack = () => {
  router.go(-1)
}

const normalizeBanksResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
}

const fetchBanks = async () => {
  try {
    const resp = await bankAPI.getBanks({ currency_code: currencyCode.value })
    const list = normalizeBanksResponse(resp?.data)
    bankOptions.value = list
      .map((b) => ({
        id: b?.id,
        name: b?.name || b?.bank_name || b?.code || String(b?.id ?? '')
      }))
      .filter((b) => b.id !== null && b.id !== undefined && b.name)
  } catch (_) {
    bankOptions.value = []
  }
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Failed to add bank account'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
    const msg = data.non_field_errors.map((x) => String(x || '')).join(' ').trim()
    const s = msg.toLowerCase()
    if (
      s.includes('must make a unique set') ||
      (s.includes('unique') && s.includes('user') && s.includes('bank'))
    ) {
      return 'Bank already exists'
    }
    if (
      (s.includes('maximum limit') && (s.includes('1 bank') || s.includes('1 account'))) ||
      (s.includes('batas maksimal') && s.includes('1') && s.includes('bank'))
    ) {
      return 'Limit'
    }
    return msg
  }
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Failed to add bank account'
}

const handleSubmit = async () => {
  errorModalOpen.value = false
  errorMessage.value = ''
  if (!formData.bankId || !formData.accountHolder || !formData.accountNumber) {
    errorMessage.value = 'Please complete all fields'
    errorModalOpen.value = true
    return
  }

  formData.accountHolder = sanitizeAccountHolder(formData.accountHolder)
  formData.accountNumber = sanitizeAccountNumber(formData.accountNumber)
  if (!formData.accountHolder) {
    errorMessage.value = 'Account holder name must be letters only'
    errorModalOpen.value = true
    return
  }
  if (!formData.accountNumber) {
    errorMessage.value = 'Bank address must not be empty'
    errorModalOpen.value = true
    return
  }

  loading.value = true
  try {
    let isDefault = false
    try {
      const resp = await bankAPI.getUserBanks()
      const list = normalizeBanksResponse(resp?.data)
      isDefault = !list.length
    } catch (_) {
      isDefault = false
    }

    await bankAPI.addUserBank({
      bank: Number(formData.bankId),
      account_name: String(formData.accountHolder).trim(),
      account_number: String(formData.accountNumber).replace(/\s+/g, ''),
      phone: String(formData.phone || '').trim(),
      is_default: isDefault
    })
    router.replace('/hn/user/account')
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
    errorModalOpen.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBanks()
})

watch(
  () => currencyCode.value,
  (next, prev) => {
    if (next === prev) return
    selectedBank.value = ''
    formData.bankId = null
    bankOptions.value = []
    showBankModal.value = false
    fetchBanks()
  }
)
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, p {
  margin: 0;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 10px;
  position: relative;
  height: 60px;
}

.back-btn {
  position: absolute;
  left: 10px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 20px;
  height: 20px;
}

.header-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

/* Form */
.form-container {
  padding: 14px 10px;
  min-height: calc(100vh - 60px);
}

.manage-card-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-left: 2px;
}

.form-group input {
  width: 100%;
  height: 55px;
  padding: 0 15px;
  background-color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: #000000;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.form-group input::placeholder {
  color: rgba(0, 0, 0, 0.37);
}

.form-group input:focus {
  outline: 1px solid #1b46f5;
}

.clickable-input {
  cursor: pointer;
  caret-color: transparent;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon input {
  padding-right: 40px;
}

.icon-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn img {
  width: 20px;
  height: 20px;
}

.notice-text {
  margin: 10px 0 15px 0;
  font-size: 14px;
  font-weight: 400;
  color: #1b46f5;
  line-height: 1.4;
}

.submit-btn {
  background-color: #1b46f5;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  height: 45px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  transition: background-color 0.2s ease;
  margin-top: 5px;
}

.submit-btn:hover {
  background-color: #1436c4;
}

.submit-btn:active {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
