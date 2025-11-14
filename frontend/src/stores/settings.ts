import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // TEMP FEATURE FLAG: External APIs Toggle
  // Remove this block and related usages when you no longer need to disable external APIs.
  const externalApisEnabled = ref<boolean>(
    localStorage.getItem('external_apis_enabled') === 'true'
  )

  watch(externalApisEnabled, (newVal) => {
    localStorage.setItem('external_apis_enabled', String(newVal))
  }, { immediate: true })

  const toggleExternalApis = () => {
    externalApisEnabled.value = !externalApisEnabled.value
  }

  const setExternalApisEnabled = (enabled: boolean) => {
    externalApisEnabled.value = enabled
  }

  // THEME: 'light' | 'dark' | 'auto'
  const themeMode = ref<'light' | 'dark' | 'auto'>(
    (localStorage.getItem('theme_mode') as 'light' | 'dark' | 'auto') || 'auto'
  )

  const applyThemeClass = () => {
    const root = document.documentElement
    const shouldDark = themeMode.value === 'dark' || (themeMode.value === 'auto' && isNightNow())
    root.classList.toggle('dark', shouldDark)
  }

  const isNightNow = () => {
    const hour = new Date().getHours()
    return hour < 6 || hour >= 18
  }

  const setThemeMode = (mode: 'light' | 'dark' | 'auto') => {
    themeMode.value = mode
    localStorage.setItem('theme_mode', mode)
    applyThemeClass()
  }

  const cycleThemeMode = () => {
    const order: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto']
    const next = order[(order.indexOf(themeMode.value) + 1) % order.length]
    setThemeMode(next)
  }

  // Apply on load and when changes occur
  if (typeof window !== 'undefined') {
    applyThemeClass()
    // Re-evaluate periodically in auto mode
    setInterval(() => {
      if (themeMode.value === 'auto') applyThemeClass()
    }, 60 * 1000)
  }

  return {
    externalApisEnabled,
    toggleExternalApis,
    setExternalApisEnabled,
    themeMode,
    setThemeMode,
    cycleThemeMode,
  }
})

// TEMP FEATURE FLAG: helper to guard external API usage in services/components
// To remove: delete this function and its imports/usages.
export const createExternalApisGuard = () => {
  const settings = useSettingsStore()
  return () => {
    if (!settings.externalApisEnabled) {
      throw new Error('External APIs are disabled')
    }
  }
}



