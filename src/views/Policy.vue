<template>
  <div class="terms-page">
    <section id="section-terms">
      <div class="app-container">
        <header class="header">
          <button type="button" class="back-button" aria-label="Kembali" @click="goBack">
            <img src="/assets/images/8_401.svg" alt="" class="back-icon" aria-hidden="true">
          </button>
          <h1 class="page-title">Kebijakan Privasi</h1>
        </header>
        <main class="content">
          <div class="terms-text">{{ policyText }}</div>
        </main>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const policyText = `Selamat datang di Dana Proteksi. Kami menghargai privasi setiap pengguna dan berkomitmen untuk melindungi data pribadi yang diberikan melalui website dan layanan kami.
Kebijakan Privasi ini menjelaskan bagaimana Dana Proteksi mengumpulkan, menggunakan, menyimpan, dan melindungi informasi pengguna saat mengakses layanan kami.
1. Informasi yang Kami Kumpulkan
Kami dapat mengumpulkan beberapa informasi dari pengguna, termasuk namun tidak terbatas pada:
 Nama lengkap
 Alamat email
 Nomor handphone
 Informasi akun pengguna
 Data aktivitas penggunaan layanan
 Informasi perangkat, browser, alamat IP, dan data teknis lainnya
 Informasi tambahan yang diberikan pengguna saat menghubungi layanan pelanggan
Kami hanya mengumpulkan informasi yang diperlukan untuk mendukung penggunaan layanan dan meningkatkan keamanan sistem.
2. Penggunaan Informasi
Informasi yang dikumpulkan dapat digunakan untuk:
 Membuat dan mengelola akun pengguna
 Memverifikasi identitas dan aktivitas akun
 Memberikan akses ke layanan Dana Proteksi
 Meningkatkan kualitas layanan dan pengalaman pengguna
 Menjaga keamanan sistem dari penyalahgunaan, akses tidak sah, atau aktivitas mencurigakan
 Mengirimkan informasi penting terkait akun, layanan, atau pembaruan sistem
 Menanggapi pertanyaan, permintaan, atau keluhan pengguna
Dana Proteksi tidak akan menggunakan data pengguna untuk tujuan yang bertentangan dengan hukum atau kebijakan layanan kami.
3. Perlindungan Data
Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi pengguna dari akses tidak sah, perubahan, pengungkapan, kehilangan, atau penyalahgunaan.
Langkah perlindungan tersebut dapat mencakup penggunaan sistem keamanan, pembatasan akses internal, pemantauan aktivitas, serta teknologi pendukung lain yang bertujuan menjaga kerahasiaan data pengguna.
Meskipun demikian, pengguna memahami bahwa tidak ada sistem digital yang sepenuhnya bebas dari risiko. Oleh karena itu, pengguna juga bertanggung jawab untuk menjaga kerahasiaan informasi akun, termasuk password, kode verifikasi, dan data login lainnya.
4. Kerahasiaan Akun
Pengguna bertanggung jawab untuk menjaga keamanan akun masing-masing. Dana Proteksi tidak pernah meminta password, PIN, kode OTP, atau data sensitif lainnya melalui pesan pribadi, telepon tidak resmi, atau pihak ketiga.
Apabila pengguna menemukan aktivitas mencurigakan atau dugaan penyalahgunaan akun, pengguna disarankan untuk segera menghubungi layanan bantuan resmi Dana Proteksi.
5. Penggunaan Cookies
Website Dana Proteksi dapat menggunakan cookies atau teknologi serupa untuk meningkatkan pengalaman pengguna, menyimpan preferensi, menganalisis aktivitas website, dan membantu menjaga keamanan layanan.
Pengguna dapat mengatur penggunaan cookies melalui pengaturan browser masing-masing. Namun, menonaktifkan cookies tertentu dapat memengaruhi fungsi dan kenyamanan penggunaan layanan.
6. Pembagian Informasi kepada Pihak Ketiga
Dana Proteksi tidak menjual, menyewakan, atau memperdagangkan data pribadi pengguna kepada pihak lain.
Namun, kami dapat membagikan informasi tertentu kepada pihak ketiga apabila diperlukan untuk:
 Mendukung operasional layanan
 Memenuhi kewajiban hukum atau permintaan otoritas yang berwenang
 Melindungi hak, keamanan, dan kepentingan Dana Proteksi maupun pengguna
 Mencegah tindakan penyalahgunaan, penipuan, atau pelanggaran terhadap ketentuan layanan
Setiap pembagian informasi dilakukan secara terbatas dan sesuai dengan kebutuhan yang sah.
7. Penyimpanan Data
Data pengguna akan disimpan selama akun masih aktif atau selama diperlukan untuk tujuan layanan, keamanan, administrasi, hukum, dan kepatuhan.
Apabila data sudah tidak diperlukan, Dana Proteksi dapat menghapus, membatasi, atau menyamarkan informasi tersebut sesuai dengan kebijakan internal dan ketentuan yang berlaku.
8. Hak Pengguna
Pengguna dapat mengajukan permintaan terkait data pribadi, seperti:
 Memperbarui informasi akun
 Meminta koreksi data yang tidak akurat
 Mengajukan pertanyaan mengenai penggunaan data
 Meminta peninjauan terhadap informasi tertentu yang tersimpan di sistem kami
Permintaan tersebut dapat diajukan melalui kontak resmi Dana Proteksi.
9. Keamanan Transaksi dan Aktivitas
Dana Proteksi berupaya menjaga keamanan setiap aktivitas pengguna di dalam layanan. Kami dapat melakukan pemantauan terhadap aktivitas tertentu untuk mencegah tindakan yang melanggar hukum, penyalahgunaan sistem, akses tidak sah, atau aktivitas mencurigakan lainnya.
Pengguna dilarang menggunakan layanan Dana Proteksi untuk kegiatan yang merugikan pihak lain, melanggar hukum, atau bertentangan dengan ketentuan layanan.
10. Tautan ke Website Lain
Website Dana Proteksi dapat memuat tautan ke website pihak ketiga. Kami tidak bertanggung jawab atas kebijakan privasi, keamanan, atau konten dari website pihak ketiga tersebut.
Pengguna disarankan untuk membaca kebijakan privasi masing-masing website sebelum memberikan informasi pribadi.
11. Perubahan Kebijakan Privasi
Dana Proteksi dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu sesuai dengan kebutuhan layanan, perubahan sistem, atau ketentuan yang berlaku.
Setiap perubahan akan dipublikasikan melalui halaman ini. Pengguna disarankan untuk memeriksa halaman Kebijakan Privasi secara berkala.
12. Hubungi Kami
Apabila pengguna memiliki pertanyaan, permintaan, atau keluhan terkait Kebijakan Privasi ini, pengguna dapat menghubungi kami melalui:
Dana Proteksi  Email: [email perusahaan]  Website: [alamat website]  Layanan Bantuan: [kontak/halaman bantuan]
Dengan menggunakan layanan Dana Proteksi, pengguna dianggap telah membaca, memahami, dan menyetujui Kebijakan Privasi ini.`

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
  width: 100%;
  height: 100%;
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
