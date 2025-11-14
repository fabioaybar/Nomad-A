<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.user_profile.title') }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.user_profile.subtitle') }}</p>
          </div>
          <button
            @click="goBack"
            class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft class="w-5 h-5 mr-2" />
            {{ t('admin.user_profile.back') }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- User Info Card -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.user_profile.user_info') }}</h2>
            </div>
            <div class="p-6">
              <div class="text-center mb-6">
                <div class="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User class="w-12 h-12 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ user.name }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ user.email }}</p>
                <div class="mt-2">
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                    user.role === 'vendor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  ]">
                    {{ t(`admin.users.${user.role}_role`) }}
                  </span>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.user_profile.status') }}</span>
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    user.status === 'suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  ]">
                    {{ t(`admin.users.${user.status}`) }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.user_profile.verified') }}</span>
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    user.verified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  ]">
                    {{ user.verified ? t('admin.users.verified') : t('admin.users.unverified') }}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.user_profile.member_since') }}</span>
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(user.createdAt) }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.user_profile.last_login') }}</span>
                  <span class="text-sm text-gray-900 dark:text-gray-100">{{ formatDate(user.lastLogin) }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.user_profile.reward_points') }}</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ user.rewardPoints }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.user_profile.tier') }}</span>
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    user.tier === 'platinum' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                    user.tier === 'gold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    user.tier === 'silver' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                  ]">
                    {{ t(`admin.user_profile.${user.tier}_tier`) }}
                  </span>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">{{ t('admin.user_profile.quick_actions') }}</h4>
                <div class="space-y-2">
                  <button
                    @click="toggleUserStatus"
                    :class="[
                      'w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      user.status === 'active' 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                    ]"
                  >
                    <UserX v-if="user.status === 'active'" class="w-4 h-4 mr-2" />
                    <UserCheck v-else class="w-4 h-4 mr-2" />
                    {{ user.status === 'active' ? t('admin.users.suspend') : t('admin.users.activate') }}
                  </button>

                  <button
                    @click="toggleVerification"
                    :class="[
                      'w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      user.verified 
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                    ]"
                  >
                    <Shield v-if="user.verified" class="w-4 h-4 mr-2" />
                    <ShieldCheck v-else class="w-4 h-4 mr-2" />
                    {{ user.verified ? t('admin.user_profile.unverify') : t('admin.user_profile.verify') }}
                  </button>

                  <button
                    @click="sendNotification"
                    class="w-full flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Bell class="w-4 h-4 mr-2" />
                    {{ t('admin.user_profile.send_notification') }}
                  </button>

                  <button
                    @click="resetPassword"
                    class="w-full flex items-center justify-center px-3 py-2 bg-orange-100 text-orange-700 rounded-md text-sm font-medium hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800 transition-colors"
                  >
                    <Key class="w-4 h-4 mr-2" />
                    {{ t('admin.user_profile.reset_password') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Edit User Form -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.user_profile.edit_user') }}</h2>
            </div>
            <div class="p-6">
              <form @submit.prevent="updateUser" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.user_profile.name') }}</label>
                    <input
                      v-model="editForm.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.user_profile.email') }}</label>
                    <input
                      v-model="editForm.email"
                      type="email"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.user_profile.role') }}</label>
                    <select
                      v-model="editForm.role"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="user">{{ t('admin.users.user_role') }}</option>
                      <option value="vendor">{{ t('admin.users.vendor_role') }}</option>
                      <option value="admin">{{ t('admin.users.admin_role') }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.user_profile.status') }}</label>
                    <select
                      v-model="editForm.status"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="active">{{ t('admin.users.active') }}</option>
                      <option value="suspended">{{ t('admin.users.suspended') }}</option>
                      <option value="pending">{{ t('admin.users.pending') }}</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.user_profile.reward_points') }}</label>
                    <input
                      v-model.number="editForm.rewardPoints"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.user_profile.tier') }}</label>
                    <select
                      v-model="editForm.tier"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="bronze">{{ t('admin.user_profile.bronze_tier') }}</option>
                      <option value="silver">{{ t('admin.user_profile.silver_tier') }}</option>
                      <option value="gold">{{ t('admin.user_profile.gold_tier') }}</option>
                      <option value="platinum">{{ t('admin.user_profile.platinum_tier') }}</option>
                    </select>
                  </div>
                </div>

                <div class="flex items-center">
                  <input
                    v-model="editForm.verified"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900 dark:text-gray-100">{{ t('admin.user_profile.verified_account') }}</label>
                </div>

                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="resetForm"
                    class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {{ t('admin.user_profile.cancel') }}
                  </button>
                  <button
                    type="submit"
                    :disabled="saving"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span v-if="saving" class="flex items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {{ t('admin.user_profile.saving') }}
                    </span>
                    <span v-else>{{ t('admin.user_profile.save_changes') }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Booking History -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.user_profile.booking_history') }}</h2>
            </div>
            <div class="p-6">
              <div v-if="bookings.length === 0" class="text-center py-8">
                <Calendar class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p class="text-gray-500 dark:text-gray-400">{{ t('admin.user_profile.no_bookings') }}</p>
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="booking in bookings"
                  :key="booking.id"
                  class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div class="flex items-center">
                    <div class="w-12 h-8 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center mr-4">
                      <Car class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ booking.vehicle }}</h4>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(booking.startDate) }} - {{ formatDate(booking.endDate) }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900 dark:text-gray-100">${{ booking.totalCost }}</p>
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      booking.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      booking.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    ]">
                      {{ t(`admin.user_profile.${booking.status}`) }}
                    </span>
                  </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTranslation } from '../../../services/i18n'
import { 
  User, UserX, UserCheck, Shield, ShieldCheck, Bell, Key, 
  ArrowLeft, Calendar, Car
} from 'lucide-vue-next'

const { t } = useTranslation()
const route = useRoute()
const router = useRouter()

// Types
interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'vendor' | 'admin'
  status: 'active' | 'suspended' | 'pending'
  verified: boolean
  createdAt: Date
  lastLogin: Date
  rewardPoints: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
}

interface Booking {
  id: string
  vehicle: string
  startDate: Date
  endDate: Date
  totalCost: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
}

// State
const loading = ref(true)
const saving = ref(false)
const user = ref<User | null>(null)
const bookings = ref<Booking[]>([])

// Edit form
const editForm = ref({
  name: '',
  email: '',
  role: 'user' as 'user' | 'vendor' | 'admin',
  status: 'active' as 'active' | 'suspended' | 'pending',
  rewardPoints: 0,
  tier: 'bronze' as 'bronze' | 'silver' | 'gold' | 'platinum',
  verified: false
})

// Mock data
const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  role: 'user',
  status: 'active',
  verified: true,
  createdAt: new Date('2024-01-15'),
  lastLogin: new Date('2025-01-08'),
  rewardPoints: 1250,
  tier: 'silver'
}

const mockBookings: Booking[] = [
  {
    id: '1',
    vehicle: 'Toyota Camry 2022',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-05'),
    totalCost: 500,
    status: 'completed'
  },
  {
    id: '2',
    vehicle: 'Honda CR-V 2021',
    startDate: new Date('2025-01-10'),
    endDate: new Date('2025-01-15'),
    totalCost: 750,
    status: 'active'
  }
]

// Methods
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const loadUser = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    user.value = mockUser
    bookings.value = mockBookings
    
    // Populate edit form
    editForm.value = {
      name: user.value.name,
      email: user.value.email,
      role: user.value.role,
      status: user.value.status,
      rewardPoints: user.value.rewardPoints,
      tier: user.value.tier,
      verified: user.value.verified
    }
  } catch (error) {
    console.error('Failed to load user:', error)
  } finally {
    loading.value = false
  }
}

const updateUser = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (user.value) {
      user.value.name = editForm.value.name
      user.value.email = editForm.value.email
      user.value.role = editForm.value.role
      user.value.status = editForm.value.status
      user.value.rewardPoints = editForm.value.rewardPoints
      user.value.tier = editForm.value.tier
      user.value.verified = editForm.value.verified
    }
    
    alert('User updated successfully!')
  } catch (error) {
    console.error('Failed to update user:', error)
    alert('Failed to update user')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  if (user.value) {
    editForm.value = {
      name: user.value.name,
      email: user.value.email,
      role: user.value.role,
      status: user.value.status,
      rewardPoints: user.value.rewardPoints,
      tier: user.value.tier,
      verified: user.value.verified
    }
  }
}

const toggleUserStatus = () => {
  if (user.value) {
    const action = user.value.status === 'active' ? 'suspend' : 'activate'
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      user.value.status = user.value.status === 'active' ? 'suspended' : 'active'
      editForm.value.status = user.value.status
    }
  }
}

const toggleVerification = () => {
  if (user.value) {
    const action = user.value.verified ? 'unverify' : 'verify'
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      user.value.verified = !user.value.verified
      editForm.value.verified = user.value.verified
    }
  }
}

const sendNotification = () => {
  const message = prompt('Enter notification message:')
  if (message) {
    alert(`Notification sent to ${user.value?.name}: ${message}`)
  }
}

const resetPassword = () => {
  if (confirm(`Are you sure you want to reset the password for ${user.value?.name}?`)) {
    alert('Password reset email sent!')
  }
}

const goBack = () => {
  router.push('/admin/users')
}

// Load data on mount
onMounted(() => {
  loadUser()
})
</script>
