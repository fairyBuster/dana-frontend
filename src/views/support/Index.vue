<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Kembali">
          <img src="/assets/images/17_89.svg" alt="Back Icon">
        </button>
        <h1 class="header-title">Layanan Umum</h1>
      </header>
    </section>

    <section id="section-services">
      <div class="services-container">

        <article class="service-card">
          <p class="service-desc">Layanan pelanggan terbuka selama jam operasional. Anda bisa menghubungi layanan dengan nyaman dan aman. Percakapan Anda kami rekam demi keamanan bersama.</p>
          <div class="service-action">
            <button class="action-btn" @click="handleLinkClick(telegramChannelLink)">
              <img src="/assets/images/2013_1153.svg" alt="" class="btn-icon">
              <span>Mulai percakapan</span>
            </button>
          </div>
        </article>


        <article class="service-card">
          <p class="service-desc">Bergabung dengan komunitas kami untuk melihat kegiatan dan aktivitas operasional setiap hari.</p>
          <div class="service-action">
            <button class="action-btn" @click="handleLinkClick(officialSupportLink)">
              <img src="/assets/images/2013_1162.svg" alt="" class="btn-icon">
              <span>Lihat komunitas</span>
            </button>
          </div>
        </article>

 
        <article class="service-card">
          <p class="service-desc">Jika Anda membutuhkan bantuan singkat, silakan berbicara dengan layanan bot kami!</p>
          <div class="service-action">
            <button class="action-btn" @click="goToHelpCenter">
              <img src="/assets/images/2013_1170.svg" alt="" class="btn-icon">
              <span>Mulai percakapan</span>
            </button>
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
  router.push('/support/platform')
}

const handleLinkClick = (link) => {
  if (!link || link === '#') {
    // Link not yet available
    return
  }
  window.open(link, '_blank')
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
.app-container {
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  background-color: #f8f8f8;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

/* Header */
#section-header .header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  position: relative;
}

#section-header .back-btn {
  position: absolute;
  left: 5px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

#section-header .back-btn img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

#section-header .header-title {
  font-size: 15px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  letter-spacing: 0.2px;
}

/* Services */
#section-services {
  padding: 10px 17px 30px;
  min-height: calc(100vh - 80px);
}

#section-services .services-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#section-services .service-card {
  background: linear-gradient(90deg, #4e733f 0%, #60995b 100%);
  border-radius: 20px;
  padding: 18px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

#section-services .service-desc {
  color: #ffffff;
  font-size: 13px;
  line-height: 1.45;
  margin: 0;
  font-weight: 400;
}

#section-services .service-action {
  display: flex;
  justify-content: flex-end;
}

#section-services .action-btn {
  background-color: #004d43;
  border: none;
  border-radius: 50px;
  padding: 6px 14px 6px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.2s ease;
}

#section-services .action-btn:hover {
  background-color: #003831;
}

#section-services .action-btn span {
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

#section-services .btn-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
</style>


