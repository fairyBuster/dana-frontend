<template>
  <div class="policy-page">
    <!-- Header Section -->
    <section id="section-header" class="header-section">
      <div class="nav-bar">
        <div class="icon-wrapper">
          <img src="/assets/image/68_1138.svg" alt="Back" class="back-icon" @click="goBack">
        </div>
        <h1 class="nav-title">Privacy Policy</h1>
      </div>
    </section>

    <!-- Content Section -->
    <section id="section-content" class="content-section">
      <div class="main-title-block">
        <h2 class="page-title">Privacy Policy</h2>
        <p class="last-updated">Terakhir diperbarui: 2026</p>
      </div>

      <div class="policy-text-container">
        <div class="policy-block">
          <p>1. Pendahuluan<br>OT-SENT menghargai dan melindungi privasi pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi yang Anda berikan saat menggunakan platform OT-SENT.<br>Dengan mengakses atau menggunakan layanan kami, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan ini.</p>
        </div>

        <div class="policy-block">
          <p>2. Informasi yang Kami Kumpulkan<br>Kami dapat mengumpulkan beberapa jenis informasi, termasuk namun tidak terbatas pada:<br>a. Informasi Pribadi<br>Nama lengkap<br>Nomor ponsel<br>Alamat email<br>b. Informasi Teknis<br>Alamat IP<br>Jenis perangkat dan browser<br>Aktivitas penggunaan platform<br>c. Informasi Penggunaan<br>Data interaksi pengguna dalam platform<br>Riwayat akses dan aktivitas sistem</p>
        </div>

        <div class="policy-block">
          <p>3. Penggunaan Informasi<br>Informasi yang kami kumpulkan digunakan untuk:<br>Menyediakan dan mengelola layanan OT-SENT<br>Memverifikasi identitas pengguna<br>Meningkatkan kualitas dan keamanan sistem<br>Mengirimkan informasi terkait layanan, pembaruan, atau notifikasi penting<br>Menganalisis penggunaan platform untuk pengembangan lebih lanjut</p>
        </div>

        <div class="policy-block">
          <p>4. Penyimpanan dan Keamanan Data<br>Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data pengguna dari akses tidak sah, perubahan, pengungkapan, atau penghancuran.<br>Namun, kami tidak dapat menjamin keamanan data secara mutlak dari segala bentuk ancaman.</p>
        </div>

        <div class="policy-block">
          <p>5. Pembagian Informasi<br>OT-SENT tidak menjual, menyewakan, atau memperdagangkan data pribadi pengguna kepada pihak ketiga.<br>Informasi dapat dibagikan dalam kondisi tertentu, seperti:<br>Untuk memenuhi kewajiban hukum<br>Untuk melindungi hak dan keamanan platform<br>Dengan penyedia layanan pihak ketiga yang membantu operasional sistem (dengan standar keamanan yang sesuai)</p>
        </div>

        <div class="policy-block">
          <p>6. Penggunaan Cookies<br>Platform OT-SENT dapat menggunakan cookies atau teknologi serupa untuk:<br>Menyimpan preferensi pengguna<br>Meningkatkan pengalaman penggunaan<br>Analisis performa dan penggunaan sistem<br>Pengguna dapat mengatur penggunaan cookies melalui pengaturan browser masing-masing</p>
        </div>

        <div class="policy-block">
          <p>7. Hak Pengguna<br>Pengguna memiliki hak untuk:<br>Mengakses dan memperbarui informasi pribadi<br>Meminta penghapusan data tertentu<br>Membatasi penggunaan data sesuai ketentuan yang berlaku<br>Permintaan dapat diajukan melalui kontak resmi OT-SENT.</p>
        </div>

        <div class="policy-block">
          <p>8. Penyimpanan Data<br>Data pengguna akan disimpan selama diperlukan untuk menyediakan layanan dan memenuhi kewajiban hukum yang berlaku.</p>
        </div>

        <div class="policy-block">
          <p>9. Perubahan Kebijakan<br>OT-SENT dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan akan berlaku setelah dipublikasikan di halaman ini.<br>Pengguna disarankan untuk meninjau kebijakan ini secara berkala.</p>
        </div>
      </div>
    </section>

    <!-- Footer Section -->
    <section id="section-footer" class="footer-section">
      <div class="footer-content">
        <p class="powered-by">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        <div class="logo-container">
          <img src="/assets/image/983276.png" alt="OT-Sent Logo" class="footer-logo">
          <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
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

* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

.policy-page {
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

img {
  display: block;
  max-width: 100%;
}

#section-header {
padding: 10px 10px;
}

.nav-bar {
  display: flex;
  align-items: center;
  position: relative;
  height: 24px;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: absolute;
  left: 0;
}

.back-icon {
  width: 24px;
  height: 24px;
  display: block;
  cursor: pointer;
}

.nav-title {
  flex-grow: 1;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
  line-height: 20px;
}

#section-content {
  padding: 0 15px;
  margin-top: 30px;
}

.main-title-block {
  margin-bottom: 40px;
  text-align: left;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #ffffff;
}

.last-updated {
  font-size: 14px;
  color: #ffffff;
  opacity: 0.9;
}

.policy-text-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.policy-block {
  margin-bottom: 5px;
}

.policy-block p {
  font-size: 14px;
  line-height: 1.5;
  color: #a6a6a6;
  white-space: pre-wrap;
}

#section-footer {
  padding: 10px 15px;
  margin-top: 20px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.powered-by {
  font-size: 12px;
  color: #c4c4c4;
  margin: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-logo {
  width: 90px;
  height: 37px;
  object-fit: contain;
}

.copyright {
  font-size: 12px;
  color: #ffffff;
  margin: 0;
}
</style>
