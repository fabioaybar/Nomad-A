// Vehicle Store using Backend API

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { vehicleApi } from '../backend/services'
import type { Vehicle, VehicleListParams } from '../backend/types'

export const useVehicleStore = defineStore('vehicles', () => {
  const vehicles = ref<Vehicle[]>([])
  const currentVehicle = ref<Vehicle | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isDemoData = ref(false)

  // Computed properties
  const vehiclesById = computed<Record<number, Vehicle>>(() => {
    const map: Record<number, Vehicle> = {}
    for (const v of vehicles.value) map[v.id] = v
    return map
  })

  const availableVehicles = computed(() => {
    return vehicles.value.filter(v => v.is_available && v.rental_status === 'available')
  })

  const vehiclesByMake = computed(() => {
    const makes: Record<string, Vehicle[]> = {}
    vehicles.value.forEach(vehicle => {
      if (!makes[vehicle.make]) {
        makes[vehicle.make] = []
      }
      makes[vehicle.make].push(vehicle)
    })
    return makes
  })

  const vehiclesByType = computed(() => {
    const types: Record<string, Vehicle[]> = {}
    vehicles.value.forEach(vehicle => {
      if (!types[vehicle.type]) {
        types[vehicle.type] = []
      }
      types[vehicle.type].push(vehicle)
    })
    return types
  })

  // Actions
  const loadVehicles = async (params?: VehicleListParams) => {
    if (loading.value) return
    loading.value = true
    error.value = null
    isDemoData.value = false

    try {
      const response = await vehicleApi.getVehicles(params)
      
      if (response.success && response.data) {
        vehicles.value = response.data
        isDemoData.value = false
        return
      }
      
      if (!import.meta.env.DEV) {
        vehicles.value = []
        isDemoData.value = false
        return
      }
      
      await useDemo()
    } catch (e: any) {
      if (e?.status === 401) throw e
      console.log('API not available, using mock data')
      await useDemo()
    } finally {
      loading.value = false
    }
  }

  const loadAvailableVehicles = async (params?: Omit<VehicleListParams, 'is_available'>) => {
    if (loading.value) return
    loading.value = true
    error.value = null
    isDemoData.value = false

    try {
      const response = await vehicleApi.getAvailableVehicles(params)
      
      if (response.success && response.data) {
        vehicles.value = response.data
        isDemoData.value = false
        return
      }
      
      if (!import.meta.env.DEV) {
        vehicles.value = []
        isDemoData.value = false
        return
      }
      
      await useDemo()
    } catch (e: any) {
      if (e?.status === 401) throw e
      console.log('API not available, using mock data')
      await useDemo()
    } finally {
      loading.value = false
    }
  }

  const getVehicle = async (id: number) => {
    try {
      const response = await vehicleApi.getVehicle(id)
      
      if (response.success && response.data) {
        currentVehicle.value = response.data
        return response.data
      }
      
      throw new Error('Vehicle not found')
    } catch (e: any) {
      if (e?.status === 401) throw e
      console.log('API not available, using mock data')
      return getMockVehicle(id)
    }
  }

  const searchVehicles = async (query: string, params?: Omit<VehicleListParams, 'search'>) => {
    if (loading.value) return
    loading.value = true
    error.value = null

    try {
      const response = await vehicleApi.searchVehicles(query, params)
      
      if (response.success && response.data) {
        vehicles.value = response.data
        return response.data
      }
      
      return []
    } catch (e: any) {
      if (e?.status === 401) throw e
      console.log('API not available, using mock data')
      return vehicles.value.filter(v => 
        v.make.toLowerCase().includes(query.toLowerCase()) ||
        v.model.toLowerCase().includes(query.toLowerCase())
      )
    } finally {
      loading.value = false
    }
  }

  const getNearbyVehicles = async (latitude: number, longitude: number, radius: number = 10) => {
    if (loading.value) return
    loading.value = true
    error.value = null

    try {
      const response = await vehicleApi.getNearbyVehicles(latitude, longitude, radius)
      
      if (response.success && response.data) {
        vehicles.value = response.data
        return response.data
      }
      
      return []
    } catch (e: any) {
      if (e?.status === 401) throw e
      console.log('API not available, using mock data')
      return vehicles.value // Return all vehicles as fallback
    } finally {
      loading.value = false
    }
  }

  const calculateRentalCost = async (vehicleId: number, startDate: string, endDate: string) => {
    try {
      const response = await vehicleApi.calculateRentalCost(vehicleId, startDate, endDate)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error('Failed to calculate cost')
    } catch (e: any) {
      console.log('API not available, using mock calculation')
      // Mock calculation
      const vehicle = vehicles.value.find(v => v.id === vehicleId)
      if (!vehicle) throw new Error('Vehicle not found')
      
      const start = new Date(startDate)
      const end = new Date(endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        daily_rate: vehicle.price_per_day,
        number_of_days: days,
        total_cost: vehicle.price_per_day * days,
        currency: 'CLP'
      }
    }
  }

  const checkAvailability = async (vehicleId: number, startDate: string, endDate: string) => {
    try {
      const response = await vehicleApi.checkAvailability(vehicleId, startDate, endDate)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error('Failed to check availability')
    } catch (e: any) {
      console.log('API not available, using mock availability')
      // Mock availability check
      return {
        is_available: true,
        conflicting_bookings: []
      }
    }
  }

  // Mock data for development
  const useDemo = async () => {
    await new Promise(r => setTimeout(r, 300))
    vehicles.value = [
      {
        id: 1,
        vendor_id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        color: 'Silver',
        type: 'sedan',
        fuel_type: 'gasoline',
        transmission: 'automatic',
        engine_size: '2.5L',
        mileage: 15000,
        seats: 5,
        doors: 4,
        price_per_day: 35000,
        location_address: 'Downtown Santiago',
        latitude: -33.4489,
        longitude: -70.6693,
        is_available: true,
        is_rented: false,
        rental_status: 'available',
        average_rating: 4.5,
        total_reviews: 12,
        images: ['/placeholder-car.jpg'],
        features: ['Air Conditioning', 'Bluetooth', 'GPS'],
        description: 'Comfortable sedan perfect for city driving',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        vendor_id: 1,
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        color: 'Blue',
        type: 'suv',
        fuel_type: 'gasoline',
        transmission: 'automatic',
        engine_size: '1.5L Turbo',
        mileage: 25000,
        seats: 5,
        doors: 4,
        price_per_day: 45000,
        location_address: 'Las Condes',
        latitude: -33.4172,
        longitude: -70.5500,
        is_available: true,
        is_rented: false,
        rental_status: 'available',
        average_rating: 4.7,
        total_reviews: 8,
        images: ['/placeholder-car.jpg'],
        features: ['All Wheel Drive', 'Sunroof', 'Leather Seats'],
        description: 'Spacious SUV ideal for family trips',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 3,
        vendor_id: 2,
        make: 'BMW',
        model: '3 Series',
        year: 2022,
        color: 'Black',
        type: 'sedan',
        fuel_type: 'gasoline',
        transmission: 'automatic',
        engine_size: '2.0L Turbo',
        mileage: 12000,
        seats: 5,
        doors: 4,
        price_per_day: 65000,
        location_address: 'Providencia',
        latitude: -33.4255,
        longitude: -70.6067,
        is_available: true,
        is_rented: false,
        rental_status: 'available',
        average_rating: 4.8,
        total_reviews: 15,
        images: ['/placeholder-car.jpg'],
        features: ['Premium Audio', 'Heated Seats', 'Sport Mode'],
        description: 'Luxury sedan with premium features',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ]
    isDemoData.value = true
  }

  const getMockVehicle = (id: number): Vehicle | null => {
    return vehicles.value.find(v => v.id === id) || null
  }

  return {
    // State
    vehicles,
    currentVehicle,
    loading,
    error,
    isDemoData,
    
    // Computed
    vehiclesById,
    availableVehicles,
    vehiclesByMake,
    vehiclesByType,
    
    // Actions
    loadVehicles,
    loadAvailableVehicles,
    getVehicle,
    searchVehicles,
    getNearbyVehicles,
    calculateRentalCost,
    checkAvailability,
  }
})
