<template>
  <div
    v-if="visible"
    :class="['spinner-overlay', overlay ? 'is-overlay' : 'is-inline', containerClass]"
    aria-live="polite"
    aria-busy="true"
  >
    <div class="spinner-box">
      <div class="lds-spinner" aria-hidden="true">
        <div></div><div></div><div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div><div></div><div></div>
      </div>
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
.lds-spinner,
.lds-spinner div,
.lds-spinner div:after {
  box-sizing: border-box;
}

.lds-spinner {
  --spinner-size: 28px;
  color: #111111;
  display: inline-block;
  position: relative;
  width: var(--spinner-size);
  height: var(--spinner-size);
}

.lds-spinner div {
  transform-origin: calc(var(--spinner-size) / 2) calc(var(--spinner-size) / 2);
  animation: lds-spinner 1.2s linear infinite;
}

.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: calc(var(--spinner-size) * 0.04);
  left: calc(var(--spinner-size) * 0.46);
  width: calc(var(--spinner-size) * 0.08);
  height: calc(var(--spinner-size) * 0.22);
  border-radius: 20%;
  background: currentColor;
}

.lds-spinner div:nth-child(1) { transform: rotate(0deg); animation-delay: -1.1s; }
.lds-spinner div:nth-child(2) { transform: rotate(30deg); animation-delay: -1s; }
.lds-spinner div:nth-child(3) { transform: rotate(60deg); animation-delay: -0.9s; }
.lds-spinner div:nth-child(4) { transform: rotate(90deg); animation-delay: -0.8s; }
.lds-spinner div:nth-child(5) { transform: rotate(120deg); animation-delay: -0.7s; }
.lds-spinner div:nth-child(6) { transform: rotate(150deg); animation-delay: -0.6s; }
.lds-spinner div:nth-child(7) { transform: rotate(180deg); animation-delay: -0.5s; }
.lds-spinner div:nth-child(8) { transform: rotate(210deg); animation-delay: -0.4s; }
.lds-spinner div:nth-child(9) { transform: rotate(240deg); animation-delay: -0.3s; }
.lds-spinner div:nth-child(10) { transform: rotate(270deg); animation-delay: -0.2s; }
.lds-spinner div:nth-child(11) { transform: rotate(300deg); animation-delay: -0.1s; }
.lds-spinner div:nth-child(12) { transform: rotate(330deg); animation-delay: 0s; }

@keyframes lds-spinner {
  0% { opacity: 1; }
  100% { opacity: 0; }
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
