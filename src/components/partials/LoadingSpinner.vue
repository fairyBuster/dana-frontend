<template>
  <div
    v-if="visible"
    :class="['spinner-overlay', overlay ? 'is-overlay' : 'is-inline', containerClass]"
    aria-live="polite"
    aria-busy="true"
  >
    <div class="spinner-box">
      <div class="custom-loader" aria-hidden="true"></div>
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
.custom-loader {
  width: 50px;
  height: 50px;
  display: grid;
}

.custom-loader::before,
.custom-loader::after {
  content: "";
  grid-area: 1 / 1;
  --c: radial-gradient(farthest-side, #766DF4 92%, #0000);
  background:
    var(--c) 50% 0,
    var(--c) 50% 100%,
    var(--c) 100% 50%,
    var(--c) 0 50%;
  background-size: 12px 12px;
  background-repeat: no-repeat;
  animation: s2 1s infinite;
}

.custom-loader::before {
  margin: 4px;
  filter: hue-rotate(45deg);
  background-size: 8px 8px;
  animation-timing-function: linear;
}

@keyframes s2 {
  100% { transform: rotate(.5turn); }
}

.spinner-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.is-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.18);
  z-index: 1050;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.is-inline {
  position: relative;
  min-height: 60px;
}

.spinner-box {
  background: linear-gradient(180deg, #FEFDFE 0%, #FDF8EA 100%);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;

  width: 180px;
  max-width: 180px;
  min-height: 150px;
  padding: 14px 16px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  pointer-events: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.spinner-message {
  margin: 0;
  font-size: 10px;
  line-height: 1.2;
  color: #111111;
  text-align: center;
  font-weight: 400;
}
</style>
