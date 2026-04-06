<template>
  <div v-if="modelValue" id="section-redeem-modal" @click.self="close">
    <div class="redeem-container">
      <div class="modal-card">
        <!-- Close Icon -->
        <button class="close-btn" aria-label="Close modal" @click="close">
          <img src="/assets/images-asset/41_216.svg" alt="Close">
        </button>

        <!-- Illustration -->
        <div class="illustration-wrapper">
          <img src="/assets/images-asset/72dd3d79e11255878a1c5e3d16e647a8cbd16019.png" alt="Redeem Illustration" class="illustration-img">
        </div>

        <!-- Text Content -->
        <div class="text-content">
          <h2 class="modal-title">Tebus kode disini untuk mendapatkan uang</h2>
          <p class="input-trigger" @click="focusInput">{{ code || placeholder || 'masukkan disini' }}</p>
          <input 
            ref="codeInput"
            v-model="code"
            type="text"
            class="hidden-input"
            :placeholder="placeholder || 'masukkan disini'"
          >
        </div>

        <!-- Action Button -->
        <button class="action-btn" @click="submit">
          Tebus
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Enter voucher code' },
  placeholder: { type: String, default: 'masukkan disini' },
  submitText: { type: String, default: 'Tebus' }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const code = ref('')
const codeInput = ref(null)

watch(() => props.modelValue, (val) => {
  if (val) code.value = ''
})

const close = () => emit('update:modelValue', false)
const submit = () => emit('submit', code.value)

const focusInput = () => {
  if (codeInput.value) {
    codeInput.value.focus()
  }
}
</script>

<style scoped>
/* CSS for section section:RedeemModal */
/* Section Container */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}

img {
  display: block;
  max-width: 100%;
}

button {
  font-family: inherit;
  border: none;
  cursor: pointer;
}
  #section-redeem-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(63, 63, 63, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .redeem-container {
    width: 100%;
    max-width: 412px; /* Based on Figma root frame width */
    position: relative;
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  /* Modal Card */
  .modal-card {
    background-color: #ffffff;
    border-radius: 10px;
    width: 364px;
    position: relative;
    padding: 14px 0 28px 0; /* Top padding aligns with image/close button, bottom padding for spacing */
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  /* Close Button */
  .close-btn {
    position: absolute;
    top: 14px;
    right: 25px;
    background: none;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
  }

  /* Illustration */
  .illustration-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: -10px; /* Adjusting for visual overlap/spacing seen in design */
    z-index: 1;
  }

  .illustration-img {
    width: 204px;
    height: 176px;
    object-fit: contain;
  }

  /* Text Content */
  .text-content {
    text-align: center;
    width: 100%;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
  }

  .modal-title {
    font-size: 14px; /* Estimated based on 44px height for 2 lines */
    font-weight: 400;
    color: #000000;
    margin: 0 0 7px 0;
    width: 230px;
    line-height: 1.5;
  }

  .input-trigger {
    font-size: 12px;
    font-weight: 700;
    color: #000000;
    text-decoration: underline;
    margin: 0 0 24px 0;
    cursor: pointer;
  }

  /* Action Button */
  .action-btn {
    width: 343px;
    height: 48px;
    border-radius: 30px;
    /* Gradient from Figma: #EFD473 to #F6E291 */
    background: linear-gradient(90deg, #EFD473 0%, #F6E291 100%);
    color: #000000;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
  }

  .action-btn:hover {
    opacity: 0.9;
  }

  /* Hidden Input Field */
  .hidden-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  /* Responsive Adjustments */
  @media (max-width: 380px) {
    .modal-card {
      width: 100%;
    }
    
    .action-btn {
      width: 90%;
    }
    
    .close-btn {
      right: 15px;
    }
  }
</style>