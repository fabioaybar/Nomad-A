<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.title') }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.subtitle') }}</p>
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
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.stats.total_users') }}</h3>
              <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Car class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.stats.total_vehicles') }}</h3>
              <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.totalVehicles }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Calendar class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.stats.active_bookings') }}</h3>
              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.activeBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <DollarSign class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('admin.stats.total_revenue') }}</h3>
              <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ formatCurrency(stats.totalRevenue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Management Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Manage Users -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.manage_users.title') }}</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex items-center">
                  <Users class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('admin.manage_users.total_users') }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('admin.manage_users.active_users') }}: {{ stats.activeUsers }}</p>
                  </div>
                </div>
                <button @click="openUserManagement" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  {{ t('admin.manage_users.manage') }}
                </button>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.verifiedUsers }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.manage_users.verified') }}</p>
                </div>
                <div class="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.suspendedUsers }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.manage_users.suspended') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Manage Vendors -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.manage_vendors.title') }}</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex items-center">
                  <Building2 class="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('admin.manage_vendors.total_vendors') }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('admin.manage_vendors.verified') }}: {{ stats.verifiedVendors }}</p>
                  </div>
                </div>
                <button @click="openVendorManagement" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  {{ t('admin.manage_vendors.manage') }}
                </button>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.verifiedVendors }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.manage_vendors.verified') }}</p>
                </div>
                <div class="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.pendingVendors }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.manage_vendors.pending') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Manage Vehicles -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.manage_vehicles.title') }}</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex items-center">
                  <Car class="w-5 h-5 text-green-600 dark:text-green-400 mr-3" />
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('admin.manage_vehicles.total_vehicles') }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('admin.manage_vehicles.available') }}: {{ stats.availableVehicles }}</p>
                  </div>
                </div>
                <button @click="openVehicleManagement" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  {{ t('admin.manage_vehicles.manage') }}
                </button>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.maintenanceVehicles }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.manage_vehicles.maintenance') }}</p>
                </div>
                <div class="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.reportedVehicles }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.manage_vehicles.reported') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- View Bookings -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.view_bookings.title') }}</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex items-center">
                  <Calendar class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3" />
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('admin.view_bookings.total_bookings') }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('admin.view_bookings.this_month') }}: {{ stats.monthlyBookings }}</p>
                  </div>
                </div>
                <button @click="openBookingManagement" class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                  {{ t('admin.view_bookings.manage') }}
                </button>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.completedBookings }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.view_bookings.completed') }}</p>
                </div>
                <div class="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-red-600 dark:text-red-400">{{ stats.disputedBookings }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.view_bookings.disputed') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>



        <!-- Support & Tickets -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.support_tickets.title') }}</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex items-center">
                  <MessageCircle class="w-5 h-5 text-orange-600 dark:text-orange-400 mr-3" />
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('admin.support_tickets.open_tickets') }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('admin.support_tickets.pending') }}: {{ stats.pendingTickets }}</p>
                  </div>
                </div>
                <button @click="openSupportManagement" class="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                  {{ t('admin.support_tickets.manage') }}
                </button>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.resolvedTickets }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.support_tickets.resolved') }}</p>
                </div>
                <div class="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ stats.escalatedTickets }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.support_tickets.escalated') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Panel -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.analytics.title') }}</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex items-center">
                  <BarChart class="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('admin.analytics.platform_metrics') }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('admin.analytics.active_today') }}: {{ stats.todayActiveUsers }}</p>
                  </div>
                </div>
                <button @click="openAnalytics" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  {{ t('admin.analytics.view') }}
                </button>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ stats.monthlyGrowth }}%</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.analytics.monthly_growth') }}</p>
                </div>
                <div class="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.conversionRate }}%</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.analytics.conversion_rate') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rewards System Management -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.rewards_management') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <!-- System Overview -->
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.total_points_issued') }}</h3>
              <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{{ rewardsStats.totalPointsIssued }}</p>
            </div>

            <!-- Active Users -->
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.active_rewards_users') }}</h3>
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ rewardsStats.activeUsers }}</p>
            </div>

            <!-- Discounts Used -->
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.discounts_used') }}</h3>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ rewardsStats.discountsUsed }}</p>
            </div>
          </div>

          <!-- Rewards Management Actions -->
          <div class="flex flex-wrap gap-4">
            <button
              @click="openRewardsSettings"
              class="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Settings class="w-5 h-5 mr-2" />
              <span>{{ t('admin.manage_rewards_settings') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.recent_activity') }}</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div class="flex-shrink-0">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  activity.type === 'user' ? 'bg-blue-100 dark:bg-blue-900' :
                  activity.type === 'booking' ? 'bg-green-100 dark:bg-green-900' :
                  activity.type === 'support' ? 'bg-orange-100 dark:bg-orange-900' :
                  'bg-gray-100 dark:bg-gray-700'
                ]">
                  <Users v-if="activity.type === 'user'" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <Calendar v-else-if="activity.type === 'booking'" class="w-4 h-4 text-green-600 dark:text-green-400" />
                  <MessageCircle v-else-if="activity.type === 'support'" class="w-4 h-4 text-orange-600 dark:text-orange-400" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from '../../services/i18n'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notifications'
import { api } from '../../services/api'
import { 
  Users, Car, Calendar, DollarSign, Gift, MessageCircle, AlertCircle, Building2, BarChart
} from 'lucide-vue-next'

const { t } = useTranslation()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Stats data
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  verifiedUsers: 0,
  suspendedUsers: 0,
  totalVendors: 0,
  verifiedVendors: 0,
  pendingVendors: 0,
  suspendedVendors: 0,
  totalVehicles: 0,
  availableVehicles: 0,
  maintenanceVehicles: 0,
  reportedVehicles: 0,
  activeBookings: 0,
  monthlyBookings: 0,
  completedBookings: 0,
  disputedBookings: 0,
  totalRevenue: 0,
  monthlyRevenue: 0,
  pendingTickets: 0,
  resolvedTickets: 0,
  escalatedTickets: 0,
  // Analytics stats
  todayActiveUsers: 0,
  monthlyGrowth: 0,
  conversionRate: 0
})

// Rewards stats
const rewardsStats = ref({
  totalPointsIssued: 0,
  activeUsers: 0,
  discountsUsed: 0
})

// Recent activities
interface Activity {
  id: number
  type: 'user' | 'booking' | 'support' | 'system'
  message: string
  timestamp: string
}

const recentActivities = ref<Activity[]>([])

// Loading state
const loading = ref(false)

// Helper functions
const formatTime = (timestamp: string) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'Justo ahora'
  if (minutes < 60) return `${minutes} min atrás`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h atrás`

  const days = Math.floor(hours / 24)
  return `${days} días atrás`
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Load dashboard data
const loadDashboardData = async () => {
  try {
    loading.value = true
    
    const response = await api.get('/admin/dashboard')
    
    if (response.data.success) {
      const data = response.data.data
      
      // Update stats
      stats.value = {
        totalUsers: data.users?.total || 0,
        activeUsers: data.users?.active || 0,
        verifiedUsers: data.users?.verified || 0,
        suspendedUsers: data.users?.suspended || 0,
        totalVendors: data.vendors?.total || 0,
        verifiedVendors: data.vendors?.verified || 0,
        pendingVendors: data.vendors?.pending || 0,
        suspendedVendors: data.vendors?.suspended || 0,
        totalVehicles: data.vehicles?.total || 0,
        availableVehicles: data.vehicles?.available || 0,
        maintenanceVehicles: data.vehicles?.maintenance || 0,
        reportedVehicles: data.vehicles?.reported || 0,
        activeBookings: data.bookings?.active || 0,
        monthlyBookings: data.bookings?.monthly || 0,
        completedBookings: data.bookings?.completed || 0,
        disputedBookings: data.bookings?.disputed || 0,
        totalRevenue: data.bookings?.total_revenue || 0,
        monthlyRevenue: data.bookings?.monthly_revenue || 0,
        pendingTickets: data.reports?.pending || 0,
        resolvedTickets: data.reports?.resolved || 0,
        escalatedTickets: data.reports?.escalated || 0,
        // Analytics stats
        todayActiveUsers: data.analytics?.today_active || 0,
        monthlyGrowth: data.analytics?.monthly_growth || 0,
        conversionRate: data.analytics?.conversion_rate || 0
      }
      
      // Update rewards stats
      rewardsStats.value = {
        totalPointsIssued: data.rewards?.total_points || 0,
        activeUsers: data.rewards?.active_users || 0,
        discountsUsed: data.discounts?.used_count || 0
      }
    }
  } catch (error) {
    console.error('Failed to load admin dashboard data:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.error_title'),
      message: t('admin.load_error')
    })
  } finally {
    loading.value = false
  }
}

// Load recent activities
const loadRecentActivities = async () => {
  try {
    const response = await api.get('/admin/activity')
    if (response.data?.success) {
      recentActivities.value = response.data.data as Activity[]
    } else {
      recentActivities.value = []
    }
  } catch (error) {
    console.error('Failed to load recent activities:', error)
    recentActivities.value = []
  }
}

// Action handlers
const openUserManagement = () => {
  router.push('/admin/users')
}

const openVendorManagement = () => {
  router.push('/admin/vendors')
}

const openVehicleManagement = () => {
  router.push('/admin/vehicles')
}

const openBookingManagement = () => {
  router.push('/admin/bookings')
}

const openSupportManagement = () => {
  router.push('/admin/support')
}

const openRewardsSettings = () => {
  router.push('/admin/rewards')
}

const openAnalytics = () => {
  router.push('/admin/analytics')
}

// Load data on mount
onMounted(async () => {
  await Promise.all([
    loadDashboardData(),
    loadRecentActivities()
  ])
})
</script>