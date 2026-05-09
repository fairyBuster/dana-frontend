<template>
  <div v-if="modelValue" id="section-modal" @click.self="close">
    <div class="modal-container">
      <div class="card">
        <img src="/assets/image/8012db260f446873704d1419f8621c9af984cc9e.png" alt="Envelope" class="envelope-img">

        <div class="card-header">
          <p class="description">You are about to claim your envelope. Get code for redeem your envelope.</p>
        </div>

        <div class="input-box">
          <input
            ref="codeInput"
            v-model="code"
            type="text"
            class="code-input"
            :placeholder="placeholder || '---'"
            @keyup.enter="submit"
          >
        </div>

        <div class="actions">
          <button class="btn btn-claim" type="button" @click="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Processing...' : (submitText || 'Claim') }}
          </button>
          <button class="btn btn-home" type="button" @click="close" :disabled="isSubmitting">
            Back home
          </button>
        </div>
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
  placeholder: { type: String, default: '---' },
  submitText: { type: String, default: 'Claim' }
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
  if (!data) return err?.message || 'Failed to claim voucher'
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

    if (m.includes('user invalid')) return 'Wrong code'
    if (m.includes('voucher tidak ditemukan')) return 'Wrong code'
    if (m.includes('nominal voucher tidak valid')) return 'Wrong code'

    if (m.includes('kuota voucher harian telah habis')) return 'Code used up'
    if (m.includes('voucher telah mencapai batas penggunaan')) return 'Code used up'
    if (m.includes('anda sudah klaim voucher ini hari ini')) return 'Code used up'
    if (m.includes('voucher ini sudah digunakan oleh akun anda')) return 'Code used up'

    if (m.includes('voucher tidak aktif')) return 'Code inactive'
    if (m.includes('voucher belum dapat diklaim')) return 'Code inactive'

    if (m.includes('voucher sudah kedaluwarsa') || m.includes('kedaluwarsa')) return 'Code expired'

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
  return mapped || msg || err?.message || 'Failed to claim voucher'
}

const submit = async () => {
  if (isSubmitting.value) return
  showErrorModal.value = false
  errorMessage.value = ''
  showSuccessModal.value = false
  successMessage.value = ''

  const raw = String(code.value || '').trim()
  if (!raw) {
    errorMessage.value = 'Please enter a voucher code first'
    showErrorModal.value = true
    return
  }

  isSubmitting.value = true
  try {
    const resp = await voucherAPI.claim({ code: raw })
    const data = resp?.data || {}
    const claimed = parseNumber(data.claimed_amount ?? data.amount ?? data.value ?? 0)
    successMessage.value = `Successfully received bonus ${formatRupiah(claimed)}`
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

#section-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #7d7d7d;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.modal-container {
  max-width: 412px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.card {
  position: relative;
  width: 343px;
  background-color: #f9f9fc;
  border-radius: 10px;
  padding-top: 17px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.envelope-img {
  position: absolute;
  top: -31px;
  left: 0;
  width: 125px;
  height: 117px;
  object-fit: cover;
  z-index: 1;
}

.card-header {
  width: 100%;
  padding-right: 9px;
  display: flex;
  justify-content: flex-end;
}

.description {
  width: 209px;
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: #000000;
  font-weight: 500;
  z-index: 2;
}

.input-box {
  width: 307px;
  height: 64px;
  margin-top: 22px;
  background-color: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.code-input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  letter-spacing: 4px;
  outline: none;
  font-family: 'Inter', sans-serif;
}

.code-input::placeholder {
  font-size: 17px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.3);
  letter-spacing: 4px;
}

.actions {
  width: 330px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.btn {
  width: 162px;
  height: 44px;
  border-radius: 30px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-claim {
  background: linear-gradient(90deg, #4085e1 0%, #2757b7 100%);
}

.btn-home {
  background-color: #0cb300;
}

@media (max-width: 360px) {
  .card {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
  }

  .input-box, .actions {
    width: 100%;
  }

  .btn {
    width: 48%;
  }
}
</style>
