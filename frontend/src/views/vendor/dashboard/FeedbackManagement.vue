<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Feedback</h2>
        <p class="text-gray-600 dark:text-gray-400">Review, reply to, and moderate feedback.</p>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div class="relative">
            <input v-model="search" type="text" placeholder="Search by customer or vehicle" class="w-full sm:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select v-model="filters.status" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="hidden">Hidden</option>
          </select>
          <select v-model="filters.rating" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="">Any rating</option>
            <option v-for="r in [5,4,3,2,1]" :key="r" :value="r">{{ r }}★</option>
          </select>
        </div>
      </div>

      <!-- Feedback list -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div v-for="f in filteredFeedback" :key="f.id" class="p-6 flex gap-4">
            <img :src="f.avatar || '/images/defaults/user.png'" alt="avatar" class="h-10 w-10 rounded-full object-cover" />
            <div class="flex-1">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ f.customer }}</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">{{ f.vehicle }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(f.date) }}</span>
                  <span class="px-2 py-0.5 text-xs rounded-full" :class="statusClass(f.status)">{{ f.status }}</span>
                </div>
              </div>
              <div class="mt-2 flex items-center gap-1">
                <span v-for="i in 5" :key="i" class="text-yellow-400">{{ i <= f.rating ? '★' : '☆' }}</span>
              </div>
              <p class="mt-2 text-gray-800 dark:text-gray-200">{{ f.comment }}</p>

              <!-- Reply -->
              <div class="mt-3" v-if="!f.reply">
                <div class="flex gap-2">
                  <input v-model="replyDrafts[f.id]" type="text" placeholder="Write a reply" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  <button @click="sendReply(f.id)" class="btn-primary">Reply</button>
                </div>
              </div>
              <div class="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700" v-else>
                <div class="text-sm text-gray-600 dark:text-gray-300">Reply</div>
                <div class="text-sm text-gray-900 dark:text-white">{{ f.reply }}</div>
              </div>

              <!-- Actions -->
              <div class="mt-3 flex gap-2">
                <button @click="approve(f)" class="px-3 py-1 text-sm rounded-md border border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/30">Approve</button>
                <button @click="hide(f)" class="px-3 py-1 text-sm rounded-md border border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/30">Hide</button>
                <button @click="remove(f.id)" class="px-3 py-1 text-sm rounded-md border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30">Delete</button>
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
import { Search } from 'lucide-vue-next'
import { useTranslation } from '../../../services/i18n'
import api from '../../../services/api'

type FeedbackStatus = 'approved' | 'pending' | 'hidden'
interface Feedback {
  id: number
  customer: string
  avatar?: string
  vehicle: string
  rating: number
  comment: string
  date: string
  status: FeedbackStatus
  reply?: string
}

const { t } = useTranslation()
const loading = ref(false)
const feedback = ref<Feedback[]>([])

// Load feedback from API
const loadFeedback = async () => {
  try {
    loading.value = true
    console.log('💬 Loading vendor feedback from API...')
    
    // Get reviews for this vendor
    const response = await api.get('/vendors/reviews', {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    console.log('💬 Feedback API Response:', response.data)
    
    if (response.data.success) {
      const reviews = response.data.data || []
      
      // Transform reviews to feedback format
      feedback.value = reviews.map((review: any) => ({
        id: review.id,
        customer: review.user?.name || 'Unknown Customer',
        vehicle: review.vehicle ? `${review.vehicle.make} ${review.vehicle.model}` : 'Unknown Vehicle',
        rating: review.rating,
        comment: review.comment || '',
        date: review.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        status: review.status || 'approved',
        reply: review.vendor_reply || ''
      }))
      
      console.log('💬 Feedback loaded:', feedback.value.length, 'reviews')
    }
  } catch (error) {
    console.error('Error loading feedback:', error)
    feedback.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFeedback()
})

const replyDrafts = ref<Record<number, string>>({})
const search = ref('')
const filters = ref<{ status: '' | FeedbackStatus; rating: '' | number }>({ status: '', rating: '' })

const filteredFeedback = computed(() => {
  return feedback.value.filter(f => {
    if (filters.value.status && f.status !== filters.value.status) return false
    if (filters.value.rating && f.rating !== filters.value.rating) return false
    if (search.value) {
      const q = search.value.toLowerCase()
      if (!(`${f.customer} ${f.vehicle} ${f.comment}`.toLowerCase().includes(q))) return false
    }
    return true
  })
})

const formatDate = (d: string) => new Date(d).toLocaleDateString()
const statusClass = (s: FeedbackStatus) => s === 'approved'
  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  : s === 'pending'
    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'

const approve = (f: Feedback) => { f.status = 'approved' }
const hide = (f: Feedback) => { f.status = 'hidden' }
const remove = (id: number) => { feedback.value = feedback.value.filter(f => f.id !== id) }
const sendReply = (id: number) => {
  const v = replyDrafts.value[id]?.trim()
  if (!v) return
  const f = feedback.value.find(x => x.id === id)
  if (f) f.reply = v
  replyDrafts.value[id] = ''
}
</script>


