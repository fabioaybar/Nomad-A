<!-- User Notifications Panel Component -->
<template>
  <div class="relative">
    <!-- Notification Bell Icon with Badge -->
    <button
      @click="togglePanel"
      class="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :class="{ 'bg-gray-100 dark:bg-gray-700': isOpen }"
    >
      <Bell :class="[hasUnread ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400']" />
      <span
        v-if="hasUnread"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Notifications Panel -->
    <TransitionRoot appear :show="isOpen" as="template">
      <div
        class="absolute right-0 mt-2 w-96 max-h-[80vh] overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
      >
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ t(`notifications.${recipientType}.title`) }}
            </h3>
            <button
              v-if="hasUnread"
              @click="markAllAsRead"
              class="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {{ t(`notifications.${recipientType}.mark_all_read`) }}
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="overflow-y-auto max-h-[calc(80vh-65px)]">
          <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>

          <div v-else-if="notifications.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">
            {{ t(`notifications.${recipientType}.empty`) }}
          </div>

          <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              :class="{ 'bg-blue-50 dark:bg-blue-900/20': notification.status === 'unread' }"
              @click="handleNotificationClick(notification)"
            >
              <div class="flex gap-3">
                <div class="flex-shrink-0 mt-1">
                  <component
                    :is="getNotificationIcon(notification.type)"
                    class="w-5 h-5"
                    :class="getNotificationIconColor(notification.type)"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p
                    class="text-sm font-medium text-gray-900 dark:text-gray-100"
                    :class="{ 'font-semibold': notification.status === 'unread' }"
                  >
                    {{ notification.title }}
                  </p>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {{ notification.message }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(notification.created_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import {
  Bell,
  BookOpen,
  CreditCard,
  Star,
  Wrench,
  AlertCircle,
  Gift,
  Building,
  Settings
} from 'lucide-vue-next'
import { useNotificationStore } from '../../stores/notifications'
import { useAuthStore } from '../../stores/auth'
import { useTranslation } from '../../services/i18n'
import { useRouter } from 'vue-router'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const { t } = useTranslation()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()
const router = useRouter()

const isOpen = ref(false)

// Computed properties
const recipientType = computed(() => notificationStore.recipientType() || 'user')
const notifications = computed(() => notificationStore.userNotifications)
const hasUnread = computed(() => notifications.value.some(n => n.status === 'unread'))
const unreadCount = computed(() => notifications.value.filter(n => n.status === 'unread').length)
const loading = computed(() => notificationStore.loading)

// Methods
const togglePanel = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    notificationStore.fetchUserNotifications()
  }
}

const formatDate = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

const markAllAsRead = async () => {
  await notificationStore.markAllAsRead()
}

const handleNotificationClick = async (notification: any) => {
  if (notification.status === 'unread') {
    await notificationStore.markAsRead(notification.id)
  }

  // Handle navigation based on notification type and data
  switch (notification.type) {
    case 'booking':
      if (notification.data?.booking_id) {
        router.push(`/bookings/${notification.data.booking_id}`)
      }
      break
    case 'payment':
      router.push('/user/payments')
      break
    case 'review':
      if (notification.data?.review_id) {
        router.push(`/reviews/${notification.data.review_id}`)
      }
      break
    // Add more cases as needed
  }
}

const getNotificationIcon = (type: string) => {
  const icons = {
    booking: BookOpen,
    payment: CreditCard,
    review: Star,
    maintenance: Wrench,
    system: AlertCircle,
    promotion: Gift,
    vendor: Building,
    admin: Settings
  }
  return icons[type as keyof typeof icons] || AlertCircle
}

const getNotificationIconColor = (type: string) => {
  const colors = {
    booking: 'text-blue-500',
    payment: 'text-green-500',
    review: 'text-yellow-500',
    maintenance: 'text-orange-500',
    system: 'text-red-500',
    promotion: 'text-purple-500',
    vendor: 'text-indigo-500',
    admin: 'text-gray-500'
  }
  return colors[type as keyof typeof colors] || 'text-gray-500'
}

// Initialize notifications when component is mounted
notificationStore.initialize()
</script>

<style scoped>
/* These styles are now handled by Tailwind classes in the template */
</style>