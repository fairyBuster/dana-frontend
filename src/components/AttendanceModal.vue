<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-card">
          <!-- Close Icon -->
          <button class="close-btn" aria-label="Close" @click="closeModal">
            <img src="/assets/image/4200_226.svg" alt="Close Icon">
          </button>

          <!-- Illustration -->
          <div class="illustration-wrapper">
            <img src="/assets/image/daily1.png" alt="Check-in Illustration" class="main-illustration">
          </div>

          <!-- Text Content -->
          <div class="content-wrapper">
            <p class="info-text">
              Absen direset setiap jam 00:00<br>
              Absen hari ini:
            </p>
            <h2 class="amount-text">{{ rewardAmountDisplay }}</h2>
          </div>

          <!-- Action Button -->
          <button class="action-btn" @click="handleCheckIn">
            Absen
          </button>
        </div>
      </div>
      <ErrorModal
        v-model="showErrorModal"
        :title="'Check-in Error'"
        :message="errorMessage"
      />
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
    totalPoints: {
      type: Number,
      default: 0
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
      settings: null,
      totalPointsInternal: 0
    };
  },
  watch: {
    show(val) {
      console.log('AttendanceModal show changed:', val)
      if (val) {
        this.fetchActiveSettings()
      }
    }
  },
  mounted() {
    console.log('AttendanceModal mounted')
    if (this.show) {
      this.fetchActiveSettings()
    }
  },
  computed: {
    displayPoints() {
      const source = Number(this.totalPointsInternal || this.totalPoints || 0)
      return this.formatAmount(source)
    },
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
      } catch (err) {
        console.error('Failed to fetch attendance settings:', err)
      }
    },
    closeModal() {
      this.$emit('close');
    },
    async handleCheckIn() {
      try {
        const res = await attendanceAPI.claim()
        const data = res?.data || {}
        this.$emit('check-in', {
          checkedDays: this.attendanceData.checkedDays,
          lastCheckIn: new Date().toISOString(),
          streak: this.attendanceData.streak + 1
        })
        this.showSuccessModal = true
        // The modal will close itself after 3s or when clicked, which triggers @confirm -> closeModal
      } catch (err) {
        let msg = 'Gagal melakukan check-in'
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
      }
    },
    formatAmount(value) {
      const n = Number(value || 0)
      if (!Number.isFinite(n)) return '0'
      return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n)
    },
    async fetchBalanceStatistics(period = 'all-time') {
      try {
        const res = await authAPI.getBalanceStatistics(period)
        const data = res?.data || {}
        const attendance = Number(data.attendance_total || 0)
        this.totalPointsInternal = attendance
      } catch (_) {
        this.totalPointsInternal = 0
      }
    }
  },
  created() {
    this.fetchBalanceStatistics('all-time')
  }
};
</script>

<style scoped>
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

* {
  box-sizing: border-box;
}

button {
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
}
/* CSS for section section:CheckIn */
#check-in-screen {
    width: 100%;
    max-width: 412px; /* Based on root frame width */
    min-height: 100vh;
    margin: 0 auto;
    background-color: #3f3f3f;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .modal-container {
    position: relative;
    width: 100%;
    max-width: 364px;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 14px 10px 20px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(63, 63, 63, 0.9); /* #3f3f3f with opacity */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    z-index: 10000; /* Increased z-index to ensure visibility */
    font-family: 'Inter', sans-serif;
  }

  .close-btn {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 24px;
    height: 24px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .close-btn img {
    width: 100%;
    height: 100%;
  }

  .illustration-wrapper {
    margin-top: 10px;
    margin-bottom: 0px; /* Adjust based on visual overlap */
    display: flex;
    justify-content: center;
  }

  .main-illustration {
    width: 204px;
    height: auto;
    object-fit: contain;
  }

  .content-wrapper {
    text-align: center;
    margin-bottom: 20px;
    color: #000000;
  }

  .info-text {
    font-size: 12px;
    line-height: 1.5;
    margin: 0 0 4px 0;
    opacity: 0.9;
  }

  .amount-text {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
  }

  .action-btn {
    width: 100%;
    max-width: 343px;
    height: 48px;
    border-radius: 30px;
    background: linear-gradient(90deg, #EFD473 0%, #F6E291 100%);
    color: #000000;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.2s;
    border: none;
    cursor: pointer;
  }

  .action-btn:hover {
    opacity: 0.9;
  }
</style>
