<template>
  <div class="relative">
    <!-- Notification Bell -->
    <button
      @click="toggleDropdown"
      class="relative p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 transition-colors"
      :class="{ 'text-primary-600 dark:text-primary-400': isOpen }"
    >
      <Bell class="w-6 h-6" />
      
      <!-- Unread Badge -->
      <span
        v-if="notificationStore.unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
      >
        {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
      >
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('notifications.title') }}
            </h3>
            <div class="flex items-center space-x-2">
              <button
                v-if="notificationStore.unreadCount > 0"
                @click="markAllAsRead"
                class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                :disabled="notificationStore.loading"
              >
                {{ t('notifications.mark_all_read') }}
              </button>
              <button
                @click="refreshNotifications"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                :disabled="notificationStore.loading"
              >
                <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': notificationStore.loading }" />
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notificationStore.loading" class="p-4 text-center">
            <div class="loading-spinner w-6 h-6 border-2 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-2"></div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('notifications.loading') }}</p>
          </div>

          <div v-else-if="recentNotifications.length === 0" class="p-4 text-center">
            <Bell class="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('notifications.no_notifications') }}</p>
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="notification in recentNotifications"
              :key="notification.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': notification.status === 'unread' }"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex items-start space-x-3">
                <!-- Icon -->
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center"
                       :class="getNotificationIconClass(notification.type)">
                    <component :is="getNotificationIcon(notification.type)" class="w-4 h-4" />
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {{ notification.title }}
                    </h4>
                    <div class="flex items-center space-x-2">
                      <span v-if="notification.status === 'unread'" 
                            class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatTime(notification.created_at) }}
                      </span>
                    </div>
                  </div>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {{ notification.message }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="viewAllNotifications"
            class="w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {{ t('notifications.view_all') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      @click="closeDropdown"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Bell, 
  RefreshCw,
  Calendar,
  CreditCard,
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
const isOpen = ref(false)

// Computed
const recentNotifications = computed(() => {
  return notificationStore.notifications.slice(0, 5) // Show only 5 most recent
})

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    refreshNotifications()
  }
}

const closeDropdown = () => {
  isOpen.value = false
}

const refreshNotifications = async () => {
  await Promise.all([
    notificationStore.fetchNotifications({
      page: 1,
      limit: 5,
      sort: 'newest'
    }),
    notificationStore.fetchNotificationStats()
  ])
}

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

const viewAllNotifications = () => {
  closeDropdown()
  router.push('/notifications')
}

const handleNotificationClick = async (notification: UserNotification) => {
  // Mark as read if unread
  if (notification.status === 'unread') {
    await notificationStore.markAsRead(notification.id)
  }

  // Handle action based on notification type
  const actions = {
    booking: () => router.push(`/bookings/${notification.data?.booking_id}`),
    payment: () => router.push('/payments'),
    promotion: () => router.push('/vehicles'),
    review: () => router.push('/reviews'),
    maintenance: () => router.push('/maintenance'),
    system: () => router.push('/settings')
  }

  const action = actions[notification.type as keyof typeof actions]
  if (action) {
    action()
  }

  closeDropdown()
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

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return t('notifications.just_now')
  } else if (diffInMinutes < 60) {
    return t('notifications.minutes_ago', { minutes: diffInMinutes })
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return t('notifications.hours_ago', { hours })
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return t('notifications.days_ago', { days })
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.notification-dropdown')) {
    closeDropdown()
  }
}

// Lifecycle
onMounted(() => {
  // Initialize notifications
  notificationStore.initialize()
  
  // Set up click outside listener
  document.addEventListener('click', handleClickOutside)
  
  // Refresh notifications periodically
  const interval = setInterval(refreshNotifications, 30000) // Every 30 seconds
  
  // Cleanup
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    clearInterval(interval)
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

