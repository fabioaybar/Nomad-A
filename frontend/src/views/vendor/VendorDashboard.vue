<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('vendor.title') }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('vendor.subtitle') }}</p>
      </div>
      
      <!-- Render child vendor pages when navigating to /vendor/* -->
      <router-view v-if="!isMain" />

      <!-- Stats Cards -->
      <div v-if="isMain" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Car class="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('vendor.total_vehicles') }}</h3>
              <p class="text-2xl font-bold text-blue-600">{{ stats.totalVehicles }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar class="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('vendor.active_bookings') }}</h3>
              <p class="text-2xl font-bold text-green-600">{{ stats.activeBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign class="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('vendor.monthly_revenue') }}</h3>
              <p class="text-2xl font-bold text-purple-600">{{ formatCurrency(stats.monthlyRevenue) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star class="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('vendor.avg_rating') }}</h3>
              <p class="text-2xl font-bold text-yellow-600">{{ stats.averageRating }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="isMain" class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('vendor.quick_actions') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RouterLink
              to="/vendor/vehicles"
              class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            >
              <Car class="w-5 h-5 text-primary-600 mr-3" />
              <span>{{ t('vendor.manage_vehicles') }}</span>
            </RouterLink>
            <RouterLink
              to="/vendor/bookings"
              class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            >
              <Calendar class="w-5 h-5 text-primary-600 mr-3" />
              <span>{{ t('vendor.view_bookings') }}</span>
            </RouterLink>
            <RouterLink
              to="/vendor/analytics"
              class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            >
              <TrendingUp class="w-5 h-5 text-primary-600 mr-3" />
              <span>{{ t('vendor.analytics') }}</span>
            </RouterLink>
            <RouterLink
              to="/vendor/feedback"
              class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            >
              <MessageCircle class="w-5 h-5 text-primary-600 mr-3" />
              <span>{{ t('vendor.feedback') }}</span>
            </RouterLink>
            <RouterLink
              to="/vendor/calendar"
              class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            >
              <CalendarDays class="w-5 h-5 text-primary-600 mr-3" />
              <span>{{ t('vendor.calendar') }}</span>
            </RouterLink>
            <RouterLink
              to="/vendor/maintenance"
              class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            >
              <Wrench class="w-5 h-5 text-primary-600 mr-3" />
              <span>{{ t('vendor.maintenance') }}</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div v-if="isMain" class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('vendor.recent_bookings') }}</h2>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-300">{{ t('vendor.loading_bookings') }}</p>
          </div>
          
          <div v-else-if="bookings.length > 0" class="space-y-4">
            <div
              v-for="booking in bookings"
              :key="booking.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center">
                <div class="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <Car class="w-6 h-6 text-gray-500 dark:text-gray-300" />
                </div>
                <div class="ml-4">
                  <h3 class="font-medium text-gray-900">
                    {{ booking.vehicle?.make }} {{ booking.vehicle?.model }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {{ formatDate(booking.start_date) }} - {{ formatDate(booking.end_date) }}
                  </p>
                  <p class="text-sm text-gray-500">Booked by {{ booking.user?.name }}</p>
                </div>
              </div>
              <div class="text-right">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getStatusColor(booking.status)
                  ]"
                >
                  {{ booking.status }}
                </span>
                <p class="text-sm text-gray-600 mt-1">${{ booking.total_cost }}</p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <Calendar class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{{ t('vendor.no_bookings') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ t('vendor.start_adding_vehicles') }}</p>
          </div>
        </div>
      </div>

      <!-- Vehicle Performance -->
      <div v-if="isMain" class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('vendor.vehicle_performance') }}</h2>
        </div>
        <div class="p-6">
          <div v-if="vehicles.length > 0" class="space-y-4">
            <div
              v-for="vehicle in vehicles"
              :key="vehicle.id"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div class="flex items-center">
                <div class="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <Car class="w-6 h-6 text-gray-500 dark:text-gray-300" />
                </div>
                <div class="ml-4">
                  <h3 class="font-medium text-gray-900 dark:text-gray-100">
                    {{ vehicle.make }} {{ vehicle.model }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ vehicle.year }} • {{ vehicle.color }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-primary-600">{{ formatCurrency(vehicle.price_per_day) }}/día</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ vehicle.bookings_count || 0 }} bookings</p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <Car class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{{ t('vendor.no_vehicles') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('vendor.add_first_vehicle') }}</p>
            <button
              @click="showAddVehicleModal = true"
              class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              {{ t('vendor.add_vehicle') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Car, Calendar, DollarSign, Star, Plus, BarChart3, MessageSquare, Wrench, TrendingUp, MessageCircle, CalendarDays } from 'lucide-vue-next'
import { api } from '../../services/api'
import { useTranslation } from '../../services/i18n'
import { useAuthStore } from '../../stores/auth'

const { t } = useTranslation()
const authStore = useAuthStore()

// Types
interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  color: string
  price_per_day: number
  images?: string[]
  bookings_count?: number
}

interface User {
  id: number
  name: string
  email: string
}

interface Booking {
  id: number
  start_date: string
  end_date: string
  status: string
  total_cost: number
  vehicle?: Vehicle
  user?: User
}

interface Stats {
  totalVehicles: number
  activeBookings: number
  monthlyRevenue: number
  averageRating: number
}

// Reactive data
const vehicles = ref<Vehicle[]>([])
const bookings = ref<Booking[]>([])
const loading = ref(true)
const showAddVehicleModal = ref(false)
// Show main dashboard content only on exact /vendor route (reactive to router)
const route = useRoute()
const isMain = computed(() => route.path === '/vendor' || route.path === '/vendor/')
const stats = ref<Stats>({
  totalVehicles: 0,
  activeBookings: 0,
  monthlyRevenue: 0,
  averageRating: 0
})

/**
 * Fetch vendor dashboard data
 */
async function fetchDashboardData() {
  try {
    loading.value = true
    
    // Use vendor-specific endpoints
    const [profileResponse, vehiclesResponse, bookingsResponse, financesResponse, analyticsResponse] = await Promise.all([
      api.get('/vendors/profile'),
      api.get('/vendors/vehicles'),
      api.get('/vendors/bookings'),
      api.get('/vendors/finances/stats'),
      api.get('/vendors/analytics')
    ])
    
    // Set vehicles data
    vehicles.value = vehiclesResponse.data.data || []
    
    // Set bookings data
    bookings.value = bookingsResponse.data.data || []
    
    // Set stats from API responses
    const finances = financesResponse.data.data || {}
    const analytics = analyticsResponse.data.data || {}
    
    stats.value = {
      totalVehicles: analytics.total_vehicles || vehicles.value.length,
      activeBookings: finances.completed_bookings || bookings.value.filter(b => b.status === 'active').length,
      monthlyRevenue: finances.total_revenue || bookings.value.reduce((sum, b) => sum + (b.total_cost || 0), 0),
      averageRating: analytics.average_rating || 4.5
    }
  } catch (error) {
    console.error('Error fetching vendor dashboard data:', error)
    // Set empty data instead of fallback
    vehicles.value = []
    bookings.value = []
    stats.value = {
      totalVehicles: 0,
      activeBookings: 0,
      monthlyRevenue: 0,
      averageRating: 0
    }
  } finally {
    loading.value = false
  }
}

/**
 * Format currency based on locale
 */
function formatCurrency(amount: number): string {
  const locale = 'es-CL' // Default to Chilean locale for vendors
  const currency = 'CLP'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

/**
 * Get status color class
 */
function getStatusColor(status: string): string {
  const colors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  fetchDashboardData()
})
</script>
