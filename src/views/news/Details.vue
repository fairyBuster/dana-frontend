<template>
  <div class="app-container">
    <!-- Header Section -->
    <section id="section-header">
      <header class="header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <img src="/assets/image/4289_765.svg" alt="Back">
        </button>
      </header>
    </section>

    <!-- News Detail Section -->
    <section id="section-news-detail">
      <article class="news-card">
        <div class="news-image-placeholder">
          <img
            v-if="article?.image"
            :src="resolveNewsImageUrl(article.image)"
            :alt="article?.title || 'News image'"
            class="news-hero-img"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
            @error="handleHeroError"
          >
        </div>
        <h1 class="news-title">{{ article?.title || '-' }}</h1>
        <div class="news-content" v-html="formattedBody"></div>
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
import { resolveImageUrl } from '@/utils/imageCache'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const article = ref(null)

const resolveNewsImageUrl = (rawUrl) => {
  const s = String(rawUrl ?? '').trim()
  if (!s) return ''
  return resolveImageUrl(s)
}

const handleHeroError = (e) => {
  const el = e?.target
  if (!el) return
  el.src = '/assets/images/2052_245.svg'
}

const goBack = () => {
  try {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/hn/home/news')
    }
  } catch (_) {
    router.push('/hn/home/news')
  }
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
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
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
    errorMessage.value = typeof data === 'string' ? data : (data?.detail ? String(data.detail) : 'Failed to fetch news')
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
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f8f8f8;
  max-width: 100%;
  min-height: 100vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

* {
  box-sizing: border-box;
}

h1, p {
  margin: 0;
}

/* Header Section */
#section-header {
  width: 100%;
}

#section-header .header {
  padding: 8px 10px;
  display: flex;
  align-items: center;
}

#section-header .back-button {
  background: transparent;
  border: none;
  padding: 10px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

#section-header .back-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

#section-header .back-button img {
  width: 20px;
  height: 20px;
  display: block;
}

/* News Detail Section */
#section-news-detail {
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

#section-news-detail .news-card {
  width: 100%;
  max-width: 100%;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 35px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 719px;
}

#section-news-detail .news-image-placeholder {
  width: 100%;
  height: 138px;
  background-color: #d9d9d9;
  border-radius: 2px;
  margin-bottom: 34px;
  overflow: hidden;
}

#section-news-detail .news-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

#section-news-detail .news-title {
  font-size: 22px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 11px 0;
  text-align: center;
  line-height: 1.2;
}

#section-news-detail .news-content {
  font-size: 15px;
  font-weight: 400;
  color: #000000;
  line-height: 1.5;
  margin: 0;
  text-align: left;
  width: 100%;
}

#section-news-detail .news-content :deep(p) {
  margin: 0 0 10px;
}

#section-news-detail .news-content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
