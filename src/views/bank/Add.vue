<template>
  <div class="app-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-content">
        <button class="back-button" @click="goBack">
          <img src="/assets/image/169_294.svg" alt="Back">
        </button>
        <h1 class="screen-title">Tambah kartu</h1>
      </div>
    </header>

    <!-- Form Section -->
    <section id="section-form">
      <form class="card-form" novalidate @submit.prevent="handleSubmit">
        <!-- Bank Selection -->
        <div class="form-group">
          <label class="form-label">Nama bank</label>
          <div class="custom-select" @click="showBankModal = true">
            <span :class="{ 'placeholder-text': !selectedBank }">
              {{ selectedBank || 'Escolha o banco' }}
            </span>
            <img src="/assets/image/172_306.svg" alt="Dropdown" class="dropdown-icon">
          </div>
        </div>

        <!-- Card Holder Name -->
        <div class="form-group">
          <label class="form-label">Nama penerima kartu</label>
          <input 
            v-model="formData.accountHolder" 
            type="text" 
            class="form-input" 
            placeholder="Silakan masukkan nama Anda"
            @input="onAccountHolderInput"
          >
        </div>

        <!-- Account Number -->
        <div class="form-group">
          <label class="form-label">Nomor rekening bank</label>
          <input 
            v-model="formData.accountNumber"
            type="text"
            inputmode="numeric"
            class="form-input" 
            @input="onAccountNumberInput"
            placeholder="Silakan masukkan nomor rekening Anda"
          >
        </div>

        <!-- Phone Number -->
        <div class="form-group">
          <label class="form-label">Nomor telepon</label>
          <input 
            v-model="formData.phone" 
            type="tel" 
            class="form-input" 
            placeholder="Silakan masukkan nomor telepon Anda"
          >
        </div>

        <!-- Email -->
        <div class="form-group">
          <label class="form-label">Surat</label>
          <input 
            v-model="formData.email" 
            type="email" 
            class="form-input" 
            placeholder="Silakan masukkan alamat email Anda"
          >
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Menyimpan...' : 'Simpan kartu bank' }}
        </button>
      </form>
    </section>

    <BankOptionsModal
      :visible="showBankModal"
      :bank-options="bankOptions"
      :selected-bank-id="formData.bankId"
      null-label="Escolha o banco"
      @close="showBankModal = false"
      @select="selectBank"
    />

    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { bankAPI } from '@/services/api'
import BankOptionsModal from '@/components/partials/BankOptionsModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const showBankModal = ref(false)
const selectedBank = ref('')
const loading = ref(false)
const bankOptions = ref([])
const errorModalOpen = ref(false)
const errorMessage = ref('')

const formData = reactive({
  bankId: null,
  accountHolder: '',
  accountNumber: '',
  phone: '',
  email: ''
})

const sanitizeAccountHolder = (value) => {
  return String(value || '')
    .replace(/[^\p{L}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trimStart()
}

const sanitizeAccountNumber = (value) => {
  return String(value || '').replace(/\D+/g, '')
}

const onAccountHolderInput = () => {
  formData.accountHolder = sanitizeAccountHolder(formData.accountHolder)
}

const onAccountNumberInput = () => {
  formData.accountNumber = sanitizeAccountNumber(formData.accountNumber)
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
    const resp = await bankAPI.getBanks()
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
  if (!data) return err?.message || 'Gagal menambahkan kartu bank'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Gagal menambahkan kartu bank'
}

const handleSubmit = async () => {
  errorModalOpen.value = false
  errorMessage.value = ''
  if (!formData.bankId || !formData.accountHolder || !formData.accountNumber || !formData.phone || !formData.email) {
    errorMessage.value = 'Mohon lengkapi semua data'
    errorModalOpen.value = true
    return
  }

  formData.accountHolder = sanitizeAccountHolder(formData.accountHolder)
  formData.accountNumber = sanitizeAccountNumber(formData.accountNumber)
  if (!formData.accountHolder) {
    errorMessage.value = 'Nama penerima kartu wajib huruf saja'
    errorModalOpen.value = true
    return
  }
  if (!formData.accountNumber) {
    errorMessage.value = 'Nomor rekening wajib angka saja'
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
      is_default: isDefault
    })
    router.replace('/pages/account/account')
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.app-container {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: 412px auto;
  background-repeat: no-repeat;
  background-position: top center;
  background-color: #0f0f1f;
  display: flex;
  flex-direction: column;
}

* {
  box-sizing: border-box;
}

/* Header */
.app-header {
  padding-top: 18px;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
}

.header-content {
  position: relative;
  display: flex;
  align-items: center;
  height: 24px;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  z-index: 2;
}

.screen-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  pointer-events: none;
}

/* Form Section */
#section-form {
  padding: 0 22px 40px 22px;
}

.card-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
}

.form-input, .custom-select {
  width: 100%;
  height: 43px;
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 5px;
  padding: 0 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #ffffff;
  display: flex;
  align-items: center;
}

.custom-select {
  justify-content: space-between;
  cursor: pointer;
  position: relative;
}

.placeholder-text {
  color: #505050;
}

.form-input::placeholder {
  color: #505050;
}

.form-input:focus {
  outline: none;
  border-color: #8e84b5;
}

/* Bank Dropdown */
.bank-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 5px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
}

.dropdown-item {
  padding: 10px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: rgba(116, 106, 154, 0.3);
}

.submit-btn {
  margin-top: 20px;
  width: 100%;
  height: 51px;
  border-radius: 10px;
  border: 1px solid #746a9a;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.submit-btn:hover {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
