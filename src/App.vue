<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <keep-alive :exclude="['ProductDetails']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { initSettings } from '@/utils/settings'

const { locale } = useI18n()

onMounted(() => {
  initSettings()
  document.documentElement.setAttribute('lang', locale.value)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

#app {
  min-height: 100vh;
}
</style>
