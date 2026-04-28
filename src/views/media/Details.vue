<!-- <template>
  <div class="media-detail-page">
    <section id="section-header">
      <div class="container">
        <header class="nav-header" @click="goBack">
          <img src="/assets/images/2023_1661.svg" alt="Back" class="nav-icon">
          <span class="nav-text">Kembali ke beranda</span>
        </header>
      </div>
    </section>

    <section id="section-news-card">
      <div class="container">
        <article class="card">
          <h1 class="card-title">{{ article.title }}</h1>
          <div class="card-date">{{ article.date }}</div>
          <div class="card-divider"></div>
          <div class="card-body">
            <p v-for="(p, idx) in article.paragraphs" :key="idx">{{ p }}</p>
          </div>
        </article>
      </div>
    </section>

    <section id="section-footer">
      <div class="container">
        <div class="footer-content">
          <p class="tagline">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
          <div class="footer-brand">
            <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Logo" class="footer-logo">
            <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template> -->

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
    return
  }
  router.push('/media')
}

const article = computed(() => {
  const id = String(route.params.id || '')

  if (id === 'feature-launch') {
    return {
      title: 'Peluncuran Fitur Terbaru',
      date: '21 Maret 2026',
      paragraphs: [
        'OT-SENT secara resmi memperkenalkan fitur AI Mapping Engine sebagai bagian dari pengembangan sistem pemetaan udara berbasis kecerdasan buatan.',
        'Fitur ini dirancang untuk membantu pengguna dalam mengolah data hasil pemetaan drone menjadi visualisasi yang lebih terstruktur, akurat, dan mudah dipahami. Dengan pendekatan berbasis AI, proses analisis data dapat dilakukan secara otomatis tanpa memerlukan pengolahan manual yang kompleks.',
        'AI Mapping Engine memungkinkan integrasi data secara real-time, sehingga pengguna dapat memantau hasil pemetaan secara langsung melalui platform OT-SENT. Hal ini memberikan efisiensi yang lebih tinggi dalam proses monitoring dan pengambilan keputusan berbasis data.',
        'Selain itu, sistem ini juga mendukung berbagai skenario penggunaan, mulai dari pemetaan area hingga analisis data udara dalam skala yang lebih luas. Pengembangan fitur ini merupakan bagian dari komitmen OT-SENT dalam menghadirkan solusi teknologi yang adaptif dan terukur.',
        'Fitur AI Mapping Engine saat ini tersedia secara bertahap bagi pengguna OT-SENT dan akan terus dikembangkan untuk meningkatkan performa serta akurasi sistem di masa mendatang.'
      ]
    }
  }

  if (id === 'strategic-collaboration') {
    return {
      title: 'Kolaborasi Strategis',
      date: '11 Maret 2026',
      paragraphs: [
        'OT-SENT mengumumkan kolaborasi strategis untuk memperluas jangkauan layanan pemetaan udara berbasis AI dan meningkatkan kemampuan analisis data di berbagai sektor.',
        'Melalui kemitraan ini, pengguna akan mendapatkan akses ke integrasi data yang lebih kaya, peningkatan performa pemrosesan, serta dukungan operasional yang lebih kuat di lapangan.'
      ]
    }
  }

  return {
    title: 'Press & Media',
    date: '',
    paragraphs: ['Konten tidak ditemukan.']
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.media-detail-page {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0F0B2E;
  background-image: none;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
  width: 100%;
}

* {
  box-sizing: border-box;
}

.container {
  width: 100%;
  max-width: 412px;
  padding: 0 10px;
  margin: 0 auto;
}

#section-header {
  width: 100%;
  padding-top: 18px;
  padding-bottom: 20px;
}

.nav-header {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.nav-icon {
  width: 24px;
  height: 24px;
}

.nav-text {
  font-size: 14px;
  color: #a6a6a6;
  font-weight: 500;
  line-height: 20px;
}

#section-news-card {
  width: 100%;
  margin-bottom: 28px;
}

.card {
  background: linear-gradient(180deg, #0F0B2E 0%, #2B1B6F 100%);
  border-radius: 10px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.card-date {
  font-size: 12px;
  color: #a6a6a6;
  margin-bottom: 12px;
}

.card-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  width: 100%;
  margin-bottom: 16px;
}

.card-body {
  font-size: 12px;
  line-height: 1.6;
  color: #ffffff;
  text-align: justify;
}

.card-body p {
  margin-bottom: 16px;
  margin-top: 0;
}

.card-body p:last-child {
  margin-bottom: 0;
}

#section-footer {
  width: 100%;
  padding-bottom: 40px;
  margin-top: auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tagline {
  font-size: 10px;
  color: #c4c4c4;
  margin: 0;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 2px;
}

.footer-logo {
  width: 90px;
  height: auto;
  object-fit: contain;
}

.copyright {
  font-size: 10px;
  color: #ffffff;
}
</style>


