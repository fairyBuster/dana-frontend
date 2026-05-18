<!-- <template>
  <section id="header-section">
    <div class="header-container">
        <button class="back-button" @click="goBack">
            <img src="/assets/images/2023_1661.svg" alt="Back" class="icon-back">
        </button>
        <h1 class="page-title">Ubah kata sandi</h1>
    </div>
  </section>
  <section id="form-section">
    <div class="form-container">
     
        <div class="input-group" style="border-bottom: 1px solid #ccc;">
            <div class="input-field">
                <input
                  v-model="formData.previousPassword"
                  type="password"
                  class="input-element"
                  placeholder="Isi kata sandi masuk sebelumnya"
                >
            </div>
        </div>

      
        <div class="input-group" style="border-bottom: 1px solid #ccc;">
            <div class="input-field">
                <input
                  v-model="formData.newPassword"
                  type="password"
                  class="input-element"
                  placeholder="Kata sandi terbaru"
                >
            </div>
        </div>

       
        <div class="input-group" style="border-bottom: 1px solid #ccc;">
            <div class="input-field">
                <input
                  v-model="formData.confirmPassword"
                  type="password"
                  class="input-element"
                  placeholder="Masukkan kata sandi konfirmasi Anda"
                >
            </div>
        </div>

       
        <div class="captcha-container">
            <CheckboxCaptcha ref="captchaRef" />
        </div>

 
        <button class="submit-button" @click="handleReset" :disabled="isLoading">
            <span class="button-text">Ubah kata sandi</span>
        </button>
    </div>
  </section>
  <section id="footer-section">
    <div class="footer-container">
        <p class="copyright-text">© 2026 OCRN Foundation. All rights reserved.</p>
    </div>
  </section>

  <ErrorModal
    v-model="showErrorModal"
    :message="generalError || 'Gagal mengubah kata sandi.'"
  />
  <SuccessModal
    v-model="showSuccessModal"
    :message="successMessage || 'Kata sandi berhasil diubah.'"
  />
</template> -->

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../../services/api'
import CheckboxCaptcha from '../../components/CheckboxCaptcha.vue'
import ErrorModal from '../../components/modals/AppErrorModal.vue'
import SuccessModal from '../../components/modals/AppSuccessModal.vue'

const router = useRouter()

const formData = reactive({
  previousPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const phone = ref('')
const isLoading = ref(false)
const generalError = ref('')
const successMessage = ref('')
const showErrorModal = ref(false)
const showSuccessModal = ref(false)
const captchaRef = ref(null)

const goBack = () => {
  router.go(-1)
}

onMounted(async () => {
  try {
    const response = await authAPI.getAccountInfo()
    if (response.data && response.data.phone) {
      phone.value = response.data.phone
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
  }
})

const validateForm = () => {
  if (!formData.previousPassword) {
    generalError.value = 'Kata sandi sebelumnya harus diisi'
    showErrorModal.value = true
    return false
  }
  
  if (!formData.newPassword) {
    generalError.value = 'Kata sandi baru harus diisi'
    showErrorModal.value = true
    return false
  }
  
  if (formData.newPassword.length < 6) {
    generalError.value = 'Kata sandi harus memiliki panjang minimal 6 karakter'
    showErrorModal.value = true
    return false
  }
  
  if (!formData.confirmPassword) {
    generalError.value = 'Konfirmasi kata sandi harus diisi'
    showErrorModal.value = true
    return false
  }
  
  if (formData.newPassword !== formData.confirmPassword) {
    generalError.value = 'Kata sandi baru tidak cocok dengan konfirmasi'
    showErrorModal.value = true
    return false
  }
  
  if (!captchaRef.value?.isVerified) {
    generalError.value = 'Silakan verifikasi bahwa Anda bukan robot'
    showErrorModal.value = true
    return false
  }
  
  return true
}

const handleReset = async () => {
  generalError.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true
  try {
    const payload = {
      old_password: formData.previousPassword,
      new_password: formData.newPassword
    }
    if (phone.value) {
      payload.phone = phone.value
    }
    
    await authAPI.resetPassword(payload)
    successMessage.value = 'Kata sandi berhasil diubah. Silakan masuk kembali.'
    showSuccessModal.value = true
    
    setTimeout(() => {
      router.push('/hn/console')
    }, 2000)
  } catch (error) {
    console.error('Change password error:', error.response?.data || error.message)
    
    if (error.response && error.response.data) {
      const errorData = error.response.data
      
      if (errorData.old_password) {
        generalError.value = Array.isArray(errorData.old_password) ? errorData.old_password[0] : errorData.old_password
      } else if (errorData.new_password) {
        generalError.value = Array.isArray(errorData.new_password) ? errorData.new_password[0] : errorData.new_password
      } else if (errorData.detail || errorData.message) {
        generalError.value = errorData.detail || errorData.message
      } else {
        generalError.value = 'Gagal mengubah kata sandi. Silakan coba lagi.'
      }
    } else {
      generalError.value = 'Terjadi kesalahan jaringan. Silakan coba lagi.'
    }
    
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    min-height: 100vh;
}

* {
    box-sizing: border-box;
}

img {
    max-width: 100%;
    display: block;
}

button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
}
/* CSS for section section:Header */
#header-section {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding-top: 22px;
        padding-bottom: 20px; /* Adjust spacing to next section */
    }

    .header-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 25px;
        padding: 0 12px;
    }

    .back-button {
        position: absolute;
        left: 12px;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-back {
        width: 24px;
        height: 24px;
    }

    .page-title {
        font-size: 16px; /* Estimated from context */
        font-weight: 600;
        color: #000000;
        margin: 0;
        line-height: 24px;
    }

/* CSS for section section:Form */
#form-section {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 0 12px; /* Based on x=12 positioning */
    }

    .form-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .input-group {
        width: 100%;
        max-width: 100%;
        margin-top: 20px; /* First input margin from header area */
    }

    /* Adjust margins for subsequent inputs */
    .input-group + .input-group {
        margin-top: 16px;
    }

    .input-field {
        width: 100%;
        height: 44px;
        border: none;
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: transparent;
    }

    .input-element {
        width: 100%;
        border: none;
        outline: none;
        font-size: 14px;
        background-color: transparent;
    }

    .placeholder-text {
        font-size: 14px; /* Estimated */
        color: rgba(0, 0, 0, 0.41);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .captcha-container {
        margin-top: 16px;
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .captcha-image {
        width: 210px;
        height: 110px;
        object-fit: contain;
    }

    .submit-button {
        margin-top: 0px;
        width: 100%;
        max-width: 379px;
        height: 52px;
        background-color: #7fabaa;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        transition: opacity 0.2s;
    }

    .submit-button:active {
        opacity: 0.9;
    }
    
    .submit-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .button-text {
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
    }

/* CSS for section section:Footer */
#footer-section {
        width: 100%;
        max-width: 412px;
        margin: 0 auto;
        padding-top: 30px;
        padding-bottom: 20px;
    }

    .footer-container {
        display: flex;
        justify-content: center;
        text-align: center;
        padding: 0 20px;
    }

    .copyright-text {
        color: #7fa586;
        font-size: 12px; /* Estimated */
        line-height: 24px;
        margin: 0;
    }
</style>


