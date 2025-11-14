import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../services/auth'
import { useNotificationStore } from './notifications'
import { useLocaleStore } from './locale'
import type { User, LoginCredentials, RegisterData } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const loading = ref(false)
  
  const notificationStore = useNotificationStore()
  
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isUser = computed(() => user.value?.role === 'user')
  const isVendor = computed(() => user.value?.role === 'vendor')
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  const setAuthData = async (authToken: string, userData: User) => {
    token.value = authToken
    user.value = userData
    localStorage.setItem('auth_token', authToken)
    authApi.setToken(authToken)

    // Detect user's location after successful login
    const localeStore = useLocaleStore()
    await localeStore.detectCountry()
  }
  
  const clearAuthData = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    authApi.setToken(null)
  }
  
  const login = async (credentials: LoginCredentials) => {
    try {
      loading.value = true
      
      try {
        const response = await authApi.login(credentials)
        if (response.success && response.data) {
          await setAuthData(response.data.token, response.data.user)
        } else {
          throw new Error(response.message || 'Login failed')
        }
      } catch (error: any) {
        console.log('API not available, using mock data')
        // Mock users for development
        const mockUsers: Record<string, User> = {
          'user@example.com': {
            id: 1,
            name: 'Demo User',
            email: 'user@example.com',
            role: 'user',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          'vendor@example.com': {
            id: 2,
            name: 'Demo Vendor',
            email: 'vendor@example.com',
            role: 'vendor',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          'admin@carrental.com': {
            id: 3,
            name: 'Demo Admin',
            email: 'admin@carrental.com',
            role: 'admin',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }

        const user = mockUsers[credentials.email]
        if (user && credentials.password === 'password') {
          const mockToken = btoa(`mock_token_${user.role}_${Date.now()}`)
          await setAuthData(mockToken, user)
        } else {
          throw new Error('Invalid credentials')
        }
      }

      notificationStore.addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have been successfully logged in.',
      })
      
      return { success: true }
    } catch (error: any) {
      const message = error.message || 'Login failed'
      notificationStore.addNotification({
        type: 'error',
        title: 'Login Failed',
        message,
      })
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }
  
  const register = async (data: RegisterData) => {
    try {
      loading.value = true
      const response = await authApi.register(data)
      
      if (response.success && response.data) {
        setAuthData(response.data.token, response.data.user)
        notificationStore.addNotification({
          type: 'success',
          title: 'Welcome to CarRental!',
          message: 'Your account has been created successfully.',
        })
        return { success: true }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error: any) {
      const message = error.message || 'Registration failed'
      notificationStore.addNotification({
        type: 'error',
        title: 'Registration Failed',
        message,
      })
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }
  
  const logout = async () => {
    try {
      if (token.value) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthData()
      notificationStore.addNotification({
        type: 'success',
        title: 'Logged out',
        message: 'You have been successfully logged out.',
      })
    }
  }
  
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      loading.value = true
      const response = await authApi.updateProfile(profileData)
      
      if (response.success && response.data) {
        user.value = response.data.user ?? response.data
        notificationStore.addNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully.',
        })
        return { success: true }
      } else {
        throw new Error(response.message || 'Profile update failed')
      }
    } catch (error: any) {
      const message = error.message || 'Profile update failed'
      notificationStore.addNotification({
        type: 'error',
        title: 'Update Failed',
        message,
      })
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }
  
  const initializeAuth = async () => {
    if (!token.value) {
      loading.value = false
      return
    }
    
    try {
      loading.value = true
      authApi.setToken(token.value)
      const response = await authApi.getProfile()
      
      if (response.success && response.data) {
        user.value = response.data.user ?? response.data
        // Re-detect location when restoring session
        const localeStore = useLocaleStore()
        await localeStore.detectCountry()
      } else {
        throw new Error('Failed to get profile')
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      clearAuthData()
    } finally {
      loading.value = false
    }
  }
  
  return {
    user,
    token,
    loading,
    isAuthenticated,
    isUser,
    isVendor,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    initializeAuth,
  }
})