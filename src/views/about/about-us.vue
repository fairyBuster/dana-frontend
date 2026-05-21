<template>
  <div class="about-page">
    <!-- Hero -->
    <section id="section-hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">Perusahaan</h1>
          <p class="hero-subtitle">Kenali lebih dekat Dana Proteksi.</p>
        </div>
        <img src="/assets/images/fd824e97cea8acc84a8a6297b8b196ca16b485f8.png" alt="" class="hero-image">
      </div>
    </section>

    <!-- Banner -->
    <section id="section-banner">
      <div class="banner-container">
        <div class="banner-card">
          <img src="/assets/images/108294978d9cad25785261933372f80a0602c03d.png" alt="" class="banner-logo">
          <div class="banner-text">
            <h3 class="banner-title">Dana Proteksi Indonesia</h3>
            <p class="banner-desc">Platform proteksi aset digital terpercaya untuk masyarakat Indonesia.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About -->
    <section id="section-about">
      <div class="about-container">
        <h2 class="section-title">Tentang Kami</h2>
        <div class="card about-card">
          <div class="icon-wrapper-large">
            <div class="icon-wrapper-inner">
              <img src="/assets/images/39_453.svg" alt="" class="icon-bg">
              <img src="/assets/images/70e90e171ca2d494dec7257a0f52b7dd0d4457b7.png" alt="" class="icon-fg-large">
            </div>
          </div>
          <p class="card-text">Dana Proteksi adalah platform perlindungan aset digital yang didirikan untuk memberikan akses terstruktur kepada pengguna dalam mengelola dan melindungi aset mereka secara aman dan efisien.</p>
        </div>
      </div>
    </section>

    <!-- Vision & Mission -->
    <section id="section-vision-mission">
      <div class="grid-container-wrapper">
        <h2 class="section-title">Visi & Misi</h2>
        <div class="grid-container">
          <div class="card grid-card">
            <div class="card-header">
              <div class="icon-wrapper-small">
                <div class="icon-wrapper-inner">
                  <img src="/assets/images/39_460.svg" alt="" class="icon-bg">
                  <img src="/assets/images/39_464.svg" alt="" class="icon-fg-small">
                </div>
              </div>
              <h3 class="card-title">Visi</h3>
            </div>
            <p class="card-text">Menjadi platform proteksi aset digital terdepan yang memberikan kemudahan, keamanan, dan kepercayaan bagi seluruh pengguna.</p>
          </div>
          <div class="card grid-card">
            <div class="card-header">
              <div class="icon-wrapper-small">
                <div class="icon-wrapper-inner">
                  <img src="/assets/images/39_471.svg" alt="" class="icon-bg">
                  <img src="/assets/images/40_505.svg" alt="" class="icon-fg-small">
                </div>
              </div>
              <h3 class="card-title">Misi</h3>
            </div>
            <p class="card-text">Menyediakan layanan proteksi yang transparan, mudah diakses, dan didukung oleh teknologi yang handal untuk setiap pengguna.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Info -->
    <section id="section-company-info">
      <div class="grid-container-wrapper">
        <h2 class="section-title">Informasi Perusahaan</h2>
        <div class="grid-container">
          <div class="card grid-card">
            <div class="card-header">
              <div class="icon-wrapper-small">
                <div class="icon-wrapper-inner">
                  <img src="/assets/images/40_480.svg" alt="" class="icon-bg">
                  <img src="/assets/images/40_509.svg" alt="" class="icon-fg-small">
                </div>
              </div>
              <h3 class="card-title">Tahun Berdiri</h3>
            </div>
            <p class="card-text">Didirikan pada tahun 2020 dengan fokus melayani pasar Indonesia.</p>
          </div>
          <div class="card grid-card">
            <div class="card-header">
              <div class="icon-wrapper-small">
                <div class="icon-wrapper-inner">
                  <img src="/assets/images/40_485.svg" alt="" class="icon-bg">
                  <img src="/assets/images/40_513.svg" alt="" class="icon-fg-small">
                </div>
              </div>
              <h3 class="card-title">Fokus Layanan</h3>
            </div>
            <p class="card-text">Proteksi aset digital dengan sistem terstruktur dan mudah digunakan.</p>
          </div>
          <div class="card grid-card">
            <div class="card-header">
              <div class="icon-wrapper-small">
                <div class="icon-wrapper-inner">
                  <img src="/assets/images/40_490.svg" alt="" class="icon-bg">
                  <img src="/assets/images/40_515.svg" alt="" class="icon-fg-small">
                </div>
              </div>
              <h3 class="card-title">Keamanan Sistem</h3>
            </div>
            <p class="card-text">Menggunakan teknologi enkripsi dan sistem keamanan berlapis.</p>
          </div>
          <div class="card grid-card">
            <div class="card-header">
              <div class="icon-wrapper-small">
                <div class="icon-wrapper-inner">
                  <img src="/assets/images/40_495.svg" alt="" class="icon-bg">
                  <img src="/assets/images/40_519.svg" alt="" class="icon-fg-small">
                </div>
              </div>
              <h3 class="card-title">Dukungan Pengguna</h3>
            </div>
            <p class="card-text">Tim dukungan siap membantu kapan saja melalui berbagai saluran.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentation -->
    <section id="section-documentation">
      <div class="grid-container-wrapper doc-wrapper">
        <h2 class="section-title">Dokumentasi Perusahaan</h2>
        <div class="grid-container">
          <div class="card empty-card"></div>
          <div class="card empty-card"></div>
        </div>
      </div>
    </section>
  </div>

  <FooterBar />
</template>

<script setup>
import FooterBar from '@/components/partials/AppFooter.vue'
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.about-page {
  font-family: 'Inter', sans-serif;
  max-width: 412px;
  margin: 0 auto;
  background-color: #fdfaf4;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding-bottom: 80px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, p {
  margin: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 12px 0;
}

.card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.card-text {
  font-size: 10px;
  color: #000000;
  margin: 0;
  line-height: 1.4;
}

/* Hero */
.hero-container {
  position: relative;
  padding: 34px 24px 20px;
  min-height: 140px;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
}

.hero-subtitle {
  font-size: 12px;
  color: #635f5f;
}

.hero-image {
  position: absolute;
  top: 10px;
  right: -10px;
  width: 187px;
  height: 140px;
  object-fit: contain;
  z-index: 1;
}

/* Banner */
.banner-container {
  padding: 0 24px 24px;
}

.banner-card {
  background-color: #fdf5e6;
  border: 1px solid #f3b73f;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.banner-logo {
  width: 89px;
  height: 33px;
  object-fit: contain;
  flex-shrink: 0;
}

.banner-title {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4px 0;
}

.banner-desc {
  font-size: 10px;
  color: #000000;
  line-height: 1.4;
}

/* About */
.about-container {
  padding: 0 24px 24px;
}

.about-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-wrapper-large {
  position: relative;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.icon-wrapper-large .icon-wrapper-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.icon-fg-large {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 21px;
  height: 21px;
  object-fit: contain;
}

/* Grid Layout */
.grid-container-wrapper {
  padding: 0 24px 24px;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.grid-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-title {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
}

.icon-wrapper-small {
  position: relative;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}

.icon-wrapper-small .icon-wrapper-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.icon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.icon-fg-small {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* Documentation */
.doc-wrapper {
  padding-bottom: 40px;
}

.empty-card {
  height: 93px;
}
</style>
