// Database and API Types for Analytics & Charts

export interface ChartDataPoint {
  label: string
  value: number
  category?: string
  timestamp?: string
}

export interface ChartData {
  title: string
  type: 'line' | 'bar' | 'pie' | 'radar'
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
  }[]
}

export interface PerformanceMetrics {
  bookingCompletionRate: number
  averageResponseTime: number
  customerSatisfaction: number
  fleetUtilization: number
  revenue: {
    total: number
    byPeriod: ChartDataPoint[]
  }
}

export interface VehicleAnalytics {
  id: number
  totalBookings: number
  totalRevenue: number
  utilization: number
  maintenanceCosts: number
  rating: number
  popularTimeSlots: ChartDataPoint[]
}

export interface VendorAnalytics {
  id: number
  totalRevenue: number
  fleetSize: number
  activeBookings: number
  customerRating: number
  responseRate: number
  performanceHistory: ChartDataPoint[]
}

export interface SystemAnalytics {
  activeUsers: number
  totalBookings: number
  totalRevenue: number
  growthRate: number
  userRetention: number
  platformMetrics: {
    uptime: number
    responseTime: number
    errorRate: number
  }
}

export interface LeaderboardEntry {
  id: number
  name: string
  score: number
  rank: number
  change: number
  category: string
}

export interface RevenueReport {
  period: string
  grossRevenue: number
  netRevenue: number
  expenses: {
    category: string
    amount: number
  }[]
  transactions: {
    date: string
    amount: number
    type: string
  }[]
}

// State types for local IndexedDB stores
export interface ChartState {
  id: string
  data: ChartData
  lastUpdated: string
}

export interface AnalyticsState {
  id: string
  metrics: PerformanceMetrics
  vehicles: VehicleAnalytics[]
  vendors: VendorAnalytics[]
  system: SystemAnalytics
  lastSynced: string
}

export interface ReportState {
  id: string
  type: string
  data: any
  generated: string
  expiresAt: string
}

// DB schema extensions for analytics
export interface AnalyticsStores {
  'analytics.charts': ChartState[]
  'analytics.metrics': AnalyticsState
  'analytics.reports': ReportState[]
  'analytics.leaderboard': LeaderboardEntry[]
}