<template>
  <div class="app-container">
    <!-- Header -->
    <section id="section-header">
      <header class="app-header">
        <button class="back-btn" aria-label="Go back" @click="goBack">
          <img src="/assets/images/67_323.svg" alt="">
        </button>
        <h1 class="header-title">Sebarkan Ulasan Saya</h1>
      </header>
    </section>

    <!-- Review Form -->
    <section id="section-review-form">
      <div class="review-card">
        <!-- Text Input -->
        <div class="input-box text-input-box">
          <label class="input-label">Bagikan pengalaman Anda disini</label>
          <textarea
            v-model="reviewText"
            class="text-input"
            placeholder="Pengalaman saya...."
          ></textarea>
        </div>

        <!-- File Upload -->
        <div class="input-box file-input-box" @click="triggerUpload">
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png"
            class="hidden-file-input"
            @change="handleFileSelect"
          >
          <template v-if="previewUrl">
            <img :src="previewUrl" alt="Preview" class="preview-img">
          </template>
          <template v-else>
            <p class="instruction-text">
              Tambahkan tangkapan layar penarikan Anda untuk memberikan ulasan terbaik!<br>
              JPG/PNG Maks: 1MB
            </p>
          </template>
        </div>

        <!-- Submit -->
        <button class="submit-btn" :disabled="!canSubmit || isSubmitting" @click="submitReview">
          {{ isSubmitting ? 'Mengirim...' : 'Sebarkan Ulasan Saya' }}
        </button>
      </div>
    </section>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <SuccessModal v-model="showSuccessModal" :message="successMessage" @update:modelValue="onSuccessClose" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { reviewAPI } from '@/services/api'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import SuccessModal from '@/components/modals/AppSuccessModal.vue'

const router = useRouter()

const reviewText = ref('')
const selectedFile = ref(null)
const previewUrl = ref('')
const isSubmitting = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

const fileInput = ref(null)

const canSubmit = computed(() => {
  return reviewText.value.trim().length > 0 && !!selectedFile.value
})

const goBack = () => {
  router.go(-1)
}

const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 1024 * 1024) {
    errorMessage.value = 'Ukuran file maksimal 1MB'
    showErrorModal.value = true
    event.target.value = ''
    return
  }

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    errorMessage.value = 'Format file harus JPG atau PNG'
    showErrorModal.value = true
    event.target.value = ''
    return
  }

  selectedFile.value = file
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Gagal mengirim ulasan'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  if (data.error) return String(data.error)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Gagal mengirim ulasan'
}

const submitReview = async () => {
  if (!canSubmit.value || isSubmitting.value) return
  isSubmitting.value = true
  showErrorModal.value = false
  errorMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('text', reviewText.value.trim())
    if (selectedFile.value) {
      formData.append('images', selectedFile.value)
    }
    await reviewAPI.createReview(formData)

    successMessage.value = 'Ulasan berhasil dikirim!'
    showSuccessModal.value = true
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isSubmitting.value = false
  }
}

const onSuccessClose = () => {
  router.go(-1)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

img {
  max-width: 100%;
  display: block;
}

.app-container {
  font-family: 'Inter', sans-serif;
  background-color: #fdfaf4;
  max-width: 412px;
  margin: 0 auto;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  gap: 16px;
  height: 64px;
}

.back-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.back-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

/* Review Form */
#section-review-form {
  padding: 19px 14px 40px 14px;
}

.review-card {
  background-color: #fcf3df;
  border-radius: 2px;
  padding: 16px 15px;
  display: flex;
  flex-direction: column;
}

.input-box {
  background-color: #fdfaf4;
  border-radius: 2px;
  width: 100%;
}

.text-input-box {
  height: 106px;
  padding: 11px 15px;
  margin-bottom: 17px;
  display: flex;
  flex-direction: column;
}

.input-label {
  color: #b1893b;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.text-input {
  background: transparent;
  border: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  color: #000000;
  outline: none;
  flex-grow: 1;
  padding: 0;
}

.text-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
}

.file-input-box {
  height: 114px;
  padding: 28px 15px;
  margin-bottom: 11px;
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-input-box:hover {
  background-color: #f8f3e8;
}

.instruction-text {
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
  line-height: 1.4;
  margin: 0;
}

.preview-img {
  width: 100%;
  max-height: 100px;
  object-fit: contain;
  border-radius: 4px;
}

.hidden-file-input {
  display: none;
}

.submit-btn {
  background: linear-gradient(90deg, #f4c142 0%, #f8dd89 46.63%, #f5ca51 100%);
  border-radius: 10px;
  width: 212px;
  height: 41px;
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
  font-family: inherit;
}

.submit-btn:active {
  opacity: 0.8;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
