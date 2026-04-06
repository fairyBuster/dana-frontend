<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header" class="app-container-child">
      <header class="top-bar">
        <div class="back-button" @click="goBack">
          <img src="/assets/image/161_600.svg" alt="Back">
        </div>
        <h1 class="page-title">Undang pengguna</h1>
      </header>
    </section>

    <!-- Invite Card Section -->
    <section id="section-invite-card" class="app-container-child">
      <div class="card">
        <!-- Profile Section -->
        <div class="profile-section">
          <img :src="avatarSrc" alt="Avatar" class="avatar">
          <div class="username">{{ username }}</div>
          <div class="user-id">ID akun: {{ userId }}</div>
          
          <!-- Badge Component -->
          <div class="badge-wrapper">
            <div class="badge-pill">
              <span class="badge-text">{{ rankText }}</span>
            </div>
            <img src="/assets/image/5fb42ec97aec809c1357f284f6344e0829f4ad5e.png" alt="Crown" class="badge-icon">
          </div>
        </div>

        <!-- Subtitle -->
        <p class="card-subtitle">Bagikan tautan atau kode dengan teman</p>

        <!-- Link Input Group -->
        <div class="input-group">
          <label class="input-label">Undang untuk terhubung</label>
          <div class="input-box">
            <span class="input-text truncate">{{ inviteLink }}</span>
            <img src="/assets/image/bd67cb9e8789e4c4feba6ca88c9d48f39e89dd86.png" alt="Copy" class="copy-icon" @click="copyLink">
          </div>
        </div>

        <!-- Code Input Group -->
        <div class="input-group">
          <label class="input-label">Kode undangan</label>
          <div class="input-box small-box">
            <span class="input-text">{{ referralCode }}</span>
            <img src="/assets/image/bd67cb9e8789e4c4feba6ca88c9d48f39e89dd86.png" alt="Copy" class="copy-icon" @click="copyCode">
          </div>
        </div>

        <!-- Share Button -->
        <button class="share-button" @click="handleShare">
          Membagikan
        </button>
      </div>
    </section>

    <!-- Rules Section -->
    <section id="section-rules" class="app-container-child">
      <div class="rules-container">
        <h3 class="rules-title">Aturan Undangan</h3>
        <div class="rules-content">
          <p>-Anda harus menjadi pengguna terdaftar dan terverifikasi sebelum melakukan undangan</p>
          <p>-Teman Anda harus menyelesaikan pendaftaran melalui tautan atau kode unik Anda</p>
          <p>-Setelah teman Anda menyelesaikan pembelian, Anda mendapatkan hadiah tunai sesuai dengan ketentuan jika Anda memiliki drone yang sama dalam waktu tersebut</p>
          <p>-Setelah teman Anda menerima keuntungan dari penerbangan drone, Anda mendapatkan komisi dari keuntungan teman Anda jika Anda memiliki drone yang sama dalam waktu tersebut</p>
          <p>-Dengan mencapai target tertentu dalam volume undangan Anda dapat memperoleh bonus atau hadiah tambahan setiap waktu</p>
          <br>
          <p>-Penggunaan data palsu, pendaftaran sendiri, bot massal, atau metode curang lainnya dilarang</p>
          <p>-Hadiah referal adalah insentif tambahan, setiap pembelian memiliki risiko pasar sendiri. Kinerja masa lalu tidak menjamin hasil di masa depan</p>
          <p>-Perusahaan berhak mengubah aturan apapun sesuai kebijakan</p>
        </div>
      </div>
    </section>
  </div>

  <SuccessModal
    v-model="successModalOpen"
    :message="successMessage"
    @confirm="successModalOpen = false"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { avatarSrc } from '@/utils/avatar'
import { authAPI } from '@/services/api'
import { getFrontendUrl } from '@/utils/settings'
import SuccessModal from '@/components/modals/SuccessModal.vue'

const router = useRouter()
const userId = ref('-')
const username = ref('-')
const inviteLink = ref('')
const referralCode = ref('')
const rankText = ref('V0')
const successModalOpen = ref(false)
const successMessage = ref('')

const goBack = () => {
  router.go(-1)
}

const buildInviteLink = (code) => {
  const base = getFrontendUrl()
  const u = code ? `${base}/#/pages/auth/register?inviteCode=${encodeURIComponent(code)}` : `${base}/#/pages/auth/register`
  return u
}

const loadAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    const data = resp?.data || {}
    userId.value = String(data.referral_code ?? '-')
    username.value = data.full_name || data.username || data.phone || '-'
    referralCode.value = String(data.referral_code || '')
    inviteLink.value = buildInviteLink(referralCode.value)
  } catch (_) {
    inviteLink.value = buildInviteLink('')
  }
}

const loadRankStatus = async () => {
  try {
    const resp = await authAPI.getRankStatus()
    const data = resp?.data || {}
    const title = String(data.current_title || '').trim()
    if (title) {
      rankText.value = title
      return
    }
    const n = Number(data.current_rank)
    rankText.value = Number.isFinite(n) ? `V${n}` : 'V0'
  } catch (_) {
    rankText.value = 'V0'
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink.value).then(() => {
    successMessage.value = 'Link copiado com sucesso'
    successModalOpen.value = true
  }).catch(err => {
    console.error('Failed to copy link:', err)
  })
}

const copyCode = () => {
  navigator.clipboard.writeText(referralCode.value).then(() => {
    successMessage.value = 'Código copiado com sucesso'
    successModalOpen.value = true
  }).catch(err => {
    console.error('Failed to copy code:', err)
  })
}

const handleShare = () => {
  // Use Web Share API if available
  if (navigator.share) {
    navigator.share({
      title: 'Undang Pengguna OT-SENT',
      text: `Bergabunglah dengan OT-SENT menggunakan kode undangan saya: ${referralCode.value}`,
      url: inviteLink.value
    }).catch(err => {
      console.log('Share canceled:', err)
    })
  } else {
    // Fallback: copy link and show message
    copyLink()
  }
}

onMounted(() => {
  loadAccountInfo()
  loadRankStatus()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #111;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.app-container {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

a {
  text-decoration: none;
}

/* Header */
.app-container-child {
  width: 100%;
  max-width: 412px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  position: relative;
  width: 100%;
  height: 64px;
}

.back-button {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
}

/* Invite Card */
.card {
  background-color: #1d2138;
  border-radius: 10px;
  margin: 0 29px;
  padding: 10px 18px 30px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.avatar {
  width: 56px;
  height: 57px;
  object-fit: contain;
  margin-bottom: 8px;
}

.username {
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-id {
  color: #ffffff;
  font-size: 13px;
  margin-bottom: 8px;
}

/* Badge Styles */
.badge-wrapper {
  position: relative;
  width: 38px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
}

.badge-pill {
  background-color: #a296ff;
  border-radius: 10px;
  width: 32px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
  position: absolute;
  right: 0;
}

.badge-text {
  color: #301f80;
  font-size: 9px;
  font-weight: 700;
  margin-left: 6px;
}

.badge-icon {
  position: absolute;
  left: 0;
  width: 16px;
  height: 12px;
  z-index: 2;
}

.card-subtitle {
  color: #ffffff;
  font-size: 12px;
  text-align: center;
  margin-bottom: 24px;
  margin-top: 10px;
}

.input-group {
  width: 100%;
  margin-bottom: 16px;

  border-radius: 10px;
}

.input-label {
  color: #ffffff;
  font-size: 11px;
  margin-bottom: 8px;
  display: block;
  text-align: center;
}

.input-box {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 10px !important;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  width: 100%;
}

.input-box.small-box {
  height: 38px;
  border-radius: 5px;
}

.input-text {
  color: #b9b9b9;
  font-size: 13px;
  border: none;
  font-family: 'Inter', sans-serif;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 85%;
}

.copy-icon {
  width: 20px;
  height: 15px;
  cursor: pointer;
}

.share-button {
  background-color: #746a9a;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  width: 100%;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Rules */
.rules-container {
  padding: 30px 20px 50px 20px;
  color: #ffffff;
}

.rules-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.rules-content {
  font-size: 11px;
  line-height: 1.6;
  opacity: 0.9;
}

.rules-content p {
  margin-bottom: 4px;
}
</style>
