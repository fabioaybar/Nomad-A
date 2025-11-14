<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {{ t('leaderboard.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {{ t('leaderboard.subtitle') }}
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Metrics Tabs -->
      <div class="mb-8">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="metric in metrics"
              :key="metric.key"
              @click="activeMetric = metric.key"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeMetric === metric.key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              ]"
            >
              {{ metric.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Leaderboard Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Leaderboard Table -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ getCurrentMetricLabel() }}
              </h3>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {{ t('leaderboard.rank') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {{ t('leaderboard.vehicle') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {{ getCurrentScoreLabel() }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {{ t('leaderboard.bookings_count') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {{ t('leaderboard.total_revenue') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr
                    v-for="(item, index) in getCurrentLeaderboard()"
                    :key="item.vehicle.id"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <span
                          :class="[
                            'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold',
                            index < 3 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          ]"
                        >
                          {{ item.rank }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-12 w-12">
                          <img
                            :src="getVehicleImage(item.vehicle)"
                            :alt="`${item.vehicle.make} ${item.vehicle.model}`"
                            class="h-12 w-12 rounded-lg object-cover"
                          />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ item.vehicle.make }} {{ item.vehicle.model }}
                          </div>
                          <div class="text-sm text-gray-500 dark:text-gray-400">
                            {{ item.vehicle.year }} • {{ item.vehicle.type }} • {{ item.vehicle.color }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div class="flex items-center">
                        <span class="font-semibold">{{ formatScore(item.score, activeMetric) }}</span>
                        <div v-if="activeMetric === 'rating'" class="ml-2 flex items-center">
                          <Star class="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ item.vehicle.metrics?.totalBookings || 0 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {{ formatCurrency(item.vehicle.metrics?.totalRevenue || 0) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t('leaderboard.chart.title') }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ t('leaderboard.chart.subtitle') }}
              </p>
            </div>
            
            <div class="p-6">
              <div v-if="chartUrl" class="text-center">
                <img
                  :src="chartUrl"
                  :alt="t('leaderboard.chart.title')"
                  class="w-full h-auto rounded-lg"
                />
              </div>
              <div v-else class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ t('common.loading') }}</p>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Estadísticas Rápidas
              </h3>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Total de Vehículos</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ totalVehicles }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Total de Reservas</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ totalBookings }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">Ingresos Totales</span>
                <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatCurrency(totalRevenue) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Star } from 'lucide-vue-next'
import { useTranslation } from '../../services/i18n'
import { useCurrencyConversion } from '../../composables/useCurrencyConversion'
import { api } from '../../services/api'

const { t } = useTranslation()
const { formatCurrency } = useCurrencyConversion()

// State
const leaderboardData = ref<any>(null)
const loading = ref(true)
const activeMetric = ref('popularity')
const chartUrl = ref('')

// Computed
const metrics = computed(() => [
  { key: 'rating', label: t('leaderboard.metrics.rating') },
  { key: 'bookings', label: t('leaderboard.metrics.bookings') },
  { key: 'revenue', label: t('leaderboard.metrics.revenue') },
  { key: 'popularity', label: t('leaderboard.metrics.popularity') }
])

const totalVehicles = computed(() => leaderboardData.value?.leaderboard?.byPopularity?.length || 0)
const totalBookings = computed(() => {
  if (!leaderboardData.value?.leaderboard?.byPopularity) return 0
  return leaderboardData.value.leaderboard.byPopularity.reduce((sum: number, item: any) => 
    sum + (item.vehicle.metrics?.totalBookings || 0), 0
  )
})
const totalRevenue = computed(() => {
  if (!leaderboardData.value?.leaderboard?.byPopularity) return 0
  return leaderboardData.value.leaderboard.byPopularity.reduce((sum: number, item: any) => 
    sum + (item.vehicle.metrics?.totalRevenue || 0), 0
  )
})

// Methods
const getCurrentLeaderboard = () => {
  if (!leaderboardData.value?.leaderboard) return []
  return leaderboardData.value.leaderboard[`by${activeMetric.value.charAt(0).toUpperCase() + activeMetric.value.slice(1)}`] || []
}

const getCurrentMetricLabel = () => {
  const metric = metrics.value.find(m => m.key === activeMetric.value)
  return metric?.label || ''
}

const getCurrentScoreLabel = () => {
  switch (activeMetric.value) {
    case 'rating': return t('leaderboard.average_rating')
    case 'bookings': return t('leaderboard.bookings_count')
    case 'revenue': return t('leaderboard.total_revenue')
    case 'popularity': return t('leaderboard.popularity_score')
    default: return t('leaderboard.score')
  }
}

const formatScore = (score: number, metric: string) => {
  switch (metric) {
    case 'rating': return score.toFixed(1)
    case 'bookings': return score.toString()
    case 'revenue': return formatCurrency(score)
    case 'popularity': return score.toString()
    default: return score.toString()
  }
}

const getVehicleImage = (vehicle: any) => {
  if (vehicle.images && vehicle.images.length > 0) {
    return vehicle.images[0]
  }
  return getDefaultImage(vehicle)
}

const getDefaultImage = (vehicle: any) => {
  const typeImages: Record<string, string> = {
    sedan: '/images/defaults/sedan.png',
    suv: '/images/defaults/suv.png',
    hatchback: '/images/defaults/hatchback.jpg',
    convertible: '/images/defaults/convertible.png'
  }
  return typeImages[vehicle.type] || '/images/defaults/car-placeholder.jpg'
}

const generateChart = async () => {
  try {
    const currentData = getCurrentLeaderboard().slice(0, 8) // Top 8 for chart
    
    const chartConfig = {
      type: 'bar',
      data: {
        labels: currentData.map((item: any) => `${item.vehicle.make} ${item.vehicle.model}`),
        datasets: [{
          label: getCurrentScoreLabel(),
          data: currentData.map((item: any) => item.score),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: getCurrentMetricLabel()
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }

    const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig))
    chartUrl.value = `https://quickchart.io/chart?c=${encodedConfig}&w=400&h=300&f=png`
  } catch (error) {
    console.error('Error generating chart:', error)
  }
}

const loadLeaderboard = async () => {
  try {
    loading.value = true
    const response = await api.get('/leaderboard')
    leaderboardData.value = response.data.data
  } catch (error) {
    console.error('Error loading leaderboard:', error)
  } finally {
    loading.value = false
  }
}

// Watchers
watch(activeMetric, () => {
  generateChart()
})

// Lifecycle
onMounted(async () => {
  await loadLeaderboard()
  await generateChart()
})
</script>

<style scoped>
/* Custom styles for the leaderboard */
</style>
