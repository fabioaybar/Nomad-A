<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.bookings.title') }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.bookings.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="exportBookings"
              class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download class="w-5 h-5 mr-2" />
              {{ t('admin.bookings.export') }}
            </button>
            <button
              @click="refreshBookings"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw class="w-5 h-5 mr-2" />
              {{ t('admin.bookings.refresh') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Calendar class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.bookings.total_bookings') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.bookings.confirmed') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.confirmedBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.bookings.pending') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.pendingBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <AlertTriangle class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.bookings.disputed') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.disputedBookings }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <DollarSign class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.bookings.total_revenue') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(stats.totalRevenue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.bookings.search') }}</label>
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('admin.bookings.search_placeholder')"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.bookings.status') }}</label>
              <select
                v-model="statusFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.bookings.all_statuses') }}</option>
                <option value="pending">{{ t('admin.bookings.pending') }}</option>
                <option value="confirmed">{{ t('admin.bookings.confirmed') }}</option>
                <option value="active">{{ t('admin.bookings.active') }}</option>
                <option value="completed">{{ t('admin.bookings.completed') }}</option>
                <option value="cancelled">{{ t('admin.bookings.cancelled') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.bookings.payment_status') }}</label>
              <select
                v-model="paymentStatusFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.bookings.all_payment_statuses') }}</option>
                <option value="pending">{{ t('admin.bookings.payment_pending') }}</option>
                <option value="paid">{{ t('admin.bookings.payment_paid') }}</option>
                <option value="refunded">{{ t('admin.bookings.payment_refunded') }}</option>
                <option value="failed">{{ t('admin.bookings.payment_failed') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.bookings.disputes') }}</label>
              <select
                v-model="disputeFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.bookings.all_disputes') }}</option>
                <option value="has_dispute">{{ t('admin.bookings.has_dispute') }}</option>
                <option value="no_dispute">{{ t('admin.bookings.no_dispute') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.bookings.date_range') }}</label>
              <select
                v-model="dateRangeFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.bookings.all_dates') }}</option>
                <option value="today">{{ t('admin.bookings.today') }}</option>
                <option value="week">{{ t('admin.bookings.this_week') }}</option>
                <option value="month">{{ t('admin.bookings.this_month') }}</option>
                <option value="year">{{ t('admin.bookings.this_year') }}</option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <button
                @click="clearFilters"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {{ t('admin.bookings.clear_filters') }}
              </button>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.bookings.showing') }} {{ filteredBookings.length }} {{ t('admin.bookings.of') }} {{ bookings.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bookings Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.bookings.bookings_list') }}</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="rounded border-gray-300 dark:border-gray-600"
                  />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('id')">
                  {{ t('admin.bookings.booking_id') }}
                  <ChevronUp v-if="sortField === 'id'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('user.name')">
                  {{ t('admin.bookings.customer') }}
                  <ChevronUp v-if="sortField === 'user.name'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('vehicle.make')">
                  {{ t('admin.bookings.vehicle') }}
                  <ChevronUp v-if="sortField === 'vehicle.make'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('start_date')">
                  {{ t('admin.bookings.dates') }}
                  <ChevronUp v-if="sortField === 'start_date'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('status')">
                  {{ t('admin.bookings.status') }}
                  <ChevronUp v-if="sortField === 'status'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer" @click="sortBy('total_amount')">
                  {{ t('admin.bookings.total_cost') }}
                  <ChevronUp v-if="sortField === 'total_amount'" class="w-4 h-4 inline ml-1" />
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.bookings.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="booking in paginatedBookings" :key="booking.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    v-model="selectedBookings"
                    :value="booking.id"
                    class="rounded border-gray-300 dark:border-gray-600"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  <div class="flex items-center">
                    <span>#{{ booking.id }}</span>
                    <div v-if="booking.dispute" class="ml-2">
                      <AlertTriangle class="w-4 h-4 text-red-500" :title="t('admin.bookings.has_dispute')" />
                    </div>
                    <div v-if="booking.refund" class="ml-2">
                      <CreditCard class="w-4 h-4 text-yellow-500" :title="t('admin.bookings.has_refund')" />
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <User class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ booking.user?.name || 'Unknown' }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ booking.user?.email || 'No email' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-12 h-8 bg-gray-100 dark:bg-gray-600 rounded-md flex items-center justify-center mr-3">
                      <Car class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ booking.vehicle?.make || 'Unknown' }} {{ booking.vehicle?.model || 'Unknown' }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ booking.vehicle?.year || 'N/A' }} • {{ booking.vehicle?.license_plate || 'N/A' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <div>{{ formatDate(booking.start_date) }}</div>
                  <div class="text-gray-500 dark:text-gray-400">{{ formatDate(booking.end_date) }}</div>
                  <div class="text-xs text-gray-400 dark:text-gray-500">
                    {{ Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24)) }} {{ t('admin.bookings.days') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="space-y-1">
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      booking.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      booking.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    ]">
                      {{ t(`admin.bookings.${booking.status}`) }}
                    </span>
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ t(`admin.bookings.payment_${booking.payment_status}`) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ formatCurrency(booking.total_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewBooking(booking)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      :title="t('admin.bookings.view')"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click="editBooking(booking)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      :title="t('admin.bookings.edit')"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      v-if="booking.status === 'pending'"
                      @click="confirmBooking(booking)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      :title="t('admin.bookings.confirm')"
                    >
                      <CheckCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="booking.status !== 'cancelled' && booking.status !== 'completed'"
                      @click="cancelBooking(booking)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      :title="t('admin.bookings.cancel')"
                    >
                      <XCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="booking.dispute && booking.dispute.status === 'open'"
                      @click="resolveDispute(booking)"
                      class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                      :title="t('admin.bookings.resolve_dispute')"
                    >
                      <Shield class="w-4 h-4" />
                    </button>
                    <button
                      v-if="booking.payment_status === 'paid' && booking.status === 'cancelled'"
                      @click="processRefund(booking)"
                      class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      :title="t('admin.bookings.process_refund')"
                    >
                      <CreditCard class="w-4 h-4" />
                    </button>
                    <button
                      @click="contactCustomer(booking)"
                      class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      :title="t('admin.bookings.contact')"
                    >
                      <MessageCircle class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('admin.bookings.showing') }} {{ filteredBookings.length }} {{ t('admin.bookings.of') }} {{ bookings.length }}</span>
            </div>

            <!-- Bulk Actions -->
            <div v-if="selectedBookings.length > 0" class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ selectedBookings.length }} {{ t('admin.bookings.selected') }}</span>
              <button
                @click="bulkConfirm"
                class="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                {{ t('admin.bookings.confirm') }}
              </button>
              <button
                @click="bulkCancel"
                class="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                {{ t('admin.bookings.cancel') }}
              </button>
            </div>

            <div class="flex items-center space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ t('admin.bookings.previous') }}
              </button>
              <span class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">{{ currentPage }} {{ t('admin.bookings.of') }} {{ totalPages }}</span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ t('admin.bookings.next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from '../../../services/i18n'
import { useNotificationStore } from '../../../stores/notifications'
import { api } from '../../../services/api'
import { 
  Calendar, CheckCircle, Clock, XCircle, DollarSign, Download, RefreshCw,
  Search, Eye, Edit, User, Car, MessageCircle, ChevronUp, AlertTriangle,
  Shield, CreditCard, FileText, TrendingUp
} from 'lucide-vue-next'

const { t } = useTranslation()
const router = useRouter()
const notificationStore = useNotificationStore()

// Types
interface Booking {
  id: number
  user_id: number
  vehicle_id: number
  vendor_id: number
  start_date: string
  end_date: string
  pickup_location: string
  return_location: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed'
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
    email: string
    phone?: string
  }
  vehicle?: {
    id: number
    make: string
    model: string
    year: number
    license_plate: string
    type: string
  }
  vendor?: {
    id: number
    company_name: string
    contact_email: string
  }
  dispute?: {
    id: number
    reason: string
    description: string
    status: 'open' | 'resolved' | 'rejected'
    created_at: string
  }
  refund?: {
    id: number
    amount: number
    reason: string
    status: 'pending' | 'approved' | 'rejected' | 'processed'
    created_at: string
  }
}

// State
const bookings = ref<Booking[]>([])
const selectedBookings = ref<number[]>([])
const selectAll = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const paymentStatusFilter = ref('')
const dateRangeFilter = ref('')
const disputeFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(25)
const loading = ref(false)
const sortField = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const pagination = ref({
  page: 1,
  limit: 25,
  total: 0,
  pages: 0
})

// Stats
const stats = ref({
  totalBookings: 0,
  confirmedBookings: 0,
  pendingBookings: 0,
  activeBookings: 0,
  completedBookings: 0,
  cancelledBookings: 0,
  disputedBookings: 0,
  totalRevenue: 0,
  pendingRefunds: 0,
  averageBookingValue: 0
})

// Computed properties
const filteredBookings = computed(() => {
  let filtered = [...bookings.value]

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    filtered = filtered.filter(booking => 
      booking.id.toString().includes(search) ||
      booking.user?.name.toLowerCase().includes(search) ||
      booking.user?.email.toLowerCase().includes(search) ||
      booking.vehicle?.make.toLowerCase().includes(search) ||
      booking.vehicle?.model.toLowerCase().includes(search) ||
      booking.vehicle?.license_plate.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (statusFilter.value) {
    filtered = filtered.filter(booking => booking.status === statusFilter.value)
  }

  // Payment status filter
  if (paymentStatusFilter.value) {
    filtered = filtered.filter(booking => booking.payment_status === paymentStatusFilter.value)
  }

  // Dispute filter
  if (disputeFilter.value) {
    if (disputeFilter.value === 'has_dispute') {
      filtered = filtered.filter(booking => booking.dispute)
    } else if (disputeFilter.value === 'no_dispute') {
      filtered = filtered.filter(booking => !booking.dispute)
    }
  }

  // Date range filter
  if (dateRangeFilter.value) {
    const now = new Date()
    filtered = filtered.filter(booking => {
      const bookingDate = new Date(booking.created_at)
      
      switch (dateRangeFilter.value) {
        case 'today':
          return bookingDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return bookingDate >= weekAgo
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return bookingDate >= monthAgo
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          return bookingDate >= yearAgo
        default:
          return true
      }
    })
  }

  // Sorting
  if (sortField.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortField.value as keyof Booking]
      const bValue = b[sortField.value as keyof Booking]
      
      if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBookings.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredBookings.value.length / itemsPerPage.value)
})

// Methods
const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedBookings.value = paginatedBookings.value.map(booking => booking.id)
  } else {
    selectedBookings.value = []
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  paymentStatusFilter.value = ''
  dateRangeFilter.value = ''
  disputeFilter.value = ''
  currentPage.value = 1
  loadBookings()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadBookings()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadBookings()
  }
}

// Load bookings from API
const loadBookings = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', itemsPerPage.value.toString())
    
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (paymentStatusFilter.value) params.append('payment_status', paymentStatusFilter.value)
    if (disputeFilter.value) params.append('has_dispute', disputeFilter.value === 'has_dispute' ? 'true' : 'false')
    
    const response = await api.get(`/admin/bookings?${params.toString()}`)
    
    if (response.data.success) {
      bookings.value = response.data.data.bookings || []
      pagination.value = response.data.data.pagination || pagination.value
      
      // Update stats
      updateStats()
    }
  } catch (error) {
    console.error('Failed to load bookings:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.bookings.error_title'),
      message: t('admin.bookings.load_error')
    })
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  stats.value = {
    totalBookings: bookings.value.length,
    confirmedBookings: bookings.value.filter(b => b.status === 'confirmed').length,
    pendingBookings: bookings.value.filter(b => b.status === 'pending').length,
    activeBookings: bookings.value.filter(b => b.status === 'active').length,
    completedBookings: bookings.value.filter(b => b.status === 'completed').length,
    cancelledBookings: bookings.value.filter(b => b.status === 'cancelled').length,
    disputedBookings: bookings.value.filter(b => b.dispute).length,
    totalRevenue: bookings.value
      .filter(b => b.status !== 'cancelled' && b.payment_status === 'paid')
      .reduce((sum, b) => sum + b.total_amount, 0),
    pendingRefunds: bookings.value.filter(b => b.refund?.status === 'pending').length,
    averageBookingValue: bookings.value.length > 0 
      ? bookings.value.reduce((sum, b) => sum + b.total_amount, 0) / bookings.value.length 
      : 0
  }
}

// Booking actions
const exportBookings = () => {
  // TODO: Implement export functionality
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.bookings.export'),
    message: t('admin.bookings.export_message')
  })
}

const refreshBookings = () => {
  loadBookings()
}

const viewBooking = (booking: Booking) => {
  router.push(`/admin/bookings/${booking.id}`)
}

const editBooking = (booking: Booking) => {
  // TODO: Implement edit booking modal
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.bookings.edit_booking'),
    message: t('admin.bookings.edit_booking_message')
  })
}

const confirmBooking = async (booking: Booking) => {
  try {
    const response = await api.post(`/bookings/${booking.id}/confirm`)
    
    if (response.data.success) {
      booking.status = 'confirmed'
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.bookings.success_title'),
        message: t('admin.bookings.booking_confirmed')
      })
    }
  } catch (error) {
    console.error('Failed to confirm booking:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.bookings.error_title'),
      message: t('admin.bookings.confirm_error')
    })
  }
}

const cancelBooking = async (booking: Booking) => {
  try {
    const response = await api.post(`/bookings/${booking.id}/cancel`)
    
    if (response.data.success) {
      booking.status = 'cancelled'
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.bookings.success_title'),
        message: t('admin.bookings.booking_cancelled')
      })
    }
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.bookings.error_title'),
      message: t('admin.bookings.cancel_error')
    })
  }
}

const processRefund = async (booking: Booking) => {
  try {
    const response = await api.post(`/admin/bookings/${booking.id}/refund`, {
      amount: booking.total_amount,
      reason: 'Admin processed refund'
    })
    
    if (response.data.success) {
      booking.payment_status = 'refunded'
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.bookings.success_title'),
        message: t('admin.bookings.refund_processed')
      })
    }
  } catch (error) {
    console.error('Failed to process refund:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.bookings.error_title'),
      message: t('admin.bookings.refund_error')
    })
  }
}

const resolveDispute = async (booking: Booking) => {
  try {
    const response = await api.put(`/admin/disputes/${booking.dispute?.id}/resolve`, {
      resolution: 'resolved',
      admin_notes: 'Dispute resolved by admin'
    })
    
    if (response.data.success) {
      if (booking.dispute) {
        booking.dispute.status = 'resolved'
      }
      updateStats()
      
      notificationStore.addNotification({
        type: 'success',
        title: t('admin.bookings.success_title'),
        message: t('admin.bookings.dispute_resolved')
      })
    }
  } catch (error) {
    console.error('Failed to resolve dispute:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.bookings.error_title'),
      message: t('admin.bookings.dispute_resolve_error')
    })
  }
}

const contactCustomer = (booking: Booking) => {
  // TODO: Implement contact customer functionality
  notificationStore.addNotification({
    type: 'info',
    title: t('admin.bookings.contact_customer'),
    message: t('admin.bookings.contact_customer_message', { 
      name: booking.user?.name, 
      email: booking.user?.email 
    })
  })
}

// Bulk actions
const bulkConfirm = async () => {
  if (!confirm(t('admin.bookings.bulk_confirm_confirm', { count: selectedBookings.value.length }))) return
  
  try {
    const promises = selectedBookings.value.map(bookingId => 
      api.post(`/bookings/${bookingId}/confirm`)
    )
    
    await Promise.all(promises)
    
    // Update local data
    selectedBookings.value.forEach(bookingId => {
      const booking = bookings.value.find(b => b.id === bookingId)
      if (booking) booking.status = 'confirmed'
    })
    
    selectedBookings.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.bookings.success_title'),
      message: t('admin.bookings.bulk_confirm_success')
    })
  } catch (error) {
    console.error('Failed to bulk confirm bookings:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.bookings.error_title'),
      message: t('admin.bookings.bulk_confirm_error')
    })
  }
}

const bulkCancel = async () => {
  if (!confirm(t('admin.bookings.bulk_cancel_confirm', { count: selectedBookings.value.length }))) return
  
  try {
    const promises = selectedBookings.value.map(bookingId => 
      api.post(`/bookings/${bookingId}/cancel`)
    )
    
    await Promise.all(promises)
    
    // Update local data
    selectedBookings.value.forEach(bookingId => {
      const booking = bookings.value.find(b => b.id === bookingId)
      if (booking) booking.status = 'cancelled'
    })
    
    selectedBookings.value = []
    selectAll.value = false
    updateStats()
    
    notificationStore.addNotification({
      type: 'success',
      title: t('admin.bookings.success_title'),
      message: t('admin.bookings.bulk_cancel_success')
    })
  } catch (error) {
    console.error('Failed to bulk cancel bookings:', error)
    notificationStore.addNotification({
      type: 'error',
      title: t('admin.bookings.error_title'),
      message: t('admin.bookings.bulk_cancel_error')
    })
  }
}

// Load data
onMounted(() => {
  loadBookings()
})
</script>
