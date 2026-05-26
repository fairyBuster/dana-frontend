<!-- <template>
  <div class="currency-page">
   
    <div class="d-flex flex-row" style="padding: 10px;background: #f8f8f8;">
      <div style="padding: 0px; z-index: 10; position: relative;">
        <button @click="goBack" aria-label="Go back" style="background: none; border: none; cursor: pointer; padding: 0;">
          <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </div>
      <div class="d-flex flex-row justify-content-center align-items-center" style="padding: 0;width: 100%;">
        <p style="color: #000;font-weight: bold;margin-bottom: 0px;margin-right: 16px;">{{ $t('currency.title') }}</p>
      </div>
    </div>

   
    <div style="padding: 13px;">
      <div 
        v-for="currency in currencies" 
        :key="currency.code"
        class="d-flex justify-content-between align-items-center" 
        style="padding: 4px;padding-bottom: 15px;padding-top: 15px;border-bottom: 1px solid #ccc;"
        @click="selectCurrency(currency.code)"
      >
        <span style="color: #000; font-size: 16px;">{{ currency.code }}</span>
        <svg v-if="selectedCurrency === currency.code" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2196f3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    </div>

   
    <div class="d-flex justify-content-center" style="padding: 8px;margin-top: 9px;">
      <button 
        class="btn btn-primary" 
        type="button" 
        style="width: 100%;padding: 11px;font-weight: bold;font-size: 18px;border-radius: 12px;background: linear-gradient(#306fff 0%, #7aa2ff 98%);border-style: none;"
        @click="saveChanges"
        :disabled="isSaving"
      >
        {{ isSaving ? $t('common.loading') : $t('currency.saveChanges') }}
      </button>
    </div>

    <SuccessModal
      v-model="showSuccessModal"
      :title="$t('currency.success')"
      :message="$t('currency.successMessage')"
      :confirmText="$t('common.ok')"
      @confirm="showSuccessModal = false"
    />


    <ErrorModal
      v-model="showErrorModal"
      :title="$t('currency.error')"
      :message="errorMessage"
    />
  </div>
</template> -->

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SuccessModal from '../../components/modals/AppSuccessModal.vue'
import ErrorModal from '../../components/modals/AppErrorModal.vue'

const router = useRouter()
const { t } = useI18n()

const goBack = () => {
  router.push('/hn/home')
}

const selectedCurrency = ref('RP') // Default to Indonesian Rupiah
const isSaving = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

// Available currencies
const currencies = ref([
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'RP', name: 'Indonesian Rupiah' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'PHP', name: 'Philippine Peso' }
])

onMounted(() => {
  // Load saved currency from localStorage
  const savedCurrency = localStorage.getItem('selected_currency')
  if (savedCurrency) {
    selectedCurrency.value = savedCurrency
  }
})

const selectCurrency = (currencyCode) => {
  // If selecting anything other than RP, show notification
  if (currencyCode !== 'RP') {
    errorMessage.value = 'Region Anda tidak sesuai dengan mata uang pilihan'
    showErrorModal.value = true
    return
  }
  
  selectedCurrency.value = currencyCode
}

const saveChanges = async () => {
  isSaving.value = true
  errorMessage.value = ''
  
  try {
    // Save to localStorage
    localStorage.setItem('selected_currency', selectedCurrency.value)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    showSuccessModal.value = true
  } catch (error) {
    errorMessage.value = error.message || t('currency.errorMessage')
    showErrorModal.value = true
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.currency-page {
  min-height: 100vh;
  background-color: #f8f8f8;
}

/* Add hover effects for currency items */
.d-flex.justify-content-between.align-items-center {
  cursor: pointer;
  transition: background-color 0.2s;
}

.d-flex.justify-content-between.align-items-center:hover {
  background-color: #f8f8f8;
}

/* Prevent link default behavior */
.text-decoration-none {
  pointer-events: none;
}

/* Button hover effect */
.btn-primary:hover {
  background: linear-gradient(#2558e6 0%, #6b94f0 98%) !important;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Check icon styling */
.fas.fa-check {
  color: #28a745;
  font-size: 16px;
}
</style>
