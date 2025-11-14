<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                {{ $t('admin.reviews.title') }}
              </h1>
              <p class="mt-2 text-gray-600">
                {{ $t('admin.reviews.subtitle') }}
              </p>
            </div>
            <div class="flex space-x-3">
              <button
                @click="exportReviews"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download class="w-4 h-4 mr-2" />
                {{ $t('admin.reviews.export') }}
              </button>
              <button
                @click="openBulkActionsModal"
                :disabled="selectedReviews.length === 0"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Settings class="w-4 h-4 mr-2" />
                {{ $t('admin.reviews.bulk_actions') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Star class="h-6 w-6 text-yellow-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ $t('admin.reviews.total_reviews') }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.total_reviews || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CheckCircle class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ $t('admin.reviews.approved_reviews') }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.approved_reviews || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <Clock class="h-6 w-6 text-yellow-500" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ $t('admin.reviews.pending_reviews') }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.pending_reviews || 0 }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <TrendingUp class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ $t('admin.reviews.average_rating') }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.average_rating ? stats.average_rating.toFixed(1) : '0.0' }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ $t('admin.reviews.filters') }}
          </h3>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('admin.reviews.search') }}
              </label>
              <input
                v-model="filters.search"
                type="text"
                :placeholder="$t('admin.reviews.search_placeholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- Rating Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('admin.reviews.rating') }}
              </label>
              <select
                v-model="filters.rating"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{{ $t('admin.reviews.all_ratings') }}</option>
                <option value="5">5 {{ $t('admin.reviews.stars') }}</option>
                <option value="4">4 {{ $t('admin.reviews.stars') }}</option>
                <option value="3">3 {{ $t('admin.reviews.stars') }}</option>
                <option value="2">2 {{ $t('admin.reviews.stars') }}</option>
                <option value="1">1 {{ $t('admin.reviews.star') }}</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('admin.reviews.status') }}
              </label>
              <select
                v-model="filters.is_approved"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">{{ $t('admin.reviews.all_statuses') }}</option>
                <option value="true">{{ $t('admin.reviews.approved') }}</option>
                <option value="false">{{ $t('admin.reviews.pending') }}</option>
              </select>
            </div>

            <!-- Date Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('admin.reviews.date_range') }}
              </label>
              <div class="flex space-x-2">
                <input
                  v-model="filters.start_date"
                  type="date"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  v-model="filters.end_date"
                  type="date"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-4">
            <button
              @click="clearFilters"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('admin.reviews.clear_filters') }}
            </button>
            <button
              @click="applyFilters"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('admin.reviews.apply_filters') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Table -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ $t('admin.reviews.reviews_list') }}
          </h3>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">
              {{ $t('admin.reviews.showing') }} {{ pagination.page * pagination.limit - pagination.limit + 1 }} - 
              {{ Math.min(pagination.page * pagination.limit, pagination.total) }} 
              {{ $t('admin.reviews.of') }} {{ pagination.total }}
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    :checked="selectAll"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </th>
                <th 
                  @click="sortBy('id')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  {{ $t('admin.reviews.id') }}
                  <ChevronUp v-if="sortField === 'id' && sortDirection === 'asc'" class="w-4 h-4 inline ml-1" />
                  <ChevronDown v-if="sortField === 'id' && sortDirection === 'desc'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('admin.reviews.user') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('admin.reviews.vehicle') }}
                </th>
                <th 
                  @click="sortBy('rating')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  {{ $t('admin.reviews.rating') }}
                  <ChevronUp v-if="sortField === 'rating' && sortDirection === 'asc'" class="w-4 h-4 inline ml-1" />
                  <ChevronDown v-if="sortField === 'rating' && sortDirection === 'desc'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('admin.reviews.comment') }}
                </th>
                <th 
                  @click="sortBy('is_approved')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  {{ $t('admin.reviews.status') }}
                  <ChevronUp v-if="sortField === 'is_approved' && sortDirection === 'asc'" class="w-4 h-4 inline ml-1" />
                  <ChevronDown v-if="sortField === 'is_approved' && sortDirection === 'desc'" class="w-4 h-4 inline ml-1" />
                </th>
                <th 
                  @click="sortBy('created_at')"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  {{ $t('admin.reviews.date') }}
                  <ChevronUp v-if="sortField === 'created_at' && sortDirection === 'asc'" class="w-4 h-4 inline ml-1" />
                  <ChevronDown v-if="sortField === 'created_at' && sortDirection === 'desc'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ $t('admin.reviews.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="animate-pulse">
                <td colspan="9" class="px-6 py-4 text-center text-gray-500">
                  {{ $t('admin.reviews.loading') }}
                </td>
              </tr>
              <tr v-else-if="reviews.length === 0" class="text-center">
                <td colspan="9" class="px-6 py-4 text-gray-500">
                  {{ $t('admin.reviews.no_reviews') }}
                </td>
              </tr>
              <tr v-else v-for="review in reviews" :key="review.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    :value="review.id"
                    v-model="selectedReviews"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{{ review.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User class="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ review.user?.name || 'Unknown User' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ review.user?.email || 'No email' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ review.vehicle?.make }} {{ review.vehicle?.model }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ review.vehicle?.license_plate }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                        class="h-4 w-4"
                      />
                    </div>
                    <span class="ml-2 text-sm text-gray-900">{{ review.rating }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">
                    {{ review.comment || $t('admin.reviews.no_comment') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="review.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  >
                    {{ review.is_approved ? $t('admin.reviews.approved') : $t('admin.reviews.pending') }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(review.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      v-if="!review.is_approved"
                      @click="approveReview(review.id)"
                      class="text-green-600 hover:text-green-900"
                      :title="$t('admin.reviews.approve')"
                    >
                      <CheckCircle class="h-4 w-4" />
                    </button>
                    <button
                      v-if="review.is_approved"
                      @click="rejectReview(review.id)"
                      class="text-red-600 hover:text-red-900"
                      :title="$t('admin.reviews.reject')"
                    >
                      <XCircle class="h-4 w-4" />
                    </button>
                    <button
                      @click="viewReviewDetails(review)"
                      class="text-blue-600 hover:text-blue-900"
                      :title="$t('admin.reviews.view_details')"
                    >
                      <Eye class="h-4 w-4" />
                    </button>
                    <button
                      @click="deleteReview(review.id)"
                      class="text-red-600 hover:text-red-900"
                      :title="$t('admin.reviews.delete')"
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="pagination.page <= 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('admin.reviews.previous') }}
            </button>
            <button
              @click="nextPage"
              :disabled="pagination.page >= pagination.pages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('admin.reviews.next') }}
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                {{ $t('admin.reviews.showing') }} 
                <span class="font-medium">{{ pagination.page * pagination.limit - pagination.limit + 1 }}</span>
                {{ $t('admin.reviews.to') }}
                <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
                {{ $t('admin.reviews.of') }}
                <span class="font-medium">{{ pagination.total }}</span>
                {{ $t('admin.reviews.results') }}
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="previousPage"
                  :disabled="pagination.page <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="page === pagination.page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                  class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="pagination.page >= pagination.pages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Details Modal -->
    <div v-if="selectedReview" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ $t('admin.reviews.review_details') }}
            </h3>
            <button @click="selectedReview = null" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('admin.reviews.user') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedReview.user?.name || 'Unknown User' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('admin.reviews.vehicle') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ selectedReview.vehicle?.make }} {{ selectedReview.vehicle?.model }}
                </p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ $t('admin.reviews.rating') }}
              </label>
              <div class="flex items-center mt-1">
                <div class="flex">
                  <Star
                    v-for="i in 5"
                    :key="i"
                    :class="i <= selectedReview.rating ? 'text-yellow-400' : 'text-gray-300'"
                    class="h-5 w-5"
                  />
                </div>
                <span class="ml-2 text-sm text-gray-900">{{ selectedReview.rating }}/5</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ $t('admin.reviews.comment') }}
              </label>
              <p class="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                {{ selectedReview.comment || $t('admin.reviews.no_comment') }}
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('admin.reviews.status') }}
                </label>
                <span
                  :class="selectedReview.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1"
                >
                  {{ selectedReview.is_approved ? $t('admin.reviews.approved') : $t('admin.reviews.pending') }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('admin.reviews.date') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">
                  {{ formatDate(selectedReview.created_at) }}
                </p>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="selectedReview = null"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('admin.reviews.close') }}
            </button>
            <button
              v-if="!selectedReview.is_approved"
              @click="approveReview(selectedReview.id)"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {{ $t('admin.reviews.approve') }}
            </button>
            <button
              v-if="selectedReview.is_approved"
              @click="rejectReview(selectedReview.id)"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {{ $t('admin.reviews.reject') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Actions Modal -->
    <div v-if="showBulkActionsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ $t('admin.reviews.bulk_actions') }}
            </h3>
            <button @click="showBulkActionsModal = false" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="space-y-3">
            <button
              @click="bulkApprove"
              class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircle class="w-4 h-4 mr-2" />
              {{ $t('admin.reviews.bulk_approve') }}
            </button>
            <button
              @click="bulkReject"
              class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <XCircle class="w-4 h-4 mr-2" />
              {{ $t('admin.reviews.bulk_reject') }}
            </button>
            <button
              @click="bulkDelete"
              class="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 class="w-4 h-4 mr-2" />
              {{ $t('admin.reviews.bulk_delete') }}
            </button>
          </div>
          
          <div class="flex justify-end mt-6">
            <button
              @click="showBulkActionsModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('admin.reviews.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notifications'
import api from '@/services/api'
import {
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Settings,
  ChevronUp,
  ChevronDown,
  User,
  XCircle,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-vue-next'

const router = useRouter()
const notificationStore = useNotificationStore()

// Types
interface Review {
  id: number
  user_id: number
  vehicle_id: number
  vendor_id: number
  booking_id: number
  rating: number
  comment: string
  is_approved: boolean
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
  }
  vehicle?: {
    id: number
    make: string
    model: string
    license_plate: string
  }
  vendor?: {
    id: number
    company_name: string
  }
}

// State
const reviews = ref<Review[]>([])
const selectedReviews = ref<number[]>([])
const selectAll = ref(false)
const loading = ref(false)
const selectedReview = ref<Review | null>(null)
const showBulkActionsModal = ref(false)

// Filters
const filters = ref({
  search: '',
  rating: '',
  is_approved: '',
  start_date: '',
  end_date: ''
})

// Pagination
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 0
})

// Sorting
const sortField = ref('created_at')
const sortDirection = ref('desc')

// Stats
const stats = ref({
  total_reviews: 0,
  approved_reviews: 0,
  pending_reviews: 0,
  average_rating: 0
})

// Computed
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, pagination.value.page - 2)
  const end = Math.min(pagination.value.pages, pagination.value.page + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL')
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  loadReviews()
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedReviews.value = reviews.value.map(review => review.id)
  } else {
    selectedReviews.value = []
  }
}

const applyFilters = () => {
  pagination.value.page = 1
  loadReviews()
}

const clearFilters = () => {
  filters.value = {
    search: '',
    rating: '',
    is_approved: '',
    start_date: '',
    end_date: ''
  }
  pagination.value.page = 1
  loadReviews()
}

const previousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
    loadReviews()
  }
}

const nextPage = () => {
  if (pagination.value.page < pagination.value.pages) {
    pagination.value.page++
    loadReviews()
  }
}

const goToPage = (page: number) => {
  pagination.value.page = page
  loadReviews()
}

const loadReviews = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString(),
      sort: sortField.value,
      order: sortDirection.value
    })

    // Add filters
    if (filters.value.search) params.append('search', filters.value.search)
    if (filters.value.rating) params.append('rating', filters.value.rating)
    if (filters.value.is_approved) params.append('is_approved', filters.value.is_approved)
    if (filters.value.start_date) params.append('start_date', filters.value.start_date)
    if (filters.value.end_date) params.append('end_date', filters.value.end_date)

    const response = await api.get(`/admin/reviews?${params}`)
    
    if (response.data.success) {
      reviews.value = response.data.data.reviews
      pagination.value = response.data.data.pagination
      updateStats()
    }
  } catch (error) {
    console.error('Error loading reviews:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to load reviews'
    })
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  const total = reviews.value.length
  const approved = reviews.value.filter(r => r.is_approved).length
  const pending = reviews.value.filter(r => !r.is_approved).length
  const averageRating = reviews.value.length > 0 
    ? reviews.value.reduce((sum, r) => sum + r.rating, 0) / reviews.value.length 
    : 0

  stats.value = {
    total_reviews: total,
    approved_reviews: approved,
    pending_reviews: pending,
    average_rating: averageRating
  }
}

const approveReview = async (reviewId: number) => {
  try {
    const response = await api.put(`/admin/reviews/${reviewId}/approve`, {
      is_approved: true
    })
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Review approved successfully'
      })
      loadReviews()
      if (selectedReview.value?.id === reviewId) {
        selectedReview.value = null
      }
    }
  } catch (error) {
    console.error('Error approving review:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to approve review'
    })
  }
}

const rejectReview = async (reviewId: number) => {
  try {
    const response = await api.put(`/admin/reviews/${reviewId}/approve`, {
      is_approved: false,
      reason: 'Rejected by admin'
    })
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Review rejected successfully'
      })
      loadReviews()
      if (selectedReview.value?.id === reviewId) {
        selectedReview.value = null
      }
    }
  } catch (error) {
    console.error('Error rejecting review:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to reject review'
    })
  }
}

const deleteReview = async (reviewId: number) => {
  if (!confirm('Are you sure you want to delete this review?')) return
  
  try {
    const response = await api.delete(`/admin/reviews/${reviewId}`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Review deleted successfully'
      })
      loadReviews()
    }
  } catch (error) {
    console.error('Error deleting review:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to delete review'
    })
  }
}

const viewReviewDetails = (review: Review) => {
  selectedReview.value = review
}

const exportReviews = () => {
  notificationStore.addNotification({
    type: 'info',
    title: 'Export',
    message: 'Export functionality will be implemented soon'
  })
}

const openBulkActionsModal = () => {
  showBulkActionsModal.value = true
}

const bulkApprove = async () => {
  if (selectedReviews.value.length === 0) return
  
  try {
    for (const reviewId of selectedReviews.value) {
      await api.put(`/admin/reviews/${reviewId}/approve`, {
        is_approved: true
      })
    }
    
    notificationStore.addNotification({
      type: 'success',
      title: 'Success',
      message: `${selectedReviews.value.length} reviews approved successfully`
    })
    
    selectedReviews.value = []
    selectAll.value = false
    showBulkActionsModal.value = false
    loadReviews()
  } catch (error) {
    console.error('Error bulk approving reviews:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to approve reviews'
    })
  }
}

const bulkReject = async () => {
  if (selectedReviews.value.length === 0) return
  
  try {
    for (const reviewId of selectedReviews.value) {
      await api.put(`/admin/reviews/${reviewId}/approve`, {
        is_approved: false,
        reason: 'Bulk rejected by admin'
      })
    }
    
    notificationStore.addNotification({
      type: 'success',
      title: 'Success',
      message: `${selectedReviews.value.length} reviews rejected successfully`
    })
    
    selectedReviews.value = []
    selectAll.value = false
    showBulkActionsModal.value = false
    loadReviews()
  } catch (error) {
    console.error('Error bulk rejecting reviews:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to reject reviews'
    })
  }
}

const bulkDelete = async () => {
  if (selectedReviews.value.length === 0) return
  
  if (!confirm(`Are you sure you want to delete ${selectedReviews.value.length} reviews?`)) return
  
  try {
    for (const reviewId of selectedReviews.value) {
      await api.delete(`/admin/reviews/${reviewId}`)
    }
    
    notificationStore.addNotification({
      type: 'success',
      title: 'Success',
      message: `${selectedReviews.value.length} reviews deleted successfully`
    })
    
    selectedReviews.value = []
    selectAll.value = false
    showBulkActionsModal.value = false
    loadReviews()
  } catch (error) {
    console.error('Error bulk deleting reviews:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to delete reviews'
    })
  }
}

// Lifecycle
onMounted(() => {
  loadReviews()
})
</script>
