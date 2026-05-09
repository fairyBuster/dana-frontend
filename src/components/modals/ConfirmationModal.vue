<template>
  <Teleport to="body">
    <div v-if="modelValue" class="notification-screen">
      <div class="modal-container">
        <p class="modal-description">
          {{ message }}
        </p>

        <div v-if="amount" class="price-box">
          <span class="price-text">{{ amount }}</span>
        </div>

        <div class="button-group">
          <button class="btn btn-confirm" @click="confirm">Confirm</button>
          <button class="btn btn-back" @click="close">Back home</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  message: { type: String, default: 'You are about to activate this cloud product. Please confirm to continue with the purchase.' },
  amount: { type: String, default: '' }
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
* {
  box-sizing: border-box;
}

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
  padding: 20px;
}

.modal-container {
  background-color: #f9f9fc;
  border-radius: 10px;
  width: 100%;
  max-width: 343px;
  padding: 21px 8px 20px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.15);
}

.modal-description {
  color: #000000;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0 0 18px 0;
  max-width: 326px;
  font-family: 'Inter', sans-serif;
}

.price-box {
  background-color: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 5px;
  width: 100%;
  max-width: 307px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 20px 0;
}

.price-text {
  color: #000000;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.button-group {
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 328px;
  justify-content: center;
}

.btn {
  flex: 1;
  height: 44px;
  border-radius: 30px;
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease, transform 0.1s ease;
  font-family: 'Inter', sans-serif;
}

.btn:hover {
  opacity: 0.9;
}

.btn:active {
  transform: scale(0.98);
}

.btn-confirm {
  background: linear-gradient(90deg, rgba(64, 133, 225, 1) 0%, rgba(39, 87, 183, 1) 100%);
}

.btn-back {
  background-color: #0cb300;
}

@media (max-width: 360px) {
  .modal-container {
    padding: 24px 16px;
  }

  .button-group {
    flex-direction: column;
    gap: 12px;
  }

  .btn {
    width: 100%;
    max-width: none;
  }
}
</style>
