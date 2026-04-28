<!-- <template>
  <div class="app-container">
    <section id="header-section">
      <div class="app-header">
        <button class="back-button" @click="goBack">
          <img src="/assets/images/2023_1661.svg" alt="Back" width="41" height="41">
        </button>
        <h1 class="page-title">Pengaturan personal</h1>
      </div>
    </section>
    
    <section id="profile-list-section">
      <div class="profile-content">
        <h2 class="section-title">Informasi Pribadi</h2>
        
        <div class="info-group">
          <span class="label">Username</span>
          <span class="value">{{ userInfo.username || '' }}</span>
        </div>

        <div class="info-group">
          <span class="label">Handphone</span>
          <span class="value">{{ userInfo.phone || '000' }}</span>
        </div>

        <div class="info-group">
          <span class="label">Kontak pengundang saya</span>
          <span class="value">{{ userInfo.referral_by_phone || '000' }}</span>
        </div>

        <div class="info-group">
          <span class="label">Email</span>
          <span class="value">{{ userInfo.email || '' }}</span>
        </div>

        <div class="info-group">
          <span class="label">Tanggal registrasi</span>
          <span class="value">{{ formattedRegistrationDate || '' }}</span>
        </div>
      </div>
    </section>
  </div>
</template> -->

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../../services/api'

const router = useRouter()

// User information
const userInfo = ref({
  phone: '',
  referral_by_phone: '',
  root_parent_phone: '',
  username: '',
  email: '',
  registration_date: ''
})

const formattedRegistrationDate = ref('')

const isLoading = ref(false)
const errorMessage = ref('')

// Format registration date to the required format
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  
  // Format as "(GMT+07:00) DD/MM/YYYY HH:MM"
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `(GMT+07:00) ${day}/${month}/${year} ${hours}:${minutes}`
}

// Fetch user account info
const fetchAccountInfo = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await authAPI.getAccountInfo()
    userInfo.value = response.data
    
    // Format the registration date
    if (response.data.created_at || response.data.registration_date) {
      formattedRegistrationDate.value = formatDate(response.data.created_at || response.data.registration_date)
    }
  } catch (error) {
    console.error('Error fetching account info:', error)
    errorMessage.value = 'Gagal mengambil informasi perangkat'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  fetchAccountInfo()
})

// Define props and emits if needed
// defineProps({})
// defineEmits([])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #0d0920;
  font-family: 'Merriweather', serif;
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

.app-container {
  max-width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background-color: #0d0920;
  overflow-x: hidden;
}
/* CSS for section section:Header */
#header-section {
    padding-top: 10px;
    padding-bottom: 20px;
    position: relative;
    z-index: 10;
  }

  .app-header {
    display: flex;
    align-items: center;
    position: relative;
    height: 41px;
    padding: 0px; /* Matches group x position */
  }

  .back-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    position: absolute;
    left: 0px; /* Group x(4) + Chevron x(4) */
    top: 0;
  }

  .page-title {
    flex: 1;
    text-align: center;
    font-size: 18px; /* Estimated from height 23px */
    font-weight: 700;
    margin: 0;
    color: #ffffff;
    /* Visual adjustment to match design centering */
    padding-left: 40px; 
    padding-right: 40px;
  }

/* CSS for section section:ProfileList */
#profile-list-section {
    padding-left: 14px; /* Matches Frame 24 x position */
    padding-right: 14px;
    padding-top: 43px; /* Gap between header bottom and content start (100 - 57) */
  }

  .profile-content {
    display: flex;
    flex-direction: column;
    gap: 7px; /* Matches itemSpacing */
    width: 100%;
  }

  .section-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 0 0; /* Extra spacing handled by gap if needed, but design shows uniform gap */
    color: #ffffff;
  }

  /* Since the design uses a flat list with 7px gap everywhere, 
     we treat labels and values as individual items in the flex container 
     or group them. The JSON structure was flat, but semantic HTML prefers grouping.
     However, to strictly adhere to the visual spacing of 7px between EVERYTHING: */
  
  .info-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .label {
    font-size: 14px;
    color: #b7b7b7; /* style_5 */
    line-height: 20px;
  }

  .value {
    font-size: 14px;
    color: #ffffff; /* style_2 */
    line-height: 20px;
  }
</style>
