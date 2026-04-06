<template>
  <Teleport to="body">
    <div v-if="modelValue" class="chatbot-overlay" @click.self="close">
      <div class="chat-card">
        <!-- Header -->
        <div class="chat-header">
          <div class="header-left">
            <img src="/assets/images/952cc0d03b5e5172c1cbc48fa9611d43b6f0d653.png" alt="Bot" class="bot-avatar-small">
            <div class="header-info">
              <span class="bot-name">CS Aset Finansial Nusantara</span>
              <span class="bot-status">Online</span>
            </div>
          </div>
          <button class="close-btn" @click="close">
            <img src="/assets/images/145_336.svg" alt="Close">
          </button>
        </div>

        <!-- Chat Body -->
        <div class="chat-body" ref="chatBody">
          <div class="message-row message-left">
            <img src="/assets/images/952cc0d03b5e5172c1cbc48fa9611d43b6f0d653.png" alt="User Avatar" class="avatar">
            <div class="bubble bubble-left">
              <p>Hai! Tanya saya dan saya akan menemukan jawabannya untuk Anda.</p>
            </div>
          </div>
          <div
            v-for="(message, index) in orderedMessages"
            :key="`msg-${index}`"
            :class="['message-row', message.type === 'incoming' ? 'message-left' : 'message-right']"
          >
            <template v-if="message.type === 'incoming'">
              <img src="/assets/images/952cc0d03b5e5172c1cbc48fa9611d43b6f0d653.png" alt="User Avatar" class="avatar">
              <div class="bubble bubble-left">
                <p>{{ message.text }}</p>
              </div>
            </template>
            <template v-else>
              <div class="bubble bubble-right">
                <p>{{ message.text }}</p>
              </div>
              <img src="/assets/image/983276.png" alt="Ocerin Icon" class="message-icon">
            </template>
          </div>
        </div>

        <!-- Footer -->
        <footer class="chat-footer">
          <div class="input-area">
            <input
              type="text"
              v-model="newMessage"
              class="chat-input"
              placeholder="Masukkan informasi..."
              @keyup.enter="sendMessage"
            >
          </div>
          <button
            class="send-button"
            :disabled="!newMessage.trim() || isSending"
            @click="sendMessage"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick, watch } from 'vue'
import { supportAPI } from '../../services/api'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const chatBody = ref(null)
const newMessage = ref('')
const isSending = ref(false)
const messages = ref([])
let stream = null
let fetchStream = null
let isStreaming = false

const orderedMessages = computed(() => {
  return [...messages.value].sort((a, b) => {
    const ta = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime()
    const tb = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime()
    return ta - tb
  })
})

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return

  const userMessage = newMessage.value.trim()
  newMessage.value = ''

  messages.value.push({
    id: null,
    type: 'outgoing',
    text: userMessage,
    timestamp: new Date()
  })

  scrollToBottom()

  isSending.value = true

  try {
    await supportAPI.sendChatMessage({ message: userMessage })
  } catch (error) {
    console.error('Error sending message:', error)
  } finally {
    isSending.value = false
  }
}

const fetchMessages = async () => {
  try {
    const resp = await supportAPI.getChatMessages()
    const data = Array.isArray(resp?.data) ? resp.data : []
    messages.value = data
      .map((m) => ({
        id: m?.id || m?.message_id || null,
        type: String(m?.sender_type || '').toUpperCase() === 'USER' ? 'outgoing' : 'incoming',
        text: String(m?.message || ''),
        timestamp: m?.created_at ? new Date(m.created_at) : new Date()
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
  } catch (err) {
    console.error('Failed to fetch chat messages:', err)
  }
}

const initStreamFetch = () => {
  if (isStreaming && fetchStream) return
  try {
    fetchStream = supportAPI.streamChatWithFetch((payload) => {
      const senderType = String(payload?.sender_type || '').toUpperCase()
      if (senderType === 'USER') return
      const msg = {
        id: payload?.id || payload?.message_id || null,
        type: 'incoming',
        text: String(payload?.message || ''),
        timestamp: payload?.created_at ? new Date(payload.created_at) : new Date()
      }
      if (!msg.text) return
      if (msg.id && messages.value.some((m) => m.id === msg.id)) return
      messages.value.push(msg)
      scrollToBottom()
    })
    if (fetchStream) {
      isStreaming = true
    }
  } catch (err) {
    console.warn('initStreamFetch failed:', err)
  }
}

const initStream = () => {
  initStreamFetch()
}

const cleanupStream = () => {
  try { stream?.close?.() } catch (_) {}
  try { fetchStream?.abort?.() } catch (_) {}
  stream = null
  fetchStream = null
  isStreaming = false
}

watch(() => messages.value.length, () => {
  scrollToBottom()
})

watch(() => props.modelValue, async (val) => {
  if (val) {
    await fetchMessages()
    initStream()
    scrollToBottom()
  } else {
    cleanupStream()
  }
})

const close = () => {
  emit('update:modelValue', false)
  cleanupStream()
}

onUnmounted(() => {
  cleanupStream()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.chatbot-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.chat-card {
  width: 100%;
  max-width: 100%;
  height: 500px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  position: relative;
  font-family: 'Inter', sans-serif;
}

/* Header Styles */
.chat-header {
  height: 101px;
  background: linear-gradient(90deg, #FFF2DD 0%, #45887D 100%);
  display: flex;
  align-items: center;
  padding: 0 14px;
  flex-shrink: 0;
  position: relative;
}

.header-logo {
  width: 85px;
  height: 74px;
  object-fit: contain;
  margin-right: 19px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  line-height: 1.2;
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  color: #000;
}

/* Chat Body Styles */
.chat-body {
  flex: 1;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.message-row {
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.message-left {
  justify-content: flex-start;
}

.message-right {
  justify-content: flex-end;
}

.avatar {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 9px;
}

.message-icon {
  width: 30px;
  height: 29px;
  object-fit: contain;
  margin-left: 10px;
  margin-bottom: 5px;
}

.bubble {
  padding: 12px 16px;
  max-width: 70%;
  position: relative;
}

.bubble p {
  margin: 0;
  font-size: 14px;
  color: #000000;
}

.bubble-left {
  background-color: #ebebeb;
  border-radius: 0 10px 10px 10px;
  min-width: 101px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bubble-right {
  background-color: #b0bda4;
  border-radius: 10px 0 10px 10px;
  min-width: 140px;
  min-height: 77px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Footer Styles */
.chat-footer {
  height: 80px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background-color: #ffffff;
  flex-shrink: 0;
}

.input-area {
  flex: 1;
  margin-right: 10px;
}

.chat-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: #000000;
  font-family: 'Inter', sans-serif;
}

.chat-input::placeholder {
  color: #000000;
  opacity: 0.8;
}

.send-button {
  width: 80px;
  height: 33px;
  background-color: #00e8a6;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}
</style>
