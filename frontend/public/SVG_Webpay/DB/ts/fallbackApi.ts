/*
  API wrapper that first attempts network calls to VITE_API_URL,
  then falls back to local IndexedDB via fallbackDb.
  Includes chart/analytics endpoints and data persistence.
*/

import { fallbackDb } from './fallbackDb'
import type {
  ChartData,
  PerformanceMetrics,
  VehicleAnalytics,
  VendorAnalytics,
  SystemAnalytics,
  LeaderboardEntry,
  RevenueReport
} from './types'

const API_URL = import.meta.env.VITE_API_URL || ''
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

async function fetchWithTimeout(input: RequestInfo, init?: RequestInit, timeout = TIMEOUT) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(input, { ...(init || {}), signal: controller.signal })
    clearTimeout(id)
    return res
  } catch (e) {
    clearTimeout(id)
    throw e
  }
}

async function tryNetwork(method: string, path: string, body?: any) {
  if (!API_URL) throw new Error('No API_URL')
  const url = `${API_URL}${path}`
  const opts: RequestInit = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetchWithTimeout(url, opts)
  if (!res.ok) throw new Error(`Network error: ${res.status}`)
  return res.json()
}

// Generic helper: attempt network, fallback to local DB
async function networkOrFallback(tableName: string, networkCall: () => Promise<any>, fallbackCall: () => Promise<any>) {
  try {
    return await networkCall()
  } catch (e) {
    console.warn('Network failed, using fallback for', tableName, e)
    await fallbackDb.init()
    return fallbackCall()
  }
}

// Exported API that mirrors endpoints used by the frontend
export const fallbackApi = {
  // Core data endpoints
  async listAutos() {
    return networkOrFallback('autos', () => tryNetwork('GET', '/autos'), () => fallbackDb.list('autos'))
  },

  async getAuto(id: number) {
    return networkOrFallback('autos', () => tryNetwork('GET', `/autos/${id}`), () => fallbackDb.get('autos', id))
  },

  async listModelos() {
    return networkOrFallback('modelos', () => tryNetwork('GET', `/modelos`), () => fallbackDb.list('modelos'))
  },

  async listVendedores() {
    return networkOrFallback('vendedores', () => tryNetwork('GET', `/vendedores`), () => fallbackDb.list('vendedores'))
  },

  async listReservasByUser(userId: number) {
    return networkOrFallback('reservas', () => tryNetwork('GET', `/usuarios/${userId}/reservas`), () => fallbackDb.query('reservas', (r: any) => r.id_usuario === userId))
  },

  async createReserva(payload: any) {
    return networkOrFallback('reservas', () => tryNetwork('POST', `/reservas`, payload), async () => {
      const all = await fallbackDb.list<any>('reservas')
      const maxId = all.reduce((m, x) => Math.max(m, x.id_reserva || 0), 0)
      const newId = maxId + 1
      const item = { ...payload, id_reserva: newId, creado_en: new Date().toISOString() }
      await fallbackDb.create('reservas', item)
      return item
    })
  },

  async updateReserva(id: number, changes: any) {
    return networkOrFallback('reservas', () => tryNetwork('PUT', `/reservas/${id}`, changes), async () => {
      const existing = await fallbackDb.get<any>('reservas', id)
      if (!existing) throw new Error('Not found')
      const updated = { ...existing, ...changes, actualizado_en: new Date().toISOString() }
      await fallbackDb.put('reservas', updated)
      return updated
    })
  },

  async listDescuentos() {
    return networkOrFallback('descuentos', () => tryNetwork('GET', `/descuentos`), () => fallbackDb.list('descuentos'))
  },

  async listNotificaciones(userId: number) {
    return networkOrFallback('notificaciones', () => tryNetwork('GET', `/usuarios/${userId}/notificaciones`), () => fallbackDb.query('notificaciones', (n: any) => n.id_usuario === userId))
  },

  // Chart & Analytics endpoints
  async getChartData(chartId: string): Promise<ChartData> {
    return networkOrFallback('analytics.charts', () => tryNetwork('GET', `/charts/${chartId}`), async () => {
      const stored = await fallbackDb.getChartData(chartId)
      return stored?.data || { title: '', type: 'line', labels: [], datasets: [] }
    })
  },

  async saveChartData(chartId: string, data: ChartData): Promise<void> {
    return networkOrFallback('analytics.charts', () => tryNetwork('PUT', `/charts/${chartId}`, data), () => fallbackDb.saveChartData({ id: chartId, data, lastUpdated: new Date().toISOString() }))
  },

  async getPerformanceMetrics(entityId?: number): Promise<PerformanceMetrics> {
    return networkOrFallback('analytics.metrics', () => tryNetwork('GET', `/analytics/performance${entityId ? `/${entityId}` : ''}`), async () => {
      const analytics = await fallbackDb.getAnalytics()
      return analytics?.metrics || {
        bookingCompletionRate: 0,
        averageResponseTime: 0,
        customerSatisfaction: 0,
        fleetUtilization: 0,
        revenue: { total: 0, byPeriod: [] }
      }
    })
  },

  async getVehicleAnalytics(vehicleId: number): Promise<VehicleAnalytics> {
    return networkOrFallback('analytics.vehicles', () => tryNetwork('GET', `/analytics/vehicles/${vehicleId}`), async () => {
      const data = await fallbackDb.getVehiclePerformance(vehicleId)
      return {
        id: vehicleId,
        totalBookings: data.totalBookings,
        totalRevenue: data.totalRevenue,
        utilization: data.totalBookings > 0 ? data.reservations.length / 30 : 0, // simplistic 30-day calc
        maintenanceCosts: 0,
        rating: data.rating,
        popularTimeSlots: []
      }
    })
  },

  async getVendorAnalytics(vendorId: number): Promise<VendorAnalytics> {
    return networkOrFallback('analytics.vendors', () => tryNetwork('GET', `/analytics/vendors/${vendorId}`), async () => {
      const data = await fallbackDb.getVendorPerformance(vendorId)
      return {
        id: vendorId,
        totalRevenue: data.totalRevenue,
        fleetSize: data.fleetSize,
        activeBookings: data.totalBookings,
        customerRating: data.rating,
        responseRate: 0,
        performanceHistory: []
      }
    })
  },

  async getSystemAnalytics(): Promise<SystemAnalytics> {
    return networkOrFallback('analytics.system', () => tryNetwork('GET', '/analytics/system'), async () => {
      const metrics = await fallbackDb.getSystemMetrics()
      return {
        activeUsers: metrics.activeUsers,
        totalBookings: metrics.totalBookings,
        totalRevenue: metrics.totalRevenue,
        growthRate: 0,
        userRetention: 0,
        platformMetrics: {
          uptime: 100,
          responseTime: 0,
          errorRate: 0
        }
      }
    })
  },

  async getLeaderboard(category: string): Promise<LeaderboardEntry[]> {
    return networkOrFallback('analytics.leaderboard', () => tryNetwork('GET', `/leaderboard/${category}`), () => fallbackDb.getLeaderboard(category))
  },

  async getRevenueReport(period: string): Promise<RevenueReport> {
    return networkOrFallback('analytics.reports', () => tryNetwork('GET', `/reports/revenue/${period}`), async () => {
      const report = await fallbackDb.getReport(`revenue_${period}`)
      if (report) return report.data
      const metrics = await fallbackDb.getSystemMetrics()
      return {
        period,
        grossRevenue: metrics.totalRevenue,
        netRevenue: metrics.totalRevenue * 0.8, // simplified
        expenses: [],
        transactions: []
      }
    })
  },

  // Performance tracking
  async trackPerformanceMetric(metricName: string, value: number): Promise<void> {
    return networkOrFallback('analytics.metrics', () => tryNetwork('POST', '/analytics/metrics', { metric: metricName, value }), async () => {
      const analytics = await fallbackDb.getAnalytics()
      if (!analytics) return
      const metrics = { ...analytics.metrics }
      ;(metrics as any)[metricName] = value
      await fallbackDb.saveAnalytics({ ...analytics, metrics })
    })
  }
}

export default fallbackApi