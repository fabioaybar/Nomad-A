<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">{{ t('vehicle.loading') }}</p>
      </div>

      <!-- Vehicle Details -->
      <div v-else-if="vehicle" class="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800 dark:border dark:border-gray-700">
        <!-- Image Gallery -->
        <div class="relative h-[32rem] bg-gradient-to-b from-gray-900/10 to-gray-900/60 dark:from-gray-900/40 dark:to-gray-900/90 group">
          <img
            :src="vehicle.images?.[0] || '/images/defaults/car-placeholder.jpg'"
            :alt="`${vehicle.make} ${vehicle.model}`"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <RouterLink
            to="/vehicles"
            class="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full 
                   text-white border border-white/20 shadow-lg transition-all duration-300
                   hover:bg-white/20 hover:scale-105 hover:-translate-x-1
                   dark:bg-gray-900/30 dark:hover:bg-gray-900/50"
          >
            <ArrowLeft class="w-5 h-5" />
            <span class="text-sm font-medium">{{ t('vehicle.back') }}</span>
          </RouterLink>
          
          <!-- Image Info Overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div class="flex items-center gap-2 mb-2 opacity-80">
              <Camera class="w-4 h-4" />
              <span class="text-sm">{{ t('vehicle.photo') }}</span>
            </div>
            <h2 class="text-2xl font-bold">
              {{ vehicle.make }} {{ vehicle.model }}
            </h2>
          </div>
        </div>

        <div class="p-8">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-2 dark:text-gray-100">
              {{ vehicle.make }} {{ vehicle.model }}
            </h1>
            <p class="text-xl text-gray-600 mb-4 dark:text-gray-300">{{ vehicle.year }} • {{ vehicle.color }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <Star class="w-5 h-5 text-yellow-400 fill-current" />
                  <span class="ml-1 text-lg font-medium">{{ vehicle.average_rating || 'No ratings' }}</span>
                </div>
                <span class="text-gray-500 dark:text-gray-400">•</span>
                <span class="text-gray-600 dark:text-gray-300">{{ vehicle.location_address }}</span>
              </div>
              
              <!-- Pricing Section -->
              <div class="text-right">
                <!-- CLP Price (Base Currency) -->
                <div class="mb-2">
                  <div class="text-2xl font-bold text-green-600">
                    {{ formatCLPPrice(vehicle.price_per_day) }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">CLP {{ t('vehicles.per_day') }}</div>
                </div>
                
                <!-- Converted Price (User's Currency) -->
                <div v-if="userCurrency && userCurrency.code !== 'CLP'" class="border-t pt-2 dark:border-gray-700">
                  <div class="text-xl font-semibold text-primary-600">
                    {{ formatUserCurrencyPrice(vehicle.price_per_day) }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ userCurrency.code }} {{ t('vehicles.per_day') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Vendor Information Card -->
          <div v-if="vehicle.vendor" class="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span class="text-lg font-medium text-primary-600 dark:text-primary-300">
                  {{ vehicle.vendor.company_name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ t('vehicles.vendor') }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ vehicle.vendor.company_name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ vehicle.vendor.contact_email }}</p>
                <p v-if="vehicle.vendor.business_type" class="text-xs text-gray-500 dark:text-gray-400">{{ vehicle.vendor.business_type }}</p>
              </div>
            </div>
          </div>

          <!-- Currency Information Card -->
          <div v-if="userCurrency && userCurrency.code !== 'CLP'" class="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-blue-900 dark:text-blue-300">Currency Information</h4>
                <p class="text-sm text-blue-700 dark:text-blue-300">
                  All vehicle prices are set in Chilean Peso (CLP) and converted to your local currency.
                </p>
              </div>
              <div class="text-right">
                <div class="text-sm text-blue-600 dark:text-blue-300">
                  Exchange Rate: 1 CLP = {{ formatExchangeRate() }}
                </div>
                <div class="text-xs text-blue-500 dark:text-blue-300/90">
                  Last updated: {{ formatLastUpdated() }}
                </div>
              </div>
            </div>
          </div>

          <!-- Specifications -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">{{ t('vehicle.specifications') }}</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">{{ t('vehicle.type') }}:</span>
                  <span class="font-medium">{{ vehicle.type }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">{{ t('vehicle.transmission') }}:</span>
                  <span class="font-medium">{{ vehicle.transmission }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">{{ t('vehicle.fuel_type') }}:</span>
                  <span class="font-medium">{{ vehicle.fuel_type }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">{{ t('vehicle.seats') }}:</span>
                  <span class="font-medium">{{ vehicle.seats }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-300">License Plate:</span>
                  <span class="font-medium">{{ vehicle.license_plate }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">{{ t('vehicle.features') }}</h3>
              <div class="grid grid-cols-2 gap-2">
                <div
                  v-for="feature in vehicle.features"
                  :key="feature"
                  class="flex items-center text-sm dark:text-gray-300"
                >
                  <Check class="w-4 h-4 text-green-500 mr-2" />
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">{{ t('vehicle.description') }}</h3>
            <p class="text-gray-600 leading-relaxed dark:text-gray-300">{{ vehicle.description }}</p>
          </div>

          <!-- Booking Section -->
          <div class="border-t border-gray-200 pt-8 dark:border-gray-700">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between">
              <div class="mb-4 md:mb-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Ready to book?</h3>
                <p class="text-gray-600 dark:text-gray-300">Reserve this vehicle for your journey</p>
              </div>
              <RouterLink
                :to="`/booking/${vehicle.id}`"
                class="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                {{ t('vehicle.book_this_car') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <Car class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">{{ t('vehicle.not_found') }}</h3>
        <p class="text-gray-600 mb-4 dark:text-gray-300">{{ t('vehicle.not_found_desc') }}</p>
        <RouterLink
          to="/vehicles"
          class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          {{ t('vehicle.browse_vehicles') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Car, Star, ArrowLeft, Check, Camera } from 'lucide-vue-next'
import { api } from '../../services/api'
import { useLocaleStore } from '../../stores/locale'
import { useTranslation } from '../../services/i18n'

// Types
interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  color: string
  type: string
  transmission: string
  fuel_type: string
  seats: number
  license_plate: string
  price_per_day: number // This is now in CLP
  description: string
  features: string[]
  images?: string[]
  location_address: string
  average_rating?: number
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

// Route
const route = useRoute()

// Stores
const localeStore = useLocaleStore()
const { t } = useTranslation()

// Reactive data
const vehicle = ref<Vehicle | null>(null)
const loading = ref(true)

// Computed
const userCurrency = computed(() => localeStore.userCurrency)
const exchangeRate = computed(() => localeStore.exchangeRate)

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

/**
 * Format last updated time
 */
function formatLastUpdated(): string {
  return new Date().toLocaleTimeString()
}

/**
 * Fetch vehicle details from API
 */
async function fetchVehicle() {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    vehicle.value = null
    loading.value = false
    return
  }

  loading.value = true

  // Mock data based on the vehicle ID
  const mockVehicles: Record<number, Vehicle> = {
    1: {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      type: 'sedan',
      transmission: 'automatic',
      fuel_type: 'petrol',
      seats: 5,
      license_plate: 'ABC-123',
      price_per_day: 35000,
      description: 'A reliable and comfortable sedan perfect for daily commuting and long-distance travel. This well-maintained vehicle offers excellent fuel efficiency and a smooth driving experience.',
      features: ['Bluetooth', 'Backup Camera', 'Cruise Control', 'Air Conditioning', 'USB Charging', 'GPS Navigation'],
      images: ['/images/defaults/sedan.png'],
      location_address: 'Downtown Area',
      average_rating: 4.5,
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
    2: {
      id: 2,
      make: 'Honda',
      model: 'CR-V',
      year: 2023,
      color: 'Blue',
      type: 'suv',
      transmission: 'automatic',
      fuel_type: 'hybrid',
      seats: 7,
      license_plate: 'XYZ-789',
      price_per_day: 45000,
      description: 'Spacious and versatile SUV perfect for family trips and outdoor adventures. Features advanced safety technologies and excellent fuel economy with hybrid powertrain.',
      features: ['360° Camera', 'Lane Assist', 'Adaptive Cruise', 'Wireless Charging', 'Apple CarPlay', 'Android Auto'],
      images: ['/images/defaults/suv.png'],
      location_address: 'Airport Zone',
      average_rating: 4.8,
      vendor: {
        id: 2,
        company_name: 'Premium Fleet Solutions',
        contact_email: 'contact@premiumfleet.cl',
        contact_phone: '+56 2 3456 7890',
        business_type: 'Fleet Management'
      },
      is_rented: true,
      rental_status: 'rented'
    }
  }

  try {
    let vehicleData: Vehicle | null = null

    try {
      const response = await api.get(`/vehicles/${id}`)
      // Handle new Node.js backend response structure
      vehicleData = response.data.data?.vehicle || response.data || null
    } catch (error) {
      console.log('API not available, using mock data')
      vehicleData = mockVehicles[id] || null
    }

    if (!vehicleData) {
      throw new Error('Vehicle not found')
    }

    vehicle.value = vehicleData
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    vehicle.value = null
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchVehicle()
})
</script>
