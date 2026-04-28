<template>
  <Teleport to="body">
    <div v-if="modelValue" class="notification-screen" @click.self="close">
      <div class="modal-card">
        <div class="modal-content">
          <h2 class="modal-title">{{ title || 'Parabéns pela conquista' }}</h2>
          <img src="/assets/images/da4151be78469acf27cc0da4d60d3f5fcefd602d.png" alt="Diamond" class="modal-image">
          <p class="modal-amount">Rp {{ formattedAmount }}</p>
        </div>
      
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
  },
  title: {
    type: String,
    default: 'Parabéns pela conquista'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const formattedAmount = computed(() => {
  const val = Number(props.amount || 0)
  const num = Number.isFinite(val) ? val : 0
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num)
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
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  width: 292px;
  background: linear-gradient(180deg, rgba(26, 31, 58, 0.98) 0%, rgba(11, 13, 30, 0.98) 100%);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
}

.modal-content {
  padding: 18px 22px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.modal-title {
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  margin: 0;
}

.modal-image {
  width: 34px;
  height: 34px;
  object-fit: contain;
  margin: 0;
}

.modal-amount {
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  margin: 0;
}

.modal-footer-btn {
  width: 100%;
  height: 44px;
  background: rgba(162, 150, 255, 0.55);
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  padding: 0;
  color: rgba(255, 255, 255, 0.95);
  font-size: 13px;
  font-weight: 500;
}

.modal-footer-btn:hover {
  background: rgba(162, 150, 255, 0.7);
}
</style>
