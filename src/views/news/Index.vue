<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header" class="app-section">
      <header class="header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/images/16_127.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Pemberitahuan</h1>
      </header>
    </section>

    <!-- Notifications Section -->
    <section id="section-notifications" class="app-section">
      <div v-if="articles.length === 0 && !isLoading" class="empty-state">
        <p class="empty-text">Belum ada berita</p>
      </div>

      <div v-else class="notification-list">
        <article 
          v-for="article in articles" 
          :key="article.id" 
          class="notification-card"
          @click="viewDetails(article.id)"
        >
          <div class="card-text-content">
            <h2 class="card-title">{{ article.title || 'Judul berita' }}</h2>
            <p class="card-description">{{ getSnippet(article.body) }}</p>
          </div>
          <div class="card-thumbnail">
            <img
              v-if="article?.image"
              :src="resolveNewsImageUrl(article.image)"
              :alt="article.title || 'Gambar berita'"
              class="card-thumb-img"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
              @error="handleThumbError"
            >
          </div>
        </article>
      </div>
    </section>
  </div>

  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { newsAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import { resolveImageUrl } from '@/utils/imageCache'

const router = useRouter()
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const articles = ref([])

const goBack = () => {
  try {
    if (window.history.length > 1) router.back()
    else router.push('/dashboard')
  } catch (_) {
    router.push('/dashboard')
  }
}

const viewDetails = (articleId) => {
  router.push(`/news/${articleId}`)
}

const resolveNewsImageUrl = (rawUrl) => {
  const s = String(rawUrl ?? '').trim()
  if (!s) return ''
  return resolveImageUrl(s)
}

const handleThumbError = (e) => {
  const el = e?.target
  if (!el) return
  el.src = '/assets/images/2052_245.svg'
}

const getSnippet = (text = '') => {
  const raw = String(text || '')
  const noHtml = raw.replace(/<[^>]*>?/gm, '')

  const fixMojibake = (value) => {
    const s = String(value || '')
    if (!/[âÃ][\u0080-\u00BF]/.test(s)) return s
    try {
      const bytes = new Uint8Array(Array.from(s, (ch) => ch.charCodeAt(0) & 0xff))
      return new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    } catch (_) {
      return s
    }
  }

  const normalized = fixMojibake(noHtml)
    .replace(/\u00a0/g, ' ')
    .replace(/[–—•]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\uFFFD/g, '-')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
  const lines = normalized
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  const firstParagraph = lines[0] || ''
  const cleanText = firstParagraph || lines.join(' ')
  if (!cleanText) return 'Isi berita'
  return cleanText.length > 110 ? `${cleanText.slice(0, 110)}...` : cleanText
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal mengambil berita'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Gagal mengambil berita'
}

const fetchNews = async (page = 1) => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const response = await newsAPI.getNews({ page })
    const payload = response?.data || {}
    articles.value = Array.isArray(payload?.results) ? payload.results : (Array.isArray(payload) ? payload : [])
  } catch (err) {
    articles.value = []
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

.app-section {
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
  background-color: #f8f8f8;
}

h1, h2, p {
  margin: 0;
}

/* Header Section */
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  position: relative;
  height: 60px;
}

.back-button {
  position: absolute;
  left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  height: 41px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.back-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

/* Notifications Section */
.notification-list {
  padding: 0 14px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-card {
  background-color: #ffffff;
  border-radius: 20px;
  padding: 18px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 105px;
  cursor: pointer;
}

.card-text-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding-right: 16px;
}

.card-title {
  color: #004d43;
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.card-description {
  color: #000000;
  font-size: 13px;
  font-weight: 400;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-thumbnail {
  background-color: #d9d9d9;
  border-radius: 20px;
  width: 126px;
  height: 70px;
  flex-shrink: 0;
  overflow: hidden;
}

.card-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Empty State */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-text {
  font-size: 14px;
  color: #000000;
  opacity: 0.6;
}
</style>

