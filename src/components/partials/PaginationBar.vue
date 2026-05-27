<template>
  <nav v-if="visible" class="pagination-bar" aria-label="Pagination">
    <button
      type="button"
      class="nav-btn"
      :disabled="loading || !hasPrev"
      aria-label="Sebelumnya"
      @click="handlePrev"
    >
      ← Previous
    </button>

    <div class="pages" aria-label="Halaman">
      <button
        v-for="p in dotPages"
        :key="p"
        type="button"
        class="page-btn"
        :class="{ active: p === page }"
        :disabled="loading"
        :aria-current="p === page ? 'page' : undefined"
        :aria-label="`Halaman ${p}`"
        @click="selectPage(p)"
      >
        {{ p }}
      </button>
    </div>

    <button
      type="button"
      class="nav-btn"
      :disabled="loading || !hasNext"
      aria-label="Berikutnya"
      @click="handleNext"
    >
      Next →
    </button>
  </nav>
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

const selectPage = (p) => {
  if (props.loading) return
  emitChange(p)
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
  gap: 10px;
  padding: 8px 10px;
  background: #fdf8ea;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
}

.nav-btn {
  height: 34px;
  padding: 0 12px;
  border-radius: 6px;
  border: none;
  background: #f4bd40;
  color: rgba(0, 0, 0, 0.75);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.nav-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nav-btn:not(:disabled):active {
  transform: translateY(1px);
}

.pages {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.page-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  background: rgba(244, 189, 64, 0.25);
  color: rgba(0, 0, 0, 0.85);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.page-btn:disabled {
  cursor: default;
  opacity: 0.7;
}

.page-btn:not(:disabled):active {
  transform: translateY(1px);
}

.page-btn.active {
  background: #f4bd40;
  color: #ffffff;
}
</style>
