<!-- <template>
  <div class="help-page">
    
    <section id="section-header">
      <div class="main-container">
        <header class="site-header">
          <div class="header-left">
            <img src="/assets/images/2023_1661.svg" alt="Back" class="icon-back" @click="goBack">
          </div>
          <h1 class="page-title">Help Center</h1>
          <div class="header-right"></div>
        </header>
      </div>
    </section>


    <section id="section-faq">
      <div class="main-container">
        
        
        <div class="card">
          <div class="card-header">
            <img src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="User Icon" class="card-icon">
            <span class="card-title">Akun dan Akses</span>
          </div>
          <div class="card-divider"></div>
          <div class="card-question-row" @click="toggleCard(0)">
            <span class="card-question">Bagaimana cara membuat akun?</span>
            <img src="/assets/images/2038_161.svg" alt="Toggle" :class="['card-arrow', { open: openCards[0] }]">
          </div>
          <div v-show="openCards[0]" class="card-body">
            Anda dapat membuat akun melalui halaman pendaftaran dengan mengisi data yang diperlukan seperti nomor ponsel atau email. Setelah itu, ikuti langkah yang tersedia untuk menyelesaikan proses registrasi dan verifikasi.
          </div>
        </div>

     
        <div class="card">
          <div class="card-header">
            <img src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Drone Icon" class="card-icon">
            <span class="card-title">Penggunaan Layanan</span>
          </div>
          <div class="card-divider"></div>
          <div class="card-question-row" @click="toggleCard(1)">
            <span class="card-question">Bagaimana SENT bekerja?</span>
            <img src="/assets/images/2038_161.svg" alt="Toggle" :class="['card-arrow', { open: openCards[1] }]">
          </div>
          <div v-show="openCards[1]" class="card-body">
            OT-SENT menggunakan sistem drone dan teknologi berbasis kecerdasan buatan untuk mengumpulkan dan mengolah data udara. Data tersebut kemudian ditampilkan dalam bentuk visualisasi yang dapat digunakan untuk monitoring dan analisis secara real-time.
          </div>
        </div>

    
        <div class="card">
          <div class="card-header">
            <img src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Chart Icon" class="card-icon">
            <span class="card-title">Data dan Monitoring</span>
          </div>
          <div class="card-divider"></div>
          <div class="card-question-row" @click="toggleCard(2)">
            <span class="card-question">Apa itu monitoring real-time?</span>
            <img src="/assets/images/2038_161.svg" alt="Toggle" :class="['card-arrow', { open: openCards[2] }]">
          </div>
          <div v-show="openCards[2]" class="card-body">
            Monitoring real-time adalah proses pemantauan data secara langsung saat sistem berjalan. Dengan fitur ini, pengguna dapat melihat hasil pemetaan dan perubahan data secara cepat tanpa perlu menunggu proses manual.
          </div>
        </div>

      </div>
    </section>

  
    <section id="section-contact">
      <div class="main-container">
        <div class="contact-wrapper">
          <h2 class="contact-title">Masih membutuhkan bantuan?</h2>
          <p class="contact-subtitle">Hubungi tim kami untuk mendapatkan bantuan lebih lanjut.</p>
          <a href="#" class="btn-primary" @click.prevent="openChat">Hubungi Tim Dukungan</a>
        </div>
      </div>
    </section>

   
    <teleport to="body">
      <div v-if="chatOpen" class="chat-modal-overlay" @click.self="closeChat">
        <div class="chat-modal">
          <header class="chat-header">
            <div class="chat-header-left">
              <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Logo" class="chat-logo">
              <span class="chat-status">Support Online</span>
            </div>
            <button class="chat-close" @click="closeChat">×</button>
          </header>

          <div ref="messageContainer" class="chat-messages">
            <div v-for="(msg, idx) in messages" :key="idx" :class="['message-row', msg.sender === 'user' ? 'user' : 'bot']">
              <div class="message-bubble">
                <p>{{ msg.text }}</p>
                <span class="message-time">{{ msg.time }}</span>
              </div>
            </div>
            <div v-if="isTyping" class="message-row bot">
              <div class="message-bubble typing">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
            </div>
          </div>

          <form class="chat-input-area" @submit.prevent="sendMessage">
            <input 
              v-model="newMessage" 
              type="text" 
              placeholder="Ketik pesan..." 
              :disabled="isSending"
            >
            <button type="submit" :disabled="!newMessage.trim() || isSending">
              <img src="/assets/images/2039_205.svg" alt="Send" class="send-icon">
            </button>
          </form>
        </div>
      </div>
    </teleport>

   
    <section id="section-footer">
      <div class="main-container">
        <div class="footer-content">
          <p class="footer-text">Ditenagai oleh teknologi kecerdasan buatan untuk analisis udara.</p>
          <div class="footer-logo-row">
            <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Logo" class="footer-logo">
            <span class="copyright">© 2026 OT-SENT. All Rights Reserved</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template> -->

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { supportAPI } from '@/services/api'

const router = useRouter()
const openCards = ref([false, false, false])

// Chat state
const chatOpen = ref(false)
const messages = ref([])
const newMessage = ref('')
const isSending = ref(false)
const isTyping = ref(false)
const messageContainer = ref(null)
let chatStream = null

const goBack = () => {
  router.go(-1)
}

const toggleCard = (index) => {
  openCards.value[index] = !openCards.value[index]
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

const openChat = async () => {
  chatOpen.value = true
  isSending.value = true
  isTyping.value = false
  await scrollToBottom()
}

const closeChat = () => {
  chatOpen.value = false
  if (chatStream) {
    chatStream.abort()
    chatStream = null
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isSending.value) return
  
  const text = newMessage.value.trim()
  newMessage.value = ''
  isSending.value = true
  
  // Tambah ke UI lokal dulu
  messages.value.push({
    text,
    sender: 'user',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  await scrollToBottom()
  
  try {
    isTyping.value = true
    await supportAPI.sendChatMessage({ message: text })
  } catch (err) {
    console.error('Failed to send message:', err)
    isTyping.value = false
  } finally {
    isSending.value = false
  }
}

onBeforeUnmount(() => {
  if (chatStream) {
    chatStream.abort()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.help-page {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0f0b2e;
  background-image: none;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center top;
  background-attachment: fixed;
  color: #ffffff;
  min-height: 100vh;
  width: 100%;
}

* {
  box-sizing: border-box;
}

.main-container {
  width: 100%;
  max-width: 412px;
  position: relative;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
}

img {
  display: block;
  max-width: 100%;
}

/* Header Section */
#section-header {
  padding-top: 13px;
  padding-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.icon-back {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  text-align: center;
  flex-grow: 1;
  margin-right: 24px;
}

/* FAQ Section */
#section-faq {
  width: 100%;
  display: flex;
  justify-content: center;
}

.card {
  background: linear-gradient(180deg, rgba(15, 11, 46, 1) 0%, rgba(43, 27, 111, 1) 100%);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: inset 0px 4px 30px 0px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 24px;
  height: 24px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.card-divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 12px 0;
}

.card-question-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.card-question {
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.card-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.card-arrow.open {
  transform: rotate(180deg);
}

.card-body {
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #a6a6a6;
}

/* Contact Section */
#section-contact {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.contact-wrapper {
  width: 100%;
  text-align: center;
}

.contact-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.contact-subtitle {
  font-size: 12px;
  color: #ffffff;
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.btn-primary {
  display: inline-block;
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30%, #9047E0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
}

/* Footer Section */
#section-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 150px;
  padding-bottom: 40px;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.footer-text {
  font-size: 12px;
  color: #c4c4c4;
  margin: 0 0 12px 0;
}

.footer-logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-logo {
  width: 90px;
  height: 37px;
  object-fit: contain;
}

.copyright {
  font-size: 12px;
  color: #ffffff;
}

/* Chat Modal Styles */
.chat-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.chat-modal {
  width: 100%;
  max-width: 412px;
  height: 80vh;
  background: #1d2138;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-header {
  padding: 16px;
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30.77%, #9047E0 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-logo {
  height: 24px;
  width: auto;
}

.chat-status {
  font-size: 14px;
  font-weight: 600;
}

.chat-close {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 28px;
  cursor: pointer;
  line-height: 1;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #0f0b2e;
}

.message-row {
  display: flex;
  width: 100%;
}

.message-row.user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  position: relative;
  font-size: 14px;
  line-height: 1.4;
}

.message-row.bot .message-bubble {
  background: #1d2138;
  color: #ffffff;
  border-bottom-left-radius: 2px;
}

.message-row.user .message-bubble {
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 100%);
  color: #ffffff;
  border-bottom-right-radius: 2px;
}

.message-time {
  font-size: 10px;
  opacity: 0.6;
  display: block;
  margin-top: 4px;
  text-align: right;
}

.chat-input-area {
  padding: 12px 16px;
  background: #1d2138;
  display: flex;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-input-area input {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 16px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

.chat-input-area button {
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 100%);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;
}

.chat-input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  width: 20px;
  height: 20px;
}

/* Typing indicator */
.typing {
  display: flex;
  gap: 4px;
  padding: 12px 16px !important;
}

.dot {
  width: 6px;
  height: 6px;
  background: #746a9a;
  border-radius: 50%;
  animation: typing 1s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>
