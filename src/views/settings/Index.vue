<template>
  <div class="screen-wrapper">
    <!-- Header -->
    <header class="app-header">
      <div class="back-button" @click="goBack">
        <img src="/assets/image/178_1148.svg" alt="Back" class="icon-back">
      </div>
      <h1 class="page-title">Pengaturan</h1>
    </header>

    <!-- Profile Settings Group -->
    <div class="settings-group">
      <!-- Row 1: Ubah avatar -->
      <div class="settings-item" @click="showAvatarModal = true">
        <span class="item-label">Ubah avatar</span>
        <div class="item-right">
          <img :src="avatarSrc" alt="Current Avatar" class="avatar-preview">
          <img src="/assets/image/178_1153.svg" alt="Arrow" class="icon-arrow">
        </div>
      </div>

      <!-- Row 2: Nama panggilan -->
      <div class="settings-item" @click="openNicknameModal">
        <span class="item-label">Nama panggilan</span>
        <div class="item-right">
          <span class="item-value">{{ nickname }}</span>
          <img src="/assets/image/178_1157.svg" alt="Arrow" class="icon-arrow">
        </div>
      </div>

      <!-- Row 3: User ID -->
      <div class="settings-item">
        <span class="item-label">User ID</span>
        <div class="item-right">
          <span class="item-value">{{ userId }}</span>
        </div>
      </div>
    </div>

    <!-- Account Settings Group -->
    <div class="settings-group">
      <!-- Row 1: Kata sandi saya -->
      <div class="settings-item" @click="changePassword">
        <span class="item-label">Kata sandi saya</span>
        <div class="item-right">
          <img src="/assets/image/178_1164.svg" alt="Arrow" class="icon-arrow">
        </div>
      </div>

      <!-- Row 2: Manajemen bank -->
      <div class="settings-item" @click="manageBank">
        <span class="item-label">Manajemen bank</span>
        <div class="item-right">
          <img src="/assets/image/178_1167.svg" alt="Arrow" class="icon-arrow">
        </div>
      </div>

      <!-- Row 3: Akun -->
      <div class="settings-item">
        <span class="item-label">Akun</span>
        <div class="item-right">
          <span class="item-value">{{ accountNumber }}</span>
        </div>
      </div>
    </div>

    <div class="action-button-container">
      <button class="btn-gradient" @click="clearCache">
        Bersihkan cache
      </button>
    </div>

    <!-- Modal Overlay -->
    <div v-if="showAvatarModal" class="modal-overlay" @click="showAvatarModal = false">
      <div class="modal-card" @click.stop>
        <h2 class="modal-title">Avatar</h2>
        
        <div class="avatar-grid">
          <div 
            v-for="(avatar, index) in avatarOptions" 
            :key="index"
            class="avatar-option"
            @click="selectAvatar(avatar)"
          >
            <img :src="avatar" :alt="'Avatar Option ' + (index + 1)">
          </div>
        </div>

        <button class="btn-primary" @click="confirmAvatarChange">
          Ubah avatar
        </button>
      </div>
    </div>

    <div v-if="showPasswordModal" class="modal-overlay" @click="showPasswordModal = false">
      <div class="modal-card" @click.stop>
        <h2 class="modal-title">Ubah kata sandi</h2>

        <div class="password-form">
          <input
            v-model="oldPassword"
            type="password"
            class="modal-input"
            placeholder="Masukkan kata sandi lama"
          >
          <input
            v-model="newPassword"
            type="password"
            class="modal-input"
            placeholder="Masukkan kata sandi baru"
          >
          <input
            v-model="confirmPassword"
            type="password"
            class="modal-input"
            placeholder="Konfirmasi kata sandi baru Anda"
          >
        </div>

        <button class="btn-primary btn-full" @click="savePasswordChange">
          Simpan perubahan
        </button>
      </div>
    </div>

    <div v-if="showNicknameModal" class="modal-overlay" @click="showNicknameModal = false">
      <div class="modal-card" @click.stop>
        <h2 class="modal-title">Ubah nama panggilan</h2>

        <div class="password-form">
          <input
            v-model="nicknameDraft"
            type="text"
            class="modal-input"
            placeholder="Masukkan nama panggilan baru"
          >
        </div>

        <button class="btn-primary btn-full" @click="saveNicknameChange">
          Simpan perubahan
        </button>
      </div>
    </div>

    <SuccessModal v-model="successModalOpen" :message="successMessage" />
    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import { avatarOptions, avatarSrc, setAvatar } from '@/utils/avatar'

const router = useRouter()
const showAvatarModal = ref(false)
const showPasswordModal = ref(false)
const showNicknameModal = ref(false)
const selectedAvatar = ref('')
const nickname = ref('username')
const nicknameDraft = ref('')
const userId = ref('-')
const accountNumber = ref('-')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const phone = ref('')
const currentUsername = ref('')
const successModalOpen = ref(false)
const errorModalOpen = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const goBack = () => {
  router.go(-1)
}

const openNicknameModal = () => {
  nicknameDraft.value = nickname.value
  showNicknameModal.value = true
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, segarkan halaman'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Permintaan gagal, segarkan halaman'
}

const saveNicknameChange = async () => {
  const nextNickname = String(nicknameDraft.value || '').trim()
  if (!nextNickname) {
    errorMessage.value = 'Nama panggilan tidak boleh kosong.'
    errorModalOpen.value = true
    return
  }

  try {
    const payload = {
      username: nextNickname,
      username: currentUsername.value || nickname.value || nextNickname
    }
    await authAPI.updateProfile(payload)
    nickname.value = nextNickname
    successMessage.value = 'Profil berhasil diperbarui'
    successModalOpen.value = true
    showNicknameModal.value = false
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    errorModalOpen.value = true
  }
}

const changePassword = () => {
  showPasswordModal.value = true
}

const manageBank = () => {
  router.push('/pages/assets/bind')
}

const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar
}

const confirmAvatarChange = () => {
  setAvatar(selectedAvatar.value || avatarSrc.value)
  showAvatarModal.value = false
}

const savePasswordChange = async () => {
  const oldVal = oldPassword.value.trim()
  const newVal = newPassword.value.trim()
  const confirmVal = confirmPassword.value.trim()

  if (!oldVal || !newVal || !confirmVal) {
    errorMessage.value = 'Harap lengkapi semua field kata sandi.'
    errorModalOpen.value = true
    return
  }

  if (newVal !== confirmVal) {
    errorMessage.value = 'Konfirmasi kata sandi baru tidak sama.'
    errorModalOpen.value = true
    return
  }

  try {
    await authAPI.resetPassword({
      phone: String(phone.value || '').trim(),
      old_password: oldVal,
      new_password: newVal
    })
    successMessage.value = 'Kata sandi berhasil diubah'
    successModalOpen.value = true
    showPasswordModal.value = false
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    errorModalOpen.value = true
  }
}

const clearCache = async () => {
  try {
    localStorage.clear()
    sessionStorage.clear()
  } catch (_) {}

  try {
    if (typeof caches !== 'undefined' && caches.keys) {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
    }
  } catch (_) {}

  location.reload()
}

const loadAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    const p = resp?.data?.phone || ''
    phone.value = p
    accountNumber.value = p || '-'
    currentUsername.value = resp?.data?.username || ''
    nickname.value = resp?.data?.username || nickname.value
    userId.value = String(resp?.data?.referral_code ?? userId.value)
  } catch (_) {}
}

onMounted(() => {
  loadAccountInfo()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #050505;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}

/* Main Container */
#app-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.screen-wrapper {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center;
  overflow: hidden;
  padding-bottom: 40px;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  padding: 21px 10px;
  position: relative;
  margin-bottom: 20px;
}

.back-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  cursor: pointer;
}

.page-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  pointer-events: none;
}

/* Settings Groups */
.settings-group {
  background-color: #1d2138;
  border-radius: 10px;
  margin: 0 19px 12px 19px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
  cursor: pointer;
}

.item-label {
  color: #ffffff;
  font-size: 14px;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-value {
  color: #afafaf;
  font-size: 14px;
}

.avatar-preview {
  width: 38px;
  height: 39px;
  object-fit: contain;
}

.icon-arrow {
  width: 7px;
  height: 12px;
}

/* Action Button */
.action-button-container {
  margin: 24px 18px;
}

.btn-gradient {
  width: 100%;
  height: 41px;
  border-radius: 10px;
  border: 1px solid #746a9a;
  background: linear-gradient(90deg, #3f48c5 0%, #6135c4 30%, #9047e0 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal Overlay */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(6, 5, 5, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.modal-card {
  width: 328px;
  background-color: #1d2138;
  border-radius: 10px;
  padding: 13px 19px 20px 19px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: default;
}

.modal-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 23px 0;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 30px;
  margin-bottom: 20px;
  width: 100%;
}

.avatar-option {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-option img {
  width: 55px;
  height: 53px;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-option img:hover {
  transform: scale(1.05);
}

.btn-primary {
  width: 244px;
  height: 36px;
  background-color: #746a9a;
  border-radius: 5px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-full {
  width: 100%;
}

.password-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}

.modal-input {
  width: 100%;
  height: 34px;
  border-radius: 5px;
  border: 1px solid #746a9a;
  background-color: rgba(29, 33, 56, 0.75);
  color: #ffffff;
  padding: 0 12px;
  font-size: 12px;
  outline: none;
}

.modal-input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}
</style>
