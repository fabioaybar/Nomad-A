<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="relative overflow-hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="absolute inset-0 bg-gradient-to-b from-primary-600/30 to-transparent opacity-50 dark:from-primary-900/30 pointer-events-none"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-300">
              {{ t('rental_details.title') }}
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              {{ rental?.vehicle.make }} {{ rental?.vehicle.model }} • {{ rental?.vehicle.year }}
            </p>
          </div>
          <RouterLink 
            to="/my-rentals" 
            class="btn-secondary inline-flex items-center group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 11H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            <span>{{ t('rental_details.back_to_rentals') }}</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="loading-spinner w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">{{ t('common.loading') }}</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600 dark:text-red-400 animate-pulse" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('common.error') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button @click="loadRental" class="btn-primary">
          {{ t('common.retry') }}
        </button>
      </div>

      <div v-else-if="rental" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Vehicle Information -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Vehicle Image -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="aspect-w-16 aspect-h-9">
              <img
                :src="rental.vehicle.images?.[0] || '/images/defaults/car-placeholder.jpg'"
                :alt="`${rental.vehicle.make} ${rental.vehicle.model}`"
                class="w-full h-64 md:h-80 object-cover"
              />
            </div>
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {{ rental.vehicle.make }} {{ rental.vehicle.model }}
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ rental.vehicle.year }} • {{ rental.vehicle.type }}
                  </p>
                </div>
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    getStatusClasses(rental.status)
                  ]"
                >
                  {{ t(`rentals.status.${rental.status}`) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Rental Information -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {{ t('rental_details.rental_info') }}
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('rentals.pickup_date') }}
                  </label>
                  <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                    <span class="text-gray-900 dark:text-white font-medium">
                      {{ formatDate(rental.start_date) }}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('rental_details.pickup_location') }}
                  </label>
                  <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                    <span class="text-gray-900 dark:text-white">
                      {{ rental.pickup_location }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('rentals.return_date') }}
                  </label>
                  <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                    <span class="text-gray-900 dark:text-white font-medium">
                      {{ formatDate(rental.end_date) }}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('rental_details.return_location') }}
                  </label>
                  <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                    <span class="text-gray-900 dark:text-white">
                      {{ rental.return_location }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Duration -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('rental_details.duration') }}
              </label>
              <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                <span class="text-gray-900 dark:text-white font-medium">
                  {{ calculateDuration(rental.start_date, rental.end_date) }} {{ t('rental_details.days') }}
                </span>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="rental.notes" class="mt-6">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('rental_details.notes') }}
              </label>
              <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg">
                <span class="text-gray-900 dark:text-white">
                  {{ rental.notes }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Total Cost -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ t('rentals.total_cost') }}
            </h3>
            <div class="text-center">
              <div class="text-3xl font-bold mb-2">
                <CurrencyDisplay :amount="rental.total_cost" text-color="text-green-600 dark:text-green-400" />
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ calculateDuration(rental.start_date, rental.end_date) }} {{ t('rental_details.days') }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {{ t('rental_details.actions') }}
            </h3>
            <div class="space-y-3">
              <button
                v-if="rental.status === 'pending'"
                @click="completeBooking"
                class="w-full btn-primary text-sm inline-flex items-center justify-center group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>{{ t('rentals.complete_booking') }}</span>
              </button>
              
              <button
                v-if="rental.status === 'active'"
                @click="cancelRental"
                class="w-full btn-danger text-sm inline-flex items-center justify-center group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <span>{{ t('rentals.cancel') }}</span>
              </button>
              
              <button
                v-if="rental.status === 'completed' && !rental.has_review"
                @click="writeReview"
                class="w-full btn-primary text-sm inline-flex items-center justify-center group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ t('rentals.review') }}</span>
              </button>
              
              <RouterLink
                :to="{ name: 'chat', query: { conversationId: rental.id } }"
                class="w-full btn-secondary text-sm inline-flex items-center justify-center group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{{ t('rentals.message_vendor') }}</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle class="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-3">{{ t('common.error') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-8">{{ t('rentals.error_title') }}</p>
        <RouterLink to="/my-rentals" class="btn-primary">
          {{ t('rental_details.back_to_rentals') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle } from 'lucide-vue-next'
import { useTranslation } from '../../services/i18n'
import { useRentalsStore, type Rental } from '../../stores/rentals'
import CurrencyDisplay from '../../components/ui/CurrencyDisplay.vue'

const route = useRoute()
const router = useRouter()
const { t } = useTranslation()
const rentalsStore = useRentalsStore()

const loading = ref(false)
const error = ref<string | null>(null)
const rental = ref<Rental | null>(null)

const loadRental = async () => {
  const rentalId = parseInt(route.params.id as string)
  
  if (!rentalId) {
    error.value = 'Invalid rental ID'
    return
  }

  try {
    loading.value = true
    error.value = null
    
    // Load rentals if not already loaded
    if (rentalsStore.rentals.length === 0) {
      await rentalsStore.loadRentals()
    }
    
    // Find the rental by ID
    rental.value = rentalsStore.rentalsById[rentalId] || null
    
    if (!rental.value) {
      error.value = 'Rental not found'
    }
  } catch (err) {
    console.error('Error loading rental:', err)
    error.value = 'Failed to load rental details'
  } finally {
    loading.value = false
  }
}

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    case 'active':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    case 'completed':
      return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    case 'cancelled':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    default:
      return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const calculateDuration = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const cancelRental = async () => {
  if (!rental.value) return
  
  if (!confirm(t('rentals.cancel_confirm'))) return
  
  try {
    // In development, just update the local state
    if (import.meta.env.DEV) {
      rental.value.status = 'cancelled'
      return
    }
    
    // In production, this would call the API
    const response = await fetch(`/api/rentals/${rental.value.id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to cancel rental')
    }
    
    rental.value.status = 'cancelled'
  } catch (err) {
    console.error('Cancel rental error:', err)
    error.value = t('rentals.cancel_error')
  }
}

const completeBooking = async () => {
  if (!rental.value) return
  
  if (!confirm(t('rentals.complete_booking_confirm'))) return
  
  try {
    // In development, just update the local state
    if (import.meta.env.DEV) {
      rental.value.status = 'active'
      return
    }
    
    // In production, this would call the API
    const response = await fetch(`/api/rentals/${rental.value.id}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to complete booking')
    }
    
    rental.value.status = 'active'
  } catch (err) {
    console.error('Complete booking error:', err)
    error.value = t('rentals.complete_booking_error')
  }
}

const writeReview = () => {
  if (!rental.value) return
  router.push(`/rentals/${rental.value.id}/review`)
}

onMounted(() => {
  loadRental()
})
</script>

<style scoped>
/* Loading Spinner */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Button Styles */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply bg-white hover:bg-gray-50 text-gray-900 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-600;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2;
}
</style>
