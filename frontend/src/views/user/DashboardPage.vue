<template>
  <div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">{{ t('dashboard.title') }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">{{ t('dashboard.welcome', { name: user?.name || 'User' }) }}</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/40">
                <Calendar class="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('dashboard.stats.active_bookings') }}</h3>
              <p class="text-2xl font-bold text-blue-600">{{ stats.activeBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/30">
                <Car class="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('dashboard.stats.total_rentals') }}</h3>
              <p class="text-2xl font-bold text-green-600">{{ stats.totalRentals }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center dark:bg-purple-900/30">
                <Star class="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ t('dashboard.stats.average_rating') }}</h3>
              <p class="text-2xl font-bold text-purple-600">{{ stats.averageRating }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="bg-white rounded-lg shadow mb-8 dark:bg-gray-800 dark:border dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('dashboard.recent_bookings') }}</h2>
        </div>
        <div class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p class="mt-2 text-gray-600 dark:text-gray-300">{{ t('dashboard.loading_bookings') }}</p>
          </div>
          
          <div v-else-if="bookings.length > 0" class="space-y-4">
            <div
              v-for="booking in bookings"
              :key="booking.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <div class="flex items-center">
                <!-- Default Car Icon -->
                <div class="w-16 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <Car class="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <div class="ml-4">
                  <h3 class="font-medium text-gray-900 dark:text-gray-100">
                    {{ booking.vehicle?.make }} {{ booking.vehicle?.model }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ formatDate(booking.start_date) }} - {{ formatDate(booking.end_date) }}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getStatusColor(booking.status)
                  ]"
                >
                  {{ booking.status }}
                </span>
                <p class="text-sm text-gray-600 mt-1 dark:text-gray-300">{{ formatCurrency(booking.total_amount) }}</p>
                <button
                  v-if="booking.vendor"
                  @click="contactVendor(booking.vendor)"
                  class="mt-2 px-3 py-1 bg-primary-600 text-white text-xs rounded-md hover:bg-primary-700 transition-colors"
                >
                  {{ t('dashboard.contact_vendor') }}
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <Calendar class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">{{ t('dashboard.no_bookings_title') }}</h3>
            <p class="text-gray-600 mb-4 dark:text-gray-300">{{ t('dashboard.no_bookings_description') }}</p>
            <RouterLink
              to="/vehicles"
              class="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              {{ t('dashboard.browse_vehicles') }}
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Rewards System -->
      <div class="bg-white rounded-lg shadow mb-8 dark:bg-gray-800 dark:border dark:border-gray-700">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ t('rewards.title') }}</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Current Points -->
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('rewards.current_points') }}</h3>
              <p class="text-3xl font-bold text-yellow-600">{{ rewardsStore.userRewards.points }}</p>
            </div>

            <!-- Current Tier -->
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold text-xl">{{ getTierInitial(rewardsStore.userRewards.tier) }}</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('rewards.current_tier') }}</h3>
              <p class="text-xl font-bold text-gray-600">{{ t(`rewards.tier.${rewardsStore.userRewards.tier}`) }}</p>
            </div>

            <!-- Points to Next Tier -->
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold text-lg">{{ rewardsStore.userRewards.pointsToNext }}</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('rewards.points_to_next') }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ t(`rewards.tier.${rewardsStore.userRewards.nextTier}`) }}</p>
            </div>

            <!-- Active Discount -->
            <div class="text-center">
              <div class="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white font-bold text-lg">%</span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ t('rewards.active_discount') }}</h3>
              <p v-if="rewardsStore.activeDiscount" class="text-xl font-bold text-green-600">
                {{ rewardsStore.activeDiscount.name }}
              </p>
              <p v-else class="text-sm text-gray-500 dark:text-gray-400">{{ t('rewards.no_active_discount') }}</p>
            </div>
          </div>

          <!-- Available Discounts -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{{ t('rewards.available_discounts') }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="discount in rewardsStore.availableDiscounts"
                :key="discount.id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ discount.name }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ discount.description }}</p>
                    <p class="text-lg font-bold text-green-600 mt-1">
                      {{ discount.type === 'percentage' ? t('rewards.discount.percentage', { percentage: discount.value }) : t('rewards.discount.fixed', { amount: discount.value }) }}
                    </p>
                  </div>
                  <button
                    @click="toggleDiscount(discount)"
                    :disabled="rewardsStore.userRewards.points < discount.pointsRequired"
                    :class="[
                      'text-sm px-3 py-1 rounded-md transition-colors',
                      discount.isActive 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    ]"
                  >
                    {{ discount.isActive ? t('rewards.deactivate') : t('rewards.activate') }}
                  </button>
                </div>
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ discount.pointsRequired }} {{ t('rewards.points') }} {{ t('common.required') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">{{ t('dashboard.quick_actions') }}</h3>
          <div class="space-y-3">
            <RouterLink
              to="/vehicles"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <Car class="w-5 h-5 text-primary-600 mr-3" />
              <span>{{ t('dashboard.browse_vehicles') }}</span>
            </RouterLink>
            <RouterLink
              to="/profile"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <User class="w-5 h-5 text-primary-600 mr-3" />
              <span>{{ t('dashboard.update_profile') }}</span>
            </RouterLink>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-100">{{ t('dashboard.account_info') }}</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">{{ t('dashboard.name') }}:</span>
              <span class="font-medium">{{ user?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">{{ t('dashboard.email') }}:</span>
              <span class="font-medium">{{ user?.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-300">{{ t('dashboard.role') }}:</span>
              <span class="font-medium capitalize">{{ user?.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Calendar, Car, Star, User } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useRewardsStore } from '../../stores/rewards'
import { useTranslation } from '../../services/i18n'
import { api } from '../../services/api'

// Types
interface User {
  id: number
  name: string
  email: string
  role: string
}

interface Vehicle {
  id: number
  make: string
  model: string
  images?: string[]
}

interface Booking {
  id: number
  start_date: string
  end_date: string
  status: string
  total_amount: number
  vehicle?: Vehicle
  vendor?: {
    id: number
    company_name: string
    contact_email: string
    contact_phone?: string
  }
}

interface Stats {
  activeBookings: number
  totalRentals: number
  averageRating: number
}

interface UserRewards {
  points: number
  tier: string
  nextTier: string
  pointsToNext: number
  activeDiscount?: Discount
}

interface Discount {
  id: number
  name: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  pointsRequired: number
  isActive?: boolean
}

// Store
const authStore = useAuthStore()
const rewardsStore = useRewardsStore()
const { t } = useTranslation()
const router = useRouter()

// Reactive data
const user = ref<User | null>(null)
const bookings = ref<Booking[]>([])
const loading = ref(true)
const stats = ref<Stats>({
  activeBookings: 0,
  totalRentals: 0,
  averageRating: 0
})

/**
 * Fetch user data and bookings
 */
async function fetchDashboardData() {
  try {
    loading.value = true
    
    // Fetch user profile
    const userResponse = await api.get('/auth/profile')
    // Handle new Node.js backend response structure
    user.value = userResponse.data.data?.user || userResponse.data || null
    
    // Fetch user bookings using the same endpoint as my-rentals
    const bookingsResponse = await api.get(`/users/${userResponse.data.data?.user?.id || userResponse.data?.id}/bookings`)
    // Handle new Node.js backend response structure
    bookings.value = bookingsResponse.data.data || bookingsResponse.data || []
    
    // Calculate stats
    stats.value = {
      activeBookings: bookings.value.filter(b => b.status === 'active').length,
      totalRentals: bookings.value.length,
      averageRating: 4.5 // This would come from reviews in a real app
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // For demo purposes, show sample data
    user.value = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    }
    bookings.value = [
      {
        id: 1,
        start_date: '2024-01-15',
        end_date: '2024-01-17',
        status: 'active',
        total_amount: 135,
        vehicle: {
          id: 1,
          make: 'Toyota',
          model: 'Camry',
          images: ['/placeholder-car.jpg']
        },
        vendor: {
          id: 1,
          company_name: 'AutoRent Chile',
          contact_email: 'info@autorentchile.cl',
          contact_phone: '+56 2 2345 6789'
        }
      }
    ]
    stats.value = {
      activeBookings: 1,
      totalRentals: 1,
      averageRating: 4.5
    }
  } finally {
    loading.value = false
  }
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

/**
 * Format currency based on locale
 */
function formatCurrency(amount: number): string {
  const locale = localeStore.currentLanguage === 'es' ? 'es-CL' : 'en-US'
  const currency = localeStore.currentLanguage === 'es' ? 'CLP' : 'USD'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Get status color class
 */
function getStatusColor(status: string): string {
  const colors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

/**
 * Get tier initial for display
 */
function getTierInitial(tier: string): string {
  const initials = {
    bronze: 'B',
    silver: 'S',
    gold: 'G',
    platinum: 'P'
  }
  return initials[tier as keyof typeof initials] || '?'
}

/**
 * Contact vendor - automatically creates or finds chat with specific vendor
 */
async function contactVendor(vendor: Booking['vendor']) {
  if (!vendor) return
  
  try {
    // First, try to find existing conversation with this vendor
    const conversationsResponse = await api.get('/conversations')
    const existingConversation = conversationsResponse.data.data?.find((conv: any) => 
      conv.participant_id === vendor.id
    )
    
    if (existingConversation) {
      // Redirect to existing conversation
      router.push(`/chat?conversationId=${existingConversation.id}`)
    } else {
      // Create new conversation with this specific vendor
      const response = await api.post('/conversations', {
        participantId: vendor.id,
        title: `Conversación con ${vendor.company_name}`
      })
      
      const conversation = response.data.data
      // Redirect to the new conversation
      router.push(`/chat?conversationId=${conversation.id}`)
    }
  } catch (error) {
    console.error('Error creating/finding conversation:', error)
    // Fallback to opening chat page
    router.push('/chat')
  }
}

/**
 * Toggle discount activation
 */
function toggleDiscount(discount: Discount) {
  rewardsStore.toggleDiscount(discount)
}

/**
 * Apply discount (legacy function for compatibility)
 */
function applyDiscount(discount: Discount) {
  toggleDiscount(discount)
}

// Lifecycle
onMounted(() => {
  fetchDashboardData()
})
</script>
