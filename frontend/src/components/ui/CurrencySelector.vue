<template>
  <div class="currency-selector">
    <!-- Currency Selection Modal -->
    <div v-if="localeStore.showCurrencySelector" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-black dark:bg-opacity-60" @click="localeStore.hideCurrencySelection"></div>

        <!-- Modal panel -->
        <div class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl dark:bg-gray-800 dark:border dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
              {{ t('currency.select_currency') }}
            </h3>
            <button
              @click="localeStore.hideCurrencySelection"
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

          <!-- Currency List -->
          <div class="max-h-64 overflow-y-auto">
            <div
              v-for="currency in filteredCurrencies"
              :key="currency.code"
              @click="selectCurrency(currency)"
              class="flex items-center p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors dark:hover:bg-gray-700"
            >
              <div class="flex-1">
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ currency.code }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-300">
                  {{ currency.name }} ({{ currency.symbol }})
                </div>
              </div>
              <div v-if="localeStore.userCurrency?.code === currency.code" class="text-primary-600">
                <Check class="w-5 h-5" />
              </div>
            </div>
          </div>

          <!-- Exchange Rate Information -->
          <div v-if="localeStore.userCurrency && localeStore.exchangeRate !== 1" class="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
            <h4 class="font-medium text-gray-900 mb-2 dark:text-gray-100">{{ t('currency.exchange_info') }}</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">{{ t('currency.base_currency') }}:</span>
                <span class="font-medium">CLP (Chilean Peso)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-300">{{ t('currency.exchange_rate') }}:</span>
                <span class="font-medium">
                  1 CLP = {{ localeStore.exchangeRate.toFixed(4) }} {{ localeStore.userCurrency.code }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Currency Display Button -->
    <button
      @click="localeStore.showCurrencySelection"
      class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
    >
      <span v-if="localeStore.userCurrency" class="font-medium">
        {{ localeStore.userCurrency.code }}
      </span>
      <span v-if="localeStore.userCurrency" class="text-xs text-gray-500 dark:text-gray-400">
        {{ localeStore.userCurrency.symbol }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Check } from 'lucide-vue-next'
import { useLocaleStore, type Currency } from '../../stores/locale'
import { useTranslation } from '../../services/i18n'

const localeStore = useLocaleStore()
const { t } = useTranslation()

const searchQuery = ref('')

// Get unique currencies from countries
const availableCurrencies = computed(() => {
  const currencies = new Map<string, Currency>()
  
  // Add CLP as base currency
  currencies.set('CLP', {
    code: 'CLP',
    name: 'Chilean Peso',
    symbol: '$',
    rate: 1
  })
  
  // Add currencies from countries
  localeStore.availableCountries.forEach(country => {
    if (!currencies.has(country.currency)) {
      currencies.set(country.currency, {
        code: country.currency,
        name: country.currency,
        symbol: country.currencySymbol,
        rate: 1
      })
    }
  })
  
  return Array.from(currencies.values()).sort((a, b) => a.code.localeCompare(b.code))
})

// Filter currencies based on search query
const filteredCurrencies = computed(() => {
  if (!searchQuery.value) return availableCurrencies.value
  
  const query = searchQuery.value.toLowerCase()
  return availableCurrencies.value.filter(currency =>
    currency.code.toLowerCase().includes(query) ||
    currency.name.toLowerCase().includes(query) ||
    currency.symbol.toLowerCase().includes(query)
  )
})

const selectCurrency = async (currency: Currency) => {
  // Find a country that uses this currency
  const country = localeStore.availableCountries.find(c => c.currency === currency.code)
  if (country) {
    await localeStore.selectCountry(country)
  }
  searchQuery.value = ''
}
</script>

<style scoped>
.currency-selector {
  position: relative;
}
</style>
