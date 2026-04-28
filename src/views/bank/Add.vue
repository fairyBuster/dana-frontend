<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <button class="icon-btn back-btn" @click="goBack" aria-label="Kembali">
          <img src="/assets/images/2011_913.svg" alt="Back">
        </button>
        <h1 class="header-title">Tambah Rekening</h1>
      </header>
    </section>

    <section id="section-banner">
      <div class="info-banner">
        <p>Pastikan nama pemilik rekening sudah sesuai dengan milik Anda.</p>
      </div>
    </section>

    <section id="section-form">
      <h2 class="form-section-title">Data Rekening</h2>

      <div class="input-card" @click="showBankModal = true">
        <div class="input-content">
          <label class="input-label">Bank</label>
          <div class="input-text" :class="{ placeholder: !selectedBank }">
            {{ selectedBank || 'Tersedia saat ini' }}
          </div>
        </div>
        <img src="/assets/images/2011_934.svg" alt="Select" class="dropdown-icon">
      </div>

      <div class="input-card">
        <div class="input-content">
          <label class="input-label">Nomor Rekening</label>
          <input
            v-model="formData.accountNumber"
            type="text"
            inputmode="numeric"
            class="input-text"
            :class="{ placeholder: !formData.accountNumber }"
            placeholder="Masukkan nomor rekening Anda"
            @input="onAccountNumberInput"
          >
        </div>
        <button
          type="button"
          class="verify-btn"
          :class="{ verified: isAccountVerified }"
          @click="verifyAccount"
          :disabled="!formData.accountNumber || isVerifying || isAccountVerified"
        >
          {{ isAccountVerified ? 'Terverifikasi' : (isVerifying ? 'Memverifikasi...' : 'Verifikasi') }}
        </button>
      </div>

      <div class="input-card">
        <div class="input-content">
          <label class="input-label">Nama Pemilik Rekening</label>
          <input
            v-model="formData.accountHolder"
            type="text"
            class="input-text"
            :class="{ placeholder: !formData.accountHolder }"
            placeholder="Masukkan nama pemilik rekening"
            @input="onAccountHolderInput"
          >
        </div>
      </div>
    </section>

    <section id="section-action">
      <button class="btn-primary" @click="handleSubmit" :disabled="loading || !canSave">
        {{ loading ? 'Menyimpan...' : 'Simpan' }}
      </button>
    </section>

    <BankOptionsModal
      :visible="showBankModal"
      :bank-options="bankOptions"
      :selected-bank-id="formData.bankId"
      null-label="Tersedia saat ini"
      @close="showBankModal = false"
      @select="selectBank"
    />

    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
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
const isAccountVerified = ref(false)
const isVerifying = ref(false)

const formData = reactive({
  bankId: null,
  accountHolder: '',
  accountNumber: ''
})

const canSave = computed(() => {
  return Boolean(
    formData.bankId &&
      String(formData.accountHolder || '').trim() &&
      String(formData.accountNumber || '').trim() &&
      isAccountVerified.value
  )
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

const verifyAccount = () => {
  if (isVerifying.value) return
  const raw = String(formData.accountNumber || '').replace(/\D+/g, '')
  if (!raw) return
  if (raw.length < 5) {
    isAccountVerified.value = false
    errorMessage.value = 'Nomor rekening minimal 5 digit'
    errorModalOpen.value = true
    return
  }

  isVerifying.value = true
  window.setTimeout(() => {
    isVerifying.value = false
    isAccountVerified.value = true
  }, 600)
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
  if (!data) return err?.message || 'Gagal menambahkan rekening'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
    const msg = data.non_field_errors.map((x) => String(x || '')).join(' ').trim()
    const s = msg.toLowerCase()
    if (
      s.includes('must make a unique set') ||
      (s.includes('unique') && s.includes('user') && s.includes('bank'))
    ) {
      return 'Bank sudah tersedia'
    }
    if (s.includes('batas maksimal') && (s.includes('1 bank') || s.includes('1 rekening'))) {
      return 'Maksimal tercapai'
    }
    return msg
  }
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Gagal menambahkan rekening'
}

const handleSubmit = async () => {
  errorModalOpen.value = false
  errorMessage.value = ''
  if (!formData.bankId || !formData.accountHolder || !formData.accountNumber) {
    errorMessage.value = 'Mohon lengkapi semua data'
    errorModalOpen.value = true
    return
  }
  if (!isAccountVerified.value) {
    errorMessage.value = 'Silakan klik Verifikasi nomor rekening terlebih dahulu'
    errorModalOpen.value = true
    return
  }

  formData.accountHolder = sanitizeAccountHolder(formData.accountHolder)
  formData.accountNumber = sanitizeAccountNumber(formData.accountNumber)
  if (!formData.accountHolder) {
    errorMessage.value = 'Nama pemilik rekening wajib huruf saja'
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
    router.replace('/profile')
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
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

* {
  box-sizing: border-box;
}

h1, h2, p {
  margin: 0;
}

/* Header Section */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  position: relative;
  width: 100%;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: 5px;
  width: 35px;
  height: 35px;
}

.back-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  text-align: center;
}

/* Banner Section */
#section-banner {
  padding: 0 20px;
  margin-bottom: 24px;
  width: 100%;
}

.info-banner {
  background: linear-gradient(90deg, #d1e9e2 0%, #d1e9e2 42.79%, #dfefe9 68.27%, #d6ebe5 82.69%, #e8f4ef 100%);
  border-radius: 20px;
  padding: 16px;
}

.info-banner p {
  margin: 0;
  font-size: 12px;
  color: #000000;
  line-height: 1.5;
  font-weight: 400;
}

/* Form Section */
#section-form {
  padding: 0 20px;
  flex: 1;
  width: 100%;
}

.form-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 16px 0;
}

.input-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 14px 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  cursor: default;
}

.input-card.clickable {
  cursor: pointer;
}

.input-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.input-label {
  font-size: 12px;
  color: #004d43;
  font-weight: 600;
}

.input-text {
  font-size: 14px;
  color: #000000;
  font-weight: 400;
  background: transparent;
  border: none;
  outline: none;
  font-family: inherit;
  padding: 0;
  width: 100%;
}

.input-text.placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.input-text::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.dropdown-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.verify-btn {
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  flex-shrink: 0;
  margin-left: 8px;
}

.verify-btn.verified {
  background-color: #4ca455;
}

.verify-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Action Section */
#section-action {
  padding: 24px 20px 40px;
  margin-top: auto;
  width: 100%;
}

.btn-primary {
  width: 100%;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 18px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 58px;
  font-family: inherit;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>


