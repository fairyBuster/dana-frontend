<template>
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <button class="back-button" @click="goBack">
          <img src="/assets/image/169_294.svg" alt="Back">
        </button>
        <h1 class="screen-title">Manajemen kartu</h1>
      </div>
    </header>

    <section id="section-form">
      <form class="card-form" novalidate @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">Nama bank</label>
          <div class="custom-select" @click="showBankModal = true">
            <span :class="{ 'placeholder-text': !selectedBank }">
              {{ selectedBank || 'Escolha o banco' }}
            </span>
            <img src="/assets/image/172_306.svg" alt="Dropdown" class="dropdown-icon">
          </div>
        </div>

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

        <div class="form-group">
          <label class="form-label">Nomor rekening bank</label>
          <input
            v-model="formData.accountNumber"
            type="text"
            inputmode="numeric"
            class="form-input"
            placeholder="Silakan masukkan nomor rekening Anda"
            @input="onAccountNumberInput"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Nomor telepon</label>
          <input
            v-model="formData.phone"
            type="tel"
            class="form-input"
            placeholder="Silakan masukkan nomor telepon Anda"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Surat</label>
          <input
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="Silakan masukkan alamat email Anda"
          >
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Menyimpan...' : submitLabel }}
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, bankAPI } from '@/services/api'
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
  userBankId: null,
  bankId: null,
  accountHolder: '',
  accountNumber: '',
  phone: '',
  email: '',
  isDefault: true
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

const submitLabel = computed(() => {
  if (formData.userBankId) return 'Perbarui kartu bank'
  return 'Simpan kartu bank'
})

const goBack = () => {
  router.go(-1)
}

const normalizeBanksResponse = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.results)) return data.results
  return []
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

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, segarkan halaman'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Permintaan gagal, segarkan halaman'
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
    if (formData.bankId && !selectedBank.value) {
      const found = bankOptions.value.find((b) => String(b.id) === String(formData.bankId))
      if (found) selectedBank.value = found.name
    }
  } catch (err) {
    bankOptions.value = []
  }
}

const fetchAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    const data = resp?.data || {}
    const phone = String(data.phone || data.phone_number || data.user_phone || '').trim()
    const email = String(data.email || '').trim()
    if (!formData.phone && phone) formData.phone = phone
    if (!formData.email && email) formData.email = email
  } catch (_) {
  }
}

const fetchUserBanks = async () => {
  try {
    const resp = await bankAPI.getUserBanks()
    const list = normalizeBanksResponse(resp?.data)
    const chosen = list.find((b) => b?.is_default) || list[0] || null
    if (!chosen) return
    formData.userBankId = chosen?.id ?? null
    formData.bankId = chosen?.bank ?? null
    formData.accountHolder = chosen?.account_name || ''
    formData.accountNumber = chosen?.account_number || ''
    formData.isDefault = chosen?.is_default !== undefined ? Boolean(chosen.is_default) : true
    const label = chosen?.bank_name || chosen?.bank_code || ''
    if (label && !selectedBank.value) selectedBank.value = label
    if (formData.bankId) {
      const found = bankOptions.value.find((b) => String(b.id) === String(formData.bankId))
      if (found) selectedBank.value = found.name
    }
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    errorModalOpen.value = true
  }
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
    const payload = {
      bank: Number(formData.bankId),
      account_name: String(formData.accountHolder).trim(),
      account_number: String(formData.accountNumber).replace(/\s+/g, ''),
      is_default: Boolean(formData.isDefault)
    }

    if (formData.userBankId) {
      await bankAPI.updateUserBank({ id: formData.userBankId, ...payload })
    } else {
      let isDefault = true
      try {
        const resp = await bankAPI.getUserBanks()
        const list = normalizeBanksResponse(resp?.data)
        isDefault = !list.length
      } catch (_) {
        isDefault = true
      }
      await bankAPI.addUserBank({ ...payload, is_default: isDefault })
    }
    await fetchUserBanks()
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
  fetchAccountInfo()
  fetchUserBanks()
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
