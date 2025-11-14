```vue
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.analytics.title') }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.analytics.subtitle') }}</p>
      </div>

      <!-- Date Range Selector -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-8">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('admin.analytics.date_range') }}
            </label>
            <select
              v-model="selectedRange"
              class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              @change="updateCharts"
            >
              <option value="7d">{{ t('admin.analytics.last_7_days') }}</option>
              <option value="30d">{{ t('admin.analytics.last_30_days') }}</option>
              <option value="90d">{{ t('admin.analytics.last_90_days') }}</option>
              <option value="1y">{{ t('admin.analytics.last_year') }}</option>
            </select>
          </div>
          <button
            @click="exportAnalytics"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download class="w-4 h-4" />
            {{ t('admin.analytics.export') }}
          </button>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- User Growth Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ t('admin.analytics.user_growth') }}
          </h3>
          <div class="h-80">
            <div v-if="loading" class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <img v-else :src="charts.userGrowth" alt="User Growth Chart" class="w-full h-full object-contain" />
          </div>
        </div>

        <!-- Revenue Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ t('admin.analytics.revenue_trend') }}
          </h3>
          <div class="h-80">
            <div v-if="loading" class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <img v-else :src="charts.revenue" alt="Revenue Chart" class="w-full h-full object-contain" />
          </div>
        </div>

        <!-- Bookings by Vehicle Type -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ t('admin.analytics.bookings_by_type') }}
          </h3>
          <div class="h-80">
            <div v-if="loading" class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <img v-else :src="charts.bookingsByType" alt="Bookings by Type Chart" class="w-full h-full object-contain" />
          </div>
        </div>

        <!-- Platform Metrics -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ t('admin.analytics.platform_metrics') }}
          </h3>
          <div class="h-80">
            <div v-if="loading" class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <img v-else :src="charts.platformMetrics" alt="Platform Metrics Chart" class="w-full h-full object-contain" />
          </div>
        </div>

        <!-- Rewards Usage -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ t('admin.analytics.rewards_usage') }}
          </h3>
          <div class="h-80">
            <div v-if="loading" class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <img v-else :src="charts.rewardsUsage" alt="Rewards Usage Chart" class="w-full h-full object-contain" />
          </div>
        </div>

        <!-- Support Tickets Analysis -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {{ t('admin.analytics.support_analysis') }}
          </h3>
          <div class="h-80">
            <div v-if="loading" class="flex items-center justify-center h-full">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <img v-else :src="charts.supportAnalysis" alt="Support Analysis Chart" class="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from '../../../services/i18n'
import { api } from '../../../services/api'
import { useNotificationStore } from '../../../stores/notifications'
import { generateQuickChart } from '../../../services/quickchart'
import { Download } from 'lucide-vue-next'

const { t } = useTranslation()
const router = useRouter()
const notificationStore = useNotificationStore()

const selectedRange = ref('30d')
const loading = ref(false)

const charts = ref({
  userGrowth: '',
  revenue: '',
  bookingsByType: '',
  platformMetrics: '',
  rewardsUsage: '',
  supportAnalysis: ''
})

const updateCharts = async () => {
  try {
    loading.value = true
    const response = await api.get(`/admin/analytics?range=${selectedRange.value}`)
    
    if (response.data.success) {
      generateCharts(response.data.data)
    }
  } catch (error) {
    console.error('Failed to load analytics data:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.analytics.error_title'),
      message: t('admin.analytics.load_error')
    })
  } finally {
    loading.value = false
  }
}

const generateCharts = (data: any) => {
  // User Growth Chart
  charts.value.userGrowth = generateQuickChart({
    type: 'line',
    data: {
      labels: data.userGrowth.labels,
      datasets: [{
        label: t('admin.analytics.total_users'),
        data: data.userGrowth.data,
        fill: true,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)'
      }]
    }
  })

  // Revenue Chart
  charts.value.revenue = generateQuickChart({
    type: 'bar',
    data: {
      labels: data.revenue.labels,
      datasets: [{
        label: t('admin.analytics.revenue'),
        data: data.revenue.data,
        backgroundColor: '#10B981'
      }]
    }
  })

  // Bookings by Vehicle Type
  charts.value.bookingsByType = generateQuickChart({
    type: 'doughnut',
    data: {
      labels: data.bookingsByType.labels,
      datasets: [{
        label: t('admin.analytics.bookings_by_type'),
        data: data.bookingsByType.data,
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6'
        ]
      }]
    }
  })

  // Platform Metrics
  charts.value.platformMetrics = generateQuickChart({
    type: 'line',
    data: {
      labels: data.platformMetrics.labels,
      datasets: [
        {
          label: t('admin.analytics.active_users'),
          data: data.platformMetrics.activeUsers,
          borderColor: '#3B82F6'
        },
        {
          label: t('admin.analytics.bookings'),
          data: data.platformMetrics.bookings,
          borderColor: '#10B981'
        },
        {
          label: t('admin.analytics.reviews'),
          data: data.platformMetrics.reviews,
          borderColor: '#F59E0B'
        }
      ]
    }
  })

  // Rewards Usage
  charts.value.rewardsUsage = generateQuickChart({
    type: 'bar',
    data: {
      labels: data.rewardsUsage.labels,
      datasets: [
        {
          label: t('admin.analytics.points_earned'),
          data: data.rewardsUsage.pointsEarned,
          backgroundColor: '#F59E0B'
        },
        {
          label: t('admin.analytics.points_redeemed'),
          data: data.rewardsUsage.pointsRedeemed,
          backgroundColor: '#3B82F6'
        }
      ]
    }
  })

  // Support Analysis
  charts.value.supportAnalysis = generateQuickChart({
    type: 'line',
    data: {
      labels: data.supportAnalysis.labels,
      datasets: [
        {
          label: t('admin.analytics.tickets_opened'),
          data: data.supportAnalysis.opened,
          borderColor: '#EF4444'
        },
        {
          label: t('admin.analytics.tickets_resolved'),
          data: data.supportAnalysis.resolved,
          borderColor: '#10B981'
        }
      ]
    }
  })
}

const exportAnalytics = () => {
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.analytics.export_title'),
    message: t('admin.analytics.export_coming_soon')
  })
}

onMounted(() => {
  updateCharts()
})
</script>```