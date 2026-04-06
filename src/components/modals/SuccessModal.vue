<template>
  <Teleport to="body">
    <div v-if="modelValue" class="notification-screen" @click="close">
      <div class="modal-card" @click.stop>
        <p class="modal-message">{{ message || 'Pendaftaran akun sudah selesai. Silakan masuk akun sekarang.' }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.notification-screen {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 16px;
}

.modal-card {
  width: 100%;
  max-width: 320px;
  background-color: #222222;
  border-radius: 10px;
 
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  padding: 20px 18px;
}

.modal-message {
  color: #ffffff;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  text-align: center;
}
</style>
