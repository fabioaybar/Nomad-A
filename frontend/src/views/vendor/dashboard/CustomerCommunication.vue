<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ t('vendor.communication.title') }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ t('vendor.communication.subtitle') }}</p>
      </div>

      <!-- Communication Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <!-- Active Conversations -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.communication.active_conversations') }}</h3>
            <div class="text-blue-500">
              <MessageCircle class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.activeConversations }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.communication.with_customers') }}</div>
        </div>

        <!-- Unread Messages -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.communication.unread_messages') }}</h3>
            <div class="text-yellow-500">
              <AlertCircle class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.unreadMessages }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.communication.awaiting_response') }}</div>
        </div>

        <!-- Response Time -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.communication.avg_response_time') }}</h3>
            <div class="text-green-500">
              <Clock class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.avgResponseTime }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.communication.minutes') }}</div>
        </div>

        <!-- Customer Satisfaction -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('vendor.communication.customer_satisfaction') }}</h3>
            <div class="text-purple-500">
              <Star class="w-5 h-5" />
            </div>
          </div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.customerSatisfaction }}%</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.communication.communication_rating') }}</div>
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
              :placeholder="t('vendor.communication.search_placeholder')"
              class="w-full sm:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <!-- Status Filter -->
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{{ t('vendor.communication.all_statuses') }}</option>
            <option value="active">{{ t('vendor.communication.active') }}</option>
            <option value="archived">{{ t('vendor.communication.archived') }}</option>
            <option value="help_requested">{{ t('vendor.communication.help_requested') }}</option>
          </select>

          <!-- Priority Filter -->
          <select
            v-model="filters.priority"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">{{ t('vendor.communication.all_priorities') }}</option>
            <option value="urgent">{{ t('vendor.communication.urgent') }}</option>
            <option value="high">{{ t('vendor.communication.high') }}</option>
            <option value="medium">{{ t('vendor.communication.medium') }}</option>
            <option value="low">{{ t('vendor.communication.low') }}</option>
          </select>
        </div>

        <div class="flex gap-2">
          <button @click="exportConversations" class="btn-secondary flex items-center">
            <Download class="w-4 h-4 mr-2" />
            {{ t('vendor.communication.export') }}
          </button>
          <button @click="refreshConversations" class="btn-secondary flex items-center">
            <RefreshCw class="w-4 h-4 mr-2" />
            {{ t('vendor.communication.refresh') }}
          </button>
        </div>
      </div>

      <!-- Conversations List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.communication.loading') }}</p>
        </div>

        <div v-else-if="filteredConversations.length === 0" class="p-8 text-center">
          <MessageCircle class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">{{ t('vendor.communication.no_conversations') }}</h3>
          <p class="text-gray-500 dark:text-gray-400">{{ t('vendor.communication.no_conversations_desc') }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.communication.customer') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.communication.conversation') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.communication.last_message') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.communication.status') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.communication.last_activity') }}
                </th>
                <th class="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('vendor.communication.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="conversation in pagedConversations" :key="conversation.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <User class="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ conversation.customer?.name || t('vendor.communication.unknown_customer') }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ conversation.customer?.email || '' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ conversation.title }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ conversation.message_count }} {{ t('vendor.communication.messages') }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 dark:text-white">{{ conversation.last_message || t('vendor.communication.no_messages') }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ conversation.last_message_sender }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <span :class="getStatusClass(conversation.status)">
                      {{ t(`vendor.communication.statuses.${conversation.status}`) }}
                    </span>
                    <div v-if="conversation.unread_count > 0" class="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {{ conversation.unread_count }}
                    </div>
                    <div v-if="conversation.help_requested" class="bg-yellow-500 text-white text-xs rounded-full px-2 py-1">
                      {{ t('vendor.communication.help') }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(conversation.updated_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-2">
                    <button
                      @click="openConversation(conversation)"
                      class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                      :title="t('vendor.communication.open_chat')"
                    >
                      <MessageCircle class="w-4 h-4" />
                    </button>
                    <button
                      @click="viewConversationDetails(conversation)"
                      class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                      :title="t('vendor.communication.view_details')"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click="archiveConversation(conversation)"
                      class="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                      :title="t('vendor.communication.archive')"
                    >
                      <Archive class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredConversations.length > 0" class="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('vendor.communication.showing') }} {{ startIndex + 1 }}–{{ Math.min(startIndex + pageSize, filteredConversations.length) }} {{ t('vendor.communication.of') }} {{ filteredConversations.length }}
          </div>
          <div class="flex items-center gap-2">
            <button
              :disabled="page === 1"
              @click="page--"
              class="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              {{ t('vendor.communication.previous') }}
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              {{ t('vendor.communication.page') }} {{ page }}
            </span>
            <button
              :disabled="page >= totalPages"
              @click="page++"
              class="px-3 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              {{ t('vendor.communication.next') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Conversation Detail Modal -->
      <div v-if="selectedConversation" class="fixed inset-0 z-50">
        <div class="absolute inset-0 bg-black/40" @click="selectedConversation = null"></div>
        <div class="relative max-w-4xl mx-auto mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ t('vendor.communication.conversation_details') }}</h3>
            <button @click="selectedConversation = null" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X class="w-6 h-6" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Customer Information -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.communication.customer_info') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.communication.customer') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedConversation.customer?.name || t('vendor.communication.unknown_customer') }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.communication.email') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedConversation.customer?.email || '-' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.communication.phone') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedConversation.customer?.phone || '-' }}</span>
                </div>
              </div>
            </div>

            <!-- Conversation Information -->
            <div class="space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.communication.conversation_info') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.communication.title') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedConversation.title }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.communication.status') }}:</span>
                  <span :class="getStatusClass(selectedConversation.status)">
                    {{ t(`vendor.communication.statuses.${selectedConversation.status}`) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.communication.messages') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ selectedConversation.message_count }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.communication.created') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedConversation.created_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('vendor.communication.last_activity') }}:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(selectedConversation.updated_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Recent Messages -->
            <div class="md:col-span-2 space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.communication.recent_messages') }}</h4>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div v-if="selectedConversation.messages?.length === 0" class="text-center text-gray-500 dark:text-gray-400">
                  {{ t('vendor.communication.no_messages') }}
                </div>
                <div v-else class="space-y-3">
                  <div
                    v-for="message in selectedConversation.messages"
                    :key="message.id"
                    :class="['flex', message.sender_type === 'user' ? 'justify-end' : 'justify-start']"
                  >
                    <div :class="['max-w-xs px-3 py-2 rounded-lg', message.sender_type === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200']">
                      <div class="text-sm">{{ message.text }}</div>
                      <div class="text-xs opacity-70 mt-1">{{ formatTime(message.timestamp) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="md:col-span-2 space-y-4">
              <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ t('vendor.communication.actions') }}</h4>
              <div class="flex flex-wrap gap-2">
                <button
                  @click="openConversation(selectedConversation)"
                  class="btn-primary text-sm"
                >
                  {{ t('vendor.communication.open_chat') }}
                </button>
                <button
                  @click="archiveConversation(selectedConversation)"
                  class="btn-secondary text-sm"
                >
                  {{ t('vendor.communication.archive') }}
                </button>
                <button
                  v-if="selectedConversation.help_requested"
                  @click="resolveHelpRequest(selectedConversation)"
                  class="btn-secondary text-sm"
                >
                  {{ t('vendor.communication.resolve_help') }}
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
import { useRouter } from 'vue-router'
import { 
  MessageCircle, 
  AlertCircle, 
  Clock, 
  Star, 
  Search, 
  Download, 
  RefreshCw,
  User, 
  Eye,
  Archive,
  X
} from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useNotificationStore } from '../../stores/notifications'
import { useTranslation } from '../../services/i18n'
import { api } from '../../services/api'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { t } = useTranslation()

// Types
interface Conversation {
  id: number
  user_id: number
  participant_id: number
  title: string
  help_requested: boolean
  last_message?: string
  last_message_sender?: string
  message_count: number
  unread_count: number
  status: 'active' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
  updated_at: string
  customer?: any
  messages?: Array<{
    id: number
    text: string
    sender_type: 'user' | 'vendor'
    timestamp: string
  }>
}

// State
const conversations = ref<Conversation[]>([])
const loading = ref(false)
const selectedConversation = ref<Conversation | null>(null)
const search = ref('')
const filters = ref({
  status: '',
  priority: ''
})
const page = ref(1)
const pageSize = 10

const stats = ref({
  activeConversations: 0,
  unreadMessages: 0,
  avgResponseTime: 0,
  customerSatisfaction: 0
})

// Computed
const filteredConversations = computed(() => {
  let filtered = conversations.value
  
  if (search.value) {
    const query = search.value.toLowerCase()
    filtered = filtered.filter(conversation => 
      conversation.title.toLowerCase().includes(query) ||
      conversation.customer?.name?.toLowerCase().includes(query) ||
      conversation.customer?.email?.toLowerCase().includes(query) ||
      conversation.last_message?.toLowerCase().includes(query)
    )
  }
  
  if (filters.value.status) {
    filtered = filtered.filter(conversation => conversation.status === filters.value.status)
  }
  
  if (filters.value.priority) {
    filtered = filtered.filter(conversation => conversation.priority === filters.value.priority)
  }
  
  return filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
})

const pagedConversations = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredConversations.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredConversations.value.length / pageSize))
const startIndex = computed(() => (page.value - 1) * pageSize)

// Methods
const loadConversations = async () => {
  try {
    loading.value = true
    
    const response = await api.get(`/vendors/${authStore.user?.id}/conversations`)
    
    if (response.data.success) {
      conversations.value = response.data.data.conversations || []
      
      // Calculate stats
      calculateStats()
    }
  } catch (error) {
    console.error('Error loading conversations:', error)
    conversations.value = []
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  stats.value = {
    activeConversations: conversations.value.filter(c => c.status === 'active').length,
    unreadMessages: conversations.value.reduce((sum, c) => sum + c.unread_count, 0),
    avgResponseTime: 15, // TODO: Calculate from actual data
    customerSatisfaction: 95 // TODO: Calculate from actual data
  }
}

const refreshConversations = () => {
  loadConversations()
}

const openConversation = (conversation: Conversation) => {
  router.push(`/chat?conversationId=${conversation.id}`)
}

const viewConversationDetails = (conversation: Conversation) => {
  selectedConversation.value = conversation
}

const archiveConversation = async (conversation: Conversation) => {
  try {
    const response = await api.post(`/conversations/${conversation.id}/archive`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.communication.success_title'),
        message: t('vendor.communication.archive_success')
      })
      
      // Update local status
      conversation.status = 'archived'
      selectedConversation.value = null
      calculateStats()
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.communication.error_title'),
      message: error.message || t('vendor.communication.archive_error')
    })
  }
}

const resolveHelpRequest = async (conversation: Conversation) => {
  try {
    const response = await api.post(`/conversations/${conversation.id}/resolve-help`)
    
    if (response.data.success) {
      notificationStore.addNotification({
        type: 'success',
        title: t('vendor.communication.success_title'),
        message: t('vendor.communication.resolve_success')
      })
      
      // Update local status
      conversation.help_requested = false
      selectedConversation.value = null
    } else {
      throw new Error(response.data.message)
    }
  } catch (error: any) {
    notificationStore.addNotification({
      type: 'error',
      title: t('vendor.communication.error_title'),
      message: error.message || t('vendor.communication.resolve_error')
    })
  }
}

const exportConversations = () => {
  // TODO: Implement conversations export
  notificationStore.addNotification({
    type: 'info',
    title: t('vendor.communication.export_title'),
    message: t('vendor.communication.export_message')
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString()
}

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    help_requested: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

// Lifecycle
onMounted(() => {
  loadConversations()
})
</script>

