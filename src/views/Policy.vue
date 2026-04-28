<template>
  <div class="mobile-container">
    <header class="header">
      <button class="back-button" @click="goBack" aria-label="Go back">
        <img src="/assets/images/2039_202.svg" alt="Back Icon">
      </button>
    </header>
    
    <main class="content">
      <h1 class="main-title">Kebijakan Privasi TRIVEX</h1>
      <p class="last-updated">Terakhir diperbarui: 01 Januari 2026</p>

      <p class="intro">TRIVEX menghargai dan melindungi privasi setiap pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pengguna dalam penggunaan layanan TRIVEX.</p>

      <section class="policy-section">
        <h2>1. Informasi yang Dikumpulkan</h2>
        <p>Kami dapat mengumpulkan informasi berikut:</p>
        <ul>
          <li>Informasi pribadi seperti nama, alamat email, dan nomor telepon saat pendaftaran</li>
          <li>Data akun seperti username dan aktivitas penggunaan</li>
          <li>Informasi transaksi yang dilakukan dalam platform</li>
          <li>Data teknis seperti alamat IP, perangkat, dan browser</li>
        </ul>
      </section>

      <section class="policy-section">
        <h2>2. Penggunaan Informasi</h2>
        <p>Informasi yang dikumpulkan digunakan untuk:</p>
        <ul>
          <li>Mengelola akun pengguna</li>
          <li>Menyediakan dan meningkatkan layanan</li>
          <li>Memproses transaksi</li>
          <li>Menjaga keamanan sistem dan mencegah penyalahgunaan</li>
          <li>Mengirimkan informasi terkait layanan dan pembaruan</li>
        </ul>
      </section>

      <section class="policy-section">
        <h2>3. Penyimpanan dan Keamanan Data</h2>
        <p>Kami menyimpan data pengguna dengan sistem keamanan yang wajar dan berupaya melindungi dari akses tidak sah, perubahan, atau pengungkapan data.</p>
      </section>

      <section class="policy-section">
        <h2>4. Pembagian Informasi</h2>
        <p>TRIVEX tidak menjual atau menyewakan data pribadi pengguna kepada pihak lain. Informasi dapat dibagikan jika:</p>
        <ul>
          <li>Diperlukan untuk memenuhi kewajiban hukum</li>
          <li>Dibutuhkan untuk proses operasional layanan</li>
          <li>Atas persetujuan pengguna</li>
        </ul>
      </section>

      <section class="policy-section">
        <h2>5. Cookie dan Teknologi Serupa</h2>
        <p>Kami dapat menggunakan cookie untuk meningkatkan pengalaman pengguna, seperti menyimpan preferensi dan aktivitas pengguna di dalam platform.</p>
      </section>

      <section class="policy-section">
        <h2>6. Hak Pengguna</h2>
        <p>Pengguna memiliki hak untuk:</p>
        <ul>
          <li>Mengakses dan memperbarui informasi pribadi</li>
          <li>Meminta penghapusan akun</li>
          <li>Menghubungi kami terkait penggunaan data</li>
        </ul>
      </section>

      <section class="policy-section">
        <h2>7. Perubahan Kebijakan</h2>
        <p>TRIVEX dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan akan diberitahukan melalui platform.</p>
      </section>

      <section class="policy-section">
        <h2>8. Kontak</h2>
        <p>Jika terdapat pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami melalui:<br>
        Email: hello@trivex.com</p>
        <p class="closing-text">Dengan menggunakan layanan TRIVEX, pengguna dianggap telah membaca dan menyetujui Kebijakan Privasi ini.</p>
      </section>
    </main>
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
.mobile-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  width: 100%;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  color: #000000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  position: relative;
  margin-left: auto;
  margin-right: auto;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

.header {
  padding-top: 21px;
  padding-left: 7px;
  height: 62px;
  display: flex;
  align-items: flex-start;
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

.content {
  padding: 12px 27px 40px 27px;
  font-size: 12px;
  line-height: 1.5;
  letter-spacing: 0.1px;
}

.main-title {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 2px 0;
}

.last-updated {
  font-size: 12px;
  font-weight: 700;
  margin: 0 0 18px 0;
}

.intro {
  margin: 0 0 18px 0;
}

.policy-section {
  margin-bottom: 18px;
}

.policy-section h2 {
  font-size: 12px;
  font-weight: 400;
  margin: 0 0 2px 0;
}

.policy-section p {
  margin: 0 0 2px 0;
}

.policy-section ul {
  margin: 0;
  padding-left: 18px;
  list-style-type: disc;
}

.policy-section li {
  margin-bottom: 2px;
  padding-left: 2px;
}

.closing-text {
  margin-top: 8px !important;
}
</style>
