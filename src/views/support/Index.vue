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
        <a class="contact-card" :href="getHref(telegramChannelLink)" @click="handleCardClick($event, telegramChannelLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/12c90035b0ea3086c159165d7e40bd1ea08c635a.png" alt="Telegram">
          </div>
          <span class="card-text">Telegram Channel</span>
          <img class="card-arrow" src="/assets/image/443_957.svg" alt="">
        </a>

        <!-- Customer Service -->
        <a class="contact-card" :href="getHref(officialSupportLink)" @click="handleCardClick($event, officialSupportLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/12c90035b0ea3086c159165d7e40bd1ea08c635a.png" alt="Customer Service">
          </div>
          <span class="card-text">Customer Service</span>
          <img class="card-arrow" src="/assets/image/443_960.svg" alt="">
        </a>

        <!-- Community WhatsApp -->
        <a class="contact-card" :href="getHref(whatsappLink)" @click="handleCardClick($event, whatsappLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/92eab75ecb988672b7182dcc489e5a84b6f62d24.png" alt="WhatsApp">
          </div>
          <span class="card-text">Community WhatsApp</span>
          <img class="card-arrow" src="/assets/image/443_963.svg" alt="">
        </a>

      

        <!-- Facebook -->
        <a class="contact-card" :href="getHref(facebookLink)" @click="handleCardClick($event, facebookLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="/assets/image/d153b1998421f83ecc7dc00ffa24cb9dfc1e887a.png" alt="Facebook">
          </div>
          <span class="card-text">Facebook</span>
          <img class="card-arrow" src="/assets/image/4273_528.svg" alt="">
        </a>

        <!-- Instagram -->
        <a class="contact-card" :href="getHref(instagramLink)" @click="handleCardClick($event, instagramLink)">
          <div class="blue-line"></div>
          <div class="icon-container">
            <img class="card-icon" src="https://api.iconify.design/mdi/instagram.svg?color=%23000000" alt="Instagram">
          </div>
          <span class="card-text">Instagram</span>
          <img class="card-arrow" src="/assets/image/4273_542.svg" alt="">
        </a>

        <!-- Twitter X -->
        <a class="contact-card" :href="getHref(twitterLink)" @click="handleCardClick($event, twitterLink)">
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
import { authAPI, supportAPI } from '@/services/api'

const router = useRouter()
const telegramChannelLink = ref('#')
const officialSupportLink = ref('#')
const whatsappLink = ref('#')
const consultantLink = ref('#')
const facebookLink = ref('#')
const instagramLink = ref('#')
const twitterLink = ref('#')

const stripQuotes = (value) => {
  let s = String(value ?? '').trim()
  if (!s) return ''
  if (s.length >= 2) {
    const first = s[0]
    const last = s[s.length - 1]
    if ((first === '`' && last === '`') || (first === '"' && last === '"') || (first === "'" && last === "'")) {
      s = s.slice(1, -1).trim()
    }
  }
  return s
}

const toWaMeLink = (phone) => {
  let digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  return digits ? `https://wa.me/${digits}` : ''
}

const goBack = () => {
  router.go(-1)
}

const getHref = (link) => {
  const s = stripQuotes(link)
  return s && s !== '#' ? s : '#'
}

const handleCardClick = (event, link) => {
  event?.preventDefault?.()
  const href = getHref(link)
  if (href === '#') return
  try {
    window.location.href = href
  } catch (_) {
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

    const rootPhone = stripQuotes(response?.data?.root_parent_phone || '')
    const waMe = toWaMeLink(rootPhone)
    if (waMe) consultantLink.value = waMe
    if (!Array.isArray(data)) return
    for (const item of data) {
      if (!item || !item.url) continue
      if (item.is_active === false) continue
      const id = Number(item.id)
      const url = stripQuotes(item.url)
      if (!url) continue

      if (id === 6) telegramChannelLink.value = url
      else if (id === 10 || id === 4) officialSupportLink.value = url
      else if (id === 9) whatsappLink.value = url
      else if (id === 3) consultantLink.value = url
      else if (id === 8) facebookLink.value = url
      else if (id === 7) instagramLink.value = url
      else if (id === 5) twitterLink.value = url
    }
  } catch (error) {

    if (consultantLink.value === '#' || !consultantLink.value) {
      try {
        const token = String(localStorage.getItem('auth_token') || '').trim()
        if (!token) return
        const acc = await authAPI.getAccountInfo()
        const p = stripQuotes(acc?.data?.root_parent_phone || '')
        const fromAcc = toWaMeLink(p)
        if (fromAcc) consultantLink.value = fromAcc
      } catch (_) {}
    }
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
  font-size: 15px;
  font-weight: 500;
}

#section-contact-list .card-arrow {
  width: 20px;
  height: 20px;
}
</style>
