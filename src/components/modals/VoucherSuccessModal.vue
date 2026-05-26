<template>
  <Teleport to="body">
    <div v-if="modelValue" class="voucher-overlay" @click.self="close">
      <div class="voucher-card" role="dialog" aria-modal="true">
      
        <div class="voucher-content">
          <div class="voucher-title">{{ title }}</div>
          <div class="voucher-amount">{{ formattedAmount }}</div>
        </div>
        <button type="button" class="voucher-btn" @click="close">Tutup</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { formatAppCurrency } from '@/utils/settings'

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
    default: 'Anda mendapatkan'
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

const formattedAmount = computed(() => {
  const val = Number(props.amount || 0)
  const num = Number.isFinite(val) ? val : 0
  return formatAppCurrency(num, { decimals: 0 })
})

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
.voucher-overlay {
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
  padding: 24px;
}

.voucher-card {
  width: 320px;
  background: #fdf5e6;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(243, 183, 63, 0.7);
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
}

.voucher-hero {
  display: flex;
  justify-content: center;
  padding: 16px 16px 0;
}

.voucher-hero-img {
  width: 84px;
  height: 84px;
  object-fit: contain;
}

.voucher-content {
  padding: 10px 22px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
}

.voucher-title {
  color: rgba(0, 0, 0, 0.82);
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  margin: 0;
}

.voucher-amount {
  color: #000000;
  font-size: 34px;
  font-weight: 800;
  line-height: 40px;
  letter-spacing: -0.5px;
}

.voucher-btn {
  width: 100%;
  height: 46px;
  background: linear-gradient(90deg, #F4C142 0%, #F8DD89 47%, #F5CA51 100%);
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.12s ease;
  padding: 0;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
}

.voucher-btn:active {
  transform: scale(0.98);
}
</style>
