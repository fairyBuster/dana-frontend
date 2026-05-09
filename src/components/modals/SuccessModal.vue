<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="close">
      <div class="modal-card" role="dialog" aria-modal="true" @click.stop="close">
        <img src="/assets/image/check.png" alt="" class="modal-icon">
        <p class="modal-message">{{ message || 'Pendaftaran akun sudah selesai. Silakan masuk akun sekarang.' }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onDeactivated } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Informasi' },
  message: { type: String, default: 'Pendaftaran akun sudah selesai. Silakan masuk akun sekarang.' }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  emit('update:modelValue', false)
  emit('confirm')
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
  object-fit: contain;
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
