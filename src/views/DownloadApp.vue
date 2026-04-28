<!-- <template>
  <section id="section-app">
    <div class="app-container">
      <a href="#" class="back-link" @click.prevent="router.go(-1)">Kembali ke menu utama</a>
      <div class="logo-container">
        <img src="/assets/images/952cc0d03b5e5172c1cbc48fa9611d43b6f0d653.png" alt="Logo" class="app-logo">
      </div>
      <h1 class="app-title">Aset Finansial Nusantara</h1>
      <p class="version-text">Versi 1.0.2</p>
      <div class="qr-card">
        <img :src="qrImage" alt="QR Code" class="qr-image">
        <p class="instruction-text">Scan QR untuk menginstal aplikasi Ocerin</p>
      </div>
    </div>
  </section>
</template> -->

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { getFrontendUrl } from '@/utils/settings'

const router = useRouter()
const qrImage = ref('/assets/images/e84dbf746b992803a6abb783986d05ee77d5ec3c.png')

const getApkUrl = () => {
  const base = getFrontendUrl()
  const origin = String(base || '').replace(/\/+$/, '')
  return `${origin}/assets/android/ocerin-v1.apk`
}

onMounted(async () => {
  try {
    qrImage.value = await QRCode.toDataURL(getApkUrl(), { width: 320, margin: 2 })
  } catch (_) {
    qrImage.value = '/assets/images/e84dbf746b992803a6abb783986d05ee77d5ec3c.png'
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

/* CSS for section section:App */
#section-app {
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Inter', sans-serif;
}

.app-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  height: 100vh; /* Fixed height based on design */
  background-image: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

/* Back Link */
.back-link {
  position: absolute;
  top: 18px;
  left: 22px;
  font-size: 14px;
  color: #555555;
  line-height: 25px;
  font-weight: 400;
  z-index: 10;
  text-decoration: none;
  cursor: pointer;
}

/* QR Card Container */
.qr-card {
  position: absolute;
  top: 177px;
  left: 50%;
  transform: translateX(-50%);
  width: 341px;
  height: 483px;
  background-color: #d7eddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Using padding to position internal elements relative to card top */
  padding-top: 16px;
}

/* QR Image */
.qr-image {
  width: 331px;
  height: 322px;
  object-fit: contain;
  /* Visual adjustment to match design spacing */
  display: block;
}

/* Instruction Text */
.instruction-text {
  width: 301px;
  margin: 0;
  margin-top: 17px; /* Gap between image and text */
  font-size: 20px;
  line-height: 1.4;
  color: #302f2f;
  text-align: center;
  font-weight: 600;
}

/* Responsive adjustments for smaller screens if necessary */

</style>
