// Main API Client for PHP/MySQL Backend Integration

import { BaseApiService } from './BaseApiService'
import { VehicleApiService } from './VehicleApiService'
import { BookingApiService } from './BookingApiService'
import { AuthApiService } from './AuthApiService'
import { VendorApiService } from './VendorApiService'
import { AdminApiService } from './AdminApiService'
import type { ApiConfig } from './BaseApiService'

export class ApiClient {
  private baseService: BaseApiService
  public auth: AuthApiService
  public vehicles: VehicleApiService
  public bookings: BookingApiService
  public vendors: VendorApiService
  public admin: AdminApiService

  constructor(config: ApiConfig) {
    this.baseService = new BaseApiService(config)
    this.auth = new AuthApiService(config)
    this.vehicles = new VehicleApiService(config)
    this.bookings = new BookingApiService(config)
    this.vendors = new VendorApiService(config)
    this.admin = new AdminApiService(config)
  }

  // Token management
  setToken(token: string | null) {
    this.baseService.setToken(token)
  }

  getToken(): string | null {
    return this.baseService.getToken()
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    return this.auth.checkAuth()
  }

  // Logout and clear all tokens
  async logout(): Promise<void> {
    try {
      await this.auth.logout()
    } catch (error) {
      // Clear token even if logout fails
      this.setToken(null)
    }
  }
}

// Default API configuration
export const defaultApiConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
}

// Create default API client instance
export const apiClient = new ApiClient(defaultApiConfig)

// Export individual services for convenience
export const authApi = apiClient.auth
export const vehicleApi = apiClient.vehicles
export const bookingApi = apiClient.bookings
export const vendorApi = apiClient.vendors
export const adminApi = apiClient.admin

// Export types
export type { ApiConfig, ApiResponse } from './BaseApiService'
export type { ApiError } from './BaseApiService'
