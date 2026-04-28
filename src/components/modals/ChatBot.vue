<template>
  <Teleport to="body">
    <div v-if="modelValue" class="chatbot-overlay" @click.self="close">
      <div class="chatbot-container">
        <!-- Header -->
        <header class="chatbot-header">
          <img src="/assets/images/6a724b73fb2c46483c7c2b348fcdc144d1a30b46.png" alt="Bot Avatar" class="header-avatar">
          <h1 class="header-title">Selamat datang di<br>TRIVEX!</h1>
          <button class="close-btn" @click="close" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </header>

        <!-- Messages -->
        <div class="chatbot-messages" ref="chatBody">
          <div class="message bot-message">
            <img src="/assets/images/6a724b73fb2c46483c7c2b348fcdc144d1a30b46.png" alt="Bot Avatar" class="message-avatar">
            <div class="message-bubble">
              <p>Hai! Tanya saya dan saya akan menemukan jawabannya untuk Anda.</p>
            </div>
          </div>
          <div
            v-for="(message, index) in orderedMessages"
            :key="`msg-${index}`"
            :class="['message', message.type === 'incoming' ? 'bot-message' : 'user-message']"
          >
            <template v-if="message.type === 'incoming'">
              <img src="/assets/images/6a724b73fb2c46483c7c2b348fcdc144d1a30b46.png" alt="Bot Avatar" class="message-avatar">
              <div class="message-bubble">
                <p>{{ message.text }}</p>
              </div>
            </template>
            <template v-else>
              <div class="message-bubble user-bubble">
                <p>{{ message.text }}</p>
              </div>
            </template>
          </div>
        </div>

        <!-- Input -->
        <div class="chatbot-input-area">
          <input
            type="text"
            v-model="newMessage"
            class="chat-input"
            placeholder="Masukkan informasi..."
            @keyup.enter="sendMessage"
          >
          <button
            class="send-button"
            :disabled="!newMessage.trim() || isSending"
            @click="sendMessage"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onUnmounted, nextTick, watch } from 'vue'
import { supportAPI } from '@/services/api'

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
.chatbot-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(80, 80, 80, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.chatbot-container {
  width: 331px;
  height: 500px;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Inter', sans-serif;
}

/* Header */
.chatbot-header {
  height: 101px;
  background: linear-gradient(90deg, #507742 0%, #5F9659 100%);
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #ffffff;
  flex-shrink: 0;
  position: relative;
}

.header-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  margin-right: 16px;
  object-fit: cover;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  flex: 1;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Messages */
.chatbot-messages {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  background-color: #ffffff;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.bot-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.message-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.message-bubble {
  background-color: #ebebeb;
  padding: 12px 16px;
  border-radius: 4px;
  max-width: 75%;
}

.message-bubble p {
  margin: 0;
  font-size: 13px;
  color: #000000;
  line-height: 1.4;
}

.user-bubble {
  background-color: #d4e8d0;
}

/* Input */
.chatbot-input-area {
  height: 80px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  background-color: #ffffff;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  color: #000000;
  background: transparent;
  font-family: 'Inter', sans-serif;
}

.chat-input::placeholder {
  color: #666666;
}

.send-button {
  width: 80px;
  height: 33px;
  background: linear-gradient(90deg, #527B45 0%, #5D9156 100%);
  border-radius: 10px;
  border: none;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: inherit;
  transition: opacity 0.2s ease;
}

.send-button:hover {
  opacity: 0.9;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
