<template>
  <div class="media-page">
    <!-- Header Section -->
    <section class="app-container header-section">
      <nav class="top-nav">
        <div class="back-link" @click="goBack">
          <img src="/assets/image/48_833.svg" alt="Back" class="icon-back">
          <span>Kembali ke beranda</span>
        </div>
      </nav>
      
      <div class="header-titles">
        <h1>Press & Media</h1>
        <p>Berita & informasi terbaru</p>
      </div>
    </section>

    <!-- About Card -->
    <section class="app-container">
      <div class="card about-card">
        <h2 class="card-title">Tentang SENT</h2>
        <div class="divider"></div>
        <p class="card-text">
          OT-SENT adalah platform teknologi berbasis kecerdasan buatan yang menyediakan solusi pemetaan udara, monitoring, dan analisis data melalui sistem drone terintegrasi. Platform ini dirancang untuk mendukung pengolahan data secara real-time dengan pendekatan yang efisien dan terukur.
        </p>
      </div>
    </section>

    <!-- Media Kit Card -->
    <section class="app-container">
      <div class="card media-kit-card">
        <div class="title-row">
          <div class="line"></div>
          <h2 class="card-title">Media Kit</h2>
          <div class="line"></div>
        </div>
        
        <p class="media-desc">Unduh aset resmi OT-SENT untuk kebutuhan publikasi dan media.</p>
        
        <div class="gallery-grid">
          <img src="/assets/image/e4875339e14d3421e70b600b50864cafd194de7e.png" alt="Media 1">
          <img src="/assets/image/40e037e5eea2248fa485ee711e79643bb177b97e.png" alt="Media 2">
          <img src="/assets/image/3c8a73dbd8e58a0918b148c1221b59dcaac0de2f.png" alt="Media 3">
          <img src="/assets/image/d3af559f0405ac92f4b0667d92aeb49f07e72f43.png" alt="Media 4">
        </div>
        
        <p class="copyright-text">© 2026 OT-SENT. All Rights Reserved</p>
      </div>
    </section>

    <!-- News Cards -->
    <section class="app-container">
      <!-- Card 1: Feature Launch -->
      <div class="card news-card">
        <h2 class="card-title">Peluncuran Fitur Terbaru</h2>
        <p class="news-date">21 Maret 2026</p>
        <div class="divider"></div>
        <p class="news-excerpt">OT-SENT merilis fitur terbaru untuk pengguna.</p>
        
        <div class="btn-container">
          <router-link to="/pages/account/media/feature-launch" class="btn-read-more">
            <span>Baca selengkapnya</span>
            <img src="/assets/image/52_881.svg" alt="arrow">
          </router-link>
        </div>
      </div>

      <!-- Card 2: Collaboration -->
      <div class="card news-card">
        <h2 class="card-title">Kolaborasi Strategis</h2>
        <p class="news-date">11 Maret 2026</p>
        <div class="divider"></div>
        <p class="news-excerpt">OT-SENT umumkan kemitraan baru dengan...</p>
        
        <div class="btn-container">
          <router-link to="/pages/account/media/strategic-collaboration" class="btn-read-more">
            <span>Baca selengkapnya</span>
            <img src="/assets/image/52_901.svg" alt="arrow">
          </router-link>
        </div>
      </div>
    </section>

    <!-- Info Section -->
    <section class="app-container info-section">
      <div class="facts-block">
        <h3>Fakta Singkat</h3>
        <ul class="facts-list">
          <li>
            <span class="dot"></span>
            <span>Berdiri sejak 2020</span>
          </li>
          <li>
            <span class="dot"></span>
            <span>Ribuan pemetaan yang sudah dikerjakan</span>
          </li>
          <li>
            <span class="dot"></span>
            <span>Fokus inovasi teknologi</span>
          </li>
        </ul>
      </div>

      <div class="contact-block">
        <h3>Kontak Media</h3>
        <div class="contact-item">
          <img src="/assets/image/5fea93b5f492cdd2ffd520ffdeb38691827fa383.png" alt="Email" class="icon-email">
          <span>support@otsent.com</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section class="app-container">
      <footer class="site-footer">
        <p class="footer-desc">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        <div class="footer-bottom">
          <img src="/assets/image/983276.png" alt="Ot-Sent Logo" class="footer-logo">
          <span class="footer-copyright">© 2026 OT-SENT. All Rights Reserved</span>
        </div>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.media-page {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0F0B2E;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top center;
  color: #ffffff;
  min-height: 100vh;
  width: 100%;
}

.app-container {
  width: 100%;
  max-width: 412px;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 40px;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, p, ul, li {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

/* Header Section */
.header-section {
  padding: 20px 20px 20px;
}

.top-nav {
  margin-bottom: 20px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #A6A6A6;
  font-size: 14px;
  cursor: pointer;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.header-titles {
  text-align: center;
  margin-top: 20px;
}

.header-titles h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.header-titles p {
  font-size: 14px;
  color: #ffffff;
}

/* Card Styles */
.card {
  background: linear-gradient(180deg, rgba(15, 11, 46, 1) 0%, rgba(43, 27, 111, 1) 100%);
  border-radius: 10px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
  padding: 20px;
  margin: 0 20px 20px 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
  color: #ffffff;
}

.divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  width: 100%;
  margin-bottom: 12px;
}

.card-text {
  font-size: 13px;
  line-height: 1.5;
  color: #fffdfd;
  text-align: left;
}

/* Media Kit */
.title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.title-row .line {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  flex: 1;
}

.title-row .card-title {
  margin: 0;
  white-space: nowrap;
}

.media-desc {
  font-size: 13px;
  color: #a6a6a6;
  margin-bottom: 20px;
  line-height: 1.4;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.gallery-grid img {
  width: 100%;
  height: auto;
  aspect-ratio: 3/2;
  object-fit: cover;
  display: block;
}

.copyright-text {
  font-size: 10px;
  color: #ffffff;
  opacity: 0.8;
}

/* News Cards */
.news-card .card-title {
  text-align: center;
  margin-bottom: 4px;
}

.news-date {
  font-size: 12px;
  color: #a6a6a6;
  margin-bottom: 12px;
  text-align: left;
  padding-left: 4px;
}

.news-excerpt {
  font-size: 13px;
  color: #a6a6a6;
  margin-bottom: 20px;
  padding-left: 4px;
}

.btn-container {
  display: flex;
  justify-content: flex-end;
}

.btn-read-more {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30%, #9047E0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  padding: 6px 12px;
  font-size: 12px;
  color: white;
  font-weight: 500;
}

.btn-read-more img {
  width: 16px;
  height: 16px;
}

/* Info Section */
.info-section {
  padding: 0 20px 20px;
}

.facts-block, .contact-block {
  margin-bottom: 30px;
}

.info-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #ffffff;
}

.facts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.facts-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #ffffff;
}

.dot {
  width: 15px;
  height: 15px;
  background-color: #8265e3;
  border-radius: 50%;
  flex-shrink: 0;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #ffffff;
}

.icon-email {
  width: 34px;
  height: 24px;
  object-fit: contain;
}

/* Footer */
.site-footer {
  padding: 0 20px;
  margin-top: 20px;
}

.footer-desc {
  font-size: 11px;
  color: #c4c4c4;
  margin-bottom: 10px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
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
</style>
