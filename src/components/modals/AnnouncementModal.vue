<template>
  <div v-if="modelValue" class="confirmation-screen" @click.self="close">
    <section id="section-popup">
      <div class="popup-overlay">
        <div class="popup-card" @click.stop>
          <button class="close-btn" aria-label="Close" type="button" @click="close">
            <img src="/assets/images/2038_167.svg" alt="Close Icon">
          </button>

          <img class="popup-image" src="/assets/images/popup.jpg" alt="Pengumuman">

          <div class="cta-row">
            <a
              v-if="telegramLink"
              class="cta-button secondary"
              :href="telegramLink"
              target="_blank"
              rel="noopener"
              @click="confirmClose"
              aria-label="Buka Telegram"
            >
              Telegram
            </a>

            <a
              class="cta-button primary"
              :href="serviceLink"
              target="_blank"
              rel="noopener"
              @click="confirmClose"
              aria-label="Hubungi layanan pelanggan"
            >
              Hubungi layanan pelanggan
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
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

const serviceLink = ref(props.telegramUrl)
const telegramLink = ref(props.telegramUrl)

watch(() => props.telegramUrl, (val) => {
  serviceLink.value = val
  telegramLink.value = val
})

onMounted(async () => {
  try {
    const response = await supportAPI.getLinks()
    const data = response.data
    const results = Array.isArray(data) ? data : (data.results || [])
    
    const normalizeUrl = (u) => String(u || '').replace(/[`"]/g, '').trim()

    const tg = results.find(link => link.title === 'Telegram' || link.id === 1)
    if (tg && tg.url) {
      telegramLink.value = normalizeUrl(tg.url)
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
  position: relative;
  width: 100%;
  max-width: 374px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: none;
  background: rgba(0, 0, 0, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.close-btn img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.popup-image {
  width: 100%;
  height: auto;
  display: block;
}

.cta-row {
  display: flex;
  gap: 10px;
  margin: 12px;
}

.cta-button {
  height: 44px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  flex: 1;
  border: none;
  cursor: pointer;
}

.cta-button.primary {
  background-color: #1f5b4a;
  color: #ffffff;
}

.cta-button.secondary {
  background-color: #eeeeee;
  color: #000000;
}
</style>
