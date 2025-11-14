import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'
import { useAuthStore } from './auth'

export interface UserNotification {
  id: number
  user_id: number
  type: 'booking' | 'payment' | 'review' | 'maintenance' | 'system' | 'promotion'
  title: string
  message: string
  data?: any
  status: 'unread' | 'read'
  created_at: string
  updated_at: string
}

export interface NotificationStats {
  total: number
  unread: number
  by_type: {
    booking: number
    payment: number
    review: number
    maintenance: number
    system: number
    promotion: number
  }
}

export const useUserNotificationStore = defineStore('userNotifications', () => {
  const notifications = ref<UserNotification[]>([])
  const stats = ref<NotificationStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const authStore = useAuthStore()
  
  // Computed properties
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => n.status === 'unread')
  )
  
  const unreadCount = computed(() => unreadNotifications.value.length)
  
  const notificationsByType = computed(() => {
    const grouped: Record<string, UserNotification[]> = {
      booking: [],
      payment: [],
      review: [],
      maintenance: [],
      system: [],
      promotion: []
    }
    
    notifications.value.forEach(notification => {
      if (grouped[notification.type]) {
        grouped[notification.type].push(notification)
      }
    })
    
    return grouped
  })
  
  // Fetch notifications from API
  const fetchNotifications = async (params?: {
    page?: number
    limit?: number
    type?: string
    status?: 'unread' | 'read'
    sort?: 'newest' | 'oldest'
  }) => {
    if (!authStore.isAuthenticated) return
    
    try {
      loading.value = true
      error.value = null
      
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.set('page', params.page.toString())
      if (params?.limit) queryParams.set('limit', params.limit.toString())
      if (params?.type) queryParams.set('type', params.type)
      if (params?.status) queryParams.set('status', params.status)
      if (params?.sort) queryParams.set('sort', params.sort)
      
      const response = await api.get(`/notifications?${queryParams.toString()}`)
      
      if (response.data.success) {
        notifications.value = response.data.data.notifications || []
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Failed to fetch notifications')
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err)
      error.value = err.message || 'Failed to fetch notifications'
      
      // Fallback to mock data for development
      if (err.status === 401) throw err
      loadMockNotifications()
    } finally {
      loading.value = false
    }
  }
  
  // Fetch notification statistics
  const fetchNotificationStats = async () => {
    if (!authStore.isAuthenticated) return
    
    try {
      const response = await api.get('/notifications/stats')
      
      if (response.data.success) {
        stats.value = response.data.data.stats
        return response.data.data.stats
      } else {
        throw new Error(response.data.message || 'Failed to fetch notification stats')
      }
    } catch (err: any) {
      console.error('Error fetching notification stats:', err)
      
      // Fallback to mock stats
      if (err.status === 401) throw err
      loadMockStats()
    }
  }
  
  // Mark notification as read
  const markAsRead = async (notificationId: number) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`)
      
      if (response.data.success) {
        const notification = notifications.value.find(n => n.id === notificationId)
        if (notification) {
          notification.status = 'read'
        }
        return response.data.data.notification
      } else {
        throw new Error(response.data.message || 'Failed to mark notification as read')
      }
    } catch (err: any) {
      console.error('Error marking notification as read:', err)
      
      // Fallback to local update
      if (err.status === 401) throw err
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.status = 'read'
      }
    }
  }
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await api.put('/notifications/read-all')
      
      if (response.data.success) {
        notifications.value.forEach(notification => {
          notification.status = 'read'
        })
        return true
      } else {
        throw new Error(response.data.message || 'Failed to mark all notifications as read')
      }
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err)
      
      // Fallback to local update
      if (err.status === 401) throw err
      notifications.value.forEach(notification => {
        notification.status = 'read'
      })
    }
  }
  
  // Delete notification
  const deleteNotification = async (notificationId: number) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`)
      
      if (response.data.success) {
        const index = notifications.value.findIndex(n => n.id === notificationId)
        if (index > -1) {
          notifications.value.splice(index, 1)
        }
        return true
      } else {
        throw new Error(response.data.message || 'Failed to delete notification')
      }
    } catch (err: any) {
      console.error('Error deleting notification:', err)
      
      // Fallback to local update
      if (err.status === 401) throw err
      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index > -1) {
        notifications.value.splice(index, 1)
      }
    }
  }
  
  // Create notification (for testing/admin purposes)
  const createNotification = async (notificationData: {
    user_id: number
    type: 'booking' | 'payment' | 'review' | 'maintenance' | 'system' | 'promotion'
    title: string
    message: string
    data?: any
  }) => {
    try {
      const response = await api.post('/notifications', notificationData)
      
      if (response.data.success) {
        const newNotification = response.data.data.notification
        notifications.value.unshift(newNotification)
        return newNotification
      } else {
        throw new Error(response.data.message || 'Failed to create notification')
      }
    } catch (err: any) {
      console.error('Error creating notification:', err)
      throw err
    }
  }
  
  // Mock data for development - now user-specific
  const loadMockNotifications = () => {
    const userId = authStore.user?.id || 0
    
    // Different mock notifications based on user ID
    const userSpecificNotifications: UserNotification[] = (() => {
      switch(userId) {
        case 1:
          return [
            {
              id: 1,
              user_id: userId,
              type: 'booking' as const,
              title: 'Reserva Confirmada',
              message: 'Tu reserva del BMW X5 2023 ha sido confirmada para Nov 1-3, 2024.',
              data: { booking_id: 124 },
              status: 'unread',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 2,
              user_id: userId,
              type: 'payment' as const,
              title: 'Pago Exitoso',
              message: 'Tu pago de $180.000 CLP ha sido procesado exitosamente.',
              data: { amount: 180000, currency: 'CLP' },
              status: 'unread',
              created_at: new Date(Date.now() - 1800000).toISOString(),
              updated_at: new Date(Date.now() - 1800000).toISOString()
            }
          ]
        case 2:
          return [
            {
              id: 3,
              user_id: userId,
              type: 'review' as const,
              title: 'Nueva Reseña',
              message: 'Has recibido una nueva reseña de 5 estrellas.',
              data: { review_id: 45 },
              status: 'unread',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 4,
              user_id: userId,
              type: 'promotion' as const,
              title: 'Oferta Especial',
              message: 'Obtén un 15% de descuento en tu próxima reserva con el código PROMO15.',
              data: { code: 'PROMO15' },
              status: 'unread',
              created_at: new Date(Date.now() - 3600000).toISOString(),
              updated_at: new Date(Date.now() - 3600000).toISOString()
            }
          ]
        case 3:
          return [
            {
              id: 5,
              user_id: userId,
              type: 'maintenance' as const,
              title: 'Recordatorio de Mantenimiento',
              message: 'Tu vehículo necesita mantenimiento programado esta semana.',
              data: { vehicle_id: 78 },
              status: 'unread',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        default:
          return [
            {
              id: 6,
              user_id: userId,
              type: 'system' as const,
              title: 'Bienvenido a NomadA',
              message: '¡Gracias por unirte a NomadA! Comienza a explorar vehículos ahora.',
              data: {},
              status: 'unread',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
      }
    })()

    notifications.value = userSpecificNotifications
  }
  
  const loadMockStats = () => {
    const userId = authStore.user?.id || 0
    
    const userStats: Record<number, NotificationStats> = {
      1: {
        total: 2,
        unread: 2,
        by_type: {
          booking: 1,
          payment: 1,
          review: 0,
          maintenance: 0,
          system: 0,
          promotion: 0
        }
      },
      2: {
        total: 2,
        unread: 2,
        by_type: {
          booking: 0,
          payment: 0,
          review: 1,
          maintenance: 0,
          system: 0,
          promotion: 1
        }
      },
      3: {
        total: 1,
        unread: 1,
        by_type: {
          booking: 0,
          payment: 0,
          review: 0,
          maintenance: 1,
          system: 0,
          promotion: 0
        }
      }
    }
    
    stats.value = userStats[userId] || {
      total: 1,
      unread: 1,
      by_type: {
        booking: 0,
        payment: 0,
        review: 0,
        maintenance: 0,
        system: 1,
        promotion: 0
      }
    }
  }
  
  // Initialize with mock data if not authenticated
  const initialize = () => {
    if (!authStore.isAuthenticated) {
      loadMockNotifications()
      loadMockStats()
    }
  }
  
  return {
    // State
    notifications,
    stats,
    loading,
    error,
    
    // Computed
    unreadNotifications,
    unreadCount,
    notificationsByType,
    
    // Actions
    fetchNotifications,
    fetchNotificationStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    initialize
  }
})

