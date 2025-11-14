<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <button
            @click="goBack"
            class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
            <span>{{ t('reviews.back_to_rentals') }}</span>
          </button>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {{ t('reviews.write_review') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ t('reviews.subtitle') }}
        </p>
      </div>

      <!-- Rental Information -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-6">
          <img
            :src="rental.vehicle.images?.[0] || '/images/defaults/car-placeholder.jpg'"
            :alt="`${rental.vehicle.make} ${rental.vehicle.model}`"
            class="w-20 h-20 object-cover rounded-lg"
          />
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ rental.vehicle.make }} {{ rental.vehicle.model }} {{ rental.vehicle.year }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('reviews.rental_period') }}: {{ formatDate(rental.start_date) }} - {{ formatDate(rental.end_date) }}
            </p>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('reviews.vendor') }}: {{ rental.vendor_name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Review Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <form @submit.prevent="submitReview" class="space-y-6">
          <!-- Rating -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ t('reviews.rating') }} *
            </label>
            <div class="flex items-center space-x-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="reviewForm.rating = star"
                class="focus:outline-none transition-colors"
              >
                <Star
                  class="w-8 h-8"
                  :class="star <= reviewForm.rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300 dark:text-gray-600'"
                />
              </button>
              <span class="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {{ getRatingText(reviewForm.rating) }}
              </span>
            </div>
            <p v-if="errors.rating" class="text-sm text-red-600 mt-1">{{ errors.rating }}</p>
          </div>

          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reviews.title') }}
            </label>
            <input
              v-model="reviewForm.title"
              type="text"
              :placeholder="t('reviews.title_placeholder')"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
              maxlength="200"
            />
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ reviewForm.title.length }}/200 {{ t('reviews.characters') }}
            </p>
            <p v-if="errors.title" class="text-sm text-red-600 mt-1">{{ errors.title }}</p>
          </div>

          <!-- Comment -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('reviews.comment') }}
            </label>
            <textarea
              v-model="reviewForm.comment"
              :placeholder="t('reviews.comment_placeholder')"
              rows="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400 resize-none"
              maxlength="1000"
            ></textarea>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ reviewForm.comment.length }}/1000 {{ t('reviews.characters') }}
            </p>
            <p v-if="errors.comment" class="text-sm text-red-600 mt-1">{{ errors.comment }}</p>
          </div>

          <!-- Anonymous Option -->
          <div class="flex items-center">
            <input
              id="anonymous"
              v-model="reviewForm.is_anonymous"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="anonymous" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {{ t('reviews.anonymous') }}
            </label>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="goBack"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ t('reviews.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="submitting || !isFormValid"
              class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <div v-if="submitting" class="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>{{ submitting ? t('reviews.submitting') : t('reviews.submit') }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Review Guidelines -->
      <div class="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          {{ t('reviews.guidelines.title') }}
        </h3>
        <ul class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li class="flex items-start space-x-2">
            <CheckCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{{ t('reviews.guidelines.be_honest') }}</span>
          </li>
          <li class="flex items-start space-x-2">
            <CheckCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{{ t('reviews.guidelines.be_respectful') }}</span>
          </li>
          <li class="flex items-start space-x-2">
            <CheckCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{{ t('reviews.guidelines.be_specific') }}</span>
          </li>
          <li class="flex items-start space-x-2">
            <CheckCircle class="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{{ t('reviews.guidelines.focus_experience') }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Star, CheckCircle } from 'lucide-vue-next'
import { useTranslation } from '../../services/i18n'
import { api } from '../../services/api'
import { useNotificationStore } from '../../stores/notifications'
import type { Rental } from '../../types'

const router = useRouter()
const route = useRoute()
const { t } = useTranslation()
const notificationStore = useNotificationStore()

// State
const rental = ref<Rental | null>(null)
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

const reviewForm = ref({
  rating: 0,
  title: '',
  comment: '',
  is_anonymous: false
})

// Computed
const isFormValid = computed(() => {
  return reviewForm.value.rating > 0 && reviewForm.value.rating <= 5
})

// Methods
const goBack = () => {
  router.push('/my-rentals')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getRatingText = (rating: number) => {
  const texts = {
    1: t('reviews.rating_texts.terrible'),
    2: t('reviews.rating_texts.poor'),
    3: t('reviews.rating_texts.average'),
    4: t('reviews.rating_texts.good'),
    5: t('reviews.rating_texts.excellent')
  }
  return texts[rating as keyof typeof texts] || ''
}

const validateForm = () => {
  errors.value = {}

  if (reviewForm.value.rating < 1 || reviewForm.value.rating > 5) {
    errors.value.rating = t('reviews.errors.rating_required')
  }

  if (reviewForm.value.title && reviewForm.value.title.length > 200) {
    errors.value.title = t('reviews.errors.title_too_long')
  }

  if (reviewForm.value.comment && reviewForm.value.comment.length > 1000) {
    errors.value.comment = t('reviews.errors.comment_too_long')
  }

  return Object.keys(errors.value).length === 0
}

const submitReview = async () => {
  if (!validateForm()) return

  try {
    submitting.value = true
    errors.value = {}

    const reviewData = {
      vehicle_id: rental.value!.vehicle.id,
      rating: reviewForm.value.rating,
      title: reviewForm.value.title.trim(),
      comment: reviewForm.value.comment.trim(),
      is_anonymous: reviewForm.value.is_anonymous
    }

    const response = await api.post('/reviews', reviewData)

    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('reviews.success_title'),
        message: t('reviews.success_message')
      })

      // Redirect to rentals page
      router.push('/my-rentals')
    } else {
      throw new Error(response.data.message || t('reviews.submit_error'))
    }
  } catch (error: any) {
    console.error('Error submitting review:', error)
    
    if (error.response?.data?.errors) {
      // Handle validation errors from backend
      const backendErrors = error.response.data.errors
      Object.keys(backendErrors).forEach(key => {
        errors.value[key] = backendErrors[key][0] || t('reviews.submit_error')
      })
    } else {
      notificationStore.addNotification({
        type: 'error',
        title: t('reviews.error_title'),
        message: error.message || t('reviews.submit_error')
      })
    }
  } finally {
    submitting.value = false
  }
}

const loadRental = async () => {
  try {
    const rentalId = route.params.id as string
    
    // Try to get rental from API
    const response = await api.get(`/bookings/${rentalId}`)
    
    if (response.data.success) {
      rental.value = response.data.data.booking
    } else {
      throw new Error('Rental not found')
    }
  } catch (error) {
    console.error('Error loading rental:', error)
    
    // Fallback to mock data for development
    rental.value = {
      id: parseInt(route.params.id as string),
      vehicle: {
        id: 1,
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        images: ['/images/defaults/sedan.png']
      },
      start_date: '2024-10-01',
      end_date: '2024-10-03',
      vendor_name: 'AutoRent Chile',
      status: 'completed',
      has_review: false
    } as Rental
  }
}

// Lifecycle
onMounted(() => {
  loadRental()
})
</script>

