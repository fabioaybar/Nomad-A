<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('admin.support.title') }}</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">{{ t('admin.support.subtitle') }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="createTicket"
              class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus class="w-5 h-5 mr-2" />
              {{ t('admin.support.create_ticket') }}
            </button>
            <button
              @click="refreshTickets"
              class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw class="w-5 h-5 mr-2" />
              {{ t('admin.support.refresh') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Ticket class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.support.total_tickets') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalTickets }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <AlertCircle class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.support.open_tickets') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.openTickets }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.support.in_progress') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.inProgress }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.support.resolved') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.resolved }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <TrendingUp class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ t('admin.support.avg_response_time') }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ stats.avgResponseTime }}h</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.support.search') }}</label>
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('admin.support.search_placeholder')"
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.support.status') }}</label>
              <select
                v-model="statusFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.support.all_statuses') }}</option>
                <option value="open">{{ t('admin.support.open') }}</option>
                <option value="assigned">{{ t('admin.support.assigned') }}</option>
                <option value="in_progress">{{ t('admin.support.in_progress') }}</option>
                <option value="resolved">{{ t('admin.support.resolved') }}</option>
                <option value="closed">{{ t('admin.support.closed') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.support.priority') }}</label>
              <select
                v-model="priorityFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.support.all_priorities') }}</option>
                <option value="urgent">{{ t('admin.support.urgent') }}</option>
                <option value="high">{{ t('admin.support.high') }}</option>
                <option value="medium">{{ t('admin.support.medium') }}</option>
                <option value="low">{{ t('admin.support.low') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.support.category') }}</label>
              <select
                v-model="categoryFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.support.all_categories') }}</option>
                <option value="technical">{{ t('admin.support.technical') }}</option>
                <option value="billing">{{ t('admin.support.billing') }}</option>
                <option value="vehicle">{{ t('admin.support.vehicle') }}</option>
                <option value="account">{{ t('admin.support.account') }}</option>
                <option value="general">{{ t('admin.support.general') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('admin.support.assigned_to') }}</label>
              <select
                v-model="assignedFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">{{ t('admin.support.all_agents') }}</option>
                <option value="unassigned">{{ t('admin.support.unassigned') }}</option>
                <option value="admin1">{{ t('admin.support.admin1') }}</option>
                <option value="admin2">{{ t('admin.support.admin2') }}</option>
                <option value="support1">{{ t('admin.support.support1') }}</option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <button
                @click="clearFilters"
                class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                {{ t('admin.support.clear_filters') }}
              </button>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('admin.support.showing') }} {{ filteredTickets.length }} {{ t('admin.support.of') }} {{ tickets.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tickets Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ t('admin.support.tickets_list') }}</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.support.ticket_id') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.support.customer') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.support.subject') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.support.category') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.support.priority') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.support.status') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.support.assigned_to') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.support.created') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {{ t('admin.support.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="ticket in paginatedTickets" :key="ticket.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  #{{ ticket.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <User class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ ticket.customerName }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ ticket.customerEmail }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ ticket.subject }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ ticket.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ t(`admin.support.${ticket.category}`) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    ticket.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                    ticket.priority === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  ]">
                    {{ t(`admin.support.${ticket.priority}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    ticket.status === 'open' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                    ticket.status === 'assigned' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                    ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                    ticket.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                  ]">
                    {{ t(`admin.support.${ticket.status}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ ticket.assignedTo || t('admin.support.unassigned') }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(ticket.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewTicket(ticket)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      :title="t('admin.support.view')"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click="assignTicket(ticket)"
                      class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      :title="t('admin.support.assign')"
                    >
                      <UserPlus class="w-4 h-4" />
                    </button>
                    <button
                      @click="updateStatus(ticket)"
                      class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      :title="t('admin.support.update_status')"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click="chatWithCustomer(ticket)"
                      class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                      :title="t('admin.support.chat')"
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
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('admin.support.showing') }} {{ startIndex + 1 }} {{ t('admin.support.to') }} {{ endIndex }} {{ t('admin.support.of') }} {{ filteredTickets.length }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ t('admin.support.previous') }}
              </button>
              <span class="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">{{ currentPage }} {{ t('admin.support.of') }} {{ totalPages }}</span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ t('admin.support.next') }}
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
import { useTranslation } from '../../../services/i18n'
import { 
  Ticket, AlertCircle, Clock, CheckCircle, TrendingUp, Plus, RefreshCw,
  Search, Eye, UserPlus, Edit, MessageCircle, User
} from 'lucide-vue-next'

const { t } = useTranslation()

// Types
interface SupportTicket {
  id: string
  customerName: string
  customerEmail: string
  subject: string
  description: string
  category: 'technical' | 'billing' | 'vehicle' | 'account' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed'
  assignedTo?: string
  createdAt: Date
  resolvedAt?: Date
  messages: number
}

// State
const tickets = ref<SupportTicket[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const categoryFilter = ref('')
const assignedFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Mock data
const mockTickets: SupportTicket[] = [
  {
    id: 'TK001',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    subject: 'Vehicle not starting',
    description: 'The car I rented yesterday won\'t start this morning. I\'m stuck at the airport.',
    category: 'vehicle',
    priority: 'urgent',
    status: 'open',
    createdAt: new Date('2025-01-08'),
    messages: 1
  },
  {
    id: 'TK002',
    customerName: 'Maria Garcia',
    customerEmail: 'maria.garcia@email.com',
    subject: 'Billing discrepancy',
    description: 'I was charged twice for the same rental period. Please review my account.',
    category: 'billing',
    priority: 'high',
    status: 'assigned',
    assignedTo: 'admin1',
    createdAt: new Date('2025-01-07'),
    messages: 3
  },
  {
    id: 'TK003',
    customerName: 'David Johnson',
    customerEmail: 'david.johnson@email.com',
    subject: 'App login issues',
    description: 'I can\'t log into my account. Getting error message "Invalid credentials".',
    category: 'technical',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'support1',
    createdAt: new Date('2025-01-06'),
    messages: 5
  },
  {
    id: 'TK004',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    subject: 'Account verification',
    description: 'My account verification is taking too long. I need to rent a car urgently.',
    category: 'account',
    priority: 'high',
    status: 'resolved',
    assignedTo: 'admin2',
    createdAt: new Date('2025-01-05'),
    resolvedAt: new Date('2025-01-06'),
    messages: 4
  },
  {
    id: 'TK005',
    customerName: 'Michael Brown',
    customerEmail: 'michael.brown@email.com',
    subject: 'General inquiry',
    description: 'What are your operating hours during holidays?',
    category: 'general',
    priority: 'low',
    status: 'closed',
    assignedTo: 'support1',
    createdAt: new Date('2025-01-04'),
    resolvedAt: new Date('2025-01-05'),
    messages: 2
  }
]

// Stats
const stats = computed(() => ({
  totalTickets: tickets.value.length,
  openTickets: tickets.value.filter(t => t.status === 'open').length,
  inProgress: tickets.value.filter(t => t.status === 'in_progress').length,
  resolved: tickets.value.filter(t => t.status === 'resolved').length,
  avgResponseTime: 2.5 // Mock average response time in hours
}))

// Filtered tickets
const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    const matchesSearch = !searchQuery.value || 
      ticket.customerName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !statusFilter.value || ticket.status === statusFilter.value
    const matchesPriority = !priorityFilter.value || ticket.priority === priorityFilter.value
    const matchesCategory = !categoryFilter.value || ticket.category === categoryFilter.value
    const matchesAssigned = !assignedFilter.value || 
      (assignedFilter.value === 'unassigned' ? !ticket.assignedTo : ticket.assignedTo === assignedFilter.value)
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssigned
  })
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredTickets.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredTickets.value.length))
const paginatedTickets = computed(() => {
  return filteredTickets.value.slice(startIndex.value, endIndex.value)
})

// Methods
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  priorityFilter.value = ''
  categoryFilter.value = ''
  assignedFilter.value = ''
  currentPage.value = 1
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const createTicket = () => {
  alert('Create Ticket functionality - Coming soon!')
}

const refreshTickets = () => {
  alert('Tickets refreshed!')
}

const viewTicket = (ticket: SupportTicket) => {
  alert(`View Ticket: ${ticket.id}`)
}

const assignTicket = (ticket: SupportTicket) => {
  const agent = prompt(`Assign ticket ${ticket.id} to which agent?`)
  if (agent) {
    ticket.assignedTo = agent
    ticket.status = 'assigned'
    alert(`Ticket ${ticket.id} assigned to ${agent}`)
  }
}

const updateStatus = (ticket: SupportTicket) => {
  const statuses = ['open', 'assigned', 'in_progress', 'resolved', 'closed']
  const currentIndex = statuses.indexOf(ticket.status)
  const nextStatus = statuses[(currentIndex + 1) % statuses.length]
  
  if (confirm(`Update ticket ${ticket.id} status to ${nextStatus}?`)) {
    ticket.status = nextStatus as any
    if (nextStatus === 'resolved' || nextStatus === 'closed') {
      ticket.resolvedAt = new Date()
    }
    alert(`Ticket ${ticket.id} status updated to ${nextStatus}`)
  }
}

const chatWithCustomer = (ticket: SupportTicket) => {
  alert(`Start chat with ${ticket.customerName} (${ticket.customerEmail})`)
}

// Load data on mount
onMounted(() => {
  tickets.value = mockTickets
})
</script>
