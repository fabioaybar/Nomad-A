<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header with Parallax -->
    <div class="relative overflow-hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="absolute inset-0 bg-gradient-to-b from-primary-600/30 to-transparent opacity-50 dark:from-primary-900/30 pointer-events-none"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-300 hover:scale-105">
            {{ t('rentals.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto transition-all duration-300 hover:text-primary-600 dark:hover:text-primary-400">
            {{ t('rentals.subtitle') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Tabs -->
      <div class="mb-8">
        <div class="flex justify-center">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-1.5 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              :class="[
                'px-6 py-2.5 rounded-md font-medium transition-all duration-300',
                activeTab === tab.value
                  ? 'bg-primary-600 text-white shadow-lg scale-105 hover:bg-primary-700'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              ]"
            >
              {{ statusLabel(tab.value) }}
              <span class="ml-2 text-sm opacity-75">
                ({{ getRentalsByStatus(tab.value).length }})
              </span>
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="loading-spinner w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400">{{ t('rentals.loading') }}</p>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600 dark:text-red-400 animate-pulse" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('rentals.error_title') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
        <button @click="rentalsStore.loadRentals()" class="btn-primary">
          {{ t('rentals.retry') }}
        </button>
      </div>
      <div v-else>
        <div class="mb-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600 dark:text-gray-400">{{ t('rentals.sort.label') }}</label>
            <select v-model="sortKey" class="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-2 py-1">
              <option value="newest">{{ t('rentals.sort.newest') }}</option>
              <option value="oldest">{{ t('rentals.sort.oldest') }}</option>
              <option value="price_asc">{{ t('rentals.sort.price_asc') }}</option>
              <option value="price_desc">{{ t('rentals.sort.price_desc') }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <button :disabled="page<=1" @click="page = Math.max(1, page-1)" class="btn-secondary text-sm disabled:opacity-50">{{ t('rentals.pagination.prev') }}</button>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('rentals.pagination.page') }} {{ page }} / {{ totalPages }}</span>
            <button :disabled="page>=totalPages" @click="page = Math.min(totalPages, page+1)" class="btn-secondary text-sm disabled:opacity-50">{{ t('rentals.pagination.next') }}</button>
          </div>
        </div>

        <div v-if="paginatedRentals.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="rental in paginatedRentals"
            :key="rental.id"
            class="group bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary-500 dark:hover:border-primary-400"
          >
          <!-- Vehicle Image with Overlay -->
          <div class="relative overflow-hidden group">
            <img
              :src="rental.vehicle.images?.[0] || '/images/defaults/car-placeholder.jpg'"
              :alt="`${rental.vehicle.make} ${rental.vehicle.model}`"
              class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- Rental Content -->
          <div class="p-6 space-y-4">
            <!-- Vehicle Info and Status -->
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {{ rental.vehicle.make }} {{ rental.vehicle.model }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                  {{ rental.vehicle.year }} • {{ rental.vehicle.type }}
                </p>
              </div>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 shadow-sm group-hover:shadow',
                  getStatusClasses(rental.status)
                ]"
              >
                {{ t(`rentals.status.${rental.status}`) }}
              </span>
            </div>

            <!-- Rental Details -->
            <div class="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 space-y-3">
              <div class="flex justify-between text-sm items-center">
                <div class="flex items-center">
                  <span class="text-gray-500 dark:text-gray-400">{{ t('rentals.pickup_date') }}</span>
                </div>
                <span class="font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-md shadow-sm">
                  {{ formatDate(rental.start_date) }}
                </span>
              </div>
              <div class="flex justify-between text-sm items-center">
                <div class="flex items-center">
                  <span class="text-gray-500 dark:text-gray-400">{{ t('rentals.return_date') }}</span>
                </div>
                <span class="font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-3 py-1 rounded-md shadow-sm">
                  {{ formatDate(rental.end_date) }}
                </span>
              </div>
              <div class="flex justify-between text-sm items-center">
                <div class="flex items-center">
                  <span class="text-gray-500 dark:text-gray-400">{{ t('rentals.total_cost') }}</span>
                </div>
                <span class="font-medium bg-white dark:bg-gray-800 px-3 py-1 rounded-md shadow-sm">
                  {{ formatCurrency(rental.total_cost) }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-wrap gap-2 mt-6">
              <button
                @click="viewRentalDetails(rental)"
                class="flex-1 btn-secondary text-sm inline-flex items-center justify-center group"
              >
                <span>{{ t('rentals.view_details') }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <button
                v-if="rental.status === 'pending'"
                @click="completeBooking(rental)"
                class="btn-primary text-sm inline-flex items-center justify-center group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span>{{ t('rentals.complete_booking') }}</span>
              </button>
              
              <button
                v-if="rental.status === 'active'"
                @click="cancelRental(rental)"
                class="btn-danger text-sm inline-flex items-center justify-center group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                <span>{{ t('rentals.cancel') }}</span>
              </button>
              
              <button
                v-if="rental.status === 'completed' && !rental.has_review"
                @click="writeReview(rental)"
                class="btn-primary text-sm inline-flex items-center justify-center group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ t('rentals.review') }}</span>
              </button>
              <button
                @click="contactVendor(rental)"
                class="btn-secondary text-sm inline-flex items-center justify-center"
              >
                {{ t('rentals.message_vendor') }}
              </button>
            </div>
          </div>
        </div>
      </div>

        <div v-else class="text-center py-12">
          <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:scale-110">
            <Car class="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-3">{{ t('rentals.no_rentals_title') }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">{{ t('rentals.no_rentals_description') }}</p>
          <RouterLink to="/vehicles" class="btn-primary inline-flex items-center group">
            <span>{{ t('rentals.browse_cars') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AlertCircle, Car } from 'lucide-vue-next'
import { useTranslation } from '../../services/i18n'
import { useAuthStore } from '../../stores/auth'
import { useRentalsStore, type Rental } from '../../stores/rentals'
import { useCurrencyConversion } from '../../composables/useCurrencyConversion'
import { api } from '../../services/api'

const router = useRouter()
const { t } = useTranslation()
const authStore = useAuthStore()
const rentalsStore = useRentalsStore()
const { formatCurrency } = useCurrencyConversion()

// Load rentals when component mounts
onMounted(async () => {
  // Ensure auth is initialized if token exists
  if (!authStore.user && localStorage.getItem('auth_token')) {
    try {
      await authStore.initializeAuth()
    } catch (e) {
      // ignore; router guards will handle auth redirects
    }
  }

  // Only load rentals for regular users
  if (authStore.user?.role === 'user') {
    await rentalsStore.loadRentals()
  } else if (authStore.user) {
    // Redirect vendors and admins to their respective dashboards
    const dashboard = authStore.user.role === 'vendor' ? '/vendor' : '/admin'
    router.push(dashboard)
  }
})

type RentalStatus = 'active' | 'completed' | 'cancelled' | 'pending'

const loading = computed(() => rentalsStore.loading)
const error = computed(() => rentalsStore.error)
const rentals = computed<Rental[]>(() => rentalsStore.rentals)
const activeTab = ref('all')
const sortKey = ref<'newest' | 'oldest' | 'price_asc' | 'price_desc'>('newest')
const page = ref(1)
const pageSize = ref(9)

const tabs = [
  { value: 'all', label: t('rentals.tabs.all') },
  { value: 'active', label: t('rentals.tabs.active') },
  { value: 'pending', label: t('rentals.tabs.pending') },
  { value: 'completed', label: t('rentals.tabs.completed') }
]

const filteredRentals = computed(() => {
  const base = rentalsStore.getByStatus(activeTab.value as any)
  return rentalsStore.sortRentals(base, sortKey.value)
})

const paginatedRentals = computed(() => {
  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRentals.value.slice(start, end)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRentals.value.length / pageSize.value)))

const getRentalsByStatus = (status: string) => {
  if (status === 'all') return rentals.value
  return rentalsStore.getByStatus(status as any)
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

const statusLabel = (value: string) => {
  switch (value) {
    case 'all': return t('rentals.tabs.all')
    case 'active': return t('rentals.tabs.active')
    case 'pending': return t('rentals.tabs.pending')
    case 'completed': return t('rentals.tabs.completed')
    default: return value
  }
}

// Date formatting
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

// Rental actions
const viewRentalDetails = (rental: Rental) => {
  router.push({ name: 'rental-details', params: { id: rental.id.toString() } })
}

const completeBooking = async (rental: Rental) => {
  if (!confirm(t('rentals.complete_booking_confirm'))) return
  
  // In development, just update the local state
  if (import.meta.env.DEV) {
    rental.status = 'active'
    return
  }
  
  // In production, this would call the API
  try {
    const response = await fetch(`/api/rentals/${rental.id}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to complete booking')
    }
    
    rental.status = 'active'
  } catch (err) {
    console.error('Complete booking error:', err)
    rentalsStore.error = t('rentals.complete_booking_error')
  }
}

const cancelRental = async (rental: Rental) => {
  if (!confirm(t('rentals.cancel_confirm'))) return
  
  // In development, just update the local state
  if (import.meta.env.DEV) {
    rental.status = 'cancelled'
    return
  }
  
  // In production, this would call the API
  try {
    const response = await fetch(`/api/rentals/${rental.id}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to cancel rental')
    }
    
    rental.status = 'cancelled'
  } catch (err) {
    console.error('Cancel rental error:', err)
    rentalsStore.error = t('rentals.cancel_error')
  }
}

const writeReview = (rental: Rental) => {
  router.push(`/rentals/${rental.id}/review`)
}

/**
 * Contact vendor - automatically creates or finds chat with specific vendor
 */
const contactVendor = async (rental: Rental) => {
  try {
    // First, try to find existing conversation with this vendor
    const conversationsResponse = await api.get('/conversations')
    const existingConversation = conversationsResponse.data.data?.find((conv: any) => 
      conv.participant_id === rental.vendor_id
    )
    
    if (existingConversation) {
      // Redirect to existing conversation
      router.push(`/chat?conversationId=${existingConversation.id}`)
    } else {
      // Create new conversation with this specific vendor
      const response = await api.post('/conversations', {
        participantId: rental.vendor_id,
        title: `Conversación con ${rental.vendor_name || 'Vendedor'}`
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

// store-based loading is used instead
</script>

<style scoped>
/* Rental List Transitions */
.rental-list-move,
.rental-list-enter-active,
.rental-list-leave-active {
  transition: all 0.5s ease;
}

.rental-list-enter-from,
.rental-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.rental-list-leave-active {
  position: absolute;
}

/* Loading Spinner */
.loading-spinner {
  animation: spin 1s linear infinite;
}

/* Button Styles */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: var(--primary-600);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-700);
  transform: scale(1.05);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  background-color: white;
  transition: all 0.3s ease;
}

.dark .btn-secondary {
  border-color: #4b5563;
  color: #e5e7eb;
  background-color: #374151;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  transform: scale(1.05);
}

.dark .btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #dc2626;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background-color: #b91c1c;
  transform: scale(1.05);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>