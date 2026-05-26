<template>
  <div class="app-container">
    <!-- Hero Section -->
    <section id="section-hero" class="mobile-section">
      <div class="hero-image-wrapper">
        <img src="/assets/images/bc9739ea709a0d916c1ee09c79b13d9fe4735cbb.png" alt="Security Shield and Wallet Background" class="hero-image">
      </div>
    </section>

    <!-- Header Section -->
    <section id="section-header" class="mobile-section">
      <div class="header-content">
        <img src="/assets/images/108294978d9cad25785261933372f80a0602c03d.png" alt="Dana Proteksi Logo" class="brand-logo">
        <h2 class="brand-subtitle">{{ ui.heroSubtitle }}</h2>
      </div>
    </section>

    <!-- Login Form Section -->
    <section id="section-login-form" class="mobile-section">
      <div class="form-container">
        <!-- Phone Input -->
        <div class="input-group">
          <img src="/assets/images/8_326.svg" alt="User Icon" class="icon-left user-icon">
          <input
            type="tel"
            v-model="formData.phone"
            :placeholder="ui.phonePlaceholder"
            class="form-input"
            @blur="checkPhoneError"
            @focus="clearPhoneError"
          >
        </div>

        <!-- Password Input -->
        <div class="input-group">
          <img src="/assets/images/8_329.svg" alt="Lock Icon" class="icon-left lock-icon">
          <input
            :type="passwordFieldType"
            v-model="formData.password"
            :placeholder="ui.passwordPlaceholder"
            class="form-input"
          >
          <svg
            v-if="passwordFieldType === 'password'"
            class="icon-right"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            role="button"
            tabindex="0"
            aria-label="Show password"
            @click="togglePasswordVisibility"
            @keydown.enter.prevent="togglePasswordVisibility"
            @keydown.space.prevent="togglePasswordVisibility"
          >
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg
            v-else
            class="icon-right"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            role="button"
            tabindex="0"
            aria-label="Hide password"
            @click="togglePasswordVisibility"
            @keydown.enter.prevent="togglePasswordVisibility"
            @keydown.space.prevent="togglePasswordVisibility"
          >
            <path d="M3 3l18 18" />
            <path d="M10.2 10.25a3 3 0 003.55 3.55" />
            <path d="M6.23 6.23C4.6 7.51 3.35 9.5 2.46 12c1.27 4.06 5.06 7 9.54 7 1.47 0 2.88-.31 4.17-.87" />
            <path d="M9.88 4.27A9.94 9.94 0 0112 5c4.48 0 8.27 2.94 9.54 7a11.2 11.2 0 01-3.03 4.57" />
          </svg>
        </div>

        <!-- Slider Captcha -->
        <div class="slider-captcha" ref="sliderCaptchaRef">
          <div class="slider-track" :class="{ 'slider-verified': sliderVerified }">
            <span class="slider-text">{{ sliderVerified ? ui.sliderVerified : ui.sliderHint }}</span>
          </div>
          <img
            src="/assets/images/9aafab34419c92ae6d76b07f598384e4b00a88a6.png"
            alt="Drag Arrow to Login"
            class="slider-thumb"
            :style="{ left: sliderLeft + 'px' }"
            @mousedown="onSliderStart"
            @touchstart.prevent="onSliderStart"
          >
        </div>

        <!-- Forgot Password -->
        <div class="forgot-password-wrapper">
          <a href="#" class="forgot-password-link" @click.prevent="handleForgotPassword">{{ ui.forgotPassword }}</a>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button type="button" class="btn-primary" :disabled="isLoading" @click="handleLogin">
            <LoadingSpinner v-if="isLoading" :visible="true" message="" />
            <span v-else>{{ ui.submit }}</span>
          </button>
          <button type="button" class="btn-secondary" @click="$router.push('/hn/network')">
            {{ ui.createAccount }}
          </button>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="section-footer" class="mobile-section">
      <div class="footer-container">
        <p class="terms-text">
          {{ ui.agreementPrefix }}
          <span class="highlight" @click="$router.push('/hn/legal/privacy')">{{ ui.privacyPolicy }}</span>
          {{ ui.andWord }}
          <span class="highlight" @click="$router.push('/hn/legal/terms')">{{ ui.termsOfService }}</span>
        </p>

        <div class="security-block">
          <div class="security-header">
            <img src="/assets/images/3134047e5168616d4f5f4ce9af921913fa739acd.png" alt="Security Shield" class="shield-icon">
            <h3 class="security-title">Aman, Terpercaya, Melindungi Anda</h3>
          </div>
          <p class="security-desc">Data Anda terenkripsi dan terlindungi dengan standar keamanan tinggi</p>
          <div class="security-logos">
            <img src="/assets/images/bappeti.png" alt="BAPPEBTI Logo" class="logo-bappebti">
            <img src="/assets/images/ojk.png" alt="OJK Logo" class="logo-ojk">
          </div>
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
      v-model:show="showCountrySelector"
      :selectedCountry="selectedCountry"
      @select="handleSelectCountry"
    />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLanguage } from '../../i18n'
import { authAPI } from '../../services/api'
import CountrySelector from '../../components/CountrySelector.vue'
import ErrorModal from '../../components/modals/AppErrorModal.vue'
import SuccessModal from '../../components/modals/AppSuccessModal.vue'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'

const router = useRouter()
const { locale } = useI18n()

const EN_UI = Object.freeze({
  heroTitle: 'Welcome to Dana Proteksi',
  heroSubtitle: 'Sign in to access your account securely',
  signInWithEmail: 'Sign in to console with email',
  signInWithPhone: 'Sign in to console with phone',
  phoneLabel: 'Phone',
  phonePlaceholder: 'Enter your mobile number',
  emailLabel: 'Email',
  emailPlaceholder: 'Email address',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Password',
  agreementPrefix: 'I agree to the',
  customerAgreement: 'Customer Agreement',
  termsOfService: 'Terms of Service',
  andWord: 'and',
  privacyPolicy: 'Privacy Policy',
  submit: 'Sign In',
  noAccount: 'No account?',
  createAccount: 'Register',
  forgotPassword: 'Forgot password?',
  sliderHint: 'Geser untuk melanjutkan verifikasi',
  sliderVerified: 'Verifikasi berhasil'
})

const ID_UI_FALLBACK = Object.freeze({
  heroTitle: 'Selamat datang di Dana Proteksi',
  heroSubtitle: 'Masuk untuk mengakses akun Anda dengan aman',
  signInWithEmail: 'Masuk ke konsol dengan email',
  signInWithPhone: 'Masuk ke konsol dengan nomor',
  phoneLabel: 'Nomor',
  phonePlaceholder: 'Masukkan nomor ponsel Anda',
  emailLabel: 'Email',
  emailPlaceholder: 'Alamat email',
  passwordLabel: 'Kata sandi',
  passwordPlaceholder: 'Kata sandi',
  agreementPrefix: 'Saya setuju dengan',
  customerAgreement: 'Perjanjian Pelanggan',
  termsOfService: 'Syarat Layanan',
  andWord: 'dan',
  privacyPolicy: 'Kebijakan Privasi',
  submit: 'Masuk',
  noAccount: 'Belum punya akun?',
  createAccount: 'Daftar',
  forgotPassword: 'Lupa kata sandi?',
  sliderHint: 'Geser untuk melanjutkan verifikasi',
  sliderVerified: 'Verifikasi berhasil'
})

const ui = ref({ ...EN_UI })
const applyUiLanguage = async (lang) => {
  if (lang === 'en') {
    ui.value = { ...EN_UI }
    return
  }
  if (lang !== 'id') {
    ui.value = { ...EN_UI }
    return
  }
  ui.value = { ...ID_UI_FALLBACK }
}

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
const showCountrySelector = ref(false)
const selectedCountry = ref({ name: 'Indonesia', code: 'ID', dialCode: '62', flag: '🇮🇩' })

// Slider captcha state
const sliderCaptchaRef = ref(null)
const sliderLeft = ref(-5)
const sliderVerified = ref(false)
let sliderStartX = 0
let sliderStartLeft = 0

const onSliderStart = (e) => {
  if (sliderVerified.value) return
  const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
  sliderStartX = clientX
  sliderStartLeft = sliderLeft.value
  document.addEventListener('mousemove', onSliderMove)
  document.addEventListener('mouseup', onSliderEnd)
  document.addEventListener('touchmove', onSliderMove)
  document.addEventListener('touchend', onSliderEnd)
}

const onSliderMove = (e) => {
  const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
  const diff = clientX - sliderStartX
  const trackEl = sliderCaptchaRef.value?.querySelector('.slider-track')
  const maxLeft = (trackEl?.offsetWidth || 354) - 56
  let newLeft = sliderStartLeft + diff
  if (newLeft < -5) newLeft = -5
  if (newLeft > maxLeft) newLeft = maxLeft
  sliderLeft.value = newLeft
}

const onSliderEnd = () => {
  document.removeEventListener('mousemove', onSliderMove)
  document.removeEventListener('mouseup', onSliderEnd)
  document.removeEventListener('touchmove', onSliderMove)
  document.removeEventListener('touchend', onSliderEnd)
  const trackEl = sliderCaptchaRef.value?.querySelector('.slider-track')
  const maxLeft = (trackEl?.offsetWidth || 354) - 56
  if (sliderLeft.value >= maxLeft - 10) {
    sliderLeft.value = maxLeft
    sliderVerified.value = true
  } else {
    const movedEnough = sliderLeft.value > 20
    sliderLeft.value = -5
    if (movedEnough) {
      generalError.value = 'Verifikasi gagal, silakan coba lagi'
      showErrorModal.value = true
    }
  }
}

const langMenuOpen = ref(false)
const langWrapEl = ref(null)
const langBtnEl = ref(null)

const toggleLangMenu = () => {
  langMenuOpen.value = !langMenuOpen.value
}

const changeLanguage = (lang) => {
  setLanguage(lang)
  locale.value = lang
  langMenuOpen.value = false
}

const handleSelectCountry = (country) => {
  selectedCountry.value = country
}

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
  successMessage.value = 'Kode OTP berhasil dikirim'
  showSuccessModal.value = true

  if (notificationTimer) clearTimeout(notificationTimer)
  notificationTimer = setTimeout(() => {
    showSuccessModal.value = false
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
    generalError.value = 'Nomor ponsel belum diisi'
    showErrorModal.value = true
    return
  }
  
  if (!formData.password) {
    generalError.value = 'Kata sandi belum diisi'
    showErrorModal.value = true
    return
  }

  if (!sliderVerified.value) {
    generalError.value = 'Selesaikan verifikasi terlebih dahulu'
    showErrorModal.value = true
    return
  }

  // Auto-generate captcha for submission
  if (!generatedCaptcha.value) {
    refreshCaptcha()
  }
  formData.captcha = generatedCaptcha.value

  isLoading.value = true
  
  try {
    let phoneNumber = formData.phone.trim()
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber.replace(/[^\d]/g, '')
      if (!phoneNumber) {
        generalError.value = 'Masukkan nomor ponsel yang teliti'
        showErrorModal.value = true
        return
      }
      if (phoneNumber.startsWith('0')) phoneNumber = phoneNumber.substring(1)
      const dialCode = String(selectedCountry.value?.dialCode || '62').replace(/[^\d]/g, '')
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
    let token = data.access || data.token || data.key || data.auth_token || data.access_token
    if (!token && typeof headerAuth === 'string') {
      const parts = headerAuth.split(/\s+/)
      token = parts.length > 1 ? parts.pop() : headerAuth
    }

    if (!token) {
      generalError.value = 'Gagal login, silakan periksa kembali data Anda'
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
    
    successMessage.value = 'Login berhasil'
    showSuccessModal.value = true
    setTimeout(() => {
      router.push('/hn/home')
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
    
    let msg = 'Gagal login, silakan periksa kembali data Anda'
    if (!error.response) {
      msg = 'Tidak ada koneksi internet'
    }

    if (status === 401) {
      msg = 'Kata sandi yang Anda masukkan salah'
    } else if (status === 404) {
      msg = 'Akun tidak ditemukan'
    } else if (status === 429 || serverTextLower.includes('throttle') || serverTextLower.includes('limit')) {
      msg = 'Terlalu banyak percobaan login, silakan coba lagi nanti'
    } else if (status === 400) {
      msg = 'Masukkan nomor ponsel yang teliti'
    } else if (status >= 500) {
      msg = 'Server sedang sibuk, silakan coba lagi'
    }

    generalError.value = msg
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

const onDocumentClick = (event) => {
  if (!langMenuOpen.value) return
  const target = event.target
  if (langWrapEl.value?.contains(target) || langBtnEl.value?.contains(target)) return
  langMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  if (notificationTimer) clearTimeout(notificationTimer)
  document.removeEventListener('click', onDocumentClick)
})

watch(
  () => locale.value,
  (lang) => {
    applyUiLanguage(lang)
  },
  { immediate: true }
)
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
  max-width: 100%;
  background-color: #f5f5f5;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.mobile-section {
  max-width: 412px;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

input, button {
  font-family: 'Inter', sans-serif;
}

a {
  text-decoration: none;
}

/* Hero Section */
#section-hero {
  position: relative;
}

.hero-image-wrapper {
  position: absolute;
  top: -230px;
  left: 0;
  width: 100%;
  height: 603px;
  z-index: 1;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
  object-position: center top;
}

/* Header Section */
#section-header {
  z-index: 2;
  background-color: #fefefe;
  border-radius: 40px 40px 0 0;
  margin-top: 278px;
  padding-top: 37px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-logo {
  width: 178px;
  height: 67px;
  object-fit: contain;
  margin-bottom: 14px;
}

.brand-subtitle {
  color: #635f5f;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  max-width: 265px;
  margin: 0;
  line-height: 1.4;
}

/* Login Form Section */
#section-login-form {
  z-index: 2;
  background-color: #fefefe;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 19px;
}

.form-container {
  width: 374px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 19px;
}

.input-group {
  width: 100%;
  height: 60px;
  background-color: #fdfcf8;
  border: 1px solid #ababab;
  border-radius: 15px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  margin-bottom: 7px;
}

.icon-left {
  margin-right: 15px;
  object-fit: contain;
}

.user-icon {
  width: 20px;
  height: 20px;
}

.lock-icon {
  width: 16px;
  height: 16px;
  margin-left: 2px;
  margin-right: 17px;
}

.icon-right {
  width: 16px;
  height: 16px;
  margin-left: 15px;
  cursor: pointer;
}

.form-input {
  flex: 1;
  border: none;
  background: transparent;
  color: #333333;
  font-size: 14px;
  outline: none;
}

.form-input::placeholder {
  color: #635f5f;
}

/* Slider Captcha */
.slider-captcha {
  width: 100%;
  height: 60px;
  position: relative;
  margin-top: 12px;
  margin-bottom: 18px;
}

.slider-track {
  position: absolute;
  top: 15px;
  right: 0;
  width: 100%;
  height: 30px;
  background-color: #f4bd40;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.slider-track.slider-verified {
  background-color: #4caf50;
}

.slider-text {
  color: #4f4f4f;
  font-size: 12px;
  font-weight: 500;
  user-select: none;
}

.slider-track.slider-verified .slider-text {
  color: #ffffff;
}

.slider-thumb {
  position: absolute;
  top: 0;
  width: 56px;
  height: 60px;
  z-index: 2;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}

/* Forgot Password */
.forgot-password-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 19px;
  padding-right: 7px;
}

.forgot-password-link {
  color: #000000;
  font-size: 14px;
  text-decoration: none;
  font-weight: 600;
}

/* Action Buttons */
.action-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.btn-primary {
  width: 100%;
  height: 60px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:active {
  opacity: 0.8;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  width: 100%;
  height: 60px;
  background-color: transparent;
  color: #000000;
  border: 1px solid #978d00;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:active {
  background-color: #f9f9f9;
}

/* Footer Section */
#section-footer {
  z-index: 2;
  background-color: #fefefe;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 7px;
  padding-bottom: 60px;
  min-height: 250px;
}

.footer-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1px;
}

.terms-text {
  color: #9a9a9a;
  font-size: 12px;
  text-align: center;
  margin: 0 0 39px 0;
}

.highlight {
  color: #978d00;
  font-weight: 600;
  cursor: pointer;
}

.security-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 10px;
}

.security-header {
  display: flex;
  align-items: center;
  gap: 0px;
  margin-left: -15px;
  margin-bottom: 0;
}

.shield-icon {
  width: 55px;
  margin-left: 10px;
  margin-right: -10px;
  height: 32px;
  object-fit: contain;
}

.security-title {
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}

.security-desc {
  color: #9a9a9a;
  font-size: 12px;
  margin: 0 0 15px 39px;
  line-height: 1.4;
  max-width: 100%;
}

.security-logos {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 33px;
}

.logo-bappebti {
  width: 80px;
  height: 21px;
  margin-left: -20px;
  object-fit: contain;
}

.logo-ojk {
  width: 70px;
  height: 26px;
  margin-left: -20px;
  object-fit: contain;
}
</style>
