<!-- <template>
  <div class="app-container">
    <section id="header">
      <header class="app-header">
        <div class="header-icon" @click="goBack">
          <img src="/assets/img/56_590.svg" alt="Back">
        </div>
        <h1 class="header-title">Instruksi</h1>
      </header>
    </section>
    <section id="instruction-1" class="content-section">
      <h1 class="section-title" style="text-align: center; margin-bottom: 1rem;">🎯 Bagaimana Cara Misi Bekerja 🎯</h1>
      <div style="text-align: justify;">
        <p>
          <strong>Misi 1: Misi Pendaftaran Anggota</strong><br>
          Pada misi ini, anggota berpartisipasi dengan mengajak orang lain untuk mendaftar akun CoreVolt.
        </p>
        <p style="margin-bottom: 0.5rem;">Alurnya sebagai berikut: <br>
          Alurnya sebagai berikut:
Anggota membagikan tautan pendaftaran CoreVolt kepada calon anggota baru. Calon anggota kemudian melakukan pendaftaran akun menggunakan data yang benar, valid, dan tidak ganda. Setelah pendaftaran berhasil, sistem CoreVolt akan melakukan verifikasi secara otomatis. Setiap pendaftaran yang dinyatakan valid akan dihitung sebagai capaian misi. Ketika jumlah pendaftaran yang ditentukan tercapai, anggota berhak memperoleh hadiah sesuai ketentuan yang berlaku.
        </p>
      
      </div>
      <div class="visual-group">
        <div class="gray-box main-image">
       
          <img src="/assets/img/43464.png" alt="Instruction Overview" style="width:100%;height:100%;object-fit:fill;">
        </div>
     
      </div>
      
       <div style="text-align: justify;">
        <p>
          <strong>Misi 2: Misi Total Deposit Anggota</strong><br>
          Pada misi ini, anggota berpartisipasi dengan meningkatkan total deposit dari anggota yang telah bergabung.
        </p>
        <p style="margin-bottom: 0.5rem;">Alurnya sebagai berikut: <br>
          Anggota mengajak atau mendorong anggota lain untuk melakukan deposit ke dalam akun CoreVolt. Setiap deposit yang berhasil akan tercatat dan diakumulasikan oleh sistem. Sistem secara otomatis menghitung total deposit yang masuk dari jaringan anggota tersebut. Apabila total deposit telah mencapai target yang ditentukan, anggota akan memperoleh hadiah sesuai dengan capaian misi
        </p>
      </div>
    </section>
    
    <section id="instruction-2" class="content-section">
    <div class="visual-group">
        <div class="gray-box main-image">
       
          <img src="/assets/img/images.png" alt="Instruction Overview" style="width:100%;height:100%;object-fit:fill;">
        </div>
     
      </div>
      
       <div style="text-align: justify;">
    
        <p style="margin-bottom: 0.5rem;">
          <strong>Ketentuan Umum</strong><br>
          Setiap misi akan diverifikasi secara otomatis oleh sistem CoreVolt. Hadiah hanya diberikan untuk aktivitas yang memenuhi syarat, menggunakan data yang sah, dan tidak melanggar ketentuan platform. Semakin aktif anggota dalam mengajak pendaftaran dan mendorong aktivitas deposit, semakin besar peluang untuk memperoleh hadiah.
        </p>
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

.app-container {
  width: 100%;
  max-width: 100%;
  background-color: #0d0920;
  position: relative;
  overflow-x: hidden;
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
}

img {
  display: block;
  max-width: 100%;
}

p {
  margin: 0 0 1rem 0;
  line-height: 1.5;
  color: #fff;
  font-size: 14px;
}

.gray-box {
  background-color: #d9d9d9;
  border-radius: 20px;
  overflow: hidden; /* Added to ensure image fits */
}

.gradient-fill {
  background: linear-gradient(180deg, #384a9d 0%, #5b8ecf 100%);
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  padding: 10px 0px;
  height: 41px;
  box-sizing: content-box;
}

.header-icon {
  width: 41px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-title {
  flex-grow: 1;
  text-align: center;
  font-size: 18px;
  color: #fff;
  font-weight: 600;
  margin: 0;
  padding-right: 41px;
}

/* Content Sections */
.content-section {
  padding: 20px 18px;
  position: relative;
}

.visual-group {
  position: relative;
  margin-bottom: 15px;
  height: 125px;
}

.main-image {
  width: 100%;
  height: 125px;
}

.vertical-bar {
  position: absolute;
  right: -10px;
  top: 0;
  width: 10px;
  height: 150px;
  border-radius: 0;
}

.title-group {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.2;
  white-space: nowrap;
  z-index: 1;
}

.horizontal-line {
  height: 1px;
  flex-grow: 1;
  margin-left: 10px;
  margin-top: 10px;
}

.text-content {
  font-size: 12px;
  text-align: justify;
}

/* Detail Sections */
.detail-section {
  padding: 20px 18px;
}

.large-image {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}

.medium-image {
  width: 100%;
  height: 194px;
  margin-bottom: 20px;
}
</style>