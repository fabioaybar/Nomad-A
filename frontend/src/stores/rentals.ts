import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'
import { useAuthStore } from './auth'
import type { Booking } from '../backend/types'

export type RentalStatus = 'active' | 'completed' | 'cancelled' | 'pending'

export interface Vehicle {
  id: number
  make: string
  model: string
  year: number
  type: string
  images?: string[]
}

export interface Rental {
  id: number
  vehicle: Vehicle
  start_date: string
  end_date: string
  total_cost: number
  status: RentalStatus
  has_review: boolean
  pickup_location: string
  return_location: string
  notes?: string
  vendor_id?: number
  vendor_name?: string
}

export const useRentalsStore = defineStore('rentals', () => {
  const rentals = ref<Rental[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isDemoData = ref(false)

  const rentalsById = computed<Record<number, Rental>>(() => {
    const map: Record<number, Rental> = {}
    for (const r of rentals.value) map[r.id] = r
    return map
  })

  const rentalsByStatus = computed<Record<RentalStatus, Rental[]>>(() => {
    return {
      active: rentals.value.filter(r => r.status === 'active'),
      pending: rentals.value.filter(r => r.status === 'pending'),
      completed: rentals.value.filter(r => r.status === 'completed'),
      cancelled: rentals.value.filter(r => r.status === 'cancelled'),
    }
  })

  const getCount = (status: 'all' | RentalStatus) => {
    if (status === 'all') return rentals.value.length
    return rentalsByStatus.value[status]?.length || 0
  }

  const getByStatus = (status: 'all' | RentalStatus) => {
    if (status === 'all') return rentals.value
    return rentalsByStatus.value[status] || []
  }

  const sortRentals = (list: Rental[], sortKey: 'newest' | 'oldest' | 'price_asc' | 'price_desc') => {
    const copy = [...list]
    switch (sortKey) {
      case 'oldest':
        return copy.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      case 'price_asc':
        return copy.sort((a, b) => a.total_cost - b.total_cost)
      case 'price_desc':
        return copy.sort((a, b) => b.total_cost - a.total_cost)
      case 'newest':
      default:
        return copy.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    }
  }

  const loadRentals = async () => {
    if (loading.value) return
    loading.value = true
    error.value = null
    isDemoData.value = false
    
    try {
      const authStore = useAuthStore()
      const userId = authStore.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }
      
      const response = await api.get(`/users/${userId}/bookings`)
      
      if (response.data.success && response.data.data) {
        // Convert Booking[] to Rental[] format
        rentals.value = response.data.data.map((booking: Booking) => ({
          id: booking.id,
          vehicle: {
            id: booking.vehicle?.id || 0,
            make: booking.vehicle?.make || '',
            model: booking.vehicle?.model || '',
            year: booking.vehicle?.year || 0,
            type: booking.vehicle?.type || '',
            images: booking.vehicle?.images || []
          },
          start_date: booking.start_date,
          end_date: booking.end_date,
          total_cost: booking.total_cost,
          status: booking.status as RentalStatus,
          has_review: false, // TODO: Check if review exists
          pickup_location: booking.pickup_location,
          return_location: booking.return_location,
          notes: booking.notes,
          vendor_id: booking.vendor?.id,
          vendor_name: booking.vendor?.company_name
        }))
      } else {
        throw new Error('Failed to load rentals')
      }
      
      isDemoData.value = false
    } catch (e: any) {
      if (e?.status === 401) throw e
      console.log('API not available, using mock data')
      await useDemo()
    } finally {
      loading.value = false
    }
  }

  const useDemo = async () => {
    await new Promise(r => setTimeout(r, 300))
    rentals.value = [
      {
        id: 1,
        vehicle: { id: 1, make: 'Toyota', model: 'Camry', year: 2022, type: 'Sedan', images: ['/images/defaults/sedan.png'] },
        start_date: '2024-01-15',
        end_date: '2024-01-20',
        total_cost: 175000, // 5 days × 35,000 CLP/day
        status: 'active',
        has_review: false,
        pickup_location: 'Downtown',
        return_location: 'Airport'
      },
      {
        id: 2,
        vehicle: { id: 2, make: 'Honda', model: 'CR-V', year: 2021, type: 'SUV', images: ['/images/defaults/suv.png'] },
        start_date: '2024-01-10',
        end_date: '2024-01-12',
        total_cost: 90000, // 2 days × 45,000 CLP/day
        status: 'completed',
        has_review: true,
        pickup_location: 'Airport',
        return_location: 'Downtown'
      },
      {
        id: 3,
        vehicle: { id: 3, make: 'BMW', model: '330i', year: 2023, type: 'Sedan', images: ['/images/defaults/sedan.png'] },
        start_date: '2024-02-01',
        end_date: '2024-02-05',
        total_cost: 325000, // 5 days × 65,000 CLP/day
        status: 'pending',
        has_review: false,
        pickup_location: 'Downtown',
        return_location: 'Downtown'
      },
      {
        id: 4,
        vehicle: { id: 4, make: 'Porsche', model: '911', year: 2023, type: 'Convertible', images: ['/images/defaults/convertible.png'] },
        start_date: '2023-12-24',
        end_date: '2023-12-26',
        total_cost: 150000, // 2 days × 75,000 CLP/day (premium vehicle rate)
        status: 'cancelled',
        has_review: false,
        pickup_location: 'Airport',
        return_location: 'Airport'
      }
    ]
    isDemoData.value = true
  }

  return {
    // state
    rentals,
    loading,
    error,
    isDemoData,
    // indexes
    rentalsById,
    rentalsByStatus,
    // getters
    getByStatus,
    getCount,
    sortRentals,
    // actions
    loadRentals,
  }
})


