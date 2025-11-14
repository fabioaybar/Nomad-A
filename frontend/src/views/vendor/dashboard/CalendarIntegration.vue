<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ t('vendor.calendar.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-400">{{ t('vendor.calendar.subtitle') }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="prevMonth" class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">{{ t('vendor.calendar.prev') }}</button>
          <div class="px-3 py-1 text-gray-700 dark:text-gray-200">{{ monthLabel }}</div>
          <button @click="nextMonth" class="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">{{ t('vendor.calendar.next') }}</button>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
        <div class="grid grid-cols-7 gap-2 text-sm">
          <div class="text-gray-500 dark:text-gray-400 text-center" v-for="d in weekDays" :key="d">{{ t(`vendor.calendar.days.${d.toLowerCase()}`) }}</div>
          <div v-for="cell in cells" :key="cell.key" class="min-h-[90px] rounded-lg border border-gray-100 dark:border-gray-700 p-2 relative">
            <div :class="['text-xs', cell.inMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500']">{{ cell.date.getDate() }}</div>
            <div class="space-y-1 mt-1">
              <div v-for="e in cell.events" :key="e.id" :class="['px-2 py-0.5 rounded text-xs truncate', e.type === 'booking' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300']">
                {{ e.title }}
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
import { api } from '../../../services/api'
import { useAuthStore } from '../../../stores/auth'
import { useTranslation } from '../../../services/i18n'

const authStore = useAuthStore()
const { t } = useTranslation()

interface CalEvent { id: number; date: string; type: 'booking' | 'maintenance'; title: string }

const current = ref(new Date())
// Start week on Monday (1) instead of Sunday (0)
const weekDays = ['mon','tue','wed','thu','fri','sat','sun']
const events = ref<CalEvent[]>([])
const loading = ref(false)

// Load calendar events from API
const loadEvents = async () => {
  try {
    loading.value = true
    console.log('📅 Loading calendar events from API...')
    
    // Load calendar events from the new endpoint
    const response = await api.get('/vendors/calendar', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (response.data.success) {
      const calendarEvents = response.data.data || []
      console.log('📅 Calendar events loaded:', calendarEvents.length)
      
      // Format events for the calendar component
      events.value = calendarEvents.map((event: any) => ({
        id: event.id,
        date: event.date,
        type: event.type,
        title: event.title
      }))
      
      console.log('📅 Formatted events:', events.value.length)
    } else {
      console.error('Error loading calendar events:', response.data.message)
      events.value = []
    }
  } catch (error) {
    console.error('Error loading calendar events:', error)
    events.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEvents()
})

const monthLabel = computed(() => {
  const monthNames = [
    t('vendor.calendar.months.january'),
    t('vendor.calendar.months.february'),
    t('vendor.calendar.months.march'),
    t('vendor.calendar.months.april'),
    t('vendor.calendar.months.may'),
    t('vendor.calendar.months.june'),
    t('vendor.calendar.months.july'),
    t('vendor.calendar.months.august'),
    t('vendor.calendar.months.september'),
    t('vendor.calendar.months.october'),
    t('vendor.calendar.months.november'),
    t('vendor.calendar.months.december')
  ]
  return `${monthNames[current.value.getMonth()]} de ${current.value.getFullYear()}`
})

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth()+1, 0)

const cells = computed(() => {
  const start = startOfMonth(current.value)
  const end = endOfMonth(current.value)
  // Adjust for Monday start (getDay() returns 0 for Sunday, 1 for Monday, etc.)
  // We want Monday to be 0, so we adjust: (getDay() + 6) % 7
  const startDay = (start.getDay() + 6) % 7
  const totalDays = end.getDate()
  const prevMonthDays = new Date(current.value.getFullYear(), current.value.getMonth(), 0).getDate()

  const out: { key: string; date: Date; inMonth: boolean; events: CalEvent[] }[] = []
  // Leading cells (previous month)
  for (let i = startDay - 1; i >= 0; i--) {
    const date = new Date(current.value.getFullYear(), current.value.getMonth()-1, prevMonthDays - i)
    out.push({ key: 'p'+date.toDateString(), date, inMonth: false, events: [] })
  }
  // Month cells
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(current.value.getFullYear(), current.value.getMonth(), d)
    const key = 'm'+date.toDateString()
    const iso = date.toISOString().slice(0,10)
    const evts = events.value.filter(e => e.date === iso)
    out.push({ key, date, inMonth: true, events: evts })
  }
  // Trailing cells to complete weeks (up to 42 cells)
  while (out.length % 7 !== 0) {
    const last = out[out.length-1].date
    const next = new Date(last)
    next.setDate(last.getDate()+1)
    out.push({ key: 'n'+next.toDateString(), date: next, inMonth: false, events: [] })
  }
  return out
})

const prevMonth = () => {
  current.value = new Date(current.value.getFullYear(), current.value.getMonth()-1, 1)
}
const nextMonth = () => {
  current.value = new Date(current.value.getFullYear(), current.value.getMonth()+1, 1)
}
</script>


