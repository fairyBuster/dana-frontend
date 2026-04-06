<!-- <template>
  <section class="app-container">
    <header class="top-bar">
      <button class="back-button" @click="goBack">
        <img src="/assets/img/77_296.svg" alt="Back" width="41" height="41">
      </button>
      <h1 class="page-title">Alamat pengiriman</h1>
    </header>

    <div class="content-wrapper">
     <LoadingSpinner v-if="isLoading" :visible="true" :overlay="true" :size="30" :color="'ffffff'" message="" />
      
      <div v-else-if="hasAddress" class="has-address">
        <div class="address-card">
          <div class="card-icon">
            <img src="/assets/img/4310389286c91e41a02a1dd295ce480036049eb6.png" alt="Location Pin">
          </div>
          <div class="card-details">
            <div class="user-name">{{ primaryAddress.recipient_name || '-' }}</div>
            <div class="user-phone">{{ primaryAddress.phone_number || '-' }}</div>
            <div class="user-address">{{ primaryAddress.address_details || '-' }}</div>
          </div>
        </div>

        <p class="helper-text">
          Untuk mengubah alamat, harap hubungi layanan pelanggan.
        </p>
      </div>

      <form v-else class="address-form" @submit.prevent="saveAddress">
        <div class="form-group">
          <label class="form-label">Nama lengkap</label>
          <div class="input-wrapper">
            <img src="/assets/img/4310389286c91e41a02a1dd295ce480036049eb6.png" alt="Icon" class="input-icon">
            <input type="text" class="form-input" placeholder="Silakan masukkan nama Anda" v-model="form.recipientName">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nomor telepon</label>
          <div class="input-wrapper">
            <img src="/assets/img/4310389286c91e41a02a1dd295ce480036049eb6.png" alt="Icon" class="input-icon">
            <input type="tel" class="form-input" placeholder="Silakan masukkan nomor telepon Anda" v-model="form.phone">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Provinsi, Kota, Kecamatan, Kode pos</label>
          <div class="input-wrapper">
            <img src="/assets/img/4310389286c91e41a02a1dd295ce480036049eb6.png" alt="Icon" class="input-icon">
            <input type="text" class="form-input" placeholder="Silakan masukkan alamat lengkap" v-model="form.region">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nama, Jalan, Gedung, No. Rumah</label>
          <div class="input-wrapper">
            <img src="/assets/img/4310389286c91e41a02a1dd295ce480036049eb6.png" alt="Icon" class="input-icon">
            <input type="text" class="form-input" placeholder="Silakan masukkan alamat lengkap" v-model="form.addressLine">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Nomor rumah</label>
          <div class="input-wrapper">
            <img src="/assets/img/4310389286c91e41a02a1dd295ce480036049eb6.png" alt="Icon" class="input-icon">
            <input type="text" class="form-input" placeholder="Contoh: 12A" v-model="form.houseNumber">
          </div>
        </div>

        <div class="checkbox-row">
          <input id="isPrimary" type="checkbox" class="checkbox" v-model="form.isPrimary">
          <label for="isPrimary" class="checkbox-label">Jadikan alamat utama</label>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Tinjauan' : 'kirim' }}
          </button>
        </div>

        <p class="form-note">Pastikan alamat sudah benar sebelum disimpan.</p>
      </form>
    </div>

    <SuccessModal v-model="showSuccessModal" :message="successMessage" />
    <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  </section>
</template> -->

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import SuccessModal from '../../components/modals/SuccessModal.vue'
import ErrorModal from '../../components/modals/ErrorModal.vue'
import LoadingSpinner from '../../components/partials/LoadingSpinner.vue'

const router = useRouter()

const form = ref({
  recipientName: '',
  phone: '',
  region: '',
  addressLine: '',
  houseNumber: '',
  isPrimary: false
})

const isSubmitting = ref(false)
const isLoading = ref(true)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const hasAddress = ref(false)
const addresses = ref([])

const primaryAddress = computed(() => {
  const list = Array.isArray(addresses.value) ? addresses.value : []
  const primary = list.find((a) => a && a.is_primary)
  return primary || list[0] || {}
})

const goBack = () => {
  router.go(-1)
}

const fetchAddresses = async () => {
  isLoading.value = true
  try {
    const resp = await authAPI.getAddresses()
    console.log('Address response:', resp)
    const data = resp?.data
    
    let list = []
    if (Array.isArray(data)) {
      list = data
    } else if (Array.isArray(data?.results)) {
      list = data.results
    } else if (data && typeof data === 'object' && (data.id || data.recipient_name)) {
      list = [data]
    }
    
    addresses.value = list
    hasAddress.value = list.length > 0
  } catch (err) {
    console.error('Fetch address error:', err)
    addresses.value = []
    hasAddress.value = false
    // Optional: Show error only if strictly needed, or just let empty state show
    // showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

const saveAddress = async () => {
  if (!form.value.recipientName.trim()) {
    errorMessage.value = 'Nama lengkap wajib diisi'
    showErrorModal.value = true
    return
  }
  if (!form.value.phone.trim()) {
    errorMessage.value = 'Nomor telepon wajib diisi'
    showErrorModal.value = true
    return
  }
  if (!form.value.region.trim()) {
    errorMessage.value = 'Alamat wilayah wajib diisi'
    showErrorModal.value = true
    return
  }
  if (!form.value.addressLine.trim()) {
    errorMessage.value = 'Alamat detail wajib diisi'
    showErrorModal.value = true
    return
  }
  if (!form.value.houseNumber.trim()) {
    errorMessage.value = 'Nomor rumah wajib diisi'
    showErrorModal.value = true
    return
  }
  
  if (isSubmitting.value) return
  isSubmitting.value = true
  showErrorModal.value = false
  errorMessage.value = ''

  try {
    const payload = {
      recipient_name: form.value.recipientName.trim(),
      phone_number: form.value.phone.trim(),
      address_details: `${form.value.region.trim()} - ${form.value.addressLine.trim()}`,
      house_number: form.value.houseNumber.trim(),
      is_primary: !!form.value.isPrimary
    }

    const resp = await authAPI.createAddress(payload)
    const created = resp?.data || null

    successMessage.value = 'Alamat berhasil disimpan'
    showSuccessModal.value = true
    if (created) {
      addresses.value = [created]
      hasAddress.value = true
    } else {
      await fetchAddresses()
    }
    form.value = {
      recipientName: '',
      phone: '',
      region: '',
      addressLine: '',
      houseNumber: '',
      isPrimary: false
    }
  } catch (error) {
    const data = error?.response?.data
    const msg =
      typeof data === 'string'
        ? data
        : data?.detail ||
          (Array.isArray(data?.non_field_errors) ? data.non_field_errors[0] : null) ||
          (Array.isArray(data?.recipient_name) ? data.recipient_name[0] : null) ||
          (Array.isArray(data?.phone_number) ? data.phone_number[0] : null) ||
          (Array.isArray(data?.address_details) ? data.address_details[0] : null) ||
          (Array.isArray(data?.house_number) ? data.house_number[0] : null) ||
          error?.message ||
          'Gagal menyimpan alamat'

    errorMessage.value = String(msg)
    showErrorModal.value = true
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchAddresses()
})

// Define props and emits if needed
// defineProps({})
// defineEmits([])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #0d0920;
  color: #ffffff;
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

.app-container {
  width: 100%;
  max-width: 100%;
  background-color: #0d0920;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 16px 4px;
  position: relative;
  height: 70px;
}

.back-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 10;
}

.page-title {
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  pointer-events: none;
  color: #ffffff;
}

.content-wrapper {
  padding: 22px 24px;
}

.address-card {
  background: linear-gradient(180deg, #233474 0%, #32489A 100%);
  border-radius: 10px;
  padding: 20px 21px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  height: 163px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-icon {
  flex-shrink: 0;
  width: 53px;
  height: 53px;
}

.card-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 9px;
}

.user-phone {
  font-size: 14px;
  color: #a9a9a9;
  margin-bottom: 6px;
}

.user-address {
  font-size: 14px;
  color: #a9a9a9;
}

.helper-text {
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: #ffffff;
  text-align: center;
  width: 100%;
}

.address-form {
  width: 100%;
}

.form-group {
  max-width: 100%;
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #ffffff;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.input-icon {
  width: 27px;
  height: 27px;
  object-fit: contain;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  padding: 0;
  outline: none;
  width: 100%;
}

.form-input::placeholder {
  color: #a9a9a9;
}

.form-actions {
  margin-top: 40px;
  margin-bottom: 28px;
}

.submit-btn {
  width: 100%;
  height: 53px;
  border-radius: 20px;
  border: none;
  background: linear-gradient(180deg, #233474 0%, #32489a 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.submit-btn:hover {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.checkbox {
  width: 16px;
  height: 16px;
}

.checkbox-label {
  font-size: 13px;
  color: #ffffff;
  opacity: 0.9;
}

.form-note {
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  margin: 0;
  opacity: 0.8;
}
</style>
