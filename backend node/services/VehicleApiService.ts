// Vehicle API Service for PHP/MySQL Backend

import { BaseApiService } from './BaseApiService'
import { API_ENDPOINTS } from '../config/endpoints'
import type { 
  Vehicle, 
  VehicleCreateRequest, 
  VehicleUpdateRequest, 
  VehicleListParams,
  ApiResponse,
  PaginationParams 
} from '../types'

export class VehicleApiService extends BaseApiService {
  // Get all vehicles with optional filtering
  async getVehicles(params?: VehicleListParams): Promise<ApiResponse<Vehicle[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<Vehicle[]>(API_ENDPOINTS.VEHICLES.LIST, searchParams)
  }

  // Get available vehicles only
  async getAvailableVehicles(params?: Omit<VehicleListParams, 'is_available'>): Promise<ApiResponse<Vehicle[]>> {
    const searchParams = params ? this.buildSearchParams({ ...params, is_available: true }) : { is_available: true }
    return this.get<Vehicle[]>(API_ENDPOINTS.VEHICLES.AVAILABLE, searchParams)
  }

  // Get single vehicle by ID
  async getVehicle(id: number): Promise<ApiResponse<Vehicle>> {
    return this.get<Vehicle>(API_ENDPOINTS.VEHICLES.SHOW(id))
  }

  // Create new vehicle
  async createVehicle(data: VehicleCreateRequest): Promise<ApiResponse<Vehicle>> {
    return this.post<Vehicle>(API_ENDPOINTS.VEHICLES.CREATE, data)
  }

  // Update vehicle
  async updateVehicle(id: number, data: VehicleUpdateRequest): Promise<ApiResponse<Vehicle>> {
    return this.put<Vehicle>(API_ENDPOINTS.VEHICLES.UPDATE(id), data)
  }

  // Delete vehicle
  async deleteVehicle(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.VEHICLES.DELETE(id))
  }

  // Search vehicles
  async searchVehicles(query: string, params?: Omit<VehicleListParams, 'search'>): Promise<ApiResponse<Vehicle[]>> {
    const searchParams = params ? this.buildSearchParams({ ...params, search: query }) : { search: query }
    return this.get<Vehicle[]>(API_ENDPOINTS.VEHICLES.SEARCH, searchParams)
  }

  // Get nearby vehicles
  async getNearbyVehicles(
    latitude: number, 
    longitude: number, 
    radius: number = 10,
    params?: Omit<VehicleListParams, 'latitude' | 'longitude' | 'radius'>
  ): Promise<ApiResponse<Vehicle[]>> {
    const searchParams = params ? this.buildSearchParams({
      ...params,
      latitude,
      longitude,
      radius
    }) : { latitude, longitude, radius }
    
    return this.get<Vehicle[]>(API_ENDPOINTS.VEHICLES.NEARBY, searchParams)
  }

  // Get vehicle features
  async getVehicleFeatures(): Promise<ApiResponse<string[]>> {
    return this.get<string[]>(API_ENDPOINTS.VEHICLES.FEATURES)
  }

  // Get vehicle makes
  async getVehicleMakes(): Promise<ApiResponse<string[]>> {
    return this.get<string[]>(API_ENDPOINTS.VEHICLES.MAKES)
  }

  // Get vehicle models for a specific make
  async getVehicleModels(make: string): Promise<ApiResponse<string[]>> {
    return this.get<string[]>(API_ENDPOINTS.VEHICLES.MODELS, { make })
  }

  // Upload vehicle image
  async uploadVehicleImage(
    vehicleId: number, 
    file: File, 
    isPrimary: boolean = false
  ): Promise<ApiResponse<{ url: string; id: number }>> {
    return this.uploadFile<{ url: string; id: number }>(
      API_ENDPOINTS.VEHICLES.UPLOAD_IMAGE(vehicleId),
      file,
      { is_primary: isPrimary }
    )
  }

  // Delete vehicle image
  async deleteVehicleImage(vehicleId: number, imageId: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.VEHICLES.DELETE_IMAGE(vehicleId, imageId))
  }

  // Set primary image
  async setPrimaryImage(vehicleId: number, imageId: number): Promise<ApiResponse<void>> {
    return this.patch<void>(API_ENDPOINTS.VEHICLES.SET_PRIMARY_IMAGE(vehicleId, imageId))
  }

  // Get vehicles by vendor
  async getVendorVehicles(vendorId: number, params?: PaginationParams): Promise<ApiResponse<Vehicle[]>> {
    const searchParams = params ? this.buildPaginationParams(params) : undefined
    return this.get<Vehicle[]>(API_ENDPOINTS.VENDORS.VEHICLES(vendorId), searchParams)
  }

  // Update vehicle availability
  async updateAvailability(
    id: number, 
    isAvailable: boolean, 
    rentalStatus?: 'available' | 'rented' | 'maintenance' | 'out_of_service'
  ): Promise<ApiResponse<Vehicle>> {
    const data: VehicleUpdateRequest = { is_available: isAvailable }
    if (rentalStatus) {
      data.rental_status = rentalStatus
    }
    return this.updateVehicle(id, data)
  }

  // Set vehicle maintenance status
  async setMaintenanceStatus(id: number): Promise<ApiResponse<Vehicle>> {
    return this.updateAvailability(id, false, 'maintenance')
  }

  // Set vehicle as rented
  async setRentedStatus(id: number): Promise<ApiResponse<Vehicle>> {
    return this.updateAvailability(id, false, 'rented')
  }

  // Set vehicle as available
  async setAvailableStatus(id: number): Promise<ApiResponse<Vehicle>> {
    return this.updateAvailability(id, true, 'available')
  }

  // Get vehicle statistics
  async getVehicleStats(id: number): Promise<ApiResponse<{
    total_bookings: number
    total_revenue: number
    average_rating: number
    total_reviews: number
    last_booking_date?: string
    maintenance_count: number
  }>> {
    return this.get(API_ENDPOINTS.VEHICLES.SHOW(id) + '/stats')
  }

  // Calculate rental cost
  async calculateRentalCost(
    vehicleId: number,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{
    daily_rate: number
    number_of_days: number
    total_cost: number
    currency: string
  }>> {
    return this.post(API_ENDPOINTS.BOOKINGS.CALCULATE_COST, {
      vehicle_id: vehicleId,
      start_date: startDate,
      end_date: endDate
    })
  }

  // Check vehicle availability
  async checkAvailability(
    vehicleId: number,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{
    is_available: boolean
    conflicting_bookings?: Array<{
      id: number
      start_date: string
      end_date: string
    }>
  }>> {
    return this.post(API_ENDPOINTS.BOOKINGS.CHECK_AVAILABILITY, {
      vehicle_id: vehicleId,
      start_date: startDate,
      end_date: endDate
    })
  }
}
