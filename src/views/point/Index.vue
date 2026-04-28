<!-- <template>
  <div class="app-container">
   
    <section id="section-header">
      <div class="header-container">
        <div class="back-button" @click="goBack">
          <img src="/assets/images/2023_1661.svg" alt="Back">
        </div>
        <h1 class="header-title">Keberuntungan</h1>
      </div>
    </section>


    <section id="section-hero">
      <div class="hero-container">
 
        <div class="title-banner">
          <img src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Putaran Keberuntungan">
        </div>

     
        <div class="wheel-assembly">
          <div class="wheel-wrapper">
            <div class="wheel-rotor" :style="wheelStyle">
              <div class="wheel-rim"></div>
              <svg class="wheel-lights" viewBox="0 0 100 100" aria-hidden="true">
                <circle
                  v-for="(p, i) in wheelLights"
                  :key="i"
                  class="wheel-light"
                  :cx="p.x"
                  :cy="p.y"
                  :r="p.r"
                />
              </svg>
              <div class="wheel-face" :class="{ 'wheel-face--spinning': isSpinning }" :style="wheelFaceStyle"></div>
              <div class="wheel-hub">
                <div class="wheel-hub-inner"></div>
              </div>
              <div
                v-for="(p, idx) in wheelSegments"
                :key="String(p.id ?? idx)"
                class="wheel-label"
                :style="segmentLabelStyle(idx)"
              >
                <span class="wheel-label-text">{{ getSegmentLabel(p) }}</span>
              </div>
            </div>
            <div class="wheel-pointer"></div>
          </div>
          <img class="pedestal-img" src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Pedestal">
        </div>


        <div class="action-button-container" :class="{ disabled: isSpinning || isLoading }" @click="spinWheel">
          <img class="btn-bg" src="/assets/images/3ac255d5c6533888be0b453286e8c59c5d0e1e9e.png" alt="Button Background">
          <span class="btn-text">Undian</span>
        </div>
      </div>
    </section>

   
    <section id="section-rules">
      <div class="rules-card">
        <div class="rules-header">
          <img src="/assets/images/c8dc65f2b19ebe7fdbe1680f53c083c860893ba3.png" alt="Icon" class="rules-icon">
          <h3 class="rules-title">Aturan meja putar</h3>
        </div>
        <p class="rules-subtitle">Tiket putar tersedia: {{ availableTickets }}</p>
        <p class="rules-desc">
          Jika Anda mendapatkan kesempatan, Anda dapat memutar roda keberuntungan untuk mendapatkan kesempatan undian. Semakin banyak kesempatan undian yang Anda peroleh, semakin banyak hadiah yang dapat Anda dapatkan.
        </p>
      </div>
    </section>
  </div>

  <ErrorModal v-model="showErrorModal" :message="errorMessage" />
  <SuccessModal v-model="showSuccessModal" :message="successMessage" />
</template> -->

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { rouletteAPI } from '@/services/api'
import ErrorModal from '@/components/modals/ErrorModal.vue'
import SuccessModal from '@/components/modals/SuccessModal.vue'

const router = useRouter()
const availableTickets = ref(0)
const isLoading = ref(false)
const isSpinning = ref(false)
const isActive = ref(true)
const prizes = ref([])
const showErrorModal = ref(false)
const errorMessage = ref('')
const showSuccessModal = ref(false)
const successMessage = ref('')
const wheelRotation = ref(0)
const wheelDurationMs = 4800

const goBack = () => {
  router.go(-1)
}

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0
  const n = Number(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

const formatAmount = (value) => {
  const n = parseNumber(value)
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n)
}

const extractErrorMessage = (err) => {
  const data = err?.response?.data
  if (!data) return err?.message || 'Permintaan gagal, segarkan halaman'
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  if (data.error) return String(data.error)
  const firstKey = Object.keys(data)[0]
  const firstVal = data[firstKey]
  if (Array.isArray(firstVal) && firstVal.length) return String(firstVal[0])
  if (firstVal) return String(firstVal)
  return 'Permintaan gagal, segarkan halaman'
}

const refreshStatus = async () => {
  try {
    isLoading.value = true
    const resp = await rouletteAPI.getStatus()
    const data = resp?.data || {}
    availableTickets.value = parseNumber(data.tickets)
    isActive.value = Boolean(data.is_active ?? true)
    prizes.value = Array.isArray(data.prizes) ? data.prizes : []
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
  } finally {
    isLoading.value = false
  }
}

const wheelStyle = computed(() => {
  return {
    transform: `rotate(${wheelRotation.value}deg)`,
    transition: isSpinning.value ? `transform ${wheelDurationMs}ms cubic-bezier(0.17, 0.67, 0.22, 0.99)` : 'none'
  }
})

const wheelSegments = computed(() => {
  if (Array.isArray(prizes.value) && prizes.value.length) {
    return prizes.value
      .slice()
      .sort((a, b) => {
        const na = Number(a?.id)
        const nb = Number(b?.id)
        const aOk = Number.isFinite(na)
        const bOk = Number.isFinite(nb)
        if (aOk && bOk) return na - nb
        if (aOk) return -1
        if (bOk) return 1
        return String(a?.id ?? '').localeCompare(String(b?.id ?? ''))
      })
  }
  return Array.from({ length: 8 }, (_, idx) => ({ id: `placeholder-${idx}`, name: '-', prize_type: 'NONE', amount: '0' }))
})

const segmentCount = computed(() => wheelSegments.value.length || 8)
const wheelLights = computed(() => {
  const count = 24
  const cx = 50
  const cy = 50
  const radius = 46
  const dotR = 1.35
  const start = -90
  return Array.from({ length: count }, (_, i) => {
    const a = ((start + (360 / count) * i) * Math.PI) / 180
    return {
      x: cx + Math.cos(a) * radius,
      y: cy + Math.sin(a) * radius,
      r: dotR
    }
  })
})

const wheelFaceStyle = computed(() => {
  const count = segmentCount.value
  const seg = 360 / count
  const start = -90 - seg / 2
  const colors = ['#ffffff', '#776bff']
  const stops = Array.from({ length: count }, (_, i) => {
    const a = i * seg
    const b = (i + 1) * seg
    const c = colors[i % colors.length]
    return `${c} ${a}deg ${b}deg`
  }).join(', ')
  return {
    background: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.75), rgba(255,255,255,0) 60%), conic-gradient(from ${start}deg, ${stops}), repeating-conic-gradient(from ${start}deg, rgba(0,0,0,0.12) 0deg 1deg, rgba(0,0,0,0) 1deg ${seg}deg)`
  }
})

const getSegmentLabel = (p) => {
  const type = String(p?.prize_type || '').toUpperCase()
  const amount = parseNumber(p?.amount)
  if (type === 'BALANCE' && amount > 0) return `Rp ${formatAmount(amount)}`
  const name = String(p?.name || '').trim()
  return name || '-'
}

const segmentLabelStyle = (idx) => {
  const seg = 360 / segmentCount.value
  const angle = idx * seg
  const radius = 78
  return {
    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(90deg)`
  }
}

const getPrizeIndex = (prizeId) => {
  const list = wheelSegments.value
  if (!Array.isArray(list) || !list.length) return -1
  return list.findIndex((p) => String(p?.id) === String(prizeId))
}

const computeTargetRotation = (prizeId) => {
  const count = segmentCount.value
  const seg = 360 / count
  const idx = getPrizeIndex(prizeId)
  const safeIdx = idx >= 0 ? idx : Math.floor(Math.random() * count)
  const targetMod = (360 - ((safeIdx * seg) % 360)) % 360
  const currentMod = ((wheelRotation.value % 360) + 360) % 360
  const delta = (targetMod - currentMod + 360) % 360
  const fullSpins = 360 * (6 + Math.floor(Math.random() * 2))
  return wheelRotation.value + fullSpins + delta
}

const buildSuccessMessage = (data) => {
  const baseMsg = String(data?.message || '').trim() || 'Spin berhasil'
  const prizeNameRaw = String(data?.prize_name || '').trim()
  const prizeType = String(data?.prize_type || '').trim().toUpperCase()
  const prizeAmountNum = parseNumber(data?.prize_amount)
  const amount = formatAmount(data?.prize_amount)

  if (prizeType === 'BALANCE' && prizeAmountNum > 0) {
    return `${baseMsg} 《${amount}》`
  }

  let label = prizeNameRaw || 'Sorry!'
  if (/oops/i.test(label)) label = 'Sorry!'
  return `${baseMsg} 《${label}》`
}

const spinWheel = async () => {
  if (isSpinning.value) return
  if (isLoading.value) return
  if (!isActive.value) {
    errorMessage.value = 'Meja putar sedang tidak aktif'
    showErrorModal.value = true
    return
  }
  if (availableTickets.value <= 0) {
    errorMessage.value = 'Maaf, Anda tidak memiliki tiket putaran. Silakan dapatkan lebih banyak tiket!'
    showErrorModal.value = true
    return
  }

  isSpinning.value = true
  try {
    if (!prizes.value.length) await refreshStatus()
    const resp = await rouletteAPI.spin()
    const data = resp?.data || {}
    const afterRaw = data.tickets_after
    if (afterRaw !== null && afterRaw !== undefined && afterRaw !== '') {
      availableTickets.value = parseNumber(afterRaw)
    }
    wheelRotation.value = computeTargetRotation(data.prize_id)
    const msg = buildSuccessMessage(data)
    window.setTimeout(() => {
      successMessage.value = msg
      showSuccessModal.value = true
      isSpinning.value = false
    }, wheelDurationMs + 80)
  } catch (err) {
    errorMessage.value = extractErrorMessage(err)
    showErrorModal.value = true
    isSpinning.value = false
    try {
      await refreshStatus()
    } catch (_) {}
  }
}

onMounted(() => {
  refreshStatus()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

img {
  display: block;
  max-width: 100%;
}

* {
  box-sizing: border-box;
}

.app-container {
  width: 100%;
  max-width: 412px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Section */
#section-header {
  width: 100%;
  max-width: 412px;
  background: transparent;
  position: relative;
  z-index: 10;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 9px;
  position: relative;
  height: 48px;
}

.back-button {
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 20px;
}

/* Hero Section */
#section-hero {
  width: 100%;
  max-width: 412px;
  background: linear-gradient(180deg, #603FC9 0%, #9578DC 21.15%, #9A8AE2 40.87%, #6068B9 63.46%, #413291 81.25%, #3B2783 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 16px;
  margin-top: -48px;
  padding-top: 48px;
}

.hero-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.title-banner {
  width: 380px;
  height: 114px;
  margin-top: 49px;
  margin-bottom: 33px;
}

.title-banner img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.wheel-assembly {
  position: relative;
  width: 314px;
  height: 378px;
  margin-bottom: 0px;
}

.wheel-wrapper {
  position: absolute;
  top: 0;
  left: 16px;
  width: 282px;
  height: 281px;
  z-index: 2;
}

.wheel-rotor {
  position: absolute;
  inset: 0;
  width: 282px;
  height: 281px;
}

.wheel-rim {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0) 55%),
    radial-gradient(circle at 50% 50%, #7a6eff 0%, #5e50d6 50%, #4b3cb5 100%);
  box-shadow:
    0px 14px 26px rgba(0, 0, 0, 0.28),
    inset 0px 0px 0px 10px rgba(255, 255, 255, 0.25),
    inset 0px 0px 0px 16px rgba(255, 255, 255, 0.06);
}

.wheel-lights {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.22));
}

.wheel-light {
  fill: rgba(255, 255, 255, 0.98);
  filter: drop-shadow(0px 0px 1px rgba(255, 255, 255, 0.45));
}

.wheel-face {
  position: absolute;
  inset: 15px;
  border-radius: 50%;
  box-shadow:
    inset 0px 0px 0px 2px rgba(255, 255, 255, 0.6),
    inset 0px 12px 18px rgba(255, 255, 255, 0.18),
    inset 0px -14px 18px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.wheel-face--spinning {
  pointer-events: none;
}

.wheel-face::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 55%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 45%, rgba(0, 0, 0, 0.22) 78%, rgba(0, 0, 0, 0.38) 100%);
  opacity: 0.55;
  -webkit-mask: radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 1) 100%);
  mask: radial-gradient(circle, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 70%, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 1) 100%);
  pointer-events: none;
}

.wheel-hub {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 46px;
  height: 46px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #c7c3ff 0%, #7c70ff 45%, #4b3cb5 100%);
  box-shadow:
    inset 0px 0px 0px 2px rgba(255, 255, 255, 0.55),
    0px 8px 14px rgba(0, 0, 0, 0.28);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.wheel-hub-inner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 55%, rgba(255, 255, 255, 0.25) 100%);
  box-shadow: inset 0px 0px 0px 2px rgba(90, 76, 198, 0.55);
}

.wheel-label {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 94px;
  text-align: center;
  z-index: 4;
  user-select: none;
  pointer-events: none;
}

.wheel-label-text {
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.96);
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.35);
 


  border-radius: 999px;
  padding: 2px 6px;
  max-width: 88px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wheel-pointer {
  position: absolute;
  top: -14px;
  left: 50%;
  width: 22px;
  height: 22px;
  transform: translateX(-50%) rotate(45deg);
  background: linear-gradient(135deg, #c7bfff 0%, #7a6eff 35%, #4b3cb5 100%);
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 4px;
  box-shadow:
    0px 6px 12px rgba(0, 0, 0, 0.25),
    inset 0px 0px 0px 2px rgba(255, 255, 255, 0.18);
  z-index: 6;
}

.wheel-pointer::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 3px;
  background: radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 60%);
}

.pedestal-img {
  position: absolute;
  top: 243px;
  left: 0;
  width: 314px;
  height: 135px;
  z-index: 1;
}

.action-button-container {
  position: relative;
  width: 194px;
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 0px;
}

.action-button-container.disabled {
  opacity: 0.75;
  pointer-events: none;
}

.btn-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.btn-text {
  position: relative;
  z-index: 2;
  font-size: 18px;
  font-weight: 700;
  color: #504ba4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Rules Section */
#section-rules {
  width: 100%;
  max-width: 412px;
  background: #3B2783;
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
}

.rules-card {
  width: 378px;
  min-height: 132px;
  border-radius: 10px;
  background: linear-gradient(90deg, #0F0B2E 0%, #2B1B6F 100%);
  box-shadow: inset 0px 4px 30px rgba(0, 0, 0, 0.3);
  padding: 13px 13px 13px 13px;
  margin-top: 16px;
  position: relative;
}

.rules-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.rules-icon {
  width: 31px;
  height: 26px;
  margin-right: 4px;
}

.rules-title {
  font-size: 14px;
  color: #ffffff;
  margin: 0;
  font-weight: 400;
}

.rules-subtitle {
  font-size: 12px;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.rules-desc {
  font-size: 10px;
  color: #c4c4c4;
  margin: 0;
  line-height: 1.4;
}
</style>
