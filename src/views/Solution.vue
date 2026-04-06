<template>
  <div class="solution-page">
    <!-- Header Section -->
    <section id="section-header">
      <header class="app-header">
        <button class="back-btn" @click="goBack">
          <img src="/assets/image/82_1207.svg" alt="Back">
        </button>
        <h1 class="page-title">Produk dan Solusi</h1>
      </header>
    </section>

    <!-- Hero Section -->
    <section id="section-hero">
      <div class="hero-content">
        <h2 class="hero-title">Produk & Solusi OT-SENT</h2>
        <p class="hero-subtitle">Memaksimalkan potensi teknologi pemetaan udara berbasis AI.</p>
      </div>
    </section>

    <!-- Products Section -->
    <section id="section-products">
      <div class="section-label-container">
        <div class="gradient-pill">
          <span>Produk</span>
        </div>
      </div>
      
      <div class="card-list">
        <!-- Card 1 -->
        <article class="feature-card">
          <h3 class="card-title">AI Mapping Engine</h3>
          <p class="card-desc">Sistem pemetaan berbasis kecerdasan buatan untuk mengolah data udara menjadi visualisasi yang terstruktur dan mudah dipahami.</p>
        </article>

        <!-- Card 2 -->
        <article class="feature-card">
          <h3 class="card-title">Real-Time Monitoring</h3>
          <p class="card-desc">Pantau data secara langsung melalui sistem monitoring yang terintegrasi dalam platform OT-SENT.</p>
        </article>

        <!-- Card 3 -->
        <article class="feature-card">
          <h3 class="card-title">Data Analytics</h3>
          <p class="card-desc">Analisis data hasil pemetaan untuk mendapatkan insight yang relevan dan mendukung pengambilan keputusan.</p>
        </article>
      </div>
    </section>

    <!-- Solutions Section -->
    <section id="section-solutions">
      <div class="section-label-container">
        <div class="gradient-pill">
          <span>Solusi</span>
        </div>
      </div>

      <div class="solutions-grid">
        <!-- Card 1 -->
        <article class="solution-card">
          <h3 class="solution-title">Pemetaan Area</h3>
          <div class="solution-image">
            <img src="/assets/image/21316c0607387d83d1660bf056e029b17ca4a47c.png" alt="Pemetaan Area">
          </div>
          <p class="solution-desc">Menyediakan solusi pemetaan area yang efisien menggunakan teknologi drone dan sistem AI.</p>
        </article>

        <!-- Card 2 -->
        <article class="solution-card">
          <h3 class="solution-title">Monitoring Wilayah</h3>
          <div class="solution-image">
            <img src="/assets/image/21d0425643cc74e914a7ce8e25c122e8fb4eb6d3.png" alt="Monitoring Wilayah">
          </div>
          <p class="solution-desc">Memantau kondisi wilayah secara real-time untuk mendukung pengawasan dan analisis data.</p>
        </article>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="section-footer">
      <div class="footer-container">
        <p class="powered-text">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        <div class="footer-bottom">
          <div class="logo-wrapper">
            <img src="/assets/image/983276.png" alt="OT-Sent Logo">
          </div>
          <p class="copyright">© 2026 OT-SENT. All Rights Reserved</p>
        </div>
      </div>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.solution-page {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  background-color: #0f0b2e;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top center;
  max-width: 412px;
  min-height: 100vh;
  color: #ffffff;
  box-sizing: border-box;
  position: relative;
}

*, *::before, *::after {
  box-sizing: inherit;
}

img {
  display: block;
  max-width: 100%;
}

h1, h2, h3, p {
  margin: 0;
}

/* Scrollbar styling for aesthetics */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

/* Header Section */
.app-header {
  display: flex;
  align-items: center;
  padding: 20px 20px 20px;
  position: relative;
}

.back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 24px;
  height: 24px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  flex-grow: 1;
  margin-right: 24px;
}

/* Hero Section */
.hero-content {
  padding: 10px 24px 30px;
  text-align: center;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.25;
}

.hero-subtitle {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  text-align: left;
}

/* Products Section */
#section-products {
  padding: 0 21px 30px;
}

.section-label-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.gradient-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 134px;
  height: 38px;
  background: linear-gradient(180deg, #0F0B2E 0%, #2B1B6F 100%);
  box-shadow: inset 0px 4px 30px rgba(0, 0, 0, 0.3);
  border-radius: 19px;
}

.gradient-pill span {
  font-size: 14px;
  font-weight: 600;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-card {
  background: linear-gradient(180deg, #0F0B2E 0%, #2B1B6F 100%);
  box-shadow: inset 0px 4px 30px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 16px 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}

.card-desc {
  font-size: 12px;
  line-height: 1.5;
  color: #ffffff;
  text-align: left;
}

/* Solutions Section */
#section-solutions {
  padding: 0 21px 40px;
}

.solutions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.solution-card {
  background: linear-gradient(180deg, #0F0B2E 0%, #2B1B6F 100%);
  box-shadow: inset 0px 4px 30px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.solution-title {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
  text-align: center;
  white-space: nowrap;
}

.solution-image {
  width: 100%;
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden;
  aspect-ratio: 1.5;
}

.solution-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.solution-desc {
  font-size: 11px;
  line-height: 1.4;
  text-align: left;
  width: 100%;
}

/* Footer Section */
#section-footer {
  padding: 0 20px 40px;
}

.footer-container {
  display: flex;
  flex-direction: column;
}

.powered-text {
  font-size: 12px;
  color: #c4c4c4;
  margin-bottom: 16px;
  text-align: left;
}

.footer-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
}

.logo-wrapper img {
  height: 24px;
  width: auto;
}

.copyright {
  font-size: 10px;
  color: #ffffff;
  white-space: nowrap;
}
</style>
