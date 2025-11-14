import { ref, computed } from 'vue'
import type { Vehicle, VehicleFilters } from '../types/vehicle'
import type { ApiResponse } from '../types/api'
import { api } from '../services/api'
import type { AxiosResponse } from 'axios'

export function useVehicleManagement() {
  const vehicles = ref<Vehicle[]>([])
  const loading = ref(false)
  const searchQuery = ref('')
  const filters = ref<VehicleFilters>({
    status: '',
    type: '',
    branch: ''
  })

  // Sorting
  const sortField = ref<keyof Vehicle>('created_at')
  const sortDirection = ref<'asc' | 'desc'>('desc')

  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  const filteredVehicles = computed(() => {
    return vehicles.value.filter(vehicle => {
      const matchesSearch = !searchQuery.value || 
        vehicle.make.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        vehicle.license_plate.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesStatus = !filters.value.status || vehicle.rental_status === filters.value.status
      const matchesType = !filters.value.type || vehicle.type === filters.value.type

      return matchesSearch && matchesStatus && matchesType
    })
  })

  const sortedVehicles = computed(() => {
    return [...filteredVehicles.value].sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]

      if (aVal == null || bVal == null) return 0
      
      const comparison = String(aVal).localeCompare(String(bVal))
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  })

  const paginatedVehicles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return sortedVehicles.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(filteredVehicles.value.length / itemsPerPage.value)
  )

  const loadVehicles = async (endpoint: string = '/vendors/vehicles') => {
    try {
      loading.value = true
      const { data } = await api.get<Vehicle[]>(endpoint, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      vehicles.value = Array.isArray(data.data) ? data.data : []
    } catch (error) {
      console.error('Error loading vehicles:', error)
      vehicles.value = []
      throw error
    } finally {
      loading.value = false
    }
  }

  const sortBy = (field: keyof Vehicle) => {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortDirection.value = 'asc'
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const clearFilters = () => {
    searchQuery.value = ''
    filters.value = {
      status: '',
      type: '',
      branch: ''
    }
  }

  return {
    vehicles,
    loading,
    searchQuery,
    filters,
    sortField,
    sortDirection,
    currentPage,
    itemsPerPage,
    filteredVehicles,
    sortedVehicles,
    paginatedVehicles,
    totalPages,
    loadVehicles,
    sortBy,
    nextPage,
    previousPage,
    clearFilters
  }
}