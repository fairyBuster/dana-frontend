<template>
  <section id="app-view">
    <div class="app-container">
      
      <!-- Header Section -->
      <header class="app-header">
        <div class="header-nav">
          <img src="/assets/images/146_394.svg" alt="Back" class="nav-icon" @click="goBack">
          <h1 class="nav-title">Profil Saya</h1>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="main-content">
        
        <!-- Profile Card -->
        <div class="profile-card">
          <div class="profile-card-content">
            <div class="profile-left">
              <img :src="user.avatar || '/assets/images/fdcc463a89f18bb056033660d2e6f436caccf78d.png'" alt="Avatar" class="avatar-img">
              <div class="profile-details">
                <div class="profile-phone">{{ user.phone || '+62812****1234' }}</div>
                <div class="profile-uid">UID: {{ user.referral_code|| '456087' }}</div>
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

        <!-- Account Info Section -->
        <div class="account-section">
          <h2 class="section-title">Informasi Akun</h2>
          
          <div class="info-list-container">
            <div class="info-list-content">
              <!-- Item 1: Nama Panggilan -->
              <div class="list-item">
                <div class="item-left">
                  <img src="/assets/images/89468b0506a81c79501d125a38531de004102477.png" alt="Icon" class="item-icon">
                  <span class="item-label">Nama Panggilan</span>
                </div>
                <div class="item-right">
                  <input 
                    type="text" 
                    v-model="user.full_name" 
                    placeholder="Ketik disini" 
                    class="input-name"
                  />
                </div>
              </div>

              <!-- Item 2: Aset Saya -->
              <div class="list-item" @click="goToAssets">
                <div class="item-left">
                  <img src="/assets/images/ea96ea70de6c5df19b391b77b1f9471fa2a9a039.png" alt="Icon" class="item-icon">
                  <span class="item-label">Aset Saya</span>
                </div>
                <div class="item-right">
                  <span class="item-value">{{ user.active_investments_count || 0 }} Aset</span>
                </div>
              </div>

              <!-- Item 3: Registrasi Awal -->
              <div class="list-item">
                <div class="item-left">
                  <img src="/assets/images/f4967cabe7cf8467017f3388380b6a9f77232d91.png" alt="Icon" class="item-icon">
                  <span class="item-label">Registrasi Awal</span>
                </div>
                <div class="item-right">
                  <span class="item-value">{{ formatDate(user.created_at) || '24/02/2026 11:25' }}</span>
                </div>
              </div>

              <!-- Item 4: VIP -->
              <div class="list-item" @click="goToVIP">
                <div class="item-left">
                  <img src="/assets/images/f9198d93c10b0c5fe8bdf89cd027a997bdc614fa.png" alt="Icon" class="item-icon">
                  <span class="item-label">VIP</span>
                </div>
                <div class="item-right">
                  <img src="/assets/images/146_456.svg" alt="Arrow" class="arrow-icon">
                </div>
              </div>

              <!-- Item 5: Kartu Bank -->
              <div class="list-item" @click="goToBankCards">
                <div class="item-left">
                  <img src="/assets/images/6d099bc7698a3a0b226527a7f05440a356d64721.png" alt="Icon" class="item-icon">
                  <span class="item-label">Kartu Bank</span>
                </div>
                <div class="item-right">
                  <img src="/assets/images/146_451.svg" alt="Arrow" class="arrow-icon">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="action-container">
          <button class="btn-save" @click="saveChanges">
            Simpan Perubahan Saya
          </button>
        </div>

      </main>
    </div>
  </section>
  <ChatBot v-model="showChatBot" />
  
  <!-- Modals -->
  <SuccessModal 
    v-model="showSuccessModal" 
    :message="modalMessage" 
  />
  <ErrorModal 
    v-model="showErrorModal" 
    :message="modalMessage" 
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import ChatBot from '@/components/modals/ChatBot.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const loading = ref(true)
const user = ref({})
const showChatBot = ref(false)
const supportLinkUrl = ref('')
const supportLinkTitle = ref('')

// Modal state
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const modalMessage = ref('')

const goBack = () => {
  router.back()
}

const openChat = () => {
  showChatBot.value = true
}

const goToAssets = () => {
  router.push('/pages/account/panel')
}

const goToVIP = () => {
  router.push('/pages/benefits/premium')
}

const goToBankCards = () => {
  router.push('/pages/assets/bind')
}

const saveChanges = async () => {
  if (!user.value.full_name) {
    modalMessage.value = 'Nama panggilan tidak boleh kosong'
    showErrorModal.value = true
    return
  }

  try {
    loading.value = true
    const payload = {
      full_name: user.value.full_name,
      username: user.value.username || user.value.phone
    }
    
    await authAPI.updateProfile(payload)
    
    modalMessage.value = 'Profil berhasil diperbarui'
    showSuccessModal.value = true
    
    // Refresh data
    await fetchUserInfo()
  } catch (error) {
    console.error('Update profile failed:', error)
    modalMessage.value = error.response?.data?.message || 'Gagal memperbarui profil'
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const fetchUserInfo = async () => {
  try {
    const response = await authAPI.getAccountInfo()
    const data = response.data
    user.value = {
      ...data,
      phone: data.phone || data.phoneNumber
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    // Fallback data for demo purposes
    user.value = {
      phone: '+62812****1234',
      id: '456087',
      name: 'Ketik disini',
      assets_count: 0,
      created_at: '2026-02-24T11:25:00Z'
    }
  }
}

onMounted(() => {
  fetchUserInfo()
})
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

/* CSS for section section:AppStructure */
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

/* Profile Card */
.profile-card {
  width: 100%;
  max-width: 371px;
  height: 96px;
  margin: -26px auto 16px auto;
  background-image: url('/assets/images/146_479.svg');
  background-size: cover;
  background-position: center;
  
  border-radius: 12px;
}

.profile-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 15px;
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-img {
  width: 50px;
  height: 59px;
  object-fit: cover;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-phone {
  color: #070707;
  font-size: 14px;
  font-weight: 700;
}

.profile-uid {
  color: #707070;
  font-size: 12px;
}

.profile-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 10px;
  height: 19px;
  gap: 6px;
}

.badge-text {
  color: #FFF;
  font-size: 10px;
  font-weight: 500;
}

.badge-verified {
  background: linear-gradient(90deg, #58BCFF 0%, #0573BC 100%);
}

.badge-non-vip {
  background: linear-gradient(90deg, #A8E8A1 0%, #8ABE8A 100%);
}

.badge-icon {
  width: 10px;
  height: 10px;
}

/* Account Info Section */
.account-section {
  padding: 0 20px;
  margin-top: 10px;
}

.section-title {
  color: #070707;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.info-list-container {
  width: 100%;
  min-height: 254px;
  background-image: url('/assets/images/146_447.svg');
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
}

.item-value {
  color: #707070;
  font-size: 12px;
  text-align: right;
}

.arrow-icon {
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
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

.input-name {
  border: none;
  background: transparent;
  color: #707070;
  font-size: 14px;
  text-align: right;
  width: 100%;
  outline: none;
  font-family: inherit;
}

.input-name::placeholder {
  color: #ccc;
}
</style>
