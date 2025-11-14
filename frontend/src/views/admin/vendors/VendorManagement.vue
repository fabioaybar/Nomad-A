<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.vendors.title') }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.vendors.subtitle') }}</p>
          </div>
          <button
            @click="openCreateVendorModal"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus class="w-5 h-5 mr-2" />
            {{ t('admin.vendors.create_vendor') }}
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Building2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.vendors.total_vendors') }}</h3>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.totalVendors }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Shield class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.vendors.verified_vendors') }}</h3>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.verifiedVendors }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Clock class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.vendors.pending_vendors') }}</h3>
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.pendingVendors }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <UserX class="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.vendors.suspended_vendors') }}</h3>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.suspendedVendors }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.vendors.filters') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.vendors.search') }}</label>
              <input
                v-model="filters.search"
                type="text"
                :placeholder="t('admin.vendors.search_placeholder')"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <!-- Business Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.vendors.business_type') }}</label>
              <select
                v-model="filters.business_type"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.vendors.all_types') }}</option>
                <option value="individual">{{ t('admin.vendors.individual') }}</option>
                <option value="company">{{ t('admin.vendors.company') }}</option>
                <option value="fleet">{{ t('admin.vendors.fleet') }}</option>
              </select>
            </div>

            <!-- Verification Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.vendors.verification_status') }}</label>
              <select
                v-model="filters.verification_status"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.vendors.all_statuses') }}</option>
                <option value="verified">{{ t('admin.vendors.verified') }}</option>
                <option value="pending">{{ t('admin.vendors.pending') }}</option>
                <option value="rejected">{{ t('admin.vendors.rejected') }}</option>
              </select>
            </div>

            <!-- Location Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.vendors.location') }}</label>
              <select
                v-model="filters.location"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.vendors.all_locations') }}</option>
                <option value="Santiago">{{ t('admin.vendors.santiago') }}</option>
                <option value="Valparaíso">{{ t('admin.vendors.valparaiso') }}</option>
                <option value="Concepción">{{ t('admin.vendors.concepcion') }}</option>
                <option value="La Serena">{{ t('admin.vendors.la_serena') }}</option>
              </select>
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex justify-end mt-4 space-x-2">
            <button
              @click="clearFilters"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ t('admin.vendors.clear_filters') }}
            </button>
            <button
              @click="applyFilters"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {{ t('admin.vendors.apply_filters') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Vendors Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.vendors.vendors_list') }}</h2>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('admin.vendors.showing') }} {{ filteredVendors.length }} {{ t('admin.vendors.of') }} {{ vendors.length }}</span>
              <select
                v-model="itemsPerPage"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('company_name')">
                  {{ t('admin.vendors.company') }}
                  <ChevronUp v-if="sortField === 'company_name'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('contact_email')">
                  {{ t('admin.vendors.contact') }}
                  <ChevronUp v-if="sortField === 'contact_email'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('business_type')">
                  {{ t('admin.vendors.type') }}
                  <ChevronUp v-if="sortField === 'business_type'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('location')">
                  {{ t('admin.vendors.location') }}
                  <ChevronUp v-if="sortField === 'location'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('verification_status')">
                  {{ t('admin.vendors.status') }}
                  <ChevronUp v-if="sortField === 'verification_status'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('rating')">
                  {{ t('admin.vendors.rating') }}
                  <ChevronUp v-if="sortField === 'rating'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('created_at')">
                  {{ t('admin.vendors.created') }}
                  <ChevronUp v-if="sortField === 'created_at'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('admin.vendors.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="vendor in paginatedVendors" :key="vendor.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    v-model="selectedVendors"
                    :value="vendor.id"
                    class="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <Building2 class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ vendor.company_name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ vendor.business_type }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-gray-100">{{ vendor.contact_email }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ vendor.contact_phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    vendor.business_type === 'individual' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    vendor.business_type === 'company' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                  ]">
                    {{ t(`admin.vendors.${vendor.business_type}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-gray-100">{{ vendor.city }}, {{ vendor.country }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ vendor.address }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    vendor.is_verified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    vendor.is_active ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  ]">
                    <Shield v-if="vendor.is_verified" class="w-3 h-3 mr-1" />
                    <Clock v-else-if="vendor.is_active" class="w-3 h-3 mr-1" />
                    <UserX v-else class="w-3 h-3 mr-1" />
                    {{ vendor.is_verified ? t('admin.vendors.verified') : vendor.is_active ? t('admin.vendors.pending') : t('admin.vendors.suspended') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <Star class="w-4 h-4 text-yellow-400 mr-1" />
                    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ vendor.rating.toFixed(1) }}</span>
                    <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">({{ vendor.total_bookings }} {{ t('admin.vendors.bookings') }})</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(vendor.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewVendorProfile(vendor)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      :title="t('admin.vendors.view')"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click="editVendor(vendor)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      :title="t('admin.vendors.edit')"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      v-if="!vendor.is_verified"
                      @click="verifyVendor(vendor)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      :title="t('admin.vendors.verify')"
                    >
                      <Shield class="w-4 h-4" />
                    </button>
                    <button
                      v-if="vendor.is_verified"
                      @click="unverifyVendor(vendor)"
                      class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                      :title="t('admin.vendors.unverify')"
                    >
                      <ShieldOff class="w-4 h-4" />
                    </button>
                    <button
                      @click="toggleVendorStatus(vendor)"
                      :class="[
                        'hover:opacity-75',
                        vendor.is_active ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      ]"
                      :title="vendor.is_active ? t('admin.vendors.suspend') : t('admin.vendors.activate')"
                    >
                      <UserX v-if="vendor.is_active" class="w-4 h-4" />
                      <UserCheck v-else class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteVendor(vendor)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      :title="t('admin.vendors.delete')"
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
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {{ t('admin.vendors.previous') }}
              </button>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ t('admin.vendors.page') }} {{ currentPage }} {{ t('admin.vendors.of') }} {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {{ t('admin.vendors.next') }}
              </button>
            </div>

            <!-- Bulk Actions -->
            <div v-if="selectedVendors.length > 0" class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ selectedVendors.length }} {{ t('admin.vendors.selected') }}</span>
              <button
                @click="bulkVerify"
                class="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                {{ t('admin.vendors.verify') }}
              </button>
              <button
                @click="bulkSuspend"
                class="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                {{ t('admin.vendors.suspend') }}
              </button>
              <button
                @click="bulkDelete"
                class="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                {{ t('admin.vendors.delete') }}
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
import { 
  Building2, Shield, Clock, UserX, Plus, ChevronUp, 
  Eye, Edit, Trash2, Star, ShieldOff, UserCheck
} from 'lucide-vue-next'

const { t } = useTranslation()
const router = useRouter()
const notificationStore = useNotificationStore()

// Types
interface Vendor {
  id: number
  user_id: number
  company_name: string
  business_type: 'individual' | 'company' | 'fleet'
  contact_email: string
  contact_phone: string
  description?: string
  address: string
  city: string
  country: string
  postal_code?: string
  latitude: number
  longitude: number
  is_verified: boolean
  is_active: boolean
  rating: number
  total_vehicles: number
  total_bookings: number
  created_at: string
  updated_at: string
}

// Stats
const stats = ref({
  totalVendors: 0,
  verifiedVendors: 0,
  pendingVendors: 0,
  suspendedVendors: 0
})

// Filters
const filters = ref({
  search: '',
  business_type: '',
  verification_status: '',
  location: ''
})

// Table state
const vendors = ref<Vendor[]>([])
const selectedVendors = ref<number[]>([])
const selectAll = ref(false)
const sortField = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = ref(25)
const loading = ref(false)
const pagination = ref({
  page: 1,
  limit: 25,
  total: 0,
  pages: 0
})

// Computed properties
const filteredVendors = computed(() => {
  let filtered = [...vendors.value]

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(vendor => 
      vendor.company_name.toLowerCase().includes(search) ||
      vendor.contact_email.toLowerCase().includes(search) ||
      vendor.city.toLowerCase().includes(search) ||
      vendor.id.toString().includes(search)
    )
  }

  // Business type filter
  if (filters.value.business_type) {
    filtered = filtered.filter(vendor => vendor.business_type === filters.value.business_type)
  }

  // Verification status filter
  if (filters.value.verification_status) {
    if (filters.value.verification_status === 'verified') {
      filtered = filtered.filter(vendor => vendor.is_verified)
    } else if (filters.value.verification_status === 'pending') {
      filtered = filtered.filter(vendor => !vendor.is_verified && vendor.is_active)
    } else if (filters.value.verification_status === 'rejected') {
      filtered = filtered.filter(vendor => !vendor.is_verified && !vendor.is_active)
    }
  }

  // Location filter
  if (filters.value.location) {
    filtered = filtered.filter(vendor => vendor.city === filters.value.location)
  }

  // Sorting
    if (sortField.value) {
      filtered.sort((a, b) => {
        const aValue = a[sortField.value as keyof Vendor] ?? ''
        const bValue = b[sortField.value as keyof Vendor] ?? ''
        if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
        if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
        return 0
      })
  }

  return filtered
})

const paginatedVendors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredVendors.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredVendors.value.length / itemsPerPage.value)
})

// Methods
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
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
    selectedVendors.value = paginatedVendors.value.map(vendor => vendor.id)
  } else {
    selectedVendors.value = []
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadVendors()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    business_type: '',
    verification_status: '',
    location: ''
  }
  currentPage.value = 1
  loadVendors()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadVendors()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadVendors()
  }
}

// Load vendors from API
const loadVendors = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', itemsPerPage.value.toString())
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.business_type) params.append('business_type', filters.value.business_type)
    if (filters.value.verification_status === 'verified') params.append('is_verified', 'true')
    if (filters.value.verification_status === 'pending') {
      params.append('is_verified', 'false')
      params.append('is_active', 'true')
    }
    if (filters.value.location) params.append('city', filters.value.location)
    
    const response = await api.get(`/admin/vendors?${params.toString()}`)
    
    if (response.data.success) {
      vendors.value = response.data.data.vendors || []
      pagination.value = response.data.data.pagination || pagination.value
      
      // Update stats
      updateStats()
    }
  } catch (error) {
    console.error('Failed to load vendors:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vendors.error_title'),
      message: t('admin.vendors.load_error')
    })
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.value = {
    totalVendors: vendors.value.length,
    verifiedVendors: vendors.value.filter(v => v.is_verified).length,
    pendingVendors: vendors.value.filter(v => !v.is_verified && v.is_active).length,
    suspendedVendors: vendors.value.filter(v => !v.is_active).length
  }
}

// Vendor actions
const openCreateVendorModal = () => {
  // TODO: Implement create vendor modal
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.vendors.create_vendor'),
    message: t('admin.vendors.create_vendor_message')
  })
}

const viewVendorProfile = (vendor: Vendor) => {
  router.push(`/admin/vendors/${vendor.id}`)
}

const editVendor = (vendor: Vendor) => {
  // TODO: Implement edit vendor modal
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.vendors.edit_vendor'),
    message: t('admin.vendors.edit_vendor_message')
  })
}

const verifyVendor = async (vendor: Vendor) => {
  try {
    const response = await api.put(`/admin/vendors/${vendor.id}/verify`, {
      is_verified: true
    })
    
    if (response.data.success) {
      vendor.is_verified = true
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.vendors.success_title'),
        message: t('admin.vendors.vendor_verified')
      })
    }
  } catch (error) {
    console.error('Failed to verify vendor:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vendors.error_title'),
      message: t('admin.vendors.verify_error')
    })
  }
}

const unverifyVendor = async (vendor: Vendor) => {
  try {
    const response = await api.put(`/admin/vendors/${vendor.id}/verify`, {
      is_verified: false
    })
    
    if (response.data.success) {
      vendor.is_verified = false
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.vendors.success_title'),
        message: t('admin.vendors.vendor_unverified')
      })
    }
  } catch (error) {
    console.error('Failed to unverify vendor:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vendors.error_title'),
      message: t('admin.vendors.unverify_error')
    })
  }
}

const toggleVendorStatus = async (vendor: Vendor) => {
  try {
    const newStatus = !vendor.is_active
    const response = await api.put(`/vendors/${vendor.id}`, {
      is_active: newStatus
    })
    
    if (response.data.success) {
      vendor.is_active = newStatus
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.vendors.success_title'),
        message: newStatus ? t('admin.vendors.vendor_activated') : t('admin.vendors.vendor_suspended')
      })
    }
  } catch (error) {
    console.error('Failed to update vendor status:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vendors.error_title'),
      message: t('admin.vendors.status_update_error')
    })
  }
}

const deleteVendor = async (vendor: Vendor) => {
  if (!confirm(t('admin.vendors.delete_confirm', { name: vendor.company_name }))) return
  
  try {
    const response = await api.delete(`/admin/vendors/${vendor.id}`)
    
    if (response.data.success) {
      const index = vendors.value.findIndex(v => v.id === vendor.id)
      if (index > -1) {
        vendors.value.splice(index, 1)
        updateStats()
      }
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.vendors.success_title'),
        message: t('admin.vendors.vendor_deleted')
      })
    }
  } catch (error) {
    console.error('Failed to delete vendor:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vendors.error_title'),
      message: t('admin.vendors.delete_error')
    })
  }
}

// Bulk actions
const bulkVerify = async () => {
  if (!confirm(t('admin.vendors.bulk_verify_confirm', { count: selectedVendors.value.length }))) return
  
  try {
    const promises = selectedVendors.value.map(vendorId => 
      api.put(`/admin/vendors/${vendorId}/verify`, { is_verified: true })
    )
    
    await Promise.all(promises)
    
    // Update local data
    selectedVendors.value.forEach(vendorId => {
      const vendor = vendors.value.find(v => v.id === vendorId)
      if (vendor) vendor.is_verified = true
    })
    
    selectedVendors.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.vendors.success_title'),
      message: t('admin.vendors.bulk_verify_success')
    })
  } catch (error) {
    console.error('Failed to bulk verify vendors:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vendors.error_title'),
      message: t('admin.vendors.bulk_verify_error')
    })
  }
}

const bulkSuspend = async () => {
  if (!confirm(t('admin.vendors.bulk_suspend_confirm', { count: selectedVendors.value.length }))) return
  
  try {
    const promises = selectedVendors.value.map(vendorId => 
      api.put(`/vendors/${vendorId}`, { is_active: false })
    )
    
    await Promise.all(promises)
    
    // Update local data
    selectedVendors.value.forEach(vendorId => {
      const vendor = vendors.value.find(v => v.id === vendorId)
      if (vendor) vendor.is_active = false
    })
    
    selectedVendors.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.vendors.success_title'),
      message: t('admin.vendors.bulk_suspend_success')
    })
  } catch (error) {
    console.error('Failed to bulk suspend vendors:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vendors.error_title'),
      message: t('admin.vendors.bulk_suspend_error')
    })
  }
}

const bulkDelete = async () => {
  if (!confirm(t('admin.vendors.bulk_delete_confirm', { count: selectedVendors.value.length }))) return
  
  try {
    const promises = selectedVendors.value.map(vendorId => 
      api.delete(`/admin/vendors/${vendorId}`)
    )
    
    await Promise.all(promises)
    
    // Remove from local data
    selectedVendors.value.forEach(vendorId => {
      const index = vendors.value.findIndex(v => v.id === vendorId)
      if (index > -1) {
        vendors.value.splice(index, 1)
      }
    })
    
    selectedVendors.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.vendors.success_title'),
      message: t('admin.vendors.bulk_delete_success')
    })
  } catch (error) {
    console.error('Failed to bulk delete vendors:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.vendors.error_title'),
      message: t('admin.vendors.bulk_delete_error')
    })
  }
}

// Load data
onMounted(() => {
  loadVendors()
})
</script>

