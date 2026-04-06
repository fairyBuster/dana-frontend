<template>
  <div class="modal fade" :id="modalId" tabindex="-1" :aria-labelledby="`${modalId}Label`" aria-hidden="true">
    <div class="modal-dialog modal-dialog-bottom">
      <div class="modal-content bottom-sheet-modal">
        <div class="modal-header">
          <h5 class="modal-title" :id="`${modalId}Label`">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="options-list">
            <div 
              class="option-item" 
              v-for="option in options" 
              :key="option.value"
            >
              <label class="option-label" @click="selectOption(option.value)">
                <input 
                  type="radio" 
                  :name="`option-${modalId}`" 
                  :value="option.value" 
                  v-model="selectedValue"
                  class="option-radio"
                >
                <span class="option-text">{{ option.label }}</span>
                <span class="radio-indicator"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-primary apply-btn" 
            @click="applySelection"
            data-bs-dismiss="modal"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomSheetModal',
  props: {
    modalId: {
      type: String,
      default: 'bottomSheetModal'
    },
    title: {
      type: String,
      default: 'Pilih Kategori'
    },
    options: {
      type: Array,
      default: () => []
    },
    currentValue: {
      type: [String, Number],
      default: null
    },
    buttonText: {
      type: String,
      default: 'Terapkan'
    }
  },
  data() {
    return {
      selectedValue: this.currentValue
    }
  },
  watch: {
    currentValue(newVal) {
      this.selectedValue = newVal
    }
  },
  methods: {
    selectOption(value) {
      this.selectedValue = value
    },
    applySelection() {
      this.$emit('option-selected', this.selectedValue)
    }
  }
}
</script>

<style scoped>
/* Bottom sheet modal styling */
.modal-dialog-bottom {
  margin: 0;
  position: absolute;
  bottom: 0;
  width: 100%;
  max-width: 100%;
}

.bottom-sheet-modal {
  border-radius: 20px 20px 0 0;
  border: none;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
  height: 50vh; /* Takes half of the viewport height */
  overflow-y: auto;
}

.modal-header {
  border-bottom: none;
  padding: 20px 20px 10px 20px;
  position: relative;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 auto;
  text-align: center;
  width: 100%;
}

.btn-close {
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: #666;
}

.modal-body {
  padding: 10px 20px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.option-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.option-item:hover {
  background-color: #f8f9fa;
}

.option-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  margin: 0;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  position: relative;
  width: 100%;
}

.option-item:last-child .option-label {
  border-bottom: none;
}

.option-radio {
  display: none;
}

.option-text {
  font-size: 16px;
  color: #333;
  font-weight: 400;
}

.radio-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
}

.option-radio:checked + .option-text + .radio-indicator {
  border-color: #007bff;
  background-color: #007bff;
}

.option-radio:checked + .option-text + .radio-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
}

.modal-footer {
  border-top: none;
  padding: 10px 20px 20px 20px;
  justify-content: center;
}

.apply-btn {
  background: linear-gradient(135deg, #4285f4 0%, #1976d2 100%);
  border: none;
  border-radius: 25px;
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  min-width: 200px;
  transition: all 0.3s ease;
}

.apply-btn:hover {
  background: linear-gradient(135deg, #3367d6 0%, #1565c0 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.apply-btn:active {
  transform: translateY(0);
}

/* Modal backdrop styling */
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .bottom-sheet-modal {
    border-radius: 15px 15px 0 0;
  }
  
  .modal-title {
    font-size: 16px;
  }
  
  .option-text {
    font-size: 15px;
  }
  
  .apply-btn {
    min-width: 150px;
    padding: 10px 30px;
    font-size: 15px;
  }
}
</style>
