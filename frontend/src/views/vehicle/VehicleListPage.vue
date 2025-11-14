<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">{{ t('vehicles.title') }}</h1>
        <p class="text-lg text-gray-600 mb-2 dark:text-gray-300">{{ t('home.hero.subtitle') }}</p>

        <!-- Currency Selector -->
        <div class="relative group">
          <!-- Currency Button -->
          <button
            @click="showCurrencyModal = true"
            class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm 
                   hover:bg-gray-50 transition-all duration-300 group-hover:shadow-md
                   dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <CurrencyIcon class="w-5 h-5 text-primary-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ selectedCurrency }}
            </span>
            <ChevronDown class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-300 
                               dark:text-gray-500 dark:group-hover:text-gray-400" 
                        :class="{ 'rotate-180': showCurrencyModal }" />
          </button>

          <!-- Currency Modal -->
          <div v-if="showCurrencyModal" 
               class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:p-0"
               @click.self="showCurrencyModal = false">
            <div class="fixed inset-0 transition-opacity" @click="showCurrencyModal = false">
              <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div class="relative bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-xl transform transition-all w-full sm:w-96
                        max-h-[80vh] overflow-y-auto"
                 role="dialog"
                 aria-modal="true">
              <!-- Header -->
              <div class="px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {{ t('common.select_currency') }}
                  </h3>
                  <button @click="showCurrencyModal = false" 
                          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <X class="w-5 h-5" />
                  </button>
                </div>

                <!-- Search -->
                <div class="relative">
                  <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    v-model="currencySearch"
                    type="text"
                    :placeholder="t('common.search_currency')"
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 
                           focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </div>

              <!-- Popular Currencies -->
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  {{ t('common.popular_currencies') }}
                </h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="currency in popularCurrencies"
                    :key="currency.code"
                    @click="selectCurrency(currency.code)"
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                           border border-gray-200 dark:border-gray-700
                           hover:bg-gray-100 dark:hover:bg-gray-700"
                    :class="selectedCurrency === currency.code ? 
                           'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800' : 
                           'text-gray-700 dark:text-gray-300'"
                  >
                    {{ currency.code }}
                    <span class="ml-1 text-xs text-gray-400 dark:text-gray-500">{{ currency.symbol }}</span>
                  </button>
                </div>
              </div>

              <!-- All Currencies List -->
              <div class="px-4 py-3">
                <div class="space-y-1 max-h-64 overflow-y-auto">
                  <button
                    v-for="currency in filteredCurrencies"
                    :key="currency.code"
                    @click="selectCurrency(currency.code)"
                    class="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 
                           dark:hover:bg-gray-700 transition-colors"
                    :class="selectedCurrency === currency.code ? 
                           'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' : 
                           'text-gray-700 dark:text-gray-300'"
                  >
                    <div class="flex items-center">
                      <span class="font-medium">{{ currency.code }}</span>
                      <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{ currency.name }}</span>
                    </div>
                    <Check v-if="selectedCurrency === currency.code" 
                          class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Currency Info Banner -->
        <div v-if="userCurrency && userCurrency.code !== 'CLP'" 
             class="mt-4 p-4 bg-blue-50/50 backdrop-blur-sm border border-blue-200 rounded-xl
                    dark:bg-blue-900/20 dark:border-blue-800 transition-all duration-300">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="flex items-center gap-2">
              <CurrencyIcon class="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <div class="text-sm text-blue-700 dark:text-blue-300">
                <span class="font-medium">{{ userCurrency.code }}</span>
                <span class="mx-1">•</span>
                <span>1 CLP = {{ formatExchangeRate() }}</span>
              </div>
            </div>
            <div class="text-xs text-blue-500 dark:text-blue-400 flex items-center gap-1">
              <Clock class="w-4 h-4" />
              <span>{{ t('common.last_updated') }}: {{ formatLastUpdated() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-8 dark:bg-gray-800 dark:border dark:border-gray-700">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">{{ t('vehicles.location') }}</label>
            <input
              v-model="filters.location"
              type="text"
              :placeholder="t('vehicles.search')"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 placeholder-gray-400"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">{{ t('vehicles.car_type') }}</label>
            <select
              v-model="filters.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="">{{ t('vehicles.any_type') }}</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="convertible">Convertible</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-200">{{ t('vehicles.price_range') }}</label>
            <select
              v-model="filters.priceRange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="">{{ t('vehicles.any_price') }}</option>
              <option value="0-25000">$0 - $25,000 CLP/{{ t('vehicles.per_day') }}</option>
              <option value="25000-50000">$25,000 - $50,000 CLP/{{ t('vehicles.per_day') }}</option>
              <option value="50000-100000">$50,000 - $100,000 CLP/{{ t('vehicles.per_day') }}</option>
              <option value="100000+">$100,000+ CLP/{{ t('vehicles.per_day') }}</option>
            </select>
          </div>
          <div class="flex items-end">
            <button
              @click="applyFilters"
              class="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              {{ t('common.apply') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading vehicles...</p>
      </div>

      <!-- Vehicle Grid -->
      <div v-else-if="filteredVehicles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border dark:border-gray-700"
        >
          <div class="relative">
            <div class="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <img
                v-if="vehicle.images?.[0]"
                :src="getImageUrl(vehicle.images[0])"
                :alt="`${vehicle.make} ${vehicle.model}`"
                class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                @error="handleImageError($event, vehicle.id)"
              />
              <div v-else :class="['w-full h-full flex items-center justify-center bg-gradient-to-br transition-colors duration-300', 
                   vehicleTypeGradients[vehicle.type as keyof typeof vehicleTypeGradients] || vehicleTypeGradients.default]">
                <div class="relative w-full h-full">
                  <img 
                    :src="getDefaultImage(vehicle)"
                    :alt="`${vehicle.make} ${vehicle.model} ${vehicle.type}`"
                    class="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div class="absolute bottom-4 left-4 text-white">
                      <span class="block text-lg font-medium">{{ `${vehicle.make} ${vehicle.model}` }}</span>
                      <span class="block text-sm text-gray-200 mt-1">{{ vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Image count badge if multiple images -->
              <div v-if="vehicle.images && vehicle.images.length > 1" 
                   class="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                <Camera class="w-3 h-3 inline-block mr-1" />
                {{ vehicle.images.length }}
              </div>
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2 dark:text-gray-100">
              {{ vehicle.make }} {{ vehicle.model }}
            </h3>
            <p class="text-gray-600 mb-4 dark:text-gray-300">{{ vehicle.year }} • {{ vehicle.color }}</p>
            
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center">
                <Star class="w-4 h-4 text-yellow-400 fill-current" />
                <span class="ml-1 text-sm text-gray-600 dark:text-gray-300">
                  {{ vehicle.average_rating || 'No ratings' }}
                </span>
              </div>
              
              <!-- Pricing Display -->
              <div class="text-right">
                <!-- CLP Price (Primary) -->
                <div class="text-xl font-bold text-green-600">
                  {{ formatCLPPrice(vehicle.price_per_day) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">CLP {{ t('vehicles.per_day') }}</div>
                
                <!-- Converted Price (Secondary) -->
                <div v-if="userCurrency && userCurrency.code !== 'CLP'" class="text-sm font-medium text-primary-600">
                  {{ formatUserCurrencyPrice(vehicle.price_per_day) }} {{ t('vehicles.per_day') }}
                </div>
              </div>
            </div>
            
            <!-- Vendor Information -->
            <div v-if="vehicle.vendor" class="mb-3 flex items-center gap-2">
              <div class="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span class="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {{ vehicle.vendor.company_name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ t('vehicles.vendor') }}: {{ vehicle.vendor.company_name }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-300">{{ vehicle.location_address }}</span>
              <RouterLink
                :to="`/vehicles/${vehicle.id}`"
                class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                {{ t('vehicles.view_details') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <Car class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">{{ t('vehicles.no_results') }}</h3>
        <p class="text-gray-600 mb-4 dark:text-gray-300">{{ t('news.no_news_description') }}</p>
        <button
          @click="resetFilters"
          class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          {{ t('common.reset') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Car, Star, Camera, CurrencyIcon, ChevronDown, X, Search, Clock, Check } from 'lucide-vue-next'
import { api } from '../../services/api'
import { useLocaleStore } from '../../stores/locale'
import { useTranslation } from '../../services/i18n'

// Default images for different vehicle types
const vehicleTypeImages = {
  sedan: '/images/defaults/sedan.png',
  suv: '/images/defaults/suv.png',
  hatchback: '/images/defaults/hatchback.jpg',
  convertible: '/images/defaults/convertible.png',
  default: '/images/defaults/car-placeholder.jpg'
} as const

// Background gradients to complement the default images
const vehicleTypeGradients = {
  sedan: 'from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30',
  suv: 'from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30',
  hatchback: 'from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30',
  convertible: 'from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30',
  default: 'from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30'
} as const

// Types
interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  color: string
  type: string
  price_per_day: number // This is now in CLP
  location_address: string
  average_rating?: number
  images?: string[]
  vendor?: {
    id: number
    company_name: string
    contact_email: string
    contact_phone?: string
    logo?: string
    business_type?: string
  }
  is_rented?: boolean
  rental_status?: 'available' | 'rented' | 'maintenance'
}

interface Currency {
  code: string
  name: string
  symbol: string
}

// Stores
const localeStore = useLocaleStore()
const { t } = useTranslation()
const route = useRoute()

// Reactive data
const vehicles = ref<Vehicle[]>([])
const loading = ref(true)
const filters = ref({
  location: (route.query.location as string) || '',
  type: (route.query.type as string) || '',
  priceRange: (route.query.priceRange as string) || ''
})
const selectedCurrency = ref(localeStore.userCurrency?.code || 'CLP')
const showCurrencyModal = ref(false)
const currencySearch = ref('')

// Popular currencies with symbols
const popularCurrencies = ref<Currency[]>([
  { code: 'CLP', name: 'Chilean Peso', symbol: '$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
])

// All available currencies
const allCurrencies = ref<Currency[]>([
  ...popularCurrencies.value,
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/' }
])
const failedImages = ref<Set<number>>(new Set())

// Image handling functions
function getImageUrl(imagePath: string): string {
  // When connected to real backend, construct the full URL
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  // For development/demo, use local images
  return `${import.meta.env.VITE_API_URL || ''}${imagePath}`
}

function getDefaultImage(vehicle: Vehicle): string {
  // Return type-specific default image or fallback
  return vehicleTypeImages[vehicle.type as keyof typeof vehicleTypeImages] || vehicleTypeImages.default
}

function handleImageError(event: Event, vehicleId: number) {
  const imgElement = event.target as HTMLImageElement
  if (!failedImages.value.has(vehicleId)) {
    failedImages.value.add(vehicleId)
    const vehiclesList = Array.isArray(vehicles.value) ? vehicles.value : []
    const vehicle = vehiclesList.find(v => v.id === vehicleId)
    if (vehicle) {
      imgElement.src = getDefaultImage(vehicle)
    }
  }
}
const quickCurrencyChips = computed(() => {
  const preferred = ['CLP', 'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'BRL']
  const existing = preferred.filter(c => supportedCurrencies.value.includes(c))
  return existing.length ? existing : supportedCurrencies.value.slice(0, 10)
})

// Computed
const userCurrency = computed(() => localeStore.userCurrency)
const exchangeRate = computed(() => localeStore.exchangeRate)
const supportedCurrencies = computed(() => localeStore.supportedCurrencies)

// Filter currencies based on search
const filteredCurrencies = computed(() => {
  const searchTerm = currencySearch.value.toLowerCase()
  return allCurrencies.value.filter(currency => 
    currency.code.toLowerCase().includes(searchTerm) ||
    currency.name.toLowerCase().includes(searchTerm)
  )
})

// Format last updated time with relative time
function formatLastUpdated(): string {
  const now = new Date()
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const lastUpdate = now.getTime() - 5 * 60 * 1000 // Mock: 5 minutes ago
  const minutes = Math.round((now.getTime() - lastUpdate) / (1000 * 60))
  return formatter.format(-minutes, 'minute')
}

/**
 * Format CLP price with proper formatting
 */
function formatCLPPrice(clpAmount: number): string {
  return `$${clpAmount.toLocaleString('es-CL')}`
}

/**
 * Format price in user's currency
 */
function formatUserCurrencyPrice(clpAmount: number): string {
  if (!userCurrency.value || userCurrency.value.code === 'CLP') {
    return formatCLPPrice(clpAmount)
  }
  
  const convertedAmount = localeStore.convertFromCLP(clpAmount)
  return localeStore.formatCurrency(convertedAmount, userCurrency.value.code)
}

/**
 * Format exchange rate for display
 */
function formatExchangeRate(): string {
  if (!userCurrency.value || userCurrency.value.code === 'CLP') {
    return '1.00'
  }
  
  const rate = exchangeRate.value
  return `${rate.toFixed(4)} ${userCurrency.value.code}`
}
async function onCurrencyChange() {
  const code = selectedCurrency.value
  if (code === 'CLP') {
    if (localeStore.userCurrency) {
      localeStore.userCurrency = { code: 'CLP', name: 'Chilean Peso', symbol: '$', rate: 1 } as any
    }
    localeStore.exchangeRate = 1
  } else {
    if (localeStore.userCurrency) {
      localeStore.userCurrency.code = code
    }
    await localeStore.fetchExchangeRate(code)
  }
}

function selectCurrency(code: string) {
  if (selectedCurrency.value !== code) {
    selectedCurrency.value = code
    onCurrencyChange()
  }
}

// Keep local selectedCurrency in sync if store changes elsewhere
watch(userCurrency, (val) => {
  if (val?.code && val.code !== selectedCurrency.value) {
    selectedCurrency.value = val.code
  }
})

// Watch for route query changes to update filters
watch(() => route.query, (newQuery) => {
  filters.value = {
    location: (newQuery.location as string) || '',
    type: (newQuery.type as string) || '',
    priceRange: (newQuery.priceRange as string) || ''
  }
}, { immediate: true })

/**
 * Fetch vehicles from API
 */
async function fetchVehicles() {
  try {
    loading.value = true
    const response = await api.get('/vehicles')
    // Handle new Node.js backend response structure
    vehicles.value = response.data.data?.vehicles || response.data || []
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    // For demo purposes, show sample data with CLP pricing
    vehicles.value = [
      {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        color: 'Silver',
        type: 'sedan',
        price_per_day: 35000, // Price in CLP
        location_address: 'Downtown Area',
        average_rating: 4.5,
        images: ['/placeholder-car.jpg'],
        vendor: {
          id: 1,
          company_name: 'AutoRent Chile',
          contact_email: 'info@autorentchile.cl',
          contact_phone: '+56 2 2345 6789',
          business_type: 'Car Rental Company'
        },
        is_rented: false,
        rental_status: 'available'
      },
      {
        id: 2,
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        color: 'Blue',
        type: 'suv',
        price_per_day: 45000, // Price in CLP
        location_address: 'Airport Zone',
        average_rating: 4.3,
        images: ['/placeholder-car.jpg'],
        vendor: {
          id: 4,
          company_name: 'Metro Car Rentals',
          contact_email: 'info@metrocars.cl',
          contact_phone: '+56 2 5678 9012',
          business_type: 'Car Rental Services'
        },
        is_rented: false,
        rental_status: 'available'
      },
      {
        id: 3,
        make: 'Ford',
        model: 'Focus',
        year: 2023,
        color: 'Red',
        type: 'hatchback',
        price_per_day: 28000, // Price in CLP
        location_address: 'University District',
        average_rating: 4.7,
        images: ['/placeholder-car.jpg'],
        vendor: {
          id: 5,
          company_name: 'Express Mobility',
          contact_email: 'contact@expressmobility.cl',
          contact_phone: '+56 2 6789 0123',
          business_type: 'Urban Transportation'
        },
        is_rented: false,
        rental_status: 'available'
      },
      {
        id: 4,
        make: 'BMW',
        model: '3 Series',
        year: 2022,
        color: 'Black',
        type: 'sedan',
        price_per_day: 65000, // Price in CLP
        location_address: 'Business District',
        average_rating: 4.8,
        images: ['/placeholder-car.jpg'],
        vendor: {
          id: 2,
          company_name: 'Premium Fleet Solutions',
          contact_email: 'contact@premiumfleet.cl',
          contact_phone: '+56 2 3456 7890',
          business_type: 'Fleet Management'
        },
        is_rented: false,
        rental_status: 'available'
      },
      {
        id: 5,
        make: 'Volkswagen',
        model: 'Golf',
        year: 2021,
        color: 'White',
        type: 'hatchback',
        price_per_day: 32000, // Price in CLP
        location_address: 'Residential Area',
        average_rating: 4.4,
        images: ['/placeholder-car.jpg'],
        vendor: {
          id: 3,
          company_name: 'City Car Services',
          contact_email: 'support@citycarservices.cl',
          contact_phone: '+56 2 4567 8901',
          business_type: 'Urban Mobility Solutions'
        },
        is_rented: false,
        rental_status: 'available'
      },
      {
        id: 6,
        make: 'Audi',
        model: 'Q5',
        year: 2023,
        color: 'Gray',
        type: 'suv',
        price_per_day: 75000, // Price in CLP
        location_address: 'Shopping District',
        average_rating: 4.9,
        images: ['/placeholder-car.jpg'],
        vendor: {
          id: 6,
          company_name: 'Luxury Car Solutions',
          contact_email: 'info@luxurycarsolutions.cl',
          contact_phone: '+56 2 7890 1234',
          business_type: 'Premium Vehicle Services'
        },
        is_rented: false,
        rental_status: 'available'
      }
    ]
  } finally {
    loading.value = false
  }
}

/**
 * Derived filtered vehicles (client-side)
 */
const filteredVehicles = computed(() => {
  // Ensure vehicles is an array
  const vehiclesList = Array.isArray(vehicles.value) ? vehicles.value : []
  let list = vehiclesList.slice()
  
  // Only show available vehicles to users
  list = list.filter(v => 
    !v.is_rented && 
    (v.rental_status === 'available' || !v.rental_status)
  )
  
  if (filters.value.location) {
    const q = filters.value.location.toLowerCase()
    list = list.filter(v => v.location_address?.toLowerCase().includes(q))
  }
  if (filters.value.type) {
    list = list.filter(v => v.type === filters.value.type)
  }
  if (filters.value.priceRange) {
    const pr = filters.value.priceRange
    if (pr.includes('+')) {
      const min = parseInt(pr)
      list = list.filter(v => v.price_per_day >= min)
    } else {
      const [min, max] = pr.split('-').map(n => parseInt(n))
      list = list.filter(v => v.price_per_day >= min && v.price_per_day <= max)
    }
  }
  return list
})

function applyFilters() {
  // No-op: filtering is reactive via computed above
}

/**
 * Reset all filters
 */
function resetFilters() {
  filters.value = {
    location: '',
    type: '',
    priceRange: ''
  }
}

// Lifecycle
onMounted(() => {
  fetchVehicles()
})
</script>
