import { computed } from 'vue'
import { useLocaleStore } from '../stores/locale'

export function useCurrencyConversion() {
  const localeStore = useLocaleStore()

  // Convert CLP amount to user's selected currency
  const convertFromCLP = (clpAmount: number): number => {
    if (!localeStore.userCurrency || !localeStore.exchangeRate) return clpAmount
    return clpAmount * localeStore.exchangeRate
  }

  // Convert user's currency amount back to CLP
  const convertToCLP = (amount: number): number => {
    if (!localeStore.userCurrency || !localeStore.exchangeRate) return amount
    return amount / localeStore.exchangeRate
  }

  // Format currency with proper symbol and locale
  const formatCurrency = (amount: number, showSymbol: boolean = true): string => {
    if (!localeStore.userCurrency) {
      return `$${amount.toLocaleString()}`
    }

    const convertedAmount = convertFromCLP(amount)
    const symbol = localeStore.userCurrency.symbol
    const code = localeStore.userCurrency.code

    if (showSymbol) {
      return `${symbol}${convertedAmount.toLocaleString()}`
    } else {
      return `${convertedAmount.toLocaleString()} ${code}`
    }
  }

  // Get current currency info
  const currentCurrency = computed(() => localeStore.userCurrency)
  const exchangeRate = computed(() => localeStore.exchangeRate)
  const isCLP = computed(() => localeStore.userCurrency?.code === 'CLP')

  return {
    convertFromCLP,
    convertToCLP,
    formatCurrency,
    currentCurrency,
    exchangeRate,
    isCLP
  }
}
