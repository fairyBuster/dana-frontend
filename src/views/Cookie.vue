<!-- <template>
  <div class="cookie-page">

    <section id="section-header">
      <div class="container header-container">
        <div class="icon-wrapper">
          <img src="/assets/images/2023_1661.svg" alt="Back" class="back-icon" @click="goBack">
        </div>
        <h1 class="header-title">Cookie Policy</h1>
      </div>
    </section>

    <section id="section-content">
      <div class="container content-wrapper">
        <div class="page-intro">
          <h2 class="intro-title">Cookie Policy</h2>
          <p class="intro-date">Terakhir diperbarui: 2026</p>
        </div>

        <div class="text-block">
          1. Pendahuluan<br>
          Kebijakan Cookie ini menjelaskan bagaimana OT-SENT menggunakan cookies dan teknologi serupa saat Anda mengakses dan menggunakan platform kami.<br>
          Dengan menggunakan layanan OT-SENT, Anda menyetujui penggunaan cookies sesuai dengan kebijakan ini.
        </div>

        <div class="text-block">
          2. Apa itu Cookies<br>
          Cookies adalah file kecil yang disimpan pada perangkat Anda saat mengunjungi website. Cookies membantu sistem mengenali perangkat Anda dan meningkatkan pengalaman penggunaan.
        </div>

        <div class="text-block">
          3. Jenis Cookies yang Digunakan<br>
          a. Cookies Esensial<br>
          Cookies ini diperlukan untuk menjalankan fungsi utama platform, seperti:<br>
          Proses login dan autentikasi<br>
          Keamanan sistem<br>
          Navigasi dasar<br>
          Cookies ini tidak dapat dinonaktifkan karena penting untuk operasional platform.
        </div>

        <div class="text-block">
          b. Cookies Fungsional<br>
          Digunakan untuk:<br>
          Menyimpan preferensi pengguna<br>
          Mengingat pengaturan tertentu<br>
          Meningkatkan pengalaman penggunaan
        </div>

        <div class="text-block">
          c. Cookies Analitik<br>
          Digunakan untuk:<br>
          Memahami bagaimana pengguna berinteraksi dengan platform<br>
          Menganalisis performa sistem<br>
          Mengembangkan fitur dan layanan
        </div>

        <div class="text-block">
          4. Penggunaan Cookies<br>
          OT-SENT menggunakan cookies untuk:<br>
          Menyediakan layanan yang lebih stabil dan aman<br>
          Meningkatkan performa dan pengalaman pengguna<br>
          Melakukan analisis penggunaan platform
        </div>

        <div class="text-block">
          5. Pengelolaan Cookies<br>
          Anda dapat mengatur atau menonaktifkan cookies melalui pengaturan browser Anda. Namun, menonaktifkan cookies tertentu dapat mempengaruhi fungsi platform.
        </div>

        <div class="text-block">
          6. Cookies Pihak Ketiga<br>
          OT-SENT dapat menggunakan layanan pihak ketiga (seperti alat analitik) yang juga menggunakan cookies untuk membantu kami memahami penggunaan platform.<br>
          Semua penggunaan tersebut dilakukan dengan tetap menjaga keamanan dan privasi pengguna.
        </div>

        <div class="text-block">
          7. Keamanan dan Privasi<br>
          Cookies yang digunakan tidak mengandung informasi sensitif seperti kata sandi. Kami berkomitmen untuk melindungi data pengguna sesuai dengan Kebijakan Privasi OT-SENT.
        </div>

        <div class="text-block">
          8. Perubahan Kebijakan<br>
          OT-SENT dapat memperbarui Kebijakan Cookie ini sewaktu-waktu. Perubahan akan berlaku setelah dipublikasikan pada halaman ini.
        </div>
      </div>
    </section>


    <section id="section-footer">
      <div class="container footer-container">
        <p class="footer-tagline">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
        <div class="footer-brand">
          <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Logo" class="footer-logo">
          <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
        </div>
      </div>
    </section>
  </div>
</template> -->

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

.cookie-page {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #1a1a1a;
  background-image: none;
  background-size: 100% auto;
  background-repeat: repeat-y;
  background-position: top center;
  max-width: 412px;
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
  color: #ffffff;
}

.container {
  width: 100%;
  max-width: 412px;
  padding: 0 0;
  box-sizing: border-box;
}

img {
  max-width: 100%;
  display: block;
}

/* Header Section */
#section-header {
  padding: 10px 10px;
}

.header-container {
  display: flex;
  align-items: center;
  position: relative;
}

.icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 20px;
  text-align: center;
  flex: 1;
}

/* Content Section */
#section-content {
  padding: 0 10px;
  margin-top: 30px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-intro {
  margin-bottom: 0px;
  color: #ffffff;
  text-align: left;
}

.intro-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.intro-date {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.text-block {
  font-size: 14px;
  line-height: 1.5;
  color: #a6a6a6;
  white-space: pre-wrap;
}

/* Footer Section */
#section-footer {
  padding: 10px;
  margin-top: 20px;
}

.footer-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-tagline {
  font-size: 12px;
  color: #c4c4c4;
  margin: 0;
}

.footer-brand {
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
