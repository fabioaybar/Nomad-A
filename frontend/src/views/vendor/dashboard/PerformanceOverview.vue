<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('vendor.analytics.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ t('vendor.analytics.subtitle') }}</p>
      </div>

      <!-- Period Selector -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('vendor.analytics.period') }}:</label>
          <select
            v-model="selectedPeriod"
            @change="loadAnalytics"
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="week">{{ t('vendor.analytics.week') }}</option>
            <option value="month">{{ t('vendor.analytics.month') }}</option>
            <option value="quarter">{{ t('vendor.analytics.quarter') }}</option>
            <option value="year">{{ t('vendor.analytics.year') }}</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button @click="exportReport" class="btn-secondary flex items-center">
            <Download class="w-4 h-4 mr-2" />
            {{ t('vendor.analytics.export_report') }}
          </button>
          <button @click="refreshAnalytics" class="btn-secondary flex items-center">
            <RefreshCw class="w-4 h-4 mr-2" />
            {{ t('vendor.analytics.refresh') }}
          </button>
        </div>
      </div>

      <!-- Key Metrics Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Revenue -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.analytics.total_revenue') }}</h3>
            <div class="text-green-500">
              <TrendingUp class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(analytics.totalRevenue) }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <span :class="analytics.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ analytics.revenueGrowth >= 0 ? '+' : '' }}{{ analytics.revenueGrowth }}%
            </span>
            {{ t('vendor.analytics.vs_previous_period') }}
          </div>
        </div>

        <!-- Total Bookings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.analytics.total_bookings') }}</h3>
            <div class="text-blue-500">
              <Calendar class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics.totalBookings }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <span :class="analytics.bookingsGrowth >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ analytics.bookingsGrowth >= 0 ? '+' : '' }}{{ analytics.bookingsGrowth }}%
            </span>
            {{ t('vendor.analytics.vs_previous_period') }}
          </div>
        </div>

        <!-- Average Booking Value -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.analytics.avg_booking_value') }}</h3>
            <div class="text-purple-500">
              <DollarSign class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(analytics.avgBookingValue) }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.analytics.per_booking') }}</div>
        </div>

        <!-- Fleet Utilization -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.analytics.fleet_utilization') }}</h3>
            <div class="text-orange-500">
              <BarChart3 class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ analytics.fleetUtilization }}%</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.analytics.of_fleet_active') }}</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Revenue Trend Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.analytics.revenue_trend') }}</h3>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.analytics.last_30_days') }}</div>
          </div>
          <div class="h-80">
            <img
              :src="revenueChartUrl"
              :alt="t('vendor.analytics.revenue_trend')"
              class="w-full h-full object-contain"
              @error="handleChartError"
            />
          </div>
        </div>

        <!-- Booking Trends Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.analytics.booking_trends') }}</h3>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.analytics.last_30_days') }}</div>
          </div>
          <div class="h-80">
            <img
              :src="bookingTrendsChartUrl"
              :alt="t('vendor.analytics.booking_trends')"
              class="w-full h-full object-contain"
              @error="handleChartError"
            />
          </div>
        </div>
      </div>

      <!-- Detailed Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Top Performing Vehicles -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.analytics.top_performing_vehicles') }}</h3>
          </div>
          <div class="p-6">
            <div v-if="loading" class="text-center py-8">
              <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
              <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.analytics.loading') }}</p>
            </div>
            <div v-else-if="analytics.vehiclePerformance.length === 0" class="text-center py-8">
              <Car class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.analytics.no_vehicles') }}</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="vehicle in analytics.vehiclePerformance.slice(0, 5)"
                :key="vehicle.vehicle_id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                    <Car class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ vehicle.vehicle_name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.bookings }} {{ t('vendor.analytics.bookings') }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(vehicle.revenue) }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    <Star class="w-4 h-4 inline mr-1" />
                    {{ vehicle.rating.toFixed(1) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Insights -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.analytics.customer_insights') }}</h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ analytics.customerInsights.repeat_customers }}</div>
                <div class="text-sm text-blue-600 dark:text-blue-400">{{ t('vendor.analytics.repeat_customers') }}</div>
              </div>
              <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ analytics.customerInsights.new_customers }}</div>
                <div class="text-sm text-green-600 dark:text-green-400">{{ t('vendor.analytics.new_customers') }}</div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.analytics.avg_booking_value') }}</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(analytics.customerInsights.average_booking_value) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.analytics.customer_satisfaction') }}</span>
                <div class="flex items-center">
                  <Star class="w-4 h-4 text-yellow-500 mr-1" />
                  <span class="font-medium text-gray-900 dark:text-white">{{ analytics.customerInsights.customer_satisfaction.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Summary -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.analytics.performance_summary') }}</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Revenue Performance -->
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {{ analytics.revenueGrowth >= 0 ? '+' : '' }}{{ analytics.revenueGrowth }}%
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('vendor.analytics.revenue_growth') }}</div>
            </div>
            
            <!-- Booking Performance -->
            <div class="text-center">
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {{ analytics.bookingsGrowth >= 0 ? '+' : '' }}{{ analytics.bookingsGrowth }}%
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('vendor.analytics.booking_growth') }}</div>
            </div>
            
            <!-- Utilization Performance -->
            <div class="text-center">
              <div class="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {{ analytics.fleetUtilization }}%
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ t('vendor.analytics.fleet_utilization') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Download, 
  RefreshCw,
  Car,
  Star
} from 'lucide-vue-next'
import { useAuthStore } from '../../../stores/auth'
import { useNotificationStore } from '../../../stores/notifications'
import { useLocaleStore } from '../../../stores/locale'
import { useTranslation } from '../../../services/i18n'
import { generateChartUrl, createRevenueChart, createBookingsChart } from '../../../services/quickchart'
import { api } from '../../../services/api'

const { t } = useTranslation()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const localeStore = useLocaleStore()

// State
const loading = ref(false)
const selectedPeriod = ref('month')

const analytics = ref({
  totalRevenue: 0,
  revenueGrowth: 0,
  totalBookings: 0,
  bookingsGrowth: 0,
  avgBookingValue: 0,
  fleetUtilization: 0,
  vehiclePerformance: [] as Array<{
    vehicle_id: number
    vehicle_name: string
    bookings: number
    revenue: number
    rating: number
  }>,
  customerInsights: {
    repeat_customers: 0,
    new_customers: 0,
    average_booking_value: 0,
    customer_satisfaction: 0
  },
  revenueChart: [] as Array<{
    date: string
    revenue: number
    bookings: number
  }>,
  bookingTrends: [] as Array<{
    date: string
    bookings: number
    cancellations: number
  }>
})

// Computed chart URLs
const revenueChartUrl = computed(() => {
  if (analytics.value.revenueChart.length === 0) return ''
  
  const config = createRevenueChart(
    analytics.value.revenueChart.map(item => item.date),
    analytics.value.revenueChart.map(item => item.revenue),
    t('vendor.analytics.revenue_trend')
  )
  return generateChartUrl(config, {
    width: 800,
    height: 320,
    backgroundColor: 'transparent'
  })
})

const bookingTrendsChartUrl = computed(() => {
  if (analytics.value.bookingTrends.length === 0) return ''
  
  const config = createBookingsChart(
    analytics.value.bookingTrends.map(item => item.date),
    analytics.value.bookingTrends.map(item => item.bookings),
    t('vendor.analytics.booking_trends')
  )
  return generateChartUrl(config, {
    width: 800,
    height: 320,
    backgroundColor: 'transparent'
  })
})

// Methods
const loadAnalytics = async () => {
  try {
    loading.value = true
    console.log('📊 Loading analytics from API...')
    
    const response = await api.get('/vendors/analytics', {
      params: { period: selectedPeriod.value },
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    console.log('📊 Analytics API Response:', response.data)
    
    if (response.data.success) {
      const data = response.data.data
      
      // Calculate totals and growth
      const totalRevenue = data.total_revenue || 0
      const totalBookings = data.total_bookings || 0
      
      analytics.value = {
        totalRevenue,
        revenueGrowth: data.revenue_growth || 0,
        totalBookings,
        bookingsGrowth: data.bookings_growth || 0,
        avgBookingValue: data.average_booking_value || 0,
        fleetUtilization: data.fleet_utilization || 0,
        vehiclePerformance: data.vehicle_performance || [],
        customerInsights: data.customer_insights || {
          repeat_customers: 0,
          new_customers: 0,
          average_booking_value: 0,
          customer_satisfaction: 0
        },
        revenueChart: data.revenue_chart || [],
        bookingTrends: data.booking_trends || []
      }
      console.log('📊 Analytics loaded:', analytics.value)
    }
  } catch (error) {
    console.error('Error loading analytics:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.analytics.error_title'),
      message: t('vendor.analytics.load_error')
    })
  } finally {
    loading.value = false
  }
}

const refreshAnalytics = () => {
  loadAnalytics()
}

const exportReport = () => {
  // TODO: Implement report export
  notificationStore.addNotification({
    type: 'info',
    title: t('vendor.analytics.export_title'),
    message: t('vendor.analytics.export_message')
  })
}

const formatCurrency = (amount: number) => {
  if (!amount) return '0'
  return new Intl.NumberFormat(localeStore.currentCountry?.code.toLowerCase() || 'es-CL', {
    style: 'currency',
    currency: localeStore.currentCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const handleChartError = (event: Event) => {
  console.error('Chart failed to load:', event)
}

// Lifecycle
onMounted(() => {
  loadAnalytics()
})
</script>
