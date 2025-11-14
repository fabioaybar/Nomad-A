<template>
  <div>
    <!-- Modal Backdrop -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="close"></div>

    <!-- Modal Content -->
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <!-- Modal Header -->
          <div class="mb-4">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">{{ t('vendor.quickAdd.title') }}</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ t('vendor.quickAdd.description') }}</p>
          </div>

          <!-- Quick Add Options -->
          <div class="grid grid-cols-1 gap-4">
            <button
              v-for="option in quickAddOptions"
              :key="option.type"
              @click="handleQuickAdd(option.type)"
              class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div class="flex items-center">
                <component :is="option.icon" class="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ option.title }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ option.description }}</div>
                </div>
              </div>
              <ChevronRight class="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <!-- Close Button -->
          <div class="mt-5 sm:mt-6">
            <button
              type="button"
              class="w-full rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              @click="close"
            >
              {{ t('common.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Car, CalendarClock, Wrench, Users } from 'lucide-vue-next'
import { ChevronRight } from 'lucide-vue-next'
import { useTranslation } from '../../../../services/i18n'
import { useRouter } from 'vue-router'

const { t } = useTranslation()
const router = useRouter()

const props = defineProps<{
  onClose?: () => void
}>()

const quickAddOptions = [
  {
    type: 'vehicle',
    title: t('vendor.quickAdd.vehicle.title'),
    description: t('vendor.quickAdd.vehicle.description'),
    icon: Car,
    route: '/vendor/vehicles/new'
  },
  {
    type: 'booking',
    title: t('vendor.quickAdd.booking.title'),
    description: t('vendor.quickAdd.booking.description'),
    icon: CalendarClock,
    route: '/vendor/bookings/new'
  },
  {
    type: 'maintenance',
    title: t('vendor.quickAdd.maintenance.title'),
    description: t('vendor.quickAdd.maintenance.description'),
    icon: Wrench,
    route: '/vendor/maintenance/new'
  },
  {
    type: 'driver',
    title: t('vendor.quickAdd.driver.title'),
    description: t('vendor.quickAdd.driver.description'),
    icon: Users,
    route: '/vendor/drivers/new'
  }
]

const handleQuickAdd = (type: string) => {
  const option = quickAddOptions.find(opt => opt.type === type)
  if (option) {
    router.push(option.route)
  }
  close()
}

const close = () => {
  if (props.onClose) {
    props.onClose()
  }
}

defineEmits(['close'])
</script>