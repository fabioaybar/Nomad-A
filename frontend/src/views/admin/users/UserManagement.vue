<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.users.title') }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.users.subtitle') }}</p>
          </div>
          <button
            @click="openCreateUserModal"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus class="w-5 h-5 mr-2" />
            {{ t('admin.users.create_user') }}
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Users class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.users.total_users') }}</h3>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <UserCheck class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.users.active_users') }}</h3>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.activeUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Shield class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.users.verified_users') }}</h3>
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.verifiedUsers }}</p>
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
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.users.suspended_users') }}</h3>
              <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.suspendedUsers }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.users.filters') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.users.search') }}</label>
              <input
                v-model="filters.search"
                type="text"
                :placeholder="t('admin.users.search_placeholder')"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            <!-- Role Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.users.role') }}</label>
              <select
                v-model="filters.role"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.users.all_roles') }}</option>
                <option value="user">{{ t('admin.users.user_role') }}</option>
                <option value="vendor">{{ t('admin.users.vendor_role') }}</option>
                <option value="admin">{{ t('admin.users.admin_role') }}</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.users.status') }}</label>
              <select
                v-model="filters.status"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.users.all_statuses') }}</option>
                <option value="active">{{ t('admin.users.active') }}</option>
                <option value="suspended">{{ t('admin.users.suspended') }}</option>
                <option value="pending">{{ t('admin.users.pending') }}</option>
              </select>
            </div>

            <!-- Verification Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.users.verification') }}</label>
              <select
                v-model="filters.verified"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.users.all') }}</option>
                <option value="true">{{ t('admin.users.verified') }}</option>
                <option value="false">{{ t('admin.users.unverified') }}</option>
              </select>
            </div>
          </div>

          <!-- Date Range Filter -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.users.date_from') }}</label>
              <input
                v-model="filters.dateFrom"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.users.date_to') }}</label>
              <input
                v-model="filters.dateTo"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="flex justify-end mt-4 space-x-2">
            <button
              @click="clearFilters"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ t('admin.users.clear_filters') }}
            </button>
            <button
              @click="applyFilters"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {{ t('admin.users.apply_filters') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.users.users_list') }}</h2>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ t('admin.users.showing') }} {{ filteredUsers.length }} {{ t('admin.users.of') }} {{ users.length }}</span>
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('name')">
                  {{ t('admin.users.name') }}
                  <ChevronUp v-if="sortField === 'name'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('email')">
                  {{ t('admin.users.email') }}
                  <ChevronUp v-if="sortField === 'email'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('role')">
                  {{ t('admin.users.role') }}
                  <ChevronUp v-if="sortField === 'role'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('status')">
                  {{ t('admin.users.status') }}
                  <ChevronUp v-if="sortField === 'status'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer" @click="sortBy('createdAt')">
                  {{ t('admin.users.created') }}
                  <ChevronUp v-if="sortField === 'createdAt'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {{ t('admin.users.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    v-model="selectedUsers"
                    :value="user.id"
                    class="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <User class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-gray-100">{{ user.email }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    <span v-if="user.verified" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <Shield class="w-3 h-3 mr-1" />
                      {{ t('admin.users.verified') }}
                    </span>
                    <span v-else class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      <AlertCircle class="w-3 h-3 mr-1" />
                      {{ t('admin.users.unverified') }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                    user.role === 'vendor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  ]">
                    {{ t(`admin.users.${user.role}_role`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  ]">
                    {{ user.is_active ? t('admin.users.active') : t('admin.users.suspended') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewUserProfile(user)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      :title="t('admin.users.view')"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click="editUser(user)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      :title="t('admin.users.edit')"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="[
                        'hover:opacity-75',
                        user.is_active ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      ]"
                      :title="user.is_active ? t('admin.users.suspend') : t('admin.users.activate')"
                    >
                      <UserX v-if="user.is_active" class="w-4 h-4" />
                      <UserCheck v-else class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      :title="t('admin.users.delete')"
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
                {{ t('admin.users.previous') }}
              </button>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                {{ t('admin.users.page') }} {{ currentPage }} {{ t('admin.users.of') }} {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {{ t('admin.users.next') }}
              </button>
            </div>

            <!-- Bulk Actions -->
            <div v-if="selectedUsers.length > 0" class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ selectedUsers.length }} {{ t('admin.users.selected') }}</span>
              <button
                @click="bulkSuspend"
                class="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                {{ t('admin.users.suspend') }}
              </button>
              <button
                @click="bulkVerify"
                class="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                {{ t('admin.users.verify') }}
              </button>
              <button
                @click="bulkDelete"
                class="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                {{ t('admin.users.delete') }}
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
  Users, UserCheck, UserX, Shield, Plus, ChevronUp, 
  Eye, Edit, Trash2, AlertCircle, User
} from 'lucide-vue-next'

const { t } = useTranslation()
const router = useRouter()
const notificationStore = useNotificationStore()

// Types
interface User {
  id: number
  email: string
  name: string
  role: 'user' | 'vendor' | 'admin'
  is_active: boolean
  verified: boolean
  created_at: string
  last_login?: string
  reward_points?: number
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
}

// Stats
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  verifiedUsers: 0,
  suspendedUsers: 0
})

// Filters
const filters = ref({
  search: '',
  role: '',
  status: '',
  verified: '',
  dateFrom: '',
  dateTo: ''
})

// Table state
const users = ref<User[]>([])
const selectedUsers = ref<number[]>([])
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
const filteredUsers = computed(() => {
  let filtered = [...users.value]

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.id.toString().includes(search)
    )
  }

  // Role filter
  if (filters.value.role) {
    filtered = filtered.filter(user => user.role === filters.value.role)
  }

  // Status filter
  if (filters.value.status) {
    const isActive = filters.value.status === 'active'
    filtered = filtered.filter(user => user.is_active === isActive)
  }

  // Verification filter
  if (filters.value.verified !== '') {
    const verified = filters.value.verified === 'true'
    filtered = filtered.filter(user => user.verified === verified)
  }

  // Date range filter
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom)
    filtered = filtered.filter(user => new Date(user.created_at) >= fromDate)
  }

  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo)
    filtered = filtered.filter(user => new Date(user.created_at) <= toDate)
  }

  // Sorting
  if (sortField.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortField.value as keyof User]
      const bValue = b[sortField.value as keyof User]
      
      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
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
    selectedUsers.value = paginatedUsers.value.map(user => user.id)
  } else {
    selectedUsers.value = []
  }
}

const applyFilters = () => {
  currentPage.value = 1
  loadUsers()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    role: '',
    status: '',
    verified: '',
    dateFrom: '',
    dateTo: ''
  }
  currentPage.value = 1
  loadUsers()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadUsers()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadUsers()
  }
}

// Load users from API
const loadUsers = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', itemsPerPage.value.toString())
    
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.role) params.append('role', filters.value.role)
    if (filters.value.status) params.append('is_active', filters.value.status === 'active' ? 'true' : 'false')
    if (filters.value.verified) params.append('verified', filters.value.verified)
    
    const response = await api.get(`/admin/users?${params.toString()}`)
    
    if (response.data.success) {
      users.value = response.data.data.users || []
      pagination.value = response.data.data.pagination || pagination.value
      
      // Update stats
      updateStats()
    }
  } catch (error) {
    console.error('Failed to load users:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.users.error_title'),
      message: t('admin.users.load_error')
    })
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.value = {
    totalUsers: users.value.length,
    activeUsers: users.value.filter(u => u.is_active).length,
    verifiedUsers: users.value.filter(u => u.verified).length,
    suspendedUsers: users.value.filter(u => !u.is_active).length
  }
}

// User actions
const openCreateUserModal = () => {
  // TODO: Implement create user modal
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.users.create_user'),
    message: t('admin.users.create_user_message')
  })
}

const viewUserProfile = (user: User) => {
  router.push(`/admin/users/${user.id}`)
}

const editUser = (user: User) => {
  // TODO: Implement edit user modal
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.users.edit_user'),
    message: t('admin.users.edit_user_message')
  })
}

const toggleUserStatus = async (user: User) => {
  try {
    const newStatus = !user.is_active
    const response = await api.put(`/admin/users/${user.id}/status`, {
      is_active: newStatus
    })
    
    if (response.data.success) {
      user.is_active = newStatus
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.users.success_title'),
        message: newStatus ? t('admin.users.user_activated') : t('admin.users.user_suspended')
      })
    }
  } catch (error) {
    console.error('Failed to update user status:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.users.error_title'),
      message: t('admin.users.status_update_error')
    })
  }
}

const deleteUser = async (user: User) => {
  if (!confirm(t('admin.users.delete_confirm', { name: user.name }))) return
  
  try {
    const response = await api.delete(`/admin/users/${user.id}`)
    
    if (response.data.success) {
      const index = users.value.findIndex(u => u.id === user.id)
      if (index > -1) {
        users.value.splice(index, 1)
        updateStats()
      }
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.users.success_title'),
        message: t('admin.users.user_deleted')
      })
    }
  } catch (error) {
    console.error('Failed to delete user:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.users.error_title'),
      message: t('admin.users.delete_error')
    })
  }
}

// Bulk actions
const bulkSuspend = async () => {
  if (!confirm(t('admin.users.bulk_suspend_confirm', { count: selectedUsers.value.length }))) return
  
  try {
    const promises = selectedUsers.value.map(userId => 
      api.put(`/admin/users/${userId}/status`, { is_active: false })
    )
    
    await Promise.all(promises)
    
    // Update local data
    selectedUsers.value.forEach(userId => {
      const user = users.value.find(u => u.id === userId)
      if (user) user.is_active = false
    })
    
    selectedUsers.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.users.success_title'),
      message: t('admin.users.bulk_suspend_success')
    })
  } catch (error) {
    console.error('Failed to bulk suspend users:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.users.error_title'),
      message: t('admin.users.bulk_suspend_error')
    })
  }
}

const bulkVerify = async () => {
  if (!confirm(t('admin.users.bulk_verify_confirm', { count: selectedUsers.value.length }))) return
  
  try {
    // This would require a new API endpoint for bulk verification
    notificationStore.addNotification({
      type: 'info',
      title: t('admin.users.bulk_verify'),
      message: t('admin.users.bulk_verify_message')
    })
  } catch (error) {
    console.error('Failed to bulk verify users:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.users.error_title'),
      message: t('admin.users.bulk_verify_error')
    })
  }
}

const bulkDelete = async () => {
  if (!confirm(t('admin.users.bulk_delete_confirm', { count: selectedUsers.value.length }))) return
  
  try {
    const promises = selectedUsers.value.map(userId => 
      api.delete(`/admin/users/${userId}`)
    )
    
    await Promise.all(promises)
    
    // Remove from local data
    selectedUsers.value.forEach(userId => {
      const index = users.value.findIndex(u => u.id === userId)
      if (index > -1) {
        users.value.splice(index, 1)
      }
    })
    
    selectedUsers.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.users.success_title'),
      message: t('admin.users.bulk_delete_success')
    })
  } catch (error) {
    console.error('Failed to bulk delete users:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.users.error_title'),
      message: t('admin.users.bulk_delete_error')
    })
  }
}

// Load data
onMounted(() => {
  loadUsers()
})
</script>
