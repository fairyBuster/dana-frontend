<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <img src="/assets/images/59_187.svg" alt="" class="icon-back" @click="goBack">
        <h1>Ikat Bank</h1>
      </header>
    </section>

    <!-- Intro -->
    <section id="section-intro">
      <div class="intro-content">
        <h2>Ikat Bank</h2>
        <p>Kelola rekening bank untuk isi ulang dan tarik uang dengan aman.</p>
      </div>
    </section>

    <!-- Main Account (show existing if available) -->
    <section v-if="existingBank" id="section-main-account">
      <div class="card-primary">
        <div class="card-content">
          <span class="label">Rekening Utama</span>
          <span class="bank-name">{{ existingBank.bank_name || existingBank.name || 'Nama Bank' }}</span>
          <span class="acc-number">{{ maskAccountNumber(existingBank.account_number || existingBank.account_no || '') }}</span>
          <span class="acc-name">{{ existingBank.account_name || existingBank.account_holder || '—' }}</span>
        </div>
        <img src="/assets/images/ff8ec6de6b36b2f7d2c1090894503bd976133e33.png" alt="" class="card-illustration">
      </div>
    </section>

    <!-- Account List -->
    <section id="section-account-list">
      <h3>Daftar Rekening</h3>
      <div class="add-account-btn">
        <div class="add-left">
          <img src="/assets/images/59_213.svg" alt="" class="icon-add">
          <span>Tambah rekening baru</span>
        </div>
        <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="" class="icon-wallet">
      </div>
    </section>

    <!-- Form -->
    <section id="section-form">
      <h3>Form Ikat Bank</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group" @click="showBankModal = true">
          <label>Pilih Bank</label>
          <div class="input-wrapper">
            <input
              type="text"
              :value="selectedBank"
              placeholder="Pilih nama bank"
              readonly
            >
            <img src="/assets/images/59_222.svg" alt="" class="icon-dropdown">
          </div>
        </div>

        <div class="form-group">
          <label>Nama Pemilik Rekening</label>
          <input
            type="text"
            v-model="formData.accountHolder"
            placeholder="Masukkan nama sesuai rekening"
            @input="onAccountHolderInput"
          >
        </div>

        <div class="form-group">
          <label>Nomor Rekening</label>
          <input
            type="text"
            v-model="formData.accountNumber"
            placeholder="Masukkan nomor rekening"
            @input="onAccountNumberInput"
          >
        </div>
      </form>
    </section>

    <!-- Warning -->
    <section id="section-warning">
      <div class="warning-box">
        <img src="/assets/images/60_254.svg" alt="" class="icon-warning">
        <p>Pastikan data rekening sesuai agar proses verifikasi berjalan lancar.</p>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer">
      <div class="checkbox-group" @click="termsAccepted = !termsAccepted">
        <div class="custom-checkbox" :class="{ unchecked: !termsAccepted }">
          <img v-if="termsAccepted" src="/assets/images/I60_259_51859_5632.svg" alt="">
        </div>
        <p>Saya setuju dengan <span class="highlight">Kebijakan Privasi</span> dan <span class="highlight">Syarat Layanan</span></p>
      </div>
      <button class="btn-primary" :disabled="loading || !canSave" @click="handleSubmit">
        {{ loading ? 'Menyimpan...' : 'Simpan Rekening' }}
      </button>
    </section>

    <BankOptionsModal
      :visible="showBankModal"
      :bank-options="bankOptions"
      :selected-bank-id="formData.bankId"
      null-label="Pilih"
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
const termsAccepted = ref(false)
const existingBank = ref(null)

const currencyCode = computed(() => {
  const raw = String(route.query.currency_code || route.query.currencyCode || '').trim().toUpperCase()
  if (raw === 'USD') return 'USD'
  return 'IDR'
})

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
    termsAccepted.value
  )
})

const maskAccountNumber = (num) => {
  const s = String(num || '').replace(/\s/g, '')
  if (!s) return '—'
  if (s.length <= 4) return s
  return '*'.repeat(s.length - 4) + s.slice(-4)
}

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

const fetchExistingBank = async () => {
  try {
    const resp = await bankAPI.getUserBanks()
    const list = normalizeBanksResponse(resp?.data)
    existingBank.value = list[0] || null
  } catch (_) {
    existingBank.value = null
  }
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal menambah rekening'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
    const msg = data.non_field_errors.map((x) => String(x || '')).join(' ').trim()
    const s = msg.toLowerCase()
    if (
      s.includes('must make a unique set') ||
      (s.includes('unique') && s.includes('user') && s.includes('bank'))
    ) {
      return 'Rekening bank sudah terdaftar'
    }
    if (
      (s.includes('maximum limit') && (s.includes('1 bank') || s.includes('1 account'))) ||
      (s.includes('batas maksimal') && s.includes('1') && s.includes('bank'))
    ) {
      return 'Batas maksimal rekening tercapai'
    }
    return msg
  }
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Gagal menambah rekening'
}

const handleSubmit = async () => {
  errorModalOpen.value = false
  errorMessage.value = ''

  if (!formData.bankId || !formData.accountHolder || !formData.accountNumber) {
    errorMessage.value = 'Harap lengkapi semua data'
    errorModalOpen.value = true
    return
  }

  if (!termsAccepted.value) {
    errorMessage.value = 'Anda harus menyetujui syarat dan ketentuan'
    errorModalOpen.value = true
    return
  }

  formData.accountHolder = sanitizeAccountHolder(formData.accountHolder)
  formData.accountNumber = sanitizeAccountNumber(formData.accountNumber)

  if (!formData.accountHolder) {
    errorMessage.value = 'Nama pemilik rekening harus berupa huruf'
    errorModalOpen.value = true
    return
  }
  if (!formData.accountNumber) {
    errorMessage.value = 'Nomor rekening tidak boleh kosong'
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
  fetchExistingBank()
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
  margin: 0;
  padding: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  max-width: 412px;
  background-color: #fdfaf4;
  min-height: 100vh;
  margin: 0 auto;
  color: #060606;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
#section-header {
  padding: 23px 17px 0;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header h1 {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

.icon-back {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

/* Intro */
#section-intro {
  padding: 24px 17px 0;
}

.intro-content h2 {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
}

.intro-content p {
  font-size: 14px;
  color: #635f5f;
  line-height: 1.4;
  max-width: 280px;
}

/* Main Account */
#section-main-account {
  padding: 24px 17px 0;
}

.card-primary {
  background-color: #fdf5e6;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  padding: 18px 14px;
  display: flex;
  position: relative;
  overflow: hidden;
  height: 142px;
}

.card-content {
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.card-content .label {
  font-size: 12px;
  color: #ab7200;
  font-weight: 600;
  margin-bottom: 8px;
}

.card-content .bank-name {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
}

.card-content .acc-number {
  font-size: 14px;
  color: #737373;
  margin-bottom: 8px;
}

.card-content .acc-name {
  font-size: 12px;
  color: #737373;
}

.card-illustration {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 187px;
  height: 119px;
  z-index: 1;
}

/* Account List */
#section-account-list {
  padding: 24px 17px 0;
}

#section-account-list h3 {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 12px;
  margin-left: 4px;
}

.add-account-btn {
  background-color: #fdfcf8;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.add-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-left span {
  font-size: 14px;
  color: #060606;
  font-weight: 500;
}

.icon-add {
  width: 20px;
  height: 20px;
}

.icon-wallet {
  width: 29px;
  height: 29px;
}

/* Form */
#section-form {
  padding: 28px 17px 0;
}

#section-form h3 {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 12px;
  margin-left: 4px;
}

.form-group {
  background-color: #fffffe;
  border: 1px solid #c9c9c8;
  border-radius: 10px;
  height: 54px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 12px;
  cursor: pointer;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #060606;
  width: 110px;
  flex-shrink: 0;
  line-height: 1.2;
}

.input-wrapper {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
}

.form-group input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 12px;
  color: #060606;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.form-group input::placeholder {
  color: #7b7b7b;
}

.icon-dropdown {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* Warning */
#section-warning {
  padding: 12px 17px 0;
}

.warning-box {
  background-color: #fef6ea;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.warning-box p {
  font-size: 12px;
  color: #060606;
  line-height: 1.4;
}

.icon-warning {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

/* Footer */
#section-footer {
  padding: 16px 17px 40px;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
  padding: 0 8px;
  cursor: pointer;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  background-color: #f4bd40;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.custom-checkbox.unchecked {
  background-color: #d9d9d9;
}

.custom-checkbox img {
  width: 14px;
  height: 14px;
}

.checkbox-group p {
  font-size: 12px;
  color: #635f5f;
  line-height: 1.4;
}

.checkbox-group .highlight {
  color: #ab7200;
  font-weight: 600;
}

.btn-primary {
  width: 100%;
  height: 48px;
  background-color: #f3b740;
  border-radius: 5px;
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary:not(:disabled):active {
  opacity: 0.85;
}
</style>
