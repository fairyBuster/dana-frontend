<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <div class="header-content">
          <button type="button" class="back-button" @click="goBack">
            <img src="/assets/image/132_171.svg" alt="Back" class="back-icon">
          </button>
          <h1 class="page-title">Pemberitahuan pesan</h1>
        </div>
      </header>
    </section>

    <section id="section-event-list">
      <div v-if="articles.length === 0 && !isLoading" class="empty-state">
        <img src="/assets/image/empty.png" alt="No Data" class="empty-icon" @error="onEmptyError">
        <div class="empty-text">Belum ada berita</div>
      </div>

      <div v-else class="event-list">
        <div v-for="article in articles" :key="article.id" class="event-item">
          <div class="event-date-center">{{ formatDateTime(article.published_at || article.updated_at) }}</div>
          <article class="event-card" @click="viewDetails(article.id)">
            <div class="event-icon">
              <img src="/assets/image/i3.png" alt="icon" class="event-icon-img">
            </div>
            <div class="event-details">
              <h2 class="event-title">{{ article.title || '-' }}</h2>
              <div class="event-divider"></div>
              <p class="event-body">{{ getSnippet(article.body) }}</p>
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

const router = useRouter()
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const articles = ref([])

const goBack = () => {
  try {
    if (window.history.length > 1) router.back()
    else router.push('/pages/account/active')
  } catch (_) {
    router.push('/pages/account/active')
  }
}

const viewDetails = (articleId) => {
  router.push(`/pages/account/news/${articleId}`)
}

const getSnippet = (text = '') => {
  const cleanText = String(text || '').replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim()
  if (!cleanText) return '-'
  return cleanText.length > 140 ? `${cleanText.slice(0, 140)}...` : cleanText
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const fallbackEmptyImage = '/assets/images/34646.png'
const onEmptyError = (e) => {
  const el = e?.target
  if (el && el.src && !String(el.src).includes(fallbackEmptyImage)) el.src = fallbackEmptyImage
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.app-container {
  width: 100%;
  max-width: 412px;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

* {
  box-sizing: border-box;
}

h1, h2, h3, p {
  margin: 0;
}

img {
  display: block;
  max-width: 100%;
}

#section-header {
  padding-top: 13px;
  padding-bottom: 10px;
}

.app-header {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 9px;
  position: relative;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.back-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 24px;
  height: 24px;
}

.page-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255,255,255,1);
  pointer-events: none;
}

#section-event-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px 100px;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.event-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-date-center {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
}

.event-card {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(90deg, #100f2c 0%, #0f132e 48%, #0a1025 100%);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
}

.event-icon {
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: rgba(162, 150, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.event-icon-img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  display: block;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.event-title {
  font-size: 13px;
  color: #a296ff;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
}

.event-body {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 0 10px;
}

.empty-icon {
  width: 210px;
  height: auto;
  opacity: 0.9;
}

.empty-text {
  font-size: 12px;
  color: rgba(255,255,255,0.65);
}
</style>
