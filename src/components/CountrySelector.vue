<template>
  <div v-if="show" class="country-selector-overlay" @click.self="close">
    <section id="phone-selector-section">
      <div class="mobile-container">
        <div class="bottom-sheet">
          <header class="sheet-header">
            <button type="button" class="sheet-action" @click="close">Membatalkan</button>
            <div class="sheet-spacer"></div>
            <button type="button" class="sheet-action sheet-action--primary" @click="confirm">Tentu</button>
          </header>

          <div class="picker-wrapper">
            <div class="picker-indicator"></div>
            <div ref="pickerEl" class="picker" @scroll="onScroll">
              <ul class="picker-list">
                <li v-for="(country, idx) in countriesSorted" :key="country.code" class="picker-row">
                  <button
                    type="button"
                    class="picker-item"
                    :class="{ active: isSelected(country) }"
                    @click="selectAndScroll(idx)"
                  >
                    +{{ country.dialCode }} {{ country.name }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  selectedCountry: {
    type: Object,
    default: () => ({ name: 'Indonesia', code: 'ID', dialCode: '62', flag: '🇮🇩' })
  }
})

const emit = defineEmits(['update:show', 'select'])

const pickerEl = ref(null)
const rowHeight = 36
let rafId = 0

const countries = ref([
  { name: 'Indonesia', code: 'ID', dialCode: '62', flag: '🇮🇩' },
  { name: 'Malaysia', code: 'MY', dialCode: '60', flag: '🇲🇾' },
  { name: 'Singapore', code: 'SG', dialCode: '65', flag: '🇸🇬' },
  { name: 'Thailand', code: 'TH', dialCode: '66', flag: '🇹🇭' },
  { name: 'Vietnam', code: 'VN', dialCode: '84', flag: '🇻🇳' },
  { name: 'Philippines', code: 'PH', dialCode: '63', flag: '🇵🇭' },
  { name: 'China', code: 'CN', dialCode: '86', flag: '🇨🇳' },
  { name: 'Japan', code: 'JP', dialCode: '81', flag: '🇯🇵' },
  { name: 'South Korea', code: 'KR', dialCode: '82', flag: '🇰🇷' },
  { name: 'United States', code: 'US', dialCode: '1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '44', flag: '🇬🇧' },
  { name: 'Australia', code: 'AU', dialCode: '61', flag: '🇦🇺' },
  { name: 'India', code: 'IN', dialCode: '91', flag: '🇮🇳' },
  { name: 'Hong Kong', code: 'HK', dialCode: '852', flag: '🇭🇰' },
  { name: 'Taiwan', code: 'TW', dialCode: '886', flag: '🇹🇼' },
  { name: 'Brazil', code: 'BR', dialCode: '55', flag: '🇧🇷' },
  { name: 'Canada', code: 'CA', dialCode: '1', flag: '🇨🇦' },
  { name: 'Germany', code: 'DE', dialCode: '49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dialCode: '33', flag: '🇫🇷' },
  { name: 'Italy', code: 'IT', dialCode: '39', flag: '🇮🇹' },
  { name: 'Spain', code: 'ES', dialCode: '34', flag: '🇪🇸' },
  { name: 'Netherlands', code: 'NL', dialCode: '31', flag: '🇳🇱' },
  { name: 'Russia', code: 'RU', dialCode: '7', flag: '🇷🇺' },
  { name: 'Mexico', code: 'MX', dialCode: '52', flag: '🇲🇽' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '966', flag: '🇸🇦' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '971', flag: '🇦🇪' },
])

const tempSelected = ref(props.selectedCountry)

const countriesSorted = computed(() => {
  return [...countries.value].sort((a, b) => a.name.localeCompare(b.name))
})

const close = () => {
  emit('update:show', false)
}

const isSelected = (country) => {
  return String(tempSelected.value?.code || '') === String(country?.code || '')
}

const scrollToIndex = (idx, behavior = 'auto') => {
  const el = pickerEl.value
  if (!el) return
  const top = Math.max(0, idx) * rowHeight
  el.scrollTo({ top, behavior })
}

const selectAndScroll = (idx) => {
  const list = countriesSorted.value
  const next = list[idx]
  if (!next) return
  tempSelected.value = next
  scrollToIndex(idx, 'smooth')
}

const syncSelectedFromScroll = () => {
  const el = pickerEl.value
  if (!el) return
  const list = countriesSorted.value
  if (!list.length) return
  const idx = Math.min(Math.max(Math.round(el.scrollTop / rowHeight), 0), list.length - 1)
  const next = list[idx]
  if (next) tempSelected.value = next
}

const onScroll = () => {
  if (rafId) return
  rafId = window.requestAnimationFrame(() => {
    rafId = 0
    syncSelectedFromScroll()
  })
}

const confirm = () => {
  emit('select', tempSelected.value)
  close()
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    tempSelected.value = props.selectedCountry
    nextTick(() => {
      const list = countriesSorted.value
      const idx = Math.max(0, list.findIndex((c) => String(c.code) === String(props.selectedCountry?.code)))
      scrollToIndex(idx, 'auto')
    })
  }
})

onBeforeUnmount(() => {
  if (rafId) window.cancelAnimationFrame(rafId)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

/* CSS for section section:PhoneSelector */
/* Container Setup */
#phone-selector-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.mobile-container {
  width: 100%;
  max-width: 412px;
  height: 40vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* Bottom Sheet Styling */
.bottom-sheet {
  background: linear-gradient(180deg, #1a1f3a 0%, #0b0d1e 100%);
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sheet-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background: rgba(255, 255, 255, 0.02);
}

.sheet-spacer {
  flex: 1;
}

.sheet-action {
  background: transparent;
  border: none;
  padding: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
}

.sheet-action--primary {
  color: rgba(255, 255, 255, 0.95);
}

.picker-wrapper {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.picker {
  width: 100%;
  height: 168px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
}

.picker::-webkit-scrollbar {
  display: none;
}

.picker-list {
  list-style: none;
  margin: 0;
  padding: 66px 0;
}

.picker-row {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
}

.picker-item {
  width: 100%;
  max-width: 260px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  line-height: 18px;
  opacity: 0.35;
  transition: opacity 0.12s ease, color 0.12s ease;
}

.picker-item.active {
  opacity: 1;
  color: rgba(255, 255, 255, 1);
}

.picker-indicator {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 36px;
  transform: translateY(-50%);
  border-top: 0.5px solid rgba(255, 255, 255, 0.5);
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

/* Overlay styling */
.country-selector-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 1050;
  display: flex;
  align-items: flex-end;
}
</style>
