<template>
  <div v-if="modelValue" id="section-modal" @click.self="close">
    <div class="modal-container">
      <div class="card">
      

        <div class="card-header">
          <p class="description">Change your username</p>
        </div>

        <div class="input-box">
          <input
            ref="usernameInput"
            v-model="username"
            type="text"
            class="username-input"
            :placeholder="placeholder || 'Enter username'"
            @keyup.enter="submit"
          >
        </div>

        <div class="actions">
          <button class="btn btn-update" type="button" @click="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Processing...' : 'Update' }}
          </button>
          <button class="btn btn-back" type="button" @click="close" :disabled="isSubmitting">
            Back home
          </button>
        </div>
      </div>
    </div>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <SuccessModal v-model="showSuccessModal" :message="successMessage" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { authAPI } from '@/services/api'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import SuccessModal from '@/components/modals/AppSuccessModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  currentUsername: { type: String, default: '' },
  placeholder: { type: String, default: '---' }
})

const emit = defineEmits(['update:modelValue', 'success'])

const username = ref('')
const usernameInput = ref(null)
const isSubmitting = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

watch(() => props.modelValue, (val) => {
  if (val) {
    username.value = props.currentUsername
    setTimeout(() => {
      if (usernameInput.value) usernameInput.value.focus()
    }, 100)
  }
})

const close = () => {
  if (isSubmitting.value) return
  emit('update:modelValue', false)
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Failed to update username'
  
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  
  return 'Failed to update username'
}

const submit = async () => {
  if (isSubmitting.value) return
  showErrorModal.value = false
  errorMessage.value = ''
  showSuccessModal.value = false
  successMessage.value = ''

  const raw = String(username.value || '').trim()
  if (!raw) {
    errorMessage.value = 'Please enter a username first'
    showErrorModal.value = true
    return
  }
  
  if (raw === props.currentUsername) {
    close()
    return
  }

  isSubmitting.value = true
  try {
    await authAPI.updateProfile({ 
      username: raw 
    })
    
    successMessage.value = 'Success'
    showSuccessModal.value = true
    emit('success', raw)
    
    setTimeout(() => {
      emit('update:modelValue', false)
    }, 1500)
    
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#section-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #7d7d7d;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.modal-container {
  max-width: 412px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.card {
  position: relative;
  width: 343px;
  background-color: #f9f9fc;
  border-radius: 10px;
  padding-top: 17px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-img {
  position: absolute;
  top: -31px;
  left: 0;
  width: 125px;
  height: 117px;
  object-fit: contain;
  z-index: 1;
}

.card-header {
  width: 100%;
  padding-right: 0px;
  display: flex;
  justify-content: center;
}

.description {
  width: 100%;
  margin: 0;
  font-size: 18px;
  text-align: center;
  line-height: 1.4;
  color: #000000;
  font-weight: 500;
  z-index: 2;
}

.input-box {
  width: 307px;
  height: 64px;
  margin-top: 22px;
  background-color: #ffffff;
  border: 1px solid #ebebeb;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.username-input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  outline: none;
  font-family: 'Inter', sans-serif;
}

.username-input::placeholder {
  font-size: 17px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.3);
}

.actions {
  width: 330px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.btn {
  width: 162px;
  height: 44px;
  border-radius: 30px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-update {
  background: linear-gradient(90deg, #4085e1 0%, #2757b7 100%);
}

.btn-back {
  background-color: #0cb300;
}

@media (max-width: 360px) {
  .card {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
  }

  .input-box, .actions {
    width: 100%;
  }

  .btn {
    width: 48%;
  }
}
</style>
