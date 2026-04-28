<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/images/16_148.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Pemberitahuan</h1>
      </header>
    </section>

    <section id="section-notification">
      <article class="notification-card">
        <div class="card-image-placeholder"></div>
        <h2 class="card-title">{{ article?.title || '-' }}</h2>
        <div class="card-meta">{{ formatDate(article?.published_at || article?.updated_at) }}</div>
        <div class="card-text" v-html="formattedBody"></div>
      </article>
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
      router.push('/news')
    }
  } catch (_) {
    router.push('/news')
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

const formattedBody = computed(() => {
  const raw = String(article.value?.body || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()
  if (!raw) return ''
  const normalized = fixMojibake(raw)
    .replace(/<[^>]*>?/gm, '')
    .replace(/\u00a0/g, ' ')
    .replace(/[–—•]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\uFFFD/g, '-')
  const clean = escapeHtml(normalized)
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

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchArticle(newId)
  }
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  width: 100%;
  max-width: 412px;
}

* {
  box-sizing: border-box;
}

section {
  width: 100%;
}

h1,
h2,
p {
  margin: 0;
}

/* Header Section */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  position: relative;
  width: 100%;
}

.back-btn {
  position: absolute;
  left: 7px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 41px;
  height: 41px;
}

.back-btn img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  text-align: center;
}

/* Notification Section */
#section-notification {
  padding: 0 20px 24px;
}

.notification-card {
  background-color: #ffffff;
  border-radius: 20px;
  min-height: 375px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-image-placeholder {
  background-color: #d9d9d9;
  border-radius: 20px;
  width: 100%;
  height: 146px;
}

.card-title {
  color: #004d43;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}

.card-meta {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
}

.card-text {
  color: #000000;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
}

.card-text :deep(p) {
  margin: 0 0 10px;
}

.card-text :deep(p:last-child) {
  margin-bottom: 0;
}
</style>


