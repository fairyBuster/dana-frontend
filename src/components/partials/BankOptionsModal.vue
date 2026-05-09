<template>
  <div v-if="visible" class="bank-selector-overlay" @click.self="emitClose">
    <div class="bank-selector-sheet" role="dialog" aria-modal="true">
      <div class="bank-selector-search">
        <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
        </svg>
        <input
          v-model="query"
          type="search"
          class="search-input"
          placeholder="Search bank"
          autocomplete="off"
        >
      </div>

      <ul ref="listEl" class="bank-list">
        <li v-for="bank in banksFiltered" :key="String(bank.id)" class="bank-row">
          <button
            type="button"
            class="bank-button"
            :class="{ active: isSelected(bank) }"
            :data-id="bank.id"
            @click="select(bank)"
          >
            <span class="bank-name">{{ bank.name }}</span>

            <svg v-if="isSelected(bank)" class="check-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  bankOptions: { type: Array, default: () => [] },
  selectedBankId: { type: [Number, String, null], default: null },
  nullLabel: { type: String, default: 'Choose bank' }
})

const emit = defineEmits(['close', 'select'])

const query = ref('')
const listEl = ref(null)

const allOptions = computed(() => {
  return [{ id: null, name: props.nullLabel }, ...props.bankOptions]
})

const banksFiltered = computed(() => {
  const q = String(query.value || '').trim().toLowerCase()
  const list = allOptions.value
  if (!q) return list
  return list.filter((b) => {
    const name = String(b.name || '').toLowerCase()
    return name.includes(q)
  })
})

const emitClose = () => {
  emit('close')
}

const isSelected = (bank) => {
  return String(props.selectedBankId ?? '') === String(bank?.id ?? '')
}

const select = (bank) => {
  emit('select', bank)
  emitClose()
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    query.value = ''
    nextTick(() => {
      const id = String(props.selectedBankId ?? '')
      const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '')
      const target = listEl.value?.querySelector?.(`[data-id="${safeId}"]`)
      target?.scrollIntoView?.({ block: 'center' })
    })
  }
})
</script>

<style scoped>
.bank-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 2050;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

.bank-selector-sheet {
  width: 100%;
  max-width: 412px;
  background: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
  height: 50vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
}

.bank-selector-search {
  padding: 12px;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
  fill: rgba(0, 0, 0, 0.45);
}

.search-input {
  width: 100%;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #ffffff;
  padding: 0 12px 0 40px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.bank-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: auto;
  flex: 1;
}

.bank-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.bank-button {
  width: 100%;
  background: transparent;
  border: none;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  color: #000000;
  transition: background-color 0.2s ease;
}

.bank-button:active {
  background-color: #f8f9fa;
}

.bank-name {
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bank-button.active .bank-name {
  font-weight: 600;
  color: #1b46f5;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: #1b46f5;
}
</style>
