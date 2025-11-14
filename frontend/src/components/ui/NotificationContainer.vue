<template>
  <div class="fixed top-4 right-4 z-50 space-y-4">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-4"
    >
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        class="max-w-sm w-full bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <CheckCircle v-if="notification.type === 'success'" class="w-5 h-5 text-green-500" />
              <XCircle v-else-if="notification.type === 'error'" class="w-5 h-5 text-red-500" />
              <AlertCircle v-else-if="notification.type === 'warning'" class="w-5 h-5 text-yellow-500" />
              <Info v-else class="w-5 h-5 text-blue-500" />
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ notification.title }}
              </p>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {{ notification.message }}
              </p>
            </div>
            <button
              @click="notificationStore.removeNotification(notification.id)"
              class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors dark:text-gray-300 dark:hover:text-gray-200"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
        <!-- Progress bar -->
        <div class="h-1 bg-gray-100 dark:bg-gray-700">
          <div
            class="h-full transition-all duration-100 ease-linear"
            :class="{
              'bg-green-500': notification.type === 'success',
              'bg-red-500': notification.type === 'error',
              'bg-yellow-500': notification.type === 'warning',
              'bg-blue-500': notification.type === 'info',
            }"
            :style="{ width: '0%' }"
            ref="progressBar"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-vue-next'
import { useNotificationStore } from '../../stores/notifications'

const notificationStore = useNotificationStore()
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>