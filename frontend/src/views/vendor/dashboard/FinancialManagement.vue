<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('vendor.finances.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ t('vendor.finances.subtitle') }}</p>
      </div>

      <!-- Financial Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Total Revenue -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.finances.total_revenue') }}</h3>
            <div class="text-green-500">
              <TrendingUp class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(stats.totalRevenue) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <span :class="stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'">
              {{ stats.revenueGrowth >= 0 ? '+' : '' }}{{ stats.revenueGrowth }}%
            </span>
            {{ t('vendor.finances.from_last_month') }}
          </div>
        </div>

        <!-- Pending Payments -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.finances.pending_payments') }}</h3>
            <div class="text-yellow-500">
              <Clock class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(stats.pendingPayments) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ stats.pendingBookings }} {{ t('vendor.finances.bookings') }}
          </div>
        </div>

        <!-- Monthly Revenue -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.finances.monthly_revenue') }}</h3>
            <div class="text-blue-500">
              <Calendar class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(stats.monthlyRevenue) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ stats.monthlyBookings }} {{ t('vendor.finances.bookings') }}
          </div>
        </div>

        <!-- Net Income -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.finances.net_income') }}</h3>
            <div class="text-primary-500">
              <DollarSign class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatCurrency(stats.netIncome) }}
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ stats.profitMargin }}% {{ t('vendor.finances.profit_margin') }}
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.finances.revenue_chart') }}</h3>
              <select
                v-model="selectedPeriod"
                @change="loadFinancialData"
                class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="week">{{ t('vendor.finances.week') }}</option>
                <option value="month">{{ t('vendor.finances.month') }}</option>
                <option value="quarter">{{ t('vendor.finances.quarter') }}</option>
                <option value="year">{{ t('vendor.finances.year') }}</option>
              </select>
            </div>
          </div>
          <div class="p-6">
            <div v-if="loading" class="flex items-center justify-center h-64">
              <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            </div>
            <div v-else-if="chartData.labels.length === 0" class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              {{ t('vendor.finances.no_data') }}
            </div>
            <div v-else class="h-64">
              <img :src="revenueChartUrl" alt="Revenue Chart" class="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        <!-- Payment Status Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.finances.payment_status') }}</h3>
          </div>
          <div class="p-6">
            <div v-if="loading" class="flex items-center justify-center h-64">
              <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            </div>
            <div v-else class="h-64">
              <img :src="paymentChartUrl" alt="Payment Status Chart" class="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Reports Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Top Performing Vehicles -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.finances.top_vehicles') }}</h3>
          </div>
          <div class="p-6">
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="vehicle in topVehicles"
                :key="vehicle.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ vehicle.name }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.bookings }} {{ t('vendor.finances.bookings') }}</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(vehicle.revenue) }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.rating }}⭐</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.finances.recent_transactions') }}</h3>
              <button @click="loadTransactions" class="text-primary-600 hover:text-primary-800 dark:text-primary-400">
                <RefreshCw class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('common.date') }}
                  </th>
                  <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('common.description') }}
                  </th>
                  <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('common.amount') }}
                  </th>
                  <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('common.status') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="transaction in recentTransactions" :key="transaction.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(transaction.date) }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ transaction.description }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ transaction.reference }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <span :class="transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                      {{ transaction.type === 'credit' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span :class="getStatusClass(transaction.status)">
                      {{ t(`vendor.finances.statuses.${transaction.status}`) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Financial Summary -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.finances.summary') }}</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.finances.total_bookings') }}</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ stats.totalBookings }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.finances.avg_booking_value') }}</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(stats.avgBookingValue) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.finances.commission_rate') }}</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ stats.commissionRate }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.finances.commission_earned') }}</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(stats.commissionEarned) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.finances.utilization_rate') }}</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ stats.utilizationRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <button @click="exportFinancialReport" class="btn-secondary flex items-center">
          <Download class="w-4 h-4 mr-2" />
          {{ t('vendor.finances.export_report') }}
        </button>
        <button @click="refreshData" class="btn-primary flex items-center">
          <RefreshCw class="w-4 h-4 mr-2" />
          {{ t('vendor.finances.refresh') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  DollarSign, 
  RefreshCw, 
  Download 
} from 'lucide-vue-next'
import { useAuthStore } from '../../../stores/auth'
import { useNotificationStore } from '../../../stores/notifications'
import { useTranslation } from '../../../services/i18n'
import { api } from '../../../services/api'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { t } = useTranslation()

// State
const loading = ref(false)
const selectedPeriod = ref('month')

const stats = ref({
  totalRevenue: 0,
  revenueGrowth: 0,
  pendingPayments: 0,
  pendingBookings: 0,
  monthlyRevenue: 0,
  monthlyBookings: 0,
  netIncome: 0,
  profitMargin: 0,
  totalBookings: 0,
  avgBookingValue: 0,
  commissionRate: 10,
  commissionEarned: 0,
  utilizationRate: 0
})

const chartData = ref({
  labels: [] as string[],
  data: [] as number[]
})

const paymentChartData = ref({
  labels: [] as string[],
  data: [] as number[]
})

const topVehicles = ref([] as Array<{
  id: number
  name: string
  bookings: number
  revenue: number
  rating: number
}>)

const recentTransactions = ref([] as Array<{
  id: number
  date: string
  description: string
  reference: string
  amount: number
  type: 'credit' | 'debit'
  status: 'completed' | 'pending' | 'failed'
}>)

// Computed
const revenueChartUrl = computed(() => {
  if (chartData.value.labels.length === 0) return ''
  
  const config = {
    type: 'line',
    data: {
      labels: chartData.value.labels,
      datasets: [{
        label: t('vendor.finances.revenue'),
        data: chartData.value.data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value: number) {
              return formatCurrency(value)
            }
          }
        }
      }
    }
  }
  
  return generateChartUrl(config, {
    width: 400,
    height: 200,
    backgroundColor: 'transparent'
  })
})

const paymentChartUrl = computed(() => {
  if (paymentChartData.value.labels.length === 0) return ''
  
  const config = {
    type: 'doughnut',
    data: {
      labels: paymentChartData.value.labels,
      datasets: [{
        data: paymentChartData.value.data,
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  }
  
  return generateChartUrl(config, {
    width: 300,
    height: 200,
    backgroundColor: 'transparent'
  })
})

// Methods
const loadFinancialData = async () => {
  try {
    loading.value = true
    console.log('💰 Loading financial data from API...')
    
    // Get vendor financial stats
    const statsResponse = await api.get('/vendors/finances/stats', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    console.log('💰 Financial API Response:', statsResponse.data)
    
    if (statsResponse.data.success) {
      const data = statsResponse.data.data
      stats.value = {
        totalRevenue: data.total_revenue || 0,
        revenueGrowth: data.revenue_growth || 0,
        pendingPayments: data.pending_payments || 0,
        pendingBookings: data.pending_bookings || 0,
        monthlyRevenue: data.monthly_revenue || 0,
        monthlyBookings: data.monthly_bookings || 0,
        netIncome: data.net_income || 0,
        profitMargin: data.profit_margin || 0,
        totalBookings: data.total_bookings || 0,
        avgBookingValue: data.average_booking_value || 0,
        commissionRate: data.commission_rate || 10,
        commissionEarned: data.commission_earned || 0,
        utilizationRate: data.utilization_rate || 0
      }
      console.log('💰 Financial data loaded:', stats.value)
    }
    
    // Load chart data
    await loadChartData()
    await loadTopVehicles()
    await loadTransactions()
    
  } catch (error) {
    console.error('Error loading financial data:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.finances.error_title'),
      message: t('vendor.finances.load_error')
    })
  } finally {
    loading.value = false
  }
}

const loadChartData = async () => {
  try {
    const response = await api.get('/vendors/analytics', {
      params: { period: selectedPeriod.value },
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (response.data.success) {
      const data = response.data.data.revenue_chart || []
      chartData.value = {
        labels: data.map((item: any) => item.date),
        data: data.map((item: any) => item.revenue)
      }
    }
  } catch (error) {
    console.error('Error loading chart data:', error)
  }
}

const loadTopVehicles = async () => {
  try {
    const response = await api.get('/vendors/analytics', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (response.data.success) {
      const data = response.data.data.vehicle_performance || []
      topVehicles.value = data.slice(0, 5).map((vehicle: any) => ({
        id: vehicle.vehicle_id,
        name: vehicle.vehicle_name,
        bookings: vehicle.bookings,
        revenue: vehicle.revenue,
        rating: vehicle.rating
      }))
    }
  } catch (error) {
    console.error('Error loading top vehicles:', error)
  }
}

const loadTransactions = async () => {
  try {
    // For now, create mock transactions based on bookings
    const bookingsResponse = await api.get('/vendors/bookings', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (bookingsResponse.data.success) {
      const bookings = bookingsResponse.data.data || []
      
      // Transform bookings into transactions
      recentTransactions.value = bookings.slice(0, 10).map((booking: any) => ({
        id: booking.id,
        date: booking.created_at,
        description: `Booking #${booking.id} - ${booking.vehicle?.make} ${booking.vehicle?.model}`,
        reference: `BK-${booking.id}`,
        amount: booking.total_cost,
        type: 'credit' as const,
        status: booking.status === 'completed' ? 'completed' : 'pending' as const
      }))
      
      // Update payment chart data
      const statusCounts = recentTransactions.value.reduce((acc: any, transaction) => {
        acc[transaction.status] = (acc[transaction.status] || 0) + 1
        return acc
      }, {})
      
      paymentChartData.value = {
        labels: Object.keys(statusCounts),
        data: Object.values(statusCounts)
      }
    }
  } catch (error) {
    console.error('Error loading transactions:', error)
  }
}

const refreshData = () => {
  loadFinancialData()
}

const exportFinancialReport = () => {
  // TODO: Implement financial report export
  notificationStore.addNotification({
    type: 'info',
    title: t('vendor.finances.export_title'),
    message: t('vendor.finances.export_message')
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const getStatusClass = (status: string) => {
  const classes = {
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const generateChartUrl = (config: any, options: any) => {
  // This would integrate with a charting service like QuickChart
  // For now, return a placeholder
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(config))}&w=${options.width}&h=${options.height}&bkg=${options.backgroundColor}`
}

// Lifecycle
onMounted(() => {
  loadFinancialData()
})
</script>