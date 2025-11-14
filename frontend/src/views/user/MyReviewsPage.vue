<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {{ t('reviews.my_reviews') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ t('reviews.my_reviews_subtitle') }}
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Star class="w-8 h-8 text-yellow-500" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('reviews.total_reviews') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ reviews.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Star class="w-8 h-8 text-green-500" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('reviews.average_rating') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ averageRating.toFixed(1) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CheckCircle class="w-8 h-8 text-blue-500" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('reviews.approved') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ approvedReviews.length }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Clock class="w-8 h-8 text-orange-500" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('reviews.pending') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ pendingReviews.length }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-6">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="filter in filters"
              :key="filter.key"
              @click="activeFilter = filter.key"
              class="py-2 px-1 border-b-2 font-medium text-sm transition-colors"
              :class="activeFilter === filter.key
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'"
            >
              <component :is="filter.icon" class="w-4 h-4 inline mr-2" />
              {{ filter.label }}
              <span v-if="filter.count !== undefined" class="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                {{ filter.count }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div v-if="loading" class="p-8 text-center">
          <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ t('reviews.loading') }}</p>
        </div>

        <div v-else-if="filteredReviews.length === 0" class="p-8 text-center">
          <Star class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ t('reviews.no_reviews') }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{ activeFilter === 'all' ? t('reviews.no_reviews_desc') : t('reviews.no_reviews_filtered') }}
          </p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="review in filteredReviews"
            :key="review.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-start space-x-4">
              <!-- Vehicle Image -->
              <div class="flex-shrink-0">
                <img
                  :src="review.vehicle?.images?.[0] || '/images/defaults/car-placeholder.jpg'"
                  :alt="`${review.vehicle?.make} ${review.vehicle?.model}`"
                  class="w-16 h-16 object-cover rounded-lg"
                />
              </div>

              <!-- Review Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      {{ review.vehicle?.make }} {{ review.vehicle?.model }} {{ review.vehicle?.year }}
                    </h3>
                    <div class="flex items-center space-x-1">
                      <Star
                        v-for="star in 5"
                        :key="star"
                        class="w-4 h-4"
                        :class="star <= review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'"
                      />
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusClass(review.status)"
                    >
                      {{ getStatusText(review.status) }}
                    </span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(review.created_at) }}
                    </span>
                  </div>
                </div>

                <div v-if="review.title" class="mb-2">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ review.title }}
                  </h4>
                </div>

                <p v-if="review.comment" class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {{ review.comment }}
                </p>

                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ t('reviews.vendor') }}: {{ review.vendor?.company_name }}
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      v-if="review.status === 'pending'"
                      @click="editReview(review)"
                      class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {{ t('reviews.edit') }}
                    </button>
                    <button
                      @click="deleteReview(review.id)"
                      class="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      {{ t('reviews.delete') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreReviews" class="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            @click="loadMoreReviews"
            class="btn-secondary"
            :disabled="loading"
          >
            {{ t('reviews.load_more') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Star, 
  CheckCircle, 
  Clock,
  AlertCircle
} from 'lucide-vue-next'
import { useTranslation } from '../../services/i18n'
import { api } from '../../services/api'
import { useNotificationStore } from '../../stores/notifications'

const router = useRouter()
const { t } = useTranslation()
const notificationStore = useNotificationStore()

// State
const reviews = ref<any[]>([])
const loading = ref(false)
const activeFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

// Computed
const approvedReviews = computed(() => 
  reviews.value.filter(r => r.status === 'approved')
)

const pendingReviews = computed(() => 
  reviews.value.filter(r => r.status === 'pending')
)

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return sum / reviews.value.length
})

const filters = computed(() => [
  {
    key: 'all',
    label: t('reviews.all'),
    icon: Star,
    count: reviews.value.length
  },
  {
    key: 'approved',
    label: t('reviews.approved'),
    icon: CheckCircle,
    count: approvedReviews.value.length
  },
  {
    key: 'pending',
    label: t('reviews.pending'),
    icon: Clock,
    count: pendingReviews.value.length
  }
])

const filteredReviews = computed(() => {
  if (activeFilter.value === 'all') {
    return reviews.value
  }
  return reviews.value.filter(review => review.status === activeFilter.value)
})

const hasMoreReviews = computed(() => {
  return reviews.value.length >= currentPage.value * pageSize.value
})

// Methods
const fetchReviews = async () => {
  try {
    loading.value = true
    
    const response = await api.get('/reviews/user', {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
        sort: 'newest'
      }
    })
    
    if (response.data.success) {
      if (currentPage.value === 1) {
        reviews.value = response.data.data.reviews || []
      } else {
        reviews.value.push(...(response.data.data.reviews || []))
      }
    } else {
      throw new Error(response.data.message || 'Failed to fetch reviews')
    }
  } catch (error: any) {
    console.error('Error fetching reviews:', error)
    
    // Fallback to mock data for development
    if (error.status === 401) throw error
    loadMockReviews()
  } finally {
    loading.value = false
  }
}

const loadMoreReviews = async () => {
  currentPage.value++
  await fetchReviews()
}

const editReview = (review: any) => {
  router.push(`/reviews/${review.id}/edit`)
}

const deleteReview = async (reviewId: number) => {
  if (!confirm(t('reviews.delete_confirm'))) return
  
  try {
    const response = await api.delete(`/reviews/${reviewId}`)
    
    if (response.data.success) {
      reviews.value = reviews.value.filter(r => r.id !== reviewId)
      notificationStore.addNotification({
        type: 'success',
        title: t('reviews.delete_success_title'),
        message: t('reviews.delete_success_message')
      })
    } else {
      throw new Error(response.data.message || 'Failed to delete review')
    }
  } catch (error: any) {
    console.error('Error deleting review:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('reviews.delete_error_title'),
      message: error.message || t('reviews.delete_error_message')
    })
  }
}

const getStatusClass = (status: string) => {
  const classes = {
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

const getStatusText = (status: string) => {
  const texts = {
    approved: t('reviews.status.approved'),
    pending: t('reviews.status.pending'),
    rejected: t('reviews.status.rejected')
  }
  return texts[status as keyof typeof texts] || status
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const loadMockReviews = () => {
  reviews.value = [
    {
      id: 1,
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        images: ['/images/defaults/sedan.png']
      },
      vendor: {
        company_name: 'AutoRent Chile'
      },
      rating: 5,
      title: 'Excellent car!',
      comment: 'Great experience with this vehicle. Clean, comfortable, and reliable.',
      status: 'approved',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      vehicle: {
        make: 'Honda',
        model: 'CR-V',
        year: 2021,
        images: ['/images/defaults/suv.png']
      },
      vendor: {
        company_name: 'Premium Cars'
      },
      rating: 4,
      title: 'Good SUV',
      comment: 'Spacious and comfortable for family trips.',
      status: 'pending',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]
}

// Lifecycle
onMounted(() => {
  fetchReviews()
})
</script>

