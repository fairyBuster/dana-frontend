<!-- <template>
  <main class="avatar-page">
    <div class="container">
      <header class="page-header">
        <a href="/settings" class="back-link" aria-label="Go back">
          <img src="/assets/images/2023_1661.svg" alt="Back" class="back-arrow" />
        </a>
        <h1 class="page-title">Avatar</h1>
      </header>

      <section class="current-avatar-section">
        <img
          :src="selectedAvatar || defaultAvatar"
          alt="Current user avatar"
          class="current-avatar-image"
        />
        <div class="current-avatar-info">
          <p class="info-label">Current avatar</p>
          <p class="info-date">{{ lastUpdatedText }}</p>
        </div>
      </section>

      <section class="avatar-selection-section">
        <div class="avatar-grid">
          <button
            v-for="option in avatarOptions"
            :key="option.value"
            type="button"
            class="avatar-button"
            :class="{ active: isSelected(option.value) }"
            @click="selectAvatar(option.value)"
            :aria-pressed="isSelected(option.value)"
          >
            <img :src="option.src" :alt="option.alt" class="avatar-option" />
          </button>
        </div>
      </section>

      <button
        type="button"
        class="change-button"
        :disabled="isSaving || disabledSave"
        @click="handleSave"
      >
        {{ isSaving ? 'Processing...' : 'Change' }}
      </button>
    </div>

    <SuccessModal
      v-model="showSuccessModal"
      title="Avatar updated"
      :message="successMessage || 'Your avatar has been updated successfully.'"
      @confirm="handleSuccessConfirm"
    />

    <ErrorModal
      v-model="showErrorModal"
      title="Update failed"
      :message="errorMessage || 'Failed to update avatar. Please try again.'"
    />
  </main>
</template> -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../../services/api'
import SuccessModal from '../../components/modals/SuccessModal.vue'
import ErrorModal from '../../components/modals/ErrorModal.vue'

const router = useRouter()

const defaultAvatar = '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png'
const avatarOptions = [
  {
    value: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    src: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    alt: 'Duck avatar'
  },
  {
    value: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    src: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    alt: 'Penguin avatar'
  },
  {
    value: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    src: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    alt: 'Pig avatar'
  },
  {
    value: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    src: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    alt: 'Rabbit avatar'
  },
  {
    value: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    src: '/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png',
    alt: 'Bear avatar'
  },
  {
    value: defaultAvatar,
    src: defaultAvatar,
    alt: 'Default avatar'
  }
]

const userInfo = ref(null)
const originalAvatar = ref('')
const selectedAvatar = ref('')
const lastUpdated = ref('')

const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const showSuccessModal = ref(false)
const showErrorModal = ref(false)

const disabledSave = computed(() => {
  if (!selectedAvatar.value) return true
  return selectedAvatar.value === originalAvatar.value
})

const lastUpdatedText = computed(() => {
  if (!lastUpdated.value) return 'Last update —'
  const date = new Date(lastUpdated.value)
  if (Number.isNaN(date.getTime())) return 'Last update —'
  return `Last update ${date.toLocaleDateString('en-GB')}`
})

const goBack = () => {
  router.back()
}

const isSelected = (value) => selectedAvatar.value === value

const selectAvatar = (value) => {
  selectedAvatar.value = value
}

const handleSuccessConfirm = () => {
  showSuccessModal.value = false
  goBack()
}

const fetchAccountInfo = async () => {
  try {
    const response = await authAPI.getAccountInfo()
    userInfo.value = response.data
    originalAvatar.value = response.data?.avatar || defaultAvatar
    selectedAvatar.value = originalAvatar.value
    lastUpdated.value = response.data?.avatar_updated_at || response.data?.updated_at || ''
  } catch (error) {
    console.error('Error fetching account info:', error)
    errorMessage.value = 'Failed to load avatar info.'
    showErrorModal.value = true
  }
}

const handleSave = async () => {
  if (disabledSave.value || isSaving.value) return
  isSaving.value = true
  errorMessage.value = ''

  try {
    await authAPI.updateProfile({
      avatar: selectedAvatar.value
    })

    successMessage.value = 'Avatar updated successfully.'
    showSuccessModal.value = true
    originalAvatar.value = selectedAvatar.value
    lastUpdated.value = new Date().toISOString()

    // Persist and broadcast avatar change so other pages update immediately
    try {
      localStorage.setItem('user_avatar', selectedAvatar.value)
      window.dispatchEvent(new CustomEvent('user-avatar-updated', {
        detail: { avatar: selectedAvatar.value }
      }))
    } catch (_) {}
  } catch (error) {
    console.error('Error updating avatar:', error)

    if (error.response) {
      if (error.response.status === 400) {
        errorMessage.value = error.response.data?.avatar?.[0] || 'Invalid avatar selection.'
      } else if (error.response.status === 401) {
        errorMessage.value = 'Session expired. Please login again.'
      } else {
        errorMessage.value = 'Failed to update avatar.'
      }
    } else if (error.request) {
      errorMessage.value = 'Network error. Please check your connection.'
    } else {
      errorMessage.value = 'Unexpected error occurred.'
    }

    showErrorModal.value = true
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchAccountInfo()
})
</script>

<style scoped>

* {
  box-sizing: border-box;
}

.avatar-page {
  min-height: 100vh;
  background-color: #e6eaf4;
  background-image: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  font-family: 'Phetsarath', sans-serif;
}

.container {
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  padding: 14px 16px 0;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 23px;
  height: 22px;
}

.back-link {
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.back-arrow {
  width: 20px;
  height: 20px;
}

.page-title {
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
  margin: 0;
}

.current-avatar-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 17px;
  padding-left: 7px;
}

.current-avatar-image {
  width: 51px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.current-avatar-info {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-weight: 700;
  font-size: 13px;
  line-height: 1.45;
  color: #000000;
  margin: 0;
}

.info-date {
  font-weight: 700;
  font-size: 11px;
  line-height: 1.45;
  color: rgba(0, 0, 0, 0.38);
  margin: 0;
}

.avatar-selection-section {
  background-color: rgba(255, 255, 255, 0.47);
  border-radius: 5px;
  padding: 10px 5px;
  margin-bottom: 15px;
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px 12px;
  justify-content: flex-start;
}

.avatar-button {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.avatar-button::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.avatar-button:hover {
  transform: translateY(-2px);
}

.avatar-button.active::after {
  border-color: #619dec;
}

.avatar-option {
  width: 58px;
  height: 58px;
  object-fit: cover;
  border-radius: 50%;
}

.change-button {
  background-color: #619dec;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  line-height: 30px;
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  width: 100%;
  cursor: pointer;
  margin-top: 40px;
  margin-bottom: 15px;
  transition: opacity 0.3s ease, background-color 0.3s ease;
}

.change-button:hover:not(:disabled) {
  background-color: #528bd0;
}

.change-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 390px) {
  .container {
    padding: 14px 4.1% 0;
  }
}
</style>

