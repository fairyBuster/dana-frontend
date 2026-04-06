<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <div class="header-content">
          <button type="button" class="back-button" @click="goBack">
            <img src="/assets/image/132_171.svg" alt="Back" class="back-icon">
          </button>
          <h1 class="header-title">Berita</h1>
        </div>
      </header>
    </section>

    <section id="section-content">
      <div class="content-container">
        <h2 class="article-title">{{ article?.title || '-' }}</h2>
        <div class="article-meta">{{ formatDate(article?.published_at || article?.updated_at) }}</div>
        <div class="article-body" v-html="formattedBody"></div>
      </div>
    </section>
  </div>

  <LoadingSpinner :visible="isLoading" :overlay="true" message="" />
  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { newsAPI } from '@/services/api'
import LoadingSpinner from '@/components/partials/LoadingSpinner.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const article = ref(null)

const goBack = () => {
  try {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/pages/account/news')
    }
  } catch (_) {
    router.push('/pages/account/news')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }).replace(',', '')
}

const escapeHtml = (unsafe) => {
  return String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const formattedBody = computed(() => {
  const raw = String(article.value?.body || '').replace(/\r\n/g, '\n').trim()
  if (!raw) return ''
  const clean = escapeHtml(raw.replace(/<[^>]*>?/gm, ''))
  return clean
    .split(/\n\s*\n/)
    .filter((p) => p.trim())
    .map((p) => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
    .join('')
})

const fetchArticle = async (articleId) => {
  isLoading.value = true
  showErrorModal.value = false
  errorMessage.value = ''
  try {
    const response = await newsAPI.getNewsDetail(articleId)
    article.value = response.data
  } catch (err) {
    article.value = null
    const data = err?.response?.data
    errorMessage.value = typeof data === 'string' ? data : (data?.detail ? String(data.detail) : 'Gagal mengambil berita')
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const articleId = route.params.id
  if (articleId) {
    fetchArticle(articleId)
  }
})

// Watch for route changes to handle navigation between related articles
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchArticle(newId)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  display: block;
}

h1,
h2,
h3,
p {
  margin: 0;
}

.app-container {
  width: 100%;
  max-width: 412px;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  min-height: 100vh;
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
  cursor: pointer;
  z-index: 2;
}

.header-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255,255,255,1);
  pointer-events: none;
}

#section-content {
  padding: 12px 14px 90px;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-title {
  font-size: 16px;
  font-weight: 700;
  color: rgba(255,255,255,0.92);
  line-height: 1.35;
}

.article-meta {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
}

.article-body {
  font-size: 12px;
  line-height: 1.65;
  color: rgba(255,255,255,0.82);
  text-align: justify;
}

.article-body :deep(p) {
  margin: 0 0 10px;
}

.article-body :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
