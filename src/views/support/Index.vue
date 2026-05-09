<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/441_929.svg" alt="">
        </button>
        <h1 class="title">Contact Us</h1>
      </header>
    </section>

    <!-- Intro -->
    <section id="section-intro">
      <div class="intro-text">
        Contact us<br>
        if you have any question, please contact us!
      </div>
    </section>

    <!-- Contact List -->
    <section id="section-contact-list">
      <div class="contact-list">
        <!-- Telegram Channel -->
        <a class="contact-card" @click.prevent="handleLinkClick(telegramChannelLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/12c90035b0ea3086c159165d7e40bd1ea08c635a.png" alt="Telegram">
          </div>
          <span class="card-text">Telegram Channel</span>
          <img class="card-arrow" src="/assets/image/443_957.svg" alt="">
        </a>

        <!-- Customer Service -->
        <a class="contact-card" @click.prevent="handleLinkClick(officialSupportLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/12c90035b0ea3086c159165d7e40bd1ea08c635a.png" alt="Customer Service">
          </div>
          <span class="card-text">Customer Service</span>
          <img class="card-arrow" src="/assets/image/443_960.svg" alt="">
        </a>

        <!-- Community WhatsApp -->
        <a class="contact-card" @click.prevent="handleLinkClick(whatsappLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/92eab75ecb988672b7182dcc489e5a84b6f62d24.png" alt="WhatsApp">
          </div>
          <span class="card-text">Community WhatsApp</span>
          <img class="card-arrow" src="/assets/image/443_963.svg" alt="">
        </a>

        <!-- Private Consultant -->
        <a class="contact-card" @click.prevent="handleLinkClick(consultantLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/92eab75ecb988672b7182dcc489e5a84b6f62d24.png" alt="Private Consultant">
          </div>
          <span class="card-text">Private Consultant</span>
          <img class="card-arrow" src="/assets/image/522_108.svg" alt="">
        </a>

        <!-- Facebook -->
        <a class="contact-card" @click.prevent="handleLinkClick(facebookLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/d153b1998421f83ecc7dc00ffa24cb9dfc1e887a.png" alt="Facebook">
          </div>
          <span class="card-text">Facebook</span>
          <img class="card-arrow" src="/assets/image/4273_528.svg" alt="">
        </a>

        <!-- Twitter X -->
        <a class="contact-card" @click.prevent="handleLinkClick(twitterLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/80176cbddefe4711112048121da03baff34f98b5.png" alt="Twitter X">
          </div>
          <span class="card-text">Twitter X</span>
          <img class="card-arrow" src="/assets/image/4273_542.svg" alt="">
        </a>
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
const whatsappLink = ref('#')
const consultantLink = ref('#')
const facebookLink = ref('#')
const twitterLink = ref('#')

const goBack = () => {
  router.go(-1)
}

const handleLinkClick = (link) => {
  if (!link || link === '#') {
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

    data.forEach((item) => {
      if (!item || !item.url) return
      const url = item.url.trim()
      const id = Number(item.id)
      if (id === 1) telegramChannelLink.value = url
      else if (id === 4) officialSupportLink.value = url
    })
  } catch (error) {
    console.error('Failed to fetch support links:', error)
  }
}

onMounted(() => {
  fetchSupportLinks()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
#section-header .header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 19px;
  padding-bottom: 23px;
  position: relative;
}

#section-header .back-btn {
  position: absolute;
  left: 18px;
  top: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

#section-header .title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Intro */
#section-intro .intro-text {
  padding: 0 18px 17px;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  line-height: 1.4;
}

/* Contact List */
#section-contact-list .contact-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 18px 40px;
}

#section-contact-list .contact-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 5px;
  padding-right: 18px;
  text-decoration: none;
  color: #000000;
  position: relative;
  height: 67px;
  cursor: pointer;
}

#section-contact-list .blue-line {
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 29px;
  background-color: #1b46f5;
  border-top-left-radius: 5px;
}

#section-contact-list .icon-container {
  width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#section-contact-list .card-icon {
  max-width: 47px;
  max-height: 44px;
  object-fit: contain;
}

#section-contact-list .card-text {
  flex: 1;
  font-size: 14px;
  font-weight: 700;
}

#section-contact-list .card-arrow {
  width: 20px;
  height: 20px;
}
</style>
