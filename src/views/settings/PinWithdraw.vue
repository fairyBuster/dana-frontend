<!-- <template>
  <main>
    <section id="section-header">
      <div class="header-container">
        <div class="header-content">
          <img src="/assets/image/106_972.svg" alt="Back" class="back-icon" @click="router.back()">
          <h1 class="header-title">Kata sandi dagang</h1>
        </div>
      </div>
    </section>
    <section id="section-body">
      <div class="body-container">
        
       
        <div class="input-group" style="border-bottom: 1px solid #ccc;">
          <div class="input-box">
            <input 
              v-model="currentPin" 
              type="password" 
              maxlength="6"
              class="real-input"
              placeholder="Isi kata sandi perdagangan sebelumnya" 
            />
          </div>
        </div>

     
        <div class="input-group" style="border-bottom: 1px solid #ccc;">
          <div class="input-box">
            <input 
              v-model="newPin" 
              type="password" 
              maxlength="6"
              class="real-input"
              placeholder="Minimal 6 angka sandi baru" 
            />
          </div>
        </div>

      
        <div class="input-group" style="border-bottom: 1px solid #ccc;">
          <div class="input-box">
            <input 
              v-model="password" 
              type="password" 
              class="real-input"
              placeholder="Masukkan kata sandi login Anda" 
            />
          </div>
        </div>

     
        <div class="captcha-container">
          <CheckboxCaptcha ref="captchaRef" />
        </div>

    
        <button class="submit-btn" @click="handleSubmit" :disabled="loading">
          <span class="btn-text">{{ loading ? 'Memproses...' : 'Ubah kata sandi' }}</span>
        </button>

    
        <div class="footer-info">
          <p class="copyright-text">© 2026 OCRN Foundation. All rights reserved.</p>
        </div>

      </div>
    </section>
    
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
    <SuccessModal v-model="showSuccessModal" :message="successMessage" @close="router.back()" />
  </main>
</template> -->

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import CheckboxCaptcha from '@/components/CheckboxCaptcha.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'

const router = useRouter()

const currentPin = ref('')
const newPin = ref('')
const password = ref('')
const captchaRef = ref(null)

const loading = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')

const handleSubmit = async () => {
  if (!newPin.value || !password.value) {
    errorMessage.value = 'PIN baru dan Password Login wajib diisi'
    showErrorModal.value = true
    return
  }

  if (!captchaRef.value?.isVerified) {
    errorMessage.value = 'Silakan verifikasi bahwa Anda bukan robot'
    showErrorModal.value = true
    return
  }

  if (newPin.value.length !== 6 || isNaN(newPin.value)) {
    errorMessage.value = 'PIN harus terdiri dari 6 angka'
    showErrorModal.value = true
    return
  }

  loading.value = true
  try {
    const payload = {
      pin: newPin.value,
      current_pin: currentPin.value,
      password: password.value
    }
    
    await authAPI.setWithdrawPin(payload)
    
    successMessage.value = 'PIN trading berhasil diubah'
    showSuccessModal.value = true
  } catch (error) {
    console.error('Failed to set PIN:', error)
    const apiError = error?.response?.data || error?.message || 'Gagal mengubah PIN'
    if (apiError && typeof apiError === 'object' && Array.isArray(apiError.password)) {
      errorMessage.value = 'Kata sandi masuk Anda tidak sesuai.'
    } else if (typeof apiError === 'string') {
      errorMessage.value = apiError
    } else {
      errorMessage.value = apiError.message || 'Gagal mengubah PIN'
    }
    showErrorModal.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
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

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}
/* CSS for section section:Header */
#section-header {
  width: 100%;
  max-width: 100%;
  background-color: #dbe2d9; /* style_4 */
  position: relative;
  z-index: 10;
}

.header-container {
  height: 54px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.back-icon {
  width: 24px;
  height: 24px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000; /* style_5 */
  margin: 0;
  line-height: 24px;
}

/* CSS for section section:Body */
#section-body {
  width: 100%;
  max-width: 100%;
  background-color: #ffffff; /* style_1 */
  min-height: calc(100vh - 54px);
  padding-bottom: 40px;
}

.body-container {
  padding: 69px 16px 0 16px; /* Top padding calculated from Y position 123px - 54px header */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group {
  width: 100%;
  max-width: 100%;
  margin-bottom: 16px; /* Calculated gap */
}

.input-box {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 10px; /* style_2 */
  border: none; /* style_2 */
  border-radius: 0px; /* style_2 */
 
}

.input-box .real-input {
  outline: none;
  border: none;
  width: 100%;
}

.placeholder-text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.41); /* style_3 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.captcha-container {
  width: 100%;
  max-width: 379px;
  display: flex;
  justify-content: center; /* Centered based on visual layout */
  margin-bottom: 31px; /* Calculated gap */
}

.captcha-image {
  width: 154px;
  height: 57px;
  object-fit: cover;
  /* Image transform from JSON is complex, using cover for best fit */
}

.submit-btn {
  width: 100%;
  max-width: 379px;
  height: 52px;
  background-color: #7fabaa; /* style_7 */
  border-radius: 10px; /* style_7 */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25); /* style_7 */
  margin-bottom: 50px; /* Calculated gap */
  transition: opacity 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}

.btn-text {
  color: #ffffff; /* style_8 */
  font-size: 16px;
  font-weight: 700;
}

.footer-info {
  width: 100%;
  text-align: center;
}

.copyright-text {
  color: #7fa586; /* style_10 */
  font-size: 12px;
  margin: 0;
  line-height: 1.5;
}
</style>
