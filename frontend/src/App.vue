<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading Screen -->
    <div v-if="authStore.loading" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div class="text-center">
        <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600">
          <span class="text-lg font-semibold tracking-tight align-baseline">Nomad</span>
          <img :src="rafLogo" alt="A" class="inline-block h-4 w-auto -ml-0.5 align-baseline translate-y-[2px]" />
          <span class="ml-1">is loading...</span>
        </p>
      </div>
    </div>

    <!-- Main App -->
    <div v-else class="flex flex-col min-h-screen">
      <!-- Welcome Screen -->
      <WelcomeScreen />
      
      <!-- Weather Bar -->
      <WeatherBar v-if="!isAuthPage" />
      
      <!-- Navigation -->
      <Navbar v-if="!isAuthPage" />
      
      <!-- Main Content -->
      <main class="flex-1">
        <RouterView />
      </main>
      
      <!-- Footer -->
      <Footer v-if="!isAuthPage" />
    </div>

    <!-- Notifications -->
    <NotificationContainer />
    <!-- Floating Theme Toggle -->
    <ThemeToggleFab />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useSettingsStore } from './stores/settings'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import NotificationContainer from './components/ui/NotificationContainer.vue'
import WelcomeScreen from './components/ui/WelcomeScreen.vue'
import WeatherBar from './components/ui/WeatherBar.vue'
import ThemeToggleFab from './components/ui/ThemeToggleFab.vue'
// Use URL resolution to keep image path stable
const rafLogo = new URL('./components/layout/raf.png', import.meta.url).href

const route = useRoute()
const authStore = useAuthStore()
const settings = useSettingsStore()

const isAuthPage = computed(() => {
  return route.name === 'login' || route.name === 'register'
})

onMounted(async () => {
  // Initialize auth state
  await authStore.initializeAuth()
  // Ensure theme is applied on app mount
  settings.setThemeMode(settings.themeMode)
})
</script>