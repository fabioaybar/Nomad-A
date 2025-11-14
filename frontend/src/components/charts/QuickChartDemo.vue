<template>
  <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">QuickChart Demo</h3>
    
    <!-- Chart Type Selector -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chart Type:</label>
      <select v-model="chartType" class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
        <option value="line">Line Chart</option>
        <option value="bar">Bar Chart</option>
        <option value="pie">Pie Chart</option>
        <option value="doughnut">Doughnut Chart</option>
      </select>
    </div>

    <!-- Chart Display -->
    <div class="h-96 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <img
        :src="chartUrl"
        :alt="`${chartType} chart`"
        class="w-full h-full object-contain"
        @error="handleChartError"
      />
    </div>

    <!-- Chart URL (for debugging) -->
    <details class="mt-4">
      <summary class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">Show Chart URL</summary>
      <pre class="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-x-auto">{{ chartUrl }}</pre>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  generateChartUrl, 
  createRevenueChart, 
  createBookingsChart, 
  createPieChart, 
  createDoughnutChart,
  generateSampleData 
} from '../../services/quickchart'

const chartType = ref<'line' | 'bar' | 'pie' | 'doughnut'>('line')

const chartUrl = computed(() => {
  const sampleData = generateSampleData('month')
  
  switch (chartType.value) {
    case 'line':
      return generateChartUrl(createRevenueChart(sampleData.labels, sampleData.data, 'Revenue Over Time'))
    
    case 'bar':
      return generateChartUrl(createBookingsChart(sampleData.labels, sampleData.data, 'Bookings Over Time'))
    
    case 'pie':
      return generateChartUrl(createPieChart(
        ['Desktop', 'Mobile', 'Tablet'],
        [65, 25, 10],
        'Device Usage'
      ))
    
    case 'doughnut':
      return generateChartUrl(createDoughnutChart(
        ['Chrome', 'Firefox', 'Safari', 'Edge'],
        [45, 30, 15, 10],
        'Browser Usage'
      ))
    
    default:
      return generateChartUrl(createRevenueChart(sampleData.labels, sampleData.data, 'Revenue Over Time'))
  }
})

const handleChartError = (event: Event) => {
  console.error('Chart failed to load:', event)
}
</script>
