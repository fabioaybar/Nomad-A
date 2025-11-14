<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {{ t('notifications.title') }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              {{ t('notifications.subtitle') }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="notificationStore.unreadCount > 0"
              @click="markAllAsRead"
              class="btn-secondary flex items-center space-x-2"
              :disabled="notificationStore.loading"
            >
              <CheckCircle class="w-4 h-4" />
              <span>{{ t('notifications.mark_all_read') }}</span>
            </button>
            <button
              @click="refreshNotifications"
              class="btn-secondary flex items-center space-x-2"
              :disabled="notificationStore.loading"
            >
              <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': notificationStore.loading }" />
              <span>{{ t('notifications.refresh') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Bell class="w-8 h-8 text-blue-500" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('notifications.total') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ notificationStore.stats?.total || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <AlertCircle class="w-8 h-8 text-red-500" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('notifications.unread') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ notificationStore.unreadCount }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Calendar class="w-8 h-8 text-green-500" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('notifications.bookings') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ notificationStore.stats?.by_type?.booking || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CreditCard class="w-8 h-8 text-purple-500" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ t('notifications.payments') }}</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ notificationStore.stats?.by_type?.payment || 0 }}
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

      <!-- Notifications List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div v-if="notificationStore.loading" class="p-8 text-center">
          <div class="loading-spinner w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">{{ t('notifications.loading') }}</p>
        </div>

        <div v-else-if="filteredNotifications.length === 0" class="p-8 text-center">
          <Bell class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {{ t('notifications.no_notifications') }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            {{ activeFilter === 'all' ? t('notifications.no_notifications_desc') : t('notifications.no_notifications_filtered') }}
          </p>
        </div>

        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            :class="{ 'bg-blue-50 dark:bg-blue-900/20': notification.status === 'unread' }"
          >
            <div class="flex items-start space-x-4">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full flex items-center justify-center"
                     :class="getNotificationIconClass(notification.type)">
                  <component :is="getNotificationIcon(notification.type)" class="w-5 h-5" />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ notification.title }}
                    </h3>
                    <span v-if="notification.status === 'unread'" 
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {{ t('notifications.unread') }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatDate(notification.created_at) }}
                    </span>
                    <div class="flex items-center space-x-1">
                      <button
                        v-if="notification.status === 'unread'"
                        @click="markAsRead(notification.id)"
                        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        :title="t('notifications.mark_read')"
                      >
                        <CheckCircle class="w-4 h-4" />
                      </button>
                      <button
                        @click="deleteNotification(notification.id)"
                        class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        :title="t('notifications.delete')"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {{ notification.message }}
                </p>
                
                <!-- Action Button -->
                <div v-if="getNotificationAction(notification)" class="mt-3">
                  <button
                    @click="handleNotificationAction(notification)"
                    class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    {{ getNotificationAction(notification)?.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreNotifications" class="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <button
            @click="loadMoreNotifications"
            class="btn-secondary"
            :disabled="notificationStore.loading"
          >
            {{ t('notifications.load_more') }}
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
  Bell, 
  AlertCircle, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  RefreshCw, 
  Trash2,
  Car,
  Star,
  Wrench,
  Megaphone,
  Settings
} from 'lucide-vue-next'
import { useUserNotificationStore } from '../../stores/userNotifications'
import { useTranslation } from '../../services/i18n'
import type { UserNotification } from '../../stores/userNotifications'

const router = useRouter()
const notificationStore = useUserNotificationStore()
const { t } = useTranslation()

// State
const activeFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(10)

// Filters
const filters = computed(() => [
  {
    key: 'all',
    label: t('notifications.all'),
    icon: Bell,
    count: notificationStore.notifications.length
  },
  {
    key: 'unread',
    label: t('notifications.unread'),
    icon: AlertCircle,
    count: notificationStore.unreadCount
  },
  {
    key: 'booking',
    label: t('notifications.bookings'),
    icon: Calendar,
    count: notificationStore.notificationsByType.booking.length
  },
  {
    key: 'payment',
    label: t('notifications.payments'),
    icon: CreditCard,
    count: notificationStore.notificationsByType.payment.length
  },
  {
    key: 'promotion',
    label: t('notifications.promotions'),
    icon: Megaphone,
    count: notificationStore.notificationsByType.promotion.length
  }
])

// Filtered notifications
const filteredNotifications = computed(() => {
  let filtered = notificationStore.notifications

  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => n.status === 'unread')
  } else if (activeFilter.value !== 'all') {
    filtered = filtered.filter(n => n.type === activeFilter.value)
  }

  return filtered
})

// Check if there are more notifications to load
const hasMoreNotifications = computed(() => {
  return notificationStore.notifications.length >= currentPage.value * pageSize.value
})

// Methods
const refreshNotifications = async () => {
  await Promise.all([
    notificationStore.fetchNotifications({
      page: 1,
      limit: pageSize.value,
      sort: 'newest'
    }),
    notificationStore.fetchNotificationStats()
  ])
  currentPage.value = 1
}

const loadMoreNotifications = async () => {
  currentPage.value++
  await notificationStore.fetchNotifications({
    page: currentPage.value,
    limit: pageSize.value,
    sort: 'newest'
  })
}

const markAsRead = async (notificationId: number) => {
  await notificationStore.markAsRead(notificationId)
}

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

const deleteNotification = async (notificationId: number) => {
  if (confirm(t('notifications.delete_confirm'))) {
    await notificationStore.deleteNotification(notificationId)
  }
}

const getNotificationIcon = (type: string) => {
  const icons = {
    booking: Calendar,
    payment: CreditCard,
    review: Star,
    maintenance: Wrench,
    system: Settings,
    promotion: Megaphone
  }
  return icons[type as keyof typeof icons] || Bell
}

const getNotificationIconClass = (type: string) => {
  const classes = {
    booking: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    payment: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    review: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
    maintenance: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    system: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300',
    promotion: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
  }
  return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
}

const getNotificationAction = (notification: UserNotification) => {
  const actions = {
    booking: {
      label: t('notifications.view_booking'),
      action: () => router.push(`/bookings/${notification.data?.booking_id}`)
    },
    payment: {
      label: t('notifications.view_payment'),
      action: () => router.push('/payments')
    },
    promotion: {
      label: t('notifications.use_code'),
      action: () => router.push('/vehicles')
    }
  }
  return actions[notification.type as keyof typeof actions]
}

const handleNotificationAction = (notification: UserNotification) => {
  const action = getNotificationAction(notification)
  if (action) {
    action.action()
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return t('notifications.just_now')
  } else if (diffInHours < 24) {
    return t('notifications.hours_ago', { hours: diffInHours })
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) {
      return t('notifications.yesterday')
    } else if (diffInDays < 7) {
      return t('notifications.days_ago', { days: diffInDays })
    } else {
      return date.toLocaleDateString()
    }
  }
}

// Lifecycle
onMounted(async () => {
  await refreshNotifications()
})
</script>

