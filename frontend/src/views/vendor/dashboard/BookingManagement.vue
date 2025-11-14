<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('vendor.bookings.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.subtitle') }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock class="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('vendor.bookings.pending') }}</h3>
              <p class="text-2xl font-bold text-blue-600">{{ stats.pending }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle class="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('vendor.bookings.active') }}</h3>
              <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar class="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('vendor.bookings.completed') }}</h3>
              <p class="text-2xl font-bold text-purple-600">{{ stats.completed }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <DollarSign class="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('vendor.bookings.revenue') }}</h3>
              <p class="text-2xl font-bold text-orange-600">{{ formatCurrency(stats.revenue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <!-- Search -->
          <div class="relative">
            <input
              type="text"
              v-model="search"
              :placeholder="t('vendor.bookings.search_placeholder')"
              class="w-full sm:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <!-- Status Filter -->
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{{ t('vendor.bookings.all_statuses') }}</option>
            <option value="pending">{{ t('vendor.bookings.pending') }}</option>
            <option value="confirmed">{{ t('vendor.bookings.confirmed') }}</option>
            <option value="active">{{ t('vendor.bookings.active') }}</option>
            <option value="completed">{{ t('vendor.bookings.completed') }}</option>
            <option value="cancelled">{{ t('vendor.bookings.cancelled') }}</option>
          </select>

          <!-- Date Filter -->
          <input
            type="date"
            v-model="filters.date"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div class="flex gap-2">
          <button @click="exportBookings" class="btn-secondary flex items-center">
            <Download class="w-4 h-4 mr-2" />
            {{ t('vendor.bookings.export') }}
          </button>
          <button @click="refreshBookings" class="btn-secondary flex items-center">
            <RefreshCw class="w-4 h-4 mr-2" />
            {{ t('vendor.bookings.refresh') }}
          </button>
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.bookings.loading') }}</p>
        </div>

        <div v-else-if="filteredBookings.length === 0" class="p-8 text-center">
          <Calendar class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('vendor.bookings.no_bookings') }}</h3>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.bookings.no_bookings_desc') }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.bookings.customer') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.bookings.vehicle') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.bookings.dates') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.bookings.total') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.bookings.status') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.bookings.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="booking in pagedBookings" :key="booking.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <User class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ booking.customer }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ booking.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Car class="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ booking.vehicle }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ booking.licensePlate }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(booking.startDate) }}</div>
                  <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(booking.endDate) }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ booking.days }} {{ t('vendor.bookings.days') }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(booking.total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusClass(booking.status)]">
                    {{ t(`vendor.bookings.statuses.${booking.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewBooking(booking)"
                      class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                      :title="t('vendor.bookings.view_details')"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      v-if="booking.status === 'pending'"
                      @click="confirmBooking(booking)"
                      class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      :title="t('vendor.bookings.confirm')"
                    >
                      <CheckCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="booking.status === 'confirmed'"
                      @click="startBooking(booking)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      :title="t('vendor.bookings.start')"
                    >
                      <Play class="w-4 h-4" />
                    </button>
                    <button
                      v-if="booking.status === 'active'"
                      @click="completeBooking(booking)"
                      class="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                      :title="t('vendor.bookings.complete')"
                    >
                      <CheckCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="['pending', 'confirmed'].includes(booking.status)"
                      @click="cancelBooking(booking)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      :title="t('vendor.bookings.cancel')"
                    >
                      <XCircle class="w-4 h-4" />
                    </button>
                    <button
                      @click="contactCustomer(booking)"
                      class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      :title="t('vendor.bookings.contact')"
                    >
                      <MessageCircle class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredBookings.length > 0" class="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('vendor.bookings.showing') }} {{ startIndex + 1 }}–{{ Math.min(startIndex + pageSize, filteredBookings.length) }} {{ t('vendor.bookings.of') }} {{ filteredBookings.length }}
          </div>
          <div class="flex items-center gap-2">
            <button
              :disabled="page === 1"
              @click="page--"
              class="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              {{ t('vendor.bookings.previous') }}
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ t('vendor.bookings.page') }} {{ page }}
            </span>
            <button
              :disabled="page >= totalPages"
              @click="page++"
              class="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              {{ t('vendor.bookings.next') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Booking Detail Modal -->
      <div v-if="selectedBooking" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/40" @click="selectedBooking = null"></div>
        <div class="relative max-w-4xl mx-auto mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('vendor.bookings.booking_details') }}</h3>
            <button @click="selectedBooking = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Customer Information -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.bookings.customer_info') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.name') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.customer }}</span>
                  </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.email') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.email }}</span>
                  </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.phone') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.phone || t('vendor.bookings.not_provided') }}</span>
                    </div>
                    </div>
                  </div>

            <!-- Vehicle Information -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.bookings.vehicle_info') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.vehicle') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.vehicle }}</span>
                  </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.license_plate') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.licensePlate }}</span>
                    </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.year') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.year }}</span>
                    </div>
                  </div>
                  </div>

            <!-- Booking Details -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.bookings.booking_details') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.start_date') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedBooking.startDate) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.end_date') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedBooking.endDate) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.duration') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedBooking.days }} {{ t('vendor.bookings.days') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.total_cost') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(selectedBooking.total) }}</span>
                </div>
                  </div>
            </div>

            <!-- Status & Actions -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.bookings.status_actions') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.bookings.current_status') }}:</span>
                  <span :class="['px-2 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusClass(selectedBooking.status)]">
                    {{ t(`vendor.bookings.statuses.${selectedBooking.status}`) }}
                  </span>
          </div>
                
                <div class="flex flex-wrap gap-2">
                  <button
                    v-if="selectedBooking.status === 'pending'"
                    @click="confirmBooking(selectedBooking)"
                    class="btn-primary text-sm"
                  >
                    {{ t('vendor.bookings.confirm') }}
                  </button>
                  <button
                    v-if="selectedBooking.status === 'confirmed'"
                    @click="startBooking(selectedBooking)"
                    class="btn-primary text-sm"
                  >
                    {{ t('vendor.bookings.start') }}
                  </button>
                  <button
                    v-if="selectedBooking.status === 'active'"
                    @click="completeBooking(selectedBooking)"
                    class="btn-primary text-sm"
                  >
                    {{ t('vendor.bookings.complete') }}
                  </button>
                  <button
                    v-if="['pending', 'confirmed'].includes(selectedBooking.status)"
                    @click="cancelBooking(selectedBooking)"
                    class="btn-secondary text-sm"
                  >
                    {{ t('vendor.bookings.cancel') }}
                  </button>
                  <button
                    @click="contactCustomer(selectedBooking)"
                    class="btn-secondary text-sm"
                  >
                    {{ t('vendor.bookings.contact') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Clock, 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  Search, 
  Download, 
  RefreshCw,
  Eye, 
  User, 
  Car, 
  MessageCircle,
  Play,
  XCircle,
  X
} from 'lucide-vue-next'
import { useAuthStore } from '../../../stores/auth'
import { useNotificationStore } from '../../../stores/notifications'
import { useTranslation } from '../../../services/i18n'
import { api } from '../../../services/api'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { t } = useTranslation()

// Types
interface Booking {
  id: number
  customer: string
  email: string
  phone?: string
  vehicle: string
  licensePlate: string
  year?: number
  startDate: string
  endDate: string
  days: number
  total: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  user: any
  vehicleData: any
}

// State
const bookings = ref<Booking[]>([])
const loading = ref(false)
const selectedBooking = ref<Booking | null>(null)
const search = ref('')
const filters = ref({
  status: '',
  date: ''
})
const page = ref(1)
const pageSize = 10

// Computed
const stats = computed(() => {
  const stats = {
    pending: 0,
    active: 0,
    completed: 0,
    revenue: 0
  }
  
  bookings.value.forEach(booking => {
    if (booking.status === 'pending') stats.pending++
    if (booking.status === 'active') stats.active++
    if (booking.status === 'completed') stats.completed++
    if (booking.status === 'completed') stats.revenue += booking.total
  })
  
  return stats
})

const filteredBookings = computed(() => {
  let filtered = bookings.value
  
  if (search.value) {
    const query = search.value.toLowerCase()
    filtered = filtered.filter(booking => 
      booking.customer.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.vehicle.toLowerCase().includes(query) ||
      booking.licensePlate.toLowerCase().includes(query)
    )
  }
  
  if (filters.value.status) {
    filtered = filtered.filter(booking => booking.status === filters.value.status)
  }
  
  if (filters.value.date) {
    filtered = filtered.filter(booking => 
      booking.startDate.startsWith(filters.value.date) ||
      booking.endDate.startsWith(filters.value.date)
    )
  }
  
  return filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
})

const pagedBookings = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredBookings.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredBookings.value.length / pageSize))
const startIndex = computed(() => (page.value - 1) * pageSize)

// Methods
const loadBookings = async () => {
  try {
    loading.value = true
    console.log('📅 Loading bookings from API...')
    
    // Get vendor's bookings directly
    const bookingsResponse = await api.get('/vendors/bookings', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    console.log('📅 Bookings API Response:', bookingsResponse.data)
    const allBookings = bookingsResponse.data.data || bookingsResponse.data || []
    
    // Get vendor's vehicles for reference
    const vehiclesResponse = await api.get('/vendors/vehicles', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    const vendorVehicles = vehiclesResponse.data.data || vehiclesResponse.data || []
    
    // Format booking data
    const vendorBookings = allBookings.map((booking: any) => {
      const vehicle = vendorVehicles.find((v: any) => v.id === booking.vehicle_id)
        const startDate = new Date(booking.start_date)
        const endDate = new Date(booking.end_date)
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        
        return {
          id: booking.id,
          customer: booking.user?.name || 'Unknown Customer',
          email: booking.user?.email || '',
          phone: booking.user?.phone,
          vehicle: vehicle ? `${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle',
          licensePlate: vehicle?.license_plate || '',
          year: vehicle?.year,
          startDate: booking.start_date,
          endDate: booking.end_date,
          days,
          total: booking.total_cost || 0,
          status: booking.status,
          user: booking.user,
          vehicleData: vehicle
        }
      })
    
    bookings.value = vendorBookings
    console.log('📅 Bookings loaded:', bookings.value.length, 'bookings')
  } catch (error) {
    console.error('Error loading bookings:', error)
    bookings.value = []
  } finally {
    loading.value = false
  }
}

const refreshBookings = () => {
  loadBookings()
}

const exportBookings = () => {
  // TODO: Implement CSV export
  notificationStore.addNotification({
    type: 'info',
    title: 'Export Feature',
    message: 'CSV export functionality will be implemented soon.'
  })
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const viewBooking = (booking: Booking) => {
  selectedBooking.value = booking
}

const confirmBooking = async (booking: Booking) => {
  try {
    const response = await api.post(`/bookings/${booking.id}/confirm`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.bookings.success_title'),
        message: t('vendor.bookings.confirm_success')
      })
      
      // Update local booking status
      booking.status = 'confirmed'
      selectedBooking.value = null
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.bookings.error_title'),
      message: error.message || t('vendor.bookings.confirm_error')
    })
  }
}

const startBooking = async (booking: Booking) => {
  try {
    const response = await api.post(`/bookings/${booking.id}/start`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.bookings.success_title'),
        message: t('vendor.bookings.start_success')
      })
      
      // Update local booking status
      booking.status = 'active'
      selectedBooking.value = null
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.bookings.error_title'),
      message: error.message || t('vendor.bookings.start_error')
    })
  }
}

const completeBooking = async (booking: Booking) => {
  try {
    const response = await api.post(`/bookings/${booking.id}/complete`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.bookings.success_title'),
        message: t('vendor.bookings.complete_success')
      })
      
      // Update local booking status
      booking.status = 'completed'
      selectedBooking.value = null
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.bookings.error_title'),
      message: error.message || t('vendor.bookings.complete_error')
    })
  }
}

const cancelBooking = async (booking: Booking) => {
  if (!confirm(t('vendor.bookings.cancel_confirm'))) return
  
  try {
    const response = await api.post(`/bookings/${booking.id}/cancel`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.bookings.success_title'),
        message: t('vendor.bookings.cancel_success')
      })
      
      // Update local booking status
      booking.status = 'cancelled'
      selectedBooking.value = null
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.bookings.error_title'),
      message: error.message || t('vendor.bookings.cancel_error')
    })
  }
}

const contactCustomer = (booking: Booking) => {
  // TODO: Implement customer communication
  notificationStore.addNotification({
    type: 'info',
    title: 'Contact Customer',
    message: `Contact feature for ${booking.customer} will be implemented soon.`
  })
}

// Lifecycle
onMounted(() => {
  loadBookings()
})
</script>