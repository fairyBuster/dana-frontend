<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/2055_349.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Keamanan Akun</h1>
      </header>
    </section>

    <section id="section-security-form">
      <div class="form-container">

        <div class="input-group">
          <label class="input-label">Password Lama</label>
          <input type="password" v-model="form.oldPassword" class="input-field" placeholder="Masukkan password saat ini">
        </div>

        <p class="info-text">Pastikan password unik tidak mudah ditebak untuk menjaga keamanan akun kamu!</p>

        <div class="checklist-grid">
          <div class="check-item">
            <div class="check-icon-wrapper" :class="{ active: passwordRules.minLength }">
              <img v-if="passwordRules.minLength" src="/assets/images/I2055_362_497_5178.svg" alt="Check">
            </div>
            <span class="check-label">Minimal 8 karakter</span>
          </div>
          <div class="check-item">
            <div class="check-icon-wrapper" :class="{ active: passwordRules.hasUpperLower }">
              <img v-if="passwordRules.hasUpperLower" src="/assets/images/I2055_364_497_5178.svg" alt="Check">
            </div>
            <span class="check-label">Huruf besar & kecil</span>
          </div>
          <div class="check-item">
            <div class="check-icon-wrapper" :class="{ active: passwordRules.hasNumber }">
              <img v-if="passwordRules.hasNumber" src="/assets/images/I2055_363_497_5178.svg" alt="Check">
            </div>
            <span class="check-label">Mengandung angka</span>
          </div>
          <div class="check-item">
            <div class="check-icon-wrapper" :class="{ active: passwordRules.hasSpecial }">
              <img v-if="passwordRules.hasSpecial" src="/assets/images/I2055_365_497_5178.svg" alt="Check">
            </div>
            <span class="check-label">Spesial karakter, cth: !@#</span>
          </div>
        </div>

        <div class="input-group new-password-group">
          <label class="input-label">Password Baru</label>
          <input type="password" v-model="form.newPassword" class="input-field" placeholder="Masukkan password baru">
        </div>

        <div class="input-group confirm-password-group">
          <label class="input-label">Konfirmasi Password Baru</label>
          <input type="password" v-model="form.confirmPassword" class="input-field" placeholder="Masukkan ulang password baru">
        </div>

      </div>
    </section>

    <section id="section-actions">
      <div class="actions-container">
        <button class="btn-primary" @click="handleChangePassword" :disabled="loading">
          {{ loading ? 'Memproses...' : 'Simpan' }}
        </button>
      </div>
    </section>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <SuccessModal v-model="showSuccessModal" :message="successMessage" @close="handleSuccessClose" />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
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

const passwordRules = computed(() => {
  const password = form.newPassword || ''
  return {
    minLength: password.length >= 8,
    hasUpperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
})

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
    errorMessage.value = 'Semua field harus diisi'
    showErrorModal.value = true
    return
  }

  if (form.newPassword !== form.confirmPassword) {
    errorMessage.value = 'Kata sandi baru dan konfirmasi tidak cocok'
    showErrorModal.value = true
    return
  }

  if (form.oldPassword === form.newPassword) {
    errorMessage.value = 'Kata sandi baru harus berbeda dari kata sandi lama'
    showErrorModal.value = true
    return
  }

  if (!phone.value) {
    errorMessage.value = 'Gagal mengambil data pengguna. Silakan refresh halaman.'
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

    successMessage.value = 'Password berhasil diubah'
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
      errorMessage.value = 'Gagal mengubah password. Silakan cek input Anda.'
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
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

h1, p {
  margin: 0;
}

/* Header Section */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  position: relative;
  height: 60px;
}

.back-button {
  position: absolute;
  left: 0px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.page-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Security Form Section */
.form-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.input-group {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 68px;
  justify-content: center;
}

.input-label {
  color: #004d43;
  font-size: 12px;
  font-weight: 600;
}

.input-field {
  background: transparent;
  border: none;
  outline: none;
  color: #000000;
  font-size: 14px;
  font-family: inherit;
  width: 100%;
}

.input-field::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.info-text {
  font-size: 12px;
  color: #000000;
  line-height: 1.4;
  margin-top: 24px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.checklist-grid {
  display: grid;
  grid-template-columns: 170px 1fr;
  row-gap: 12px;
  column-gap: 8px;
  margin-bottom: 32px;
  padding: 0 4px;
}

.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.check-icon-wrapper {
  width: 16px;
  height: 16px;
  background-color: #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}

.check-icon-wrapper.active {
  background-color: #004d43;
}

.check-icon-wrapper img {
  width: 9px;
  height: 9px;
}

.check-label {
  font-size: 11px;
  color: #1a1a1a;
}

.new-password-group {
  margin-bottom: 12px;
}

.confirm-password-group {
  margin-bottom: 24px;
}

/* Actions Section */
.actions-container {
  padding: 0 16px 32px 16px;
  margin-top: auto;
}

.btn-primary {
  width: 100%;
  height: 45px;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #003831;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
