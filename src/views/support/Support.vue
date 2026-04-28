<template>
  <div class="app-container">
    <section id="section-header">
      <header class="header-container">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/2055_403.svg" alt="Back Icon">
        </button>
        <h1 class="header-title">Pusat Bantuan</h1>
      </header>
    </section>

    <section id="section-faq">
      <div class="faq-content">
        <h2 class="section-title">Pertanyaan Populer</h2>

        <div class="accordion-list">
          <div
            v-for="(item, index) in faqItems"
            :key="index"
            class="accordion-item"
          >
            <div class="accordion-header" @click="toggleItem(index)">
              <h3 class="accordion-title">{{ item.title }}</h3>
              <img
                :src="item.open ? '/assets/images/2055_409.svg' : '/assets/images/2055_416.svg'"
                :alt="item.open ? 'Collapse' : 'Expand'"
                class="accordion-icon"
              >
            </div>
            <div v-if="item.open" class="accordion-body">
              <p class="accordion-text">{{ item.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const faqItems = ref([
  {
    title: 'Apa itu TRIVEX?',
    body: 'TRIVEX adalah platform digital untuk pengelolaan aset dan aktivitas investasi yang dirancang agar mudah digunakan, aman, dan efisien dalam satu aplikasi.',
    open: true
  },
  {
    title: 'Bagaimana cara mendaftar di TRIVEX?',
    body: 'Anda dapat mendaftar dengan mengisi username, nomor telepon aktif, email, serta kode undangan. Pastikan data yang digunakan valid untuk proses verifikasi.',
    open: false
  },
  {
    title: 'Apakah saya bisa memiliki lebih dari satu akun?',
    body: 'Tidak. Setiap pengguna hanya diperbolehkan memiliki satu akun untuk menjaga keamanan dan keadilan dalam sistem.',
    open: false
  },
  {
    title: 'Bagaimana cara melakukan deposit?',
    body: 'Masuk ke menu Deposito, pilih metode pembayaran, lalu ikuti instruksi yang tersedia hingga transaksi berhasil.',
    open: false
  },
  {
    title: 'Berapa minimal penarikan dana?',
    body: 'Minimal penarikan adalah Rp35.000 dengan biaya administrasi sebesar 10%.',
    open: false
  },
  {
    title: 'Berapa lama proses penarikan dana?',
    body: 'Penarikan yang dilakukan hari ini akan diproses dan masuk ke rekening pengguna maksimal hari berikutnya (H+1).',
    open: false
  },
  {
    title: 'Apakah keuntungan tetap setiap hari?',
    body: 'Keuntungan dapat berbeda setiap harinya sesuai dengan kondisi sistem dan periode yang berjalan.',
    open: false
  },
  {
    title: 'Apakah saya bisa menarik dana sebelum masa kontrak selesai?',
    body: 'Penarikan dapat dilakukan sesuai dengan ketentuan yang berlaku di dalam sistem. Beberapa produk memiliki periode tertentu.',
    open: false
  },
  {
    title: 'Apakah aman menggunakan TRIVEX?',
    body: 'TRIVEX menggunakan sistem keamanan berlapis dengan enkripsi data dan SSL aktif untuk menjaga keamanan informasi pengguna.',
    open: false
  },
  {
    title: 'Bagaimana jika saya lupa password?',
    body: 'Gunakan fitur Lupa Password pada halaman login dan ikuti langkah pemulihan akun.',
    open: false
  },
  {
    title: 'Apakah saya bisa mengundang teman?',
    body: 'Ya, pengguna dapat mengundang anggota baru menggunakan kode undangan yang tersedia di akun masing-masing.',
    open: false
  },
  {
    title: 'Bagaimana jika terjadi kendala pada akun?',
    body: 'Silakan hubungi layanan pelanggan melalui menu Layanan Umum atau kontak resmi yang tersedia di platform.',
    open: false
  },
  {
    title: 'Apakah TRIVEX memiliki biaya tambahan?',
    body: 'Beberapa layanan seperti penarikan dana memiliki biaya administrasi sesuai ketentuan yang berlaku.',
    open: false
  },
  {
    title: 'Bagaimana cara melihat riwayat transaksi?',
    body: 'Anda dapat melihat seluruh aktivitas melalui menu Riwayat Transaksi di dalam aplikasi.',
    open: false
  },
  {
    title: 'Butuh bantuan lebih lanjut?',
    body: 'Jika Anda membutuhkan bantuan lebih lanjut, silakan hubungi tim dukungan TRIVEX melalui kontak resmi yang tersedia.',
    open: false
  }
])

const goBack = () => {
  router.go(-1)
}

const toggleItem = (index) => {
  faqItems.value[index].open = !faqItems.value[index].open
}
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  background-color: #f8f8f8;
  min-height: 100vh;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

/* Header Section */
.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  position: relative;
  min-height: 60px;
}

.back-button {
  position: absolute;
  left: 0px;
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  text-align: center;
}

/* FAQ Section */
.faq-content {
  padding: 16px 20px 40px 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #121212;
  margin: 0 0 24px 0;
}

.accordion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.accordion-item {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.accordion-title {
  font-size: 14px;
  font-weight: 600;
  color: #004d43;
  margin: 0;
  flex: 1;
  padding-right: 16px;
}

.accordion-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  object-fit: contain;
}

.accordion-body {
  margin-top: 12px;
}

.accordion-text {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
  line-height: 1.4;
}
</style>
