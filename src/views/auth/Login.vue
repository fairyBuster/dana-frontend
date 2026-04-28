<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <header class="top-header">
        <button class="back-btn" @click.prevent="router.push('/')" aria-label="Go back">
          <img src="/assets/images/8_74.svg" alt="Back Icon">
        </button>
        <router-link to="/register" class="register-link">Buat akun</router-link>
      </header>
    </section>

    <!-- Hero Section -->
    <section id="section-hero">
      <div class="hero-content">
        <h1 class="page-title">Masuk ke TRIVEX</h1>
        <p class="page-subtitle">Gunakan nomor telepon dan kata sandi yang terdaftar untuk masuk ke akun Anda.</p>
      </div>
    </section>

    <!-- Form Section -->
    <section id="section-form">
      <form class="login-form" @submit.prevent="handleLogin">
        
        <!-- Phone Input -->
        <div class="form-group">
          <label for="phone">Telepon</label>
          <div class="input-container">
            <span class="input-prefix">(+62)</span>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.phone"
              placeholder="Masukkan nomor telepon"
              @blur="checkPhoneError"
              @focus="clearPhoneError"
            >
          </div>
        </div>

        <!-- Password Input -->
        <div class="form-group">
          <label for="password">Kata sandi</label>
          <div class="input-container">
            <input 
              :type="passwordFieldType" 
              id="password" 
              v-model="formData.password"
              placeholder="Masukkan kata sandi"
            >
            <button type="button" class="suffix-btn" @click="togglePasswordVisibility" aria-label="Toggle password visibility">
              <img 
                :src="passwordFieldType === 'password' ? '/assets/images/8_54.svg' : '/assets/images/8_56.svg'" 
                alt="Eye Icon"
              >
            </button>
          </div>
        </div>

        <!-- Captcha Input -->
        <div class="form-group">
          <label for="captcha">Captcha</label>
          <div class="input-container">
            <input 
              type="text" 
              id="captcha" 
              v-model="formData.captcha"
              placeholder="Masukkan kode captcha"
            >
            <button type="button" class="text-action-btn" @click="refreshCaptcha" aria-label="Refresh captcha">
              Minta kode
            </button>
          </div>
        </div>

        <!-- Forgot Password Link -->
        <div class="forgot-password-container">
          <a href="#" class="forgot-password-link" @click.prevent="handleForgotPassword">Lupa kata sandi?</a>
        </div>

        <!-- Terms Checkbox -->
        <div class="terms-container">
          <div class="custom-checkbox" @click="isTermsAccepted = !isTermsAccepted">
            <img v-if="isTermsAccepted" src="/assets/images/I2011_1098_497_5178.svg" alt="Check">
          </div>
          <span class="terms-text">Pastikan Anda telah membaca keseluruhan <router-link to="/terms" class="terms-link">Syarat dan Ketentuan</router-link>, <router-link to="/privacy" class="terms-link">Kebijakan Privasi</router-link> sebelum melanjutkan pendaftaran</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-button" :disabled="isLoading">
          <LoadingSpinner v-if="isLoading" :visible="true" message="" />
          <span v-else>Mulai akun</span>
        </button>

      </form>
    </section>

    <!-- Modals -->
    <ErrorModal
      v-model="showErrorModal"
      :message="generalError"
    />
    <SuccessModal
      v-model="showSuccessModal"
      :message="successMessage"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../../services/api'
import ErrorModal from '../../components/modals/ErrorModal.vue'
import SuccessModal from '../../components/modals/SuccessModal.vue'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'

const router = useRouter()

const formData = reactive({
  phone: '',
  password: '',
  captcha: ''
})

const passwordFieldType = ref('password')
const isLoading = ref(false)
const successMessage = ref('')
const generalError = ref('')
const showErrorModal = ref(false)
const showSuccessModal = ref(false)
const isPhoneError = ref(false)
const isTermsAccepted = ref(false)
const generatedCaptcha = ref('')

const refreshCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i += 1) {
    out += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  generatedCaptcha.value = out
  formData.captcha = out
}

const checkPhoneError = () => {
  if (!formData.phone.trim()) {
    isPhoneError.value = true
  }
}

const clearPhoneError = () => {
  isPhoneError.value = false
}

const togglePasswordVisibility = () => {
  if (passwordFieldType.value === 'password') {
    passwordFieldType.value = 'text'
  } else {
    passwordFieldType.value = 'password'
  }
}

let notificationTimer = null

const showCustomerServiceNotification = () => {
  generalError.value = 'Instruksi pemulihan akun oleh layanan pelanggan. Silakan periksa.'
  showErrorModal.value = true

  if (notificationTimer) clearTimeout(notificationTimer)
  notificationTimer = setTimeout(() => {
    showErrorModal.value = false
    notificationTimer = null
  }, 1800)
}

const handleForgotPassword = () => {
  showCustomerServiceNotification()
}

const handleLogin = async () => {
  successMessage.value = ''
  generalError.value = ''
  
  // Basic validation
  if (!formData.phone.trim()) {
    generalError.value = 'Nomor ponsel harus diisi'
    showErrorModal.value = true
    return
  }
  
  if (!formData.password) {
    generalError.value = 'Kata sandi harus diisi'
    showErrorModal.value = true
    return
  }

  if (!generatedCaptcha.value) {
    generalError.value = 'Silakan tekan "Minta kode" untuk mendapatkan captcha'
    showErrorModal.value = true
    return
  }

  if (!String(formData.captcha || '').trim()) {
    generalError.value = 'Minta kode captcha'
    showErrorModal.value = true
    return
  }

  if (String(formData.captcha).trim().toUpperCase() !== String(generatedCaptcha.value).toUpperCase()) {
    generalError.value = 'Captcha tidak sesuai'
    showErrorModal.value = true
    return
  }

  if (!isTermsAccepted.value) {
    generalError.value = 'Harap setujui Syarat dan Ketentuan serta Kebijakan Privasi.'
    showErrorModal.value = true
    return
  }

  isLoading.value = true
  
  try {
    let phoneNumber = formData.phone.trim()
    
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber.replace(/[^\d]/g, '')
      if (!phoneNumber) {
        generalError.value = 'Nomor ponsel harus berupa angka'
        showErrorModal.value = true
        return
      }
      if (phoneNumber.startsWith('0')) phoneNumber = phoneNumber.substring(1)
      phoneNumber = `+62${phoneNumber}`
    }
    
    const payload = { 
      phone: phoneNumber, 
      password: formData.password 
    }

    const response = await authAPI.login(payload)

    // Extract token from response
    const data = response?.data || {}
    const headerAuth = response?.headers?.authorization || response?.headers?.Authorization
    let token = data.token || data.key || data.auth_token || data.access || data.access_token
    if (!token && typeof headerAuth === 'string') {
      const parts = headerAuth.split(/\s+/)
      token = parts.length > 1 ? parts.pop() : headerAuth
    }

    if (!token) {
      generalError.value = 'Token not found in response'
      showErrorModal.value = true
      return
    }

    // Save token to localStorage
    try {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_scheme', 'Bearer')
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh)
      }
    } catch (error) {
      console.error('Error saving token:', error)
    }
    
    successMessage.value = 'Login berhasil! Selamat datang kembali di TRIVEX.'
    showSuccessModal.value = true
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (error) {
    const status = error.response?.status
    const errorData = error.response?.data
    const pickErrorText = (v) => {
      if (!v) return ''
      if (typeof v === 'string') return v
      if (Array.isArray(v) && v.length) return String(v[0] ?? '')
      if (typeof v === 'object') {
        if (v.detail) return pickErrorText(v.detail)
        if (v.message) return pickErrorText(v.message)
        if (v.error) return pickErrorText(v.error)
        const keys = Object.keys(v)
        if (keys.length) return pickErrorText(v[keys[0]])
      }
      return String(v)
    }
    const serverText = pickErrorText(errorData).trim()
    const serverTextLower = serverText.toLowerCase()
    
    // Default error
    let msg = 'Akun tidak ditemukan. Silakan lakukan pendaftaran terlebih dahulu.'
      if (!error.response) {
      msg = 'Tidak mendapatkan koneksi. Silakan periksa koneksi Anda dan coba beberapa saat lagi.'
    }

    if (status === 401) {
      if (serverTextLower.includes('please provide both phone and password')) {
        msg = 'Silakan isi nomor ponsel dan kata sandi.'
      } else if (serverTextLower.includes('invalid phone number or password')) {
        msg = 'Username/nomor atau password tidak sesuai. Silakan coba lagi.'
      } else if (serverTextLower.includes('user account is disabled')) {
        msg = 'Akun Anda sementara dibatasi. Silakan hubungi layanan pelanggan.'
      } else if (serverTextLower.includes('user is banned')) {
        msg = 'Akun Anda diblokir. Silakan hubungi layanan pelanggan.'
      } else if (serverTextLower.includes('user account is locked')) {
        msg = 'Akun Anda terkunci. Silakan coba lagi beberapa saat lagi atau hubungi layanan pelanggan.'
      } else if (serverTextLower.includes('user account is expired')) {
        msg = 'Akun Anda sudah kedaluwarsa. Silakan hubungi layanan pelanggan.'
      } else if (serverTextLower.includes('user credentials are expired')) {
        msg = 'Kredensial akun Anda sudah kedaluwarsa. Silakan lakukan pemulihan akun atau hubungi Customer Service.'
      } else {
        msg = serverText || 'Nomor ponsel atau kata sandi tidak sesuai. Silakan coba lagi.'
      }
    } else if (status === 404) {
      msg = 'Akun tidak ditemukan. Silakan lakukan pendaftaran terlebih dahulu.'
    } else if (status === 429 || serverTextLower.includes('throttle') || serverTextLower.includes('limit')) {
      msg = 'Terlalu banyak percobaan login yang gagal. Silakan coba kembali beberapa saat lagi.'
    } else if (status === 400) {
      if (serverTextLower.includes('please provide both phone and password')) {
        msg = 'Silakan isi username/nomor dan password.'
      } else if (serverTextLower.includes('invalid phone number or password')) {
        msg = 'Username/nomor atau password tidak sesuai. Silakan coba lagi.'
      } else {
        msg = serverText || msg
      }
    }

    generalError.value = msg
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

onBeforeUnmount(() => {
  if (notificationTimer) clearTimeout(notificationTimer)
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
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

a {
  text-decoration: none;
}

input {
  font-family: inherit;
}

/* Header Section */
#section-header {
  min-height: auto;
}

.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  height: 41px;
  margin-left: -10px;
}

.back-btn img {
  width: 34px;
  height: 34px;
}

.register-link {
  color: #4ca455;
  font-size: 17px;
  font-weight: 700;
}

/* Hero Section */
#section-hero {
  min-height: auto;
}

.hero-content {
  padding: 10px 20px 10px 20px;
}

.page-title {
  color: #000000;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.2;
}

.page-subtitle {
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.5;
  opacity: 0.8;
}

/* Form Section */
#section-form {
  flex: 1;
}

.login-form {
  padding: 0 20px 40px 20px;
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.form-group label {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

.input-container {
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.21);
  border-radius: 10px;
  padding: 14px 16px;
  background-color: transparent;
  gap: 10px;
  transition: border-color 0.2s ease;
  height: 45px;
}

.input-container:focus-within {
  border-color: #004d43;
}

.input-container input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #000000;
  outline: none;
  width: 100%;
}

.input-container input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.input-prefix {
  font-size: 14px;
  color: #000000;
  font-weight: 600;
  white-space: nowrap;
}

.suffix-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suffix-btn img {
  width: 20px;
  height: 20px;
}

.text-action-btn {
  background: none;
  border: none;
  color: #000000;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
}

.forgot-password-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
  margin-bottom: 24px;
}

.forgot-password-link {
  color: #004d43;
  font-size: 12px;
  font-weight: 700;
}

/* Terms Container */
.terms-container {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  background-color: #004d43;
  border-radius: 5.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
}

.custom-checkbox img {
  width: 10px;
  height: 10px;
}

.terms-text {
  font-size: 10px;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.5;
}

.terms-link {
  color: #004d43;
  font-weight: 900;
}

/* Submit Button */
.submit-button {
  width: 100%;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s ease;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover {
  background-color: #003831;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>


