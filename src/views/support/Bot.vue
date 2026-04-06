<template>
  <div class="chat-app">
    <!-- Header -->
    <header class="chat-header">
      <div class="header-left">
        <img src="/assets/image/177_1062.svg" alt="Back" class="icon-back" @click="goBack">
        <div class="brand-container">
          <img src="/assets/image/983276.png" alt="Logo" class="brand-logo">
          <span class="brand-text">OT-SENT</span>
        </div>
      </div>
    </header>

    <!-- Chat Body -->
    <div ref="chatBodyEl" class="chat-body">
      <!-- Messages -->
      <div v-for="(message, index) in messages" :key="message.id ?? index" 
           :class="['message-row', message.type]">
        
        <!-- Avatar for incoming messages -->
        <div v-if="message.type === 'incoming'" class="avatar-wrapper">
          <img src="/assets/image/983276.png" alt="Avatar" class="avatar">
        </div>
        
        <div class="message-content">
          <!-- Meta info for outgoing messages -->
          <div v-if="message.type === 'outgoing'" class="meta-info">
            <span>{{ message.timestamp }}</span>
          </div>
          
          <div :class="['bubble', message.type === 'incoming' ? 'bubble-incoming' : 'bubble-outgoing']">
            <p>{{ message.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer / Input Area -->
    <footer class="chat-footer">
      <div class="input-bar">
        <input 
          v-model="userMessage" 
          type="text" 
          class="input-field" 
          placeholder="Tulis pesan Anda"
          :disabled="isSending"
          @keyup.enter="sendMessage"
        >
        <img src="/assets/image/52d07f48a5523655a4c9c36540d51d26d21423aa.png" alt="Send" class="icon-send" @click="sendMessage">
      </div>
    </footer>

    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supportAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const userMessage = ref('')
const isSending = ref(false)
const errorModalOpen = ref(false)
const errorMessage = ref('')
const chatBodyEl = ref(null)
let chatStream = null

const messages = ref([])

const goBack = () => {
  router.go(-1)
}

const pad2 = (n) => String(n).padStart(2, '0')
const formatDateTime = (value) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, segarkan halaman'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Permintaan gagal, segarkan halaman'
}

const mapApiMessage = (m) => {
  const sender = String(m?.sender_type || '').toUpperCase()
  const type = sender === 'USER' ? 'outgoing' : 'incoming'
  return {
    id: m?.id ?? null,
    type,
    text: String(m?.message || ''),
    timestamp: type === 'outgoing' ? `Me ${formatDateTime(m?.created_at)}` : '',
    createdAtRaw: m?.created_at || null
  }
}

const scrollToBottom = async () => {
  await nextTick()
  const el = chatBodyEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

const fetchMessages = async () => {
  try {
    const resp = await supportAPI.getChatMessages()
    const list = Array.isArray(resp?.data) ? resp.data : []
    const mapped = list.map(mapApiMessage)
    mapped.sort((a, b) => new Date(a.createdAtRaw || 0).getTime() - new Date(b.createdAtRaw || 0).getTime())
    if (!mapped.length) {
      messages.value = [{
        id: 'welcome',
        type: 'incoming',
        text: 'Pesan ini dikelola otomatis menggunakan bot automatisasi. Jika Anda membutuhkan bantuan silakan tulis pertanyaan Anda dan menunggu antrian.',
        timestamp: '',
        createdAtRaw: null
      }]
    } else {
      messages.value = mapped
    }
    await scrollToBottom()
  } catch (err) {
    messages.value = [{
      id: 'welcome',
      type: 'incoming',
      text: 'Selamat datang di pusat pelayanan OT-SENT!',
      timestamp: '',
      createdAtRaw: null
    }]
    errorMessage.value = extractErrorMessage(err)
    errorModalOpen.value = true
  }
}

const appendIncoming = async (payload) => {
  if (!payload) return
  if (payload?.id && messages.value.some((m) => String(m.id) === String(payload.id))) return
  messages.value.push(mapApiMessage(payload))
  await scrollToBottom()
}

const startStream = () => {
  const fallback = supportAPI.streamChatWithFetch(async (msg) => {
    await appendIncoming(msg)
  })
  if (fallback) {
    chatStream = { close: () => fallback.abort() }
    if (fallback?.ready && typeof fallback.ready.then === 'function') {
      fallback.ready.then((res) => {
        if (res && res.ok === false && res.status === 401) {
          errorMessage.value = 'Silakan masuk terlebih dahulu untuk menggunakan chat.'
          errorModalOpen.value = true
        }
      })
    }
  }
}

const sendMessage = async () => {
  const text = String(userMessage.value || '').trim()
  if (!text) return
  if (isSending.value) return

  isSending.value = true
  errorModalOpen.value = false
  errorMessage.value = ''
  try {
    const resp = await supportAPI.sendChatMessage({ message: text })
    const data = resp?.data || null
    if (data) {
      messages.value.push(mapApiMessage(data))
    } else {
      messages.value.push({
        id: `local-${Date.now()}`,
        type: 'outgoing',
        text,
        timestamp: `Me ${formatDateTime(new Date().toISOString())}`,
        createdAtRaw: new Date().toISOString()
      })
    }
    userMessage.value = ''
    await scrollToBottom()
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    errorModalOpen.value = true
  } finally {
    isSending.value = false
  }
}

onMounted(async () => {
  await fetchMessages()
  startStream()
})

onBeforeUnmount(() => {
  if (chatStream?.close) {
    try { chatStream.close() } catch (_) {}
  }
  chatStream = null
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

.chat-app {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  background-image: url('/assets/image/2800a66723e19a64dfa7a916b9f49c4077b15e71.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

/* Header Styles */
.chat-header {
  padding: 0px 20px;
  display: flex;
  align-items: center;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-back {
  width: 41px;
  height: 40px;
  cursor: pointer;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.brand-logo {
  width: 107px;
  height: 100px;
  object-fit: contain;
}

.brand-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #ffffff;
  letter-spacing: 0.5px;
}

/* Chat Body Styles */
.chat-body {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row.incoming {
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
}

.message-row.outgoing {
  justify-content: flex-end;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.bubble {
  padding: 10px 15px;
  color: #ffffff;
  font-size: 13px;
  line-height: 1.4;
}

.bubble p {
  margin: 0;
}

.bubble-incoming {
  background-color: #1d2138;
  border-radius: 0;
}

.bubble-outgoing {
  background-color: #746a9a;
  border-radius: 0;
}

.meta-info {
  text-align: right;
  margin-bottom: 5px;
}

.meta-info span {
  color: #ffffff;
  font-size: 10px;
  opacity: 0.8;
}

/* Footer Styles */
.chat-footer {
  background-color: #1d2138;
  padding: 20px 15px 30px 15px;
  width: 100%;
}

.input-bar {
  background-color: #746a9a;
  border-radius: 20px;
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 10px 0 20px;
  justify-content: space-between;
}

.input-field {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 13px;
  font-family: 'Inter', sans-serif;
}

.input-field::placeholder {
  color: #bababa;
}

.icon-send {
  width: 34px;
  height: 34px;
  cursor: pointer;
}
</style>
