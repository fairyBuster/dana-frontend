<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <div class="header-container">
        <button class="back-button" aria-label="Go back" @click="goBack">
          <img src="/assets/images/68_198.svg" alt="">
        </button>
        <h1 class="header-title">Ubah kata sandi</h1>
      </div>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-container">
        <div class="hero-text-content">
          <h2 class="hero-title">Ubah kata sandi</h2>
          <p class="hero-description">Untuk keamanan Anda silakan ubah secara berkala kata sandi Anda.</p>
        </div>
        <div class="hero-image-wrapper">
          <img src="/assets/images/9f4d7b8ace034cd96bb6b037dd50538b5db64b68.png" alt="" class="hero-image">
        </div>
      </div>
    </section>

    <!-- Form -->
    <section id="section-form">
      <form class="form-wrapper" @submit.prevent="handleChangePassword">
        <div class="form-item">
          <div class="form-label">Nomor akun terdaftar</div>
          <input
            type="text"
            class="form-input"
            :value="phone"
            readonly
            placeholder="Masukkan nomor telepon Anda"
          >
        </div>
        <div class="form-item">
          <div class="form-label">Kata sandi lama</div>
          <input
            v-model="form.oldPassword"
            type="password"
            class="form-input"
            placeholder="Masukkan kata sandi lama"
          >
        </div>
        <div class="form-item">
          <div class="form-label">Kata sandi baru</div>
          <input
            v-model="form.newPassword"
            type="password"
            class="form-input"
            placeholder="Masukkan kata sandi baru"
          >
        </div>
        <div class="form-item">
          <div class="form-label">Konfirmasi kata sandi baru</div>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="form-input"
            placeholder="Konfirmasi kata sandi baru"
          >
        </div>
      </form>
    </section>

    <!-- Actions -->
    <section id="section-actions">
      <div class="actions-wrapper">
        <button class="submit-button" :disabled="loading" @click="handleChangePassword">
          {{ loading ? 'Memproses...' : 'Ubah sekarang' }}
        </button>
      </div>
    </section>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <SuccessModal v-model="showSuccessModal" :message="successMessage" @close="handleSuccessClose" />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import SuccessModal from '@/components/modals/AppSuccessModal.vue'

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

const goBack = () => {
  router.push('/hn/home')
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
    errorMessage.value = 'Semua kolom wajib diisi'
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
    errorMessage.value = 'Gagal memuat data pengguna. Silakan segarkan halaman.'
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

    successMessage.value = 'Kata sandi berhasil diubah'
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
      errorMessage.value = 'Gagal mengubah kata sandi. Silakan periksa kembali.'
    }
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}

const handleSuccessClose = () => {
  router.push('/hn/home')
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

img {
  max-width: 100%;
  display: block;
}

.app-container {
  font-family: 'Inter', sans-serif;
  max-width: 412px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fdfaf4;
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.header-container {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  gap: 16px;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

/* Hero */
#section-hero {
  position: relative;
}

.hero-container {
  padding: 16px 16px 32px 16px;
  display: flex;
  position: relative;
  min-height: 120px;
}

.hero-text-content {
  width: 60%;
  z-index: 2;
}

.hero-title {
  font-size: 22px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
}

.hero-description {
  font-size: 12px;
  color: #635f5f;
  margin: 0;
  line-height: 1.5;
}

.hero-image-wrapper {
  position: absolute;
  right: 0;
  top: -40px;
  width: 182px;
  height: 118px;
  z-index: 1;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Form */
#section-form {
  background-color: #ffffff;
}

.form-wrapper {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
}

.form-item {
  display: grid;
  grid-template-columns: 85px 1fr;
  gap: 16px;
  padding: 16px;
  align-items: start;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  line-height: 1.4;
}

.form-input {
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  line-height: 1.4;
  padding: 0;
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  width: 100%;
}

.form-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.form-input:read-only {
  color: rgba(0, 0, 0, 0.5);
}

/* Actions */
#section-actions {
  flex-grow: 1;
  min-height: 200px;
}

.actions-wrapper {
  padding: 24px 16px;
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  background: linear-gradient(90deg, rgba(244, 193, 66, 1) 0%, rgba(213, 173, 48, 1) 46.63%, rgba(245, 202, 81, 1) 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 188px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: opacity 0.2s ease;
}

.submit-button:active {
  opacity: 0.8;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
