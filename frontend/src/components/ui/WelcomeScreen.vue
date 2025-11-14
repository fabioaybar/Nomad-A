<template>
  <div v-if="showWelcome" class="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-black/40">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl dark:bg-gray-800 dark:text-gray-100 dark:border dark:border-gray-700">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900/40">
            <Globe class="w-8 h-8 text-primary-600" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">
            {{ t('locale.welcome_title') }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            {{ t('locale.welcome_subtitle') }}
          </p>
        </div>

        <!-- Detected Country -->
        <div v-if="localeStore.detectedCountry && !localeStore.isLoading" class="mb-6">
          <div class="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
            <div class="flex items-center">
              <CheckCircle class="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p class="text-sm font-medium text-green-800 dark:text-green-300">
                  {{ t('locale.detected_country') }}
                </p>
                <p class="text-sm text-green-700 dark:text-green-300/90">
                  {{ localeStore.detectedCountry.flag }} {{ localeStore.detectedCountry.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="localeStore.isLoading" class="mb-6 text-center">
          <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-3"></div>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('locale.detecting_location') }}</p>
        </div>

        <!-- Country Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3 dark:text-gray-200">
            {{ t('locale.select_country') }}
          </label>
          <div class="max-h-48 overflow-y-auto border border-gray-300 rounded-lg dark:border-gray-700">
            <div
              v-for="country in localeStore.availableCountries"
              :key="country.code"
              @click="selectCountry(country)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors dark:hover:bg-gray-700 dark:border-gray-700"
            >
              <span class="text-xl mr-3">{{ country.flag }}</span>
              <div class="flex-1">
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ country.name }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-300">
                  {{ country.currency }} ({{ country.currencySymbol }})
                </div>
              </div>
              <div v-if="localeStore.currentCountry?.code === country.code" class="text-primary-600">
                <Check class="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        <!-- Currency Information -->
        <div v-if="localeStore.currentCountry" class="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
          <h4 class="font-medium text-gray-900 mb-2 dark:text-gray-100">{{ t('locale.currency_info') }}</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">{{ t('locale.local_currency') }}:</span>
              <span class="font-medium">
                {{ localeStore.localCurrency?.code }} ({{ localeStore.localCurrency?.symbol }})
              </span>
            </div>
            <div v-if="localeStore.exchangeRate !== 1" class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">{{ t('locale.exchange_rate') }}:</span>
              <span class="font-medium">
                1 {{ localeStore.localCurrency?.code }} = {{ localeStore.exchangeRate.toFixed(4) }} {{ localeStore.userCurrency?.code }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex space-x-3">
          <button
            @click="confirmSelection"
            :disabled="!localeStore.currentCountry || localeStore.isLoading"
            class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('common.continue') }}
          </button>
          <button
            @click="skipWelcome"
            class="flex-1 btn-secondary"
          >
            {{ t('common.skip') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Globe, CheckCircle, Check } from 'lucide-vue-next'
import { useLocaleStore, type Country } from '../../stores/locale'
import { useTranslation } from '../../services/i18n'

const localeStore = useLocaleStore()
const { t } = useTranslation()

const showWelcome = ref(false)

// Show welcome screen if no country is selected
const shouldShowWelcome = computed(() => {
  return !localeStore.selectedCountry && !localeStore.isLoading
})

const selectCountry = async (country: Country) => {
  await localeStore.selectCountry(country)
}

const confirmSelection = () => {
  showWelcome.value = false
  localStorage.setItem('welcomeShown', 'true')
}

const skipWelcome = () => {
  showWelcome.value = false
  localStorage.setItem('welcomeShown', 'true')
  // Set default country if none selected
  if (!localeStore.selectedCountry) {
    const defaultCountry = localeStore.availableCountries.find(c => c.code === 'US')
    if (defaultCountry) {
      localeStore.selectCountry(defaultCountry)
    }
  }
}

onMounted(() => {
  // Check if welcome screen has been shown before
  const welcomeShown = localStorage.getItem('welcomeShown')
  if (!welcomeShown && shouldShowWelcome.value) {
    showWelcome.value = true
  }
})
</script>

<style scoped>
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
