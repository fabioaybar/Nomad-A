<template>
  <div class="min-h-screen">
    <!-- TEMP: Parallax hero (remove this block and component import to revert) -->
    <ParallaxHero>
      <div class="text-center text-white py-14 md:py-20 lg:py-32 px-4">
        <h1 class="text-3xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
          {{ t('home.hero.title') }}
        </h1>
        <p class="text-base md:text-2xl mb-2 md:mb-4 text-primary-100 max-w-3xl mx-auto">
          {{ t('home.hero.subtitle') }}
        </p>
      </div>
    </ParallaxHero>

    <!-- Quick Search (moved below hero) -->
    <section class="bg-white dark:bg-gray-900 mt-2 md:mt-0 py-8">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto bg-white rounded-xl p-3 md:p-6 shadow-sm md:shadow-none border border-gray-100 md:border-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 mb-3 md:mb-4">
            <div>
              <label class="block text-[11px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 dark:text-gray-200">{{ t('vehicles.location') }}</label>
              <div class="relative">
                <MapPin class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  v-model="searchForm.location"
                  type="text"
                  :placeholder="t('vehicles.search')"
                  class="input-field pl-10 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label class="block text-[11px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 dark:text-gray-200">{{ t('booking.pickup_date') }}</label>
              <input
                v-model="searchForm.startDate"
                type="date"
                :min="new Date().toISOString().split('T')[0]"
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-[11px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 dark:text-gray-200">{{ t('booking.return_date') }}</label>
              <input
                v-model="searchForm.endDate"
                type="date"
                :min="searchForm.startDate || new Date().toISOString().split('T')[0]"
                class="input-field"
              />
            </div>
            <div>
              <label class="block text-[11px] md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 dark:text-gray-200">{{ t('vehicles.car_type') }}</label>
              <select v-model="searchForm.type" class="input-field">
                <option value="">{{ t('vehicles.any_type') }}</option>
                <option value="sedan">{{ t('vehicles.sedan') }}</option>
                <option value="suv">{{ t('vehicles.suv') }}</option>
                <option value="hatchback">{{ t('vehicles.hatchback') }}</option>
                <option value="convertible">{{ t('vehicles.convertible') }}</option>
                <option value="truck">{{ t('vehicles.truck') }}</option>
                <option value="van">{{ t('vehicles.van') }}</option>
              </select>
            </div>
          </div>
          <button
            @click="searchVehicles"
            class="w-full btn-primary text-sm md:text-lg py-3 flex items-center justify-center space-x-2"
          >
            <Search class="w-5 h-5" />
            <span>{{ t('home.hero.cta') }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-16 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-gray-100">
            {{ t('home.features.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-300">
            {{ t('home.features.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900/40">
              <MapPin class="w-8 h-8 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 dark:text-gray-100">{{ t('home.features.find_nearby.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.find_nearby.desc') }}
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-secondary-900/40">
              <Shield class="w-8 h-8 text-secondary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 dark:text-gray-100">{{ t('home.features.secure_verified.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.secure_verified.desc') }}
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-accent-900/40">
              <Smartphone class="w-8 h-8 text-accent-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 dark:text-gray-100">{{ t('home.features.mobile_optimized.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.mobile_optimized.desc') }}
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-primary-900/40">
              <Clock class="w-8 h-8 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 dark:text-gray-100">{{ t('home.features.support_247.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.support_247.desc') }}
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-secondary-900/40">
              <CreditCard class="w-8 h-8 text-secondary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 dark:text-gray-100">{{ t('home.features.easy_payment.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.easy_payment.desc') }}
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-accent-900/40">
              <Star class="w-8 h-8 text-accent-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3 dark:text-gray-100">{{ t('home.features.rated_reviewed.title') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.rated_reviewed.desc') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Cars Section -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-gray-100">
            {{ t('popular_cars.top_3_title') }}
          </h2>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            {{ t('popular_cars.top_3_subtitle') }}
          </p>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto"></div>
          <p class="text-gray-600 mt-4">{{ t('common.loading') }}</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="vehicle in popularVehicles"
            :key="vehicle.id"
            class="card-hover group"
            @click="$router.push(`/vehicles/${vehicle.id}`)"
          >
            <div class="aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
              <img
                :src="vehicle.images?.[0] || 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'"
                :alt="`${vehicle.make} ${vehicle.model}`"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {{ vehicle.make }} {{ vehicle.model }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ vehicle.vendor?.company_name || 'Vendor' }}
                </p>
              </div>
              <div class="flex items-center">
                <Star class="w-4 h-4 text-yellow-400 fill-current" />
                <span class="text-sm text-gray-600 ml-1 dark:text-gray-300">
                  {{ vehicle.average_rating?.toFixed(1) || 'New' }}
                </span>
              </div>
            </div>
            <p class="text-gray-600 text-sm mb-3 dark:text-gray-300">
              {{ vehicle.year }} • {{ vehicle.type }} • {{ vehicle.seats }} {{ t('popular_cars.seats') }}
            </p>
            <div class="flex justify-between items-center">
              <CurrencyDisplay :amount="vehicle.price_per_day" text-color="text-green-600 dark:text-green-400" />
              <span class="text-sm text-secondary-600 font-medium">
                {{ getFuelTypeTranslation(vehicle.fuel_type) }}
              </span>
            </div>
          </div>
        </div>

        <div class="text-center mt-12 space-x-4">
          <RouterLink
            to="/vehicles"
            class="btn-primary inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            {{ t('popular_cars.view_all') }}
            <ArrowRight class="ml-2 w-5 h-5" />
          </RouterLink>
          <RouterLink
            to="/leaderboard"
            class="btn-secondary inline-flex items-center px-6 py-3 text-lg font-medium rounded-lg transition-all duration-300 hover:shadow-lg"
          >
            {{ t('popular_cars.view_leaderboard') }}
            <Trophy class="ml-2 w-5 h-5" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-primary-600 text-white dark:bg-primary-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          {{ t('home.cta.title') }}
        </h2>
        <p class="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
          {{ t('home.cta.subtitle') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/register" class="btn-accent text-lg px-8 py-3">
            {{ t('home.cta.get_started') }}
          </RouterLink>
          <RouterLink to="/vehicles" class="btn-secondary bg-white text-primary-600 hover:bg-primary-50 text-lg px-8 py-3 dark:bg-gray-800 dark:text-primary-300 dark:hover:bg-gray-700">
            {{ t('nav.browse_cars') }}
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  MapPin, Search, Shield, Smartphone, Clock, 
  CreditCard, Star, Car, ArrowRight, Trophy 
} from 'lucide-vue-next'
import { api } from '../../services/api'
import { useTranslation } from '../../services/i18n'
import CurrencyDisplay from '../../components/ui/CurrencyDisplay.vue'
import ParallaxHero from '../../components/ui/ParallaxHero.vue'
import type { Vehicle } from '../../backend/types'

const router = useRouter()
const { t } = useTranslation()

const loading = ref(false)
const popularVehicles = ref<Vehicle[]>([])
const searchForm = ref({
  location: '',
  startDate: '',
  endDate: '',
  type: '',
})

const searchVehicles = () => {
  const query = new URLSearchParams()
  
  Object.entries(searchForm.value).forEach(([key, value]) => {
    if (value) {
      query.set(key, value)
    }
  })
  
  router.push({ name: 'vehicles', query: Object.fromEntries(query) })
}

const loadPopularVehicles = async () => {
  try {
    loading.value = true
    const response = await api.get('/leaderboard/top3')
    // Handle new Node.js backend response structure
    const top3 = response.data.data?.top3 || []
    popularVehicles.value = top3
  } catch (error) {
    console.error('Failed to load top 3 vehicles:', error)
    // Fallback to regular vehicles endpoint
    try {
      const response = await api.get('/vehicles?limit=6')
      const vehicles = response.data.data?.vehicles || response.data || []
      popularVehicles.value = vehicles.slice(0, 3)
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      // Load mock data as final fallback
      loadMockVehicles()
    }
  } finally {
    loading.value = false
  }
}

// Mock vehicles for development
const loadMockVehicles = () => {
  popularVehicles.value = [
    {
      id: 1,
      vendor_id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      type: 'sedan',
      fuel_type: 'gasoline',
      transmission: 'automatic',
      engine_size: '2.5L',
      mileage: 15000,
      seats: 5,
      doors: 4,
      price_per_day: 35000,
      location_address: 'Downtown Santiago',
      latitude: -33.4489,
      longitude: -70.6693,
      is_available: true,
      is_rented: false,
      rental_status: 'available',
      average_rating: 4.5,
      total_reviews: 12,
      images: ['/placeholder-car.jpg'],
      features: ['Air Conditioning', 'Bluetooth', 'GPS'],
      description: 'Comfortable sedan perfect for city driving',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      vendor: {
        id: 1,
        user_id: 1,
        company_name: 'AutoRent Chile',
        business_type: 'enterprise',
        contact_email: 'contact@autorent.cl',
        contact_phone: '+56 9 1234 5678',
        description: 'Professional car rental service',
        is_verified: true,
        rating: 4.8,
        total_vehicles: 25,
        total_bookings: 150,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    },
    {
      id: 2,
      vendor_id: 2,
      make: 'Honda',
      model: 'CR-V',
      year: 2021,
      color: 'Blue',
      type: 'suv',
      fuel_type: 'gasoline',
      transmission: 'automatic',
      engine_size: '1.5L Turbo',
      mileage: 25000,
      seats: 5,
      doors: 4,
      price_per_day: 45000,
      location_address: 'Las Condes',
      latitude: -33.4172,
      longitude: -70.5500,
      is_available: true,
      is_rented: false,
      rental_status: 'available',
      average_rating: 4.7,
      total_reviews: 8,
      images: ['/placeholder-car.jpg'],
      features: ['All Wheel Drive', 'Sunroof', 'Leather Seats'],
      description: 'Spacious SUV ideal for family trips',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      vendor: {
        id: 2,
        user_id: 2,
        company_name: 'Premium Cars',
        business_type: 'company',
        contact_email: 'info@premiumcars.cl',
        contact_phone: '+56 9 8765 4321',
        description: 'Premium vehicle rental',
        is_verified: true,
        rating: 4.9,
        total_vehicles: 15,
        total_bookings: 89,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    },
    {
      id: 3,
      vendor_id: 3,
      make: 'BMW',
      model: '3 Series',
      year: 2022,
      color: 'Black',
      type: 'sedan',
      fuel_type: 'gasoline',
      transmission: 'automatic',
      engine_size: '2.0L Turbo',
      mileage: 12000,
      seats: 5,
      doors: 4,
      price_per_day: 65000,
      location_address: 'Providencia',
      latitude: -33.4255,
      longitude: -70.6067,
      is_available: true,
      is_rented: false,
      rental_status: 'available',
      average_rating: 4.8,
      total_reviews: 15,
      images: ['/placeholder-car.jpg'],
      features: ['Premium Audio', 'Heated Seats', 'Sport Mode'],
      description: 'Luxury sedan with premium features',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      vendor: {
        id: 3,
        user_id: 3,
        company_name: 'Luxury Motors',
        business_type: 'enterprise',
        contact_email: 'luxury@motors.cl',
        contact_phone: '+56 9 5555 1234',
        description: 'Luxury vehicle rental',
        is_verified: true,
        rating: 4.9,
        total_vehicles: 12,
        total_bookings: 67,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    }
  ]
}

const getFuelTypeTranslation = (fuelType: string) => {
  const fuelTranslations: Record<string, string> = {
    gasoline: t('popular_cars.gasoline'),
    diesel: t('popular_cars.diesel'),
    electric: t('popular_cars.electric'),
    hybrid: t('popular_cars.hybrid')
  }
  return fuelTranslations[fuelType] || fuelType
}

onMounted(() => {
  loadPopularVehicles()
  
  // Set default dates (today and tomorrow)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  searchForm.value.startDate = today.toISOString().split('T')[0]
  searchForm.value.endDate = tomorrow.toISOString().split('T')[0]
})
</script>