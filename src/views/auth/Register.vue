<template>
  <section id="register-page">
    <!-- Header Section -->
    <section id="section-header">
      <div class="container">
        <header class="app-header">
          <button class="icon-btn back-btn" @click.prevent="router.push('/')" aria-label="Go back">
            <img src="/assets/images/8_18.svg" alt="Back">
          </button>
          <router-link to="/login" class="login-link">Masuk</router-link>
        </header>
      </div>
    </section>

    <!-- Hero Section -->
    <section id="section-hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="main-title">Daftar ke TRIVEX</h1>
          <p class="subtitle">Buat akun untuk mulai memiliki aset masa depan. Lengkapi kotak di bawah ini.</p>
        </div>
      </div>
    </section>

    <!-- Form Section -->
    <section id="section-form">
      <div class="container">
        <form class="registration-form" @submit.prevent="handleRegister">
          <!-- Username -->
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-container">
              <input 
                type="text" 
                id="username" 
                v-model="formData.username"
                placeholder="Buat username"
              >
            </div>
          </div>

          <!-- Telepon -->
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

          <!-- Kata sandi -->
          <div class="form-group">
            <label for="password">Kata sandi</label>
            <div class="input-container">
              <input 
                :type="passwordFieldType" 
                id="password" 
                v-model="formData.password"
                placeholder="Tambahkan kata sandi"
              >
              <button type="button" class="suffix-btn" @click="togglePasswordVisibility" aria-label="Toggle password visibility">
                <img :src="passwordFieldType === 'password' ? '/assets/images/8_54.svg' : '/assets/images/8_56.svg'" alt="Show password">
              </button>
            </div>
          </div>

          <!-- Konfirmasi kata sandi -->
          <div class="form-group">
            <label for="confirm-password">Konfirmasi kata sandi</label>
            <div class="input-container">
              <input 
                :type="password2FieldType" 
                id="confirm-password" 
                v-model="formData.password2"
                placeholder="Masukkan ulang kata sandi"
              >
              <button type="button" class="suffix-btn" @click="togglePassword2Visibility" aria-label="Toggle password visibility">
                <img :src="password2FieldType === 'password' ? '/assets/images/8_54.svg' : '/assets/images/8_56.svg'" alt="Show password">
              </button>
            </div>
          </div>

          <!-- Password Requirements -->
          <div class="password-rules">
            <p class="rules-desc">Pastikan password unik tidak mudah ditebak untuk menjaga keamanan akun kamu!</p>
            <div class="rules-grid">
              <div class="rule-item">
                <div class="custom-checkbox" :class="{ checked: passwordRules.minLength }">
                  <img v-if="passwordRules.minLength" src="/assets/images/I2011_1097_497_5178.svg" alt="Checked">
                </div>
                <span>Minimal 8 karakter</span>
              </div>
              <div class="rule-item">
                <div class="custom-checkbox" :class="{ checked: passwordRules.hasUpperLower }">
                  <img v-if="passwordRules.hasUpperLower" src="/assets/images/I2011_1100_497_5178.svg" alt="Checked">
                </div>
                <span>Huruf besar & kecil</span>
              </div>
              <div class="rule-item">
                <div class="custom-checkbox" :class="{ checked: passwordRules.hasNumber }">
                  <img v-if="passwordRules.hasNumber" src="/assets/images/I2011_1099_497_5178.svg" alt="Checked">
                </div>
                <span>Mengandung angka</span>
              </div>
              <div class="rule-item">
                <div class="custom-checkbox" :class="{ checked: passwordRules.hasSpecial }">
                  <img v-if="passwordRules.hasSpecial" src="/assets/images/I2011_1101_497_5178.svg" alt="Checked">
                </div>
                <span>Spesial karakter, cth: !@#</span>
              </div>
            </div>
          </div>

          <!-- Referral kode -->
          <div class="form-group">
            <label for="referral">Referral kode</label>
            <div class="input-container">
              <input 
                type="text" 
                id="referral" 
                v-model="formData.referralCode"
                placeholder="Masukkan referral ID teman"
              >
              <button type="button" class="suffix-btn scan-btn" aria-label="Scan QR code">
                <img src="/assets/images/8dbda20f098f87f8eea6903d791f4e6ad206695b.png" alt="Scan">
              </button>
            </div>
            <p class="input-helper">Pastikan referral ID yang dimasukkan sudah benar.</p>
          </div>

          <!-- Captcha -->
          <div class="form-group">
            <label for="captcha">Captcha</label>
            <div class="input-container">
              <input 
                type="text" 
                id="captcha" 
                v-model="formData.captcha"
                placeholder="Masukkan kode Captcha"
              >
              <button type="button" class="text-action-btn" @click="refreshCaptcha">Minta kode</button>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="terms-container">
            <div class="custom-checkbox align-top" @click="isTermsAccepted = !isTermsAccepted">
              <img v-if="isTermsAccepted" src="/assets/images/I2011_1098_497_5178.svg" alt="Checked">
            </div>
            <p class="terms-text">Pastikan Anda telah membaca keseluruhan <router-link to="/terms" class="terms-link">Syarat dan Ketentuan</router-link>, <router-link to="/privacy" class="terms-link">Kebijakan Privasi</router-link> sebelum melanjutkan pendaftaran</p>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-button" :disabled="isLoading">
            <LoadingSpinner v-if="isLoading" :visible="true" message="" />
            <span v-else>Mulai akun</span>
          </button>
        </form>
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
  </section>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { authAPI } from '../../services/api'
import ErrorModal from '../../components/modals/ErrorModal.vue'
import SuccessModal from '../../components/modals/SuccessModal.vue'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()

const formData = reactive({
  username: '',
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
    phoneNumber = `+62${phoneNumber}`
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
    if (code && formData.referralCode !== code) formData.referralCode = code
  },
  { immediate: true }
)

const handleRegister = async () => {
  successMessage.value = ''
  generalError.value = ''
  
  // Basic validation
  if (!formData.username.trim() || !formData.phone.trim() || !formData.password || !formData.password2) {
    generalError.value = 'Mohon lengkapi seluruh data pengisian yang diperlukan.'
    showErrorModal.value = true
    return
  }

  if (formData.password !== formData.password2) {
    generalError.value = 'Pastikan kata sandi dan konfirmasi sama.'
    showErrorModal.value = true
    return
  }

  if (!generatedCaptcha.value) {
    generalError.value = 'Silakan tekan "Minta kode" untuk mendapatkan captcha'
    showErrorModal.value = true
    return
  }

  if (!String(formData.captcha || '').trim()) {
    generalError.value = 'Captcha harus diisi'
    showErrorModal.value = true
    return
  }

  if (String(formData.captcha).trim().toUpperCase() !== String(generatedCaptcha.value).toUpperCase()) {
    generalError.value = 'Captcha tidak sesuai'
    showErrorModal.value = true
    return
  }

  if (!isTermsAccepted.value) {
    generalError.value = 'Persetujuan terhadap Syarat dan Ketentuan diperlukan sebelum melanjutkan.'
    showErrorModal.value = true
    return
  }
  
  isLoading.value = true
  
  try {
    // Format phone number with country code
    const phoneNumber = formatPhoneNumber()
    if (!phoneNumber) {
      generalError.value = 'Nomor ponsel harus berupa angka'
      showErrorModal.value = true
      return
    }

    const rand = Math.random().toString(36).slice(2, 10)
    const emailGenerated = `user.${rand}@trivex.local`
    const fullNameGenerated = `User ${rand}`
    
    const payload = {
      username: formData.username.trim(),
      phone: phoneNumber,
      email: emailGenerated,
      full_name: fullNameGenerated,
      password: formData.password,
      password2: formData.password2,
      referral_code: formData.referralCode?.trim() || '',
      otp: '',
      withdraw_pin: ''
    }
    
    const response = await authAPI.register(payload)
    
    successMessage.value = 'Pendaftaran berhasil! Silakan login untuk melanjutkan.'
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
        rawFallbackLower.includes('permintaan ini dibatasi') ||
        rawFallbackCompact.includes('permintaaninidibatasi') ||
        rawFallbackLower.includes('dibatasi') ||
        rawFallbackLower.includes('terlalu banyak') ||
        rawFallbackLower.includes('too many') ||
        rawFallbackLower.includes('throttle') ||
        rawFallbackLower.includes('rate limit')
      if (isRateLimited) {
        generalError.value = 'Terlalu banyak percobaan. Silakan coba kembali dalam beberapa saat.'
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
          ? 'Username/nomor sudah terdaftar. Silakan gunakan username lain.'
          : 'Format data tidak valid. Periksa kembali input Anda.'
      } else if (errorData.phone) {
        generalError.value = 'Nomor telepon sudah digunakan. Gunakan nomor lain atau login.'
      } else if (errorData.referral_code || errorData.referralCode) {
        const referralErrors = errorData.referral_code || errorData.referralCode
        const referralMessage = Array.isArray(referralErrors) ? referralErrors.join(' ') : String(referralErrors)
        if (referralMessage.toLowerCase().includes('batas undang harian tercapai')) {
          generalError.value = 'Kode undangan telah mencapai batas. Silakan coba kembali besok'
        } else {
          generalError.value = 'Pastikan kode undangan yang Anda masukkan benar.'
        }
      } else {
        generalError.value = 'Format data tidak valid. Periksa kembali input Anda.'
      }
    } else {
      generalError.value = 'Tidak mendapatkan koneksi. Silakan periksa koneksi Anda dan coba beberapa saat lagi.'
    }
    
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}
</script>



<style scoped>
#register-page {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

button, input {
  font-family: inherit;
}

/* Header Section */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 20px;
}

.icon-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 34px;
  height: 34px;
}

.login-link {
  color: #4ca455;
  text-decoration: none;
  font-weight: 700;
  font-size: 17px;
}

/* Hero Section */
.hero-content {
  margin-bottom: 10px;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 12px 0;
}

.subtitle {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  line-height: 1.4;
  margin: 0;
}

/* Form Section */
.registration-form {
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
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

.scan-btn img {
  width: 22px;
  height: 22px;
  opacity: 0.5;
}

.input-helper {
  font-size: 10px;
  color: #000000;
  margin: 4px 0 0 0;
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

/* Password Rules */
.password-rules {
  margin-bottom: 10px;
}

.rules-desc {
  font-size: 10px;
  color: #000000;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.rules-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 8px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #1a1a1a;
}

.rule-item .custom-checkbox {
  width: 16px;
  height: 16px;
  background-color: #d9d9d9;
  border: 1px solid rgba(0, 0, 0, 0.18);
  border-radius: 5.5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.rule-item .custom-checkbox.checked {
  background-color: #004d43;
  border-color: #004d43;
}

.rule-item .custom-checkbox img {
  width: 10px;
  height: 10px;
}

/* Terms Container */
.terms-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
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

.custom-checkbox.align-top {
  margin-top: 2px;
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


