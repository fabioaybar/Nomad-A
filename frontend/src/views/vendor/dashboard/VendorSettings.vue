<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('vendor.settings.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ t('vendor.settings.subtitle') }}</p>
      </div>

      <!-- Settings Navigation -->
      <div class="mb-8">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4 inline mr-2" />
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Settings Content -->
      <div class="space-y-8">
        <!-- Business Information Tab -->
        <div v-if="activeTab === 'business'" class="space-y-6">
          <!-- Company Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.settings.company_info') }}</h3>
              <button
                @click="updateBusinessInfo"
                :disabled="loading"
                class="btn-primary"
              >
                <Save class="w-4 h-4 mr-2" />
                {{ t('vendor.settings.save_changes') }}
              </button>
            </div>
            
            <form @submit.prevent="updateBusinessInfo" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.company_name') }} *
                  </label>
                  <input
                    type="text"
                    v-model="businessInfo.company_name"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.business_type') }}
                  </label>
                  <select
                    v-model="businessInfo.business_type"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="individual">{{ t('vendor.settings.individual') }}</option>
                    <option value="company">{{ t('vendor.settings.company') }}</option>
                    <option value="fleet">{{ t('vendor.settings.fleet') }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.contact_email') }} *
                  </label>
                  <input
                    type="email"
                    v-model="businessInfo.contact_email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.contact_phone') }} *
                  </label>
                  <input
                    type="tel"
                    v-model="businessInfo.contact_phone"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.description') }}
                  </label>
                  <textarea
                    v-model="businessInfo.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          <!-- Location Information -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.settings.location_info') }}</h3>
              <button
                @click="updateLocationInfo"
                :disabled="loading"
                class="btn-primary"
              >
                <MapPin class="w-4 h-4 mr-2" />
                {{ t('vendor.settings.save_changes') }}
              </button>
            </div>
            
            <form @submit.prevent="updateLocationInfo" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.address') }} *
                  </label>
                  <input
                    type="text"
                    v-model="locationInfo.address"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.city') }} *
                  </label>
                  <input
                    type="text"
                    v-model="locationInfo.city"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.country') }} *
                  </label>
                  <input
                    type="text"
                    v-model="locationInfo.country"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.postal_code') }}
                  </label>
                  <input
                    type="text"
                    v-model="locationInfo.postal_code"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Notification Preferences Tab -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <!-- Email Notifications -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.settings.email_notifications') }}</h3>
              <button
                @click="updateNotificationSettings"
                :disabled="loading"
                class="btn-primary"
              >
                <Bell class="w-4 h-4 mr-2" />
                {{ t('vendor.settings.save_changes') }}
              </button>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ t('vendor.settings.new_bookings') }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.settings.new_bookings_desc') }}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="notificationSettings.new_bookings"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ t('vendor.settings.booking_cancellations') }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.settings.booking_cancellations_desc') }}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="notificationSettings.booking_cancellations"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ t('vendor.settings.payment_updates') }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.settings.payment_updates_desc') }}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="notificationSettings.payment_updates"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ t('vendor.settings.reviews') }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.settings.reviews_desc') }}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="notificationSettings.reviews"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- SMS Notifications -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('vendor.settings.sms_notifications') }}</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ t('vendor.settings.urgent_notifications') }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.settings.urgent_notifications_desc') }}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="notificationSettings.sms_urgent"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Business Settings Tab -->
        <div v-if="activeTab === 'business-settings'" class="space-y-6">
          <!-- Booking Settings -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.settings.booking_settings') }}</h3>
              <button
                @click="updateBusinessSettings"
                :disabled="loading"
                class="btn-primary"
              >
                <Settings class="w-4 h-4 mr-2" />
                {{ t('vendor.settings.save_changes') }}
              </button>
            </div>
            
            <form @submit.prevent="updateBusinessSettings" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.auto_confirm_bookings') }}
                  </label>
                  <select
                    v-model="businessSettings.auto_confirm_bookings"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="false">{{ t('vendor.settings.manual_confirmation') }}</option>
                    <option value="true">{{ t('vendor.settings.auto_confirmation') }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.minimum_booking_duration') }} ({{ t('vendor.settings.days') }})
                  </label>
                  <input
                    type="number"
                    v-model="businessSettings.minimum_booking_duration"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.maximum_booking_duration') }} ({{ t('vendor.settings.days') }})
                  </label>
                  <input
                    type="number"
                    v-model="businessSettings.maximum_booking_duration"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.advance_booking_limit') }} ({{ t('vendor.settings.days') }})
                  </label>
                  <input
                    type="number"
                    v-model="businessSettings.advance_booking_limit"
                    min="1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </form>
          </div>

          <!-- Pricing Settings -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">{{ t('vendor.settings.pricing_settings') }}</h3>
            
            <form @submit.prevent="updatePricingSettings" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.commission_rate') }} (%)
                  </label>
                  <input
                    type="number"
                    v-model="pricingSettings.commission_rate"
                    min="0"
                    max="50"
                    step="0.1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.minimum_price_per_day') }}
                  </label>
                  <input
                    type="number"
                    v-model="pricingSettings.minimum_price_per_day"
                    min="0"
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="loading"
                  class="btn-primary"
                >
                  <DollarSign class="w-4 h-4 mr-2" />
                  {{ t('vendor.settings.save_changes') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Account Management Tab -->
        <div v-if="activeTab === 'account'" class="space-y-6">
          <!-- Password Change -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">{{ t('vendor.settings.change_password') }}</h3>
            
            <form @submit.prevent="changePassword" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.current_password') }}
                  </label>
                  <input
                    type="password"
                    v-model="passwordForm.currentPassword"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.new_password') }}
                  </label>
                  <input
                    type="password"
                    v-model="passwordForm.newPassword"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('vendor.settings.confirm_password') }}
                  </label>
                  <input
                    type="password"
                    v-model="passwordForm.confirmPassword"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="loading"
                  class="btn-primary"
                >
                  <Lock class="w-4 h-4 mr-2" />
                  {{ t('vendor.settings.change_password') }}
                </button>
              </div>
            </form>
          </div>

          <!-- Account Deactivation -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('vendor.settings.account_deactivation') }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ t('vendor.settings.account_deactivation_desc') }}</p>
            <button
              @click="deactivateAccount"
              class="btn-danger"
            >
              <AlertTriangle class="w-4 h-4 mr-2" />
              {{ t('vendor.settings.deactivate_account') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  Building2,
  Bell,
  Settings,
  User,
  AlertTriangle 
} from 'lucide-vue-next'
import { useTranslation } from '../../../services/i18n'
import { useAuthStore } from '../../../stores/auth'
import { useNotificationStore } from '../../../stores/notifications'
import { api } from '../../../services/api'
import type { Vendor } from '../../../types/vendor'

const { t } = useTranslation()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Helper function to get vendor
const getVendor = async (): Promise<Vendor> => {
  interface ApiResponse {
    data: {
      data: {
        vendors: Vendor[]
      }
    }
  }
  const response = await api.get<ApiResponse>('/vendors')
  const vendors = response.data.data.vendors || []
  const vendor = vendors.find((v: Vendor) => v.user_id === authStore.user?.id)
  if (!vendor) throw new Error('Vendor not found')
  return vendor
}

// Tab navigation
const activeTab = ref('business')
const tabs = [
  { id: 'business', name: t('vendor.settings.business_info'), icon: Building2 },
  { id: 'notifications', name: t('vendor.settings.notifications'), icon: Bell },
  { id: 'business-settings', name: t('vendor.settings.business_settings'), icon: Settings },
  { id: 'account', name: t('vendor.settings.account'), icon: User }
]

// Business information
const businessInfo = ref({
  company_name: '',
  business_type: 'individual',
  contact_email: '',
  contact_phone: '',
  description: ''
})

// Location information
const locationInfo = ref({
  address: '',
  city: '',
  country: '',
  postal_code: ''
})

// Notification settings
const notificationSettings = ref({
  new_bookings: true,
  booking_cancellations: true,
  payment_updates: true,
  reviews: true,
  sms_urgent: false
})

// Business settings
const businessSettings = ref({
  auto_confirm_bookings: false,
  minimum_booking_duration: 1,
  maximum_booking_duration: 30,
  advance_booking_limit: 90
})

// Pricing settings
const pricingSettings = ref({
  commission_rate: 10,
  minimum_price_per_day: 0
})

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Loading state
const loading = ref(false)

// Load vendor data on component mount
onMounted(async () => {
  await loadVendorData()
})

// Load vendor data from API
const loadVendorData = async () => {
  try {
    loading.value = true
    
    // Get vendor profile
    const profileResponse = await api.get<{ data: { data: { user: { id: number; email: string } } } }>('/auth/profile')
    const user = profileResponse.data.data.user
    
    // Get vendor details
    const vendor = await getVendor()
    
    if (vendor) {
      // Populate business info
      businessInfo.value = {
        company_name: vendor.company_name || '',
        business_type: vendor.business_type || 'individual',
        contact_email: vendor.contact_email || '',
        contact_phone: vendor.contact_phone || '',
        description: vendor.description || ''
      }
      
      // Populate location info
      locationInfo.value = {
        address: vendor.address || '',
        city: vendor.city || '',
        country: vendor.country || '',
        postal_code: vendor.postal_code || ''
      }
    }
    
    // Set user email if not set
    if (!businessInfo.value.contact_email && user.email) {
      businessInfo.value.contact_email = user.email
    }
    
  } catch (error) {
    console.error('Error loading vendor data:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.settings.error_title'),
      message: t('vendor.settings.load_error')
    })
  } finally {
    loading.value = false
  }
}

// Update business information
const updateBusinessInfo = async () => {
  try {
    loading.value = true
    
    // Get vendor
    const vendor = await getVendor()
    
    // Update vendor information
    const updateData = {
      company_name: businessInfo.value.company_name,
      business_type: businessInfo.value.business_type,
      contact_phone: businessInfo.value.contact_phone,
      contact_email: businessInfo.value.contact_email,
      description: businessInfo.value.description
    }
    
    await api.put(`/vendors/${vendor.id}`, updateData)
    
    notificationStore.addNotification({
      type: 'success',
      title: t('vendor.settings.success_title'),
      message: t('vendor.settings.business_info_updated')
    })
    
  } catch (error: any) {
    console.error('Error updating business info:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.settings.error_title'),
      message: error.message || t('vendor.settings.update_error')
    })
  } finally {
    loading.value = false
  }
}

// Update location information
const updateLocationInfo = async () => {
  try {
    loading.value = true
    
    // Get vendor
    const vendor = await getVendor()
    
    // Update location information
    const updateData = {
      address: locationInfo.value.address,
      city: locationInfo.value.city,
      country: locationInfo.value.country,
      postal_code: locationInfo.value.postal_code
    }
    
    await api.put(`/vendors/${vendor.id}`, updateData)
    
    notificationStore.addNotification({
      type: 'success',
      title: t('vendor.settings.success_title'),
      message: t('vendor.settings.location_info_updated')
    })
    
  } catch (error: any) {
    console.error('Error updating location info:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.settings.error_title'),
      message: error.message || t('vendor.settings.update_error')
    })
  } finally {
    loading.value = false
  }
}

// Update notification settings
const updateNotificationSettings = async () => {
  try {
    loading.value = true
    
    // Get vendor ID first
    const vendorsResponse = await api.get('/vendors')
    const vendors = vendorsResponse.data.data?.vendors || []
    const vendor = vendors.find((v: { user_id: number; id: number }) => v.user_id === authStore.user?.id)
    
    if (!vendor) {
      throw new Error('Vendor not found')
    }
    
    // Update notification settings
    await api.put(`/vendors/${vendor.id}/settings`, {
      notification_settings: notificationSettings.value
    })
    
    notificationStore.addNotification({
      type: 'success',
      title: t('vendor.settings.success_title'),
      message: t('vendor.settings.notifications_updated')
    })
    
  } catch (error: any) {
    console.error('Error updating notification settings:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.settings.error_title'),
      message: error.message || t('vendor.settings.update_error')
    })
  } finally {
    loading.value = false
  }
}

// Update business settings
const updateBusinessSettings = async () => {
  try {
    loading.value = true
    
    // Get vendor ID first
    const vendorsResponse = await api.get('/vendors')
    const vendors = vendorsResponse.data.data?.vendors || []
    const vendor = vendors.find((v: { user_id: number; id: number }) => v.user_id === authStore.user?.id)
    
    if (!vendor) {
      throw new Error('Vendor not found')
    }
    
    // Update business settings
    await api.put(`/vendors/${vendor.id}/settings`, {
      auto_confirm_bookings: businessSettings.value.auto_confirm_bookings,
      minimum_booking_duration: String(businessSettings.value.minimum_booking_duration),
      maximum_booking_duration: String(businessSettings.value.maximum_booking_duration),
      advance_booking_limit: String(businessSettings.value.advance_booking_limit)
    })
    
    notificationStore.addNotification({
      type: 'success',
      title: t('vendor.settings.success_title'),
      message: t('vendor.settings.business_settings_updated')
    })
    
  } catch (error: any) {
    console.error('Error updating business settings:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.settings.error_title'),
      message: error.message || t('vendor.settings.update_error')
    })
  } finally {
    loading.value = false
  }
}

// Update pricing settings
const updatePricingSettings = async () => {
  try {
    loading.value = true
    
    // Get vendor ID first
    const vendorsResponse = await api.get('/vendors')
    const vendors = vendorsResponse.data.data?.vendors || []
    const vendor = vendors.find((v: { user_id: number; id: number }) => v.user_id === authStore.user?.id)
    
    if (!vendor) {
      throw new Error('Vendor not found')
    }
    
    // Update pricing settings
    await api.put(`/vendors/${vendor.id}/settings`, {
      commission_rate: Number(pricingSettings.value.commission_rate),
      minimum_price_per_day: Number(pricingSettings.value.minimum_price_per_day)
    })
    
    notificationStore.addNotification({
      type: 'success',
      title: t('vendor.settings.success_title'),
      message: t('vendor.settings.pricing_settings_updated')
    })
    
  } catch (error: any) {
    console.error('Error updating pricing settings:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.settings.error_title'),
      message: error.message || t('vendor.settings.update_error')
    })
  } finally {
    loading.value = false
  }
}

// Change password
const changePassword = async () => {
  try {
    loading.value = true
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      throw new Error(t('vendor.settings.password_mismatch'))
    }
    
    await api.put('/auth/password', {
      current_password: passwordForm.value.currentPassword,
      new_password: passwordForm.value.newPassword
    })
    
    // Clear form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    notificationStore.addNotification({
      type: 'success',
      title: t('vendor.settings.success_title'),
      message: t('vendor.settings.password_changed')
    })
    
  } catch (error: any) {
    console.error('Error changing password:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.settings.error_title'),
      message: error.message || t('vendor.settings.password_change_error')
    })
  } finally {
    loading.value = false
  }
}

// Deactivate account
const deactivateAccount = async () => {
  if (!confirm(t('vendor.settings.deactivate_confirm'))) return
  
  try {
    loading.value = true
    
    // Get vendor
    const vendor = await getVendor()
    
    await api.put(`/vendors/${vendor.id}`, {
      is_active: false
    })
    
    notificationStore.addNotification({
      type: 'warning',
      title: t('vendor.settings.account_deactivated'),
      message: t('vendor.settings.account_deactivated_message')
    })
    
    // Redirect to login after deactivation
    setTimeout(() => {
      authStore.logout()
    }, 2000)
    
  } catch (error: any) {
    console.error('Error deactivating account:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.settings.error_title'),
      message: error.message || t('vendor.settings.deactivation_error')
    })
  } finally {
    loading.value = false
  }
}
</script>