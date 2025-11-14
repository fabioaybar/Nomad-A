import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { api } from '../services/api'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  recipientType?: 'user' | 'vendor' | 'admin'
  recipientId?: number
  read?: boolean
}

interface UserNotification {
  id: number
  recipient_id: number
  recipient_type: 'user' | 'vendor' | 'admin'
  type: 'booking' | 'payment' | 'review' | 'maintenance' | 'system' | 'promotion' | 'vendor' | 'admin'
  title: string
  message: string
  status: 'unread' | 'read'
  created_at: string
  data?: any
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const userNotifications = ref<UserNotification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()
  
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    }
    
    notifications.value.push(newNotification)
    
    setTimeout(() => {
      removeNotification(id)
    }, newNotification.duration)
  }
  
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Get the recipient type based on auth status
  const getRecipientType = () => {
    if (!authStore.isAuthenticated) return null
    if (authStore.user?.role === 'admin') return 'admin'
    if (authStore.user?.role === 'vendor') return 'vendor'
    return 'user'
  }

  // Fetch user-specific notifications
  const fetchUserNotifications = async () => {
    if (!authStore.isAuthenticated) return

    const recipientType = getRecipientType()
    if (!recipientType) return

    try {
      loading.value = true
      const response = await api.get(`/notifications?recipient_type=${recipientType}`)
      
      if (response.data.success) {
        userNotifications.value = response.data.data.notifications || []
        return response.data.data
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err)
      error.value = err.message
      loadMockNotifications()
    } finally {
      loading.value = false
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`)
      
      if (response.data.success) {
        const notification = userNotifications.value.find(n => n.id === notificationId)
        if (notification) {
          notification.status = 'read'
        }
      }
    } catch (err: any) {
      console.error('Error marking notification as read:', err)
      const notification = userNotifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.status = 'read'
      }
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const recipientType = getRecipientType()
    if (!recipientType) return

    try {
      const response = await api.put(`/notifications/read-all?recipient_type=${recipientType}`)
      
      if (response.data.success) {
        userNotifications.value.forEach(n => n.status = 'read')
      }
    } catch (err: any) {
      console.error('Error marking all as read:', err)
      userNotifications.value.forEach(n => n.status = 'read')
    }
  }

  // Load mock notifications for development
  const loadMockNotifications = () => {
    const recipientType = getRecipientType()
    const mockData: Record<string, UserNotification[]> = {
      user: [
        {
          id: 1,
          recipient_id: 1,
          recipient_type: 'user',
          type: 'booking',
          title: 'Reserva Confirmada',
          message: 'Tu reserva del Toyota Camry 2022 ha sido confirmada para Oct 15-17, 2024.',
          status: 'unread',
          created_at: new Date().toISOString(),
          data: { booking_id: 123 }
        }
      ],
      vendor: [
        {
          id: 1,
          recipient_id: 1,
          recipient_type: 'vendor',
          type: 'booking',
          title: 'Nueva Reserva',
          message: 'Has recibido una nueva reserva para tu vehículo Toyota Camry 2022.',
          status: 'unread',
          created_at: new Date().toISOString(),
          data: { booking_id: 123 }
        }
      ],
      admin: [
        {
          id: 1,
          recipient_id: 1,
          recipient_type: 'admin',
          type: 'system',
          title: 'Alerta del Sistema',
          message: 'Se ha detectado un alto volumen de tráfico en la plataforma.',
          status: 'unread',
          created_at: new Date().toISOString()
        }
      ]
    }

    userNotifications.value = mockData[recipientType || 'user'] || []
  }

  // Initialize notifications
  const initialize = () => {
    if (authStore.isAuthenticated) {
      fetchUserNotifications()
    }
  }
  
  return {
    // State
    notifications,
    userNotifications,
    loading,
    error,
    
    // Actions
    addNotification,
    removeNotification,
    fetchUserNotifications,
    markAsRead,
    markAllAsRead,
    initialize,
    
    // Computed
    recipientType: getRecipientType
  }
})