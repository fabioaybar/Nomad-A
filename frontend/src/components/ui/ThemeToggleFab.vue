<template>
  <!-- TEMP THEME FAB: remove this component and usage to disable -->
  <div class="fixed bottom-6 right-6 z-50">
    <button
      @click="settings.cycleThemeMode()"
      class="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl bg-white text-gray-800 hover:scale-105 transition-transform dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
      :title="`Theme: ${settings.themeMode}`"
      aria-label="Toggle theme mode"
    >
      <span v-if="settings.themeMode === 'light'">🌤️</span>
      <span v-else-if="settings.themeMode === 'dark'">🌙</span>
      <span v-else>🌓</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../../stores/settings'
const settings = useSettingsStore()
</script>

<style scoped>
</style>


