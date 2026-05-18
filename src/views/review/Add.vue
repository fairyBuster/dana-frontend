<template>
  <div class="app-container">
    <section id="section-header">
      <header class="header">
        <button class="back-btn" @click="goBack" aria-label="Go back">
          <img src="/assets/image/4252_325.svg" alt="Back Icon">
        </button>
        <h1 class="page-title">Ulasan</h1>
      </header>
    </section>

    <section id="section-alert">
      <div class="alert-banner">
        <img src="/assets/image/4269_485.svg" alt="Info Icon" class="alert-icon">
        <p class="alert-text">Berikan ulasan terbaik Anda setelah melakukan penarikan dan dapatkan hadiah tambahan secara otomatis!</p>
      </div>
    </section>

    <section id="section-review-form">
      <div class="form-container">
        <div class="text-input-area">
          <label class="input-label" for="review-text">Tulis ulasan Anda</label>
          <textarea id="review-text" v-model="reviewText" class="text-input" placeholder="Masukkan kalimat disini"></textarea>
        </div>

        <div class="upload-area" @click="triggerUpload">
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png"
            class="hidden-file-input"
            @change="handleFileSelect"
          >
          <template v-if="previewUrl">
            <img :src="previewUrl" alt="Preview" class="preview-img">
            <p class="upload-text">Ketuk untuk mengganti gambar<br>JPG/PNG Maks: 1MB</p>
          </template>
          <template v-else>
            <img src="/assets/image/4252_247.svg" alt="Upload Photo Icon" class="upload-icon">
            <p class="upload-text">Tambahkan tangkapan layar penarikan Anda untuk memberikan ulasan terbaik!<br>JPG/PNG Maks: 1MB</p>
          </template>
        </div>
      </div>
    </section>

    <section id="section-submit-action">
      <button class="submit-btn" :disabled="!canSubmit || isSubmitting" @click="submitReview">
        {{ isSubmitting ? 'Mengirim...' : 'Kirim ulasan saya' }}
      </button>
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
.app-container {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #f8f8f8;
  max-width: 412px;
  margin-left: auto;
  margin-right: auto;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

/* Header */
#section-header {
  background-color: #f8f8f8;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  position: relative;
  padding: 0 20px;
}

.back-btn {
  position: absolute;
  left: 10px;
  background: none;
  border: none;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 35px;
  height: 35px;
  object-fit: contain;
}

.page-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  margin: 0;
}

/* Alert */
#section-alert {
  padding: 10px 13px;
  background-color: #f8f8f8;
}

.alert-banner {
  background: linear-gradient(90deg, #d1e9e2 0%, #d1e9e2 42.79%, #dfefe9 68.27%, #d6ebe5 82.69%, #e8f4ef 100%);
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.alert-icon {
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  object-fit: contain;
}

.alert-text {
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
  color: #000000;
  font-weight: 400;
}

/* Review Form */
#section-review-form {
  padding: 10px 12px;
  background-color: #f8f8f8;
}

.form-container {
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.text-input-area {
  background-color: #f8f8f8;
  border-radius: 20px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 106px;
}

.input-label {
  color: #004d43;
  font-size: 13px;
  font-weight: 700;
}

.text-input {
  background: transparent;
  border: none;
  resize: none;
  font-family: inherit;
  font-size: 13px;
  color: #000000;
  outline: none;
  flex-grow: 1;
  padding: 0;
  min-height: 60px;
}

.text-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.upload-area {
  background-color: #f8f8f8;
  border: 1px dashed rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 30px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  min-height: 195px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.upload-area:hover {
  background-color: #f0f0f0;
}

.upload-icon {
  width: 107px;
  height: 100px;
  opacity: 0.2;
  object-fit: contain;
}

.preview-img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 12px;
}

.upload-text {
  margin: 0;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.5);
  line-height: 1.5;
}

.hidden-file-input {
  display: none;
}

/* Submit Action */
#section-submit-action {
  padding: 20px 12px 40px 12px;
  background-color: #f8f8f8;
}

.submit-btn {
  width: 100%;
  background-color: #004d43;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  height: 50px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
