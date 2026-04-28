<template>
  <div class="app-container">
    <section id="section-header">
      <header class="header-content">
        <div class="header-text">
          <h1 class="header-title">Trivex Capital Sekuritas</h1>
          <div class="header-subtitle">
            <span class="subtitle-text">Terpercaya</span>
            <span class="subtitle-highlight">NO.1</span>
          </div>
        </div>
        <img
          class="header-logo"
          src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png"
          alt="Trivex Logo"
        >
      </header>
    </section>

    <section id="section-list">
      <div class="card-list">
        <div class="card">
          <img class="card-icon" src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Icon">
          <div class="card-text">
            <h2 class="card-title">Trivex Capital Sekuritas</h2>
            <p class="card-desc">
              TRIVEX (Transaksi Investasi & Valuta Exchange) adalah platform digital yang berfokus pada pengelolaan aset dan aktivitas investasi berbasis teknologi modern. TRIVEX hadir untuk memberikan kemudahan bagi pengguna dalam mengakses berbagai pilihan produk investasi dengan sistem yang efisien, transparan, dan mudah digunakan.
              <br>
              <br>
              Dengan mengusung konsep platform yang terintegrasi, TRIVEX menyediakan layanan yang memungkinkan pengguna untuk melakukan pengelolaan aset secara fleksibel, mulai dari pemantauan portofolio hingga aktivitas transaksi dalam satu aplikasi.
            </p>
          </div>
        </div>
        <div class="card">
          <img class="card-icon" src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Icon">
          <div class="card-text">
            <h2 class="card-title">Visi Trivex Capital Sekuritas</h2>
            <p class="card-desc">Menjadi platform investasi digital yang terpercaya, inovatif, dan mudah diakses oleh semua kalangan.</p>
          </div>
        </div>
        <div class="card">
          <img class="card-icon" src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Icon">
          <div class="card-text">
            <h2 class="card-title">Misi Trivex Capital Sekuritas</h2>
            <p class="card-desc">
              - Menghadirkan sistem investasi yang sederhana dan efisien
              <br>
              - Memberikan pengalaman pengguna yang aman dan nyaman
              <br>
              - Mengembangkan teknologi untuk mendukung pertumbuhan aset digital
              <br>
              - Menyediakan layanan yang transparan dan berkelanjutan
            </p>
          </div>
        </div>
        <div class="card">
          <img class="card-icon" src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Icon">
          <div class="card-text">
            <h2 class="card-title">Legalitas & Informasi Perusahaan</h2>
            <p class="card-desc">
              Nama Perusahaan: PT Trivex Capital Sekuritas
              <br>
              Status: Perusahaan berbasis teknologi finansial (Fintech Platform)
              <br>
              Nomor Usaha: 10.249.338.1-092.785
              <br>
              Nomor Registrasi Sistem Elektronik: 082648/DJAI.PSE/01/2026
            </p>
          </div>
        </div>
        <div class="card">
          <img class="card-icon" src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Icon">
          <div class="card-text">
            <h2 class="card-title">Kantor Operasional</h2>
            <p class="card-desc">
              Gedung Perkantoran Kawasan Bisnis
              <br>
              Jl. TB Simatupang
              <br>
              Jakarta Selatan, DKI Jakarta, Indonesia
            </p>
          </div>
        </div>
        <div class="card">
          <img class="card-icon" src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Icon">
          <div class="card-text">
            <h2 class="card-title">Keamanan & Sistem</h2>
            <p class="card-desc">TRIVEX menggunakan sistem keamanan berlapis dengan dukungan enkripsi data dan teknologi SSL aktif untuk menjaga kerahasiaan serta keamanan informasi pengguna.</p>
          </div>
        </div>
      </div>
    </section>
  </div>

  <FooterBar />
</template>

<script setup>
import FooterBar from '@/components/partials/FooterBar.vue'
</script>

<style scoped>
.app-container {
  margin: 0 auto;
  padding: 0;
  font-family: 'Inter', sans-serif;
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background: linear-gradient(180deg, #0a4345 0%, #0b6563 100%);
  position: relative;
  overflow-x: hidden;
}

* {
  box-sizing: border-box;
}

h1,
h2,
p {
  margin: 0;
}

/* Header Section */
#section-header {
  padding: 30px 20px 20px;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-title {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.2;
}

.header-subtitle {
  display: flex;
  align-items: center;
  gap: 6px;
}

.subtitle-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}

.subtitle-highlight {
  color: #de6f00;
  font-size: 18px;
  font-weight: 700;
}

.header-logo {
  width: 100px;
  height: 32px;
  object-fit: contain;
  border-radius: 50px;
}

/* List Section */
#section-list {
  padding: 0 20px 96px;
  width: 100%;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 18px 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  height: auto;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 2px;
}

.card-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

.card-desc {
  color: #ffffff;
  font-size: 14px;
  opacity: 0.9;
  white-space: pre-line;
  line-height: 1.5;
}
</style>
