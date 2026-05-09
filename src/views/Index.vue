<template>
  <div class="index-container">
    <!-- Header Section -->
    <section id="section-header" class="header-section">
      <div class="container">
        <header class="header">
          <router-link to="/" class="logo-link">
            <img src="/assets/image/d6fdfec9af71120ed69cee9c9560f6254901b2e8.png" alt="AVR Logo" class="logo">
          </router-link>
          <button
            ref="menuBtnEl"
            class="menu-btn"
            aria-label="Toggle menu"
            :aria-expanded="menuOpen ? 'true' : 'false'"
            @click.stop="toggleMenu"
          >
            <img src="/assets/image/d89b12e7619acdd47438a9301486cb923ced86a1.png" alt="Menu" class="menu-icon">
          </button>
          <div v-if="menuOpen" ref="menuEl" class="header-menu" @click.stop>
            <button type="button" class="header-menu-item" @click="goTo('/login')">Login</button>
            <button type="button" class="header-menu-item" @click="goTo('/register')">Register</button>
          </div>
        </header>
      </div>
    </section>

  

    <!-- Hero Section -->
    <section id="section-hero" class="hero-section">
      <div class="container">
        <div class="hero">
          <div class="hero-content">
            <h1 class="hero-title">The Next Generation of Mining</h1>
            <p class="hero-subtitle">AVR is a decentralized mining platform that makes simple, secure, and accessible for everyone.</p>
            <router-link to="/register" class="hero-btn">
              Start Mining
              <img src="/assets/image/4287_723.svg" alt="" class="btn-icon">
            </router-link>
          </div>
        </div>
      </div>
    </section>
      <!-- Stats Section -->
    <section id="section-stats" class="stats-section">
      <div class="container">
        <div class="stats-wrapper">
          <img src="/assets/image/2b298b3071a048b59a6237213eea515c6a9504ef.png" alt="Platform Statistics" class="stats-img" loading="lazy" decoding="async">
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="section-about" class="about-section">
      <div class="container">
        <div class="about-container">
          <div class="about-content">
            <span class="about-label">ABOUT AVR</span>
            <h2 class="about-title">Building the future of decentralized mining</h2>
            <p class="about-desc">AVR is designed to bring blockchain and mining technology to everyone. We provide a transparent, secure, and high-performance ecosystem where anyone can grow.</p>
          </div>
          <div class="about-image-wrapper">
            <img src="/assets/image/04694.png" alt="Global Network" class="about-globe">
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="section-features" class="features-section">
      <div class="container">
        <div class="features-wrapper">
          <img src="/assets/image/e7b2c02da7e11a5bb793b1717c23e9e027badc52.png" alt="Platform Features" class="features-img">
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="section-how-it-works" class="hiw-section">
      <div class="container">
        <div class="hiw-wrapper">
          <img src="/assets/image/38cd39adaf3636f4437453a3978128ba2c62a741.png" alt="How it works and Call to Action" class="hiw-img">
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="section-footer" class="footer-section">
      <div class="container">
        <footer class="footer">
          <div class="footer-left">
            <div class="footer-brand">
              <img src="/assets/image/d6fdfec9af71120ed69cee9c9560f6254901b2e8.png" alt="AVR Logo" class="footer-logo">
              <span class="footer-brand-name">AVR</span>
            </div>
            <p class="footer-desc">AVR is a next-generation decentralized mining platform for everyone.</p>
            <div class="footer-copy">
              <img src="/assets/image/4288_753.svg" alt="Copyright" class="copy-icon">
              <span>2026 AVR. All rights reserved.</span>
            </div>
          </div>
          <div class="footer-right">
            <h4 class="footer-legal-title">Legal</h4>
            <nav class="footer-links">
              <router-link to="/terms">Terms of Service</router-link>
              <router-link to="/privacy">Privacy Policy</router-link>
              <a href="/solution">Customer Agreement</a>
            </nav>
            <a href="mailto:support@avr.com" class="footer-email">support@avr.com</a>
          </div>
        </footer>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const menuOpen = ref(false)
const menuBtnEl = ref(null)
const menuEl = ref(null)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const goTo = (path) => {
  menuOpen.value = false
  router.push(path)
}

const onDocumentClick = (event) => {
  if (!menuOpen.value) return
  const target = event.target
  if (menuEl.value?.contains(target) || menuBtnEl.value?.contains(target)) return
  menuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<style scoped>
.index-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #e5e5e5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  max-width: 100%;
  margin: 0 auto;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

img {
  max-width: 100%;
  display: block;
}

/* Header Section */
.header-section {
  width: 100%;
}

.header-section .container {
  overflow: visible;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 10px;
  background-color: #f8f8f8;
  height: 54px;
  position: relative;
}

.logo-link {
  display: block;
}

.logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.menu-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.menu-icon {
  width: 29px;
  height: 19px;
  object-fit: contain;
}

.header-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 10px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
  padding: 6px;
  min-width: 150px;
  z-index: 2000;
}

.header-menu-item {
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  padding: 10px 12px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  cursor: pointer;
  border-radius: 8px;
  font-family: inherit;
}

.header-menu-item:hover {
  background: rgba(33, 77, 243, 0.08);
}

/* Stats Section */
.stats-section {
  width: 100%;
  position: relative;
  z-index: 1;
}

.stats-section .container {
  overflow: visible;
}

.stats-wrapper {
  padding: 0 12px;
  position: relative;
}

.stats-img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

@media (min-width: 768px) {
  .stats-wrapper {
    padding: 0 16px 24px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .stats-img {
    max-width: 980px;
    margin: 0 auto;
  }
}

/* Hero Section */
.hero-section {
  width: 100%;
  height: 100%;
  margin-bottom: 0px;
  z-index: 998;

}

.hero {
  position: relative;
  width: 100%;
  height: auto;
  background-image: url('/assets/image/137802d9bd27716878025d38210cfed190bab3ea.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 35px 10px;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  color: #ffffff;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 12px 0;
  max-width: 224px;
  line-height: 1.2;
}

.hero-subtitle {
  color: #ffffff;
  font-size: 11px;
  font-weight: 400;
  margin: 0 0 18px 0;
  max-width: 181px;
  line-height: 1.4;
  opacity: 0.9;
}

.hero-btn {
  background-color: #214df3;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 0 16px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  gap: 6px;
  transition: background-color 0.2s;
  text-decoration: none;
  font-family: inherit;
}

.hero-btn:hover {
  background-color: #1b46f5;
}

.btn-icon {
  width: 15px;
  height: 15px;
}

@media (min-width: 768px) {
  .container {
    max-width: 1200px;
    border-radius: 16px;
  }

  .header {
    padding: 14px 20px;
    height: 68px;
  }

  .logo {
    width: 58px;
    height: 58px;
  }

  .menu-icon {
    width: 36px;
    height: 24px;
  }

  .header-menu {
    right: 20px;
    min-width: 180px;
  }

  .header-menu-item {
    font-size: 14px;
    padding: 12px 14px;
  }

  .hero {
    padding: 72px 56px;
  }

  .hero-title {
    font-size: 40px;
    max-width: 560px;
    margin-bottom: 16px;
  }

  .hero-subtitle {
    font-size: 16px;
    max-width: 560px;
    margin-bottom: 24px;
  }

  .hero-btn {
    height: 44px;
    padding: 0 20px;
    font-size: 14px;
    border-radius: 10px;
    gap: 8px;
  }

  .btn-icon {
    width: 18px;
    height: 18px;
  }

  .about-container {
    padding: 0px;
    min-height: 100%;
    align-items: center;
  }

  .about-content {
    width: 100%;
  }

  .about-label {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .about-title {
    font-size: 28px;
    margin-bottom: 14px;
    max-width: 520px;
  }

  .about-desc {
    font-size: 14px;
    max-width: 520px;
  }

  .about-image-wrapper {
    right: 40px;
    top: -120px;
    width: 360px;
    height: 360px;
  }

  .about-globe {
    width: 360px;
    height: 360px;
  }

  .features-wrapper {
    padding: 18px 24px;
  }

  .hiw-wrapper {
    padding: 18px 24px;
  }

  .footer {
    padding: 28px 56px 56px;
    gap: 40px;
  }

  .footer-left {
    max-width: 520px;
  }

  .footer-brand-name {
    font-size: 18px;
  }

  .footer-desc {
    font-size: 14px;
    margin-bottom: 18px;
  }

  .footer-copy {
    width: auto;
    font-size: 12px;
  }

  .footer-legal-title {
    font-size: 14px;
    margin-bottom: 10px;
  }

  .footer-links a {
    font-size: 12px;
  }

  .footer-email {
    font-size: 12px;
  }
}

@media (min-width: 1024px) {
  .hero {
    padding: 88px 72px;
  }

  .hero-title {
    font-size: 46px;
  }

  .about-image-wrapper {
    right: 56px;
  }

  .hero-title {
    font-size: 52px;
  }

  .hero-subtitle {
    font-size: 18px;
  }
}

/* About Section */
.about-section {
  width: 100%;
}

.about-container {
  position: relative;
  padding: 16px 18px 20px;
  min-height: 170px;
  display: flex;
}

.about-content {
  width: 185px;
  position: relative;
  z-index: 2;
}

.about-label {
  display: block;
  color: #1b46f5;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.about-title {
  color: #000000;
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.about-desc {
  color: #535353;
  font-size: 10px;
  line-height: 1.5;
  margin: 0;
}

.about-image-wrapper {
  position: absolute;
  right: 10px;
  top: -80px;
  width: 183px;
  height: 154px;

  z-index: 1;
}

.about-globe {
  width: 350px;
  height: 350px;
  object-fit: contain;
}

/* Features Section */
.features-section {
  width: 100%;
}

.features-wrapper {
  padding: 1px 2px;
  display: flex;
  justify-content: center;
}

.features-img {
  width: 100%;
  
  height: auto;
}

/* How It Works Section */
.hiw-section {
  width: 100%;
}

.hiw-wrapper {
  padding: 5px 0px;
  display: flex;
  justify-content: center;
}

.hiw-img {
  width: 100%;
  
  height: auto;
}

/* Footer Section */
.footer-section {
  width: 100%;
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 25px 40px;
  background-color: #f8f8f8;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.footer-left {
  max-width: 145px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0px;
  margin-bottom: 0px;
}

.footer-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.footer-brand-name {
  color: #1b46f5;
  font-weight: 700;
  font-size: 15px;
}

.footer-desc {
  color: #535353;
  font-size: 10px;
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.footer-copy {
  display: flex;
  align-items: center;
  width: 250px;
  font-weight: 700;
  color: #000;
  gap: 4px;
  color: #535353;
  font-size: 9px;
}

.copy-icon {
  width: 12px;
  height: 12px;
}

.footer-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.footer-legal-title {
  color: #000000;
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 18px;
}

.footer-links a {
  color: #535353;
  font-size: 10px;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #1b46f5;
}

.footer-email {
  color: #000000;
  font-size: 10px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-email:hover {
  color: #1b46f5;
}
</style>
