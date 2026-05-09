<template>
  <div v-if="show" class="country-selector-overlay" @click.self="close">
    <div class="country-selector-sheet" role="dialog" aria-modal="true">
      <div class="country-selector-search">
        <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
        </svg>
        <input
          v-model="query"
          type="search"
          class="search-input"
          placeholder="Search"
          autocomplete="off"
        >
      </div>

      <ul ref="listEl" class="country-list">
        <li v-for="country in countriesFiltered" :key="country.code" class="country-row">
          <button
            type="button"
            class="country-button"
            :class="{ active: isSelected(country) }"
            :data-code="country.code"
            @click="select(country)"
          >
            <span class="country-left">
              <span class="country-name">{{ country.name }}</span>
              <img
                v-if="country.flagUrl && !failedFlagCodes[country.code]"
                :src="country.flagUrl"
                :alt="country.name + ' flag'"
                class="country-flag-img"
                loading="lazy"
                @error="handleFlagError(country)"
              >
              <span v-else class="country-flag">{{ country.flag }}</span>
              <span class="country-dial">(+{{ country.dialCode }})</span>
            </span>

            <svg v-if="isSelected(country)" class="check-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'

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

const query = ref('')
const listEl = ref(null)

const countries = ref([])
const failedFlagCodes = ref({})

const toFlagEmoji = (cca2) => {
  const code = String(cca2 || '').toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) return '🏳️'
  return code
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

const toDialCode = (idd) => {
  const root = String(idd?.root || '').replace(/\D/g, '')
  const suffix = Array.isArray(idd?.suffixes) ? String(idd.suffixes[0] || '').replace(/\D/g, '') : ''
  return suffix ? `${root}${suffix}` : root
}

const countriesLoaded = ref(false)
const countriesLoading = ref(false)

const loadCountries = async () => {
  if (countriesLoading.value || countriesLoaded.value) return
  countriesLoading.value = true

  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags')
    if (!response.ok) throw new Error(`Failed to load countries (${response.status})`)
    const data = await response.json()

    const normalized = (Array.isArray(data) ? data : [])
      .map((c) => {
        const code = String(c?.cca2 || '').toUpperCase()
        const name = String(c?.name?.common || c?.name?.official || code).trim()
        const dialCode = toDialCode(c?.idd)
        const flag = toFlagEmoji(code)
        const rawFlagUrl = String(c?.flags?.png || c?.flags?.svg || '')
        const flagUrl = code === 'AF' ? '' : rawFlagUrl
        return { name, code, dialCode, flag, flagUrl }
      })
      .filter((c) => c.code && c.dialCode && c.name)

    countries.value = normalized
    countriesLoaded.value = true
  } finally {
    countriesLoading.value = false
  }
}

const handleFlagError = (country) => {
  const code = String(country?.code || '').toUpperCase()
  if (!code) return
  failedFlagCodes.value = { ...failedFlagCodes.value, [code]: true }
}

const tempSelected = ref(props.selectedCountry)

const countriesSorted = computed(() => {
  return [...countries.value].sort((a, b) => a.name.localeCompare(b.name))
})

const countriesFiltered = computed(() => {
  const q = String(query.value || '').trim().toLowerCase()
  const list = countriesSorted.value
  if (!q) return list
  return list.filter((c) => {
    const name = String(c.name || '').toLowerCase()
    const code = String(c.code || '').toLowerCase()
    const dial = String(c.dialCode || '')
    return name.includes(q) || code.includes(q) || dial.includes(q) || `+${dial}`.includes(q)
  })
})

const close = () => {
  emit('update:show', false)
}

const isSelected = (country) => {
  return String(tempSelected.value?.code || '') === String(country?.code || '')
}

const select = (country) => {
  tempSelected.value = country
  emit('select', country)
  close()
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    loadCountries()
    tempSelected.value = props.selectedCountry
    query.value = ''
    nextTick(() => {
      const code = String(props.selectedCountry?.code || '')
      const safeCode = code.replace(/[^a-zA-Z0-9_-]/g, '')
      const target = listEl.value?.querySelector?.(`[data-code="${safeCode}"]`)
      target?.scrollIntoView?.({ block: 'center' })
    })
  }
})

onMounted(() => {
  loadCountries()
})
</script>

<style scoped>
.country-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 1050;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

.country-selector-sheet {
  width: 100%;
  max-width: none;
  background: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  overflow: hidden;
  height: 50vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
}

.country-selector-search {
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

.country-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: auto;
}

.country-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.country-button {
  width: 100%;
  background: transparent;
  border: none;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-family: inherit;
  color: #000000;
}

.country-left {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.country-flag {
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
}

.country-flag-img {
  width: 18px;
  height: 12px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}

.country-name {
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}

.country-dial {
  font-size: 14px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.55);
  flex-shrink: 0;
}

.country-button.active .country-name {
  font-weight: 600;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: rgba(0, 0, 0, 0.75);
}
</style>
