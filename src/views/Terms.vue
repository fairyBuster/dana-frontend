<template>
  <div class="terms-container">
    <!-- Header Section -->
    <section id="section-header">
      <header class="header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/2039_205.svg" alt="Back">
        </button>
      </header>
    </section>

    <!-- Content Section -->
    <section id="section-content">
      <div class="content">
        <h1 class="title">Syarat dan Ketentuan TRIVEX</h1>
        <p class="last-updated">Terakhir diperbarui: 01 Januari 2026</p>
        
        <p class="intro">Dengan mengakses dan menggunakan layanan TRIVEX, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan berikut.</p>
        
        <div class="terms-section">
          <h2>1. Ketentuan Umum</h2>
          <p>TRIVEX adalah platform yang menyediakan layanan terkait aktivitas transaksi dan pengelolaan aset digital. Pengguna wajib menggunakan layanan sesuai dengan hukum dan peraturan yang berlaku.</p>
        </div>

        <div class="terms-section">
          <h2>2. Pendaftaran Akun</h2>
          <ul>
            <li>Pengguna wajib memberikan informasi yang benar dan akurat saat pendaftaran</li>
            <li>Setiap pengguna hanya diperbolehkan memiliki satu akun</li>
            <li>Pengguna bertanggung jawab atas keamanan akun masing-masing</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>3. Penggunaan Layanan</h2>
          <ul>
            <li>Layanan TRIVEX hanya digunakan untuk tujuan yang sah</li>
            <li>Dilarang menggunakan platform untuk aktivitas ilegal, penipuan, atau penyalahgunaan sistem</li>
            <li>TRIVEX berhak membatasi atau menonaktifkan akun yang melanggar ketentuan</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>4. Transaksi dan Aktivitas</h2>
          <ul>
            <li>Semua aktivitas dalam akun menjadi tanggung jawab pengguna</li>
            <li>Pengguna wajib memahami risiko dalam penggunaan layanan</li>
            <li>TRIVEX tidak menjamin hasil atau keuntungan tertentu dari aktivitas pengguna</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>5. Dana dan Penarikan</h2>
          <ul>
            <li>Pengguna bertanggung jawab atas setiap transaksi yang dilakukan</li>
            <li>Proses penarikan mengikuti ketentuan dan verifikasi yang berlaku</li>
            <li>TRIVEX berhak menunda atau menolak transaksi jika ditemukan aktivitas mencurigakan</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>6. Keamanan</h2>
          <ul>
            <li>Pengguna wajib menjaga kerahasiaan data login</li>
            <li>TRIVEX tidak bertanggung jawab atas kerugian akibat kelalaian pengguna</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>7. Hak dan Kewajiban TRIVEX</h2>
          <ul>
            <li>TRIVEX berhak mengubah, menambah, atau menghapus fitur layanan</li>
            <li>TRIVEX dapat memperbarui syarat dan ketentuan sewaktu-waktu</li>
            <li>TRIVEX berhak melakukan tindakan terhadap akun yang melanggar</li>
          </ul>
        </div>

        <div class="terms-section">
          <h2>8. Batasan Tanggung Jawab</h2>
          <p>TRIVEX tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan layanan, termasuk namun tidak terbatas pada kesalahan pengguna, gangguan sistem, atau faktor eksternal lainnya.</p>
        </div>

        <div class="terms-section">
          <h2>9. Perubahan Ketentuan</h2>
          <p>Syarat dan Ketentuan ini dapat diperbarui sewaktu-waktu. Pengguna disarankan untuk meninjau secara berkala.</p>
        </div>

        <div class="terms-section">
          <h2>10. Kontak</h2>
          <p>Jika terdapat pertanyaan terkait layanan, silakan hubungi:<br>
          Email: hello@trivex.com</p>
        </div>
        
        <p class="outro">Dengan menggunakan layanan TRIVEX, pengguna dianggap telah menyetujui seluruh isi Syarat dan Ketentuan ini.</p>
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
.terms-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  background-color: #f8f8f8;
  max-width: 412px;
  min-height: 100vh;
  color: #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
}

* {
  box-sizing: border-box;
}

h1, h2, p, ul {
  margin: 0;
  padding: 0;
}

/* Header Section */
.header {
  padding: 21px 7px 12px;
  width: 100%;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  height: 41px;
}

.back-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Content Section */
.content {
  padding: 0 27px 40px;
  font-size: 12px;
  line-height: 1.5;
}

.title {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 2px;
}

.last-updated {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 20px;
}

.intro {
  margin-bottom: 20px;
}

.terms-section {
  margin-bottom: 20px;
}

.terms-section h2 {
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 2px;
}

.terms-section p {
  margin-bottom: 0;
}

.terms-section ul {
  margin: 0;
  padding-left: 16px;
}

.terms-section li {
  margin-bottom: 2px;
  list-style-type: disc;
}

.outro {
  margin-top: 20px;
}
</style>
