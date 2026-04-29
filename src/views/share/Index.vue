<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/17_110.svg" alt="Back Icon">
        </button>
        <h1 class="header-title">Kartu Undangan</h1>
      </header>
    </section>

    <!-- Referral Info -->
    <section id="section-referral-info">
      <p class="referral-desc">
        Kamu bisa ajak temanmu daftar di TRIVEX dengan menggunakan kode undanganmu! Dapatkan komisi hingga 36% dari tiap transaksi teman.
      </p>
      <div class="qr-wrapper">
        <img :src="qrImageSrc" alt="QR Code" class="qr-image" @click="handleQrClick">
      </div>
      <p class="qr-instruction">
        Scan QR untuk mengundang lebih cepat
      </p>
    </section>

    <!-- Referral Codes -->
    <section id="section-referral-codes">
      <div class="code-group">
        <label class="code-label">Referral</label>
        <div class="code-box">
          <span class="code-text">{{ referralCode || '-' }}</span>
          <div class="copy-icon-wrapper" @click="copyCode">
            <img src="/assets/images/18_128.svg" alt="Copy" class="icon-layer-1">
            <img src="/assets/images/18_128 copy.svg" alt="" class="icon-layer-2">
          </div>
        </div>
      </div>

      <div class="code-group">
        <label class="code-label">Referral Link</label>
        <div class="code-box">
          <span class="code-text">{{ inviteLink }}</span>
          <div class="copy-icon-wrapper" @click="copyLink">
            <img src="/assets/images/18_132.svg" alt="Copy" class="icon-layer-1">
            <img src="/assets/images/18_132 copy.svg" alt="" class="icon-layer-2">
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer">
      <button class="btn-invite" @click="handleShare">Mulai mengundang</button>
    </section>

    <SuccessModal
      v-model="successModalOpen"
      :message="successMessage"
      @confirm="successModalOpen = false"
    />
  </div>
</template>

<script setup>
import { onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { authAPI } from '@/services/api'
import SuccessModal from '@/components/modals/SuccessModal.vue'

const router = useRouter()
const referralCode = ref('')
const inviteLink = ref('')
const qrImageSrc = ref('/assets/images/e84dbf746b992803a6abb783986d05ee77d5ec3c.png')
const successModalOpen = ref(false)
const successMessage = ref('')

const goBack = () => {
  router.go(-1)
}

const buildInviteLink = (code) => {
  const base = 'https://trivexcapt.com'
  const u = code ? `${base}/signup/invite/${encodeURIComponent(code)}` : `${base}/register`
  return u
}

const loadAccountInfo = async () => {
  try {
    const resp = await authAPI.getAccountInfo()
    const data = resp?.data || {}
    referralCode.value = String(data.referral_code || '').trim()
    inviteLink.value = buildInviteLink(referralCode.value)
    await generateQr(inviteLink.value)
  } catch (_) {
    referralCode.value = ''
    inviteLink.value = buildInviteLink('')
    await generateQr(inviteLink.value)
  }
}

const generateQr = async (value) => {
  const text = String(value || '').trim()
  if (!text) return
  try {
    qrImageSrc.value = await QRCode.toDataURL(text, {
      width: 280,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#004d43', light: '#ffffff' }
    })
  } catch (_) {
    qrImageSrc.value = '/assets/images/e84dbf746b992803a6abb783986d05ee77d5ec3c.png'
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink.value).then(() => {
    successMessage.value = 'Link berhasil disalin'
    successModalOpen.value = true
  }).catch(err => {
    console.error('Failed to copy link:', err)
  })
}

const copyCode = () => {
  navigator.clipboard.writeText(referralCode.value).then(() => {
    successMessage.value = 'Kode berhasil disalin'
    successModalOpen.value = true
  }).catch(err => {
    console.error('Failed to copy code:', err)
  })
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Undang Pengguna TRIVEX',
      text: `Bergabunglah dengan TRIVEX menggunakan kode undangan saya: ${referralCode.value}`,
      url: inviteLink.value
    }).catch(err => {
      console.log('Share canceled:', err)
    })
  } else {
    copyLink()
  }
}

const handleQrClick = () => {
  copyLink()
}

onMounted(() => {
  loadAccountInfo()
})

onActivated(() => {
  loadAccountInfo()
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background-color: #f8f8f8;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* Header */
#section-header {
  padding: 20px 16px 10px 16px;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 41px;
}

.back-button {
  position: absolute;
  left: -8px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Referral Info */
#section-referral-info {
  padding: 16px;
}

.referral-desc {
  font-size: 13px;
  line-height: 1.5;
  color: #000000;
  margin: 0 0 24px 0;
}

.qr-wrapper {
  margin-bottom: 24px;
}

.qr-image {
  width: 140px;
  height: 135px;
  border-radius: 20px;
  border: 1px solid #004d43;
  object-fit: cover;
  display: block;
}

.qr-instruction {
  font-size: 13px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Referral Codes */
#section-referral-codes {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.code-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.code-label {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

.code-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.21);
  border-radius: 10px;
  padding: 14px 12px;
  background-color: transparent;
  height: 49px;
}

.code-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 12px;
}

.copy-icon-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
}

.icon-layer-1, .icon-layer-2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
}

/* Footer */
#section-footer {
  padding: 16px;
  margin-top: 16px;
  padding-bottom: 32px;
}

.btn-invite {
  width: 100%;
  height: 58px;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  transition: background-color 0.2s ease;
}

.btn-invite:hover {
  background-color: #00362f;
}
</style>
