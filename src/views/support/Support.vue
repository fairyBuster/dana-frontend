<template>
  <div class="support-page">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="icon-back-btn" aria-label="Go back" @click="goBack">
          <img src="/assets/images/38_267.svg" alt="" class="icon-back">
        </button>
        <h1 class="header-title">Bantuan</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero">
        <div class="hero-content">
          <h2 class="hero-title">Bantuan</h2>
          <p class="hero-subtitle">Temukan bantuan dan jawaban untuk kebutuhan Anda.</p>
        </div>
        <img src="/assets/images/bf4064c09e96a5bbe86b67a191c7813b7647731e.png" alt="" class="hero-image">
      </div>
    </section>

    <!-- Channels -->
    <section id="section-channels">
      <div class="channels-container">
        <div class="channels-card">
          <a class="channel-item" @click.prevent="openTelegram">
            <div class="channel-icon-wrapper">
              <img src="/assets/images/e68e1b6d0ad19f61c38264f1e538020951772fc2.png" alt="" class="icon-telegram">
            </div>
            <h3 class="channel-title">Telegram</h3>
            <p class="channel-desc">Chat via Telegram</p>
          </a>
          <div class="channel-divider"></div>
          <a class="channel-item" @click.prevent="openChannel">
            <div class="channel-icon-wrapper">
              <img src="/assets/images/108294978d9cad25785261933372f80a0602c03d.png" alt="" class="icon-dana">
            </div>
            <h3 class="channel-title">Saluran Komunikasi</h3>
            <p class="channel-desc">Lihat saluran</p>
          </a>
          <div class="channel-divider"></div>
          <a class="channel-item" @click.prevent="openLiveChat">
            <div class="channel-icon-wrapper">
              <img src="/assets/images/3dc8201cb7a353a54d3c049c704da25444083a11.png" alt="" class="icon-livechat">
            </div>
            <h3 class="channel-title">Live Chat</h3>
            <p class="channel-desc">Mulai</p>
          </a>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="section-faq">
      <div class="faq-container">
        <h2 class="faq-section-title">Pertanyaan Umum</h2>
        <div class="faq-card">
          <div
            v-for="(item, idx) in faqItems"
            :key="idx"
          >
            <div class="faq-item" @click="openFaqItem(item)">
              <div class="faq-item-left">
                <img src="/assets/images/0124373b87358a593909a03ffafd020b5948dccd.png" alt="" class="faq-icon">
                <span class="faq-text">{{ item.title }}</span>
              </div>
              <img :src="item.arrowIcon" alt="" class="faq-arrow">
            </div>
            <div v-if="idx < faqItems.length - 1" class="faq-divider"></div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="faqModalOpen" id="section-faq-modal" class="faq-modal-overlay" @click.self="closeFaqModal">
      <div class="faq-modal" role="dialog" aria-modal="true" :aria-label="activeFaq?.title || 'FAQ'">
        <div class="faq-modal-header">
          <h3 class="faq-modal-title">{{ activeFaq?.title || '' }}</h3>
          <button type="button" class="faq-modal-close" aria-label="Tutup" @click="closeFaqModal">×</button>
        </div>
        <p class="faq-modal-body">{{ activeFaq?.body || '' }}</p>
      </div>
    </section>

    <!-- Footer -->
    <section id="section-footer">
      <div class="footer-container">
        <button class="btn-primary" @click="contactSupport">Hubungi bantuan</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/hn/home')
}

const faqItems = ref([
  {
    title: 'Bagaimana cara membuat akun?',
    arrowIcon: '/assets/images/38_309.svg',
    body: 'Untuk membuat akun Dana Proteksi, kunjungi platform resmi, lengkapi formulir pendaftaran, verifikasi informasi Anda, dan masuk menggunakan kredensial akun terdaftar.'
  },
  {
    title: 'Apakah akun saya aman?',
    arrowIcon: '/assets/images/38_315.svg',
    body: 'Ya, Dana Proteksi menggunakan sistem aman dan teknologi terenkripsi untuk membantu melindungi akun, transaksi, dan informasi pribadi pengguna.'
  },
  {
    title: 'Bagaimana cara isi ulang saldo?',
    arrowIcon: '/assets/images/38_321.svg',
    body: 'Anda dapat melakukan isi ulang melalui menu Isi Ulang di dashboard. Pilih nominal, lalu selesaikan pembayaran melalui metode yang tersedia.'
  },
  {
    title: 'Bagaimana cara tarik dana?',
    arrowIcon: '/assets/images/38_327.svg',
    body: 'Untuk menarik dana, buka menu Tarik Uang, pilih rekening bank tujuan, masukkan jumlah penarikan, dan konfirmasi transaksi Anda.'
  },
  {
    title: 'Bagaimana cara menghubungi dukungan?',
    arrowIcon: '/assets/images/38_333.svg',
    body: 'Anda dapat menghubungi dukungan melalui Telegram, Saluran Komunikasi, atau Live Chat yang tersedia di halaman Bantuan.'
  }
])

const faqModalOpen = ref(false)
const activeFaq = ref(null)

const openFaqItem = (item) => {
  activeFaq.value = item || null
  faqModalOpen.value = true
}

const closeFaqModal = () => {
  faqModalOpen.value = false
}

const openTelegram = () => {
  window.open('https://t.me/danaproteksi', '_blank')
}

const openChannel = () => {
  window.open('https://t.me/danaproteksi_channel', '_blank')
}

const openLiveChat = () => {
  // Open live chat - could be a third-party widget or route
  window.open('https://t.me/danaproteksi', '_blank')
}

const contactSupport = () => {
  window.open('https://t.me/danaproteksi', '_blank')
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.support-page {
  font-family: 'Inter', sans-serif;
  max-width: 412px;
  margin: 0 auto;
  background-color: #fbfaf7;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, p {
  margin: 0;
}

button {
  font-family: inherit;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  padding: 24px 20px 16px;
  gap: 16px;
}

.icon-back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

/* Hero */
.hero {
  position: relative;
  padding: 10px 20px 30px;
  min-height: 140px;
}

.hero-content {
  width: 60%;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
}

.hero-subtitle {
  font-size: 14px;
  color: #635f5f;
  line-height: 1.4;
}

.hero-image {
  position: absolute;
  right: 0;
  top: -10px;
  width: 179px;
  height: 134px;
  z-index: 1;
  object-fit: contain;
}

/* Channels */
.channels-container {
  padding: 0 20px 30px;
}

.channels-card {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: stretch;
  padding: 20px 0;
}

.channel-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 8px;
  cursor: pointer;
  text-decoration: none;
}

.channel-icon-wrapper {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.icon-telegram {
  width: 53px;
  height: 53px;
  object-fit: contain;
}

.icon-dana {
  width: 100%;
  max-width: 90px;
  height: auto;
  object-fit: contain;
}

.icon-livechat {
  width: 60px;
  height: 65px;
  object-fit: contain;
}

.channel-title {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 4px;
  line-height: 1.2;
}

.channel-desc {
  font-size: 10px;
  color: #635f5f;
}

.channel-divider {
  width: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 10px 0;
}

/* FAQ */
.faq-container {
  padding: 0 20px 40px;
}

.faq-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 16px;
}

.faq-card {
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.faq-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
}

.faq-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.faq-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.faq-text {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

.faq-arrow {
  width: 18px;
  height: 18px;
}

.faq-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0 16px;
}

.faq-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 20px;
}

.faq-modal {
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  padding: 16px;
}

.faq-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.faq-modal-title {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  line-height: 1.3;
}

.faq-modal-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.faq-modal-body {
  font-size: 13px;
  line-height: 1.5;
  color: #333333;
  white-space: pre-wrap;
}

/* Footer */
.footer-container {
  padding: 0 20px 40px;
}

.btn-primary {
  width: 100%;
  background-color: #f3b740;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.2s ease;
}

.btn-primary:active {
  opacity: 0.8;
}
</style>
