import { api } from './api'
import type { User, LoginCredentials, RegisterData } from '../types'

interface AuthResponse {
  success: boolean
  data?: {
    token: string
    user: User
  }
  message?: string
}

export const authApi = {
  setToken(token: string | null) {
    if (token) {
      api.setAuthToken(token)
    } else {
      api.clearAuthToken()
    }
  },

  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      }
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      }
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      }
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    }
  },

  async updateProfile(data: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await api.put('/auth/profile', data)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      }
    }
  }
}
