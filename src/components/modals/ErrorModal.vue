<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="close">
      <div class="modal-card" role="dialog" aria-modal="true" @click.stop>
        <p class="modal-message">{{ message || 'Permintaan gagal, segarkan halaman' }}</p>
        <div class="modal-divider"></div>
        <button type="button" class="modal-btn" @click="close">Mengerti</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Informasi' },
  message: { type: String, default: 'Permintaan gagal, segarkan halaman' }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.modal-overlay {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 16px;
}

.modal-card {
  width: 100%;
  max-width: 320px;
  background-color: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
}

.modal-message {
  color: #000000;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  text-align: center;
  padding: 22px 20px;
}

.modal-divider {
  height: 1px;
  width: 100%;
  background-color: #e6e6e6;
}

.modal-btn {
  width: 100%;
  height: 48px;
  background: transparent;
  border: none;
  color: #004d43;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}

.modal-btn:active {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
