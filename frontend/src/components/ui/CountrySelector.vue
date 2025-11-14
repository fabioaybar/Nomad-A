<template>
  <div class="country-selector">
    <!-- Country Selection Modal -->
    <div v-if="localeStore.showCountrySelector" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-black dark:bg-opacity-60" @click="localeStore.hideCountrySelection"></div>

        <!-- Modal panel -->
        <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ t('locale.select_country') }}
            </h3>
            <button
              @click="localeStore.hideCountrySelection"
              class="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Search -->
          <div class="mb-4">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('common.search')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-300"
            />
          </div>

          <!-- Country List -->
          <div class="max-h-64 overflow-y-auto">
            <div
              v-for="country in filteredCountries"
              :key="country.code"
              @click="selectCountry(country)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors dark:hover:bg-gray-700"
            >
              <span class="text-2xl mr-3">{{ country.flag }}</span>
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

          <!-- Currency Information -->
          <div v-if="localeStore.currentCountry" class="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
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
        </div>
      </div>
    </div>

    <!-- Country Display Button -->
    <button
      @click="localeStore.showCountrySelection"
      class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
    >
      <span v-if="localeStore.currentCountry" class="text-lg">
        {{ localeStore.currentCountry.flag }}
      </span>
      <span v-if="localeStore.currentCountry" class="hidden sm:block">
        {{ localeStore.currentCountry.name }}
      </span>
      <Globe class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X, Check, Globe } from 'lucide-vue-next'
import { useLocaleStore, type Country } from '../../stores/locale'
import { useTranslation } from '../../services/i18n'

const localeStore = useLocaleStore()
const { t } = useTranslation()

const searchQuery = ref('')

// Filter countries based on search query
const filteredCountries = computed(() => {
  if (!searchQuery.value) return localeStore.availableCountries
  
  const query = searchQuery.value.toLowerCase()
  return localeStore.availableCountries.filter(country =>
    country.name.toLowerCase().includes(query) ||
    country.code.toLowerCase().includes(query) ||
    country.currency.toLowerCase().includes(query)
  )
})

const selectCountry = async (country: Country) => {
  await localeStore.selectCountry(country)
  searchQuery.value = ''
}

onMounted(() => {
  // Load saved country or detect automatically
  localeStore.loadSavedCountry()
  if (!localeStore.selectedCountry) {
    localeStore.detectCountry()
  }
})
</script>

<style scoped>
.country-selector {
  position: relative;
}
</style>
