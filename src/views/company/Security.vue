<!-- <template>
  <div class="mobile-container">

    <section id="section-header">
      <div class="header-wrapper">
        <header class="app-header">
          <div class="icon-container" @click="goBack">
            <img src="/assets/images/2023_1661.svg" alt="Back" class="back-icon">
          </div>
          <h1 class="page-title">Perjanjian Anggota</h1>
          <div class="spacer"></div>
        </header>
      </div>
    </section>

    <section id="section-contract">
      <div class="contract-wrapper">
        <article class="contract-card">
          <div class="card-header">
            <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Logo" class="company-logo">
            <div class="company-details">
              <h2 class="company-name"> Sentium Mapping Solution</h2>
              <p class="company-slogan">Intelligent Drone Mapping System<br>© 2026 All Rights Reserved</p>
            </div>
          </div>
          
          <div class="divider"></div>
          
          <div class="contract-meta">
            <p>Hal: Kontrak perjanjian keanggotaan</p>
            <p>Sub: Program Subsidi Bulanan SENT</p>
          </div>
          
          <div class="contract-body">
            <p>1. Pendahuluan<br>Dokumen ini merupakan perjanjian resmi antara pengguna (selanjutnya disebut sebagai "Anggota") dengan platform SENT terkait partisipasi dalam program subsidi bulanan berbasis aktivitas dan tingkat keanggotaan.</p>
            
            <p>2. Ketentuan Program<br>Program subsidi bulanan memberikan kesempatan kepada Anggota untuk memperoleh manfaat tambahan berdasarkan tingkat keanggotaan yang dicapai serta aktivitas yang dilakukan dalam sistem. Setiap pencapaian tingkat tunduk pada syarat dan ketentuan yang telah ditetapkan oleh platform.</p>
            
            <p>3. Mekanisme Manfaat<br>Manfaat yang diperoleh Anggota dihitung berdasarkan partisipasi aktif, kontribusi dalam jaringan, serta pemenuhan kriteria yang berlaku. (Manfaat tidak bersifat tetap dan dapat berubah sesuai kebijakan sistem.)</p>
            
            <p>4. Alokasi Dana<br>Setiap dana yang digunakan dalam program ini dialokasikan untuk pengembangan sistem, operasional platform, serta distribusi manfaat sesuai mekanisme internal yang berlaku.</p>
            
            <p>5. Risiko dan Pengungkapan<br>Anggota memahami bahwa setiap partisipasi dalam program memiliki risiko, termasuk namun tidak terbatas pada perubahan sistem, penyesuaian manfaat, dan faktor lain di luar kendali platform. (Perusahaan tidak menjamin hasil tertentu di luar ketentuan yang berlaku.)</p>
            
            <p>6. Kepemilikan dan Strategi Keluar<br>Perusahaan memiliki hak untuk menghentikan partisipasi dalam program sesuai dengan prosedur yang berlaku. (Segala hak dan kewajiban akan disesuaikan berdasarkan status keanggotaan pada saat penghentian.)</p>
            
            <p>7. Hak dan Tanggung Jawab Anggota<br>Anggota wajib:<br> Mematuhi seluruh ketentuan yang berlaku<br> Menggunakan platform secara wajar dan tidak melanggar aturan<br> Menjaga keamanan akun masing-masing<br>Anggota berhak:<br> Mendapatkan informasi yang jelas terkait program<br> Menerima manfaat sesuai ketentuan yang berlaku</p>
            
            <p>8. Kepatuhan Hukum dan Kebijakan<br>Program ini dijalankan sesuai dengan kebijakan internal platform serta peraturan yang berlaku. Platform berhak melakukan pembaruan kebijakan sewaktu-waktu tanpa pemberitahuan sebelumnya.</p>
            
            <p>9. Persetujuan<br>Dengan menekan tombol "Setuju", Anggota menyatakan telah membaca, memahami, dan menyetujui seluruh isi perjanjian ini tanpa paksaan dari pihak manapun.</p>
          </div>
          
          <div class="contract-footer">
            <div class="footer-left">
              <p>Pihak perusahaan: OT-SENT</p>
            </div>
            <div class="footer-right">
              <p>Anggota: {{ memberId }}</p>
              <p>{{ currentDate }}</p>
            </div>
            <img v-if="requiresContract && isAccepted" src="/assets/images/d9b41d54b13e3f872bf656657234e30868c2d994.png" alt="Stamp" class="contract-stamp">
          </div>
        </article>
      </div>
    </section>


    <section v-if="requiresContract" id="section-footer">
      <div class="footer-wrapper">
        <button class="btn-contract" @click="acceptContract" :disabled="isAccepted || isSubmitting || isLoadingRank">
          {{ isAccepted ? 'Kontrak sudah ditekan' : 'Tekan kontrak' }}
        </button>
      </div>
    </section>

    <SuccessModal v-model="successModalOpen" :message="successMessage" />
    <ErrorModal v-model="errorModalOpen" :message="errorMessage" />
  </div>
</template> -->

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api'
import SuccessModal from '@/components/modals/SuccessModal.vue'
import ErrorModal from '@/components/modals/ErrorModal.vue'

const router = useRouter()
const memberId = ref('-')
const currentDate = ref('-')
const isAccepted = ref(false)
const isSubmitting = ref(false)
const currentRank = ref(null)
const currentTitle = ref(null)
const isLoadingRank = ref(false)
const accountId = ref(null)
const successModalOpen = ref(false)
const errorModalOpen = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const requiresContract = computed(() => {
  const n = Number(currentRank.value)
  if (Number.isFinite(n) && n >= 5) return true
  const t = String(currentTitle.value || '').toLowerCase()
  return /vip\s*5|v\s*5/.test(t)
})

const goBack = () => {
  router.go(-1)
}

const formatDate = (d) => {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear())
  return `${day}/${month}/${year}`
}

const loadAccountInfo = async () => {
  currentDate.value = formatDate(new Date())
  try {
    const resp = await authAPI.getAccountInfo()
    accountId.value = resp?.data?.id ?? null
    memberId.value = resp?.data?.phone || resp?.data?.username || '-'
  } catch (_) {}

  isLoadingRank.value = true
  try {
    const rankResp = await authAPI.getRankStatus()
    currentRank.value = rankResp?.data?.current_rank ?? null
    currentTitle.value = rankResp?.data?.current_title ?? null
  } catch (_) {
    currentRank.value = null
    currentTitle.value = null
  } finally {
    isLoadingRank.value = false
  }

  const storageKey = accountId.value ? `contractAccepted:${accountId.value}` : memberId.value ? `contractAccepted:${memberId.value}` : null
  if (!requiresContract.value) {
    isAccepted.value = true
    return
  }
  isAccepted.value = storageKey ? localStorage.getItem(storageKey) === 'true' : false
}

const acceptContract = async () => {
  if (!requiresContract.value) return
  if (isAccepted.value || isSubmitting.value || isLoadingRank.value) return

  isSubmitting.value = true
  try {
    const storageKey = accountId.value ? `contractAccepted:${accountId.value}` : memberId.value ? `contractAccepted:${memberId.value}` : null
    if (storageKey) localStorage.setItem(storageKey, 'true')
    isAccepted.value = true
    successMessage.value = 'Perjanjian berhasil disetujui!'
    successModalOpen.value = true
  } catch (err) {
    errorMessage.value = 'Permintaan gagal, segarkan halaman'
    errorModalOpen.value = true
  } finally {
    isSubmitting.value = false
  }
}

watch(
  () => successModalOpen.value,
  (open) => {
    if (!open && isAccepted.value) {
      router.push('/dashboard')
    }
  }
)

onMounted(() => {
  loadAccountInfo()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #1a1a2e;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.mobile-container {
  width: 100%;
  max-width: 412px;
  background-image: none;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

* {
  box-sizing: border-box;
}

p, h1, h2, h3, h4, h5, h6 {
  margin: 0;
}

/* Header Section */
#section-header {
  display: contents;
}

.header-wrapper {
  min-height: auto;
  background: transparent;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 18px;
  width: 100%;
}

.icon-container {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-icon {
  width: 24px;
  height: 24px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  flex-grow: 1;
}

.spacer {
  width: 24px; /* Balances the back icon */
}

/* Contract Section */
#section-contract {
  display: contents;
}

.contract-wrapper {
  min-height: auto;
  background: transparent;
  padding: 0 21px;
  flex-grow: 1;
}

.contract-card {
  background-color: #ffffff;
  width: 100%;
  padding: 18px 12px;
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
}

.company-logo {
  width: 49px;
  height: 28px;
  object-fit: contain;
}

.company-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.company-name {
  font-size: 14px;
  font-weight: 700;
  color: #000000;
}

.company-slogan {
  font-size: 10px;
  color: #000000;
  line-height: 1.2;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: #000000;
  margin-bottom: 8px;
}

.contract-meta {
  font-size: 10px;
  color: #000000;
  margin-bottom: 15px;
  line-height: 1.4;
  font-weight: 600;
}

.contract-body {
  font-size: 9px;
  color: #000000;
  line-height: 1.4;
  white-space: pre-wrap;
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.contract-body p {
  margin-bottom: 10px;
}

.contract-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 9px;
  color: #000000;
  font-weight: 600;
  position: relative;
}

.footer-left {
  text-align: left;
}

.footer-right {
  text-align: right;
}

.contract-stamp {
  position: absolute;
  right: 0;
  bottom: -2px;
  width: 92px;
  height: auto;
  transform: rotate(-10deg);
  opacity: 0.95;
}

/* Footer Section */
#section-footer {
  display: contents;
}

.footer-wrapper {
  min-height: auto;
  background: transparent;
  padding: 0 33px 30px 33px;
  margin-top: auto;
}

.btn-contract {
  width: 100%;
  height: 41px;
  background: linear-gradient(90deg, #3F48C5 0%, #6135C4 30.77%, #9047E0 100%);
  border: 1px solid #746a9a;
  border-radius: 10px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s;
}

.btn-contract:hover {
  opacity: 0.9;
}
</style>


