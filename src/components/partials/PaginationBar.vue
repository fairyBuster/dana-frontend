<template>
  <div v-if="visible" class="pagination-bar" role="navigation" aria-label="Pagination">
    <div
      class="page-ctrl"
      :class="{ disabled: loading || !hasPrev }"
      role="button"
      :aria-disabled="loading || !hasPrev"
      aria-label="Sebelumnya"
      tabindex="0"
      @click="handlePrev"
      @keydown="handleKeydown($event, 'prev')"
    >‹</div>

    <div class="dots" aria-label="Halaman">
      <div
        v-for="p in dotPages"
        :key="p"
        class="page-dot"
        :class="{ active: p === page, disabled: loading }"
        role="button"
        :aria-current="p === page ? 'page' : undefined"
        :aria-disabled="loading"
        :aria-label="`Halaman ${p}`"
        tabindex="0"
        @click="selectPage(p)"
        @keydown="handlePageKeydown($event, p)"
      ></div>
    </div>

    <div
      class="page-ctrl"
      :class="{ disabled: loading || !hasNext }"
      role="button"
      :aria-disabled="loading || !hasNext"
      aria-label="Berikutnya"
      tabindex="0"
      @click="handleNext"
      @keydown="handleKeydown($event, 'next')"
    >›</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  hasPrev: { type: Boolean, default: false },
  hasNext: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  visible: { type: Boolean, default: true }
})

const emit = defineEmits(['change'])

const emitChange = (nextPage) => {
  const p = Math.max(1, Math.min(Number(nextPage || 1), Math.max(1, Number(props.totalPages || 1))))
  emit('change', p)
}

const canPrev = () => !props.loading && props.hasPrev
const canNext = () => !props.loading && props.hasNext

const handlePrev = () => {
  if (!canPrev()) return
  emitChange(props.page - 1)
}

const handleNext = () => {
  if (!canNext()) return
  emitChange(props.page + 1)
}

const handleKeydown = (e, dir) => {
  if (!e) return
  if (e.key !== 'Enter' && e.key !== ' ') return
  e.preventDefault()
  if (dir === 'prev') handlePrev()
  else handleNext()
}

const selectPage = (p) => {
  if (props.loading) return
  emitChange(p)
}

const handlePageKeydown = (e, p) => {
  if (!e) return
  if (e.key !== 'Enter' && e.key !== ' ') return
  e.preventDefault()
  selectPage(p)
}

const dotPages = computed(() => {
  const total = Math.max(1, Number(props.totalPages || 1))
  const current = Math.max(1, Math.min(Number(props.page || 1), total))
  const maxDots = 7
  if (total <= maxDots) return Array.from({ length: total }, (_, i) => i + 1)

  const half = Math.floor(maxDots / 2)
  let start = current - half
  let end = current + half

  if (start < 1) {
    start = 1
    end = maxDots
  }
  if (end > total) {
    end = total
    start = total - maxDots + 1
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
</script>

<style scoped>
.pagination-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 14px;
  padding: 6px 10px;
  gap: 14px;
}

.page-ctrl {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #f6f6f6;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.9);
  font-size: 22px;
  font-weight: 800;
  display: grid;
  place-items: center;
  cursor: pointer;
  user-select: none;
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.page-ctrl:active:not(.disabled) {
  transform: translateY(1px);
}

.page-ctrl.disabled {
  background: #f2f4f7;
  border-color: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.35);
  cursor: not-allowed;
  pointer-events: none;
}

.dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.page-dot {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.page-dot::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.25);
  transition: width 0.12s ease, background-color 0.12s ease;
}

.page-dot:active:not(.disabled):not(.active) {
  transform: translateY(1px);
}

.page-dot.active::before {
  width: 34px;
  height: 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.85);
}

.page-dot.disabled {
  opacity: 0.55;
  pointer-events: none;
}
</style>
