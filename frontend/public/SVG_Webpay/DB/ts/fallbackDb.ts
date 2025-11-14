/*
  Enhanced IndexedDB-backed fallback DB for the frontend.
  - Seeds data from /SVG_Webpay/DB/seed.json on first run
  - Provides CRUD helpers and data persistence
  - Includes analytics and chart data stores
  - Used when network/API is unreachable
*/

import type { ChartState, AnalyticsState, ReportState, LeaderboardEntry, AnalyticsStores } from './types'

type SeedShape = Record<string, any[]>
type StoreNames = keyof AnalyticsStores | string

const DB_NAME = 'nomada_fallback_db_v2'
const SEED_URL = '/SVG_Webpay/DB/seed.json'

const STORE_SCHEMAS = {
  'analytics.charts': { keyPath: 'id' },
  'analytics.metrics': { keyPath: 'id' },
  'analytics.reports': { keyPath: 'id' },
  'analytics.leaderboard': { keyPath: 'id' },
  'roles': { keyPath: 'id_rol' },
  'usuarios': { keyPath: 'id_usuario' },
  'vendedores': { keyPath: 'id_vendedor' },
  'modelos': { keyPath: 'id_modelo' },
  'autos': { keyPath: 'id_auto' },
  'reservas': { keyPath: 'id_reserva' },
  'conversaciones': { keyPath: 'id_conversacion' },
  'mensajes': { keyPath: 'id_mensaje' },
  'mantenimientos': { keyPath: 'id_mantenimiento' },
  'notificaciones': { keyPath: 'id_notificacion' },
  'descuentos': { keyPath: 'id_descuento' },
  'metodos_pago': { keyPath: 'id_metodo' },
  'recompensas': { keyPath: 'id_recompensa' },
  'resenas': { keyPath: 'id_resena' }
} as const

export class FallbackDB {
  private dbPromise: Promise<IDBDatabase> | null = null
  private stores = Object.keys(STORE_SCHEMAS)

  async init() {
    if (!this.dbPromise) {
      this.dbPromise = this.openDB()
      const db = await this.dbPromise
      await this.seedIfEmpty(db)
    }
    return this.dbPromise
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = (ev) => {
        const db = (ev.target as IDBOpenDBRequest).result
        for (const [name, schema] of Object.entries(STORE_SCHEMAS)) {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, schema)
          }
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }

  private async seedIfEmpty(db: IDBDatabase) {
    try {
      const tx = db.transaction(this.stores, 'readonly')
      const counts = await Promise.all(this.stores.map(s => this.storeCount(tx.objectStore(s))))
      const hasAny = counts.some(c => c > 0)
      if (!hasAny) {
        const res = await fetch(SEED_URL)
        if (!res.ok) return
        const seed: SeedShape = await res.json()
        const wtx = db.transaction(this.stores, 'readwrite')
        for (const storeName of this.stores) {
          const items = seed[storeName] || []
          const s = wtx.objectStore(storeName)
          for (const it of items) {
            try { s.add(it) } catch (e) { /* ignore duplicates */ }
          }
        }
        await this.txComplete(wtx)
      }
    } catch (e) {
      console.warn('FallbackDB seed failed', e)
    }
  }

  private storeCount(store: IDBObjectStore): Promise<number> {
    return new Promise((res, rej) => {
      const req = store.count()
      req.onsuccess = () => res(req.result as number)
      req.onerror = () => rej(req.error)
    })
  }

  private txComplete(tx: IDBTransaction): Promise<void> {
    return new Promise((res, rej) => {
      tx.oncomplete = () => res()
      tx.onerror = () => rej(tx.error)
      tx.onabort = () => rej(tx.error)
    })
  }

  private async getDB() {
    if (!this.dbPromise) await this.init()
    return this.dbPromise as Promise<IDBDatabase>
  }

  // Generic CRUD operations
  async list<T = any>(storeName: StoreNames): Promise<T[]> {
    const db = await this.getDB()
    return new Promise((res, rej) => {
      const tx = db.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)
      const req = store.getAll()
      req.onsuccess = () => res(req.result as T[])
      req.onerror = () => rej(req.error)
    })
  }

  async get<T = any>(storeName: StoreNames, key: IDBValidKey): Promise<T | null> {
    const db = await this.getDB()
    return new Promise((res, rej) => {
      const tx = db.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)
      const req = store.get(key)
      req.onsuccess = () => res(req.result ?? null)
      req.onerror = () => rej(req.error)
    })
  }

  async create<T = any>(storeName: StoreNames, item: T): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(storeName, 'readwrite')
    tx.objectStore(storeName).add(item)
    return this.txComplete(tx)
  }

  async put<T = any>(storeName: StoreNames, item: T): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(storeName, 'readwrite')
    tx.objectStore(storeName).put(item)
    return this.txComplete(tx)
  }

  async remove(storeName: StoreNames, key: IDBValidKey): Promise<void> {
    const db = await this.getDB()
    const tx = db.transaction(storeName, 'readwrite')
    tx.objectStore(storeName).delete(key)
    return this.txComplete(tx)
  }

  // Convenience: filter by predicate in memory
  async query<T = any>(storeName: StoreNames, predicate: (item: T) => boolean): Promise<T[]> {
    const all = await this.list<T>(storeName)
    return all.filter(predicate)
  }

  // Analytics helpers
  async getChartData(chartId: string): Promise<ChartState | null> {
    return this.get('analytics.charts', chartId)
  }

  async saveChartData(chart: ChartState): Promise<void> {
    return this.put('analytics.charts', {
      ...chart,
      lastUpdated: new Date().toISOString()
    })
  }

  async getAnalytics(): Promise<AnalyticsState | null> {
    return this.get('analytics.metrics', 'current')
  }

  async saveAnalytics(data: Omit<AnalyticsState, 'id' | 'lastSynced'>): Promise<void> {
    return this.put('analytics.metrics', {
      id: 'current',
      ...data,
      lastSynced: new Date().toISOString()
    })
  }

  async getReport(reportId: string): Promise<ReportState | null> {
    return this.get('analytics.reports', reportId)
  }

  async saveReport(report: ReportState): Promise<void> {
    return this.put('analytics.reports', report)
  }

  async getLeaderboard(category: string): Promise<LeaderboardEntry[]> {
    const all = await this.list<LeaderboardEntry>('analytics.leaderboard')
    return all
      .filter(e => e.category === category)
      .sort((a, b) => b.score - a.score)
      .map((e, i) => ({ ...e, rank: i + 1 }))
  }

  async saveLeaderboardEntry(entry: LeaderboardEntry): Promise<void> {
    return this.put('analytics.leaderboard', entry)
  }

  // Computed queries for charts/analytics
  async getVehiclePerformance(vehicleId: number): Promise<any> {
    const [reservas, resenas] = await Promise.all([
      this.query('reservas', (r: any) => r.id_auto === vehicleId),
      this.query('resenas', (r: any) => r.id_auto === vehicleId)
    ])

    const totalBookings = reservas.length
    const totalRevenue = reservas.reduce((sum: number, r: any) => sum + (r.costo_total || 0), 0)
    const rating = resenas.reduce((sum: number, r: any) => sum + (r.calificacion || 0), 0) / (resenas.length || 1)

    return {
      totalBookings,
      totalRevenue,
      rating,
      reservations: reservas,
      reviews: resenas
    }
  }

  async getVendorPerformance(vendorId: number): Promise<any> {
    const [autos, reservas, resenas] = await Promise.all([
      this.query('autos', (a: any) => a.id_vendedor === vendorId),
      this.query('reservas', (r: any) => r.id_vendedor === vendorId),
      this.query('resenas', (r: any) => r.id_vendedor === vendorId)
    ])

    return {
      fleetSize: autos.length,
      totalBookings: reservas.length,
      totalRevenue: reservas.reduce((sum: number, r: any) => sum + (r.costo_total || 0), 0),
      rating: resenas.reduce((sum: number, r: any) => sum + (r.calificacion || 0), 0) / (resenas.length || 1),
      vehicles: autos,
      reservations: reservas,
      reviews: resenas
    }
  }

  // System-wide analytics
  async getSystemMetrics(): Promise<any> {
    const [usuarios, reservas, autos, vendedores] = await Promise.all([
      this.list('usuarios'),
      this.list('reservas'),
      this.list('autos'),
      this.list('vendedores')
    ])

    const totalRevenue = reservas.reduce((sum: any, r: any) => sum + (r.costo_total || 0), 0)
    const activeVehicles = autos.filter((a: any) => a.estado === 'disponible').length
    const totalVendors = vendedores.length
    const activeUsers = usuarios.filter((u: any) => u.is_active).length

    return {
      totalRevenue,
      totalBookings: reservas.length,
      activeVehicles,
      totalVendors,
      activeUsers,
      fleetUtilization: activeVehicles / autos.length
    }
  }
}

// Singleton instance for easy import
export const fallbackDb = new FallbackDB()