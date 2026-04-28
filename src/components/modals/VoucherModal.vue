<template>
  <div v-if="modelValue" id="section-voucher-modal" @click.self="close">
    <div class="app-container">
      <div class="modal-card">
        <button class="close-btn" aria-label="Close modal" @click="close" :disabled="isSubmitting">
          <span class="close-icon" aria-hidden="true">×</span>
        </button>

        <div class="coins-illustration">
          <img src="/assets/images/da4151be78469acf27cc0da4d60d3f5fcefd602d.png" class="coin coin-side" alt="Coin">
          <img src="/assets/images/da4151be78469acf27cc0da4d60d3f5fcefd602d.png" class="coin coin-center" alt="Large Coin">
          <img src="/assets/images/da4151be78469acf27cc0da4d60d3f5fcefd602d.png" class="coin coin-side" alt="Coin">
        </div>

        <div class="input-container">
          <input
            ref="codeInput"
            v-model="code"
            type="text"
            class="voucher-input"
            :placeholder="placeholder || 'Masukkan kode voucher disini'"
          >
        </div>

        <button class="submit-button" type="button" @click="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Memproses...' : (submitText || 'Tukar kode') }}
        </button>
      </div>
    </div>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <SuccessModal v-model="showSuccessModal" :message="successMessage" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { voucherAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Masukkan kode voucher disini' },
  submitText: { type: String, default: 'Tukar kode' }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const code = ref('')
const codeInput = ref(null)
const isSubmitting = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

watch(() => props.modelValue, (val) => {
  if (val) {
    code.value = ''
    setTimeout(() => {
      if (codeInput.value) codeInput.value.focus()
    }, 100)
  }
})

const close = () => {
  if (isSubmitting.value) return
  emit('update:modelValue', false)
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatRupiah = (value) => {
  const n = parseNumber(value)
  return `Rp ${new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)}`
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal klaim voucher'
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

    if (m.includes('kuota voucher harian telah habis')) return 'Kode habis'
    if (m.includes('voucher telah mencapai batas penggunaan')) return 'Kode habis'
    if (m.includes('anda sudah klaim voucher ini hari ini')) return 'Kode habis'
    if (m.includes('voucher ini sudah digunakan oleh akun anda')) return 'Kode habis'

    if (m.includes('voucher tidak aktif')) return 'Kode tidak aktif'
    if (m.includes('voucher belum dapat diklaim')) return 'Kode tidak aktif'

    if (m.includes('voucher sudah kedaluwarsa') || m.includes('kedaluwarsa')) return 'Kode expired'

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
  return mapped || msg || err?.message || 'Gagal klaim voucher'
}

const submit = async () => {
  if (isSubmitting.value) return
  showErrorModal.value = false
  errorMessage.value = ''
  showSuccessModal.value = false
  successMessage.value = ''

  const raw = String(code.value || '').trim()
  if (!raw) {
    errorMessage.value = 'Masukkan kode voucher terlebih dahulu'
    showErrorModal.value = true
    return
  }

  isSubmitting.value = true
  try {
    const resp = await voucherAPI.claim({ code: raw })
    const data = resp?.data || {}
    const claimed = parseNumber(data.claimed_amount ?? data.amount ?? data.value ?? 0)
    successMessage.value = `Berhasil menerima bonus ${formatRupiah(claimed)}`
    showSuccessModal.value = true
    emit('submit', raw)
    emit('update:modelValue', false)
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#section-voucher-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(55, 55, 55, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app-container {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 0 27px;
}

.modal-card {
  width: 100%;
  max-width: 359px;
  background-color: #ffffff;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.close-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.close-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 22px;
  line-height: 1;
}

.coins-illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 40px;
  position: relative;
}

.coin {
  object-fit: contain;
}

.coin-side {
  width: 38px;
  height: 39px;
  z-index: 1;
}

.coin-center {
  width: 66px;
  height: 67px;
  z-index: 2;
  margin: 0 -6px;
  transform: translateY(-7px);
}

.input-container {
  padding: 0 20px;
  margin-bottom: 45px;
  display: flex;
  justify-content: center;
}

.voucher-input {
  width: 100%;
  max-width: 291px;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 15px;
  color: #000000;
  outline: none;
  font-family: inherit;
}

.voucher-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.submit-button {
  width: 100%;
  height: 55px;
  background-color: transparent;
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.21);
  color: #004d43;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.submit-button:active {
  background-color: rgba(0, 0, 0, 0.06);
}

/* Responsive Adjustments */
@media (max-width: 380px) {
  .app-container {
    padding: 0 16px;
  }

  .modal-card {
    width: 100%;
  }
}
</style>
