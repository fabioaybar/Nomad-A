<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('vendor.reviews.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.subtitle') }}</p>
      </div>

      <!-- Review Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Overall Rating -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.reviews.overall_rating') }}</h3>
            <div class="text-yellow-500">
              <Star class="w-5 h-5" />
            </div>
          </div>
          <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.overallRating }}</div>
          <div class="flex items-center mt-1">
            <div class="flex items-center">
              <Star v-for="i in 5" :key="i" :class="i <= Math.round(stats.overallRating) ? 'text-yellow-400' : 'text-gray-300'" class="w-4 h-4" />
            </div>
            <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{ stats.totalReviews }} {{ t('vendor.reviews.reviews') }}</span>
          </div>
        </div>

        <!-- Recent Reviews -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.reviews.recent_reviews') }}</h3>
            <div class="text-blue-500">
              <Clock class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.recentReviews }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.reviews.this_month') }}</div>
        </div>

        <!-- Pending Reviews -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.reviews.pending_reviews') }}</h3>
            <div class="text-yellow-500">
              <AlertCircle class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.pendingReviews }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.reviews.awaiting_response') }}</div>
        </div>

        <!-- Response Rate -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.reviews.response_rate') }}</h3>
            <div class="text-green-500">
              <MessageCircle class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.responseRate }}%</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.reviews.reviews_responded') }}</div>
        </div>
      </div>

      <!-- Rating Distribution Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Rating Distribution -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.reviews.rating_distribution') }}</h3>
          </div>
          <div class="p-6">
            <div v-if="loading" class="flex items-center justify-center h-48">
              <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            </div>
            <div v-else class="space-y-3">
              <div v-for="rating in 5" :key="rating" class="flex items-center">
                <span class="w-8 text-sm text-gray-600 dark:text-gray-400">{{ 6 - rating }}</span>
                <Star class="w-4 h-4 text-yellow-400 mx-2" />
                <div class="flex-1 mx-3">
                  <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${(ratingDistribution[6 - rating] / stats.totalReviews) * 100}%` }"
                    ></div>
                  </div>
                </div>
                <span class="w-8 text-sm text-gray-600 dark:text-gray-400">{{ ratingDistribution[6 - rating] || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Performance -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.reviews.recent_performance') }}</h3>
          </div>
          <div class="p-6">
            <div v-if="loading" class="flex items-center justify-center h-48">
              <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
            </div>
            <div v-else class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.average_rating') }}</span>
                <div class="flex items-center">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.overallRating }}</span>
                  <div class="flex ml-2">
                    <Star v-for="i in 5" :key="i" :class="i <= Math.round(stats.overallRating) ? 'text-yellow-400' : 'text-gray-300'" class="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.total_reviews') }}</span>
                <span class="text-xl font-semibold text-gray-900 dark:text-white">{{ stats.totalReviews }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.positive_reviews') }}</span>
                <span class="text-xl font-semibold text-green-600">{{ stats.positiveReviews }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.response_time') }}</span>
                <span class="text-xl font-semibold text-gray-900 dark:text-white">{{ stats.avgResponseTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <!-- Search -->
          <div class="relative">
            <input
              type="text"
              v-model="search"
              :placeholder="t('vendor.reviews.search_placeholder')"
              class="w-full sm:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <!-- Rating Filter -->
          <select
            v-model="filters.rating"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{{ t('vendor.reviews.all_ratings') }}</option>
            <option value="5">{{ t('vendor.reviews.5_stars') }}</option>
            <option value="4">{{ t('vendor.reviews.4_stars') }}</option>
            <option value="3">{{ t('vendor.reviews.3_stars') }}</option>
            <option value="2">{{ t('vendor.reviews.2_stars') }}</option>
            <option value="1">{{ t('vendor.reviews.1_star') }}</option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{{ t('vendor.reviews.all_statuses') }}</option>
            <option value="pending">{{ t('vendor.reviews.pending') }}</option>
            <option value="approved">{{ t('vendor.reviews.approved') }}</option>
            <option value="rejected">{{ t('vendor.reviews.rejected') }}</option>
          </select>
        </div>

        <div class="flex gap-2">
          <button @click="exportReviews" class="btn-secondary flex items-center">
            <Download class="w-4 h-4 mr-2" />
            {{ t('vendor.reviews.export') }}
          </button>
          <button @click="refreshReviews" class="btn-secondary flex items-center">
            <RefreshCw class="w-4 h-4 mr-2" />
            {{ t('vendor.reviews.refresh') }}
          </button>
        </div>
      </div>

      <!-- Reviews Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.reviews.loading') }}</p>
        </div>

        <div v-else-if="filteredReviews.length === 0" class="p-8 text-center">
          <MessageCircle class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('vendor.reviews.no_reviews') }}</h3>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.reviews.no_reviews_desc') }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.reviews.customer') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.reviews.vehicle') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.reviews.rating') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.reviews.review') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.reviews.status') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.reviews.date') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.reviews.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="review in pagedReviews" :key="review.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <User class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ review.is_anonymous ? t('vendor.reviews.anonymous') : (review.user?.name || t('vendor.reviews.unknown_customer')) }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ review.is_anonymous ? '' : (review.user?.email || '') }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ review.vehicle?.make }} {{ review.vehicle?.model }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ review.vehicle?.license_plate }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex">
                      <Star v-for="i in 5" :key="i" :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'" class="w-4 h-4" />
                    </div>
                    <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ review.rating }}/5</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div v-if="review.title" class="text-sm font-medium text-gray-900 dark:text-white">{{ review.title }}</div>
                  <div v-if="review.comment" class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ review.comment }}</div>
                  <div v-if="review.vendor_response" class="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div class="text-xs text-blue-600 dark:text-blue-400 font-medium">{{ t('vendor.reviews.your_response') }}</div>
                    <div class="text-sm text-blue-800 dark:text-blue-200 mt-1">{{ review.vendor_response }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span :class="getStatusClass(review.status)">
                    {{ t(`vendor.reviews.statuses.${review.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(review.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="viewReview(review)"
                      class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                      :title="t('vendor.reviews.view_details')"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      v-if="!review.vendor_response"
                      @click="openResponseModal(review)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      :title="t('vendor.reviews.respond')"
                    >
                      <MessageCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="review.status === 'pending'"
                      @click="approveReview(review)"
                      class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      :title="t('vendor.reviews.approve')"
                    >
                      <CheckCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="review.status === 'pending'"
                      @click="rejectReview(review)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      :title="t('vendor.reviews.reject')"
                    >
                      <XCircle class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredReviews.length > 0" class="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('vendor.reviews.showing') }} {{ startIndex + 1 }}–{{ Math.min(startIndex + pageSize, filteredReviews.length) }} {{ t('vendor.reviews.of') }} {{ filteredReviews.length }}
          </div>
          <div class="flex items-center gap-2">
            <button
              :disabled="page === 1"
              @click="page--"
              class="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              {{ t('vendor.reviews.previous') }}
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ t('vendor.reviews.page') }} {{ page }}
            </span>
            <button
              :disabled="page >= totalPages"
              @click="page++"
              class="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              {{ t('vendor.reviews.next') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Review Response Modal -->
      <div v-if="showResponseModal" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/40" @click="closeResponseModal"></div>
        <div class="relative max-w-2xl mx-auto mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('vendor.reviews.respond_to_review') }}</h3>
            <button @click="closeResponseModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Review Details -->
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center mb-2">
              <div class="flex">
                <Star v-for="i in 5" :key="i" :class="i <= selectedReview?.rating ? 'text-yellow-400' : 'text-gray-300'" class="w-4 h-4" />
              </div>
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ selectedReview?.rating }}/5</span>
            </div>
            <div v-if="selectedReview?.title" class="font-medium text-gray-900 dark:text-white mb-1">{{ selectedReview.title }}</div>
            <div v-if="selectedReview?.comment" class="text-gray-600 dark:text-gray-400">{{ selectedReview.comment }}</div>
          </div>

          <form @submit.prevent="submitResponse" class="space-y-4">
            <!-- Response -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                {{ t('vendor.reviews.your_response') }} *
              </label>
              <textarea
                v-model="responseForm.response"
                rows="4"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-400 dark:focus:border-primary-400"
                :placeholder="t('vendor.reviews.response_placeholder')"
              ></textarea>
              <p v-if="errors.response" class="text-sm text-red-600 mt-1">{{ errors.response }}</p>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" @click="closeResponseModal" class="btn-secondary">
                {{ t('vendor.reviews.cancel') }}
              </button>
              <button type="submit" :disabled="submitting" class="btn-primary flex items-center space-x-2">
                <div v-if="submitting" class="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>{{ submitting ? t('vendor.reviews.sending') : t('vendor.reviews.send_response') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Review Detail Modal -->
      <div v-if="selectedReview" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/40" @click="selectedReview = null"></div>
        <div class="relative max-w-4xl mx-auto mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('vendor.reviews.review_details') }}</h3>
            <button @click="selectedReview = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Review Information -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.reviews.review_info') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.rating') }}:</span>
                  <div class="flex items-center">
                    <div class="flex">
                      <Star v-for="i in 5" :key="i" :class="i <= selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'" class="w-4 h-4" />
                    </div>
                    <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ selectedReview.rating }}/5</span>
                  </div>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.status') }}:</span>
                  <span :class="getStatusClass(selectedReview.status)">
                    {{ t(`vendor.reviews.statuses.${selectedReview.status}`) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.date') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedReview.created_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.anonymous') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedReview.is_anonymous ? t('common.yes') : t('common.no') }}</span>
                </div>
              </div>
            </div>

            <!-- Customer Information -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.reviews.customer_info') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.customer') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ selectedReview.is_anonymous ? t('vendor.reviews.anonymous') : (selectedReview.user?.name || t('vendor.reviews.unknown_customer')) }}
                  </span>
                </div>
                <div v-if="!selectedReview.is_anonymous" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.reviews.email') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedReview.user?.email || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Review Content -->
            <div class="md:col-span-2 space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.reviews.review_content') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div v-if="selectedReview.title" class="font-medium text-gray-900 dark:text-white mb-2">{{ selectedReview.title }}</div>
                <div v-if="selectedReview.comment" class="text-gray-600 dark:text-gray-400">{{ selectedReview.comment }}</div>
              </div>
            </div>

            <!-- Vendor Response -->
            <div v-if="selectedReview.vendor_response" class="md:col-span-2 space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.reviews.your_response') }}</h4>
              <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div class="text-blue-800 dark:text-blue-200">{{ selectedReview.vendor_response }}</div>
              </div>
            </div>

            <!-- Actions -->
            <div class="md:col-span-2 space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.reviews.actions') }}</h4>
              <div class="flex flex-wrap gap-2">
                <button
                  v-if="!selectedReview.vendor_response"
                  @click="openResponseModal(selectedReview)"
                  class="btn-primary text-sm"
                >
                  {{ t('vendor.reviews.respond') }}
                </button>
                <button
                  v-if="selectedReview.status === 'pending'"
                  @click="approveReview(selectedReview)"
                  class="btn-secondary text-sm"
                >
                  {{ t('vendor.reviews.approve') }}
                </button>
                <button
                  v-if="selectedReview.status === 'pending'"
                  @click="rejectReview(selectedReview)"
                  class="btn-secondary text-sm"
                >
                  {{ t('vendor.reviews.reject') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Star, 
  Clock, 
  AlertCircle, 
  MessageCircle, 
  Search, 
  Download, 
  RefreshCw,
  Eye, 
  User, 
  CheckCircle,
  XCircle,
  X
} from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notifications'
import { useTranslation } from '../../services/i18n'
import { api } from '../../services/api'

const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { t } = useTranslation()

// Types
interface Review {
  id: number
  booking_id: number
  user_id: number
  vehicle_id: number
  vendor_id: number
  rating: number
  title?: string
  comment?: string
  is_anonymous: boolean
  status: 'pending' | 'approved' | 'rejected'
  vendor_response?: string
  created_at: string
  updated_at: string
  user?: any
  vehicle?: any
}

// State
const reviews = ref<Review[]>([])
const loading = ref(false)
const selectedReview = ref<Review | null>(null)
const showResponseModal = ref(false)
const submitting = ref(false)
const search = ref('')
const errors = ref<Record<string, string>>({})
const filters = ref({
  rating: '',
  status: ''
})
const page = ref(1)
const pageSize = 10

const responseForm = ref({
  response: ''
})

const stats = ref({
  overallRating: 0,
  totalReviews: 0,
  recentReviews: 0,
  pendingReviews: 0,
  responseRate: 0,
  positiveReviews: 0,
  avgResponseTime: '0h'
})

const ratingDistribution = ref<Record<number, number>>({})

// Computed
const filteredReviews = computed(() => {
  let filtered = reviews.value
  
  if (search.value) {
    const query = search.value.toLowerCase()
    filtered = filtered.filter(review => 
      review.title?.toLowerCase().includes(query) ||
      review.comment?.toLowerCase().includes(query) ||
      review.vehicle?.make.toLowerCase().includes(query) ||
      review.vehicle?.model.toLowerCase().includes(query) ||
      review.user?.name?.toLowerCase().includes(query)
    )
  }
  
  if (filters.value.rating) {
    filtered = filtered.filter(review => review.rating === parseInt(filters.value.rating))
  }
  
  if (filters.value.status) {
    filtered = filtered.filter(review => review.status === filters.value.status)
  }
  
  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const pagedReviews = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredReviews.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredReviews.value.length / pageSize))
const startIndex = computed(() => (page.value - 1) * pageSize)

// Methods
const loadReviews = async () => {
  try {
    loading.value = true
    
    const response = await api.get(`/vendors/${authStore.user?.id}/reviews`)
    
    if (response.data.success) {
      reviews.value = response.data.data.reviews || []
      
      // Calculate stats
      calculateStats()
    }
  } catch (error) {
    console.error('Error loading reviews:', error)
    reviews.value = []
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  
  // Calculate overall rating
  const totalRating = reviews.value.reduce((sum, review) => sum + review.rating, 0)
  stats.value.overallRating = reviews.value.length > 0 ? totalRating / reviews.value.length : 0
  
  // Calculate other stats
  stats.value.totalReviews = reviews.value.length
  stats.value.recentReviews = reviews.value.filter(r => new Date(r.created_at) >= thisMonth).length
  stats.value.pendingReviews = reviews.value.filter(r => r.status === 'pending').length
  
  // Calculate response rate
  const reviewsWithResponse = reviews.value.filter(r => r.vendor_response)
  stats.value.responseRate = reviews.value.length > 0 ? Math.round((reviewsWithResponse.length / reviews.value.length) * 100) : 0
  
  // Calculate positive reviews (4+ stars)
  const positiveReviews = reviews.value.filter(r => r.rating >= 4)
  stats.value.positiveReviews = reviews.value.length > 0 ? Math.round((positiveReviews.length / reviews.value.length) * 100) : 0
  
  // Calculate rating distribution
  ratingDistribution.value = {}
  for (let i = 1; i <= 5; i++) {
    ratingDistribution.value[i] = reviews.value.filter(r => r.rating === i).length
  }
}

const refreshReviews = () => {
  loadReviews()
}

const viewReview = (review: Review) => {
  selectedReview.value = review
}

const openResponseModal = (review: Review) => {
  selectedReview.value = review
  responseForm.value.response = ''
  errors.value = {}
  showResponseModal.value = true
}

const closeResponseModal = () => {
  showResponseModal.value = false
  selectedReview.value = null
}

const validateResponse = (): boolean => {
  errors.value = {}
  
  if (!responseForm.value.response.trim()) {
    errors.value.response = t('vendor.reviews.validation.response_required')
  }
  
  return Object.keys(errors.value).length === 0
}

const submitResponse = async () => {
  if (!validateResponse() || !selectedReview.value) return
  
  submitting.value = true
  
  try {
    const response = await api.post(`/reviews/${selectedReview.value.id}/respond`, {
      vendor_response: responseForm.value.response
    })
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.reviews.success_title'),
        message: t('vendor.reviews.response_success')
      })
      
      // Update local review
      selectedReview.value.vendor_response = responseForm.value.response
      closeResponseModal()
      calculateStats()
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.reviews.error_title'),
      message: error.message || t('vendor.reviews.response_error')
    })
  } finally {
    submitting.value = false
  }
}

const approveReview = async (review: Review) => {
  try {
    const response = await api.post(`/reviews/${review.id}/approve`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.reviews.success_title'),
        message: t('vendor.reviews.approve_success')
      })
      
      // Update local status
      review.status = 'approved'
      selectedReview.value = null
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.reviews.error_title'),
      message: error.message || t('vendor.reviews.approve_error')
    })
  }
}

const rejectReview = async (review: Review) => {
  if (!confirm(t('vendor.reviews.reject_confirm'))) return
  
  try {
    const response = await api.post(`/reviews/${review.id}/reject`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.reviews.success_title'),
        message: t('vendor.reviews.reject_success')
      })
      
      // Update local status
      review.status = 'rejected'
      selectedReview.value = null
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.reviews.error_title'),
      message: error.message || t('vendor.reviews.reject_error')
    })
  }
}

const exportReviews = () => {
  // TODO: Implement reviews export
  notificationStore.addNotification({
    type: 'info',
    title: t('vendor.reviews.export_title'),
    message: t('vendor.reviews.export_message')
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

// Lifecycle
onMounted(() => {
  loadReviews()
})
</script>

