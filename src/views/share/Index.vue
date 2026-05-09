<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/168_753.svg" alt="Back">
        </button>
        <h1 class="header-title">Invite friends</h1>
      </header>
    </section>

    <!-- QR Code -->
    <section id="section-qrcode">
      <div class="qr-container">
        <p class="qr-instruction">Long press the QR code to save to the phone album</p>
       
        <div class="qr-image-wrapper" :class="qrStyle === 'card' ? 'is-card' : ''">
          <div ref="qrEl" class="qr-render" @click="handleQrClick"></div>
        </div>
      </div>
    </section>

    <!-- Invite Links -->
    <section id="section-invite-links">
      <div class="links-container">
        <div class="link-box">
          <span class="link-label">Invite code</span>
          <span class="link-value code-value">{{ referralCode || '-' }}</span>
          <button class="copy-btn" aria-label="Copy invite code" @click="copyCode">
            <img src="/assets/image/1cc75236b99b7283315da53f09fb85a865206d41.png" alt="Copy">
          </button>
        </div>
        <div class="link-box">
          <span class="link-value url-value" translate="no" data-no-translate="true">{{ inviteLink }}</span>
          <button class="copy-btn" aria-label="Copy link" @click="copyLink">
            <img src="/assets/image/1cc75236b99b7283315da53f09fb85a865206d41.png" alt="Copy">
          </button>
        </div>
      </div>
    </section>

    <!-- Article -->
    <section id="section-article">
      <div class="article-container">
        <h2 class="article-title">Referral Program</h2>
        <p class="article-text">
          You can invite your friends to join TRIVEX using your invite code! Earn commission up to 36% from each friend's transaction. Share your referral code or link and start earning today.
        </p>
        <div class="article-placeholder"></div>
        <p class="article-text">
          The more friends you invite, the more you earn. Your commission is automatically calculated and added to your balance in real-time. There is no limit to the number of friends you can invite.<br>
          Start sharing now and grow your network with TRIVEX!
        </p>
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
import { onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import SuccessModal from '@/components/modals/SuccessModal.vue'

const router = useRouter()
const referralCode = ref('')
const inviteLink = ref('')
const qrStyle = ref('card')
const successModalOpen = ref(false)
const successMessage = ref('')
const qrEl = ref(null)
let qrInstance = null

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
    const Ctor = window?.QRCodeStyling
    if (!Ctor || !qrEl.value) return

    const options = {
      width: 280,
      height: 280,
      type: 'canvas',
      data: text,
      margin: 0,
      qrOptions: { errorCorrectionLevel: 'H' },
      backgroundOptions: { color: '#e9f0ff' },
      dotsOptions: { color: '#1b46f5', type: 'dots' },
      cornersSquareOptions: { color: '#1b46f5', type: 'extra-rounded' },
      cornersDotOptions: { color: '#1b46f5', type: 'dot' }
    }

    if (!qrInstance) {
      qrInstance = new Ctor(options)
      qrEl.value.innerHTML = ''
      qrInstance.append(qrEl.value)
      return
    }

    qrInstance.update(options)
  } catch (_) {
    if (qrEl.value) qrEl.value.innerHTML = ''
  }
}

const setQrStyle = async (style) => {
  qrStyle.value = style
  if (inviteLink.value) await generateQr(inviteLink.value)
}

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink.value).then(() => {
    successMessage.value = 'Copy'
    successModalOpen.value = true
  }).catch(err => {
    console.error('Failed to copy link:', err)
  })
}

const copyCode = () => {
  navigator.clipboard.writeText(referralCode.value).then(() => {
    successMessage.value = 'Code copied successfully'
    successModalOpen.value = true
  }).catch(err => {
    console.error('Failed to copy code:', err)
  })
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
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

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

section {
  width: 100%;
}

img {
  max-width: 100%;
  display: block;
}

button {
  font-family: inherit;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  padding: 13px 2px;
  position: relative;
  min-height: 48px;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.header-title {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* QR Code */
.qr-container {
  padding-top: 37px;
  padding-left: 26px;
  padding-right: 26px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-instruction {
  font-size: 14px;
  color: #000000;
  margin-bottom: 23px;
  line-height: 1.4;
  max-width: 305px;
}

.qr-style-row {
  display: inline-flex;
  gap: 8px;
  margin-bottom: 12px;
}

.qr-style-btn {
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(27, 70, 245, 0.35);
  background: rgba(255, 255, 255, 0.7);
  color: #000000;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.qr-style-btn.active {
  border-color: #1b46f5;
  background: rgba(27, 70, 245, 0.1);
  color: #1b46f5;
}

.qr-image-wrapper {
  width: 152px;
  height: 152px;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  display: grid;
  place-items: center;
}

.qr-image-wrapper.is-card {
  padding: 8px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.qr-render {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.qr-render :deep(canvas),
.qr-render :deep(svg),
.qr-render :deep(img) {
  width: 100% !important;
  height: 100% !important;
  border-radius: 6px;
}

/* Invite Links */
.links-container {
  padding-top: 27px;
  padding-left: 26px;
  padding-right: 26px;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.link-box {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.47);
  border: 1px solid #1b46f5;
  border-radius: 20px;
  padding: 0 8px 0 15px;
  height: 45px;
}

.link-label {
  font-size: 14px;
  color: #000000;
  font-weight: 600;
}

.link-value {
  color: #1b46f5;
  font-weight: 600;
}

.code-value {
  font-size: 16px;
  margin-left: auto;
  margin-right: 6px;
}

.url-value {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 6px;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.copy-btn img {
  width: 10px;
  height: 10px;
  object-fit: contain;
}

/* Article */
.article-container {
  padding-top: 27px;
  padding-left: 26px;
  padding-right: 26px;
  padding-bottom: 40px;
}

.article-title {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 10px;
}

.article-text {
  font-size: 14px;
  line-height: 1.5;
  color: #000000;
  margin-bottom: 10px;
  text-align: justify;
}

.article-placeholder {
  background-color: #d9d9d9;
  border-radius: 2px;
  height: 158px;
  width: 100%;
  margin-bottom: 9px;
}
</style>
