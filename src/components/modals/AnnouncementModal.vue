<template>
  <div v-if="modelValue" class="confirmation-screen" @click.self="close">
    <section id="section-popup">
      <div class="popup-overlay">
        <div class="popup-card">
          <div class="card-content">
            <button class="close-btn" aria-label="Close" @click="close">
              <img src="/assets/image/297_80.svg" alt="Close Icon">
            </button>

            <div class="illustration">
              <img src="/assets/image/9aedffe9b7183afd497c25e4ec70f2daa309daf8.png" alt="Consultation Illustration">
            </div>

            <div class="text-wrapper">
              <h2 class="title">Apakah Anda ingin melakukan konsultasi?</h2>
              <p class="subtitle">
                Dapatkan informasi program konservasi dan akses layanan resmi melalui kanal berikut.
              </p>
            </div>

            <div class="button-group">
              <a
                :href="groupLink"
                target="_blank"
                rel="noopener"
                class="action-btn"
                @click="confirmClose"
              >
                <span class="btn-text">Tautan Grup Aset Finansial Nusantara</span>
                <img
                  class="btn-icon"
                  src="/assets/image/b5f9b328fb147f1ae1397692ceadde02ed7b2688.png"
                  alt="Telegram"
                >
              </a>
              <a
                :href="serviceLink"
                target="_blank"
                rel="noopener"
                class="action-btn"
                @click="confirmClose"
              >
                <span class="btn-text">Layanan Aset Finansial Nusantara</span>
                <img
                  class="btn-icon"
                  src="/assets/image/b5f9b328fb147f1ae1397692ceadde02ed7b2688.png"
                  alt="Telegram"
                >
              </a>
          </div>
          </div>

          <div class="card-image">
            <img src="/assets/image/8209441fe6353b0e3c7fc124481e2a3bf0db8d3d.png" alt="Ocerin Foundation Nature">
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { supportAPI } from '@/services/api'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'OSIM' },
  message: { type: String, default: '' },
  pages: { type: Array, default: () => [] },
  startIndex: { type: Number, default: 0 },
  showTelegram: { type: Boolean, default: true },
  telegramUrl: { type: String, default: 'https://t.me/OSIM_Channel_Indonesia' },
  telegramText: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'close'])

const internalIndex = ref(props.startIndex)
const pagesToShow = computed(() => (props.pages && props.pages.length > 0) ? props.pages : [props.message])
const currentIndex = computed(() => internalIndex.value)
const currentPageText = computed(() => pagesToShow.value[currentIndex.value] || '')

const groupLink = ref(props.telegramUrl)
const serviceLink = ref(props.telegramUrl)
const telegramLabel = ref(props.telegramText)

watch(() => props.modelValue, (val) => {
  if (val) internalIndex.value = props.startIndex
})

watch(() => props.telegramUrl, (val) => {
  groupLink.value = val
})

onMounted(async () => {
  try {
    const response = await supportAPI.getLinks()
    const data = response.data
    const results = Array.isArray(data) ? data : (data.results || [])
    
    const normalizeUrl = (u) => String(u || '').replace(/[`"]/g, '').trim()

    const group = results.find(link => link.platform === 'telegram' || link.id === 1)
    if (group && group.url) {
      groupLink.value = normalizeUrl(group.url)
    }

    const service = results.find(link => link.title === 'Layanan Ocerin' || link.id === 4)
    if (service && service.url) {
      serviceLink.value = normalizeUrl(service.url)
    }
  } catch (error) {
    console.error('Failed to fetch Telegram link:', error)
  }
})

const close = () => emit('update:modelValue', false)
const confirmClose = () => { close(); emit('close') }
</script>

<style scoped>
.confirmation-screen {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  padding: 20px;
  box-sizing: border-box;
}

.popup-overlay {
  width: 100%;
  max-width: 412px;
  display: flex;
  justify-content: center;
}

.popup-card {
  display: flex;
  flex-direction: row;
  width: 374px;
  height: 274px;
  background-color: transparent;
  position: relative;
  overflow: visible;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-content {
  width: 211px;
  background-color: #f2f2f2;
  position: relative;
  padding: 0 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 14px;
  left: 10px;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-icon {
  width: 18px;
  height: 18px;
  color: #555555;
}

.illustration {
  position: absolute;
  top: -48px;
  left: 41px;
  width: 139px;
  height: 138px;
  pointer-events: none;
}

.illustration img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.text-wrapper {
  margin-top: 75px;
  position: relative;
}

.title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 5px 0;
  line-height: 1.4;
}

.subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: #a6a6a6;
  margin: 0;
  line-height: 1.4;
}

.button-group {
  margin-top: auto;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 37px;
  background: linear-gradient(180deg, rgba(134, 166, 141, 1) 0%, rgba(166, 205, 139, 1) 100%);
  border-radius: 10px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 0 10px;
  box-sizing: border-box;
  text-decoration: none;
}

.btn-text {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
}

.btn-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.card-image {
  width: 163px;
  height: 274px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
