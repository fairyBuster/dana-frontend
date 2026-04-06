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
  max-width: 320px;
  min-height: 86px;
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
  display: grid;
  border-radius: 50%;
  -webkit-mask:radial-gradient(farthest-side,#0000 40%,#000 41%);
  background:
    linear-gradient(0deg ,#F0ECF480 50%,#F0ECF4FF 0) center/2px 100%,
    linear-gradient(90deg,#F0ECF440 50%,#F0ECF4BF 0) center/100% 2px;
  background-repeat: no-repeat;
  animation: s3 1s infinite steps(12);
}
.custom-loader::before,
.custom-loader::after {
  content: "";
  grid-area: 1/1;
  border-radius: 50%;
  background: inherit;
  opacity: 0.915;
  transform: rotate(30deg);
}

.custom-loader::after {
  opacity: 0.83;
  transform: rotate(60deg);
}

.spinner-message {
  margin: 0;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  font-weight: 500;
}

@keyframes s3 {
  100% { transform: rotate(1turn) }
}
</style>
