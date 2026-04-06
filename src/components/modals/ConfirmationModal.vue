<template>
  <Teleport to="body">
    <div v-if="modelValue" class="notification-screen">
      <div class="modal-card">
        <div class="modal-content">
          <p class="modal-message">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="modal-footer-btn cancel" @click="close">
            <span class="btn-text">Batal</span>
          </button>
          <div class="divider"></div>
          <button class="modal-footer-btn confirm" @click="confirm">
            <span class="btn-text">Ya</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, default: 'Apa Anda menyetujui melakukan pembelian aset ini?' }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

/* Screen Container */
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

/* Modal Card */
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

/* Modal Content Area */
.modal-content {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.modal-message {
  color: #888888;
  font-size: 15px;
  line-height: 1.5;
  width: 100%;
  margin: 0;
}

/* Modal Footer */
.modal-footer {
  display: flex;
  width: 100%;
  height: 50px;
  border-top: 1px solid #eeeeee;
}

.modal-footer-btn {
  flex: 1;
  background-color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  padding: 0;
}

.modal-footer-btn:hover {
  background-color: #f9f9f9;
}

.divider {
  width: 1px;
  background-color: #eeeeee;
}

.btn-text {
  color: #000000;
  font-size: 16px;
  font-weight: 400;
}
</style>