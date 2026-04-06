<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="app-header">
      <header class="header-container">
        <div class="icon-wrapper" @click="goBack">
          <img src="/assets/image/176_906.svg" alt="Back" class="icon-back">
        </div>
        <h1 class="header-title">Tentang kami</h1>
      </header>
    </section>

    <!-- Main Content Section -->
    <section id="main-content">
      <article class="content-wrapper">
        <div class="article-header">
          <h2 class="article-title">Tentang Ot-Sent</h2>
          <time class="article-date">{{ articleDateTime }}</time>
        </div>
        
        <div class="article-body" v-html="articleContent"></div>
      </article>
    </section>

    <!-- Footer Section -->
    <footer class="site-footer">
      <div class="footer-divider"></div>
      <p class="footer-desc">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
      <div class="footer-bottom">
        <img src="/assets/image/983276.png" alt="Ot-Sent Logo" class="footer-logo">
        <span class="footer-copyright">© 2026 OT-SENT. All Rights Reserved</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const articleDateTime = ref('05/02/2025 20:45:12')

const articleContent = ref(`
<p>Ot-Sent adalah perusahaan teknologi yang berfokus pada pengembangan solusi pemetaan udara berbasis kecerdasan buatan. Perusahaan ini mengintegrasikan teknologi drone, analisis data cerdas, serta sistem otomatisasi untuk menghadirkan layanan pemetaan yang efisien, akurat, dan dapat ditingkatkan skalanya di berbagai sektor industri.</p>

<p>Seiring perkembangan teknologi global, Ot-Sent berkomitmen untuk menghadirkan inovasi yang meningkatkan efisiensi operasional sekaligus memperluas akses pengguna ke ekosistem teknologi digital.</p>

<p>Melalui platform yang dikembangkan, pengguna dapat memantau aktivitas secara real-time, mengelola perangkat secara terintegrasi, serta mengakses data yang diproses melalui sistem berbasis cloud dan machine learning.</p>

<h3>Visi</h3>
<p>Menjadi perusahaan teknologi global terdepan dalam solusi pemetaan berbasis AI dan sistem otomatisasi udara.</p>

<h3>Misi</h3>
<ul>
  <li>Mengembangkan teknologi drone yang cerdas dan efisien</li>
  <li>Menyediakan platform digital yang mudah diakses dan transparan</li>
  <li>Mendorong inovasi dalam pengolahan data berbasis AI</li>
  <li>Memberikan nilai tambah melalui solusi teknologi modern</li>
</ul>

<h3>Teknologi Kami</h3>
<p>Ot-Sent memanfaatkan kombinasi teknologi berikut:</p>
<ul>
  <li>Artificial Intelligence (AI)</li>
  <li>Aerial Mapping System</li>
  <li>Cloud Computing</li>
  <li>Data Analytics</li>
</ul>

<h3>Model Platform</h3>
<p>Ot-Sent mengembangkan platform berbasis digital yang memungkinkan integrasi antara perangkat, data, dan pengguna dalam satu ekosistem. Sistem ini dirancang untuk mendukung efisiensi operasional, transparansi informasi, serta skalabilitas layanan dalam jangka panjang.</p>

<h3>Jangkauan Global</h3>
<p>Berbasis di Amerika Serikat, Ot-Sent terus memperluas jangkauan layanan secara global dengan menghadirkan solusi teknologi yang adaptif terhadap berbagai kebutuhan industri dan pengguna.</p>

<h3>Kepatuhan & Transparansi</h3>
<p>Ot-Sent berkomitmen untuk menjalankan operasional sesuai kebijakan internal perusahaan serta regulasi yang berlaku. Setiap layanan dan fitur yang disediakan dirancang untuk menjaga transparansi, keamanan data, serta kenyamanan pengguna.</p>
`)

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');



.app-container {
  max-width: 412px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0;
  background-color: #1a1a2e;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: 100% auto;
  background-repeat: repeat-y;
  background-attachment: scroll;
  color: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

*, *::before, *::after {
  box-sizing: inherit;
}

img {
  display: block;
  max-width: 100%;
}

/* App Header */
#app-header {
  padding: 21px 10px;
  
  top: 0;
  z-index: 10;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}

.icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}

.icon-back {
  width: 24px;
  height: 24px;
}

.header-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  pointer-events: none;
}

/* Main Content */
#main-content {
  padding: 20px 18px;
  flex: 1;
}

.content-wrapper {
  text-align: left;
}

.article-header {
  margin-bottom: 24px;
}

.article-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 700;
}

.article-date {
  display: block;
  font-size: 14px;
  opacity: 0.9;
}

.article-body {
  font-size: 14px;
  line-height: 1.5;
  white-space: normal;
  text-align: left;
}

.article-body :deep(strong) {
  font-weight: 700;
}

.article-body :deep(h3) {
  margin: 18px 0 8px 0;
  font-size: 14px;
  font-weight: 700;
}

.article-body :deep(p) {
  margin: 0 0 12px 0;
}

.article-body :deep(ul) {
  margin: 0 0 12px 18px;
  padding: 0;
}

.article-body :deep(li) {
  margin: 0 0 6px 0;
}

/* Footer */
.site-footer {
  padding: 0 18px 24px;
  margin-top: auto;
}

.footer-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 6px 0 14px;
}

.footer-desc {
  font-size: 11px;
  color: #c4c4c4;
  margin-bottom: 0px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  gap: 0px;
  flex-wrap: wrap;
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
