<template>
  <div class="terms-page">
    <!-- Header Section -->
    <section id="header-section">
      <header class="app-header">
        <div class="header-left">
          <img src="/assets/image/45_694.svg" alt="Back" class="icon-back" @click="goBack">
        </div>
        <div class="header-center">
          <h1 class="nav-title">Terms of Service</h1>
        </div>
      </header>
    </section>

    <!-- Content Section -->
    <section id="content-section">
      <div class="content-container">
        <div class="page-intro">
          <h2 class="page-title">Terms of Service</h2>
          <p class="last-updated">Terakhir diperbarui: 2026</p>
        </div>

        <div class="terms-list">
          <!-- Item 1 -->
          <div class="term-item">
            <p class="term-text">1. Ketentuan Umum<br>Selamat datang di OT-SENT. Dengan mengakses dan menggunakan platform ini, Anda menyetujui untuk terikat dengan Syarat dan Ketentuan yang berlaku. Jika Anda tidak menyetujui sebagian atau seluruh isi ketentuan ini, mohon untuk tidak menggunakan layanan kami.</p>
          </div>

          <!-- Item 2 -->
          <div class="term-item">
            <p class="term-text">2. Deskripsi Layanan<br>OT-SENT adalah platform teknologi berbasis kecerdasan buatan yang menyediakan layanan pemetaan udara, monitoring, dan analisis data melalui sistem drone terintegrasi. Layanan ini bertujuan untuk membantu pengguna dalam pengolahan dan pemantauan data berbasis udara secara real-time.</p>
          </div>

          <!-- Item 3 -->
          <div class="term-item">
            <p class="term-text">3. Akses dan Penggunaan<br>Pengguna wajib memberikan informasi yang akurat dan valid saat melakukan pendaftaran.<br>Akses ke platform hanya diperuntukkan bagi pengguna yang telah terdaftar.<br>Pengguna bertanggung jawab atas keamanan akun, termasuk kerahasiaan kata sandi dan informasi login.<br>Segala aktivitas yang terjadi pada akun menjadi tanggung jawab pengguna.</p>
          </div>

          <!-- Item 4 -->
          <div class="term-item">
            <p class="term-text">4. Penggunaan yang Dilarang<br>Pengguna dilarang untuk:<br>Menggunakan layanan untuk tujuan yang melanggar hukum atau peraturan yang berlaku.<br>Menyalahgunakan data, sistem, atau hasil analisis yang disediakan oleh OT-SENT.<br>Mengakses sistem secara tidak sah atau melakukan upaya peretasan.<br>Mengganggu atau merusak kinerja platform.</p>
          </div>

          <!-- Item 5 -->
          <div class="term-item">
            <p class="term-text">5. Data dan Informasi<br>Data dan hasil analisis yang disediakan oleh OT-SENT bersifat estimasi dan dapat berubah sesuai kondisi lapangan.<br>OT-SENT tidak menjamin keakuratan mutlak dari seluruh data yang dihasilkan.<br>Pengguna bertanggung jawab atas penggunaan informasi yang diperoleh dari platform.</p>
          </div>

          <!-- Item 6 -->
          <div class="term-item">
            <p class="term-text">6. Pembatasan Tanggung Jawab<br>OT-SENT tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan layanan.<br>Platform tidak menjamin ketersediaan layanan tanpa gangguan atau bebas dari kesalahan.<br>Keputusan yang diambil berdasarkan data dari platform sepenuhnya menjadi tanggung jawab pengguna.</p>
          </div>

          <!-- Item 7 -->
          <div class="term-item">
            <p class="term-text">7. Keamanan Sistem<br>OT-SENT menerapkan langkah-langkah keamanan untuk melindungi data dan sistem.<br>Aktivitas pengguna dapat dicatat untuk tujuan keamanan dan peningkatan layanan.<br>Pengguna dilarang mencoba mengganggu atau mengeksploitasi sistem keamanan platform.</p>
          </div>

          <!-- Item 8 -->
          <div class="term-item">
            <p class="term-text">8. Perubahan Layanan<br>OT-SENT berhak untuk:<br>Mengubah, memperbarui, atau menghentikan sebagian atau seluruh layanan sewaktu-waktu.<br>Memperbarui Syarat dan Ketentuan tanpa pemberitahuan sebelumnya. Pengguna disarankan untuk meninjau halaman ini secara berkala.</p>
          </div>

          <!-- Item 9 -->
          <div class="term-item">
            <p class="term-text">9. Hak Kekayaan Intelektual<br>Seluruh konten, desain, sistem, dan teknologi yang terdapat dalam platform OT-SENT merupakan milik resmi OT-SENT dan dilindungi oleh hukum yang berlaku. Dilarang menggunakan atau menyalin tanpa izin tertulis.</p>
          </div>

          <!-- Item 10 -->
          <div class="term-item">
            <p class="term-text">10. Penghentian Akses<br>OT-SENT berhak menangguhkan atau menghentikan akses pengguna jika ditemukan pelanggaran terhadap ketentuan ini tanpa kewajiban memberikan pemberitahuan sebelumnya.</p>
          </div>

          <!-- Item 11 -->
          <div class="term-item">
            <p class="term-text">11. Hukum yang Berlaku<br>Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di yurisdiksi terkait.</p>
          </div>

          <!-- Item 12 -->
          <div class="term-item">
            <p class="term-text">12. Kontak<br>Jika Anda memiliki pertanyaan terkait Syarat dan Ketentuan ini, silakan hubungi:<br>Email: support@otsent.com</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="footer-section">
      <div class="footer-container">
        <p class="footer-tagline">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        
        <div class="footer-brand">
          <div class="logo-wrapper">
            <img src="/assets/image/983276.png" alt="Ot-Sent Logo" class="footer-logo">
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

.terms-page {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #1a1a1a;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: 100% auto;
  background-repeat: repeat-y;
  background-position: top center;
  max-width: 412px;
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
  color: #ffffff;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

p {
  margin: 0 0 1em 0;
  line-height: 1.5;
}

/* Header Section */
#header-section {
 padding: 10px 10px;
}

.app-header {
  display: flex;
  align-items: center;
  position: relative;
  height: 24px;
}

.header-left {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
}

.icon-back {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.header-center {
  width: 100%;
  display: flex;
  justify-content: center;
}

.nav-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 20px;
  text-align: center;
}

/* Content Section */
#content-section {
  padding: 0 10px;
  margin-top: 30px;
}

.content-container {
  max-width: 412px;
  margin: 0 auto;
}

.page-intro {
  margin-bottom: 40px;
  text-align: left;
}

.page-title {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.last-updated {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #ffffff;
  margin: 0;
  opacity: 0.9;
}

.terms-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.term-item {
  margin-bottom: 5px;
}

.term-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #a6a6a6;
  margin: 0;
  white-space: pre-wrap;
}

/* Footer Section */
#footer-section {
  padding: 10px;
  margin-top: 20px;
}

.footer-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-tagline {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #c4c4c4;
  margin: 0;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-wrapper {
  width: 90px;
  height: 37px;
  display: flex;
  align-items: center;
}

.footer-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.copyright {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #ffffff;
  margin: 0;
}
</style>
