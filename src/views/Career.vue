<template>
  <section id="career-page">
    <div class="mobile-wrapper">
      <!-- Header -->
      <header class="app-header">
        <div class="back-button" @click="goBack">
          <img src="/assets/image/73_1158.svg" alt="Back">
        </div>
        <h1 class="page-title">Karir</h1>
      </header>

      <!-- Main Content -->
      <div class="content-area">
        <!-- Hero Section -->
        <div class="hero-section">
          <h2 class="hero-title">Karir di SENT</h2>
          <p class="hero-subtitle">Bergabunglah dalam pengembangan teknologi pemetaan udara berbasis AI.</p>
        </div>

        <!-- About Team Card -->
        <div class="card">
          <h3 class="card-title">Tentang Tim</h3>
          <p class="card-text">OT-SENT merupakan platform teknologi yang berfokus pada pengembangan sistem pemetaan udara, monitoring dan analisis data berbasis drone. Kami membuka peluang bagi individu yang ingin berkembang bersama teknologi masa depan.</p>
        </div>

        <!-- Jobs Section -->
        <div class="jobs-section">
          <h3 class="section-heading">Lowongan pekerjaan</h3>

          <!-- Job Card 1 -->
          <div class="card job-card">
            <h4 class="job-title">AI Engineer</h4>
            <div class="divider"></div>
            <p class="job-desc">Mengembangkan dan mengoptimalkan sistem berbasis kecerdasan buatan untuk pengolahan data pemetaan udara.</p>
            <div class="job-qualifications">
              <p>Kualifikasi:<br>
              Memahami dasar AI / Machine Learning<br>
              Mampu bekerja dengan data<br>
              Memiliki ketertarikan pada teknologi drone</p>
            </div>
          </div>

          <!-- Job Card 2 -->
          <div class="card job-card">
            <h4 class="job-title">Drone Operator</h4>
            <div class="divider"></div>
            <p class="job-desc">Bertanggung jawab dalam pengoperasian drone untuk pengambilan data pemetaan di lapangan.</p>
            <div class="job-qualifications">
              <p>Kualifikasi:<br>
              Memahami dasar pengoperasian drone<br>
              Mampu bekerja di lapangan</p>
            </div>
          </div>
        </div>

        <!-- Apply Info -->
        <div class="apply-section">
          <p class="apply-label">🟣 Cara Melamar<br>Kirimkan CV dan informasi pendukung ke:</p>
          <p class="apply-email">career@otsent.com</p>
        </div>
      </div>

      <!-- Footer -->
      <footer class="app-footer">
        <p class="footer-note">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        <div class="footer-brand">
          <img src="/assets/image/983276.png" alt="Ot-Sent Logo" class="footer-logo">
          <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
        </div>
      </footer>
    </div>
  </section>
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

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0f0f0f;
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  display: block;
}

h1, h2, h3, h4, p {
  margin: 0;
}

#career-page {
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: #000;
}

.mobile-wrapper {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 20px;
  position: relative;
  height: 50px;
}

.back-button {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.back-button img {
  width: 24px;
  height: 24px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

/* Content Area */
.content-area {
  padding: 20px 24px;
  flex: 1;
}

/* Hero Section */
.hero-section {
  margin-bottom: 24px;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
}

.hero-subtitle {
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.9;
  color: #ffffff;
}

/* Cards */
.card {
  background: linear-gradient(180deg, rgba(15, 11, 46, 1) 0%, rgba(43, 27, 111, 1) 100%);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
}

.card-text {
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.9;
  color: #ffffff;
}

/* Jobs Section */
.jobs-section {
  margin-bottom: 20px;
}

.section-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
}

.job-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.job-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  width: 100%;
}

.job-desc {
  font-size: 13px;
  line-height: 1.4;
  color: #ffffff;
}

.job-qualifications {
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-line;
  color: #ffffff;
}

/* Apply Section */
.apply-section {
  margin-top: 40px;
  margin-bottom: 40px;
}

.apply-label {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
  color: #ffffff;
}

.apply-email {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

/* Footer */
.app-footer {
  padding: 20px 24px;
  margin-top: auto;
}

.footer-note {
  font-size: 10px;
  color: #c4c4c4;
  margin-bottom: 8px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-logo {
  height: 24px;
  width: auto;
  object-fit: contain;
}

.copyright {
  font-size: 10px;
  color: #ffffff;
}
</style>
