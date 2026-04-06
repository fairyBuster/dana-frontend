<template>
  <section id="register-page">
    <div class="register-container">
      <!-- Header / Back Link -->
      <header v-if="currentStep === 1" class="top-nav">
        <router-link to="/" class="back-link">
          <img src="/assets/image/41_511.svg" alt="Back" class="icon-back">
          <span>Kembali ke beranda</span>
        </router-link>
      </header>

      <section id="step-indicator" :class="{ 'step-indicator--compact': currentStep === 1 }">
        <p class="step-text">Langkah {{ currentStep }} dari 2</p>
      </section>

      <!-- Main Card -->
      <div class="card">
        <div v-if="currentStep === 1" class="card-header">
          <img src="/assets/image/983276.png" alt="Ot-Sent Logo" class="main-logo">
          <h1 class="title">Buat Akun Sent Saya</h1>
          <p class="subtitle">Daftarkan akun untuk mengakses layanan pemetaan, monitoring dan analisis data berbasis drone.</p>
        </div>
        <div v-else class="card-header-step2">
          <h1 class="card-title-step2">Buat Kata Sandi</h1>
          <p class="card-subtitle-step2">Gunakan kata sandi yang aman untuk melindungi akses akun Anda.</p>
        </div>

        <form v-if="currentStep === 1" class="register-form" novalidate @submit.prevent="goToPasswordStep">
          <div class="form-group">
            <label class="input-label">Username</label>
            <div class="input-wrapper">
              <input
                v-model="formData.username"
                type="text"
                placeholder="Masukkan username Anda"
                class="text-input"
                autocomplete="username"
              >
            </div>
          </div>

          <!-- Phone Input -->
          <div class="form-group">
            <label class="input-label">Nomor ponsel terdaftar</label>
            <div class="input-wrapper phone-wrapper">
              <div class="phone-prefix" @click="showCountrySelector = true">
                <span>+{{ selectedCountry.dialCode }}</span>
                <img src="/assets/image/89_1332.svg" alt="Select" class="icon-dropdown">
              </div>
              <input 
                v-model="formData.phone" 
                type="tel" 
                placeholder="Silakan masukkan ponsel Anda" 
                class="text-input"
                @blur="checkPhoneError"
                @focus="clearPhoneError"
              >
            </div>
          </div>

          <!-- Email Input -->
          <div class="form-group">
            <label class="input-label">Alamat email</label>
            <div class="input-wrapper">
              <input 
                v-model="formData.email" 
                type="email" 
                placeholder="Silakan masukkan email Anda" 
                class="text-input"
                autocomplete="email"
              >
            </div>
          </div>

          <div class="form-group">
            <label class="input-label">Kode Undangan</label>
            <div class="input-wrapper">
              <input
                v-model="formData.referralCode"
                type="text"
                placeholder="Masukkan kode undangan"
                class="text-input"
                autocomplete="off"
                required
              >
            </div>
          </div>

          <!-- Checkbox -->
          <div class="checkbox-group">
            <div class="checkbox-container">
              <input id="register-terms" v-model="isTermsAccepted" type="checkbox" class="checkbox-input">
              <label for="register-terms" class="checkbox-box">
                <span v-if="isTermsAccepted" class="checkbox-check"></span>
              </label>
            </div>
            <p class="checkbox-label">
              Saya menyetujui <strong><router-link to="/pages/account/terms">Syarat dan Ketentuan</router-link></strong> serta <strong><router-link to="/pages/account/privacy">Kebijakan Privasi SENT.</router-link></strong>
            </p>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <LoadingSpinner v-if="isLoading" :visible="true" message="" />
            <span v-else>Lanjutkan</span>
          </button>
        </form>

        <form v-else class="register-form" novalidate @submit.prevent="handleRegister">
          <div class="form-group">
            <label class="input-label">Kata sandi</label>
            <div class="input-wrapper input-wrapper-password">
              <input
                v-model="formData.password"
                :type="passwordFieldType"
                placeholder="Silakan masukkan kata sandi Anda"
                class="text-input"
                autocomplete="new-password"
              >
              <img
                src="/assets/image/43_600.svg"
                alt="Show Password"
                class="icon-eye"
                @click="togglePasswordVisibility"
              >
            </div>
          </div>

          <div class="form-group">
            <label class="input-label">Konfirmasi kata sandi</label>
            <div class="input-wrapper input-wrapper-password">
              <input
                v-model="formData.password2"
                :type="password2FieldType"
                placeholder="Silakan masukkan ulang kata sandi Anda"
                class="text-input"
                autocomplete="new-password"
              >
              <img
                src="/assets/image/43_607.svg"
                alt="Show Password"
                class="icon-eye"
                @click="togglePassword2Visibility"
              >
            </div>
          </div>

          <p class="helper-text">Minimal 8 karakter, gunakan kombinasi huruf dan angka untuk keamanan akun.</p>

          <button type="submit" class="btn-submit" :disabled="isLoading">
            <LoadingSpinner v-if="isLoading" :visible="true" :size="20" color="#ffffff" message="" />
            <span v-else>Selesaikan pendaftaran</span>
          </button>

          <a href="#" class="back-link-step" @click.prevent="goBackToInfoStep">
            <img src="/assets/image/43_584.svg" alt="Back" class="icon-back-step">
            <span>Kembali</span>
          </a>
        </form>

        <!-- Login Link -->
        <div v-if="currentStep === 1" class="login-prompt">
          <span class="prompt-text">Sudah memiliki akun?</span>
          <router-link to="/pages/account/access" class="login-link">
            Masuk sekarang
            <img src="/assets/image/43_540.svg" alt="Go">
          </router-link>
        </div>

        <div class="divider"></div>

        <!-- Card Footer Info -->
        <div class="card-footer-info">
          <p>Data kontak akan digunakan untuk verifikasi akses dan komunikasi terkait layanan SENT.</p>
          <p>SENT adalah platform teknologi untuk pemetaan udara, monitoring dan analisis data berbasi drone.</p>
        </div>
      </div>

      <!-- Page Footer -->
      <footer class="page-footer">
        <div class="footer-section">
          <h3 class="footer-title">Others</h3>
          <div class="footer-links">
            <router-link to="/pages/account/terms">Terms of Service</router-link>
            <router-link to="/pages/account/cookie">Cookie Policy</router-link>
            <router-link to="/pages/account/help">Help Center</router-link>
            <router-link to="/pages/account/career">Karir</router-link>
            <router-link to="/pages/account/privacy">Privacy Policy</router-link>
            <router-link to="/pages/account/media">Press / Media</router-link>
            <router-link to="/pages/account/solution">Produk & Solusi</router-link>
          </div>
        </div>
        
        <div class="footer-brand">
          <div class="brand-row">
            <img src="/assets/image/983276.png" alt="Ot-Sent" class="footer-logo">
            <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
          </div>
          <p class="tagline">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        </div>
      </footer>
    </div>

    <!-- Modals -->
    <ErrorModal
      v-model="showErrorModal"
      :message="generalError || 'Registration error occurred.'"
    />
    <SuccessModal
      v-model="showSuccessModal"
      :message="successMessage || 'Your account has been created.'"
    />
    <CountrySelector
      :show="showCountrySelector"
      :selectedCountry="selectedCountry"
      @update:show="showCountrySelector = $event"
      @select="handleSelectCountry"
    />
  </section>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '../../services/api'
import ErrorModal from '../../components/modals/ErrorModal.vue'
import SuccessModal from '../../components/modals/SuccessModal.vue'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'
import CountrySelector from '../../components/CountrySelector.vue'

const router = useRouter()
const route = useRoute()

const formData = reactive({
  full_name: '',
  phone: '',
  email: '',
  password: '',
  password2: '',
  referralCode: ''
})

const currentStep = ref(1)
const passwordFieldType = ref('password')
const password2FieldType = ref('password')

const showCountrySelector = ref(false)
const selectedCountry = ref({ name: 'Indonesia', code: 'ID', dialCode: '62', flag: '🇮🇩' })

const isLoading = ref(false)
const successMessage = ref('')
const generalError = ref('')
const showErrorModal = ref(false)
const showSuccessModal = ref(false)
const isPhoneError = ref(false)
const isTermsAccepted = ref(false)
const hasShownMissingReferral = ref(false)

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

const isValidEmail = (email) => {
  const value = String(email || '').trim()
  if (!value) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

const goToPasswordStep = () => {
  generalError.value = ''

  if (!formData.username.trim() || !formData.phone.trim() || !formData.email.trim()) {
    generalError.value = 'Mohon lengkapi seluruh informasi yang diperlukan.'
    showErrorModal.value = true
    return
  }
  if (!String(formData.referralCode || '').trim()) {
    generalError.value = 'Pendaftaran wajib menggunakan kode referensi. Silakan gunakan tautan undangan.'
    showErrorModal.value = true
    return
  }
  if (!isValidEmail(formData.email)) {
    generalError.value = 'Format email tidak valid.'
    showErrorModal.value = true
    return
  }
  if (!isTermsAccepted.value) {
    generalError.value = 'Silakan setujui kebijakan untuk melanjutkan pendaftaran.'
    showErrorModal.value = true
    return
  }
  currentStep.value = 2
}

const goBackToInfoStep = () => {
  currentStep.value = 1
}

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

const togglePassword2Visibility = () => {
  password2FieldType.value = password2FieldType.value === 'password' ? 'text' : 'password'
}

watch(
  () => [
    route.query.ref,
    route.query.code,
    route.query.inviteCode,
    route.query.invitationCode,
    route.query.invitecode,
    route.params.refCode
  ],
  ([refCode, codeQuery, inviteCode, invitationCode, invitecode, refParam]) => {
    const code = String(refCode || codeQuery || inviteCode || invitationCode || invitecode || refParam || '').trim()
    if (code && formData.referralCode !== code) formData.referralCode = code
    if (!code && !String(formData.referralCode || '').trim() && !hasShownMissingReferral.value) {
      hasShownMissingReferral.value = true
      generalError.value = 'Pendaftaran wajib menggunakan kode referensi. Silakan gunakan tautan undangan.'
      showErrorModal.value = true
    }
  },
  { immediate: true }
)

const handleRegister = async () => {
  successMessage.value = ''
  generalError.value = ''
  
  // Basic validation
  if (!formData.username.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.password || !formData.password2) {
    generalError.value = 'Mohon lengkapi seluruh informasi yang diperlukan.'
    showErrorModal.value = true
    return
  }
  const referralCode = String(formData.referralCode || '').trim()
  if (!referralCode) {
    generalError.value = 'Pendaftaran wajib menggunakan kode referensi. Silakan gunakan tautan undangan.'
    showErrorModal.value = true
    return
  }
  if (!isValidEmail(formData.email)) {
    generalError.value = 'Format email tidak valid.'
    showErrorModal.value = true
    return
  }

  if (formData.password !== formData.password2) {
    generalError.value = 'Pastikan kata sandi dan konfirmasi sama.'
    showErrorModal.value = true
    return
  }

  const hasLetter = /[A-Za-z]/.test(formData.password)
  const hasNumber = /\d/.test(formData.password)
  if (!hasLetter || !hasNumber || formData.password.length < 8) {
    generalError.value = 'Gunakan kombinasi huruf dan angka untuk keamanan lebih baik.'
    showErrorModal.value = true
    return
  }
  
  if (!isTermsAccepted.value) {
    generalError.value = 'Silakan setujui kebijakan untuk melanjutkan pendaftaran.'
    showErrorModal.value = true
    return
  }
  
  isLoading.value = true
  
  try {
    // Format phone number with country code
    let phoneNumber = formData.phone.trim()
    
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber.replace(/[^\d]/g, '')
      if (!phoneNumber) {
        generalError.value = 'Nomor ponsel harus berupa angka'
        showErrorModal.value = true
        return
      }

      if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1)
      }

      const dialCode = String(selectedCountry.value?.dialCode || '62')
      phoneNumber = `+${dialCode}${phoneNumber}`
    }
    
    const payload = {
      username: formData.username.trim(),
      phone: phoneNumber,
      email: formData.email.trim(),
      password: formData.password,
      password2: formData.password2,
      referral_code: referralCode
    }
    
    const response = await authAPI.register(payload)
    
    successMessage.value = 'Silakan masuk ke area pengguna.'
    showSuccessModal.value = true
    
    setTimeout(() => {
      router.push('/pages/account/access')
    }, 2000)
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message)
    
    if (error.response && error.response.data) {
      const status = error.response.status
      const errorData = error.response.data
      const rawFallback = String(errorData?.detail || errorData?.message || error?.message || '')
      const rawFallbackLower = rawFallback.toLowerCase()
      const rawFallbackCompact = rawFallbackLower.replace(/\s+/g, '')
      const isRateLimited =
        status === 429 ||
        rawFallbackLower.includes('permintaan ini dibatasi') ||
        rawFallbackCompact.includes('permintaaninidibatasi') ||
        rawFallbackLower.includes('dibatasi') ||
        rawFallbackLower.includes('terlalu banyak') ||
        rawFallbackLower.includes('too many') ||
        rawFallbackLower.includes('throttle') ||
        rawFallbackLower.includes('rate limit')
      if (isRateLimited) {
        generalError.value = 'Terlalu banyak aksi'
        showErrorModal.value = true
        return
      }
      
      if (errorData.username) {
        const usernameErrors = Array.isArray(errorData.username) ? errorData.username : [errorData.username]
        const usernameMessage = usernameErrors.map((x) => String(x || '')).join(' ').toLowerCase()
        const isAlreadyTaken =
          usernameMessage.includes('sudah ada') ||
          usernameMessage.includes('sudah digunakan') ||
          usernameMessage.includes('already') ||
          usernameMessage.includes('exists')
        generalError.value = isAlreadyTaken
          ? 'Gunakan nama pengguna lain untuk melanjutkan pendaftaran'
          : 'Nama pengguna tidak valid. Silakan gunakan nama pengguna lain.'
      } else if (errorData.phone) {
        generalError.value = 'Silakan gunakan nomor lain atau masuk ke akun Anda.'
      } else if (errorData.referral_code || errorData.referralCode) {
        const referralErrors = errorData.referral_code || errorData.referralCode
        const referralMessage = Array.isArray(referralErrors) ? referralErrors.join(' ') : String(referralErrors)
        if (referralMessage.toLowerCase().includes('batas undang harian tercapai')) {
          generalError.value = 'Anda tidak bisa mendaftar menggunakan kode undangan ini'
        } else {
          generalError.value = 'Pastikan kode undangan yang Anda masukkan benar.'
        }
      } else if (errorData.email) {
        generalError.value = 'Email ini sudah terdaftar. Silakan gunakan email lain.'
      } else {
        const fallbackMessage = errorData.detail || errorData.message || ''
        const isReferralError = /referral|undangan|invitation/i.test(String(fallbackMessage))
        generalError.value = isReferralError ? 'Pastikan kode undangan yang Anda masukkan benar.' : (fallbackMessage || 'Pendaftaran Anda gagal. Mohon hubungi manajemen layanan untuk mendapatkan bantuan.')
      }
    } else {
      generalError.value = 'Pendaftaran Anda gagal. Mohon coba lagi.'
    }
    
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}
</script>



<style scoped>
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #000;
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
}

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

input {
  font-family: inherit;
  outline: none;
}

#register-page {
  width: 100%;
  min-height: 100vh;
  background-image: url('/assets/image/c8be2d7d65edfe8e1c48d73e2794025ee176da57.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
}

.register-container {
  width: 100%;
  max-width: 412px;
  padding: 20px 17px;
  display: flex;
  flex-direction: column;
  position: relative;
}

#step-indicator {
  padding-top: 74px;
  padding-bottom: 13px;
  width: 100%;
  display: flex;
  justify-content: center;
}

#step-indicator.step-indicator--compact {
  padding-top: 0px;
}

.step-text {
  color: #a6a6a6;
  font-size: 14px;
  text-align: center;
  margin: 0;
}

/* Top Nav */
.top-nav {
  margin-bottom: 20px;
  padding-left: 1px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a6a6a6;
  font-size: 14px;
  font-weight: 500;
}

.icon-back {
  width: 24px;
  height: 24px;
}

/* Card */
.card {
  background: linear-gradient(180deg, rgba(15, 11, 46, 1) 0%, rgba(43, 27, 111, 1) 100%);
  border-radius: 10px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
}

.main-logo {
  width: 148px;
  height: 62px;
  object-fit: contain;
  margin-bottom: 0px;
}

.title {
  font-size: 20px;
  font-weight: 700;
  margin: 16px 0 10px 0;
  color: #ffffff;
}

.subtitle {
  font-size: 13px;
  line-height: 1.4;
  color: #a6a6a6;
  margin: 0;
  max-width: 342px;
}

.card-header-step2 {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.card-title-step2 {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  text-align: left;
}

.card-subtitle-step2 {
  font-size: 14px;
  color: #a6a6a6;
  margin: 0;
  line-height: 1.4;
}

/* Form */
.register-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 13px;
  color: #ffffff;
  text-align: left;
}

.input-wrapper {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 10px;
  height: 43px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  width: 100%;
}

.input-wrapper-password {
  gap: 10px;
}

.icon-eye {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.phone-wrapper {
  gap: 8px;
  padding-left: 10px;
}

.phone-prefix {
  display: flex;
  align-items: center;
  gap: 2px;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.icon-dropdown {
  width: 10px;
  height: 11px;
}

.text-input {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  height: 100%;
}

.text-input::placeholder {
  color: #505050;
}

/* Checkbox */
.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
}

.checkbox-container {
  padding-top: 2px;
}

.checkbox-input {
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
}

.checkbox-check {
  width: 6px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-size: 12px;
  color: #b9b9b9;
  margin: 0;
  line-height: 1.4;
}

.checkbox-label strong {
  color: #ffffff;
  font-weight: 600;
}

/* Button */
.btn-submit {
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30%, #9047E0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  height: 42px;
  width: 100%;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.helper-text {
  font-size: 12px;
  color: #b9b9b9;
  margin: 0 0 24px 0;
  line-height: 1.4;
}

.back-link-step {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #ffffff;
  font-size: 14px;
  margin-bottom: 20px;
  cursor: pointer;
}

.icon-back-step {
  width: 24px;
  height: 24px;
  transform: rotate(-90deg);
}

/* Login Prompt */
.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 15px;
  font-size: 12px;
}

.prompt-text {
  color: #b9b9b9;
}

.login-link {
  color: #ffffff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.login-link img {
  width: 24px;
  height: 24px;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 25px 0;
}

/* Card Footer Info */
.card-footer-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card-footer-info p {
  font-size: 11px;
  color: #a6a6a6;
  margin: 0;
  line-height: 1.5;
}

.card-footer-info p:last-child {
  color: #ffffff;
}

/* Page Footer */
.page-footer {
  margin-top: auto;
  padding-bottom: 20px;
}

.footer-title {
  font-size: 14px;
  color: #f9f9f9;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px 20px;
  margin-bottom: 30px;
}

.footer-links a {
  font-size: 12px;
  color: #ffffff;
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.brand-copyright {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-logo {
  width: 90px;
  height: 37px;
  object-fit: contain;
}

.brand-copyright span {
  font-size: 10px;
  color: #ffffff;
}

.powered-by {
  font-size: 10px;
  color: #c4c4c4;
  margin: 0;
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
