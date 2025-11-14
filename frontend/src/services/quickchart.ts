/**
 * QuickChart API service for generating chart images
 * Documentation: https://quickchart.io/
 */

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea'
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
      fill?: boolean
    }>
  }
  options?: {
    responsive?: boolean
    plugins?: {
      title?: {
        display: boolean
        text: string
      }
      legend?: {
        display: boolean
        position?: 'top' | 'bottom' | 'left' | 'right'
      }
    }
    scales?: {
      y?: {
        beginAtZero?: boolean
        ticks?: {
          callback?: (value: any) => string
        }
      }
    }
  }
}

export interface QuickChartOptions {
  width?: number
  height?: number
  format?: 'png' | 'svg'
  backgroundColor?: string
  devicePixelRatio?: number
  version?: '2' | '3' | '4'
}

/**
 * Generate a chart URL using QuickChart API
 */
export function generateQuickChart(config: ChartConfig): string {
  return generateChartUrl(config)
}

export function generateChartUrl(
  config: ChartConfig,
  options: QuickChartOptions = {}
): string {
  const baseUrl = 'https://quickchart.io/chart'
  
  const defaultOptions: Required<QuickChartOptions> = {
    width: 800,
    height: 400,
    format: 'png',
    backgroundColor: 'transparent',
    devicePixelRatio: 1,
    version: '3'
  }
  
  const mergedOptions = { ...defaultOptions, ...options }
  
  // Convert config to JSON string and encode
  const configJson = JSON.stringify(config)
  const encodedConfig = encodeURIComponent(configJson)
  
  // Build query parameters
  const params = new URLSearchParams({
    width: mergedOptions.width.toString(),
    height: mergedOptions.height.toString(),
    format: mergedOptions.format,
    backgroundColor: mergedOptions.backgroundColor,
    devicePixelRatio: mergedOptions.devicePixelRatio.toString(),
    version: mergedOptions.version,
    c: configJson
  })
  
  return `${baseUrl}?${params.toString()}`
}

/**
 * Generate a revenue chart configuration
 */
export function createRevenueChart(
  labels: string[],
  data: number[],
  title: string = 'Revenue Over Time'
): ChartConfig {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Revenue',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => `$${value.toLocaleString()}`
          }
        }
      }
    }
  }
}

/**
 * Generate a bookings chart configuration
 */
export function createBookingsChart(
  labels: string[],
  data: number[],
  title: string = 'Bookings Over Time'
): ChartConfig {
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Bookings',
        data,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  }
}

/**
 * Generate a pie chart configuration
 */
export function createPieChart(
  labels: string[],
  data: number[],
  title: string = 'Distribution'
): ChartConfig {
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 158, 11, 0.8)',   // Yellow
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(6, 182, 212, 0.8)',    // Cyan
    'rgba(34, 197, 94, 0.8)'     // Emerald
  ]
  
  return {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Distribution',
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title
        },
        legend: {
          display: true,
          position: 'right'
        }
      }
    }
  }
}

/**
 * Generate a doughnut chart configuration
 */
export function createDoughnutChart(
  labels: string[],
  data: number[],
  title: string = 'Distribution'
): ChartConfig {
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 158, 11, 0.8)',   // Yellow
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(6, 182, 212, 0.8)',    // Cyan
    'rgba(34, 197, 94, 0.8)'     // Emerald
  ]
  
  return {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        label: 'Distribution',
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title
        },
        legend: {
          display: true,
          position: 'right'
        }
      }
    }
  }
}

/**
 * Generate sample data for different time periods
 */
export function generateSampleData(period: 'week' | 'month' | 'year') {
  const now = new Date()
  
  switch (period) {
    case 'week':
      return {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10000) + 5000)
      }
    
    case 'month':
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      return {
        labels: Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString()),
        data: Array.from({ length: daysInMonth }, () => Math.floor(Math.random() * 20000) + 10000)
      }
    
    case 'year':
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100000) + 50000)
      }
    
    default:
      return {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        data: [12000, 15000, 18000, 14000, 16000, 20000]
      }
  }
}
