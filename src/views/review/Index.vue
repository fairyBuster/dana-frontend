<template>
  <div class="app-container">
    <section id="section-header">
      <header class="app-header">
        <button class="icon-btn back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/images/2033_608.svg" alt="Back Icon">
        </button>
        <h1 class="header-title">Ulasan</h1>
      </header>
    </section>

    <section id="section-notice">
      <div class="notice-card">
        <div class="notice-icon-wrapper">
          <img src="/assets/images/c62929550e6f78f10c44151b65ee54d7d3284539.png" alt="Info Icon" class="notice-icon">
        </div>
        <p class="notice-text">Berikan ulasan terbaik Anda setelah melakukan penarikan dan dapatkan hadiah tambahan secara otomatis!</p>
      </div>
    </section>

    <section id="section-reviews">
      <div v-if="reviews.length === 0 && !isLoading" class="empty-state">
        <p class="empty-text">Belum ada ulasan</p>
      </div>

      <div class="reviews-container">
        <article v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-card-inner">
            <h2 class="review-username">{{ review.username }}</h2>
            <p class="review-content">{{ review.content }}</p>
            <div v-if="review.image" class="review-image-container">
              <img :src="review.image" alt="Transaction Screenshot" class="review-img">
            </div>
            <button class="like-btn" :aria-label="review.liked ? 'Unlike review' : 'Like review'" @click="toggleLike(review)">
              <img :src="review.liked ? likedIcon : unlikedIcon" :alt="review.liked ? 'Liked Heart Icon' : 'Unliked Heart Icon'">
            </button>
          </div>
          <p v-if="review.liked" class="liked-status-text">Anda menyukai ulasan ini</p>
        </article>
      </div>

      <div v-if="hasMore" class="pagination-row">
        <button class="load-more-btn" @click="loadMore" :disabled="isLoading">
          Memuat lebih banyak
        </button>
      </div>
    </section>

    <section id="section-footer">
      <div class="fixed-bottom-bar">
        <button class="action-button" @click="openReviewModal">Berikan ulasan penarikan saya</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { reviewAPI } from '@/services/api'

const router = useRouter()

const reviews = ref([])
const isLoading = ref(false)
const hasMore = ref(false)
const currentPage = ref(1)

const unlikedIcon = '/assets/images/0878c682423e0fb00d79d2496d1071ec44ac4c5e.png'
const likedIcon = '/assets/images/2a530eac949716d93806f6dbccd2b005049e7be2.png'

const goBack = () => {
  router.go(-1)
}

const toggleLike = (review) => {
  review.liked = !review.liked
}

const openReviewModal = () => {
  router.push('/review/add')
}

const BACKEND_ORIGIN = (() => {
  const raw = String(import.meta?.env?.VITE_BACKEND_URL || '').trim()
  if (!/^https?:\/\//.test(raw)) return ''
  try {
    return new URL(raw).origin
  } catch (_) {
    return ''
  }
})()

const resolveReviewImageUrl = (rawUrl) => {
  let s = String(rawUrl ?? '').trim()
  if (!s) return ''
  if (s.length >= 2) {
    const first = s[0]
    const last = s[s.length - 1]
    if ((first === '`' && last === '`') || (first === '"' && last === '"') || (first === "'" && last === "'")) {
      s = s.slice(1, -1).trim()
    }
  }
  if (!s) return ''
  if (/^http:\/\//i.test(s)) s = s.replace(/^http:\/\//i, 'https://')
  if (/^https?:\/\//i.test(s)) return s
  if (s.startsWith('/media/')) {
    return BACKEND_ORIGIN ? `${BACKEND_ORIGIN}${s}` : s
  }
  return s
}

const normalizeReviewsResponse = (data) => {
  if (!data) return { results: [], next: null }
  if (Array.isArray(data)) return { results: data, next: null }
  if (Array.isArray(data.results)) return { results: data.results, next: data.next || null }
  return { results: [], next: null }
}

const toUiReview = (r) => {
  const img = Array.isArray(r?.images) && r.images.length ? r.images[0]?.image : ''
  return {
    id: r?.id,
    username: r?.user_display_name || '-',
    content: r?.text || '',
    image: resolveReviewImageUrl(img),
    liked: Boolean(r?.is_liked),
    likesCount: Number(r?.likes_count ?? 0)
  }
}

const fetchReviews = async (page = 1, append = false) => {
  isLoading.value = true
  try {
    const resp = await reviewAPI.getReviews({ page })
    const parsed = normalizeReviewsResponse(resp?.data)
    const items = parsed.results.map(toUiReview)
    if (append) {
      reviews.value = [...reviews.value, ...items]
    } else {
      reviews.value = items
    }
    hasMore.value = Boolean(parsed.next)
    currentPage.value = page
  } catch (_) {
    if (!append) reviews.value = []
    hasMore.value = false
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  if (isLoading.value) return
  if (!hasMore.value) return
  await fetchReviews(currentPage.value + 1, true)
}

onMounted(() => {
  fetchReviews(1, false)
})
</script>

<style scoped>
.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  max-width: 412px;
  background-color: #f8f8f8;
  position: relative;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  display: block;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  position: relative;
  height: 60px;
}

.icon-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn {
  position: absolute;
  left: 10px;
  width: 35px;
  height: 35px;
}

.back-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #000000;
}

/* Notice */
#section-notice {
  padding: 0 14px;
  margin-bottom: 16px;
}

.notice-card {
  background: linear-gradient(90deg, #D1E9E2 0%, #D1E9E2 42.79%, #DFEFE9 68.27%, #D6EBE5 82.69%, #E8F4EF 100%);
  border-radius: 20px;
  padding: 12px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.notice-icon-wrapper {
  flex-shrink: 0;
  padding-top: 2px;
}

.notice-icon {
  width: 23px;
  height: 23px;
  object-fit: contain;
}

.notice-text {
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
  color: #000000;
}

/* Reviews */
#section-reviews {
  padding: 0 14px 120px 14px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.review-card {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 16px 14px 14px 14px;
  display: flex;
  flex-direction: column;
}

.review-card-inner {
  background-color: #f8f8f8;
  border-radius: 20px;
  padding: 16px;
  position: relative;
}

.review-username {
  margin: 0 0 6px 0;
  color: #004d43;
  font-size: 13px;
  font-weight: 700;
}

.review-content {
  margin: 0 0 16px 0;
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
  line-height: 1.4;
}

.review-image-container {
  width: 102px;
}

.review-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.like-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.like-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.liked-status-text {
  margin: 8px 12px 0 0;
  text-align: right;
  color: rgba(0, 0, 0, 0.5);
  font-size: 11px;
}

.pagination-row {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 16px;
}

.load-more-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background-color: #004d43;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Footer */
.fixed-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 412px;
  padding: 16px 14px 32px 14px;
  background: linear-gradient(180deg, rgba(248, 248, 248, 0) 0%, rgba(248, 248, 248, 0.9) 20%, rgba(248, 248, 248, 1) 100%);
  z-index: 100;
}

.action-button {
  width: 100%;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  font-family: inherit;
}

.action-button:active {
  background-color: #003831;
}
</style>

