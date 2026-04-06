<template>
  <div class="app-container">
    
    <section id="header" class="header-section">
      <div class="header-content">
        <img src="/assets/images/61_7.svg" alt="Back" class="back-icon" @click="goBack">
        <h1 class="page-title">Pusat Bantuan Platform</h1>
      </div>
    </section>
    
    <section id="hero" class="hero-spacer">
      <!-- This section serves as a spacer for the background illustration -->
    </section>
    
    <section id="topics" class="content-section">
      <h2 class="section-title text-blue">Semua Topik</h2>
      
      <div class="card-list">
        <!-- Card 1: Pusat Bantuan -->
        <div class="card" @click="navigateTo('/pages/account/help')">
          <img src="/assets/images/61_10.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-icon-wrapper">
              <img src="/assets/images/ea689daee0836d19f5c91d3b47238f98eb39d52e.png" class="card-icon" alt="Icon">
            </div>
            <div class="card-text">
              <h3 class="card-title">Pusat Bantuan</h3>
              <p class="card-desc">Dapatkan informasi dan pertanyaan yang sering diajukan terkait perusahaan</p>
            </div>
            <img src="/assets/images/61_11.svg" class="card-arrow" alt="Go">
          </div>
        </div>

        <!-- Card 2: Produk Perusahaan Lainnya -->
        <div class="card" @click="navigateTo('/pages/account/products')">
          <img src="/assets/images/62_22.svg" class="card-bg" alt="">
          <div class="card-inner">
             <div class="card-icon-wrapper">
              <img src="/assets/images/image 24.png" class="card-icon" alt="Icon">
            </div>
            <div class="card-text" style="margin-left: 0;">
              <h3 class="card-title">Produk Perusahaan Lainnya</h3>
              <p class="card-desc">Cari tahu lebih lanjut produk perusahaan lainnya</p>
            </div>
            <img src="/assets/images/62_25.svg" class="card-arrow" alt="Go">
          </div>
        </div>

        <!-- Card 3: Ajukan Tiket Pengaduan -->
        <div class="card" @click="navigateTo('/pages/account/support/bot')">
          <img src="/assets/images/62_28.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-icon-wrapper">
              <img src="/assets/images/c84d817a24a523621dfa6dd2cc0962d37e88eb60.png" class="card-icon" alt="Icon">
            </div>
            <div class="card-text">
              <h3 class="card-title">Ajukan Tiket Pengaduan</h3>
              <p class="card-desc">Ajukan pengaduan terkait kegagalan transaksi disini</p>
            </div>
            <img src="/assets/images/62_31.svg" class="card-arrow" alt="Go">
          </div>
        </div>
      </div>
    </section>
    
    <section id="contact" class="content-section">
      <h2 class="section-title text-orange">Kontak Kami</h2>
      
      <div class="card-list">
        <!-- Contact 1 -->
        <div class="card">
          <img src="/assets/images/62_34.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-icon-wrapper">
              <img src="/assets/images/961dcc02ef13912b9815f86b308fc0d5e3d1c50d.png" class="card-icon" alt="Icon">
            </div>
            <div class="card-text">
              <span class="contact-label">Kontak Perusahaan</span>
              <span class="contact-value">187***0357</span>
            </div>
          </div>
        </div>

        <!-- Contact 2 -->
        <div class="card" @click="openWhatsApp('0812****017')">
          <img src="/assets/images/62_42.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-icon-wrapper">
              <img src="/assets/images/5f04b4d38bf499e7bc1a5db9557fd17981493cf4.png" class="card-icon" alt="Icon">
            </div>
            <div class="card-text">
              <span class="contact-label">Aduan WhatsApp</span>
              <span class="contact-value">0812 **** 017</span>
            </div>
          </div>
        </div>

        <!-- Contact 3 -->
        <div class="card" @click="openTelegram('@AsetNusaOfficial')">
          <img src="/assets/images/62_48.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-icon-wrapper">
              <img src="/assets/images/b7eba37a2ad9bf9c0be0657343c2f675ae3ab185.png" class="card-icon" alt="Icon">
            </div>
            <div class="card-text">
              <span class="contact-label">Telegram Resmi</span>
              <span class="contact-value">@AsetNusaOfficial</span>
            </div>
          </div>
        </div>

        <!-- Contact 4 -->
        <div class="card" @click="openWebsite('www.aset-nusa.com')">
          <img src="/assets/images/62_54.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-icon-wrapper">
              <img src="/assets/images/24d6c7a0f44ee10562ca19fd512e78efff8e4eb5.png" class="card-icon" alt="Icon">
            </div>
            <div class="card-text">
              <span class="contact-label">Website</span>
              <span class="contact-value">www.aset-nusa.com</span>
            </div>
          </div>
        </div>

        <!-- Contact 5 -->
        <div class="card" @click="openEmail('callcustomer@aset-nusa.com')">
          <img src="/assets/images/62_60.svg" class="card-bg" alt="">
          <div class="card-inner">
            <div class="card-icon-wrapper">
              <img src="/assets/images/74df1a07c56cf6d01a9c5d1bde9ae464afc0460f.png" class="card-icon" alt="Icon">
            </div>
            <div class="card-text">
              <span class="contact-label">Email</span>
              <span class="contact-value">callcustomer@aset-nusa.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <footer class="site-footer">
      <p class="footer-text">Berkomitmen terhadap kepatuhan regulasi dan perlindungan konsumen.</p>
      <p class="footer-text">© 2026 ASFina – Aset Finansial Nusantara. Seluruh hak cipta dilindungi undang-undang.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const navigateTo = (path) => {
  router.push(path)
}

const openWhatsApp = (number) => {
  const url = `https://wa.me/${number.replace(/\*/g, '')}?text=Halo,%20saya%20butuh%20bantuan`
  window.open(url, '_blank')
}

const openTelegram = (username) => {
  const url = `https://t.me/${username.replace('@', '')}`
  window.open(url, '_blank')
}

const openWebsite = (website) => {
  const url = `https://${website}`
  window.open(url, '_blank')
}

const openEmail = (email) => {
  const url = `mailto:${email}`
  window.open(url, '_blank')
}
</script>

<style scoped>


body {
  
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.app-container {
  width: 100%;
  max-width: 412px;
  background-color: #ffffff;
  background-image: url('/assets/images/faacf23d4da2e3d961b5760a7432e503db73a161.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: top center;
  position: relative;
  overflow-x: hidden;
  min-height: 1200px;
}

a {
  text-decoration: none;
  color: inherit;
}

* {
  box-sizing: border-box;
}

/* CSS for section section:Header */
.header-section {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px 10px;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-icon {
  width: 48px;
  height: 48px;
  display: block;
  cursor: pointer;
}

.page-title {
 
  font-weight: 600;
  font-size: 18px;
  color: #ffffff;
  margin: 0;
  line-height: 25px;
}

/* CSS for section section:Hero */
.hero-spacer {
  height: 334px;
  width: 100%;
}

/* CSS for section section:Topics */
.content-section {
  padding: 0 22px;
  margin-bottom: 20px;
  margin-top: -20px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.text-blue {
  color: #3255b6;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.card {
  position: relative;
  width: 100%;
  height: 73px;
  border: none;
  cursor: pointer;
  background: transparent;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 0;
}

.card-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 15px;
}

.card-icon-wrapper {
  width: 30px;
  display: flex;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.card-icon {
  max-width: 100%;
  max-height: 30px;
  object-fit: contain;
}

.card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
}

.card-desc {
  font-size: 10px;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

.card-arrow {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

/* CSS for section section:Contact */
.text-orange {
  color: #ca7900;
}

.contact-label {
  font-size: 12px;
  color: #000000;
  margin-bottom: 2px;
}

.contact-value {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

/* CSS for section section:Footer */
.site-footer {
  padding: 40px 22px 60px 22px;
  text-align: center;
}

.footer-text {
  font-size: 10px;
  color: #000000;
  margin: 0 0 5px 0;
  line-height: 1.4;
}
</style>
