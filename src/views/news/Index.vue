<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header" class="section-container">
      <header class="app-header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/image/204_54.svg" alt="" aria-hidden="true">
        </button>
        <h1 class="header-title">News currently</h1>
      </header>
    </section>

    <!-- News List Section -->
    <section id="section-news-list" class="section-container">
      <div class="news-list-wrapper">
        <div v-if="articles.length === 0 && !isLoading" class="empty-state">
          <p class="empty-text">No news yet</p>
        </div>

        <div v-else class="news-list">
          <article
            v-for="article in articles"
            :key="article.id"
            class="news-card"
            @click="viewDetails(article.id)"
          >
            <div class="news-image-placeholder">
              <img
                v-if="article?.image"
                :src="resolveNewsImageUrl(article.image)"
                :alt="article.title || 'News image'"
                class="news-thumb-img"
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
                @error="handleThumbError"
              >
            </div>
            <div class="news-content">
              <h2 class="news-title">{{ article.title || 'News title' }}</h2>
              <p class="news-desc">{{ getSnippet(article.body) }}</p>
            </div>
          </article>
        </div>
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
    else router.push('/hn/home')
  } catch (_) {
    router.push('/hn/home')
  }
}

const viewDetails = (articleId) => {
  router.push(`/hn/home/news/${articleId}`)
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
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/\uFFFD/g, '-')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
  const lines = normalized
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  const firstParagraph = lines[0] || ''
  const cleanText = firstParagraph || lines.join(' ')
  if (!cleanText) return 'News content'
  return cleanText.length > 110 ? `${cleanText.slice(0, 110)}...` : cleanText
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Failed to fetch news'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  return 'Failed to fetch news'
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
* {
  box-sizing: border-box;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.section-container {
  width: 100%;
  max-width: 412px;
  margin: 0 auto;
}

h1, h2, p {
  margin: 0;
}

/* Header Section */
.app-header {
  display: flex;
  align-items: center;
  padding: 20px 10px;
  position: relative;
  justify-content: center;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  position: absolute;
  left: 10px;
}

.back-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  line-height: 1.2;
  text-align: center;
}

/* News List Section */
.news-list-wrapper {
  padding: 10px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-card {
  background-color: rgba(255, 255, 255, 0.47);
  border: 1px solid #ffffff;
  border-radius: 5px;
  padding: 12px 11px;
  display: flex;
  gap: 8px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s;
}

.news-card:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.news-image-placeholder {
  background-color: #d9d9d9;
  border-radius: 2px;
  width: 110px;
  height: 64px;
  flex-shrink: 0;
  overflow: hidden;
}

.news-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: flex-start;
  flex: 1;
  min-width: 0;
}

.news-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  line-height: 1.2;
}

.news-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.3;
  color: #000000;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
