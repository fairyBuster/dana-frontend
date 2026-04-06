<template>
  <div v-if="visible" class="overlay" @click.self="close">
    <div class="info-card">
      <img src="/assets/images-asset/0688641a92b857c5de96f2824622e06c075d0a42.png" alt="G91 Logo" class="logo">
      
      <button class="action-btn">
        <span class="btn-text">Customer service</span>
      </button>
      
      <button class="action-btn">
        <span class="btn-text">Komunitas G91</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible']);

const close = () => {
  emit('update:visible', false);
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.info-card {
  width: 349px;
  height: 260px;
  background-color: #5d5d5d;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.logo {
  width: 79px;
  height: 79px;
  border-radius: 50px;
  object-fit: cover;
  margin-top: 13px;
  margin-bottom: 23px;
}

.action-btn {
  width: 309px;
  height: 54px;
  border-radius: 10px;
  background: linear-gradient(180deg, #EFD473 0%, #F6E291 100%);
  box-shadow: 0px 7px 4px 0px rgba(255, 255, 255, 0.25);
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  transition: transform 0.1s ease;
}

.action-btn:active {
  transform: scale(0.98);
}

.btn-text {
  color: #000000;
  font-size: 16px;
  font-weight: 700;
}
</style>
