<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.vehicles.title') }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.vehicles.subtitle') }}</p>
          </div>
          <button
            @click="addVehicle"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus class="w-5 h-5 mr-2" />
            {{ t('admin.vehicles.add_vehicle') }}
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Car class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.vehicles.total_vehicles') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalVehicles }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.vehicles.available') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.availableVehicles }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <AlertTriangle class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.vehicles.pending_approval') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.pendingApprovalVehicles }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <Wrench class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.vehicles.maintenance') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.maintenanceVehicles }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.vehicles.search') }}</label>
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('admin.vehicles.search_placeholder')"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.vehicles.status') }}</label>
              <select
                v-model="statusFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.vehicles.all_statuses') }}</option>
                <option value="available">{{ t('admin.vehicles.available') }}</option>
                <option value="rented">{{ t('admin.vehicles.rented') }}</option>
                <option value="maintenance">{{ t('admin.vehicles.maintenance') }}</option>
                <option value="out_of_service">{{ t('admin.vehicles.out_of_service') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.vehicles.type') }}</label>
              <select
                v-model="typeFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.vehicles.all_types') }}</option>
                <option value="sedan">{{ t('admin.vehicles.sedan') }}</option>
                <option value="suv">{{ t('admin.vehicles.suv') }}</option>
                <option value="hatchback">{{ t('admin.vehicles.hatchback') }}</option>
                <option value="convertible">{{ t('admin.vehicles.convertible') }}</option>
                <option value="truck">{{ t('admin.vehicles.truck') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.vehicles.branch') }}</label>
              <select
                v-model="branchFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.vehicles.all_branches') }}</option>
                <option value="downtown">{{ t('admin.vehicles.downtown') }}</option>
                <option value="airport">{{ t('admin.vehicles.airport') }}</option>
                <option value="mall">{{ t('admin.vehicles.mall') }}</option>
                <option value="university">{{ t('admin.vehicles.university') }}</option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <button
                @click="clearFilters"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {{ t('admin.vehicles.clear_filters') }}
              </button>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.vehicles.showing') }} {{ filteredVehicles.length }} {{ t('admin.vehicles.of') }} {{ vehicles.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicles Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.vehicles.vehicles_list') }}</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('make')">
                  {{ t('admin.vehicles.vehicle') }}
                  <ChevronUp v-if="sortField === 'make'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('type')">
                  {{ t('admin.vehicles.type') }}
                  <ChevronUp v-if="sortField === 'type'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('rental_status')">
                  {{ t('admin.vehicles.status') }}
                  <ChevronUp v-if="sortField === 'rental_status'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('price_per_day')">
                  {{ t('admin.vehicles.daily_rate') }}
                  <ChevronUp v-if="sortField === 'price_per_day'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('rating')">
                  {{ t('admin.vehicles.rating') }}
                  <ChevronUp v-if="sortField === 'rating'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('created_at')">
                  {{ t('admin.vehicles.created') }}
                  <ChevronUp v-if="sortField === 'created_at'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.vehicles.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="vehicle in paginatedVehicles" :key="vehicle.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    v-model="selectedVehicles"
                    :value="vehicle.id"
                    class="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-12 h-8 bg-gray-100 dark:bg-gray-600 rounded-md flex items-center justify-center mr-4">
                      <Car class="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ vehicle.make }} {{ vehicle.model }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ vehicle.year }} • {{ vehicle.license_plate }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ t(`admin.vehicles.${vehicle.type}`) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    vehicle.rental_status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    vehicle.rental_status === 'rented' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    vehicle.rental_status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  ]">
                    {{ t(`admin.vehicles.${vehicle.rental_status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(vehicle.price_per_day) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <Star class="w-4 h-4 text-yellow-400 mr-1" />
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ vehicle.rating.toFixed(1) }}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">({{ vehicle.total_bookings }})</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(vehicle.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewVehicle(vehicle)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      :title="t('admin.vehicles.view')"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click="editVehicle(vehicle)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      :title="t('admin.vehicles.edit')"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      v-if="!vehicle.is_available"
                      @click="approveVehicle(vehicle)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      :title="t('admin.vehicles.approve')"
                    >
                      <CheckCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="!vehicle.is_available"
                      @click="rejectVehicle(vehicle)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      :title="t('admin.vehicles.reject')"
                    >
                      <XCircle class="w-4 h-4" />
                    </button>
                    <button
                      @click="toggleVehicleStatus(vehicle)"
                      :class="[
                        'transition-colors',
                        vehicle.rental_status === 'available' ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300' :
                        'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                      ]"
                      :title="vehicle.rental_status === 'available' ? t('admin.vehicles.set_maintenance') : t('admin.vehicles.set_available')"
                    >
                      <Wrench class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteVehicle(vehicle)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      :title="t('admin.vehicles.delete')"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('admin.vehicles.showing') }} {{ filteredVehicles.length }} {{ t('admin.vehicles.of') }} {{ vehicles.length }}</span>
            </div>

            <!-- Bulk Actions -->
            <div v-if="selectedVehicles.length > 0" class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ selectedVehicles.length }} {{ t('admin.vehicles.selected') }}</span>
              <button
                @click="bulkApprove"
                class="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                {{ t('admin.vehicles.approve') }}
              </button>
              <button
                @click="bulkReject"
                class="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                {{ t('admin.vehicles.reject') }}
              </button>
              <button
                @click="bulkDelete"
                class="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                {{ t('admin.vehicles.delete') }}
              </button>
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ t('admin.vehicles.previous') }}
              </button>
              <span class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">{{ currentPage }} {{ t('admin.vehicles.of') }} {{ totalPages }}</span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ t('admin.vehicles.next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from '../../../services/i18n'
import { useNotificationStore } from '../../../stores/notifications'
import { api } from '../../../services/api'
import type { PaginatedResponse } from '../../../types/api'
import { 
  Car, Plus, Search, Eye, Edit, Wrench, Trash2, ChevronUp, 
  Shield, AlertTriangle, CheckCircle, XCircle
} from 'lucide-vue-next'

const { t } = useTranslation()
const router = useRouter()
const notificationStore = useNotificationStore()

// Types
interface Vehicle {
  id: number
  vendor_id: number
  make: string
  model: string
  year: number
  license_plate: string
  type: 'sedan' | 'suv' | 'hatchback' | 'convertible' | 'truck' | 'van' | 'coupe'
  fuel_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric'
  transmission: 'manual' | 'automatic'
  seating_capacity: number
  price_per_day: number
  rental_status: 'available' | 'rented' | 'maintenance' | 'out_of_service'
  is_available: boolean
  rating: number
  total_bookings: number
  total_revenue: number
  created_at: string
  updated_at: string
  images?: string[]
  features?: string[]
  description?: string
  mileage?: number
  last_service_date?: string
  next_service_date?: string
  insurance_expiry?: string
  registration_expiry?: string
}

// State
const vehicles = ref<Vehicle[]>([])
const selectedVehicles = ref<number[]>([])
const selectAll = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const branchFilter = ref('')
const vendorFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(25)
const loading = ref(false)
const sortField = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')
interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

const pagination = ref<Pagination>({
  page: 1,
  limit: 25,
  total: 0,
  pages: 0
})

// Stats interface
interface VehicleStats {
  totalVehicles: number
  availableVehicles: number
  rentedVehicles: number
  maintenanceVehicles: number
  outOfServiceVehicles: number
  pendingApprovalVehicles: number
  totalRevenue: number
  averageRating: number
}

// Stats
const stats = ref<VehicleStats>({
  totalVehicles: 0,
  availableVehicles: 0,
  rentedVehicles: 0,
  maintenanceVehicles: 0,
  outOfServiceVehicles: 0,
  pendingApprovalVehicles: 0,
  totalRevenue: 0,
  averageRating: 0
})

// Computed properties
const filteredVehicles = computed(() => {
  let filtered = [...vehicles.value]

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(vehicle => 
      vehicle.make.toLowerCase().includes(search) ||
      vehicle.model.toLowerCase().includes(search) ||
      vehicle.license_plate.toLowerCase().includes(search) ||
      vehicle.id.toString().includes(search)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(vehicle => vehicle.rental_status === statusFilter.value)
  }

  // Type filter
  if (typeFilter.value) {
    filtered = filtered.filter(vehicle => vehicle.type === typeFilter.value)
  }

  // Vendor filter
  if (vendorFilter.value) {
    filtered = filtered.filter(vehicle => vehicle.vendor_id === parseInt(vendorFilter.value))
  }

  // Sorting
  if (sortField.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortField.value as keyof Vehicle] ?? ''
      const bValue = b[sortField.value as keyof Vehicle] ?? ''
      
      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

const paginatedVehicles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredVehicles.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredVehicles.value.length / itemsPerPage.value)
})

// Methods
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedVehicles.value = paginatedVehicles.value.map(vehicle => vehicle.id)
  } else {
    selectedVehicles.value = []
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  typeFilter.value = ''
  vendorFilter.value = ''
  currentPage.value = 1
  loadVehicles()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadVehicles()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadVehicles()
  }
}

// Load vehicles from API
const loadVehicles = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', itemsPerPage.value.toString())
    
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (statusFilter.value) params.append('rental_status', statusFilter.value)
    if (typeFilter.value) params.append('type', typeFilter.value)
    if (vendorFilter.value) params.append('vendor_id', vendorFilter.value)
    
    const { data } = await api.get<PaginatedResponse<Vehicle>>(`/admin/vehicles?${params.toString()}`)
    
    vehicles.value = data.data ?? []
    
    pagination.value = {
      page: data.page,
      limit: data.limit,
      total: data.total,
      pages: data.pages
    }
    
    // Update stats
    updateStats()
  } catch (error) {
    console.error('Failed to load vehicles:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vehicles.error_title'),
      message: t('admin.vehicles.load_error')
    })
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.value = {
    totalVehicles: vehicles.value.length,
    availableVehicles: vehicles.value.filter(v => v.rental_status === 'available').length,
    rentedVehicles: vehicles.value.filter(v => v.rental_status === 'rented').length,
    maintenanceVehicles: vehicles.value.filter(v => v.rental_status === 'maintenance').length,
    outOfServiceVehicles: vehicles.value.filter(v => v.rental_status === 'out_of_service').length,
    pendingApprovalVehicles: vehicles.value.filter(v => !v.is_available).length,
    totalRevenue: vehicles.value.reduce((sum, v) => sum + v.total_revenue, 0),
    averageRating: vehicles.value.length > 0 ? vehicles.value.reduce((sum, v) => sum + v.rating, 0) / vehicles.value.length : 0
  }
}

// Vehicle actions
const addVehicle = () => {
  // TODO: Implement add vehicle modal
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.vehicles.add_vehicle'),
    message: t('admin.vehicles.add_vehicle_message')
  })
}

const viewVehicle = (vehicle: Vehicle) => {
  router.push(`/admin/vehicles/${vehicle.id}`)
}

const editVehicle = (vehicle: Vehicle) => {
  // TODO: Implement edit vehicle modal
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.vehicles.edit_vehicle'),
    message: t('admin.vehicles.edit_vehicle_message')
  })
}

const approveVehicle = async (vehicle: Vehicle) => {
  try {
    const response = await api.put(`/vehicles/${vehicle.id}`, {
      is_available: true
    })
    
    if (response.data.success) {
      vehicle.is_available = true
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.vehicles.success_title'),
        message: t('admin.vehicles.vehicle_approved')
      })
    }
  } catch (error) {
    console.error('Failed to approve vehicle:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vehicles.error_title'),
      message: t('admin.vehicles.approve_error')
    })
  }
}

const rejectVehicle = async (vehicle: Vehicle) => {
  try {
    const response = await api.put(`/vehicles/${vehicle.id}`, {
      is_available: false,
      rental_status: 'out_of_service'
    })
    
    if (response.data.success) {
      vehicle.is_available = false
      vehicle.rental_status = 'out_of_service'
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.vehicles.success_title'),
        message: t('admin.vehicles.vehicle_rejected')
      })
    }
  } catch (error) {
    console.error('Failed to reject vehicle:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vehicles.error_title'),
      message: t('admin.vehicles.reject_error')
    })
  }
}

const toggleVehicleStatus = async (vehicle: Vehicle) => {
  try {
    const newStatus = vehicle.rental_status === 'available' ? 'maintenance' : 'available'
    const response = await api.put(`/vehicles/${vehicle.id}`, {
      rental_status: newStatus
    })
    
    if (response.data.success) {
      vehicle.rental_status = newStatus
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.vehicles.success_title'),
        message: newStatus === 'maintenance' ? t('admin.vehicles.vehicle_maintenance') : t('admin.vehicles.vehicle_available')
      })
    }
  } catch (error) {
    console.error('Failed to update vehicle status:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vehicles.error_title'),
      message: t('admin.vehicles.status_update_error')
    })
  }
}

const deleteVehicle = async (vehicle: Vehicle) => {
  if (!confirm(t('admin.vehicles.delete_confirm', { name: `${vehicle.make} ${vehicle.model}` }))) return
  
  try {
    const response = await api.delete(`/admin/vehicles/${vehicle.id}`)
    
    if (response.data.success) {
      const index = vehicles.value.findIndex(v => v.id === vehicle.id)
      if (index > -1) {
        vehicles.value.splice(index, 1)
        updateStats()
      }
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.vehicles.success_title'),
        message: t('admin.vehicles.vehicle_deleted')
      })
    }
  } catch (error) {
    console.error('Failed to delete vehicle:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vehicles.error_title'),
      message: t('admin.vehicles.delete_error')
    })
  }
}

// Bulk actions
const bulkApprove = async () => {
  if (!confirm(t('admin.vehicles.bulk_approve_confirm', { count: selectedVehicles.value.length }))) return
  
  try {
    const promises = selectedVehicles.value.map(vehicleId => 
      api.put(`/vehicles/${vehicleId}`, { is_available: true })
    )
    
    await Promise.all(promises)
    
    // Update local data
    selectedVehicles.value.forEach(vehicleId => {
      const vehicle = vehicles.value.find(v => v.id === vehicleId)
      if (vehicle) vehicle.is_available = true
    })
    
    selectedVehicles.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.vehicles.success_title'),
      message: t('admin.vehicles.bulk_approve_success')
    })
  } catch (error) {
    console.error('Failed to bulk approve vehicles:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vehicles.error_title'),
      message: t('admin.vehicles.bulk_approve_error')
    })
  }
}

const bulkReject = async () => {
  if (!confirm(t('admin.vehicles.bulk_reject_confirm', { count: selectedVehicles.value.length }))) return
  
  try {
    const promises = selectedVehicles.value.map(vehicleId => 
      api.put(`/vehicles/${vehicleId}`, { 
        is_available: false, 
        rental_status: 'out_of_service' 
      })
    )
    
    await Promise.all(promises)
    
    // Update local data
    selectedVehicles.value.forEach(vehicleId => {
      const vehicle = vehicles.value.find(v => v.id === vehicleId)
      if (vehicle) {
        vehicle.is_available = false
        vehicle.rental_status = 'out_of_service'
      }
    })
    
    selectedVehicles.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.vehicles.success_title'),
      message: t('admin.vehicles.bulk_reject_success')
    })
  } catch (error) {
    console.error('Failed to bulk reject vehicles:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vehicles.error_title'),
      message: t('admin.vehicles.bulk_reject_error')
    })
  }
}

const bulkDelete = async () => {
  if (!confirm(t('admin.vehicles.bulk_delete_confirm', { count: selectedVehicles.value.length }))) return
  
  try {
    const promises = selectedVehicles.value.map(vehicleId => 
      api.delete(`/admin/vehicles/${vehicleId}`)
    )
    
    await Promise.all(promises)
    
    // Remove from local data
    selectedVehicles.value.forEach(vehicleId => {
      const index = vehicles.value.findIndex(v => v.id === vehicleId)
      if (index > -1) {
        vehicles.value.splice(index, 1)
      }
    })
    
    selectedVehicles.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.vehicles.success_title'),
      message: t('admin.vehicles.bulk_delete_success')
    })
  } catch (error) {
    console.error('Failed to bulk delete vehicles:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vehicles.error_title'),
      message: t('admin.vehicles.bulk_delete_error')
    })
  }
}

// Load data
onMounted(() => {
  loadVehicles()
})
</script>
