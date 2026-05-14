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
          <img src="/assets/image/Logo01.png" alt="HUE Logo" class="hero-logo">
          <div class="hero-text">
            <h1 class="hero-title">{{ ui.heroTitle }}</h1>
            <p class="hero-subtitle">{{ ui.heroSubtitle }}</p>
          </div>
        </div>
        <!-- <router-link to="/pages/register" class="hero-link">
          {{ ui.heroLink }}
          <img src="/assets/image/4255_218.svg" alt="Arrow Right" class="icon-arrow-right">
        </router-link> -->
      </div>
    </section>

    <!-- Form Section -->
    <section id="section-form">
      <div class="form-container">
        <form class="registration-form" novalidate @submit.prevent="handleRequestOtpAndOpenModal">

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
              <button v-if="otpActive" type="button" class="otp-btn" @click="requestOtp" :disabled="isLoading || isRequestingOtp">
                {{ isRequestingOtp ? '...' : 'OTP' }}
              </button>
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
              <router-link to="/hn/legal/agreement">{{ ui.customerAgreement }}</router-link>,
              <router-link to="/hn/legal/terms">{{ ui.termsOfService }}</router-link>
              {{ ui.andWord }}
              <router-link to="/hn/legal/privacy">{{ ui.privacyPolicy }}</router-link>
            </p>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn-primary" :disabled="isLoading || isRequestingOtp">
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
          <span>{{ ui.alreadyHaveAccount }}</span> <router-link to="/hn/console">{{ ui.signIn }}</router-link>
        </div>
        <div class="footer-copyright">
          &copy; 2026 HUE System. All rights reserved.
        </div>
      </div>
    </section>

    <!-- Modals -->
    <div v-if="otpActive && otpModalOpen" id="section-otp-modal" @click.self="closeOtpModal">
      <div class="otp-modal-container">
        <div class="otp-card">
          <div class="otp-card-header">
            <p class="otp-description">Enter OTP</p>
          </div>

          <div class="otp-input-box">
            <input
              ref="otpInput"
              v-model="formData.otp"
              type="text"
              class="otp-input"
              placeholder="---"
              inputmode="numeric"
              autocomplete="one-time-code"
              @keyup.enter="submitRegisterFromOtpModal"
            >
          </div>

          <div class="otp-actions">
            <button class="otp-action otp-action--primary" type="button" @click="submitRegisterFromOtpModal" :disabled="isLoading || isRequestingOtp">
              Confirm
            </button>
            <button class="otp-action otp-action--secondary" type="button" @click="closeOtpModal" :disabled="isLoading || isRequestingOtp">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

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
import { appSettings } from '@/utils/settings'
import CountrySelector from '../../components/CountrySelector.vue'
import ErrorModal from '../../components/modals/ErrorModal.vue'
import SuccessModal from '../../components/modals/SuccessModal.vue'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

const EN_UI = Object.freeze({
  heroTitle: 'Join HUE and access advanced Cloud system features!',
  heroSubtitle: 'Join thousands of users and experience smart Cloud-powered resource management',
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
  heroTitle: 'Bergabung dengan HUE dan akses fitur sistem Cloud canggih!',
  heroSubtitle: 'Bergabunglah dengan ribuan pengguna dan rasakan manajemen sumber daya berbasis Cloud yang cerdas',
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
  otp: '',
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
const isRequestingOtp = ref(false)
const otpModalOpen = ref(false)
const otpInput = ref(null)
const otpActiveOverride = ref(null)
const otpRequiredOverride = ref(null)

const toBool = (v) => {
  if (typeof v === 'boolean') return v
  if (typeof v === 'number') return v !== 0
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase()
    if (s === 'true' || s === '1' || s === 'yes' || s === 'y' || s === 'on') return true
    if (s === 'false' || s === '0' || s === 'no' || s === 'n' || s === 'off') return false
  }
  return null
}

const pickFirstBool = (values) => {
  for (const v of values) {
    const b = toBool(v)
    if (b !== null) return b
  }
  return null
}

const otpActive = computed(() => {
  const override = otpActiveOverride.value
  if (override === true) return true
  if (override === false) return false

  const s = appSettings.settings || {}
  const direct = pickFirstBool([
    s.otp_enabled,
    s.otp_active,
    s.otp_is_active,
    s.is_otp_active,
    s.register_otp_enabled,
    s.otp_service_enabled,
    s.whatsapp_otp_enabled
  ])
  if (direct !== null) return direct

  const nested = s.otp && typeof s.otp === 'object'
    ? pickFirstBool([s.otp.enabled, s.otp.active, s.otp.is_active, s.otp.service_enabled])
    : null
  if (nested !== null) return nested

  return true
})

const otpRequired = computed(() => {
  const override = otpRequiredOverride.value
  if (override === true) return true
  if (override === false) return false

  const s = appSettings.settings || {}
  const direct = pickFirstBool([
    s.otp_required,
    s.register_otp_required,
    s.is_register_otp_required
  ])
  if (direct !== null) return direct

  const nested = s.otp && typeof s.otp === 'object'
    ? pickFirstBool([s.otp.required, s.otp.is_required, s.otp.register_required])
    : null
  if (nested !== null) return nested

  return false
})

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

const extractOtpErrorMessage = (err) => {
  const status = err?.response?.status
  if (status === 503) return 'OTP service disabled'
  const data = err?.response?.data
  if (!data) return err?.message || 'OTP sending failed'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'OTP sending failed'
}

const requestOtp = async () => {
  if (isLoading.value || isRequestingOtp.value) return
  if (!otpActive.value) {
    showErrorModal.value = true
    generalError.value = 'OTP tidak aktif'
    return
  }
  showErrorModal.value = false
  generalError.value = ''
  showSuccessModal.value = false
  successMessage.value = ''

  const phoneNumber = formatPhoneNumber()
  if (!phoneNumber) {
    generalError.value = 'Phone number must be numeric'
    showErrorModal.value = true
    return
  }

  isRequestingOtp.value = true
  try {
    await authAPI.requestOTP(phoneNumber)
    successMessage.value = 'OTP sent successfully'
    showSuccessModal.value = true
    otpModalOpen.value = true
    setTimeout(() => {
      if (otpInput.value) otpInput.value.focus()
    }, 120)
  } catch (err) {
    if (err?.response?.status === 503) {
      otpActiveOverride.value = false
      otpRequiredOverride.value = false
      otpModalOpen.value = false
      formData.otp = ''
      generalError.value = 'OTP tidak aktif'
      showErrorModal.value = true
      return
    }
    generalError.value = extractOtpErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isRequestingOtp.value = false
  }
}

const closeOtpModal = () => {
  if (isLoading.value || isRequestingOtp.value) return
  otpModalOpen.value = false
}

const handleRequestOtpAndOpenModal = async () => {
  successMessage.value = ''
  generalError.value = ''
  showErrorModal.value = false

  const showError = (msg) => {
    generalError.value = msg
    showErrorModal.value = true
  }

  const username = String(formData.username || '').trim()
  const phoneRaw = String(formData.phone || '').trim()
  const email = String(formData.email || '').trim()
  const password = String(formData.password || '')
  const password2 = String(formData.password2 || '')

  if (!phoneRaw) return showError('Nomor wajib diisi.')
  if (!email) return showError('Email wajib diisi.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Format email tidak valid.')
  if (!password) return showError('Password wajib diisi.')
  if (!password2) return showError('Konfirmasi password wajib diisi.')
  if (!username) return showError('Signature wajib diisi.')

  if (showReferral.value && !String(formData.referralCode || '').trim()) {
    return showError('Referral code wajib diisi.')
  }

  if (formData.password !== formData.password2) {
    return showError('Passwords do not match.')
  }

  if (!isTermsAccepted.value) {
    return showError('Please agree to the Customer Agreement, Terms of Service and Privacy Policy.')
  }

  if (!generatedCaptcha.value) {
    refreshCaptcha()
  }
  formData.captcha = generatedCaptcha.value

  const phoneNumber = formatPhoneNumber()
  if (!phoneNumber) {
    return showError('Phone number must be numeric')
  }

  if (!otpActive.value) {
    return handleRegister()
  }

  await requestOtp()
}

const submitRegisterFromOtpModal = async () => {
  if (isLoading.value || isRequestingOtp.value) return
  await handleRegister()
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
  showErrorModal.value = false
  
  const showError = (msg) => {
    generalError.value = msg
    showErrorModal.value = true
  }

  const username = String(formData.username || '').trim()
  const phoneRaw = String(formData.phone || '').trim()
  const email = String(formData.email || '').trim()
  const otp = String(formData.otp || '').trim()
  const password = String(formData.password || '')
  const password2 = String(formData.password2 || '')

  if (!phoneRaw) return showError('Nomor wajib diisi.')
  if (!email) return showError('Email wajib diisi.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Format email tidak valid.')
  if (!password) return showError('Password wajib diisi.')
  if (!password2) return showError('Konfirmasi password wajib diisi.')
  if (!username) return showError('Signature wajib diisi.')
  if (otpRequired.value && !otp) return showError('OTP wajib diisi.')

  if (showReferral.value && !String(formData.referralCode || '').trim()) {
    return showError('Referral code wajib diisi.')
  }

  if (formData.password !== formData.password2) {
    return showError('Passwords do not match.')
  }

  if (!isTermsAccepted.value) {
    return showError('Please agree to the Customer Agreement, Terms of Service and Privacy Policy.')
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
      return showError('Phone number must be numeric')
    }

    const rand = Math.random().toString(36).slice(2, 10)
    const emailToUse = email
    const fullNameGenerated = `User ${rand}`
    
    const payload = {
      username: formData.username.trim(),
      phone: phoneNumber,
      email: emailToUse,
      full_name: fullNameGenerated,
      password: formData.password,
      password2: formData.password2,
      referral_code: formData.referralCode?.trim() || '',
      otp: otpActive.value ? otp : '',
      withdraw_pin: ''
    }
    
    const response = await authAPI.register(payload)
    
    successMessage.value = 'Successfully'
    showSuccessModal.value = true
    otpModalOpen.value = false
    
    setTimeout(() => {
      router.push('/hn/console')
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
        const phoneErrors = Array.isArray(errorData.phone) ? errorData.phone : [errorData.phone]
        const phoneMessage = phoneErrors.map((x) => String(x || '')).join(' ').toLowerCase()
        const phoneCompact = phoneMessage.replace(/\s+/g, '')
        const step = String(errorData?.error_step || '').toLowerCase()
        const isAlreadyRegistered =
          step === 'db_check' &&
          (phoneMessage.includes('already registered') || phoneCompact.includes('alreadyregistered'))
        if (isAlreadyRegistered) {
          generalError.value = 'Already registered'
          showErrorModal.value = true
          return
        }
        const looksLikeNoWhatsapp =
          phoneMessage.includes('whatsapp') ||
          phoneCompact.includes('phonahasnowhatsapp') ||
          phoneMessage.includes('tidak terdeteksi') && phoneMessage.includes('whatsapp')
        generalError.value = looksLikeNoWhatsapp
          ? 'Tidak ada whatsapp'
          : 'Phone number already in use. Use a different number or login.'
      } else if (errorData.otp) {
        const otpErrors = Array.isArray(errorData.otp) ? errorData.otp : [errorData.otp]
        const otpMessage = otpErrors.map((x) => String(x || '')).join(' ').toLowerCase()
        const otpCompact = otpMessage.replace(/\s+/g, '')
        const isOtpDisabled =
          otpMessage.includes('service') && otpMessage.includes('disabled') ||
          otpMessage.includes('otp service disabled') ||
          otpMessage.includes('otp tidak aktif')
        if (isOtpDisabled) {
          otpActiveOverride.value = false
          otpRequiredOverride.value = false
          formData.otp = ''
          otpModalOpen.value = false
          generalError.value = 'OTP tidak aktif'
        } else {
          const isOtpMissing =
            otpMessage.includes('required') ||
            otpMessage.includes('must be filled') ||
            otpMessage.includes('must be provided') ||
            otpMessage.includes('may not be blank') ||
            otpMessage.includes('missing')

          const isOtpRequiredByServer =
            otpCompact.includes('otpcodeisrequired') ||
            (otpMessage.includes('otp') && isOtpMissing)

          if (isOtpRequiredByServer) {
            otpActiveOverride.value = true
            otpRequiredOverride.value = true
            generalError.value = 'OTP wajib diisi.'
            otpModalOpen.value = true
            setTimeout(() => {
              if (otpInput.value) otpInput.value.focus()
            }, 120)
          } else {
            otpActiveOverride.value = true
            generalError.value = 'Invalid OTP'
            otpModalOpen.value = true
            setTimeout(() => {
              if (otpInput.value) otpInput.value.focus()
            }, 120)
          }
        }
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
  font-size: 14px;
  color: #494747;
  margin: 0;
  line-height: 1.4;
}

.hero-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #0073ff;
  font-size: 15px;
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

.otp-btn {
  height: 43px;
  padding: 0 12px;
  border: none;
  background: #1b46f5;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 4px;
  flex: 0 0 auto;
}

.otp-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

#section-otp-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #7d7d7d;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
  padding: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.otp-modal-container {
  max-width: 412px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.otp-card {
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

.otp-card-header {
  width: 100%;
  padding-right: 0px;
  display: flex;
  justify-content: center;
}

.otp-description {
  width: 100%;
  margin: 0;
  font-size: 18px;
  text-align: center;
  line-height: 1.4;
  color: #000000;
  font-weight: 500;
  z-index: 2;
}

.otp-input-box {
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

.otp-input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  outline: none;
  font-family: 'Inter', sans-serif;
  letter-spacing: 4px;
}

.otp-actions {
  width: 330px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.otp-action {
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

.otp-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.otp-action--primary {
  background: linear-gradient(90deg, #4085e1 0%, #2757b7 100%);
}

.otp-action--secondary {
  background-color: #0cb300;
}

.otp-action:hover {
  opacity: 0.9;
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
  width: 22px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
}

.input-icon-left {
  width: 20px;
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
  font-size: 15px;
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
  font-size: 15px;
  color: #000;
  margin-top: 10px;
}

.footer-links a {
  color: #0073ff;
  text-decoration: none;
}

.footer-copyright {
  font-size: 14px;
  color: #000;
  
  margin-top: auto;
}
</style>
