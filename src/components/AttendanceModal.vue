<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
      <div class="modal-wrapper">
        <div class="modal-card">
          <img src="/assets/images/7210a5369195691e3aa63bd1fb6d8c025d233ccc.png" alt="" class="decorative-image">

          <h2 class="modal-title">Sudahkah Anda<br>absen hari ini?</h2>

          <div class="rewards-container">
            <div class="rewards-grid">
              <div
                v-for="day in 7"
                :key="day"
                class="reward-item"
                :class="{ checked: isDayChecked(day) }"
              >
                <template v-if="isDayChecked(day)">
                  <img src="/assets/images/2c7d9deec885fca45b0cdc0cdbd2c112e17522ef.png" alt="" class="check-icon">
                </template>
                <template v-else>
                  <span class="day-label">{{ day }} hari</span>
                  <img src="/assets/images/108294978d9cad25785261933372f80a0602c03d.png" alt="" class="coin-icon">
                  <span class="coin-value">{{ getDayReward(day) }}</span>
                </template>
              </div>
            </div>
          </div>

          <button class="claim-button" :disabled="isClaiming" @click="handleCheckIn">
            {{ isClaiming ? 'Mengklaim...' : 'Klaim Absen Disini' }}
          </button>
        </div>
      </div>

      <ErrorModal v-model="showErrorModal" :message="errorMessage" />
      <SuccessModal v-model="showSuccessModal" :message="successMessage" />
    </div>
  </Teleport>
</template>

<script>
import { attendanceAPI, authAPI } from '@/services/api'
import ErrorModal from '@/components/modals/AppErrorModal.vue'
import SuccessModal from '@/components/modals/AppSuccessModal.vue'
import { formatAppCurrency } from '@/utils/settings'

export default {
  name: 'AttendanceModal',
  components: { ErrorModal, SuccessModal },
  emits: ['close', 'check-in'],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    attendanceData: {
      type: Object,
      default: () => ({
        checkedDays: [],
        lastCheckIn: null,
        streak: 0
      })
    }
  },
  data() {
    return {
      showErrorModal: false,
      errorMessage: '',
      showSuccessModal: false,
      successMessage: '',
      isClaiming: false,
      settings: null,
      streakCount: 0
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.fetchActiveSettings()
      }
    }
  },
  mounted() {
    if (this.show) {
      this.fetchActiveSettings()
    }
  },
  computed: {
    rewardAmountDisplay() {
      if (!this.settings) return formatAppCurrency(0, { decimals: 0 })
      const amount = Number(this.settings.fixed_amount || 0)
      return formatAppCurrency(amount, { decimals: 0 })
    }
  },
  methods: {
    async fetchActiveSettings() {
      try {
        const res = await attendanceAPI.getActiveSettings()
        this.settings = res?.data || null
        const streak = Number(res?.data?.current_streak ?? this.attendanceData.streak ?? 0)
        this.streakCount = Number.isFinite(streak) ? streak : 0
      } catch (_) {
        this.settings = null
      }
    },
    isDayChecked(day) {
      return day <= this.streakCount
    },
    getDayReward(day) {
      if (!this.settings) return '100'
      const amount = Number(this.settings.fixed_amount || 100)
      return String(Math.round(amount))
    },
    closeModal() {
      this.$emit('close')
    },
    async handleCheckIn() {
      if (this.isClaiming) return
      this.isClaiming = true
      try {
        const res = await attendanceAPI.claim()
        const data = res?.data || {}
        const amount = Number(data.amount ?? data.reward ?? this.settings?.fixed_amount ?? 0)
        this.streakCount = Math.min(7, this.streakCount + 1)
        this.$emit('check-in', {
          checkedDays: this.attendanceData.checkedDays,
          lastCheckIn: new Date().toISOString(),
          streak: this.streakCount
        })
        this.successMessage = `Berhasil mengklaim ${formatAppCurrency(amount, { decimals: 0 })}`
        this.showSuccessModal = true
      } catch (err) {
        let msg = 'Gagal melakukan absen'
        if (err?.response?.data) {
          const d = err.response.data
          if (typeof d === 'string') msg = d
          else if (d.message) msg = d.message
          else if (d.detail) msg = d.detail
        } else if (err?.message) {
          msg = err.message
        }
        this.errorMessage = msg
        this.showErrorModal = true
      } finally {
        this.isClaiming = false
      }
    }
  },
  created() {
    this.streakCount = Number(this.attendanceData?.streak ?? 0)
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(129, 129, 129, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 10000;
  font-family: 'Inter', sans-serif;
}

.modal-wrapper {
  width: 100%;
  max-width: 412px;
  display: flex;
  justify-content: center;
}

.modal-card {
  width: 100%;
  max-width: 337px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 21px 15px 15px 15px;
  position: relative;
  margin-top: 34px;
}

.decorative-image {
  position: absolute;
  top: -34px;
  right: -9px;
  width: 154px;
  height: 123px;
  z-index: 10;
  pointer-events: none;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #000000;
  margin: 0 0 16px 4px;
  line-height: 1.2;
  max-width: 215px;
  position: relative;
  z-index: 1;
}

.rewards-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 16px 19px 20px 19px;
  margin-bottom: 28px;
}

.rewards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 7px;
  justify-content: flex-start;
}

.reward-item {
  width: 48px;
  height: 69px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
}

.reward-item.checked {
  background-color: rgba(35, 192, 0, 0.15);
}

.day-label {
  font-size: 10px;
  color: #000000;
  margin-bottom: 4px;
  font-weight: 400;
  line-height: 1;
}

.coin-icon {
  width: 19px;
  height: 22px;
  object-fit: contain;
  margin-bottom: 4px;
}

.coin-value {
  font-size: 10px;
  color: #000000;
  font-weight: 400;
  line-height: 1;
}

.check-icon {
  width: 35px;
  height: 31px;
  object-fit: contain;
}

.claim-button {
  background-color: #975309;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  width: 100%;
  height: 46px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.claim-button:hover {
  opacity: 0.9;
}

.claim-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
