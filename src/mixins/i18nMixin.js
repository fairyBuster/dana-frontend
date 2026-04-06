/**
 * Mixin global untuk memaksa komponen di-refresh saat bahasa berubah
 */

import { watch, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { locale } = useI18n()
    const componentKey = ref(0)
    
    // Watch for language changes
    watch(() => locale.value, async () => {
      // Force component refresh by changing key
      componentKey.value += 1
      
      // Wait for next tick to ensure DOM is updated
      await nextTick()
    })
    
    return {
      componentKey
    }
  }
}
