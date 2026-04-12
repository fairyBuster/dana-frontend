<template>
  <div class="main-container">
    <!-- Header Section -->
    <section id="section-header" class="app-header-section">
      <button class="back-btn" @click.prevent="router.push('/')">
        <img src="/assets/image/40_280.svg" alt="Back" width="24" height="24">
        <span>Kembali ke beranda</span>
      </button>
    </section>

    <!-- Login Card Section -->
    <section id="section-login-card" class="login-card-section">
      <div class="login-card">
        <!-- Logo -->
        <div class="card-logo">
          <img src="/assets/image/983276.png" alt="Ot-Sent Logo">
        </div>

        <!-- Title & Subtitle -->
        <h1 class="card-title">Masuk ke Area Pengguna</h1>
        <p class="card-subtitle">Masuk untuk mengakses area pengguna, pemetaan, monitoring, dan analisis data berbasis drone secara real-time.</p>

        <!-- Form -->
        <form class="login-form" @submit.prevent="handleLogin">
          <!-- Phone Input -->
          <div class="form-group">
            <label>Nomor ponsel terdaftar</label>
            <div class="input-wrapper phone-input">
              <div class="country-code" @click="showCountrySelector = true">
                <span>+{{ selectedCountry.dialCode }}</span>
                <img src="/assets/image/89_1312.svg" alt="Select" width="10" height="11">
              </div>
              <input 
                v-model="formData.phone" 
                type="tel" 
                placeholder="Silakan masukkan ponsel Anda"
                @blur="checkPhoneError"
                @focus="clearPhoneError"
              >
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label>Kata sandi</label>
            <div class="input-wrapper password-input">
              <input 
                v-model="formData.password" 
                :type="passwordFieldType" 
                placeholder="Silakan masukkan kata sandi Anda"
              >
              <button type="button" class="eye-icon" @click="togglePasswordVisibility">
                <img 
                  :src="passwordFieldType === 'password' ? '/assets/image/40_290.svg' : '/assets/image/40_291.svg'" 
                  alt="Show Password" 
                  width="26" 
                  height="26"
                >
              </button>
            </div>
          </div>

          <!-- Checkbox -->
          <div class="checkbox-group">
            <div class="custom-checkbox">
              <input type="checkbox" id="terms" v-model="isTermsAccepted">
              <label for="terms">
                <div class="checkbox-box">
                  <span v-if="isTermsAccepted" class="checkbox-check"></span>
                </div>
              </label>
            </div>
            <label for="terms" class="checkbox-label">
              Saya menyetujui <a href="#/pages/account/terms" class="terms-link">Syarat dan Ketentuan</a> serta <a href="#/pages/account/privacy" class="terms-link">Kebijakan Privasi</a> SENT.
            </label>
          </div>

          <!-- Submit & Links -->
          <div class="action-group">
            <div class="links-left">
              <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">Lupa kata sandi?</a>
              <div class="register-prompt">
                <span>Belum memiliki akun?</span>
                <router-link to="/pages/account/register" class="register-link">
                  Daftar sekarang
                  <img src="/assets/image/40_465.svg" alt="Arrow" width="24" height="24">
                </router-link>
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="isLoading">
              <LoadingSpinner v-if="isLoading" :visible="true" message="" />
              <span v-else>Masuk</span>
            </button>
          </div>
        </form>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Footer Notes -->
        <div class="card-footer-notes">
          <p>Akses hanya diperuntukkan bagi pengguna terdaftar. Aktivitas masuk dapat dicatat untuk tujuan keamanan sistem.</p>
          <p class="platform-desc">SENT adalah platform teknologi untuk pemetaan udara, monitoring dan analisis data berbasi drone.</p>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="section-footer" class="footer-section">
      <div class="footer-content">
        <span class="link-header">Others</span>
        <div class="footer-links">
          <router-link to="/pages/account/terms">Terms of Service</router-link>
          <router-link to="/pages/account/cookie">Cookie Policy</router-link>
          <router-link to="/pages/account/help">Help Center</router-link>
          <router-link to="/pages/account/career">Karir</router-link>
          <router-link to="/pages/account/privacy">Privacy Policy</router-link>
          <router-link to="/pages/account/media">Press / Media</router-link>
          <router-link to="/pages/account/solution">Produk & Solusi</router-link>
        </div>

        <div class="footer-brand">
          <div class="brand-row">
            <img src="/assets/image/983276.png" alt="Ot-Sent" class="footer-logo">
            <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
          </div>
          <p class="tagline">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        </div>
      </div>
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
    <CountrySelector
      :show="showCountrySelector"
      :selectedCountry="selectedCountry"
      @update:show="showCountrySelector = $event"
      @select="handleSelectCountry"
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
import CountrySelector from '../../components/CountrySelector.vue'

const router = useRouter()

const formData = reactive({
  phone: '',
  password: ''
})

const captchaRef = ref(null)
const isCaptchaVerified = ref(true) // No captcha in new design
const passwordFieldType = ref('password')
const isLoading = ref(false)
const successMessage = ref('')
const generalError = ref('')
const showErrorModal = ref(false)
const showSuccessModal = ref(false)
const isPhoneError = ref(false)
const isTermsAccepted = ref(false)
const showCountrySelector = ref(false)
const selectedCountry = ref({ name: 'Indonesia', code: 'ID', dialCode: '62', flag: '🇮🇩' })

const checkPhoneError = () => {
  if (!formData.phone.trim()) {
    isPhoneError.value = true
  }
}

const clearPhoneError = () => {
  isPhoneError.value = false
}

const handleSelectCountry = (country) => {
  selectedCountry.value = country
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
  generalError.value = 'You must call Customer Service for a better service.'
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

  if (!isTermsAccepted.value) {
    generalError.value = 'Harap setujui Syarat dan Ketentuan serta Kebijakan Privasi SENT.'
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
      const dialCode = String(selectedCountry.value?.dialCode || '62')
      phoneNumber = `+${dialCode}${phoneNumber}`
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
      
      // Handle remember me functionality if needed
      if (rememberMe.value) {
        localStorage.setItem('saved_phone', formData.phone)
        localStorage.setItem('saved_password', formData.password)
      } else {
        localStorage.removeItem('saved_phone')
        localStorage.removeItem('saved_password')
      }
    } catch (error) {
      console.error('Error saving token:', error)
    }
    
    successMessage.value = 'Bem-vindo, por favor verifique seu voo'
    showSuccessModal.value = true
    setTimeout(() => {
      router.push('/pages/account/active')
    }, 1500)
  } catch (error) {
    const status = error.response?.status
    const errorData = error.response?.data
    const detail = errorData?.detail ? String(errorData.detail).toLowerCase() : ''
    const message = errorData?.message ? String(errorData.message).toLowerCase() : ''
    
    // Default error
    let msg = 'Nomor yang Anda masukkan belum terdaftar di sistem.Silakan periksa kembali atau lakukan pendaftaran akun baru.'
    if (!error.response) {
      msg = 'Tidak mendapatkan koneksi. Silakan periksa koneksi Anda dan coba beberapa saat lagi.'}

    if (status === 401) {
      if (errorData?.phone || detail.includes('not found') || detail.includes('tidak ditemukan') || detail.includes('user') || message.includes('not found')) {
        msg = 'Nomor yang Anda masukkan belum terdaftar di sistem. Silakan periksa kembali atau lakukan pendaftaran akun baru.'
      } else {
        msg = 'Kata sandi yang Anda masukkan tidak sesuai. Silakan periksa kembali dan coba lagi.'
      }
    } else if (status === 404) {
      msg = 'Nomor yang Anda masukkan belum terdaftar di sistem. Silakan periksa kembali atau lakukan pendaftaran akun baru.'
    } else if (status === 429 || detail.includes('throttle') || detail.includes('limit') || message.includes('limit')) {
      msg = 'Terlalu banyak percobaan login yang gagal. Silakan coba kembali beberapa saat lagi demi keamanan akun Anda.'
    } else if (status === 400) {
      if (errorData?.phone) {
        msg = 'Silakan lakukan pendaftaran. Nomor ponsel Anda belum memiliki akun.'
      } else if (errorData?.password) {
        msg = 'Kata sandi yang Anda masukkan tidak sesuai. Silakan periksa kembali dan coba lagi.'
      } else if (detail) {
        // Check for specific keywords in detail if needed, otherwise fallback or show detail
        if (detail.includes('inactive') || detail.includes('tidak aktif')) {
             msg = 'Akun Anda belum aktif. Silakan aktifkan akun Anda melalui email yang terdaftar.'
        } else {
             // Use the specific message from backend if it's descriptive, 
             // but user wants specific texts. Let's try to map common ones.
             msg = errorData.detail || errorData.message || msg
        }
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
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

.main-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  position: relative;
  padding-bottom: 40px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #0f0b2e;
  background-image: url('/assets/image/c8be2d7d65edfe8e1c48d73e2794025ee176da57.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Header Section */
.app-header-section {
  padding: 18px 9px;
  display: flex;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a6a6a6;
  font-size: 14px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.back-btn img {
  width: 24px;
  height: 24px;
}

/* Login Card Section */
.login-card-section {
  margin: 0 1px;
}

.login-card {
  margin: 0 17px;
  padding: 20px 15px;
  background: linear-gradient(180deg, rgba(15,11,46,1) 0%, rgba(43,27,111,1) 100%);
  border-radius: 10px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
}

.card-logo img {
  width: 148px;
  height: auto;
  margin-bottom: 10px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 10px 0;
  text-align: center;
}

.card-subtitle {
  font-size: 12px;
  color: #a6a6a6;
  text-align: center;
  line-height: 1.5;
  margin: 0 0 30px 0;
  max-width: 325px;
}

.login-form {
  width: 100%;
  max-width: 348px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 12px;
  margin-bottom: 8px;
  text-align: left;
  padding-left: 4px;
}

.input-wrapper {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 10px;
  height: 43px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  position: relative;
}

.phone-input {
  gap: 10px;
}

.country-code {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 14px;
  padding-right: 8px;
  border-right: 1px solid rgba(116, 106, 154, 0.3);
}

.country-code img {
  width: 10px;
  height: 11px;
}

.input-wrapper input {
  background: transparent;
  border: none;
  color: #fff;
  width: 100%;
  font-size: 13px;
  outline: none;
}

.input-wrapper input::placeholder {
  color: #505050;
}

.eye-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0;
  display: flex;
  background: none;
  border: none;
  cursor: pointer;
}

.eye-icon img {
  width: 26px;
  height: 26px;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 30px;
}

.custom-checkbox input {
  display: none;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  background-color: #6750a4;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.checkbox-check {
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-size: 11px;
  line-height: 1.4;
  color: #fff;
  flex: 1;
  cursor: pointer;
}

.action-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  width: 100%;
}

.links-left {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.forgot-link {
  font-size: 12px;
  color: #fff;
}

.register-prompt {
  font-size: 11px;
  color: #b9b9b9;
  display: flex;
  align-items: center;
  gap: 4px;
}

.register-link {
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.register-link img {
  width: 24px;
  height: 24px;
}

.submit-btn {
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  color: white;
  padding: 0 20px;
  height: 42px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: rgba(255,255,255,0.1);
  margin: 10px 0 20px 0;
}

.card-footer-notes {
  text-align: center;
  width: 100%;
}

.card-footer-notes p {
  font-size: 10px;
  color: #a6a6a6;
  line-height: 1.5;
  margin: 0 0 15px 0;
}

.card-footer-notes .platform-desc {
  color: #fff;
  margin-bottom: 0;
}

/* Footer Section */
.footer-section {
  margin-top: 20px;
}

.footer-content {
  padding: 0 17px;
  margin-top: 20px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px 20px;
  margin-bottom: 30px;
}

.footer-links a {
  font-size: 12px;
  color: #fff;
}

.link-header {
  display: block;
  color: #f9f9f9;
  font-weight: 600;
  margin-bottom: 5px;
}

.footer-brand {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 20px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.footer-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
  object-position: left;
}

.copyright {
  font-size: 10px;
  color: #fff;
}

.tagline {
  font-size: 10px;
  color: #c4c4c4;
  margin: 0;
}
</style>
