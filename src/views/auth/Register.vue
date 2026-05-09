<template>
  <div class="app-container">
    <!-- Top Bar Section -->
    <section id="section-topbar">
      <div class="topbar-container">
        <div class="topbar-icons">
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
              <img src="/assets/image/4255_215.svg" alt="Language" class="icon-globe">
            </button>
            <div v-if="langMenuOpen" class="lang-menu" @click.stop>
              <button type="button" class="lang-item" @click="changeLanguage('en')">English</button>
              <button type="button" class="lang-item" @click="changeLanguage('id')">Indonesia</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hero Section -->
    <section id="section-hero">
      <div class="hero-container">
        <div class="hero-content">
          <img src="/assets/image/Logo01.png" alt="AVR Logo" class="hero-logo">
          <div class="hero-text">
            <h1 class="hero-title">{{ ui.heroTitle }}</h1>
            <p class="hero-subtitle">{{ ui.heroSubtitle }}</p>
          </div>
        </div>
        <!-- <router-link to="/register" class="hero-link">
          {{ ui.heroLink }}
          <img src="/assets/image/4255_218.svg" alt="Arrow Right" class="icon-arrow-right">
        </router-link> -->
      </div>
    </section>

    <!-- Form Section -->
    <section id="section-form">
      <div class="form-container">
        <form class="registration-form" @submit.prevent="handleRegister">

          <!-- Phone -->
          <div class="form-group">
            <label>{{ ui.phoneLabel }}</label>
            <div class="input-wrapper">
              <button type="button" class="country-code" @click="showCountrySelector = true">
              
                <img
                  v-if="selectedCountry.flagUrl"
                  :src="selectedCountry.flagUrl"
                  :alt="selectedCountry.name + ' flag'"
                  class="country-flag-img"
                >
                
             
                <span>+{{ selectedCountry.dialCode }}</span>
                <img src="/assets/image/4255_184.svg" alt="Chevron Down" class="country-chevron">
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

          <!-- Email -->
          <div class="form-group">
            <label>{{ ui.emailLabel }}</label>
            <div class="input-wrapper">
              <input
                type="email"
                v-model="formData.email"
                :placeholder="ui.emailPlaceholder"
              >
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label>{{ ui.passwordLabel }}</label>
            <div class="input-wrapper has-icon">
              <img src="/assets/image/f51b62d18e83856386037eeaceb597d4f4226181.png" alt="Lock" class="input-icon-left">
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
                  class="input-icon-right"
                >
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label>{{ ui.confirmPasswordLabel }}</label>
            <div class="input-wrapper has-icon">
              <img src="/assets/image/f51b62d18e83856386037eeaceb597d4f4226181.png" alt="Lock" class="input-icon-left">
              <input
                :type="password2FieldType"
                v-model="formData.password2"
                :placeholder="ui.confirmPasswordPlaceholder"
              >
              <button
                type="button"
                class="password-toggle"
                :aria-label="password2FieldType === 'password' ? 'Show password' : 'Hide password'"
                @click="togglePassword2Visibility"
              >
                <img
                  :src="password2FieldType === 'password'
                    ? 'https://api.iconify.design/mdi/eye.svg?color=%237B7474'
                    : 'https://api.iconify.design/mdi/eye-off.svg?color=%237B7474'"
                  alt=""
                  class="input-icon-right"
                >
              </button>
            </div>
          </div>

          <!-- Signature / Username -->
          <div class="form-group">
            <label>{{ ui.signatureLabel }}</label>
            <div class="input-wrapper">
              <input
                type="text"
                v-model="formData.username"
                :placeholder="ui.signaturePlaceholder"
              >
            </div>
          </div>

          <!-- Referral Code Toggle -->
          <div class="referral-toggle" @click="showReferral = !showReferral">
            <span>{{ ui.referralToggle }}</span>
            <img src="/assets/image/4255_222.svg" alt="Toggle">
          </div>

          <!-- Referral Code Input (shown when toggled) -->
          <div class="form-group" v-if="showReferral">
            <label>{{ ui.referralLabel }}</label>
            <div class="input-wrapper">
              <input
                type="text"
                v-model="formData.referralCode"
                :placeholder="ui.referralPlaceholder"
                required
              >
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="terms-checkbox">
            <div class="checkbox-custom" @click="isTermsAccepted = !isTermsAccepted">
              <div class="checkbox-bg" :class="{ active: isTermsAccepted }"></div>
              <img v-if="isTermsAccepted" src="/assets/image/a84c69a218ab38138fa855a6c1a8a8dfc114da81.png" alt="Check" class="checkbox-mark">
            </div>
            <p class="terms-text">
              {{ ui.agreementPrefix }}
              <router-link to="/solution">{{ ui.customerAgreement }}</router-link>,
              <router-link to="/terms">{{ ui.termsOfService }}</router-link>
              {{ ui.andWord }}
              <router-link to="/privacy">{{ ui.privacyPolicy }}</router-link>
            </p>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-primary" :disabled="isLoading">
            <LoadingSpinner v-if="isLoading" :visible="true" message="" />
            <span v-else>{{ ui.signUp }}</span>
          </button>
        </form>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="section-footer">
      <div class="footer-container">
        <div class="footer-links">
          <span>{{ ui.alreadyHaveAccount }}</span> <router-link to="/login">{{ ui.signIn }}</router-link>
        </div>
        <div class="footer-copyright">
          &copy; 2026 AVR System. All rights reserved.
        </div>
      </div>
    </section>

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
      v-model:show="showCountrySelector"
      :selectedCountry="selectedCountry"
      @select="handleSelectCountry"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLanguage } from '../../i18n'
import { authAPI } from '../../services/api'
import CountrySelector from '../../components/CountrySelector.vue'
import ErrorModal from '../../components/modals/ErrorModal.vue'
import SuccessModal from '../../components/modals/SuccessModal.vue'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

const EN_UI = Object.freeze({
  heroTitle: 'Join AVR and access advanced AI system features!',
  heroSubtitle: 'Join thousands of users and experience smart AI-powered resource management',
  heroLink: 'Sign up to console with email',
  phoneLabel: 'Phone',
  phonePlaceholder: 'Mobile phone number',
  emailLabel: 'Email',
  emailPlaceholder: 'Please enter email',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Please enter password',
  confirmPasswordLabel: 'Confirm password',
  confirmPasswordPlaceholder: 'Please re-enter password',
  signatureLabel: 'Signature',
  signaturePlaceholder: 'Please enter username',
  referralToggle: "Referrer's Referral Code",
  referralLabel: 'Referral Code',
  referralPlaceholder: 'Enter referral code',
  agreementPrefix: 'I have read and agree to the',
  customerAgreement: 'Customer Agreement',
  termsOfService: 'Terms of Service',
  andWord: 'and',
  privacyPolicy: 'Privacy Policy',
  signUp: 'Sign up',
  alreadyHaveAccount: 'Already have account?',
  signIn: 'Sign in'
})

const ID_UI_FALLBACK = Object.freeze({
  heroTitle: 'Bergabung dengan AVR dan akses fitur sistem AI canggih!',
  heroSubtitle: 'Bergabunglah dengan ribuan pengguna dan rasakan manajemen sumber daya berbasis AI yang cerdas',
  heroLink: 'Daftar ke konsol dengan email',
  phoneLabel: 'Nomor',
  phonePlaceholder: 'Nomor ponsel',
  emailLabel: 'Email',
  emailPlaceholder: 'Silakan masukkan email',
  passwordLabel: 'Kata sandi',
  passwordPlaceholder: 'Silakan masukkan kata sandi',
  confirmPasswordLabel: 'Konfirmasi kata sandi',
  confirmPasswordPlaceholder: 'Silakan masukkan ulang kata sandi',
  signatureLabel: 'Nama pengguna',
  signaturePlaceholder: 'Silakan masukkan nama pengguna',
  referralToggle: 'Kode Referral Pengundang',
  referralLabel: 'Kode Referral',
  referralPlaceholder: 'Masukkan kode referral',
  agreementPrefix: 'Saya telah membaca dan menyetujui',
  customerAgreement: 'Perjanjian Pelanggan',
  termsOfService: 'Ketentuan Layanan',
  andWord: 'dan',
  privacyPolicy: 'Kebijakan Privasi',
  signUp: 'Daftar',
  alreadyHaveAccount: 'Sudah punya akun?',
  signIn: 'Masuk'
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
  username: '',
  email: '',
  phone: '',
  password: '',
  password2: '',
  referralCode: '',
  captcha: ''
})

const passwordFieldType = ref('password')
const password2FieldType = ref('password')
const isLoading = ref(false)
const successMessage = ref('')
const generalError = ref('')
const showErrorModal = ref(false)
const showSuccessModal = ref(false)
const isPhoneError = ref(false)
const isTermsAccepted = ref(false)
const generatedCaptcha = ref('')
const showReferral = ref(false)
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

const onDocumentClick = (event) => {
  if (!langMenuOpen.value) return
  const target = event.target
  if (langWrapEl.value?.contains(target) || langBtnEl.value?.contains(target)) return
  langMenuOpen.value = false
}

const handleSelectCountry = (country) => {
  selectedCountry.value = country
}

// Password validation rules
const passwordRules = computed(() => {
  const password = formData.password || ''
  return {
    minLength: password.length >= 8,
    hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

const checkPhoneError = () => {
  if (!formData.phone.trim()) {
    isPhoneError.value = true
  }
}

const clearPhoneError = () => {
  isPhoneError.value = false
}

const togglePasswordVisibility = () => {
  passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password'
}

const togglePassword2Visibility = () => {
  password2FieldType.value = password2FieldType.value === 'password' ? 'text' : 'password'
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

const formatPhoneNumber = () => {
  let phoneNumber = formData.phone.trim()
  if (!phoneNumber) return ''
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = phoneNumber.replace(/[^\d]/g, '')
    if (!phoneNumber) return ''
    if (phoneNumber.startsWith('0')) phoneNumber = phoneNumber.substring(1)
    const dialCode = String(selectedCountry.value?.dialCode || '62').replace(/[^\d]/g, '')
    phoneNumber = `+${dialCode}${phoneNumber}`
  }
  return phoneNumber
}

const sanitizeUsername = (value) => String(value ?? '').replace(/[^a-zA-Z0-9]/g, '')

watch(
  () => formData.username,
  (val) => {
    const sanitized = sanitizeUsername(val)
    if (sanitized !== val) formData.username = sanitized
  }
)

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
    if (code && formData.referralCode !== code) {
      formData.referralCode = code
      showReferral.value = true
    }
  },
  { immediate: true }
)

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})

watch(
  () => locale.value,
  (lang) => {
    applyUiLanguage(lang)
  },
  { immediate: true }
)

const handleRegister = async () => {
  successMessage.value = ''
  generalError.value = ''
  
  // Basic validation
  if (!formData.username.trim() || !formData.phone.trim() || !formData.password || !formData.password2) {
    generalError.value = 'Please fill in all required fields.'
    showErrorModal.value = true
    return
  }

  if (showReferral.value && !String(formData.referralCode || '').trim()) {
    generalError.value = 'Referral code is required.'
    showErrorModal.value = true
    return
  }

  if (formData.password !== formData.password2) {
    generalError.value = 'Passwords do not match.'
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
    // Format phone number with country code
    const phoneNumber = formatPhoneNumber()
    if (!phoneNumber) {
      generalError.value = 'Phone number must be numeric'
      showErrorModal.value = true
      return
    }

    const rand = Math.random().toString(36).slice(2, 10)
    const emailToUse = formData.email?.trim() || `user.${rand}@avr.local`
    const fullNameGenerated = `User ${rand}`
    
    const payload = {
      username: formData.username.trim(),
      phone: phoneNumber,
      email: emailToUse,
      full_name: fullNameGenerated,
      password: formData.password,
      password2: formData.password2,
      referral_code: formData.referralCode?.trim() || '',
      otp: '',
      withdraw_pin: ''
    }
    
    const response = await authAPI.register(payload)
    
    successMessage.value = 'Successfully'
    showSuccessModal.value = true
    
    setTimeout(() => {
      router.push('/login')
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
        rawFallbackLower.includes('rate limit') ||
        rawFallbackLower.includes('too many') ||
        rawFallbackLower.includes('throttle')
      if (isRateLimited) {
        generalError.value = 'Too many attempts. Please try again later.'
        showErrorModal.value = true
        return
      }
      
      if (errorData.username) {
        const usernameErrors = Array.isArray(errorData.username) ? errorData.username : [errorData.username]
        const usernameMessage = usernameErrors.map((x) => String(x || '')).join(' ').toLowerCase()
        const isAlreadyTaken =
          usernameMessage.includes('already') ||
          usernameMessage.includes('exists')
        generalError.value = isAlreadyTaken
          ? 'Username already taken. Please choose another.'
          : 'Invalid data format. Please check your input.'
      } else if (errorData.phone) {
        generalError.value = 'Phone number already in use. Use a different number or login.'
      } else if (errorData.email) {
        generalError.value = 'Email already in use. Use a different email or login.'
      } else if (errorData.referral_code || errorData.referralCode) {
        generalError.value = 'Invalid referral code. Please check and try again.'
      } else {
        generalError.value = 'Invalid data format. Please check your input.'
      }
    } else {
      generalError.value = 'No connection. Please check your network and try again.'
    }
    
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  max-width: 100%;
  margin: 0 auto;
  background-color: #fefefe;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

a {
  text-decoration: none;
}

input {
  font-family: inherit;
}

/* Top Bar Section */
.topbar-container {
  padding: 20px 35px 10px;
  display: flex;
  justify-content: flex-end;
  min-height: auto;
}

.topbar-icons {
  display: flex;
  gap: 20px;
  align-items: center;
}

.icon-download,
.icon-globe {
  width: 24px;
  height: 24px;
  cursor: pointer;
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
.hero-container {
  padding: 10px 20px;
  min-height: auto;
}

.hero-content {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
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
  gap: 8px;
}

.hero-title {
  font-size: 18px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 12px;
  color: #494747;
  margin: 0;
  line-height: 1.4;
}

.hero-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #0073ff;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.icon-arrow-right {
  width: 16px;
  height: 16px;
}

/* Form Section */
.form-container {
  padding: 0px 20px 0;
  min-height: auto;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
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
  padding: 0 15px;
}

.input-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: #000;
  width: 100%;
}

.input-wrapper input::placeholder {
  color: rgba(0, 0, 0, 0.37);
}

.country-code {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 10px;
  font-size: 13px;
  color: #000;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
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

.country-code::after {
  content: '';
  width: 1px;
  height: 16px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-left: 8px;
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

.input-icon-left {
  width: 16px;
  margin-right: 10px;
  opacity: 0.7;
}

.input-icon-right {
  width: 20px;
  cursor: pointer;
  opacity: 0.7;
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
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
}

/* Referral Toggle */
.referral-toggle {
  display: flex;
  background: none;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #000;
  cursor: pointer;
  margin-top: 5px;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.referral-toggle img {
  width: 20px;
}

/* Terms Checkbox */
.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.checkbox-custom {
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 2px;
  cursor: pointer;
}

.checkbox-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #d9d9d9;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.checkbox-bg.active {
  background-color: #1b46f5;
}

.checkbox-mark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  z-index: 1;
}

.terms-text {
  font-size: 14px;
  color: #000;
  margin: 0;
  line-height: 1.4;
}

.terms-text a {
  color: #0073ff;
  text-decoration: none;
}

/* Submit Button */
.btn-primary {
  background-color: #1b46f5;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  height: 53px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1538c4;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Footer Section */
.footer-container {
  padding: 30px 35px 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  min-height: 200px;
}

.footer-links {
  font-size: 13px;
  color: #000;
  margin-top: 10px;
}

.footer-links a {
  color: #0073ff;
  text-decoration: none;
}

.footer-copyright {
  font-size: 12px;
  color: #000;
  
  margin-top: auto;
}
</style>
