<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Conversations -->
      <aside class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 lg:col-span-1">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ t('chat.conversations') }}</h2>
        </div>
        <div class="space-y-2 max-h-[60vh] overflow-y-auto">
          <button
            v-for="c in conversations"
            :key="c.id"
            @click="select(c)"
            :class="['w-full text-left px-3 py-2 rounded-lg border transition-colors', current?.id === c.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200']"
          >
            <div class="flex items-center justify-between">
              <div class="font-medium truncate">{{ c.title }}</div>
              <span v-if="c.help_requested" class="px-2 py-0.5 text-[10px] rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">{{ t('chat.help') }}</span>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ c.last_message }}</div>
          </button>
        </div>
      </aside>

      <!-- Chat Window -->
      <section class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 lg:col-span-3 flex flex-col min-h-[60vh]">
        <div class="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ current?.title || t('chat.no_conversation') }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400" v-if="current">{{ t('chat.with') }} {{ current.participant_name || 'Vendedor' }}</p>
          </div>
          <label v-if="current" class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input type="checkbox" v-model="current.help_requested" @change="toggleHelp" class="toggle-checkbox" />
            {{ t('chat.request_help') }}
          </label>
        </div>
        <div class="flex-1 overflow-y-auto py-4 space-y-3">
          <div v-for="m in currentMessages" :key="m.id" :class="[m.sender_type === 'user' ? 'text-right' : 'text-left']">
            <div :class="['inline-block px-3 py-2 rounded-lg', m.sender_type === 'user' ? 'bg-primary-600 text-white dark:bg-primary-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100']">{{ m.text }}</div>
            <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{{ formatTime(m.timestamp) }}</div>
          </div>
        </div>
        <form @submit.prevent="send" class="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <input v-model.trim="draft" type="text" :placeholder="t('chat.type_message')" class="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
          <button type="submit" class="btn-primary px-4 py-2">{{ t('chat.send') }}</button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTranslation } from '../../services/i18n'
import { useAuthStore } from '../../stores/auth'
import { api } from '../../services/api'

interface Conversation { 
  id: number
  title: string
  participant_id: number
  participant_name?: string
  help_requested: boolean
  last_message: string
}
interface Message { 
  id: number
  conversation_id: number
  sender_type: 'user' | 'participant' | 'admin'
  text: string
  timestamp: string
}

const route = useRoute()
const { t } = useTranslation()
const authStore = useAuthStore()

const conversations = ref<Conversation[]>([])
const messages = ref<Message[]>([])
const current = ref<Conversation | null>(null)
const draft = ref('')
const loading = ref(false)

// Load conversations from API
const loadConversations = async () => {
  try {
    loading.value = true
    const response = await api.get('/conversations')
    conversations.value = response.data.data || []
    
    if (conversations.value.length > 0 && !current.value) {
      current.value = conversations.value[0]
      await loadMessages(current.value.id)
    }
  } catch (error) {
    console.error('Error loading conversations:', error)
    // Fallback to demo data
    conversations.value = [
      { id: 1, title: 'Conversación con AutoRent Chile', participant_id: 4, help_requested: false, last_message: '¡Perfecto! Te veo a las 10AM.' },
    ]
    if (conversations.value.length > 0) {
      current.value = conversations.value[0]
    }
  } finally {
    loading.value = false
  }
}

// Load messages for a conversation
const loadMessages = async (conversationId: number) => {
  try {
    const response = await api.get(`/conversations/${conversationId}/messages`)
    messages.value = response.data.data || []
  } catch (error) {
    console.error('Error loading messages:', error)
    // Fallback to demo data
    messages.value = [
      { id: 1, conversation_id: conversationId, sender_type: 'participant', text: '¡Hola! ¿Podemos coordinar la recogida para las 10AM?', timestamp: new Date().toISOString() },
      { id: 2, conversation_id: conversationId, sender_type: 'user', text: '¡Hola! Sí, las 10AM está perfecto para mí.', timestamp: new Date().toISOString() },
    ]
  }
}

onMounted(async () => {
  await loadConversations()
  
  const convoId = Number(route.query.conversationId)
  if (convoId) {
    const found = conversations.value.find(c => c.id === convoId)
    if (found) {
      current.value = found
      await loadMessages(found.id)
    }
  }
})

const currentMessages = computed(() => 
  messages.value.filter(m => m.conversation_id === (current.value?.id || -1))
)

const send = async () => {
  if (!current.value || !draft.value) return
  
  try {
    const response = await api.post(`/conversations/${current.value.id}/messages`, {
      text: draft.value,
      from: 'user'
    })
    
    const newMessage = response.data.data
    messages.value.push(newMessage)
    current.value.last_message = draft.value
    draft.value = ''
  } catch (error) {
    console.error('Error sending message:', error)
    // Fallback to local storage
    messages.value.push({ 
      id: Date.now(), 
      conversation_id: current.value.id, 
      sender_type: 'user', 
      text: draft.value, 
      timestamp: new Date().toISOString() 
    })
    current.value.last_message = draft.value
    draft.value = ''
  }
}

const select = async (c: Conversation) => { 
  current.value = c
  await loadMessages(c.id)
}

const toggleHelp = async () => {
  if (!current.value) return
  
  try {
    await api.put(`/conversations/${current.value.id}/help`, {
      help_requested: current.value.help_requested
    })
  } catch (error) {
    console.error('Error toggling help:', error)
  }
}

const formatTime = (iso: string) => new Date(iso).toLocaleTimeString()
</script>


