<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header" class="header-section">
      <div class="container header-container">
        <div class="header-content">
          <img class="brand-logo" src="/assets/images/108294978d9cad25785261933372f80a0602c03d.png" alt="Dana Proteksi">
          <p class="brand-tagline">Aman, Transparan dan Terpercaya</p>

          <h1 class="page-title">{{ ui.heroTitle }}</h1>
          <p class="page-subtitle">{{ ui.heroSubtitle }}</p>
        </div>
        <img class="hero-illustration" src="/assets/images/7210a5369195691e3aa63bd1fb6d8c025d233ccc.png" alt="Security Illustration">
      </div>
    </section>

    <!-- Form Section -->
    <section id="section-form" class="form-section">
      <div class="container">
        <form class="registration-form" novalidate @submit.prevent="handleRequestOtpAndOpenModal">

          <!-- Username / Signature -->
          <div class="form-group">
            <label class="form-label">{{ ui.signatureLabel }}</label>
            <div class="input-wrapper">
              <img class="input-icon-left" src="/assets/images/8_309.svg" alt="">
              <input
                type="text"
                class="form-input"
                v-model="formData.username"
                :placeholder="ui.signaturePlaceholder"
              >
            </div>
          </div>

          <!-- Phone -->
          <div class="form-group">
            <label class="form-label">{{ ui.phoneLabel }}</label>
            <div class="input-wrapper">
              <img class="input-icon-left" src="/assets/images/8_313.svg" alt="">
              <input
                type="tel"
                class="form-input"
                v-model="formData.phone"
                :placeholder="ui.phonePlaceholder"
                @blur="checkPhoneError"
                @focus="clearPhoneError"
              >
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="form-label">{{ ui.emailLabel }}</label>
            <div class="input-wrapper">
              <img class="input-icon-left" src="/assets/images/8_309.svg" alt="">
              <input
                type="email"
                class="form-input"
                v-model="formData.email"
                :placeholder="ui.emailPlaceholder"
              >
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">{{ ui.passwordLabel }}</label>
            <div class="input-wrapper">
              <img class="input-icon-left" src="/assets/images/8_317.svg" alt="">
              <input
                :type="passwordFieldType"
                class="form-input has-right-icon"
                v-model="formData.password"
                :placeholder="ui.passwordPlaceholder"
              >
              <img
                class="input-icon-right"
                src="/assets/images/8_109.svg"
                alt="Toggle Password Visibility"
                @click="togglePasswordVisibility"
              >
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label class="form-label">{{ ui.confirmPasswordLabel }}</label>
            <div class="input-wrapper">
              <img class="input-icon-left" src="/assets/images/8_319.svg" alt="">
              <input
                :type="password2FieldType"
                class="form-input has-right-icon"
                v-model="formData.password2"
                :placeholder="ui.confirmPasswordPlaceholder"
              >
              <img
                class="input-icon-right"
                src="/assets/images/8_113.svg"
                alt="Toggle Password Visibility"
                @click="togglePassword2Visibility"
              >
            </div>
          </div>

          <!-- Referral Code -->
          <div class="form-group">
            <label class="form-label">{{ ui.referralLabel }}</label>
            <div class="input-wrapper">
              <img class="input-icon-left" src="/assets/images/8_324.svg" alt="">
              <input
                type="text"
                class="form-input"
                v-model="formData.referralCode"
                :placeholder="ui.referralPlaceholder"
                required
              >
            </div>
          </div>

        </form>
      </div>
    </section>

    <!-- Actions Section -->
    <section id="section-actions" class="actions-section">
      <div class="container">

        <!-- Terms Checkbox -->
        <div class="terms-container">
          <div class="checkbox-wrapper" @click="isTermsAccepted = !isTermsAccepted">
            <div class="custom-checkbox" :class="{ active: isTermsAccepted }">
              <img v-if="isTermsAccepted" src="/assets/images/I8_281_51859_5632.svg" alt="Checked">
            </div>
          </div>
          <p class="terms-text">
            {{ ui.agreementPrefix }}
            <strong @click="$router.push('/hn/legal/privacy')">{{ ui.privacyPolicy }}</strong>
            {{ ui.andWord }}
            <strong @click="$router.push('/hn/legal/terms')">{{ ui.termsOfService }}</strong>
          </p>
        </div>

        <!-- Slider Captcha -->
        <div class="slider-container" ref="sliderCaptchaRef">
          <div class="slider-track" :class="{ 'slider-verified': sliderVerified }">
            <span class="slider-text">{{ sliderVerified ? ui.sliderVerified : ui.sliderHint }}</span>
          </div>
          <img
            class="slider-thumb"
            src="/assets/images/9aafab34419c92ae6d76b07f598384e4b00a88a6.png"
            alt="Slide to continue"
            :style="{ left: sliderLeft + 'px' }"
            @mousedown="onSliderStart"
            @touchstart.prevent="onSliderStart"
          >
        </div>

        <!-- Buttons -->
        <div class="button-group">
          <button type="button" class="btn btn-primary" :disabled="isLoading || isRequestingOtp" @click="handleRequestOtpAndOpenModal">
            <LoadingSpinner v-if="isLoading" :visible="true" message="" />
            <span v-else>{{ ui.signUp }}</span>
          </button>
          <button type="button" class="btn btn-secondary" @click="$router.push('/hn/console')">
            {{ ui.signIn }}
          </button>
        </div>

      </div>
    </section>

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
import ErrorModal from '../../components/modals/AppErrorModal.vue'
import SuccessModal from '../../components/modals/AppSuccessModal.vue'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

const EN_UI = Object.freeze({
  heroTitle: 'Create Account',
  heroSubtitle: 'Fill in your details to create a new account',
  heroLink: 'Sign up to console with email',
  phoneLabel: 'Phone Number',
  phonePlaceholder: '08xxxxxxxxx',
  emailLabel: 'Email',
  emailPlaceholder: 'Enter your email',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Create password',
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordPlaceholder: 'Repeat your password',
  signatureLabel: 'Full Name',
  signaturePlaceholder: 'Enter your mobile number',
  referralToggle: "Referrer's Referral Code",
  referralLabel: 'Referral Code (required)',
  referralPlaceholder: 'Enter invitation code',
  agreementPrefix: 'I agree to the',
  customerAgreement: 'Customer Agreement',
  termsOfService: 'Terms of Service',
  andWord: 'and',
  privacyPolicy: 'Privacy Policy',
  signUp: 'Register',
  alreadyHaveAccount: 'Already have account?',
  signIn: 'Sign In',
  sliderHint: 'Slide the arrow to continue',
  sliderVerified: 'Verified'
})

const ID_UI_FALLBACK = Object.freeze({
  heroTitle: 'Buat Akun',
  heroSubtitle: 'Isi data diri Anda untuk membuat akun baru',
  heroLink: 'Daftar ke konsol dengan email',
  phoneLabel: 'Nomor Handphone',
  phonePlaceholder: '08xxxxxxxxx',
  emailLabel: 'Email',
  emailPlaceholder: 'Masukkan email Anda',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Buat password',
  confirmPasswordLabel: 'Konfirmasi Password',
  confirmPasswordPlaceholder: 'Ulangi password Anda',
  signatureLabel: 'Nama Lengkap',
  signaturePlaceholder: 'Masukkan nomor ponsel Anda',
  referralToggle: 'Kode Referral Pengundang',
  referralLabel: 'Kode Referral (wajib)',
  referralPlaceholder: 'Masukkan kode undangan',
  agreementPrefix: 'Saya setuju dengan',
  customerAgreement: 'Perjanjian Pelanggan',
  termsOfService: 'Syarat Layanan',
  andWord: 'dan',
  privacyPolicy: 'Kebijakan Privasi',
  signUp: 'Daftar',
  alreadyHaveAccount: 'Sudah punya akun?',
  signIn: 'Masuk',
  sliderHint: 'Geser panah ini untuk melanjutkan login',
  sliderVerified: 'Terverifikasi'
})

const ui = ref({ ...EN_UI })

const MT_BASE_URL = String(import.meta?.env?.VITE_MT_API_URL || '').replace(/\/$/, '')
const MT_API_KEY = String(import.meta?.env?.VITE_MT_API_KEY || localStorage.getItem('mt_api_key') || '').trim()
const mtUrl = (path) => (MT_BASE_URL ? `${MT_BASE_URL}${path}` : path)
const MT_CACHE_TTL_MS = 365 * 24 * 60 * 60 * 1000
const MT_CACHE_MAX_ENTRIES = 500
const mtCacheKey = (target) => `mt_cache_v2_${target}`
const mtLegacyCacheKey = (target) => `mt_cache_v1_${target}`

const getMtCache = (target) => {
  try {
    const now = Date.now()
    const raw = localStorage.getItem(mtCacheKey(target))
    const rawLegacy = localStorage.getItem(mtLegacyCacheKey(target))
    const current = raw ? JSON.parse(raw) : {}
    const legacy = rawLegacy ? JSON.parse(rawLegacy) : {}
    const merged = { ...(legacy || {}), ...(current || {}) }
    const out = {}
    for (const k of Object.keys(merged || {})) {
      const v = merged[k]
      if (typeof v === 'string') {
        out[k] = { v, e: now + MT_CACHE_TTL_MS }
        continue
      }
      if (v && typeof v === 'object') {
        const text = typeof v.v === 'string' ? v.v : ''
        const exp = Number(v.e || 0)
        if (!text) continue
        if (exp > 0 && exp <= now) continue
        out[k] = { v: text, e: now + MT_CACHE_TTL_MS }
      }
    }
    return out
  } catch (_) {
    return {}
  }
}

const setMtCache = (target, cacheObj) => {
  try {
    const now = Date.now()
    const keys = Object.keys(cacheObj || {})
    for (const k of keys) {
      const ent = cacheObj[k]
      const exp = Number(ent?.e || 0)
      if (exp > 0 && exp <= now) delete cacheObj[k]
    }
    const remaining = Object.keys(cacheObj || {})
    if (remaining.length > MT_CACHE_MAX_ENTRIES) {
      remaining.sort((a, b) => (Number(cacheObj[a]?.e || 0) - Number(cacheObj[b]?.e || 0)))
      const removeCount = remaining.length - MT_CACHE_MAX_ENTRIES
      for (let i = 0; i < removeCount; i += 1) delete cacheObj[remaining[i]]
    }
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
    const ent = cache[t]
    const exp = Number(ent?.e || 0)
    const isExpired = exp > 0 && exp <= Date.now()
    const cachedText = !isExpired && typeof ent?.v === 'string' ? ent.v : ''
    if (cachedText) {
      out.set(t, cachedText)
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
      out.set(t, '')
    }
    return out
  }

  if (translatedList.length !== missing.length) {
    throw new Error('translate_shape_mismatch')
  }

  for (let i = 0; i < missing.length; i += 1) {
    const srcText = missing[i]
    const trText = String(translatedList[i] ?? '')
    if (trText) {
      cache[srcText] = { v: trText, e: Date.now() + MT_CACHE_TTL_MS }
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
const OTP_COOLDOWN_MS = 120000
const lastOtpRequestAt = ref(0)

// Slider captcha state
const sliderCaptchaRef = ref(null)
const sliderLeft = ref(-10)
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
  if (newLeft < -10) newLeft = -10
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
    sliderLeft.value = -10
  }
}

try {
  const saved = Number(localStorage.getItem('last_otp_request_at') || 0)
  if (Number.isFinite(saved) && saved > 0) lastOtpRequestAt.value = saved
} catch (_) {}

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
    return false
  }

  const now = Date.now()
  const remainingMs = OTP_COOLDOWN_MS - (now - (lastOtpRequestAt.value || 0))
  if (remainingMs > 0) {
    showErrorModal.value = true
    generalError.value = 'Tunggu 2 menit untuk minta OTP lagi.'
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
    lastOtpRequestAt.value = now
    try {
      localStorage.setItem('last_otp_request_at', String(now))
    } catch (_) {}
    successMessage.value = 'OTP sent successfully'
    showSuccessModal.value = true
    otpModalOpen.value = true
    setTimeout(() => {
      if (otpInput.value) otpInput.value.focus()
    }, 120)
    return true
  } catch (err) {
    if (err?.response?.status === 503) {
      otpActiveOverride.value = false
      otpRequiredOverride.value = false
      otpModalOpen.value = false
      formData.otp = ''
      return false
    }
    generalError.value = extractOtpErrorMessage(err)
    showErrorModal.value = true
    return null
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
  }
  if (!String(formData.referralCode || '').trim()) return showError('Referral code wajib diisi.')

  if (formData.password !== formData.password2) {
    return showError('Passwords do not match.')
  }

  if (!isTermsAccepted.value) {
    return showError('Please agree to the Customer Agreement, Terms of Service and Privacy Policy.')
  }

  if (!sliderVerified.value) {
    return showError('Please complete the slider verification.')
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
    return handleRegister({ forceNoOtp: true })
  }

  const sent = await requestOtp()
  if (sent === false) {
    return handleRegister({ forceNoOtp: true })
  }
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

const handleRegister = async (opts = {}) => {
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
  const forceNoOtp = Boolean(opts?.forceNoOtp)
  const retriedWithoutOtp = Boolean(opts?.retriedWithoutOtp)

  if (!phoneRaw) return showError('Nomor wajib diisi.')
  if (!email) return showError('Email wajib diisi.')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Format email tidak valid.')
  if (!password) return showError('Password wajib diisi.')
  if (!password2) return showError('Konfirmasi password wajib diisi.')
  if (!username) return showError('Signature wajib diisi.')
  if (!forceNoOtp && otpRequired.value && !otp) return showError('OTP wajib diisi.')

  if (showReferral.value && !String(formData.referralCode || '').trim()) {
  }
  if (!String(formData.referralCode || '').trim()) return showError('Referral code wajib diisi.')

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
      withdraw_pin: ''
    }
    if (!forceNoOtp && otpActive.value) payload.otp = otp
    
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
      const rawErrorData = error.response.data
      const errorData =
        rawErrorData && typeof rawErrorData === 'object' && !Array.isArray(rawErrorData)
          ? (() => {
              const { error_step, ...rest } = rawErrorData || {}
              return rest
            })()
          : rawErrorData
      const rawFallback = String(errorData?.detail || errorData?.message || error?.message || '')
      const rawFallbackLower = rawFallback.toLowerCase()
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
          ? 'Username sudah digunakan'
          : 'Invalid data format. Please check your input.'
      } else if (errorData.phone) {
        const phoneErrors = Array.isArray(errorData.phone) ? errorData.phone : [errorData.phone]
        const phoneMessage = phoneErrors.map((x) => String(x || '')).join(' ').toLowerCase()
        const phoneCompact = phoneMessage.replace(/\s+/g, '')
        const isAlreadyRegistered =
          phoneMessage.includes('already registered') ||
          phoneMessage.includes('phone number is already registered') ||
          phoneCompact.includes('alreadyregistered')
        if (isAlreadyRegistered) {
          generalError.value = 'already registered'
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
          if (!retriedWithoutOtp) {
            return await handleRegister({ forceNoOtp: true, retriedWithoutOtp: true })
          }
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
        const emailErrors = Array.isArray(errorData.email) ? errorData.email : [errorData.email]
        const emailMessage = emailErrors.map((x) => String(x || '')).join(' ').toLowerCase()
        const isEmailRegistered = emailMessage.includes('already') || emailMessage.includes('exists') || emailMessage.includes('registered')
        generalError.value = isEmailRegistered ? 'Email sudah terdaftar' : 'Format email tidak valid.'
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
  margin: 0;
  padding: 0;
}

.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 100%;
  background: linear-gradient(180deg, #FEFDFE 0%, #FDF8EA 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  width: 100%;
  max-width: 412px;
  padding: 0 20px;
  box-sizing: border-box;
  margin: 0 auto;
}

input, button {
  font-family: 'Inter', sans-serif;
}

a {
  text-decoration: none;
}

/* Header Section */
.header-section {
  width: 100%;
  max-width: 412px;
  padding-top: 40px;
  padding-bottom: 20px;
}

.header-container {
  position: relative;
}

.header-content {
  position: relative;
  z-index: 2;
  max-width: 60%;
}

.brand-logo {
  height: 67px;
  object-fit: contain;
  margin-bottom: 0;
}

.brand-tagline {
  font-size: 10px;
  color: #635f5f;
  margin-top: 0;
  margin-bottom: 24px;
  margin-left: 4px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 12px;
  color: #635f5f;
  margin: 0;
  line-height: 1.4;
}

.hero-illustration {
  position: absolute;
  top: 20px;
  right: -10px;
  width: 154px;
  height: auto;
  z-index: 1;
}

/* Form Section */
.form-section {
  width: 100%;
  max-width: 412px;
  padding-top: 5px;
}

.registration-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
  margin-left: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon-left {
  position: absolute;
  left: 16px;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.input-icon-right {
  position: absolute;
  right: 16px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.form-input {
  width: 100%;
  height: 53px;
  background-color: #ffffff;
  border: 1px solid #ababab;
  border-radius: 15px;
  padding: 0 44px;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #000000;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #f4bd40;
}

.form-input::placeholder {
  color: #635f5f;
}

.form-input.has-right-icon {
  padding-right: 44px;
}

/* Actions Section */
.actions-section {
  width: 100%;
  max-width: 412px;
  padding-top: 10px;
  padding-bottom: 0px;
}

.terms-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 4px;
  padding: 0 4px;
}

.checkbox-wrapper {
  padding-top: 2px;
  cursor: pointer;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  background-color: #d9d9d9;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.custom-checkbox.active {
  background-color: #f4bd40;
}

.custom-checkbox img {
  width: 14px;
  height: 14px;
}

.terms-text {
  font-size: 12px;
  color: #635f5f;
  line-height: 1.5;
  margin: 0;
}

.terms-text strong {
  color: #a67c00;
  font-weight: 600;
  cursor: pointer;
}

/* Slider Captcha */
.slider-container {
  position: relative;
  height: 60px;
  margin-bottom: 0px;
  display: flex;
  align-items: center;
}

.slider-track {
  width: 100%;
  height: 30px;
  background-color: #f4bd40;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  transition: background-color 0.3s;
}

.slider-track.slider-verified {
  background-color: #4caf50;
}

.slider-text {
  font-size: 12px;
  color: #4f4f4f;
  margin-left: 20px;
  user-select: none;
}

.slider-track.slider-verified .slider-text {
  color: #ffffff;
  margin-left: 0;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 60px;
  cursor: pointer;
  z-index: 2;
  user-select: none;
  -webkit-user-drag: none;
}

/* Buttons */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  width: 100%;
  height: 60px;
  border-radius: 15px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s;
}

.btn:active {
  opacity: 0.8;
}

.btn-primary {
  background-color: #000000;
  color: #ffffff;
  border: 1px solid #000000;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: transparent;
  color: #000000;
  border: 1px solid #978d00;
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

/* OTP Modal */
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
</style>
