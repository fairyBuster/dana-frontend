<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <div class="header-content">
          <button class="back-button" @click="goBack">
            <img src="/assets/images/145_325.svg" alt="Back">
          </button>
          <h1 class="page-title">Aset Finansial Nusantara Support</h1>
        </div>
      </header>
    </section>
    
    <section id="section-content">
      <div class="content-container">
        
        <!-- Card 1: Saluran Telegram -->
        <article class="card">
          <img src="/assets/images/145_313.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-main">
              <div class="card-icon-wrapper">
                <img src="/assets/images/9464a3f14596991b369d83a2ec88a07a0010c349.png" alt="Telegram Icon" class="card-icon">
              </div>
              <div class="card-info">
                <h2 class="card-title">Saluran Telegram</h2>
                <p class="card-subtitle">Informasi dan pengumuman resmi perusahaan</p>
              </div>
            </div>
            <div class="card-action">
              <a :href="telegramChannelLink" target="_blank" class="action-link" @click="handleLinkClick($event, telegramChannelLink)">
                <span class="action-text">Bergabung</span>
                <img src="/assets/images/145_315.svg" alt="Arrow Right" class="action-arrow">
              </a>
            </div>
          </div>
        </article>

        <!-- Card 2: Telegram Resmi -->
        <article class="card">
          <img src="/assets/images/145_334.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-main">
              <div class="card-icon-wrapper">
                <img src="/assets/images/d3f3970dcb61293ea68f603759bcba809d40fef3.png" alt="Support Icon" class="card-icon">
              </div>
              <div class="card-info">
                <h2 class="card-title">Telegram Resmi</h2>
                <p class="card-subtitle">Komunikasi langsung dengan tim resmi</p>
              </div>
            </div>
            <div class="card-action">
              <a :href="officialSupportLink" target="_blank" class="action-link" @click="handleLinkClick($event, officialSupportLink)">
                <span class="action-text">Bergabung</span>
                <img src="/assets/images/145_336.svg" alt="Arrow Right" class="action-arrow">
              </a>
            </div>
          </div>
        </article>

        <!-- Card 3: Pusat Bantuan -->
        <article class="card">
          <img src="/assets/images/145_345.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-main">
              <div class="card-icon-wrapper">
                <img src="/assets/images/014b0de06b7470d136ad1dcd48563ce312cc6de2.png" alt="Help Center Icon" class="card-icon">
              </div>
              <div class="card-info">
                <h2 class="card-title">Pusat Bantuan</h2>
                <p class="card-subtitle">Bantuan dan pertanyaan seputar layanan</p>
              </div>
            </div>
            <div class="card-action">
              <a href="#/pages/account/support/platform" class="action-link" @click.prevent="goToHelpCenter">
                <span class="action-text">Kunjungi halaman</span>
                <img src="/assets/images/145_347.svg" alt="Arrow Right" class="action-arrow">
              </a>
            </div>
          </div>
        </article>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supportAPI } from '@/services/api'

const router = useRouter()
const telegramChannelLink = ref('#')
const officialSupportLink = ref('#')

const goBack = () => {
  router.go(-1)
}

const goToHelpCenter = () => {
  // Navigate to help center page
  router.push('/pages/account/support/platform')
}

const handleLinkClick = (event, link) => {
  if (!link || link === '#') {
    event.preventDefault()
    // Optional: Show toast "Link belum tersedia"
  }
}

const fetchSupportLinks = async () => {
  try {
    const response = await supportAPI.getLinks()
    let data = []
    
    if (response.data && Array.isArray(response.data)) {
      data = response.data
    } else if (response.data && response.data.results) {
      data = response.data.results
    }

    // Map API results to specific cards based on user instructions/content
    // ID 1 -> Saluran Telegram (Card 1)
    // ID 4 -> Hubungi Halo ASFina (Card 2)
    
    const telegramItem = data.find(item => item.id === 1)
    const supportItem = data.find(item => item.id === 4)

    if (telegramItem && telegramItem.url) {
      telegramChannelLink.value = telegramItem.url.trim()
    }
    
    if (supportItem && supportItem.url) {
      officialSupportLink.value = supportItem.url.trim()
    }

  } catch (error) {
    console.error('Failed to fetch support links:', error)
  }
}

onMounted(() => {
  fetchSupportLinks()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  -webkit-font-smoothing: antialiased;
}

.app-container {
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  background-color: #ffffff;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}

/* CSS for section section:Header */
#section-header {
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
}

.app-header {
  height: 72px;
  background: linear-gradient(180deg, #7791DE 0%, #5D7BCF 49%, #4061BE 100%);
  display: flex;
  align-items: center;
  padding: 0 10px;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.back-button img {
  width: 45px;
  height: 45px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 25px;
}

/* CSS for section section:Content */
#section-content {
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  background-color: #ffffff;
  min-height: calc(100vh - 72px);
  padding: 13px;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  position: relative;
  width: 100%;
  height: 106px;
  border-radius: 5px;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  object-fit: fill;
}

.card-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-main {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.card-icon-wrapper {
  flex-shrink: 0;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

.card-subtitle {
  font-size: 12px;
  color: #979797;
  margin: 0;
  line-height: 1.4;
}

.card-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.action-link {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.action-text {
  font-size: 14px;
  font-weight: 600;
  color: #3255b6;
}

.action-arrow {
  width: 16px;
  height: 16px;
}

.loading-state, .empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}
</style>
