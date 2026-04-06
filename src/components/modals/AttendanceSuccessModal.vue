<template>
  <Teleport to="body">
    <div v-if="modelValue" class="notification-screen" @click.self="close">
      <div class="modal-card">
        <div class="modal-content">
          <h2 class="modal-title">Informasi</h2>
          <img
            src="/assets/image/image 10.png"
            alt="Red Envelope"
            class="modal-image"
          >
          <p class="modal-message">Menghadiri konservasi</p>
          <p class="modal-amount">Rp {{ formattedAmount }}</p>
        </div>
        <button class="modal-footer-btn" @click="close">
          <span class="btn-text">Tutup</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  amount: {
    type: [Number, String],
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const formattedAmount = computed(() => {
  let raw = props.amount
  if (raw && typeof raw === 'object') {
    raw = raw.amount ?? raw.value ?? raw.reward ?? raw.bonus_amount ?? raw.bonus ?? raw.total ?? 0
  }
  if (raw === null || raw === undefined || raw === '') return '0,00'
  let s = String(raw).trim()
  if (!s) return '0,00'
  s = s.replace(/\s+/g, '').replace(/[^0-9,.-]/g, '')
  const dots = (s.match(/\./g) || []).length
  const commas = (s.match(/,/g) || []).length
  if (dots > 0 && commas > 0) {
    const lastDot = s.lastIndexOf('.')
    const lastComma = s.lastIndexOf(',')
    const decimalSep = lastDot > lastComma ? '.' : ','
    const groupSep = decimalSep === '.' ? ',' : '.'
    s = s.split(groupSep).join('')
    if (decimalSep === ',') s = s.replace(',', '.')
  } else if (dots > 1 && commas === 0) {
    s = s.split('.').join('')
  } else if (commas > 1 && dots === 0) {
    s = s.split(',').join('')
  } else if (commas === 1 && dots === 0) {
    const idx = s.indexOf(',')
    const digitsAfter = s.length - idx - 1
    if (digitsAfter === 3) {
      s = s.replace(',', '')
    } else {
      s = s.replace(',', '.')
    }
  } else if (dots === 1 && commas === 0) {
    const idx = s.indexOf('.')
    const digitsAfter = s.length - idx - 1
    if (digitsAfter === 3) {
      s = s.replace('.', '')
    }
  }
  const val = Number(s)
  const safe = Number.isFinite(val) ? val : 0
  return safe.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.notification-screen {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  width: 291px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
}

.modal-content {
  padding: 20px 27px 20px 27px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.modal-title {
  color: #555555;
  font-size: 18px;
  font-weight: 600;
  line-height: 30px;
  margin: 0 0 10px 0;
}

.modal-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin: 8px 0 12px 0;
}

.modal-message {
  color: #343434;
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
}

.modal-amount {
  color: #343434;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
  margin: 0;
}

.modal-footer-btn {
  width: 100%;
  height: 60px;
  background-color: #7fa586;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  padding: 0;
}

.modal-footer-btn:hover {
  background-color: #6e9175;
}

.btn-text {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  line-height: 30px;
}
</style>
