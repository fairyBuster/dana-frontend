<template>
  <div class="terms-page">
    <section id="section-terms">
      <div class="app-container">
        <header class="header">
          <button type="button" class="back-button" aria-label="Kembali" @click="goBack">
            <img src="/assets/images/9_20.svg" alt="" class="back-icon" aria-hidden="true">
          </button>
          <h1 class="page-title">Syarat Layanan</h1>
        </header>
        <main class="content">
          <div class="terms-text">{{ termsText }}</div>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const termsText = `Selamat datang di Dana Proteksi. Dengan mengakses, mendaftar, atau menggunakan layanan Dana Proteksi, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh Syarat Layanan ini.
Syarat Layanan ini mengatur penggunaan website, akun, fitur, informasi, dan layanan digital yang disediakan oleh Dana Proteksi.
1. Definisi
Dalam Syarat Layanan ini:
Dana Proteksi adalah platform digital yang menyediakan layanan informasi, pengelolaan, pemantauan, dan perlindungan aktivitas dana pengguna melalui sistem yang tersedia di website.
Pengguna adalah setiap orang yang mengakses, mendaftar, atau menggunakan layanan Dana Proteksi.
Akun adalah akses pribadi yang dibuat oleh pengguna untuk menggunakan layanan Dana Proteksi.
Layanan adalah seluruh fitur, informasi, sistem, halaman, dan fasilitas digital yang disediakan oleh Dana Proteksi.
2. Persetujuan Pengguna
Dengan menggunakan layanan Dana Proteksi, pengguna menyatakan bahwa:
 Telah membaca dan memahami Syarat Layanan ini.
 Setuju untuk mematuhi seluruh ketentuan yang berlaku.
 Memberikan informasi yang benar, akurat, dan dapat dipertanggungjawabkan.
 Bertanggung jawab atas seluruh aktivitas yang terjadi melalui akun pengguna.
 Tidak menggunakan layanan untuk tindakan yang melanggar hukum atau merugikan pihak lain.
Apabila pengguna tidak menyetujui Syarat Layanan ini, pengguna disarankan untuk tidak menggunakan layanan Dana Proteksi.
3. Pendaftaran Akun
Untuk menggunakan fitur tertentu, pengguna mungkin diminta untuk membuat akun dengan memberikan informasi yang diperlukan, seperti nama, email, nomor handphone, dan data lain yang dibutuhkan.
Pengguna bertanggung jawab untuk memastikan bahwa seluruh informasi yang diberikan adalah benar, lengkap, dan terbaru.
Dana Proteksi berhak menolak, membatasi, menangguhkan, atau menonaktifkan akun apabila ditemukan informasi yang tidak benar, aktivitas mencurigakan, penyalahgunaan layanan, atau pelanggaran terhadap ketentuan ini.
4. Keamanan Akun
Pengguna bertanggung jawab penuh untuk menjaga kerahasiaan informasi akun, termasuk username, email, password, kode verifikasi, OTP, dan data login lainnya.
Dana Proteksi tidak pernah meminta password, PIN, kode OTP, atau informasi sensitif lainnya melalui pesan pribadi, telepon tidak resmi, atau pihak ketiga.
Apabila terjadi akses tidak sah, kehilangan akun, atau aktivitas mencurigakan, pengguna wajib segera menghubungi layanan bantuan resmi Dana Proteksi.
5. Penggunaan Layanan
Pengguna setuju untuk menggunakan layanan Dana Proteksi hanya untuk tujuan yang sah dan sesuai dengan ketentuan yang berlaku.
Pengguna dilarang untuk:
 Menggunakan layanan untuk aktivitas penipuan, manipulasi, pencucian uang, atau tindakan ilegal lainnya.
 Mengakses sistem secara tidak sah.
 Mengganggu, merusak, atau membebani sistem Dana Proteksi.
 Menggunakan bot, script otomatis, scraping, eksploitasi celah sistem, atau metode teknis lain tanpa izin.
 Menyebarkan informasi palsu, menyesatkan, atau merugikan pihak lain.
 Menggunakan identitas orang lain tanpa izin.
 Melakukan tindakan yang dapat merusak reputasi, keamanan, atau operasional Dana Proteksi.
6. Ketersediaan Layanan
Dana Proteksi berupaya menyediakan layanan secara stabil, aman, dan dapat diakses oleh pengguna. Namun, pengguna memahami bahwa layanan digital dapat mengalami gangguan, pembaruan, pemeliharaan, keterlambatan, atau kendala teknis tertentu.
Dana Proteksi tidak bertanggung jawab atas kerugian yang timbul akibat gangguan layanan yang disebabkan oleh faktor di luar kendali, termasuk namun tidak terbatas pada gangguan jaringan, perangkat pengguna, penyedia layanan pihak ketiga, force majeure, serangan siber, atau pemeliharaan sistem.
7. Informasi dan Konten
Seluruh informasi yang tersedia di website Dana Proteksi disediakan untuk tujuan layanan, edukasi, dan informasi umum.
Dana Proteksi berupaya memastikan informasi yang ditampilkan akurat dan terbaru. Namun, Dana Proteksi tidak menjamin bahwa seluruh informasi selalu bebas dari kesalahan, keterlambatan, atau kekurangan.
Pengguna disarankan untuk membaca setiap informasi dengan teliti sebelum mengambil keputusan atau menggunakan fitur tertentu.
8. Batasan Tanggung Jawab
Dana Proteksi tidak bertanggung jawab atas kerugian yang timbul akibat:
 Kelalaian pengguna dalam menjaga keamanan akun.
 Kesalahan pengguna dalam memasukkan data.
 Penggunaan layanan yang tidak sesuai dengan ketentuan.
 Penyalahgunaan akun oleh pihak lain akibat kelalaian pengguna.
 Gangguan teknis, jaringan, perangkat, atau sistem pihak ketiga.
 Tindakan pihak luar yang berada di luar kendali Dana Proteksi.
Pengguna menggunakan layanan Dana Proteksi dengan kesadaran dan tanggung jawab pribadi.
9. Privasi dan Perlindungan Data
Penggunaan data pribadi pengguna diatur dalam Kebijakan Privasi Dana Proteksi.
Dengan menggunakan layanan ini, pengguna menyetujui pengumpulan, penggunaan, penyimpanan, dan perlindungan data sesuai dengan Kebijakan Privasi yang berlaku.
Pengguna disarankan untuk membaca Kebijakan Privasi secara lengkap sebelum menggunakan layanan Dana Proteksi.
10. Hak Kekayaan Intelektual
Seluruh logo, nama, desain, tampilan, teks, ikon, elemen visual, fitur, sistem, dan konten yang terdapat pada website Dana Proteksi merupakan milik Dana Proteksi atau pihak yang memberikan izin penggunaan.
Pengguna dilarang menyalin, menggunakan, mengubah, mendistribusikan, menjual, atau memanfaatkan konten Dana Proteksi untuk kepentingan komersial tanpa izin tertulis.
11. Penangguhan dan Penghentian Akun
Dana Proteksi berhak menangguhkan, membatasi, atau menghentikan akses pengguna apabila pengguna:
 Melanggar Syarat Layanan ini.
 Memberikan informasi palsu atau tidak valid.
 Melakukan aktivitas mencurigakan.
 Menggunakan layanan untuk tujuan ilegal.
 Mengganggu keamanan atau operasional sistem.
 Melakukan tindakan yang merugikan Dana Proteksi, pengguna lain, atau pihak ketiga.
Keputusan penangguhan atau penghentian akun dapat dilakukan tanpa pemberitahuan terlebih dahulu apabila diperlukan untuk menjaga keamanan layanan.
12. Perubahan Layanan
Dana Proteksi berhak untuk mengubah, menambah, mengurangi, memperbarui, atau menghentikan sebagian maupun seluruh fitur layanan sewaktu-waktu sesuai kebutuhan operasional, keamanan, pengembangan sistem, atau kebijakan internal.
Pengguna memahami bahwa perubahan tersebut dapat dilakukan untuk meningkatkan kualitas, keamanan, dan efektivitas layanan.
13. Tautan Pihak Ketiga
Website Dana Proteksi dapat memuat tautan menuju website atau layanan pihak ketiga.
Dana Proteksi tidak bertanggung jawab atas isi, keamanan, kebijakan, atau layanan yang disediakan oleh pihak ketiga tersebut.
Pengguna disarankan untuk membaca syarat layanan dan kebijakan privasi pihak ketiga sebelum menggunakan layanan mereka.
14. Larangan Penyalahgunaan Nama Dana Proteksi
Pengguna atau pihak lain dilarang menggunakan nama, logo, identitas, atau atribut Dana Proteksi untuk tujuan penipuan, promosi tidak resmi, penyalahgunaan, atau aktivitas yang dapat merugikan pengguna lain.
Dana Proteksi tidak bertanggung jawab atas tindakan pihak yang mengatasnamakan Dana Proteksi di luar kanal resmi.
15. Perubahan Syarat Layanan
Dana Proteksi dapat memperbarui Syarat Layanan ini dari waktu ke waktu sesuai dengan perubahan layanan, kebutuhan operasional, atau ketentuan yang berlaku.
Setiap perubahan akan dipublikasikan melalui halaman ini. Pengguna disarankan untuk memeriksa halaman Syarat Layanan secara berkala.
Dengan tetap menggunakan layanan setelah perubahan dilakukan, pengguna dianggap telah menyetujui Syarat Layanan yang telah diperbarui.
16. Hubungi Kami
Apabila pengguna memiliki pertanyaan, keluhan, atau permintaan terkait Syarat Layanan ini, pengguna dapat menghubungi kami melalui:
Dana Proteksi  Email: [email perusahaan]  Website: [alamat website]  Layanan Bantuan: [kontak/halaman bantuan]
Dengan menggunakan layanan Dana Proteksi, pengguna dianggap telah membaca, memahami, dan menyetujui seluruh Syarat Layanan ini.`

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.terms-page {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background: linear-gradient(360deg, #FEFDFE 0%, #FDF8EA 100%);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#section-terms {
  display: flex;
  justify-content: center;
  width: 100%;
}

.app-container {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background: linear-gradient(360deg, #FEFDFE 0%, #FDF8EA 100%);
  position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  align-items: center;
  padding: 25px 19px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  text-decoration: none;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.back-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.page-title {
  margin: 0 0 0 28px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: #000000;
}

.content {
  padding: 18px 21px 40px 21px;
}

.terms-text {
  color: #0e0e0e;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
