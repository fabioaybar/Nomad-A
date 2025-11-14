<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                {{ $t('admin.financial.title') }}
              </h1>
              <p class="mt-2 text-gray-600">
                {{ $t('admin.financial.subtitle') }}
              </p>
            </div>
            <div class="flex space-x-3">
              <button
                @click="exportFinancialReport"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download class="w-4 h-4 mr-2" />
                {{ $t('admin.financial.export_report') }}
              </button>
              <button
                @click="openTaxSettings"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Settings class="w-4 h-4 mr-2" />
                {{ $t('admin.financial.tax_settings') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Financial Overview Cards -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <DollarSign class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ $t('admin.financial.total_revenue') }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ formatCurrency(stats.totalRevenue || 0) }}
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
                    {{ $t('admin.financial.monthly_revenue') }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ formatCurrency(stats.monthlyRevenue || 0) }}
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
                <CreditCard class="h-6 w-6 text-purple-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ $t('admin.financial.total_transactions') }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ stats.totalTransactions || 0 }}
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
                <Percent class="h-6 w-6 text-orange-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    {{ $t('admin.financial.platform_commission') }}
                  </dt>
                  <dd class="text-lg font-medium text-gray-900">
                    {{ formatCurrency(stats.platformCommission || 0) }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ $t('admin.financial.revenue_trend') }}
            </h3>
            <div class="flex space-x-2">
              <select
                v-model="chartPeriod"
                @change="loadRevenueData"
                class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">{{ $t('admin.financial.last_7_days') }}</option>
                <option value="30">{{ $t('admin.financial.last_30_days') }}</option>
                <option value="90">{{ $t('admin.financial.last_90_days') }}</option>
                <option value="365">{{ $t('admin.financial.last_year') }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="text-gray-500">{{ $t('admin.financial.loading') }}</div>
          </div>
          <div v-else-if="revenueData.length === 0" class="flex items-center justify-center h-64">
            <div class="text-gray-500">{{ $t('admin.financial.no_data') }}</div>
          </div>
          <div v-else class="h-64">
            <!-- Chart placeholder - would integrate with Chart.js or similar -->
            <div class="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <BarChart3 class="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p class="text-gray-500">{{ $t('admin.financial.chart_placeholder') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Tabs -->
      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              <component :is="tab.icon" class="w-4 h-4 mr-2 inline" />
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Transactions Tab -->
          <div v-if="activeTab === 'transactions'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ $t('admin.financial.transactions') }}
              </h3>
              <div class="flex space-x-3">
                <select
                  v-model="transactionFilters.status"
                  @change="loadTransactions"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{{ $t('admin.financial.all_statuses') }}</option>
                  <option value="completed">{{ $t('admin.financial.completed') }}</option>
                  <option value="pending">{{ $t('admin.financial.pending') }}</option>
                  <option value="failed">{{ $t('admin.financial.failed') }}</option>
                  <option value="refunded">{{ $t('admin.financial.refunded') }}</option>
                </select>
                <input
                  v-model="transactionFilters.search"
                  @input="loadTransactions"
                  type="text"
                  :placeholder="$t('admin.financial.search_transactions')"
                  class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('admin.financial.transaction_id') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('admin.financial.user') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('admin.financial.amount') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('admin.financial.status') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('admin.financial.payment_method') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('admin.financial.date') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ $t('admin.financial.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loadingTransactions" class="animate-pulse">
                    <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                      {{ $t('admin.financial.loading') }}
                    </td>
                  </tr>
                  <tr v-else-if="transactions.length === 0" class="text-center">
                    <td colspan="7" class="px-6 py-4 text-gray-500">
                      {{ $t('admin.financial.no_transactions') }}
                    </td>
                  </tr>
                  <tr v-else v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{{ transaction.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ transaction.user?.name || 'Unknown User' }}</div>
                      <div class="text-sm text-gray-500">{{ transaction.user?.email || 'No email' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatCurrency(transaction.amount) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        :class="getStatusClass(transaction.status)"
                        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ $t(`admin.financial.statuses.${transaction.status}`) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ transaction.payment_method || 'N/A' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(transaction.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div class="flex space-x-2">
                        <button
                          @click="viewTransactionDetails(transaction)"
                          class="text-blue-600 hover:text-blue-900"
                          :title="$t('admin.financial.view_details')"
                        >
                          <Eye class="h-4 w-4" />
                        </button>
                        <button
                          v-if="transaction.status === 'pending'"
                          @click="processTransaction(transaction.id)"
                          class="text-green-600 hover:text-green-900"
                          :title="$t('admin.financial.process')"
                        >
                          <CheckCircle class="h-4 w-4" />
                        </button>
                        <button
                          v-if="transaction.status === 'completed'"
                          @click="refundTransaction(transaction.id)"
                          class="text-red-600 hover:text-red-900"
                          :title="$t('admin.financial.refund')"
                        >
                          <RotateCcw class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="flex items-center justify-between mt-6">
              <div class="text-sm text-gray-700">
                {{ $t('admin.financial.showing') }} {{ transactionPagination.page * transactionPagination.limit - transactionPagination.limit + 1 }} - 
                {{ Math.min(transactionPagination.page * transactionPagination.limit, transactionPagination.total) }} 
                {{ $t('admin.financial.of') }} {{ transactionPagination.total }}
              </div>
              <div class="flex space-x-2">
                <button
                  @click="previousTransactionPage"
                  :disabled="transactionPagination.page <= 1"
                  class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ $t('admin.financial.previous') }}
                </button>
                <button
                  @click="nextTransactionPage"
                  :disabled="transactionPagination.page >= transactionPagination.pages"
                  class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ $t('admin.financial.next') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Tax Management Tab -->
          <div v-if="activeTab === 'tax'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ $t('admin.financial.tax_management') }}
              </h3>
              <button
                @click="openTaxSettings"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {{ $t('admin.financial.configure_tax') }}
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.financial.tax_settings') }}
                </h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      {{ $t('admin.financial.tax_rate') }}
                    </label>
                    <div class="mt-1 text-2xl font-bold text-gray-900">
                      {{ taxSettings.rate || 0 }}%
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      {{ $t('admin.financial.tax_type') }}
                    </label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ taxSettings.type || 'Not configured' }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="text-lg font-medium text-gray-900 mb-4">
                  {{ $t('admin.financial.tax_summary') }}
                </h4>
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">{{ $t('admin.financial.total_tax_collected') }}</span>
                    <span class="text-sm font-medium text-gray-900">{{ formatCurrency(taxStats.totalCollected || 0) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">{{ $t('admin.financial.this_month') }}</span>
                    <span class="text-sm font-medium text-gray-900">{{ formatCurrency(taxStats.monthlyCollected || 0) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-600">{{ $t('admin.financial.pending_payments') }}</span>
                    <span class="text-sm font-medium text-gray-900">{{ formatCurrency(taxStats.pendingPayments || 0) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reports Tab -->
          <div v-if="activeTab === 'reports'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">
                {{ $t('admin.financial.financial_reports') }}
              </h3>
              <button
                @click="generateReport"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ $t('admin.financial.generate_report') }}
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="report in availableReports"
                :key="report.id"
                class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div class="flex items-center justify-between mb-4">
                  <component :is="report.icon" class="h-8 w-8 text-blue-600" />
                  <span class="text-xs text-gray-500">{{ report.lastGenerated }}</span>
                </div>
                <h4 class="text-lg font-medium text-gray-900 mb-2">{{ report.name }}</h4>
                <p class="text-sm text-gray-600 mb-4">{{ report.description }}</p>
                <div class="flex space-x-2">
                  <button
                    @click="downloadReport(report.id)"
                    class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    {{ $t('admin.financial.download') }}
                  </button>
                  <button
                    @click="viewReport(report.id)"
                    class="px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
                  >
                    {{ $t('admin.financial.view') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <div v-if="selectedTransaction" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ $t('admin.financial.transaction_details') }}
            </h3>
            <button @click="selectedTransaction = null" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('admin.financial.transaction_id') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">#{{ selectedTransaction.id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('admin.financial.amount') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">{{ formatCurrency(selectedTransaction.amount) }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('admin.financial.status') }}
                </label>
                <span
                  :class="getStatusClass(selectedTransaction.status)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1"
                >
                  {{ $t(`admin.financial.statuses.${selectedTransaction.status}`) }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  {{ $t('admin.financial.payment_method') }}
                </label>
                <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.payment_method || 'N/A' }}</p>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ $t('admin.financial.user') }}
              </label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedTransaction.user?.name || 'Unknown User' }}</p>
              <p class="text-sm text-gray-500">{{ selectedTransaction.user?.email || 'No email' }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">
                {{ $t('admin.financial.date') }}
              </label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedTransaction.created_at) }}</p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="selectedTransaction = null"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ $t('admin.financial.close') }}
            </button>
            <button
              v-if="selectedTransaction.status === 'pending'"
              @click="processTransaction(selectedTransaction.id)"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {{ $t('admin.financial.process') }}
            </button>
            <button
              v-if="selectedTransaction.status === 'completed'"
              @click="refundTransaction(selectedTransaction.id)"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {{ $t('admin.financial.refund') }}
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
  DollarSign,
  TrendingUp,
  CreditCard,
  Percent,
  Download,
  Settings,
  BarChart3,
  Eye,
  CheckCircle,
  RotateCcw,
  X,
  Receipt,
  FileText,
  PieChart
} from 'lucide-vue-next'

const router = useRouter()
const notificationStore = useNotificationStore()

// Types
interface Transaction {
  id: number
  user_id: number
  booking_id: number
  amount: number
  status: string
  payment_method: string
  created_at: string
  user?: {
    id: number
    name: string
    email: string
  }
}

interface TaxSettings {
  rate: number
  type: string
}

interface TaxStats {
  totalCollected: number
  monthlyCollected: number
  pendingPayments: number
}

interface Report {
  id: string
  name: string
  description: string
  icon: any
  lastGenerated: string
}

// State
const loading = ref(false)
const loadingTransactions = ref(false)
const activeTab = ref('transactions')
const chartPeriod = ref('30')
const selectedTransaction = ref<Transaction | null>(null)

// Stats
const stats = ref({
  totalRevenue: 0,
  monthlyRevenue: 0,
  totalTransactions: 0,
  platformCommission: 0
})

// Revenue data
const revenueData = ref([])

// Transaction data
const transactions = ref<Transaction[]>([])
const transactionPagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  pages: 0
})

const transactionFilters = ref({
  status: '',
  search: ''
})

// Tax data
const taxSettings = ref<TaxSettings>({
  rate: 0,
  type: ''
})

const taxStats = ref<TaxStats>({
  totalCollected: 0,
  monthlyCollected: 0,
  pendingPayments: 0
})

// Reports
const availableReports = ref<Report[]>([
  {
    id: 'revenue',
    name: 'Revenue Report',
    description: 'Monthly revenue breakdown and trends',
    icon: Receipt,
    lastGenerated: '2 days ago'
  },
  {
    id: 'transactions',
    name: 'Transaction Report',
    description: 'Detailed transaction analysis',
    icon: FileText,
    lastGenerated: '1 week ago'
  },
  {
    id: 'tax',
    name: 'Tax Report',
    description: 'Tax collection and compliance report',
    icon: PieChart,
    lastGenerated: '3 days ago'
  }
])

// Tabs
const tabs = [
  { id: 'transactions', name: 'Transactions', icon: CreditCard },
  { id: 'tax', name: 'Tax Management', icon: Percent },
  { id: 'reports', name: 'Reports', icon: FileText }
]

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const loadFinancialData = async () => {
  try {
    loading.value = true
    
    const response = await api.get('/admin/analytics/revenue')
    
    if (response.data.success) {
      const data = response.data.data
      stats.value = {
        totalRevenue: data.total_revenue || 0,
        monthlyRevenue: data.monthly_revenue || 0,
        totalTransactions: data.total_transactions || 0,
        platformCommission: data.platform_commission || 0
      }
    }
  } catch (error) {
    console.error('Error loading financial data:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to load financial data'
    })
  } finally {
    loading.value = false
  }
}

const loadRevenueData = async () => {
  try {
    const response = await api.get(`/admin/analytics/revenue?period=${chartPeriod.value}`)
    
    if (response.data.success) {
      revenueData.value = response.data.data.chart_data || []
    }
  } catch (error) {
    console.error('Error loading revenue data:', error)
  }
}

const loadTransactions = async () => {
  try {
    loadingTransactions.value = true
    
    const params = new URLSearchParams({
      page: transactionPagination.value.page.toString(),
      limit: transactionPagination.value.limit.toString()
    })

    if (transactionFilters.value.status) params.append('status', transactionFilters.value.status)
    if (transactionFilters.value.search) params.append('search', transactionFilters.value.search)

    const response = await api.get(`/admin/payments?${params}`)
    
    if (response.data.success) {
      transactions.value = response.data.data.payments || []
      transactionPagination.value = response.data.data.pagination || transactionPagination.value
    }
  } catch (error) {
    console.error('Error loading transactions:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to load transactions'
    })
  } finally {
    loadingTransactions.value = false
  }
}

const loadTaxData = async () => {
  try {
    const response = await api.get('/admin/tax/settings')
    
    if (response.data.success) {
      taxSettings.value = response.data.data.settings
      taxStats.value = response.data.data.stats
    }
  } catch (error) {
    console.error('Error loading tax data:', error)
  }
}

const previousTransactionPage = () => {
  if (transactionPagination.value.page > 1) {
    transactionPagination.value.page--
    loadTransactions()
  }
}

const nextTransactionPage = () => {
  if (transactionPagination.value.page < transactionPagination.value.pages) {
    transactionPagination.value.page++
    loadTransactions()
  }
}

const viewTransactionDetails = (transaction: Transaction) => {
  selectedTransaction.value = transaction
}

const processTransaction = async (transactionId: number) => {
  try {
    const response = await api.put(`/admin/payments/${transactionId}/process`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Transaction processed successfully'
      })
      loadTransactions()
      if (selectedTransaction.value?.id === transactionId) {
        selectedTransaction.value = null
      }
    }
  } catch (error) {
    console.error('Error processing transaction:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to process transaction'
    })
  }
}

const refundTransaction = async (transactionId: number) => {
  if (!confirm('Are you sure you want to refund this transaction?')) return
  
  try {
    const response = await api.put(`/admin/payments/${transactionId}/refund`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Transaction refunded successfully'
      })
      loadTransactions()
      if (selectedTransaction.value?.id === transactionId) {
        selectedTransaction.value = null
      }
    }
  } catch (error) {
    console.error('Error refunding transaction:', error)
    notificationStore.addNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to refund transaction'
    })
  }
}

const exportFinancialReport = () => {
  notificationStore.addNotification({
    type: 'info',
    title: 'Export',
    message: 'Financial report export will be implemented soon'
  })
}

const openTaxSettings = () => {
  notificationStore.addNotification({
    type: 'info',
    title: 'Tax Settings',
    message: 'Tax settings configuration will be implemented soon'
  })
}

const generateReport = () => {
  notificationStore.addNotification({
    type: 'info',
    title: 'Generate Report',
    message: 'Report generation will be implemented soon'
  })
}

const downloadReport = (reportId: string) => {
  notificationStore.addNotification({
    type: 'info',
    title: 'Download Report',
    message: `Downloading ${reportId} report...`
  })
}

const viewReport = (reportId: string) => {
  notificationStore.addNotification({
    type: 'info',
    title: 'View Report',
    message: `Viewing ${reportId} report...`
  })
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadFinancialData(),
    loadRevenueData(),
    loadTransactions(),
    loadTaxData()
  ])
})
</script>
