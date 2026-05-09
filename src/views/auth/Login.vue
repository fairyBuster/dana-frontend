<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <div class="header-actions">
        <img src="/assets/image/16636ddcfe5bc7cbc19b06c1725abcf55b1768ac.png" alt="Download" class="icon-download">
        <div ref="langWrapEl" class="lang-wrap">
          <button
            ref="langBtnEl"
            type="button"
            class="lang-btn"
            aria-label="Language"
            :aria-expanded="langMenuOpen ? 'true' : 'false'"
            @click.stop="toggleLangMenu"
          >
            <img src="/assets/image/4023_135.svg" alt="Language" class="icon-globe">
          </button>
          <div v-if="langMenuOpen" class="lang-menu" @click.stop>
            <button type="button" class="lang-item" @click="changeLanguage('en')">English</button>
            <button type="button" class="lang-item" @click="changeLanguage('id')">Indonesia</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Hero Section -->
    <section id="section-hero">
      <div class="hero-content">
        <img src="/assets/image/Logo01.png" alt="AVR Logo" class="hero-logo">
        <div class="hero-text">
          <h1 class="hero-title">{{ ui.heroTitle }}</h1>
          <p class="hero-subtitle">{{ ui.heroSubtitle }}</p>
        </div>
      </div>
    </section>

    <!-- Login Form Section -->
    <section id="section-login-form">
      <div class="login-container">
        <button type="button" class="switch-login-type" @click="toggleLoginMode">
          {{ switchLoginLabel }}
          <img src="/assets/image/4024_190.svg" alt="Arrow Right">
        </button>

        <form class="login-form" @submit.prevent="handleLogin">

          <!-- Phone Input -->
          <div v-if="loginMode === 'phone'" class="form-group">
            <label>{{ ui.phoneLabel }}</label>
            <div class="input-wrapper">
              <button type="button" class="country-code"  @click="showCountrySelector = true">
                <img
                  v-if="selectedCountry.flagUrl"
                  :src="selectedCountry.flagUrl"
                  :alt="selectedCountry.name + ' flag'"
                  class="country-flag-img"
                >
                
                <span>+{{ selectedCountry.dialCode }}</span>
                <img src="/assets/image/13_212.svg" alt="Chevron Down" class="country-chevron">
              </button>
              <input
                type="tel"
                v-model="formData.phone"
                :placeholder="ui.phonePlaceholder"
                @blur="checkPhoneError"
                @focus="clearPhoneError"
              >
            </div>
          </div>

          <div v-else class="form-group">
            <label>{{ ui.emailLabel }}</label>
            <div class="input-wrapper">
              <input
                type="email"
                v-model="formData.email"
                :placeholder="ui.emailPlaceholder"
                @blur="checkEmailError"
                @focus="clearEmailError"
              >
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label>{{ ui.passwordLabel }}</label>
            <div class="input-wrapper">
              <img src="/assets/image/f51b62d18e83856386037eeaceb597d4f4226181.png" alt="Lock" class="icon-lock">
              <input
                :type="passwordFieldType"
                v-model="formData.password"
                :placeholder="ui.passwordPlaceholder"
              >
              <button
                type="button"
                class="password-toggle"
                :aria-label="passwordFieldType === 'password' ? 'Show password' : 'Hide password'"
                @click="togglePasswordVisibility"
              >
                <img
                  :src="passwordFieldType === 'password'
                    ? 'https://api.iconify.design/mdi/eye.svg?color=%237B7474'
                    : 'https://api.iconify.design/mdi/eye-off.svg?color=%237B7474'"
                  alt=""
                  class="icon-eye"
                >
              </button>
            </div>
          </div>

          <!-- Agreement Checkbox -->
          <div class="agreement-wrapper">
            <div class="checkbox" :class="{ checked: isTermsAccepted }" @click="isTermsAccepted = !isTermsAccepted">
              <svg v-if="isTermsAccepted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <p class="agreement-text">
              {{ ui.agreementPrefix }}
              <router-link to="/solution">{{ ui.customerAgreement }}</router-link>,
              <router-link to="/terms">{{ ui.termsOfService }}</router-link>
              {{ ui.andWord }}
              <router-link to="/privacy">{{ ui.privacyPolicy }}</router-link>
            </p>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <LoadingSpinner v-if="isLoading" :visible="true" message="" />
            <span v-else>{{ ui.submit }}</span>
          </button>

          <!-- Register Link -->
          <div class="register-link">
            {{ ui.noAccount }}
            <router-link to="/register">{{ ui.createAccount }}</router-link>
          </div>
        </form>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="section-footer">
      <p class="copyright">&copy; 2026 AVR System. All rights reserved.</p>
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
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLanguage } from '../../i18n'
import { authAPI } from '../../services/api'
import CountrySelector from '../../components/CountrySelector.vue'
import ErrorModal from '../../components/modals/ErrorModal.vue'
import SuccessModal from '../../components/modals/SuccessModal.vue'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'

const router = useRouter()
const { locale } = useI18n()

const EN_UI = Object.freeze({
  heroTitle: 'Start AVR and access advanced AI system features!',
  heroSubtitle: 'Join thousands of users and experience smart AI-powered resource management',
  signInWithEmail: 'Sign in to console with email',
  signInWithPhone: 'Sign in to console with phone',
  phoneLabel: 'Phone',
  phonePlaceholder: 'Mobile phone number',
  emailLabel: 'Email',
  emailPlaceholder: 'Email address',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Please enter password',
  agreementPrefix: 'I have read and agree to the',
  customerAgreement: 'Customer Agreement',
  termsOfService: 'Terms of Service',
  andWord: 'and',
  privacyPolicy: 'Privacy Policy',
  submit: 'Submit',
  noAccount: 'No account?',
  createAccount: 'Create account'
})

const ID_UI_FALLBACK = Object.freeze({
  heroTitle: 'Mulai AVR dan akses fitur sistem AI canggih!',
  heroSubtitle: 'Bergabunglah dengan ribuan pengguna dan rasakan manajemen sumber daya berbasis AI yang cerdas',
  signInWithEmail: 'Masuk ke konsol dengan email',
  signInWithPhone: 'Masuk ke konsol dengan nomor',
  phoneLabel: 'Nomor',
  phonePlaceholder: 'Nomor ponsel',
  emailLabel: 'Email',
  emailPlaceholder: 'Alamat email',
  passwordLabel: 'Kata sandi',
  passwordPlaceholder: 'Silakan masukkan kata sandi',
  agreementPrefix: 'Saya telah membaca dan menyetujui',
  customerAgreement: 'Perjanjian Pelanggan',
  termsOfService: 'Ketentuan Layanan',
  andWord: 'dan',
  privacyPolicy: 'Kebijakan Privasi',
  submit: 'Kirim',
  noAccount: 'Belum punya akun?',
  createAccount: 'Buat akun'
})

const ui = ref({ ...EN_UI })

const MT_BASE_URL = String(import.meta?.env?.VITE_MT_API_URL || '').replace(/\/$/, '')
const MT_API_KEY = String(import.meta?.env?.VITE_MT_API_KEY || localStorage.getItem('mt_api_key') || '').trim()
const mtUrl = (path) => (MT_BASE_URL ? `${MT_BASE_URL}${path}` : path)
const mtCacheKey = (target) => `mt_cache_v1_${target}`

const getMtCache = (target) => {
  try {
    return JSON.parse(localStorage.getItem(mtCacheKey(target)) || '{}') || {}
  } catch (_) {
    return {}
  }
}

const setMtCache = (target, cacheObj) => {
  try {
    localStorage.setItem(mtCacheKey(target), JSON.stringify(cacheObj))
  } catch (_) {}
}

const mtTranslateMany = async (texts, target, source = 'en') => {
  const unique = Array.from(new Set((texts || []).map((t) => String(t || '')))).filter(Boolean)
  if (!unique.length) return new Map()

  const cache = getMtCache(target)
  const out = new Map()
  const missing = []

  for (const t of unique) {
    if (cache[t]) {
      out.set(t, cache[t])
    } else {
      missing.push(t)
    }
  }

  if (!missing.length) return out

  const params = new URLSearchParams()
  for (const t of missing) params.append('q', t)
  params.append('source', source)
  params.append('target', target)
  params.append('format', 'text')
  if (MT_API_KEY) params.append('api_key', MT_API_KEY)

  const resp = await fetch(mtUrl('/translate'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  })
  if (!resp.ok) throw new Error(`translate_failed_${resp.status}`)

  const data = await resp.json()
  const translated = data?.translatedText
  const translatedList = Array.isArray(translated) ? translated : (typeof translated === 'string' ? [translated] : [])

  if (translatedList.length === 1 && missing.length > 1) {
    for (const t of missing) {
      cache[t] = cache[t] || ''
      out.set(t, cache[t])
    }
    setMtCache(target, cache)
    return out
  }

  if (translatedList.length !== missing.length) {
    throw new Error('translate_shape_mismatch')
  }

  for (let i = 0; i < missing.length; i += 1) {
    const srcText = missing[i]
    const trText = String(translatedList[i] ?? '')
    if (trText) {
      cache[srcText] = trText
      out.set(srcText, trText)
    }
  }

  setMtCache(target, cache)
  return out
}

const applyUiLanguage = async (lang) => {
  if (lang === 'en') {
    ui.value = { ...EN_UI }
    return
  }
  if (lang !== 'id') {
    ui.value = { ...EN_UI }
    return
  }

  try {
    const keys = Object.keys(EN_UI)
    const sourceTexts = keys.map((k) => EN_UI[k])
    const map = await mtTranslateMany(sourceTexts, 'id', 'en')
    const next = {}
    for (const k of keys) {
      const translated = map.get(EN_UI[k])
      next[k] = translated || ID_UI_FALLBACK[k] || EN_UI[k]
    }
    ui.value = next
  } catch (_) {
    ui.value = { ...ID_UI_FALLBACK }
  }
}

const formData = reactive({
  phone: '',
  email: '',
  password: '',
  captcha: ''
})

const loginMode = ref('phone')
const switchLoginLabel = computed(() => {
  return loginMode.value === 'phone' ? ui.value.signInWithEmail : ui.value.signInWithPhone
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

const toggleLoginMode = () => {
  loginMode.value = loginMode.value === 'phone' ? 'email' : 'phone'
  generalError.value = ''
  showErrorModal.value = false
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

const checkEmailError = () => {
  const email = String(formData.email || '').trim()
  if (!email) {
    generalError.value = 'Email is required'
    showErrorModal.value = true
    return
  }
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!ok) {
    generalError.value = 'Email is not valid'
    showErrorModal.value = true
  }
}

const clearEmailError = () => {
  if (generalError.value === 'Email is required' || generalError.value === 'Email is not valid') {
    showErrorModal.value = false
    generalError.value = ''
  }
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
  if (loginMode.value === 'phone') {
    if (!formData.phone.trim()) {
      generalError.value = 'Phone number is required'
      showErrorModal.value = true
      return
    }
  } else {
    const email = String(formData.email || '').trim()
    if (!email) {
      generalError.value = 'Email is required'
      showErrorModal.value = true
      return
    }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!ok) {
      generalError.value = 'Email is not valid'
      showErrorModal.value = true
      return
    }
  }
  
  if (!formData.password) {
    generalError.value = 'Password is required'
    showErrorModal.value = true
    return
  }

  if (!isTermsAccepted.value) {
    generalError.value = 'Please agree to the Customer Agreement, Terms of Service and Privacy Policy.'
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
    let payload = null
    if (loginMode.value === 'phone') {
      let phoneNumber = formData.phone.trim()

      if (!phoneNumber.startsWith('+')) {
        phoneNumber = phoneNumber.replace(/[^\d]/g, '')
        if (!phoneNumber) {
          generalError.value = 'Phone number must be numeric'
          showErrorModal.value = true
          return
        }
        if (phoneNumber.startsWith('0')) phoneNumber = phoneNumber.substring(1)
        const dialCode = String(selectedCountry.value?.dialCode || '62').replace(/[^\d]/g, '')
        phoneNumber = `+${dialCode}${phoneNumber}`
      }

      payload = {
        phone: phoneNumber,
        password: formData.password
      }
    } else {
      payload = {
        email: String(formData.email || '').trim(),
        password: formData.password
      }
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
    
    successMessage.value = 'Successfully'
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
    let msg = 'Account not found. Please register first.'
    if (!error.response) {
      msg = 'No connection. Please check your network and try again.'
    }

    if (status === 401) {
      if (serverTextLower.includes('please provide both phone and password')) {
        msg = 'Please provide both phone number and password.'
      } else if (serverTextLower.includes('invalid phone number or password')) {
        msg = 'Invalid phone number or password. Please try again.'
      } else if (serverTextLower.includes('user account is disabled')) {
        msg = 'Your account is temporarily restricted. Please contact customer service.'
      } else if (serverTextLower.includes('user is banned')) {
        msg = 'Your account has been blocked. Please contact customer service.'
      } else if (serverTextLower.includes('user account is locked')) {
        msg = 'Your account is locked. Please try again later or contact customer service.'
      } else if (serverTextLower.includes('user account is expired')) {
        msg = 'Your account has expired. Please contact customer service.'
      } else if (serverTextLower.includes('user credentials are expired')) {
        msg = 'Your credentials have expired. Please recover your account or contact Customer Service.'
      } else {
        msg = serverText || 'Invalid phone number or password. Please try again.'
      }
    } else if (status === 404) {
      msg = 'Account not found. Please register first.'
    } else if (status === 429 || serverTextLower.includes('throttle') || serverTextLower.includes('limit')) {
      msg = 'Too many failed login attempts. Please try again later.'
    } else if (status === 400) {
      if (serverTextLower.includes('please provide both phone and password')) {
        msg = 'Please provide both phone number and password.'
      } else if (serverTextLower.includes('invalid phone number or password')) {
        msg = 'Invalid phone number or password. Please try again.'
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
  background-color: #ffffff;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

a {
  text-decoration: none;
}

input {
  font-family: inherit;
}

/* Header Section */
#section-header {
  padding: 15px 5px 0;
  display: flex;
  justify-content: flex-end;
  gap: 2px;
}

.header-actions {
  display: flex;
  gap: 24px;
  justify-content: flex-end;
  width: 100%;
}

.lang-wrap {
  position: relative;
}

.lang-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-download {
  width: 23px;
  height: 23px;
  object-fit: contain;
  cursor: pointer;
}

.icon-globe {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.lang-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
  padding: 6px;
  min-width: 140px;
  z-index: 2000;
}

.lang-item {
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  cursor: pointer;
  border-radius: 8px;
  font-family: inherit;
}

.lang-item:hover {
  background: rgba(33, 77, 243, 0.08);
}

/* Hero Section */
#section-hero {
  padding: 34px 24px 20px;
}

.hero-content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.hero-logo {
  width: 56px;
  height: 58px;
  object-fit: contain;
  flex-shrink: 0;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hero-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  line-height: 1.3;
}

.hero-subtitle {
  margin: 0;
  font-size: 12px;
  color: #494747;
  line-height: 1.4;
}

/* Login Form Section */
#section-login-form {
  padding: 20px 20px;
  flex-grow: 1;
}

.switch-login-type {
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  gap: 4px;
  color: #0073ff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
}

.switch-login-type img {
  width: 14px;
  height: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  color: #000000;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  height: 43px;
  padding: 0 12px;
}

.country-code {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #000000;
  padding-right: 12px;
  margin-right: 12px;
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}

.country-code::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 16px;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.1);
}

.country-code img {
  width: 12px;
  height: 12px;
}

.country-code span {
  line-height: 1;
}

.country-chevron {
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
  display: block;
}

.country-flag {
  font-size: 14px;
  line-height: 1;
}

.country-flag-img {
  width: 18px;
  height: 12px;
  object-fit: cover;
  border-radius: 2px;
}

.icon-lock {
  width: 21px;
  height: 21px;
  object-fit: contain;
  margin-right: 12px;
}

.input-wrapper input {
  flex-grow: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #000000;
  padding: 0;
  width: 100%;
}

.input-wrapper input::placeholder {
  color: rgba(0, 0, 0, 0.37);
}

.icon-eye {
  width: 25px;
  height: 25px;
  display: block;
  margin-left: 12px;
}
.password-toggle {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
}

/* Agreement */
.agreement-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
}

.checkbox {
  width: 19px;
  height: 19px;
  border: 1px solid #000000;
  border-radius: 100px;
  flex-shrink: 0;
  margin-top: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  transition: background-color 0.2s;
}

.checkbox.checked {
  background-color: #1b46f5;
  border-color: #1b46f5;
}

.agreement-text {
  margin: 0;
  font-size: 14px;
  color: #000000;
  line-height: 1.4;
}

.agreement-text a {
  color: #0073ff;
}

/* Submit Button */
.btn-submit {
  background-color: #1b46f5;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  height: 53px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
}

.btn-submit:hover {
  background-color: #1539c9;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #000000;
  margin-top: 20px;
}

.register-link a {
  color: #0073ff;
}

/* Footer Section */
#section-footer {
  padding: 20px;
  text-align: center;
  margin-top: auto;
  padding-bottom: 40px;
}

.copyright {
  margin: 0;
  font-size: 12px;
  color: #000000;
}
</style>
