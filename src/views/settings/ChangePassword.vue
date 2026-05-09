<template>
  <div class="app-container">
    <header class="app-header">
      <button class="btn-back" @click="goBack" aria-label="Go back">
        <img src="/assets/image/13_655.svg" alt="Back icon">
      </button>
      <h1 class="header-title">Change password</h1>
    </header>

    <main class="app-content">
      <form class="password-form" @submit.prevent="handleChangePassword">
        <div class="input-group">
          <label for="verificationCode">Verification code</label>
          <input type="text" id="verificationCode" v-model="form.oldPassword" placeholder="Please request code verification from customer service">
        </div>

        <div class="input-group">
          <label for="newPassword">Set new password</label>
          <input type="password" id="newPassword" v-model="form.newPassword" placeholder="Please input your new password">
        </div>

        <div class="input-group">
          <label for="confirmPassword">Confirmation new password</label>
          <input type="password" id="confirmPassword" v-model="form.confirmPassword" placeholder="Please input again your new password">
        </div>

        <p class="form-warning">Please double-check all your passwords before resetting!</p>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Processing...' : 'Submit' }}
        </button>
      </form>
    </main>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <SuccessModal v-model="showSuccessModal" :message="successMessage" @close="handleSuccessClose" />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'

const router = useRouter()

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const phone = ref('')
const loading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

const goBack = () => {
  router.back()
}

const fetchUserInfo = async () => {
  try {
    const response = await authAPI.getAccountInfo()
    const data = response.data
    if (data.phone) {
      phone.value = data.phone
    }
  } catch (_) {}
}

const handleChangePassword = async () => {
  if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
    errorMessage.value = 'All fields are required'
    showErrorModal.value = true
    return
  }

  if (form.newPassword !== form.confirmPassword) {
    errorMessage.value = 'New password and confirmation do not match'
    showErrorModal.value = true
    return
  }

  if (form.oldPassword === form.newPassword) {
    errorMessage.value = 'New password must be different from the verification code'
    showErrorModal.value = true
    return
  }

  if (!phone.value) {
    errorMessage.value = 'Failed to fetch user data. Please refresh the page.'
    showErrorModal.value = true
    return
  }

  loading.value = true
  try {
    const payload = {
      phone: phone.value,
      old_password: form.oldPassword,
      new_password: form.newPassword
    }

    await authAPI.resetPassword(payload)

    successMessage.value = 'Password changed successfully'
    showSuccessModal.value = true

    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (error) {
    const apiError = error.response?.data
    if (apiError && apiError.detail) {
      errorMessage.value = apiError.detail
    } else if (typeof apiError === 'string') {
      errorMessage.value = apiError
    } else {
      errorMessage.value = 'Failed to change password. Please check your input.'
    }
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}

const handleSuccessClose = () => {
  router.back()
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

h1, p {
  margin: 0;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 37px;
  width: 100%;
}

.btn-back {
  position: absolute;
  left: 0;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-back img {
  width: 20px;
  height: 20px;
  display: block;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  text-align: center;
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.password-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 100%;
}

.input-group label {
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 8px;
}

.input-group input {
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  padding: 14px 15px;
  font-size: 12px;
  color: #000000;
  font-family: 'Inter', sans-serif;
  width: 100%;
  outline: none;
  transition: background-color 0.2s ease;
}

.input-group input:focus {
  background-color: #ebebeb;
}

.input-group input::placeholder {
  color: rgba(0, 0, 0, 0.37);
}

.form-warning {
  font-size: 12px;
  color: #000000;
  margin-top: 17px;
  margin-bottom: 17px;
  line-height: 1.4;
}

.btn-submit {
  background-color: #1b46f5;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}

.btn-submit:hover {
  background-color: #1538c4;
}

.btn-submit:active {
  background-color: #102a96;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
