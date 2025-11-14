<template>
  <div class="currency-display">
    <!-- Primary Currency Display -->
    <div :class="['text-lg font-semibold', textColor]">
      {{ formatPrice(amount, localeStore.localCurrency) }}
    </div>
    
    <!-- Secondary Currency Display (if different) -->
    <div v-if="showSecondaryCurrency && localeStore.exchangeRate !== 1" class="text-sm text-gray-500">
      ≈ {{ formatPrice(convertedAmount, localeStore.userCurrency) }}
    </div>
    
    <!-- Exchange Rate Info (on hover) -->
    <div v-if="showExchangeInfo && localeStore.exchangeRate !== 1" class="mt-1 text-xs text-gray-400">
      {{ t('locale.exchange_rate') }}: 1 {{ localeStore.localCurrency?.code }} = {{ localeStore.exchangeRate.toFixed(4) }} {{ localeStore.userCurrency?.code }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocaleStore } from '../../stores/locale'
import { useTranslation } from '../../services/i18n'

const localeStore = useLocaleStore()
const { t } = useTranslation()

interface Props {
  amount: number
  showSecondaryCurrency?: boolean
  showExchangeInfo?: boolean
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  showSecondaryCurrency: true,
  showExchangeInfo: false,
  textColor: 'text-gray-900 dark:text-gray-100'
})

// Convert amount to user currency
const convertedAmount = computed(() => {
  if (!localeStore.localCurrency || !localeStore.userCurrency) return props.amount
  
  return localeStore.convertCurrency(
    props.amount,
    localeStore.localCurrency.code,
    localeStore.userCurrency.code
  )
})

// Format price with currency
const formatPrice = (amount: number, currency: any) => {
  if (!currency) return `${amount}`
  const code = typeof currency === 'string' ? currency : currency.code
  return localeStore.formatCurrency(amount, code)
}
</script>

<style scoped>
.currency-display {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
