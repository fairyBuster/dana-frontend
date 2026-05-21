<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="close">
      <div class="modal-card" role="dialog" aria-modal="true" @click.stop>
        <img src="/assets/images/6d25aa7241ebdc9bae19772ad0bb54aa2fb6ef3d.png" alt="" class="modal-image">
        <p class="modal-text">{{ displayedMessage }}</p>
        <button class="modal-button" @click="close">Tutup</button>
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

const OFFLINE_MESSAGE = 'Segarkan halaman atau masuk kembali'

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
.modal-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(99, 95, 95, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.modal-card {
  width: 276px;
  background-color: #fefefe;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 29px 18px 17px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-image {
  width: 106px;
  height: 75px;
  object-fit: contain;
}

.modal-text {
  margin: 13px 0 0 0;
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  line-height: 1.4;
}

.modal-button {
  margin-top: 16px;
  width: 100%;
  height: 39px;
  background-color: #f4bd40;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  transition: background-color 0.2s ease;
}

.modal-button:hover {
  background-color: #e0a830;
}
</style>
