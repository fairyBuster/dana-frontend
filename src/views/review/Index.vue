<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="header">
        <button class="back-btn" aria-label="Go back" @click="goBack">
          <img src="/assets/images/68_154.svg" alt="">
        </button>
        <h1 class="header-title">Testimoni Nasabah</h1>
      </header>
    </section>

    <!-- Hero -->
    <section id="section-hero">
      <div class="hero">
        <div class="hero-content">
          <h2 class="hero-title">Testimoni</h2>
          <p class="hero-desc">Lihat ulasan dan bagikan pengalaman Anda sebagai anggota disini! Dapatkan 1.000 rupiah setiap kali Anda memberikan ulasan terbaik!</p>
        </div>
        <div class="hero-image">
          <img src="/assets/images/9f4d7b8ace034cd96bb6b037dd50538b5db64b68.png" alt="">
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section id="section-stats">
      <div class="stats-card">
        <div class="stat-item left">
          <span class="stat-label">Rata-rata Penilaian</span>
          <div class="stat-value-group">
            <span class="stat-value">{{ avgRating }}</span><span class="stat-sub">/5</span>
          </div>
          <img class="stars" src="/assets/images/f5bce5c83a7464ed5f14a5ef271a6ba469af0edb.png" alt="">
        </div>
        <div class="stat-divider"></div>
        <div class="stat-image">
          <img src="/assets/images/06a16c3f2937b2f5e050475d31a81b087b24be42.png" alt="">
        </div>
        <div class="stat-item right">
          <span class="stat-label">Total Ulasan</span>
          <span class="stat-value large">{{ totalReviews }}</span>
          <span class="stat-label sub">ulasan</span>
        </div>
      </div>
    </section>

    <!-- Action -->
    <section id="section-action">
      <div class="action-container">
        <button class="btn-primary" @click="openReviewModal">Sebarkan Ulasan Saya</button>
      </div>
    </section>

    <!-- Reviews -->
    <section id="section-reviews">
      <div v-if="reviews.length === 0 && !isLoading" class="empty-state">
        <p class="empty-text">Belum ada ulasan</p>
      </div>

      <div class="review-list">
        <div v-for="review in reviews" :key="review.id" class="review-card-outer">
          <div class="review-card-inner">
            <div class="review-content">
              <span class="review-author">{{ review.username }}</span>
              <p class="review-text">{{ review.content }}</p>
              <div class="review-footer">
                <span class="review-date">{{ review.dateDisplay }}</span>
                <img class="stars" src="/assets/images/f5bce5c83a7464ed5f14a5ef271a6ba469af0edb.png" alt="">
              </div>
            </div>
            <div v-if="review.image" class="review-screenshot">
              <img :src="review.image" alt="">
            </div>
          </div>
        </div>
      </div>

      <div v-if="hasMore" class="pagination-row">
        <button class="load-more-btn" :disabled="isLoading" @click="loadMore">
          Memuat lebih banyak
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { reviewAPI } from '@/services/api'

const router = useRouter()

const reviews = ref([])
const isLoading = ref(false)
const hasMore = ref(false)
const currentPage = ref(1)
const totalReviews = ref(0)
const avgRating = ref('4.9')

const goBack = () => {
  router.go(-1)
}

const openReviewModal = () => {
  router.push('/hn/review/add')
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

const formatDate = (iso) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const pad2 = (n) => String(n).padStart(2, '0')
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

const normalizeReviewsResponse = (data) => {
  if (!data) return { results: [], next: null, count: 0 }
  if (Array.isArray(data)) return { results: data, next: null, count: data.length }
  if (Array.isArray(data.results)) return { results: data.results, next: data.next || null, count: Number(data.count ?? data.results.length) }
  return { results: [], next: null, count: 0 }
}

const toUiReview = (r) => {
  const img = Array.isArray(r?.images) && r.images.length ? r.images[0]?.image : ''
  return {
    id: r?.id,
    username: r?.user_display_name || '-',
    content: r?.text || '',
    image: resolveReviewImageUrl(img),
    dateDisplay: formatDate(r?.created_at),
    rating: Number(r?.rating ?? 5),
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

    if (parsed.count > 0) totalReviews.value = parsed.count
    else if (!append) totalReviews.value = items.length

    if (items.length > 0) {
      const sum = items.reduce((acc, r) => acc + r.rating, 0)
      const avg = sum / items.length
      avgRating.value = avg.toFixed(1)
    }
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
* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  display: block;
}

.app-container {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  padding: 0;
  background-color: #fdfaf4;
  max-width: 412px;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  gap: 12px;
}

.back-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
}

/* Hero */
.hero {
  display: flex;
  padding: 10px 20px 20px;
  position: relative;
  min-height: 140px;
}

.hero-content {
  flex: 1;
  max-width: 65%;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 22px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 8px 0;
}

.hero-desc {
  font-size: 12px;
  color: #635f5f;
  line-height: 1.4;
  margin: 0;
}

.hero-image {
  position: absolute;
  right: -10px;
  top: -10px;
  width: 182px;
  height: 118px;
  z-index: 1;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Stats */
#section-stats {
  padding: 0 20px;
  margin-top: 10px;
}

.stats-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 16px 20px;
  justify-content: space-between;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-item.left {
  align-items: flex-start;
}

.stat-item.right {
  align-items: center;
  min-width: 70px;
}

.stat-label {
  font-size: 10px;
  color: #000000;
  margin-bottom: 4px;
  font-weight: 600;
}

.stat-label.sub {
  color: #7d7d7d;
  margin-top: 2px;
  font-weight: 400;
}

.stat-value-group {
  display: flex;
  align-items: baseline;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #000000;
}

.stat-sub {
  font-size: 12px;
  font-weight: 700;
  color: #000000;
}

.stat-value.large {
  font-size: 24px;
  line-height: 1;
  margin: 4px 0;
}

.stars {
  height: 14px;
  object-fit: contain;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0 10px;
}

.stat-image {
  width: 70px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Action */
#section-action {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background: linear-gradient(90deg, #F4C142 0%, #F8DD89 46.63%, #F5CA51 100%);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 24px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s ease;
  font-family: inherit;
}

.btn-primary:active {
  opacity: 0.8;
}

/* Reviews */
#section-reviews {
  padding: 0 14px 20px;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-text {
  color: #b2b2b2;
  font-size: 14px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.review-card-outer {
  background-color: #fcf3df;
  border-radius: 2px;
  padding: 14px;
}

.review-card-inner {
  background-color: #fdfaf4;
  border-radius: 2px;
  display: flex;
  padding: 16px;
  gap: 16px;
  min-height: 220px;
}

.review-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.review-author {
  color: #b1893b;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  display: block;
}

.review-text {
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  margin: 0 0 auto 0;
  line-height: 1.4;
}

.review-footer {
  margin-top: 16px;
}

.review-date {
  color: #b1893b;
  font-size: 10px;
  display: block;
  margin-bottom: 6px;
}

.review-screenshot {
  width: 86px;
  flex-shrink: 0;
}

.review-screenshot img {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
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
  border-radius: 10px;
  background: linear-gradient(90deg, #F4C142 0%, #F8DD89 46.63%, #F5CA51 100%);
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
</style>
