<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="close">
      <div class="modal-card" role="dialog" aria-modal="true" @click.stop="close">
        <div class="modal-icon">
          <div class="icon-circle">
            <div class="icon-x"></div>
          </div>
        </div>
        <p class="modal-message">{{ displayedMessage }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onDeactivated } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Informasi' },
  message: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const OFFLINE_MESSAGE = 'Jaringan Anda terputus. Segarkan halaman atau keluar akun untuk terhubung ulang.'

const displayedMessage = computed(() => {
  const raw = String(props.message || '').trim()
  if (!raw) return OFFLINE_MESSAGE

  const lower = raw.toLowerCase()
  const looksLikeNetwork =
    lower === 'network error' ||
    lower.includes('networkerror') ||
    lower.includes('err_network') ||
    lower.includes('failed to fetch') ||
    lower.includes('load failed') ||
    lower.includes('econnaborted') ||
    lower.includes('timeout') ||
    lower.includes('tidak mendapatkan koneksi') ||
    lower.includes('koneksi') && lower.includes('terputus') ||
    lower.includes('offline')

  return looksLikeNetwork ? OFFLINE_MESSAGE : raw
})

const close = () => {
  emit('update:modelValue', false)
}

onDeactivated(() => {
  if (props.modelValue) emit('update:modelValue', false)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.modal-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: calc(16px + env(safe-area-inset-top)) calc(16px + env(safe-area-inset-right)) calc(16px + env(safe-area-inset-bottom)) calc(16px + env(safe-area-inset-left));
}

.modal-card {
  width: 100%;
  max-width: 180px;
  background-color: #262626;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
  padding: 24px 16px;
  gap: 16px;
  cursor: pointer;
}

.modal-icon {
  width: 46px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-circle {
  width: 46px;
  height: 46px;
  background-color: transparent;
  border: 2px solid #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.icon-x {
  position: relative;
  width: 20px;
  height: 20px;
}

.icon-x::before,
.icon-x::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 2px;
  background-color: #ffffff;
  border-radius: 2px;
}

.icon-x::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.icon-x::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.modal-message {
  color: #ffffff;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  text-align: center;
  padding: 0;
}
</style>
