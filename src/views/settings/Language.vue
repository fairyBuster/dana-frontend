<!-- <template>
  <section class="language-selection-screen">
    <header class="language-header">
      <a href="javascript:void(0)" @click.prevent="goBack" class="back-button">
        <img src="/assets/images/2023_1661.svg" alt="Back">
      </a>
      <h1 class="header-title">{{ $t('language.title') || 'Language' }}</h1>
    </header>

    <main class="language-list-container">
      <img 
        class="checkmark" 
        src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" 
        alt="Selected"
        :style="{ top: getCheckmarkTop() + 'px' }"
      >
      <ul class="language-list">
        <li 
          v-for="(lang, index) in languages" 
          :key="lang.code"
          class="language-item"
          :class="{ 'selected': selectedLanguage === lang.code }"
          @click="selectLanguage(lang.code)"
        >
          <img class="flag" :src="lang.flag" :alt="lang.flagAlt">
          <span class="language-name" :class="{ 'hindi-text': lang.code === 'hi' }">
            {{ lang.name }}
          </span>
        </li>
      </ul>
    </main>

    <div class="actions-container">
      <button
        class="set-language-btn"
        :disabled="selectedLanguage === originalLanguage"
        @click="saveLanguage()"
      >
        {{ $t('language.setButton') || 'Set Language' }}
      </button>
    </div>


    <SuccessModal
      v-model="showSuccessModal"
      :title="$t('language.success') || 'Success'"
      :message="$t('language.languageChanged') || 'Language changed successfully'"
      :confirmText="$t('common.ok') || 'OK'"
    />

    <ErrorModal
      v-model="showErrorModal"
      :title="$t('language.error') || 'Error'"
      :message="errorMessage"
    />
  </section>
</template> -->

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLanguage } from '../../i18n'
import SuccessModal from '../../components/modals/SuccessModal.vue'
import ErrorModal from '../../components/modals/ErrorModal.vue'

const router = useRouter()
const { locale, t: $t } = useI18n()

const selectedLanguage = ref('en')
const originalLanguage = ref('en')
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Available languages with their flags
const languages = ref([
  {
    code: 'en',
    name: 'English',
    flag: 'https://flagcdn.com/w40/gb.png',
    flagAlt: 'Flag of United Kingdom'
  },
  {
    code: 'zh',
    name: '中文',
    flag: 'https://flagcdn.com/w40/cn.png',
    flagAlt: 'Flag of China'
  },
  {
    code: 'hi',
    name: 'हिंदी',
    flag: 'https://flagcdn.com/w40/in.png',
    flagAlt: 'Flag of India'
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: 'https://flagcdn.com/w40/vn.png',
    flagAlt: 'Flag of Vietnam'
  },
  {
    code: 'id',
    name: 'Indonesia',
    flag: 'https://flagcdn.com/w40/id.png',
    flagAlt: 'Flag of Indonesia'
  }
])

const goBack = () => {
  router.go(-1)
}

const selectLanguage = (langCode) => {
  // Hanya pilih bahasa; penerapan dilakukan saat tombol ditekan
  selectedLanguage.value = langCode
  const supportedLanguages = ['id', 'zh', 'en', 'hi', 'vi']
  if (!supportedLanguages.includes(langCode)) {
    errorMessage.value = `${languages.value.find(l => l.code === langCode)?.name || 'This language'} is not yet fully supported`
    showErrorModal.value = true
  }
}

const saveLanguage = async (langCode = null) => {
  const langToSave = langCode || selectedLanguage.value
  
  // Only save if language is supported
  const supportedLanguages = ['id', 'zh', 'en', 'hi', 'vi']
  
  if (!supportedLanguages.includes(langToSave)) {
    // Fallback to English for unsupported languages
    localStorage.setItem('user_language', 'en')
    setLanguage('en')
    locale.value = 'en'
    showSuccessModal.value = true
    originalLanguage.value = 'en'
    return
  }
  
  try {
    const previousLang = originalLanguage.value
    // Use the setLanguage function to update language everywhere
    const success = setLanguage(langToSave)
    
    if (!success) {
      throw new Error('Failed to set language')
    }
    // Sinkronkan locale
    locale.value = langToSave
    
    // Show success modal only if language actually changed
    if (previousLang !== langToSave) {
      showSuccessModal.value = true
    }
    // Update original language reference
    originalLanguage.value = langToSave
  } catch (err) {
    errorMessage.value = $t('language.saveError') || 'Failed to save language preference'
    showErrorModal.value = true
  }
}

// Calculate checkmark position based on selected language
const getCheckmarkTop = () => {
  const selectedIndex = languages.value.findIndex(lang => lang.code === selectedLanguage.value)
  if (selectedIndex === -1) return 24
  
  // Each item is ~51px tall, padding 16px top, checkmark is 18px tall
  // Position: item padding (16px) + (item height - checkmark height) / 2
  return 16 + (selectedIndex * 51) + (51 - 18) / 2
}

onMounted(() => {
  // Load saved language from localStorage or use current locale
  const savedLang = localStorage.getItem('user_language') || locale.value || 'en'
  
  // Map zh to supported language or use id as fallback
  let mappedLang = savedLang
  if (savedLang === 'zh') {
    mappedLang = 'zh'
  } else if (!['id', 'en', 'hi', 'vi', 'zh'].includes(savedLang)) {
    mappedLang = 'en' // Default to English
  }
  
  selectedLanguage.value = mappedLang
  originalLanguage.value = mappedLang
  
  // Ensure i18n locale is in sync with selected language
  if (!localStorage.getItem('user_language')) {
    // Default pertama kali ke English tanpa auto-apply sampai user klik tombol
    selectedLanguage.value = 'en'
    originalLanguage.value = 'en'
  }
})
</script>

<style scoped>
/* removed Lato import */

* {
  box-sizing: border-box;
}

.language-selection-screen {
  max-width: 100%;
  min-height: 100vh;
  margin: 0;
  background-image: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 12px 0px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Phetsarath', sans-serif;
}

.language-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0px;
  margin-bottom: 20px;
  height: 30px;
}

.back-button {
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
}

.back-button img {
  width: 100%;
  height: 100%;
}

.header-title {
  color: #000000;
  font-family: 'Phetsarath', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  margin: 0;
}

.language-list-container {
  position: relative;
  background-color: rgba(255, 255, 255, 0.47);
  border: 1px solid #ffffff;
  border-radius: 5px;
  margin: 0 8px;
  padding: 0 16px;
}

.checkmark {
  position: absolute;
  width: 18px;
  height: 18px;
  top: 24px;
  right: 16px;
  transition: top 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

.language-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.language-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.language-item:last-child {
  border-bottom: none;
}

.language-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.language-item.selected {
  background-color: rgba(255, 255, 255, 0.1);
}

.flag {
  width: 28px;
  height: 20px;
  border-radius: 2px;
  object-fit: cover;
  flex-shrink: 0;
}

.language-name {
  color: #000000;
  font-family: 'Phetsarath', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 1.2;
  flex-grow: 1;
}

.hindi-text {
  font-weight: 600;
}

.actions-container {
  padding: 16px 16px 0 16px;
}

.set-language-btn {
  width: 100%;
  height: 40px;
  background: #62A1FF;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-family: 'Phetsarath', sans-serif;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.set-language-btn:hover {
  background: #4f8ef0;
}

.set-language-btn:disabled {
  background: #A7C7FF;
  cursor: not-allowed;
  opacity: 0.9;
}

@media (max-width: 390px) {
  .language-selection-screen {
    min-height: 100vh;
    border-radius: 0;
    padding: 12px 10px;
  }
}
</style>
