<template>
  <div class="app-container">
    <section id="section-header" class="header-section">
      <div class="header-container">
        <div class="header-icon" @click="goBack">
          <img src="/assets/images/140_135.svg" alt="Back">
        </div>
        <h1 class="header-title">Perizinan</h1>
      </div>
    </section>
    
    <section id="section-profile" class="profile-section">
      <div class="profile-content">
        <div class="logo-container">
          <img src="/assets/images/952cc0d03b5e5172c1cbc48fa9611d43b6f0d653.png" alt="ASFina Logo" class="main-logo">
        </div>
        <h2 class="company-name">Aset Finansial Nusantara</h2>
      </div>
    </section>
    
    <section id="section-infocards" class="cards-section">
      
      <!-- Card: Nama Usaha -->
      <article class="info-card bg-bidang-layanan">
        <div class="card-content">
          <h3 class="card-label">Nama Usaha</h3>
          <p class="card-value">PT Aset Finansial Nusantara</p>
        </div>
      </article>

      <!-- Card: Nama Merek Dagang -->
      <article class="info-card bg-bidang-layanan">
        <div class="card-content">
          <h3 class="card-label">Nama Merek Dagang</h3>
          <p class="card-value">ASFina</p>
        </div>
      </article>

      <!-- Card: Badan Hukum -->
      <article class="info-card bg-bidang-layanan">
        <div class="card-content">
          <h3 class="card-label">Badan Hukum</h3>
          <p class="card-value">Perseroan Terbatas (PT)</p>
        </div>
      </article>

      <!-- Card: Status Operasional -->
      <article class="info-card bg-bidang-layanan">
        <div class="card-content">
          <h3 class="card-label">Status Operasional</h3>
          <p class="card-value">Aktif dan beroperasi</p>
        </div>
      </article>

      <!-- Card: Bidang Layanan -->
      <article class="info-card bg-bidang-layanan">
        <div class="card-content">
          <h3 class="card-label">Bidang Layanan</h3>
          <p class="card-value">Layanan pengelolaan aset digital dan sistem jaringan berbasis aplikasi</p>
        </div>
      </article>

      <!-- Card: Informasi Perizinan -->
      <article class="info-card ">
        <div class="card-content">
          <h3 class="card-label">Informasi Perizinan dan Registrasi</h3>
          <p class="card-value multiline">Nomor Izin / Registrasi
 KEP-36/PM.2/2016

Instansi / Penerbit Izin
Pengawas Pasar Modal

Tanggal Terbit Izin
21 November 2016

Ruang Lingkup Izin
Operasional sistem layanan keuangan berbasis digital sesuai regulasi yang berlaku</p>
        </div>
      </article>

      <!-- Card: Alamat -->
      <article class="info-card">
        <div class="card-content">
          <h3 class="card-label">Alamat dan Operasional</h3>
          <p class="card-value multiline">Alamat Kantor Pusat
Rukan Mangga Dua Square Blok F No.40
Jl. Gunung Sahari Raya No.1, Ancol, Pademangan
Jakarta Utara 14420, Indonesia.

Jam Operasional
Senin – Minggu
09.00 – 21.00 WIB</p>
        </div>
      </article>

      <!-- Card: Layanan Bantuan -->
      <article class="info-card ">
        <div class="card-content">
          <h3 class="card-label">Layanan Bantuan Resmi</h3>
          <p class="card-value multiline">WhatsApp Resmi
0812-XXXX-017
<br>
Telegram Resmi
 @AsetNusaOfficial
<br>
Email Resmi
callcustomer@aset-nusa.com
<br>
Jam Layanan Bantuan
Setiap hari pukul 09.00 – 21.00 WIB</p>
          <p class="card-disclaimer">ASFina tidak bertanggung jawab atas komunikasi di luar kontak resmi yang tertera pada halaman ini.</p>
        </div>
      </article>

      <!-- Card: Keamanan -->
      <article class="info-card ">
        <div class="card-content">
          <h3 class="card-label">Keamanan dan Transaksi Akun</h3>
          <p class="card-value multiline">Sistem enkripsi data pengguna
Monitoring aktivitas tidak wajar
Proteksi terhadap penyalahgunaan akun
Audit internal berkala</p>
        </div>
      </article>

      <!-- Card: Privasi -->
      <article class="info-card ">
        <div class="card-content">
          <h3 class="card-label">Privasi dan Perlindungan Data</h3>
          <p class="card-value multiline">🔹 Pengelolaan Data
 Data pengguna dikelola sesuai kebijakan privasi dan regulasi yang berlaku.
 <br>
🔹 Penyimpanan Data
 Data disimpan pada sistem dengan perlindungan keamanan berlapis.
<br>
🔹 Kerahasiaan
 Informasi pengguna tidak dibagikan tanpa persetujuan kecuali diwajibkan oleh hukum.
<br>
🔹 Kebijakan Privasi
 Pengguna dapat membaca kebijakan lengkap melalui menu Kebijakan Privasi.</p>
        </div>
      </article>

    </section>
    
    <section id="section-footer" class="footer-section">
      <div class="footer-content">
        <p class="copyright">© 2026 ASFina – Aset Finansial Nusantara. Seluruh hak cipta dilindungi undang-undang.</p>
        <div class="footer-logos">
          <img src="/assets/images/9247fb3a0182399d464f5e73d0e66665b07f1ca5.png" alt="Logo 1" class="footer-logo-1">
          <img src="/assets/images/a648e454f7e6e93caec0f833a59b7dcec155605e.png" alt="Logo 2" class="footer-logo-2">
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

// Define props and emits if needed
// defineProps({})
// defineEmits([])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  background-image: url('/assets/images/715159f6564747d497ee33db87973e7e1507fc24.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top center;
  background-color: #ffffff;
  min-height: 100vh;
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  overflow-x: hidden;
  flex-direction: column;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

h1, h2, h3, p {
  margin: 0;
}

/* CSS for section section:Header */
.header-section {
  width: 100%;
  max-width: 100%;
  height: 107px;
  display: flex;
  align-items: flex-start;
  padding-top: 5px;
 
  position: relative;
  z-index: 10;
}

.header-container {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 10px;
}

.header-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 25px;
}

/* CSS for section section:Profile */
.profile-section {
  width: 100%;
  max-width: 412px;
  background-color: #FFFFFF;
  position: relative;
  padding-bottom: 20px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo-container {
  margin-top: -51px;
  margin-bottom: 12px;
  z-index: 20;
}

.main-logo {
  width: 102px;
  height: 102px;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

.company-name {
  font-size: 16px;
  font-weight: 700;
  color: #242424;
  line-height: 1.2;
}

/* CSS for section section:InfoCards */
.cards-section {
  width: 100%;
  max-width: 100%;
  background-color: #FFFFFF;
  padding: 0 10px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  width: 100%;
  min-height: auto;
  border-radius: 12px;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.card-content {
  padding: 16px 20px;
}

.card-label {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 8px;
}

.card-value {
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  line-height: 1.4;
}

.multiline {
  white-space: pre-line;
}

.card-disclaimer {
  font-size: 10px;
  font-weight: 700;
  color: #000000;
  margin-top: 12px;
  line-height: 1.3;
}

/* CSS for section section:Footer */
.footer-section {
  width: 100%;
  max-width: 412px;
  background-color: #FFFFFF;
  padding: 20px 20px 40px 20px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.copyright {
  font-size: 10px;
  color: #808080;
  text-align: center;
  line-height: 1.4;
  max-width: 250px;
}

.footer-logos {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer-logo-1 {
  height: 16px;
  width: auto;
}

.footer-logo-2 {
  height: 20px;
  width: auto;
}


</style>
