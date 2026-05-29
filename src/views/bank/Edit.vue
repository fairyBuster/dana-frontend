<template>
  <div class="app-container">
    <section id="section-header">
      <header class="header">
        <img src="/assets/images/59_187.svg" alt="" class="icon-back" @click="goBack">
        <h1>Kelola Rekening</h1>
      </header>
    </section>

    <section id="section-intro">
      <div class="intro-content">
        <h2>Kelola Rekening</h2>
        <p>Perbarui rekening bank untuk isi ulang dan tarik uang dengan aman.</p>
      </div>
    </section>

    <section v-if="formData.id" id="section-main-account">
      <div class="card-primary">
        <div class="card-content">
          <span class="label">Rekening Dipilih</span>
          <span class="bank-name">{{ selectedBank || 'Nama Bank' }}</span>
          <span class="acc-number">{{ maskAccountNumber(formData.accountNumber) }}</span>
          <span class="acc-name">{{ formData.accountHolder || '—' }}</span>
        </div>
        <img src="/assets/images/ff8ec6de6b36b2f7d2c1090894503bd976133e33.png" alt="" class="card-illustration">
      </div>
    </section>

    <section id="section-account-list">
      <h3>Daftar Rekening</h3>
      <div class="add-account-btn">
        <div class="add-left">
          <img src="/assets/images/59_213.svg" alt="" class="icon-add">
          <span>Perbarui rekening</span>
        </div>
        <img src="/assets/images/f8648f6433668b71d57f0c9b7251b169b98c2581.png" alt="" class="icon-wallet">
      </div>
    </section>

    <section id="section-form">
      <h3>Form Kelola Rekening</h3>
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

    <section id="section-warning">
      <div class="warning-box">
        <img src="/assets/images/60_254.svg" alt="" class="icon-warning">
        <p>Pastikan data rekening sesuai agar proses verifikasi berjalan lancar.</p>
      </div>
    </section>

    <section id="section-footer">
      <button class="btn-primary" :disabled="loading || !canSave" @click="handleSubmit">
        {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
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

const currencyCode = computed(() => {
  const raw = String(route.query.currency_code || route.query.currencyCode || '').trim().toUpperCase()
  if (raw === 'USD') return 'USD'
  return 'IDR'
})

const maskAccountNumber = (num) => {
  const s = String(num || '').replace(/\s/g, '')
  if (!s) return '—'
  if (s.length <= 4) return s
  return '*'.repeat(s.length - 4) + s.slice(-4)
}

const formData = reactive({
  id: null,
  bankId: null,
  accountHolder: '',
  accountNumber: '',
  phone: '',
  isDefault: false
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

const pickText = (obj, keys) => {
  for (const k of keys) {
    const v = obj?.[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}

const isUserBankForCurrency = (bank, curr) => {
  const want = String(curr || '').trim().toUpperCase()
  if (!want) return false
  const direct = pickText(bank, ['currency_code', 'currency', 'currencyCode', 'bank_currency_code', 'bank_currency']).toUpperCase()
  if (direct) return direct === want
  const nestedBank = bank?.bank && typeof bank.bank === 'object'
    ? pickText(bank.bank, ['currency_code', 'currency', 'currencyCode', 'bank_currency_code', 'bank_currency']).toUpperCase()
    : ''
  if (nestedBank) return nestedBank === want
  return true
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

const loadExistingBank = async () => {
  try {
    const resp = await bankAPI.getUserBanks()
    const list = normalizeBanksResponse(resp?.data)
    const queryId = String(route.query.id || '').trim()
    let found = null
    if (queryId) {
      found = list.find((b) => String(b?.id ?? '') === queryId) || null
    }
    if (!found) {
      found = list.find((b) => isUserBankForCurrency(b, currencyCode.value)) || null
    }
    if (!found) {
      router.replace({ path: '/hn/connect/add', query: { currency_code: currencyCode.value } })
      return
    }

    formData.id = found?.id ?? null
    formData.bankId = found?.bank ?? found?.bank_id ?? null
    formData.accountHolder = String(found?.account_name || '').trim()
    formData.accountNumber = String(found?.account_number || '').trim()
    formData.phone = String(found?.phone || '').trim()
    formData.isDefault = Boolean(found?.is_default)

    const label = String(found?.bank_name || found?.bank_code || '').trim()
    if (label) selectedBank.value = label

    if (formData.bankId) {
      const opt = bankOptions.value.find((b) => String(b.id) === String(formData.bankId))
      if (opt) selectedBank.value = opt.name
    }
  } catch (_) {
    router.replace({ path: '/hn/connect/add', query: { currency_code: currencyCode.value } })
  }
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Failed to update bank account'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
    return data.non_field_errors.map((x) => String(x || '')).join(' ').trim()
  }
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Failed to update bank account'
}

const handleSubmit = async () => {
  errorModalOpen.value = false
  errorMessage.value = ''

  if (!formData.id) {
    errorMessage.value = 'Data bank tidak ditemukan'
    errorModalOpen.value = true
    return
  }
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
    await bankAPI.updateUserBank({
      id: formData.id,
      bank: Number(formData.bankId),
      account_name: String(formData.accountHolder).trim(),
      account_number: String(formData.accountNumber).replace(/\s+/g, ''),
      phone: String(formData.phone || '').trim(),
      is_default: Boolean(formData.isDefault)
    })
    router.replace('/hn/user/account')
  } catch (error) {
    errorMessage.value = extractErrorMessage(error)
    errorModalOpen.value = true
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchBanks()
  await loadExistingBank()
})

watch(
  () => currencyCode.value,
  async (next, prev) => {
    if (next === prev) return
    selectedBank.value = ''
    formData.id = null
    formData.bankId = null
    formData.accountHolder = ''
    formData.accountNumber = ''
    bankOptions.value = []
    showBankModal.value = false
    await fetchBanks()
    await loadExistingBank()
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
