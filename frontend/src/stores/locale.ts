import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCurrencyConversionUrl } from '../config/api'

export interface Country {
  code: string
  name: string
  currency: string
  currencySymbol: string
  language: string
  flag: string
}

export interface Currency {
  code: string
  name: string
  symbol: string
  rate: number
}

export const useLocaleStore = defineStore('locale', () => {
  // State
  const detectedCountry = ref<Country | null>(null)
  const selectedCountry = ref<Country | null>(null)
  const userCurrency = ref<Currency | null>(null)
  const localCurrency = ref<Currency | null>(null)
  const exchangeRate = ref<number>(1)
  const isLoading = ref(false)
  const showCountrySelector = ref(false)
  const showCurrencySelector = ref(false)

  // Currency conversion helper
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (fromCurrency === toCurrency) return amount
    return amount * exchangeRate.value
  }

  // Format currency with number formatting
  const formatCurrency = (amount: number, currencyCode: string = 'CLP'): string => {
    const language = currentLanguage.value || 'en'
    const country = currentCountry.value?.code || 'CL'
    const currencyLocale = `${language}-${country}`
    return new Intl.NumberFormat(currencyLocale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // CLP (Chilean Peso) as base currency for vehicle pricing
  const CLP_CURRENCY: Currency = {
    code: 'CLP',
    name: 'Chilean Peso',
    symbol: '$',
    rate: 1
  }

  // Available countries with their currencies and languages
  const availableCountries: Country[] = [
    { code: 'CL', name: 'Chile', currency: 'CLP', currencySymbol: '$', language: 'es', flag: '🇨🇱' },
    { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', language: 'en', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', language: 'en', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'C$', language: 'en', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', language: 'en', flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', language: 'de', flag: '🇩🇪' },
    { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', language: 'fr', flag: '🇫🇷' },
    { code: 'ES', name: 'Spain', currency: 'EUR', currencySymbol: '€', language: 'es', flag: '🇪🇸' },
    { code: 'IT', name: 'Italy', currency: 'EUR', currencySymbol: '€', language: 'it', flag: '🇮🇹' },
    { code: 'JP', name: 'Japan', currency: 'JPY', currencySymbol: '¥', language: 'ja', flag: '🇯🇵' },
    { code: 'CN', name: 'China', currency: 'CNY', currencySymbol: '¥', language: 'zh', flag: '🇨🇳' },
    { code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', language: 'pt', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', currency: 'MXN', currencySymbol: '$', language: 'es', flag: '🇲🇽' },
    { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', language: 'hi', flag: '🇮🇳' },
    { code: 'RU', name: 'Russia', currency: 'RUB', currencySymbol: '₽', language: 'ru', flag: '🇷🇺' },
    { code: 'KR', name: 'South Korea', currency: 'KRW', currencySymbol: '₩', language: 'ko', flag: '🇰🇷' },
    { code: 'NL', name: 'Netherlands', currency: 'EUR', currencySymbol: '€', language: 'nl', flag: '🇳🇱' },
    { code: 'SE', name: 'Sweden', currency: 'SEK', currencySymbol: 'kr', language: 'sv', flag: '🇸🇪' },
    { code: 'NO', name: 'Norway', currency: 'NOK', currencySymbol: 'kr', language: 'no', flag: '🇳🇴' },
    { code: 'DK', name: 'Denmark', currency: 'DKK', currencySymbol: 'kr', language: 'da', flag: '🇩🇰' },
    { code: 'CH', name: 'Switzerland', currency: 'CHF', currencySymbol: 'CHF', language: 'de', flag: '🇨🇭' },
    { code: 'NZ', name: 'New Zealand', currency: 'NZD', currencySymbol: 'NZ$', language: 'en', flag: '🇳🇿' },
    { code: 'SG', name: 'Singapore', currency: 'SGD', currencySymbol: 'S$', language: 'en', flag: '🇸🇬' },
    { code: 'HK', name: 'Hong Kong', currency: 'HKD', currencySymbol: 'HK$', language: 'zh', flag: '🇭🇰' },
    { code: 'TH', name: 'Thailand', currency: 'THB', currencySymbol: '฿', language: 'th', flag: '🇹🇭' },
    { code: 'MY', name: 'Malaysia', currency: 'MYR', currencySymbol: 'RM', language: 'ms', flag: '🇲🇾' },
    { code: 'ID', name: 'Indonesia', currency: 'IDR', currencySymbol: 'Rp', language: 'id', flag: '🇮🇩' },
    { code: 'PH', name: 'Philippines', currency: 'PHP', currencySymbol: '₱', language: 'en', flag: '🇵🇭' },
    { code: 'VN', name: 'Vietnam', currency: 'VND', currencySymbol: '₫', language: 'vi', flag: '🇻🇳' },
    { code: 'TR', name: 'Turkey', currency: 'TRY', currencySymbol: '₺', language: 'tr', flag: '🇹🇷' },
    { code: 'PL', name: 'Poland', currency: 'PLN', currencySymbol: 'zł', language: 'pl', flag: '🇵🇱' },
    { code: 'CZ', name: 'Czech Republic', currency: 'CZK', currencySymbol: 'Kč', language: 'cs', flag: '🇨🇿' },
    { code: 'HU', name: 'Hungary', currency: 'HUF', currencySymbol: 'Ft', language: 'hu', flag: '🇭🇺' },
    { code: 'RO', name: 'Romania', currency: 'RON', currencySymbol: 'lei', language: 'ro', flag: '🇷🇴' },
    { code: 'BG', name: 'Bulgaria', currency: 'BGN', currencySymbol: 'лв', language: 'bg', flag: '🇧🇬' },
    { code: 'HR', name: 'Croatia', currency: 'HRK', currencySymbol: 'kn', language: 'hr', flag: '🇭🇷' },
    { code: 'IS', name: 'Iceland', currency: 'ISK', currencySymbol: 'kr', language: 'is', flag: '🇮🇸' },
    { code: 'IL', name: 'Israel', currency: 'ILS', currencySymbol: '₪', language: 'he', flag: '🇮🇱' },
    { code: 'AE', name: 'UAE', currency: 'AED', currencySymbol: 'د.إ', language: 'ar', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencySymbol: 'ر.س', language: 'ar', flag: '🇸🇦' },
    { code: 'QA', name: 'Qatar', currency: 'QAR', currencySymbol: 'ر.ق', language: 'ar', flag: '🇶🇦' },
    { code: 'KW', name: 'Kuwait', currency: 'KWD', currencySymbol: 'د.ك', language: 'ar', flag: '🇰🇼' },
    { code: 'BH', name: 'Bahrain', currency: 'BHD', currencySymbol: 'د.ب', language: 'ar', flag: '🇧🇭' },
    { code: 'OM', name: 'Oman', currency: 'OMR', currencySymbol: 'ر.ع.', language: 'ar', flag: '🇴🇲' },
    { code: 'JO', name: 'Jordan', currency: 'JOD', currencySymbol: 'د.ا', language: 'ar', flag: '🇯🇴' },
    { code: 'LB', name: 'Lebanon', currency: 'LBP', currencySymbol: 'ل.ل', language: 'ar', flag: '🇱🇧' },
    { code: 'EG', name: 'Egypt', currency: 'EGP', currencySymbol: '£', language: 'ar', flag: '🇪🇬' },
    { code: 'MA', name: 'Morocco', currency: 'MAD', currencySymbol: 'د.م.', language: 'ar', flag: '🇲🇦' },
    { code: 'TN', name: 'Tunisia', currency: 'TND', currencySymbol: 'د.ت', language: 'ar', flag: '🇹🇳' },
    { code: 'DZ', name: 'Algeria', currency: 'DZD', currencySymbol: 'د.ج', language: 'ar', flag: '🇩🇿' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', language: 'en', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', currency: 'GHS', currencySymbol: '₵', language: 'en', flag: '🇬🇭' },
    { code: 'KE', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', language: 'en', flag: '🇰🇪' },
    { code: 'UG', name: 'Uganda', currency: 'UGX', currencySymbol: 'USh', language: 'en', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', language: 'sw', flag: '🇹🇿' },
    { code: 'ET', name: 'Ethiopia', currency: 'ETB', currencySymbol: 'Br', language: 'am', flag: '🇪🇹' },
    { code: 'MW', name: 'Malawi', currency: 'MWK', currencySymbol: 'MK', language: 'en', flag: '🇲🇼' },
    { code: 'ZM', name: 'Zambia', currency: 'ZMW', currencySymbol: 'ZK', language: 'en', flag: '🇿🇲' },
    { code: 'BW', name: 'Botswana', currency: 'BWP', currencySymbol: 'P', language: 'en', flag: '🇧🇼' },
    { code: 'SZ', name: 'Eswatini', currency: 'SZL', currencySymbol: 'L', language: 'en', flag: '🇸🇿' },
    { code: 'LS', name: 'Lesotho', currency: 'LSL', currencySymbol: 'L', language: 'en', flag: '🇱🇸' },
    { code: 'MU', name: 'Mauritius', currency: 'MUR', currencySymbol: '₨', language: 'en', flag: '🇲🇺' },
    { code: 'SC', name: 'Seychelles', currency: 'SCR', currencySymbol: '₨', language: 'en', flag: '🇸🇨' },
    { code: 'MG', name: 'Madagascar', currency: 'MGA', currencySymbol: 'Ar', language: 'mg', flag: '🇲🇬' },
    { code: 'KM', name: 'Comoros', currency: 'KMF', currencySymbol: 'CF', language: 'ar', flag: '🇰🇲' },
    { code: 'DJ', name: 'Djibouti', currency: 'DJF', currencySymbol: 'Fdj', language: 'ar', flag: '🇩🇯' },
    { code: 'SO', name: 'Somalia', currency: 'SOS', currencySymbol: 'S', language: 'so', flag: '🇸🇴' },
    { code: 'ER', name: 'Eritrea', currency: 'ERN', currencySymbol: 'Nfk', language: 'ti', flag: '🇪🇷' },
    { code: 'SD', name: 'Sudan', currency: 'SDG', currencySymbol: 'ج.س.', language: 'ar', flag: '🇸🇩' },
    { code: 'SS', name: 'South Sudan', currency: 'SSP', currencySymbol: '£', language: 'en', flag: '🇸🇸' },
    { code: 'CM', name: 'Cameroon', currency: 'XAF', currencySymbol: 'FCFA', language: 'fr', flag: '🇨🇲' },
    { code: 'SN', name: 'Senegal', currency: 'XOF', currencySymbol: 'FCFA', language: 'fr', flag: '🇸🇳' },
    { code: 'CD', name: 'DR Congo', currency: 'CDF', currencySymbol: 'FC', language: 'fr', flag: '🇨🇩' },
    { code: 'AO', name: 'Angola', currency: 'AOA', currencySymbol: 'Kz', language: 'pt', flag: '🇦🇴' },
    { code: 'MZ', name: 'Mozambique', currency: 'MZN', currencySymbol: 'MT', language: 'pt', flag: '🇲🇿' },
    { code: 'BI', name: 'Burundi', currency: 'BIF', currencySymbol: 'FBu', language: 'rn', flag: '🇧🇮' },
    { code: 'RW', name: 'Rwanda', currency: 'RWF', currencySymbol: 'RF', language: 'rw', flag: '🇷🇼' },
    { code: 'AR', name: 'Argentina', currency: 'ARS', currencySymbol: '$', language: 'es', flag: '🇦🇷' },
    { code: 'UY', name: 'Uruguay', currency: 'UYU', currencySymbol: '$U', language: 'es', flag: '🇺🇾' },
    { code: 'PY', name: 'Paraguay', currency: 'PYG', currencySymbol: '₲', language: 'es', flag: '🇵🇾' },
    { code: 'BO', name: 'Bolivia', currency: 'BOB', currencySymbol: 'Bs', language: 'es', flag: '🇧🇴' },
    { code: 'PE', name: 'Peru', currency: 'PEN', currencySymbol: 'S/', language: 'es', flag: '🇵🇪' },
    { code: 'CO', name: 'Colombia', currency: 'COP', currencySymbol: '$', language: 'es', flag: '🇨🇴' },
    { code: 'VE', name: 'Venezuela', currency: 'VES', currencySymbol: 'Bs.S', language: 'es', flag: '🇻🇪' },
    { code: 'GY', name: 'Guyana', currency: 'GYD', currencySymbol: 'G$', language: 'en', flag: '🇬🇾' },
    { code: 'SR', name: 'Suriname', currency: 'SRD', currencySymbol: '$', language: 'nl', flag: '🇸🇷' },
    { code: 'TT', name: 'Trinidad & Tobago', currency: 'TTD', currencySymbol: 'TT$', language: 'en', flag: '🇹🇹' },
    { code: 'BB', name: 'Barbados', currency: 'BBD', currencySymbol: 'Bds$', language: 'en', flag: '🇧🇧' },
    { code: 'JM', name: 'Jamaica', currency: 'JMD', currencySymbol: 'J$', language: 'en', flag: '🇯🇲' },
    { code: 'BZ', name: 'Belize', currency: 'BZD', currencySymbol: 'BZ$', language: 'en', flag: '🇧🇿' },
    { code: 'GT', name: 'Guatemala', currency: 'GTQ', currencySymbol: 'Q', language: 'es', flag: '🇬🇹' },
    { code: 'HN', name: 'Honduras', currency: 'HNL', currencySymbol: 'L', language: 'es', flag: '🇭🇳' },
    { code: 'NI', name: 'Nicaragua', currency: 'NIO', currencySymbol: 'C$', language: 'es', flag: '🇳🇮' },
    { code: 'CR', name: 'Costa Rica', currency: 'CRC', currencySymbol: '₡', language: 'es', flag: '🇨🇷' },
    { code: 'PA', name: 'Panama', currency: 'PAB', currencySymbol: 'B/.', language: 'es', flag: '🇵🇦' },
    { code: 'DO', name: 'Dominican Republic', currency: 'DOP', currencySymbol: 'RD$', language: 'es', flag: '🇩🇴' },
    { code: 'HT', name: 'Haiti', currency: 'HTG', currencySymbol: 'G', language: 'fr', flag: '🇭🇹' },
    { code: 'CU', name: 'Cuba', currency: 'CUP', currencySymbol: '$', language: 'es', flag: '🇨🇺' },
    { code: 'AW', name: 'Aruba', currency: 'AWG', currencySymbol: 'ƒ', language: 'nl', flag: '🇦🇼' },
    { code: 'AN', name: 'Netherlands Antilles', currency: 'ANG', currencySymbol: 'ƒ', language: 'nl', flag: '🇦🇳' },
    { code: 'AG', name: 'Antigua & Barbuda', currency: 'XCD', currencySymbol: '$', language: 'en', flag: '🇦🇬' },
    { code: 'BM', name: 'Bermuda', currency: 'BMD', currencySymbol: '$', language: 'en', flag: '🇧🇲' },
    { code: 'KY', name: 'Cayman Islands', currency: 'KYD', currencySymbol: '$', language: 'en', flag: '🇰🇾' },
    { code: 'BS', name: 'Bahamas', currency: 'BSD', currencySymbol: '$', language: 'en', flag: '🇧🇸' },
    { code: 'BD', name: 'Bangladesh', currency: 'BDT', currencySymbol: '৳', language: 'bn', flag: '🇧🇩' },
    { code: 'PK', name: 'Pakistan', currency: 'PKR', currencySymbol: '₨', language: 'ur', flag: '🇵🇰' },
    { code: 'LK', name: 'Sri Lanka', currency: 'LKR', currencySymbol: '₨', language: 'si', flag: '🇱🇰' },
    { code: 'NP', name: 'Nepal', currency: 'NPR', currencySymbol: '₨', language: 'ne', flag: '🇳🇵' },
    { code: 'AF', name: 'Afghanistan', currency: 'AFN', currencySymbol: '؋', language: 'ps', flag: '🇦🇫' },
    { code: 'IR', name: 'Iran', currency: 'IRR', currencySymbol: '﷼', language: 'fa', flag: '🇮🇷' },
    { code: 'IQ', name: 'Iraq', currency: 'IQD', currencySymbol: 'د.ع', language: 'ar', flag: '🇮🇶' },
    { code: 'SY', name: 'Syria', currency: 'SYP', currencySymbol: '£', language: 'ar', flag: '🇸🇾' },
    { code: 'YE', name: 'Yemen', currency: 'YER', currencySymbol: '﷼', language: 'ar', flag: '🇾🇪' },
    { code: 'AM', name: 'Armenia', currency: 'AMD', currencySymbol: '֏', language: 'hy', flag: '🇦🇲' },
    { code: 'AZ', name: 'Azerbaijan', currency: 'AZN', currencySymbol: '₼', language: 'az', flag: '🇦🇿' },
    { code: 'GE', name: 'Georgia', currency: 'GEL', currencySymbol: '₾', language: 'ka', flag: '🇬🇪' },
    { code: 'KZ', name: 'Kazakhstan', currency: 'KZT', currencySymbol: '₸', language: 'kk', flag: '🇰🇿' },
    { code: 'KG', name: 'Kyrgyzstan', currency: 'KGS', currencySymbol: 'с', language: 'ky', flag: '🇰🇬' },
    { code: 'TJ', name: 'Tajikistan', currency: 'TJS', currencySymbol: 'SM', language: 'tg', flag: '🇹🇯' },
    { code: 'TM', name: 'Turkmenistan', currency: 'TMT', currencySymbol: 'T', language: 'tk', flag: '🇹🇲' },
    { code: 'UZ', name: 'Uzbekistan', currency: 'UZS', currencySymbol: 'лв', language: 'uz', flag: '🇺🇿' },
    { code: 'MN', name: 'Mongolia', currency: 'MNT', currencySymbol: '₮', language: 'mn', flag: '🇲🇳' },
    { code: 'LA', name: 'Laos', currency: 'LAK', currencySymbol: '₭', language: 'lo', flag: '🇱🇦' },
    { code: 'KH', name: 'Cambodia', currency: 'KHR', currencySymbol: '៛', language: 'km', flag: '🇰🇭' },
    { code: 'MM', name: 'Myanmar', currency: 'MMK', currencySymbol: 'K', language: 'my', flag: '🇲🇲' },
    { code: 'BT', name: 'Bhutan', currency: 'BTN', currencySymbol: 'Nu.', language: 'dz', flag: '🇧🇹' },
    { code: 'MV', name: 'Maldives', currency: 'MVR', currencySymbol: '.ރ', language: 'dv', flag: '🇲🇻' },
    { code: 'FJ', name: 'Fiji', currency: 'FJD', currencySymbol: 'FJ$', language: 'en', flag: '🇫🇯' },
    { code: 'PG', name: 'Papua New Guinea', currency: 'PGK', currencySymbol: 'K', language: 'en', flag: '🇵🇬' },
    { code: 'SB', name: 'Solomon Islands', currency: 'SBD', currencySymbol: 'SI$', language: 'en', flag: '🇸🇧' },
    { code: 'VU', name: 'Vanuatu', currency: 'VUV', currencySymbol: 'Vt', language: 'bi', flag: '🇻🇺' },
    { code: 'WS', name: 'Samoa', currency: 'WST', currencySymbol: 'WS$', language: 'sm', flag: '🇼🇸' },
    { code: 'TO', name: 'Tonga', currency: 'TOP', currencySymbol: 'T$', language: 'to', flag: '🇹🇴' },
    { code: 'NC', name: 'New Caledonia', currency: 'XPF', currencySymbol: '₣', language: 'fr', flag: '🇳🇨' },
  ]

  // Computed
  const currentCountry = computed(() => selectedCountry.value || detectedCountry.value)
  const currentLanguage = computed(() => currentCountry.value?.language || 'en')
  const currentCurrency = computed(() => currentCountry.value?.currency || 'CLP')
  const supportedCurrencies = computed(() => {
    const codes = new Set<string>(['CLP'])
    availableCountries.forEach(c => codes.add(c.currency))
    return Array.from(codes)
  })

  // Actions
  const detectCountry = async () => {
    isLoading.value = true
    try {
      // Try to detect country using IP geolocation
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      
      const countryCode = data.country_code
      const foundCountry = availableCountries.find(c => c.code === countryCode)
      
      if (foundCountry) {
        detectedCountry.value = foundCountry
        selectedCountry.value = foundCountry
        await initializeCurrencies(foundCountry)
      } else {
        // Fallback to browser locale, but default to Chile if not found
        const browserLocale = navigator.language || 'es-CL'
        const browserCountry = browserLocale.split('-')[1] || 'CL'
        const fallbackCountry = availableCountries.find(c => c.code === browserCountry) || availableCountries.find(c => c.code === 'CL') || availableCountries[0]
        
        if (fallbackCountry) {
          detectedCountry.value = fallbackCountry
          selectedCountry.value = fallbackCountry
          await initializeCurrencies(fallbackCountry)
        }
      }
    } catch (error) {
      console.error('Failed to detect country:', error)
      // Fallback to Chile (CLP base currency)
      const fallbackCountry = availableCountries.find(c => c.code === 'CL') || availableCountries[0]
      if (fallbackCountry) {
        detectedCountry.value = fallbackCountry
        selectedCountry.value = fallbackCountry
        await initializeCurrencies(fallbackCountry)
      }
    } finally {
      isLoading.value = false
    }
  }

  const selectCountry = async (country: Country) => {
    selectedCountry.value = country
    await initializeCurrencies(country)
    showCountrySelector.value = false
    
    // Save to localStorage
    localStorage.setItem('selectedCountry', JSON.stringify(country))
  }

  const initializeCurrencies = async (country: Country) => {
    try {
      // Set local currency (CLP) as base
      localCurrency.value = CLP_CURRENCY
      
      // Set user currency
      userCurrency.value = {
        code: country.currency,
        name: country.currency,
        symbol: country.currencySymbol,
        rate: 1
      }
      
      // If user currency is not CLP, fetch exchange rate from Fixer API
      if (country.currency !== 'CLP') {
        await fetchExchangeRate(country.currency)
      } else {
        exchangeRate.value = 1
      }
    } catch (error) {
      console.error('Failed to initialize currencies:', error)
      exchangeRate.value = 1
    }
  }

  const fetchExchangeRate = async (targetCurrency: string) => {
    try {
      const response = await fetch(getCurrencyConversionUrl(targetCurrency))
      const data = await response.json()
      // Amdoren API response shape: { error: 0, error_message: "-", amount: <rate> }
      if (data && data.error === 0 && typeof data.amount === 'number' && data.amount > 0) {
        exchangeRate.value = data.amount
        userCurrency.value = {
          ...userCurrency.value!,
          rate: exchangeRate.value
        }
        console.log(`Successfully fetched ${targetCurrency} rate: ${data.amount}`)
      } else {
        console.error('Amdoren API error:', data.error_message || 'Unknown error')
        applyFallbackRate(targetCurrency)
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate from Amdoren:', error)
      applyFallbackRate(targetCurrency)
    }
  }

  // Use approximate CLP->Target conversion when live API is unavailable
  const applyFallbackRate = (targetCurrency: string) => {
    // Rates are approximate multipliers for 1 CLP to target currency
    const fallbackRates: Record<string, number> = {
      USD: 0.0011, // ~ 1,000 CLP ≈ 1.10 USD
      EUR: 0.0010,
      GBP: 0.00085,
      JPY: 0.17,   // 1 CLP ≈ 0.17 JPY
      BRL: 0.0055,
      MXN: 0.018,
      CAD: 0.0008,
      AUD: 0.0008,
      CHF: 0.0009, // Swiss Franc
      SEK: 0.011,  // Swedish Krona
      NOK: 0.011,  // Norwegian Krone
      DKK: 0.0075, // Danish Krone
      CNY: 0.0078, // Chinese Yuan
      INR: 0.092,  // Indian Rupee
      KRW: 1.45,   // South Korean Won
      RUB: 0.10,   // Russian Ruble
      ZAR: 0.020,  // South African Rand
      NZD: 0.0018, // New Zealand Dollar
      SGD: 0.0015, // Singapore Dollar
      HKD: 0.0086, // Hong Kong Dollar
      THB: 0.040,  // Thai Baht
      MYR: 0.0052, // Malaysian Ringgit
      IDR: 17.5,   // Indonesian Rupiah
      PHP: 0.062,  // Philippine Peso
      VND: 27.5,   // Vietnamese Dong
      TRY: 0.033,  // Turkish Lira
      PLN: 0.0043, // Polish Zloty
      CZK: 0.025,  // Czech Koruna
      HUF: 0.40,   // Hungarian Forint
      RON: 0.005,  // Romanian Leu
      BGN: 0.002,  // Bulgarian Lev
      HRK: 0.0075, // Croatian Kuna
      ISK: 0.15,   // Icelandic Krona
      ILS: 0.004,  // Israeli Shekel
      AED: 0.004,  // UAE Dirham
      SAR: 0.0041, // Saudi Riyal
      QAR: 0.004,  // Qatari Riyal
      KWD: 0.00034, // Kuwaiti Dinar
      BHD: 0.00041, // Bahraini Dinar
      OMR: 0.00042, // Omani Rial
      JOD: 0.00078, // Jordanian Dinar
      LBP: 0.17,   // Lebanese Pound
      EGP: 0.034,  // Egyptian Pound
      MAD: 0.011,  // Moroccan Dirham
      TND: 0.0034, // Tunisian Dinar
      DZD: 0.15,   // Algerian Dinar
      NGN: 1.7,    // Nigerian Naira
      GHS: 0.013,  // Ghanaian Cedi
      KES: 0.15,   // Kenyan Shilling
      UGX: 4.1,    // Ugandan Shilling
      TZS: 2.6,    // Tanzanian Shilling
      ETB: 0.062,  // Ethiopian Birr
      MWK: 1.9,    // Malawian Kwacha
      ZMW: 0.025,  // Zambian Kwacha
      BWP: 0.015,  // Botswanan Pula
      SZL: 0.020,  // Swazi Lilangeni
      LSL: 0.020,  // Lesotho Loti
      MUR: 0.050,  // Mauritian Rupee
      SCR: 0.015,  // Seychellois Rupee
      MGA: 4.9,    // Malagasy Ariary
      KMF: 0.50,   // Comorian Franc
      DJF: 0.20,   // Djiboutian Franc
      SOS: 0.63,   // Somali Shilling
      ERN: 0.017,  // Eritrean Nakfa
      SDG: 0.66,   // Sudanese Pound
      SSP: 0.66,   // South Sudanese Pound
      XAF: 0.66,   // Central African CFA Franc
      XOF: 0.66,   // West African CFA Franc
      CDF: 2.7,    // Congolese Franc
      AOA: 0.92,   // Angolan Kwanza
      MZN: 0.070,  // Mozambican Metical
      BIF: 3.1,    // Burundian Franc
      RWF: 1.3,    // Rwandan Franc
      ARS: 0.95,   // Argentine Peso
      UYU: 0.043,  // Uruguayan Peso
      PYG: 8.1,    // Paraguayan Guarani
      BOB: 0.0076, // Bolivian Boliviano
      PEN: 0.0041, // Peruvian Sol
      COP: 4.5,    // Colombian Peso
      VES: 0.0000004, // Venezuelan Bolívar
      GYD: 0.23,   // Guyanese Dollar
      SRD: 0.041,  // Surinamese Dollar
      TTD: 0.0075, // Trinidad and Tobago Dollar
      BBD: 0.0022, // Barbadian Dollar
      JMD: 0.17,   // Jamaican Dollar
      BZD: 0.0022, // Belize Dollar
      GTQ: 0.0086, // Guatemalan Quetzal
      HNL: 0.027,  // Honduran Lempira
      NIO: 0.041,  // Nicaraguan Córdoba
      CRC: 0.60,   // Costa Rican Colón
      PAB: 0.0011, // Panamanian Balboa
      DOP: 0.062,  // Dominican Peso
      HTG: 0.15,   // Haitian Gourde
      CUP: 0.0011, // Cuban Peso
      AWG: 0.002,  // Aruban Florin
      ANG: 0.002,  // Netherlands Antillean Guilder
      XCD: 0.003,  // East Caribbean Dollar
      BMD: 0.0011, // Bermudian Dollar
      KYD: 0.0009, // Cayman Islands Dollar
      BSD: 0.0011, // Bahamian Dollar
      BDT: 0.12,   // Bangladeshi Taka
      PKR: 0.31,   // Pakistani Rupee
      LKR: 0.33,   // Sri Lankan Rupee
      NPR: 0.15,   // Nepalese Rupee
      AFN: 0.080,  // Afghan Afghani
      IRR: 0.000046, // Iranian Rial
      IQD: 1.6,    // Iraqi Dinar
      SYP: 0.00014, // Syrian Pound
      YER: 0.28,   // Yemeni Rial
      AMD: 0.44,   // Armenian Dram
      AZN: 0.0019, // Azerbaijani Manat
      GEL: 0.0029, // Georgian Lari
      KZT: 0.50,   // Kazakhstani Tenge
      KGS: 0.10,   // Kyrgyzstani Som
      TJS: 0.012,  // Tajikistani Somoni
      TMT: 0.0039, // Turkmenistani Manat
      UZS: 13.5,   // Uzbekistani Som
      MNT: 3.8,    // Mongolian Tugrik
      LAK: 19.5,   // Lao Kip
      KHR: 4.5,    // Cambodian Riel
      MMK: 2.3,    // Myanmar Kyat
      BTN: 0.092,  // Bhutanese Ngultrum
      MVR: 0.017,  // Maldivian Rufiyaa
      FJD: 0.0025, // Fijian Dollar
      PGK: 0.0043, // Papua New Guinean Kina
      SBD: 0.0093, // Solomon Islands Dollar
      VUV: 0.13,   // Vanuatu Vatu
      WST: 0.003,  // Samoan Tala
      TOP: 0.0026, // Tongan Paʻanga
      XPF: 0.12,   // CFP Franc
      CLP: 1.0     // Chilean Peso (base currency)
    }
    const rate = fallbackRates[targetCurrency]
    exchangeRate.value = typeof rate === 'number' && rate > 0 ? rate : 1
    if (userCurrency.value) {
      userCurrency.value = {
        ...userCurrency.value,
        rate: exchangeRate.value
      }
    }
  }

  const convertFromCLP = (clpAmount: number): number => {
    return clpAmount * exchangeRate.value
  }

  const convertToCLP = (amount: number): number => {
    return amount / exchangeRate.value
  }

  const loadSavedCountry = () => {
    const saved = localStorage.getItem('selectedCountry')
    if (saved) {
      try {
        const country = JSON.parse(saved)
        selectedCountry.value = country
        initializeCurrencies(country)
      } catch (error) {
        console.error('Failed to load saved country:', error)
      }
    }
  }

  const toggleCountrySelector = () => {
    showCountrySelector.value = !showCountrySelector.value
  }

  const showCountrySelection = () => {
    showCountrySelector.value = true
  }

  const hideCountrySelection = () => {
    showCountrySelector.value = false
  }

  const showCurrencySelection = () => {
    showCurrencySelector.value = true
  }

  const hideCurrencySelection = () => {
    showCurrencySelector.value = false
  }

  // Initialize on store creation
  loadSavedCountry()

  return {
    // State
    detectedCountry,
    selectedCountry,
    userCurrency,
    localCurrency,
    exchangeRate,
    isLoading,
    showCountrySelector,
    showCurrencySelector,
    
    // Computed
    currentCountry,
    currentLanguage,
    currentCurrency,
    supportedCurrencies,
    
    // Methods
    detectCountry,
    selectCountry,
    initializeCurrencies,
    fetchExchangeRate,
    convertCurrency,
    convertFromCLP,
    convertToCLP,
    formatCurrency,
    loadSavedCountry,
    toggleCountrySelector,
    showCountrySelection,
    hideCountrySelection,
    showCurrencySelection,
    hideCurrencySelection,
    availableCountries
  }
})
