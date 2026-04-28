<template>
  <div v-if="visible" class="bank-selector-overlay" @click.self="emitClose">
    <section id="bank-selector-section">
      <div class="mobile-container">
        <div class="bottom-sheet">
          <div class="sheet-handle" />
           <header class="sheet-header">
            
            <button type="button" class="sheet-action sheet-action--primary" @click="confirmSelection">Pilih</button>
          </header>

          <div class="picker-wrapper">
            <div class="picker-surface">
              <div class="picker-indicator"></div>
              <div ref="scrollEl" class="picker" @scroll="onScroll">
                <ul class="picker-list">
                  <li v-for="(opt, idx) in allOptions" :key="String(opt.id)" class="picker-row">
                    <button
                      type="button"
                      class="picker-item"
                      :class="{ active: isSelected(opt) }"
                      @click="selectAndScroll(idx)"
                    >
                      {{ opt.name }}
                    </button>
                  </li>
                </ul>
              </div>
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
  visible: { type: Boolean, default: false },
  bankOptions: { type: Array, default: () => [] },
  selectedBankId: { type: [Number, String, null], default: null },
  nullLabel: { type: String, default: 'null' }
})
const emit = defineEmits(['close', 'select'])

const scrollEl = ref(null)
const internalSelectedId = ref(null)

const allOptions = computed(() => {
  return [{ id: null, name: props.nullLabel }, ...props.bankOptions]
})

const rowHeight = 36
let rafId = 0

const emitClose = () => {
  emit('close')
}

const syncScrollToSelected = async () => {
  await nextTick()
  const el = scrollEl.value
  if (!el) return
  const idx = allOptions.value.findIndex((x) => String(x.id) === String(internalSelectedId.value))
  const index = idx >= 0 ? idx : 0
  el.scrollTo({ top: index * rowHeight, behavior: 'auto' })
}

const onScroll = () => {
  if (rafId) return
  rafId = window.requestAnimationFrame(() => {
    rafId = 0
    const el = scrollEl.value
    if (!el) return
    const index = Math.max(0, Math.min(allOptions.value.length - 1, Math.round(el.scrollTop / rowHeight)))
    internalSelectedId.value = allOptions.value[index]?.id ?? null
  })
}

const isSelected = (opt) => String(internalSelectedId.value ?? '') === String(opt?.id ?? '')

const selectAndScroll = (idx) => {
  const list = allOptions.value
  const next = list[idx]
  if (!next) return
  internalSelectedId.value = next?.id ?? null
  const el = scrollEl.value
  if (!el) return
  el.scrollTo({ top: Math.max(0, idx) * rowHeight, behavior: 'smooth' })
}

const confirmSelection = () => {
  const chosen = allOptions.value.find((x) => String(x.id) === String(internalSelectedId.value)) || allOptions.value[0]
  emit('select', chosen)
  emitClose()
}

watch(
  () => props.visible,
  (v) => {
    if (!v) return
    internalSelectedId.value = props.selectedBankId ?? null
    syncScrollToSelected()
  }
)

watch(
  () => props.selectedBankId,
  (v) => {
    internalSelectedId.value = v ?? null
    if (props.visible) syncScrollToSelected()
  }
)

watch(
  () => props.bankOptions,
  () => {
    if (props.visible) syncScrollToSelected()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  if (rafId) window.cancelAnimationFrame(rafId)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
}

.bank-selector-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(2px);
  z-index: 2000;
  display: flex;
  align-items: flex-end;
}

#bank-selector-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.mobile-container {
  width: 100%;
  max-width: 412px;
 
  min-height: 250px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.18);
}

.bottom-sheet {
  background-color: #f8f8f8;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.sheet-handle {
  width: 42px;
  height: 5px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.18);
  margin: 10px auto 6px;
}

.sheet-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 8px;
  background-color: transparent;
}

.sheet-title {
  font-size: 16px;
  font-weight: 700;
  color: #000000;
  text-align: center;
  flex: 1;
}

.sheet-action {
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0 12px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  height: 34px;
  min-width: 96px;
  border-radius: 14px;
}

.sheet-action--primary {
  background: #004d43;
  border-color: #004d43;
  color: #ffffff;
}

.picker-wrapper {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 4px 16px 16px;
}

.picker-surface {
  width: 100%;
  background: #eeeeee;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
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
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  line-height: 18px;
  opacity: 0.42;
  transition: opacity 0.12s ease, color 0.12s ease, font-weight 0.12s ease, transform 0.12s ease;
}

.picker-item.active {
  opacity: 1;
  color: #004d43;
  font-weight: 700;
  transform: scale(1.02);
}

.picker-indicator {
  position: absolute;
  top: 50%;
  left: 12px;
  right: 12px;
  height: 36px;
  transform: translateY(-50%);
  border-radius: 14px;
  background: rgba(0, 77, 67, 0.08);
  border: 1px solid rgba(0, 77, 67, 0.12);
  pointer-events: none;
}
</style>
