<template>
  <main class="splash-screen">
    <!-- Header Section -->
    <section id="section-header" class="section-header">
      <div class="container header-container">
        <div class="logo">
          <img src="/assets/image/983276.png" alt="Logo">
        </div>
        <div class="header-actions">
          <router-link to="/pages/account/access" class="btn-login">Login</router-link>
          <router-link to="/pages/account/register" class="btn-register">Daftar sekarang</router-link>
        </div>
      </div>
    </section>

    <!-- Hero Section -->
    <section id="section-hero" class="section-hero">
      <div class="container hero-container">
        <!-- Tagline Pill -->
        <div class="hero-tagline">
          <img src="/assets/image/25_27.svg" alt="Arrow" class="icon-arrow">
          <span class="tagline-text">AI-Powered Aerial Intelligence System</span>
        </div>

        <!-- Main Title -->
        <h1 class="hero-title">Pantau Dunia dari Udara, Cerdas & Cepat.</h1>

        <!-- Subtitle -->
        <p class="hero-subtitle">
          OT-SENT mengubah drone menjadi sistem pemetaan berbasis AI untuk monitoring dan analisis data secara real-time.
        </p>

        <!-- CTA Buttons -->
        <div class="hero-ctas">
          <router-link to="/pages/account/register" class="btn-primary">Mulai Sekarang</router-link>
          <router-link to="/pages/account/media" class="btn-secondary">
            <img src="/assets/image/27_14.svg" alt="Play" class="icon-play">
            Lihat Demo
          </router-link>
        </div>

        <!-- Feature Icons -->
        <div class="hero-features">
          <div class="feature-item">
            <img src="/assets/image/d987813d42710b5703f5a02b885a59c946c85d5b.png" alt="Icon">
            <span>Tanpa instalasi</span>
          </div>
          <div class="feature-item">
            <img src="/assets/image/d6ffcdba70edea0430dd36b9f55f7b2c4b4a5cfa.png" alt="Icon">
            <span>Real-time data</span>
          </div>
          <div class="feature-item">
            <img src="/assets/image/d02bd0fe3ccd52a817461c669ce518b97f328a3e.png" alt="Icon">
            <span>Aman</span>
          </div>
        </div>

        <!-- Drone Visual -->
        <div class="hero-visual">
          <img src="/assets/image/f71385b1ed889181bbd3a8b610d7934d1feed14d.png" alt="Drone Interface">
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section id="section-stats" class="section-stats">
      <div class="container stats-container">
        <div class="stats-grid">
          <!-- Card 1 -->
          <div class="stat-card">
            <div class="stat-header">
              <img src="/assets/image/6c4c54ebb961aa0dbd280661908106c23a468c5b.png" alt="Icon">
              <span class="stat-number">2.458+</span>
            </div>
            <div class="stat-label">Misi Pemetaan</div>
          </div>
          
          <!-- Card 2 -->
          <div class="stat-card">
            <div class="stat-header">
              <img src="/assets/image/6c4c54ebb961aa0dbd280661908106c23a468c5b.png" alt="Icon">
              <span class="stat-number">98.7%</span>
            </div>
            <div class="stat-label">Akurasi AI</div>
          </div>

          <!-- Card 3 -->
          <div class="stat-card">
            <div class="stat-header">
              <img src="/assets/image/6c4c54ebb961aa0dbd280661908106c23a468c5b.png" alt="Icon">
              <span class="stat-number purple-text">1.200+</span>
            </div>
            <div class="stat-label">Klien Aktif</div>
          </div>

          <!-- Card 4 -->
          <div class="stat-card">
            <div class="stat-header">
              <img src="/assets/image/6c4c54ebb961aa0dbd280661908106c23a468c5b.png" alt="Icon">
              <span class="stat-number">10.827+</span>
            </div>
            <div class="stat-label">Jam Terbang Drone</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section id="section-newsletter" class="section-newsletter">
      <div class="container newsletter-container">
        <div class="newsletter-card">
          <h3>Get the latest updates from OT-SENT</h3>
          <p>Be the first to receive our latest product updates, newest offerings, and free product trials.</p>
          
          <div class="input-group">
            <input type="email" placeholder="Enter your email address">
          </div>
          
          <button type="button" class="btn-submit" @click="showNewsletterNotification">Dapatkan update produk OT-SENT</button>

          <p style="text-align: center; margin-top: 10px;">You can learn more about how we handle user data through the OtSent Privacy Policy</p>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="section-footer" class="section-footer">
      <div class="container footer-container">
      
        <div class="footer-disclaimer">
          <p>OT-SENT adalah layanan teknologi berbasis kecerdasan buatan yang menyediakan solusi pemetaan udara, monitoring, dan analisis data secara real-time melalui sistem drone terintegrasi.

PEMBERITAHUAN: OT-SENT adalah layanan teknologi yang menyediakan layanan pemetaan dan analisis data berbasis drone. Informasi dan hasil analisis yang ditampilkan merupakan data estimasi berbasis sistem dan dapat berubah sesuai kondisi lapangan.

OT-SENT tidak menjamin keakuratan mutlak dari seluruh data yang dihasilkan dan tidak bertanggung jawab atas keputusan yang diambil berdasarkan informasi tersebut. Penggunaan layanan sepenuhnya menjadi tanggung jawab pengguna.</p></div>
        <div class="footer-links-section">
          <h4>Other</h4>
          <div class="links-grid">
            <router-link to="/pages/account/terms">Terms of Service</router-link>
            <router-link to="/pages/account/cookie">Cookie Policy</router-link>
            <router-link to="/pages/account/help">Help Center</router-link>
            <router-link to="/pages/account/career">Karir</router-link>
            <router-link to="/pages/account/privacy">Privacy Policy</router-link>
            <router-link to="/pages/account/media">Press / Media</router-link>
            <router-link to="/pages/account/solution">Produk & Solusi</router-link>
          </div>
           <div class="footer-bottom">
         
          <router-link to="/pages/account/privacy" class="app-container footer-policy-link">
            <footer class="site-footer">
              <p class="footer-desc">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
              <div class="footer-bottom">
                <img src="/assets/image/983276.png" alt="OT-SENT Logo" class="footer-logo">
                <span class="footer-copyright">© 2026 OT-SENT. All Rights Reserved</span>
              </div>
            </footer>
          </router-link>
        </div>
        </div>
       
      </div>
    </section>
  </main>

  <SuccessModal v-model="newsletterSuccessOpen" message="Successfully to approve send new product later" />
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'

const newsletterSuccessOpen = ref(false)
let newsletterTimer = null

const showNewsletterNotification = () => {
  newsletterSuccessOpen.value = true
  if (newsletterTimer) clearTimeout(newsletterTimer)
  newsletterTimer = setTimeout(() => {
    newsletterSuccessOpen.value = false
    newsletterTimer = null
  }, 1800)
}

onBeforeUnmount(() => {
  if (newsletterTimer) clearTimeout(newsletterTimer)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

.splash-screen {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(180deg, rgba(25, 24, 71, 1) 0%, rgba(6, 8, 22, 1) 46%, rgba(10, 7, 27, 1) 100%);
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.container {
  width: 100%;
  max-width: 412px;
  position: relative;
  overflow: hidden;
}

img {
  max-width: 100%;
  display: block;
}

/* Header Section */
.section-header {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  padding-bottom: 10px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
}

.logo img {
  width: 258px;
  height: auto;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-login {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  cursor: pointer;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 81px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn-login:hover {
  opacity: 0.9;
}

.btn-register {
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30%, #9047E0 100%);
  border: 1px solid #746a9a;
  color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  cursor: pointer;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 81px;
  white-space: nowrap;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn-register:hover {
  opacity: 0.9;
}

/* Hero Section */
.section-hero {
  width: 100%;
  display: flex;
  justify-content: center;
}

.hero-container {
  padding: 10px 26px 0;
  display: flex;
  flex-direction: column;
}

.hero-tagline {
  display: flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(90deg, #100F2C 0%, #0F132E 47%, #0A1025 100%);
  padding: 8px 10px;
  border-radius: 10px;
  margin-bottom: 15px;
  width: fit-content;
}

.tagline-text {
  font-size: 12px;
  background: linear-gradient(90deg, #8265E3 0%, #8A77C9 34%, #9085B5 62%, #8C6CFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

.icon-arrow {
  width: 16px;
  height: auto;
}

.hero-title {
  font-size: 32px;
  line-height: 1.2;
  margin: 0 0 15px 0;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-weight: 200;
}

.hero-subtitle {
  font-size: 14px;
  line-height: 1.5;
  color: #ffffff;
  margin: 0 0 24px 0;
}

.hero-ctas {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.btn-primary {
  flex: 1;
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30%, #9047E0 100%);
  border: 1px solid #746a9a;
  color: white;
  padding: 10px;
  border-radius: 10px;
  font-weight: 400;
  cursor: pointer;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  flex: 1;
  background-color: #1d2138;
  border: 1px solid #746a9a;
  color: white;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  height: 41px;
  transition: opacity 0.2s;
}

.btn-secondary:hover {
  opacity: 0.9;
}

.icon-play {
  width: 20px;
  height: auto;
}

.hero-features {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 0 10px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.feature-item img {
  width: 22px;
  height: auto;
}

.hero-visual {
  width: 100%;
  margin-top: 10px;
  position: relative;
  z-index: 1;
}

.hero-visual img {
  width: 100%;
  height: auto;
  border-radius: 0;
}

/* Stats Section */
.section-stats {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: -20px;
  position: relative;
  z-index: 2;
}

.stats-container {
  padding: 0 19px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(180deg, #0F0B2E 0%, #2B1B6F 100%);
  border-radius: 10px;
  padding: 16px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 76px;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.stat-header img {
  width: 24px;
  height: 22px;
}

.stat-number {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.purple-text {
  color: #8c6cff;
}

.stat-label {
  color: #a6a6a6;
  font-size: 12px;
  margin-left: 36px;
}

/* Newsletter Section */
.section-newsletter {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.newsletter-container {
  padding: 0 19px;
}

.newsletter-card {
  background: linear-gradient(180deg, #0F0B2E 0%, #2B1B6F 100%);
  border-radius: 10px;
  padding: 24px 16px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
}

.newsletter-card h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
}

.newsletter-card p {
  margin: 0 0 20px 0;
  font-size: 12px;
  color: #a6a6a6;
  line-height: 1.4;
}

.input-group {
  background-color: #1d2138;
  border: 1px solid #746a9a;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 15px;
}

.input-group input {
  background: transparent;
  border: none;
  color: #ffffff;
  width: 100%;
  font-family: 'Inter', sans-serif;
  outline: none;
}

.input-group input::placeholder {
  color: #b9b9b9;
}

.btn-submit {
  width: 100%;
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30%, #9047E0 100%);
  border: 1px solid #746a9a;
  color: white;
  padding: 12px;
  border-radius: 10px;
  font-weight: 400;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: opacity 0.2s;
}

.btn-submit:hover {
  opacity: 0.9;
}

/* Footer Section */
.section-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
}

.footer-container {
  padding: 0 20px;
}

.footer-privacy-note {
  font-size: 12px;
  color: #f9f9f9;
  margin-bottom: 30px;
  line-height: 1.5;
}

.footer-disclaimer {
  font-size: 10px;
  color: #bababa;
  line-height: 1.6;
  margin-bottom: 40px;
  text-align: justify;
}

.footer-disclaimer p {
  margin-bottom: 10px;
}

.footer-links-section h4 {
  color: #f9f9f9;
  font-size: 14px;
  margin-bottom: 15px;
}

.links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 40px;
}

.links-grid a {
  color: #ffffff;
  text-decoration: none;
  font-size: 11px;
  transition: opacity 0.2s;
}

.links-grid a:hover {
  opacity: 0.8;
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 0px;
}

.footer-logo img {
  width: 90px;
  margin-bottom: 10px;
}

.copyright-text p {
  margin: 2px 0;
  font-size: 10px;
  color: #c4c4c4;
}

/* Footer */
.site-footer {
  padding: 0px;
  margin-top: 20px;
}

.footer-desc {
  font-size: 11px;
  color: #c4c4c4;
  margin-bottom: 0px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  gap: 2px;
}

.footer-logo {
  height: 37px;
  width: auto;
  object-fit: contain;
}

.footer-copyright {
  font-size: 11px;
  color: #ffffff;
}

.footer-policy-link {
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

</style>
