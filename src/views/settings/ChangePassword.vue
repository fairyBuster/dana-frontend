<template>
  <section id="app-view">
    <div class="app-container">
      
      <!-- Header Section -->
      <header class="app-header">
        <div class="header-nav">
          <img src="/assets/images/146_394.svg" alt="Back" class="nav-icon" @click="goBack">
          <h1 class="nav-title">Ubah Kata Sandi</h1>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="main-content">
        
        <!-- Profile Card -->
        <div class="profile-card">
          <div class="profile-card-content">
             <div class="card user-card">
                <div class="profile-image">
                  <img src="/assets/images/fdcc463a89f18bb056033660d2e6f436caccf78d.png" alt="Profile">
                </div>
                <div class="user-info">
                  <div class="phone-number">{{ user.phone || '+62812****1234' }}</div>
                  <div class="uid">UID: {{ user.referral_code || '456087' }}</div>
                </div>
              </div>
            <div class="profile-right">
              <!-- Verified Badge -->
              <div class="badge badge-verified">
                <span class="badge-text">Terverifikasi</span>
                <img src="/assets/images/146_485.svg" alt="Check" class="badge-icon">
              </div>
              <!-- Non-VIP Badge -->
              <div class="badge badge-non-vip">
                <span class="badge-text">Non-VIP</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Password Form Section -->
        <div class="account-section">
          <h2 class="section-title">Keamanan Akun</h2>
          
          <div class="info-list-container">
            <div class="info-list-content">
              <!-- Item 1: Old Password -->
              <div class="list-item">
                <div class="item-left">
                  <img src="/assets/images/89468b0506a81c79501d125a38531de004102477.png" alt="Icon" class="item-icon">
                  <span class="item-label">Kata Sandi Lama</span>
                </div>
                <div class="item-right">
                  <input type="password" v-model="form.oldPassword" placeholder="********" class="item-input">
                </div>
              </div>

              <!-- Item 2: New Password -->
              <div class="list-item">
                <div class="item-left">
                  <img src="/assets/images/89468b0506a81c79501d125a38531de004102477.png" alt="Icon" class="item-icon">
                  <span class="item-label">Kata Sandi Baru</span>
                </div>
                <div class="item-right">
                  <input type="password" v-model="form.newPassword" placeholder="********" class="item-input">
                </div>
              </div>

              <!-- Item 3: Confirm Password -->
              <div class="list-item">
                <div class="item-left">
                  <img src="/assets/images/89468b0506a81c79501d125a38531de004102477.png" alt="Icon" class="item-icon">
                  <span class="item-label">Konfirmasi Sandi</span>
                </div>
                <div class="item-right">
                  <input type="password" v-model="form.confirmPassword" placeholder="********" class="item-input">
                </div>
              </div>
            </div>
          </div>

        
        </div>

        <!-- Save Button -->
        <div class="action-container">
          <button class="btn-save" @click="handleChangePassword" :disabled="loading">
            {{ loading ? 'Memproses...' : 'Ubah Kata Sandi' }}
          </button>
        </div>

      </main>
    </div>
    
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
    <SuccessModal v-model="showSuccessModal" :message="successMessage" @close="handleSuccessClose" />
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import CheckboxCaptcha from '@/components/CheckboxCaptcha.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'

const router = useRouter()

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const user = ref({})
const phone = ref('')
const captchaRef = ref(null)
const loading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

const goBack = () => {
  router.back()
}

const fetchUserInfo = async () => {
  try {
    const response = await authAPI.getAccountInfo()
    const data = response.data
    user.value = {
      ...data,
      phone: data.phone || data.phoneNumber
    }
    if (data.phone) {
      phone.value = data.phone
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    // Fallback data
    user.value = {
      phone: '+62812****1234',
      id: '456087',
      name: '',
      assets_count: 0
    }
  }
}

onMounted(() => {
  fetchUserInfo()
})

const handleChangePassword = async () => {
  // Validation
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
    
    // Reset form
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (error) {
    console.error('Change password error:', error)
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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}

/* Container & Backgrounds */
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  background-image: url('/assets/images/715159f6564747d497ee33db87973e7e1507fc24.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top center;
  background-color: #ffffff;
  min-height: 100vh;
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  overflow-x: hidden;
  flex-direction: column;
}

/* Header */
.app-header {
  padding: 10px 0px;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-icon {
  width: 48px;
  height: 48px;
  cursor: pointer;
}

.nav-title {
  color: #FFF;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

/* Main Content White Area */
.main-content {
  background-color: #FFF;
  flex: 1;
  margin-top: 30px;
  padding-top: 1px;
  padding-bottom: 40px;
}
/* Cards Common */
.card {
  background: #fff;
  border-radius: 15px;
  box-shadow: 0px 1px 4px 0px rgba(41, 126, 178, 0.8);
}

/* User Card */
.user-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0px;
  margin-top: -30px;
  padding: 15px 20px;
  margin-bottom: 0px;
  margin-left: 10px;
  margin-right: 10px;
  height: auto;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  justify-self: center;
  align-self: center;
  flex-shrink: 0;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  justify-self: center;
  align-self: center;

}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: center;
  align-items: flex-start;
}

.phone-number {
  color: #070707;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: left;
}

.uid {
  color: #707070;
  font-size: 12px;
}

/* Account Info Section */
.account-section {
  padding: 0 20px;
  margin-top: 0px;
}

.section-title {
  color: #070707;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.info-list-container {
  width: 100%;
  min-height: auto;

  background-size: cover;
  background-position: center;
  box-shadow: 0px 1px 4px rgba(41, 126, 178, 0.8);
  border-radius: 12px;
}

.info-list-content {
  display: flex;
  flex-direction: column;
  padding: 5px 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 0 15px;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.item-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.item-label {
  color: #000;
  font-size: 14px;
}

.item-right {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.item-value {
  color: #707070;
  font-size: 12px;
  text-align: right;
}

.item-input {
  border: none;
  background: transparent;
  text-align: right;
  color: #707070;
  font-size: 12px;
  width: 100%;
  outline: none;
  font-family: inherit;
}

.item-input::placeholder {
  color: #ccc;
}

/* Captcha Wrapper */
.captcha-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* Action Button */
.action-container {
  padding: 20px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
}

.btn-save {
  width: 100%;
  height: 40px;
  border-radius: 18px;
  background: linear-gradient(90deg, #8EA7EB 0%, #3255B6 100%);
  color: #FFF;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(50, 85, 182, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
