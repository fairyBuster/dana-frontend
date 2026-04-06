<!-- <template>
  <div class="app-container">
    <section id="header">
      <header class="app-header">
        <div class="header-icon" @click="goBack">
          <img src="/assets/img/56_590.svg" alt="Back">
        </div>
        <h1 class="header-title">Detail aturan status</h1>
      </header>
    </section>
    
    <section id="instruction-1" class="content-section">
     <h1 class="section-title" style="text-align: center; font-size: 16px;">🎯 Bagaimana cara mendapatkan status agen🎯 </h1>
     <p style="font-size: 12px; margin: 10px 0;">Halaman Status Pengguna menampilkan level keanggotaan Anda saat ini serta progres peningkatan ke level berikutnya. Dengan meningkatkan status pengguna, Anda berkesempatan memperoleh penghasilan tetap setiap bulan sesuai ketentuan yang berlaku.
      <br>
        <br>
      Status Anggota adalah status awal pengguna. Pada tahap ini, Anda belum memperoleh penghasilan tetap bulanan. Untuk dapat meningkatkan status dan memperoleh penghasilan, Anda diwajibkan memenuhi Syarat & Ketentuan (S&K) yang ditetapkan.
     </p>
   
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
  padding: 10px 4px;
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
  width: 285px;
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