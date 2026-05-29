<template>
  <div v-if="visible" class="bank-selector-overlay" @click.self="emitClose">
    <div class="bank-selector-sheet" role="dialog" aria-modal="true">
      <div class="bank-selector-header">
        <h3 class="sheet-title">Pilih Bank</h3>
        <button type="button" class="close-btn" aria-label="Tutup" @click="emitClose">×</button>
      </div>
      <div class="bank-selector-search">
        <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
        </svg>
        <input
          v-model="query"
          type="search"
          class="search-input"
          placeholder="Cari bank"
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
            <span class="bank-selected-badge" aria-hidden="true">
              <svg v-if="isSelected(bank)" class="check-icon" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
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
  nullLabel: { type: String, default: 'Pilih bank' }
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
  background: rgba(0, 0, 0, 0.5);
  z-index: 2050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.bank-selector-sheet {
  width: 100%;
  max-width: 360px;
  background: linear-gradient(180deg, #FEFDFE 0%, #FDF8EA 100%);
  border-radius: 18px;
  overflow: hidden;
  max-height: 72vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.bank-selector-header {
  position: relative;
  padding: 14px 14px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sheet-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #000000;
}

.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.75);
  color: rgba(0, 0, 0, 0.75);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.bank-selector-search {
  padding: 0 14px 12px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 26px;
  top: 20px;
  width: 16px;
  height: 16px;
  transform: translateY(0);
  fill: rgba(0, 0, 0, 0.55);
}

.search-input {
  width: 100%;
  height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.14);
  background: rgba(255, 255, 255, 0.7);
  padding: 0 12px 0 40px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
}

.search-input:focus {
  border-color: #f4bd40;
  box-shadow: 0 0 0 3px rgba(244, 189, 64, 0.22);
}

.bank-list {
  list-style: none;
  margin: 0;
  padding: 0 14px 14px;
  overflow: auto;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.bank-row {
  border: none;
}

.bank-button {
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.10);
  padding: 14px 10px;
  display: grid;
  place-items: center;
  text-align: center;
  cursor: pointer;
  font-family: inherit;
  color: #000000;
  transition: transform 0.15s ease, border-color 0.2s ease, background-color 0.2s ease;
  border-radius: 14px;
  position: relative;
  min-height: 56px;
}

.bank-button:active {
  transform: scale(0.98);
}

.bank-button.active {
  border-color: rgba(244, 189, 64, 0.9);
  background: rgba(244, 189, 64, 0.20);
}

.bank-name {
  font-size: 13px;
  line-height: 18px;
  white-space: normal;
  overflow: hidden;
  text-overflow: unset;
  word-break: break-word;
}

.bank-selected-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.06);
  color: transparent;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: #000000;
}
</style>
