<!-- <template>
  <div class="date-picker-overlay" @click.self="$emit('close')">
    <div class="date-picker-container">
    
      <div class="date-picker-header">
        <div class="month-year">{{ currentMonthYear }}</div>
        <div class="navigation-buttons">
          <button class="nav-button" @click="previousMonth">&lt;</button>
          <button class="nav-button" @click="nextMonth">&gt;</button>
          <button class="nav-button" @click="nextYear">&gt;&gt;</button>
        </div>
      </div>
   
      <div class="calendar-grid">
       
        <div class="weekday-header" v-for="day in weekdays" :key="day">{{ day }}</div>
        
      
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="calendar-day"
          :class="{ 
            'other-month': !day.isCurrentMonth,
            'selected': isSelected(day.date),
            'today': isToday(day.date)
          }"
          @click="selectDate(day.date)"
        >
          {{ day.day }}
        </div>
      </div>
      
      
      <div class="date-picker-footer">
        <button class="clear-button" @click="clearSelection">Clear</button>
        <button class="ok-button" @click="confirmSelection">OK</button>
      </div>
    </div>
  </div>
</template> -->

<script>
export default {
  name: 'DatePicker',
  props: {
    selectedDate: {
      type: Date,
      default: null
    },
    startDate: {
      type: String,
      default: null
    },
    endDate: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      currentDate: new Date(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedStartDate: this.startDate ? new Date(this.startDate) : null,
      selectedEndDate: this.endDate ? new Date(this.endDate) : null,
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      selectionMode: this.startDate && !this.endDate ? 'end' : 'start'
    };
  },
  computed: {
    currentMonthYear() {
      const options = { year: 'numeric', month: 'long' };
      return new Date(this.currentYear, this.currentMonth).toLocaleDateString('en-US', options);
    },
    calendarDays() {
      const days = [];
      
      // Get first day of the month
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const startingDayOfWeek = firstDay.getDay();
      
      // Get last day of the month
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const daysInMonth = lastDay.getDate();
      
      // Get last day of previous month
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0);
      const daysInPrevMonth = prevMonthLastDay.getDate();
      
      // Fill in days from previous month
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(this.currentYear, this.currentMonth - 1, day);
        days.push({
          day,
          date,
          isCurrentMonth: false
        });
      }
      
      // Fill in days of current month
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(this.currentYear, this.currentMonth, i);
        days.push({
          day: i,
          date,
          isCurrentMonth: true
        });
      }
      
      // Fill in days from next month
      const remainingDays = 42 - days.length; // 6 rows x 7 days = 42
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(this.currentYear, this.currentMonth + 1, i);
        days.push({
          day: i,
          date,
          isCurrentMonth: false
        });
      }
      
      return days;
    }
  },
  methods: {
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    nextYear() {
      this.currentYear++;
    },
    formatDate(date) {
      if (!date) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    selectDate(date) {
      if (this.selectionMode === 'start') {
        this.selectedStartDate = new Date(date);
        this.selectedEndDate = null;
        this.selectionMode = 'end';
      } else {
        // Ensure end date is not before start date
        if (date >= this.selectedStartDate) {
          this.selectedEndDate = new Date(date);
        } else {
          // If selected end date is before start date, swap them
          this.selectedEndDate = new Date(this.selectedStartDate);
          this.selectedStartDate = new Date(date);
        }
        this.selectionMode = 'start';
      }
    },
    isSelected(date) {
      if (!date) return false;
      
      const dateStr = this.formatDate(date);
      const startDateStr = this.formatDate(this.selectedStartDate);
      const endDateStr = this.formatDate(this.selectedEndDate);
      
      if (startDateStr && endDateStr) {
        // Check if date is within range
        return dateStr >= startDateStr && dateStr <= endDateStr;
      } else if (startDateStr) {
        return dateStr === startDateStr;
      }
      
      return false;
    },
    isToday(date) {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
    },
    clearSelection() {
      this.selectedStartDate = null;
      this.selectedEndDate = null;
      this.selectionMode = 'start';
      this.$emit('clear');
    },
    confirmSelection() {
      this.$emit('confirm', {
        startDate: this.formatDate(this.selectedStartDate),
        endDate: this.formatDate(this.selectedEndDate)
      });
    }
  }
};
</script>

<style scoped>
.date-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.date-picker-container {
  width: 100%;
  max-width: 350px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.date-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.month-year {
  font-size: 18px;
  color: #495057;
}

.navigation-buttons {
  display: flex;
  gap: 8px;
}

.nav-button {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
}

.nav-button:hover {
  color: #495057;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 8px;
}

.weekday-header {
  text-align: center;
  font-weight: 500;
  color: #6c757d;
  padding: 8px 0;
  font-size: 14px;
}

.calendar-day {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  margin: 2px;
  font-size: 14px;
  color: #212529;
}

.calendar-day:hover {
  background-color: #e9ecef;
}

.other-month {
  color: #adb5bd;
}

.selected {
  background-color: #007bff;
  color: white;
}

.selected:hover {
  background-color: #0069d9;
}

.today {
  font-weight: bold;
  border: 1px solid #007bff;
}

.date-picker-footer {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
  border-top: 1px solid #e9ecef;
  gap: 8px;
}

.clear-button {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 6px 12px;
  font-size: 14px;
}

.ok-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
}

.clear-button:hover {
  color: #495057;
}

.ok-button:hover {
  color: #0069d9;
}
</style>
