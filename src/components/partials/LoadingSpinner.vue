<template>
  <div
    v-if="visible"
    :class="['spinner-overlay', overlay ? 'is-overlay' : 'is-inline', containerClass]"
    aria-live="polite"
    aria-busy="true"
  >
    <div class="spinner-box">
      <div class="custom-loader"></div>
      <p v-if="message" class="spinner-message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { toRefs, defineProps } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: true },
  overlay: { type: Boolean, default: true },
  containerClass: { type: String, default: '' },
  message: { type: String, default: '' }
})

const { visible, overlay, containerClass, message } = toRefs(props)
</script>

<style scoped>
.spinner-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.is-overlay {
  position: fixed;
  inset: 0;
  background-color: transparent;
  z-index: 1050;
  display: grid;
  place-items: center;
}

.is-inline {
  position: relative;
  min-height: 60px;
}

.spinner-box {
  background-color: #222222;
  border-radius: 10px;

  width: 250px;
  max-width: 180px;
  min-height: 60px;
  padding: 18px 20px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.custom-loader {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  padding: 3px;
  background:
    conic-gradient(from 135deg at top, #ffffff 90deg, #0000 0) 0 calc(50% - 2px) / 8.5px 4.25px,
    radial-gradient(farthest-side at bottom left, #0000 calc(100% - 3px), #ffffff calc(100% - 2.5px) 99%, #0000) top right / 50% 50% content-box content-box,
    radial-gradient(farthest-side at top, #0000 calc(100% - 3px), #ffffff calc(100% - 2.5px) 99%, #0000) bottom / 100% 50% content-box content-box;
  background-repeat: no-repeat;
  animation: s1 1s infinite linear;
}

.spinner-message {
  margin: 0;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  font-weight: 500;
}

@keyframes s1 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
