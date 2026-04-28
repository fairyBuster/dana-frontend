<template>
  <div v-if="visible" class="pagination-bar" role="navigation" aria-label="Pagination">
    <button
      type="button"
      class="page-btn"
      :disabled="loading || !hasPrev"
      @click="emitChange(page - 1)"
      aria-label="Sebelumnya"
    >
      ‹
    </button>
    <div class="page-info">
      <span class="page-text">{{ page }}</span>
      <span class="page-sep">/</span>
      <span class="page-text">{{ totalPages }}</span>
    </div>
    <button
      type="button"
      class="page-btn"
      :disabled="loading || !hasNext"
      @click="emitChange(page + 1)"
      aria-label="Berikutnya"
    >
      ›
    </button>
  </div>
</template>

<script setup>
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
</script>

<style scoped>
.pagination-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #eeeeee;
  border-radius: 20px;
  padding: 10px 12px;
  gap: 10px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: #004d43;
  border: none;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: inherit;
  line-height: 1;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 13px;
  font-weight: 600;
}

.page-text {
  min-width: 18px;
  text-align: center;
}

.page-sep {
  opacity: 0.6;
}
</style>
