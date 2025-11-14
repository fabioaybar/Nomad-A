<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <!-- 404 Icon -->
      <div class="mb-8">
        <div class="w-32 h-32 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle class="w-16 h-16 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      <!-- Error Message -->
      <h1 class="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ t('notFound.title') }}</h1>
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t('notFound.subtitle') }}</h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
        {{ t('notFound.description') }}
      </p>

      <!-- Action Buttons -->
      <div class="space-y-4">
        <RouterLink
          to="/"
          class="block w-full bg-primary-600 dark:bg-primary-500 text-white px-6 py-3 rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors font-medium"
        >
          {{ t('notFound.goHome') }}
        </RouterLink>
        <button
          @click="goBack"
          class="block w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
        >
          {{ t('notFound.goBack') }}
        </button>
      </div>

      <!-- Helpful Links -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">{{ t('notFound.popularPages') }}</h3>
        <div class="grid grid-cols-2 gap-4">
          <RouterLink
            to="/vehicles"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            {{ t('notFound.browseVehicles') }}
          </RouterLink>
          <RouterLink
            to="/status"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            {{ t('notFound.systemStatus') }}
          </RouterLink>
          <RouterLink
            to="/login"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            {{ t('notFound.signIn') }}
          </RouterLink>
          <RouterLink
            to="/register"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            {{ t('notFound.signUp') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { AlertTriangle } from 'lucide-vue-next'
import { useTranslation } from '../../services/i18n'

const router = useRouter()
const { t } = useTranslation()

/**
 * Go back to previous page
 */
function goBack() {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>
