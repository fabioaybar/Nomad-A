<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <button
              @click="$router.go(-1)"
              class="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeft class="w-6 h-6" />
            </button>
            <div>
              <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ vendor?.company_name || t('admin.vendors.vendor_profile') }}</h1>
              <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.vendors.vendor_details') }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              v-if="vendor && !vendor.is_verified"
              @click="verifyVendor"
              class="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Shield class="w-5 h-5 mr-2" />
              {{ t('admin.vendors.verify') }}
            </button>
            <button
              v-if="vendor && vendor.is_verified"
              @click="unverifyVendor"
              class="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <ShieldOff class="w-5 h-5 mr-2" />
              {{ t('admin.vendors.unverify') }}
            </button>
            <button
              @click="toggleVendorStatus"
              :class="[
                'flex items-center px-4 py-2 rounded-lg transition-colors',
                vendor?.is_active ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'
              ]"
            >
              <UserX v-if="vendor?.is_active" class="w-5 h-5 mr-2" />
              <UserCheck v-else class="w-5 h-5 mr-2" />
              {{ vendor?.is_active ? t('admin.vendors.suspend') : t('admin.vendors.activate') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Vendor Content -->
      <div v-else-if="vendor" class="space-y-8">
        <!-- Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Building2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.vendors.business_type') }}</h3>
                <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ t(`admin.vendors.${vendor.business_type}`) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Star class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.vendors.rating') }}</h3>
                <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ vendor.rating.toFixed(1) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <Car class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.vendors.total_vehicles') }}</h3>
                <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ vendor.total_vehicles }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Calendar class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.vendors.total_bookings') }}</h3>
                <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ vendor.total_bookings }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Vendor Information -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Company Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.vendors.company_info') }}</h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('admin.vendors.company_name') }}</label>
                <p class="text-lg text-gray-900 dark:text-gray-100">{{ vendor.company_name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('admin.vendors.business_type') }}</label>
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  vendor.business_type === 'individual' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                  vendor.business_type === 'company' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                ]">
                  {{ t(`admin.vendors.${vendor.business_type}`) }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('admin.vendors.description') }}</label>
                <p class="text-gray-900 dark:text-gray-100">{{ vendor.description || t('admin.vendors.no_description') }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('admin.vendors.verification_status') }}</label>
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  vendor.is_verified ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                ]">
                  <Shield v-if="vendor.is_verified" class="w-4 h-4 mr-1" />
                  <Clock v-else class="w-4 h-4 mr-1" />
                  {{ vendor.is_verified ? t('admin.vendors.verified') : t('admin.vendors.pending') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.vendors.contact_info') }}</h2>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('admin.vendors.contact_email') }}</label>
                <p class="text-gray-900 dark:text-gray-100">{{ vendor.contact_email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('admin.vendors.contact_phone') }}</label>
                <p class="text-gray-900 dark:text-gray-100">{{ vendor.contact_phone }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('admin.vendors.address') }}</label>
                <p class="text-gray-900 dark:text-gray-100">{{ vendor.address }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('admin.vendors.location') }}</label>
                <p class="text-gray-900 dark:text-gray-100">{{ vendor.city }}, {{ vendor.country }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ vendor.postal_code }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.vendors.performance_metrics') }}</h2>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.vendors.average_rating') }}</h3>
                <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ vendor.rating.toFixed(1) }}</p>
              </div>

              <div class="text-center">
                <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.vendors.fleet_size') }}</h3>
                <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ vendor.total_vehicles }}</p>
              </div>

              <div class="text-center">
                <div class="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar class="w-8 h-8 text-white" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.vendors.total_bookings') }}</h3>
                <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ vendor.total_bookings }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.vendors.recent_activity') }}</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="activity in recentActivity" :key="activity.id" class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex-shrink-0">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    activity.type === 'booking' ? 'bg-green-100 dark:bg-green-900' :
                    activity.type === 'vehicle' ? 'bg-blue-100 dark:bg-blue-900' :
                    activity.type === 'review' ? 'bg-yellow-100 dark:bg-yellow-900' :
                    'bg-gray-100 dark:bg-gray-700'
                  ]">
                    <Calendar v-if="activity.type === 'booking'" class="w-4 h-4 text-green-600 dark:text-green-400" />
                    <Car v-else-if="activity.type === 'vehicle'" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <Star v-else-if="activity.type === 'review'" class="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertCircle v-else class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ activity.message }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(activity.timestamp) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.vendors.error_title') }}</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">{{ error }}</p>
        <button
          @click="loadVendor"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ t('admin.vendors.retry') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTranslation } from '../../../services/i18n'
import { useNotificationStore } from '../../../stores/notifications'
import { api } from '../../../services/api'
import { 
  ArrowLeft, Building2, Star, Car, Calendar, Shield, Clock, 
  ShieldOff, UserX, UserCheck, AlertCircle
} from 'lucide-vue-next'

const { t } = useTranslation()
const route = useRoute()
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

interface Activity {
  id: number
  type: 'booking' | 'vehicle' | 'review' | 'other'
  message: string
  timestamp: string
}

// State
const vendor = ref<Vendor | null>(null)
const recentActivity = ref<Activity[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Methods
const formatTime = (timestamp: string) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minutes ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  
  const days = Math.floor(hours / 24)
  return `${days} days ago`
}

const loadVendor = async () => {
  try {
    loading.value = true
    error.value = null
    
    const vendorId = route.params.id
    const response = await api.get(`/vendors/${vendorId}`)
    
    if (response.data.success) {
      vendor.value = response.data.data.vendor
      loadRecentActivity()
    } else {
      error.value = response.data.message || t('admin.vendors.load_error')
    }
  } catch (err: any) {
    console.error('Failed to load vendor:', err)
    error.value = err.response?.data?.message || t('admin.vendors.load_error')
  } finally {
    loading.value = false
  }
}

const loadRecentActivity = async () => {
  try {
    // Mock recent activity data
    recentActivity.value = [
      {
        id: 1,
        type: 'booking',
        message: 'New booking completed: Toyota Camry - $150',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        type: 'vehicle',
        message: 'Added new vehicle: Honda Civic 2023',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        type: 'review',
        message: 'Received 5-star review from customer',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        type: 'booking',
        message: 'Booking cancelled: BMW X5',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  } catch (error) {
    console.error('Failed to load recent activity:', error)
  }
}

const verifyVendor = async () => {
  if (!vendor.value) return
  
  try {
    const response = await api.put(`/admin/vendors/${vendor.value.id}/verify`, {
      is_verified: true
    })
    
    if (response.data.success) {
      vendor.value.is_verified = true
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

const unverifyVendor = async () => {
  if (!vendor.value) return
  
  try {
    const response = await api.put(`/admin/vendors/${vendor.value.id}/verify`, {
      is_verified: false
    })
    
    if (response.data.success) {
      vendor.value.is_verified = false
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

const toggleVendorStatus = async () => {
  if (!vendor.value) return
  
  try {
    const newStatus = !vendor.value.is_active
    const response = await api.put(`/vendors/${vendor.value.id}`, {
      is_active: newStatus
    })
    
    if (response.data.success) {
      vendor.value.is_active = newStatus
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

// Load data on mount
onMounted(() => {
  loadVendor()
})
</script>

