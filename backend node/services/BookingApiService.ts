// Booking API Service for PHP/MySQL Backend

import { BaseApiService } from './BaseApiService'
import { API_ENDPOINTS } from '../config/endpoints'
import type { 
  Booking, 
  BookingCreateRequest, 
  BookingUpdateRequest, 
  BookingListParams,
  ApiResponse,
  PaginationParams 
} from '../types'

export class BookingApiService extends BaseApiService {
  // Get all bookings with optional filtering
  async getBookings(params?: BookingListParams): Promise<ApiResponse<Booking[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<Booking[]>(API_ENDPOINTS.BOOKINGS.LIST, searchParams)
  }

  // Get single booking by ID
  async getBooking(id: number): Promise<ApiResponse<Booking>> {
    return this.get<Booking>(API_ENDPOINTS.BOOKINGS.SHOW(id))
  }

  // Create new booking
  async createBooking(data: BookingCreateRequest): Promise<ApiResponse<Booking>> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.CREATE, data)
  }

  // Update booking
  async updateBooking(id: number, data: BookingUpdateRequest): Promise<ApiResponse<Booking>> {
    return this.put<Booking>(API_ENDPOINTS.BOOKINGS.UPDATE(id), data)
  }

  // Delete booking
  async deleteBooking(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.BOOKINGS.DELETE(id))
  }

  // Confirm booking
  async confirmBooking(id: number): Promise<ApiResponse<Booking>> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.CONFIRM(id))
  }

  // Cancel booking
  async cancelBooking(id: number, reason?: string): Promise<ApiResponse<Booking>> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason })
  }

  // Complete booking
  async completeBooking(id: number): Promise<ApiResponse<Booking>> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.COMPLETE(id))
  }

  // Process payment
  async processPayment(
    id: number, 
    paymentData: {
      method: string
      transaction_id?: string
      amount?: number
    }
  ): Promise<ApiResponse<Booking>> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.PAYMENT(id), paymentData)
  }

  // Process refund
  async processRefund(
    id: number, 
    refundData: {
      amount?: number
      reason: string
    }
  ): Promise<ApiResponse<Booking>> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.REFUND(id), refundData)
  }

  // Calculate booking cost
  async calculateCost(
    vehicleId: number,
    startDate: string,
    endDate: string,
    discountCode?: string
  ): Promise<ApiResponse<{
    daily_rate: number
    number_of_days: number
    subtotal: number
    discount_amount: number
    total_cost: number
    currency: string
  }>> {
    return this.post(API_ENDPOINTS.BOOKINGS.CALCULATE_COST, {
      vehicle_id: vehicleId,
      start_date: startDate,
      end_date: endDate,
      discount_code: discountCode
    })
  }

  // Check availability
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

  // Get user bookings
  async getUserBookings(userId: number, params?: PaginationParams): Promise<ApiResponse<Booking[]>> {
    const searchParams = params ? this.buildPaginationParams(params) : undefined
    return this.get<Booking[]>(API_ENDPOINTS.BOOKINGS.USER_BOOKINGS(userId), searchParams)
  }

  // Get vendor bookings
  async getVendorBookings(vendorId: number, params?: PaginationParams): Promise<ApiResponse<Booking[]>> {
    const searchParams = params ? this.buildPaginationParams(params) : undefined
    return this.get<Booking[]>(API_ENDPOINTS.BOOKINGS.VENDOR_BOOKINGS(vendorId), searchParams)
  }

  // Get vehicle bookings
  async getVehicleBookings(vehicleId: number, params?: PaginationParams): Promise<ApiResponse<Booking[]>> {
    const searchParams = params ? this.buildPaginationParams(params) : undefined
    return this.get<Booking[]>(API_ENDPOINTS.BOOKINGS.VEHICLE_BOOKINGS(vehicleId), searchParams)
  }

  // Get bookings by status
  async getBookingsByStatus(
    status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled',
    params?: PaginationParams
  ): Promise<ApiResponse<Booking[]>> {
    return this.getBookings({ ...params, status })
  }

  // Get active bookings
  async getActiveBookings(params?: PaginationParams): Promise<ApiResponse<Booking[]>> {
    return this.getBookingsByStatus('active', params)
  }

  // Get pending bookings
  async getPendingBookings(params?: PaginationParams): Promise<ApiResponse<Booking[]>> {
    return this.getBookingsByStatus('pending', params)
  }

  // Get completed bookings
  async getCompletedBookings(params?: PaginationParams): Promise<ApiResponse<Booking[]>> {
    return this.getBookingsByStatus('completed', params)
  }

  // Get cancelled bookings
  async getCancelledBookings(params?: PaginationParams): Promise<ApiResponse<Booking[]>> {
    return this.getBookingsByStatus('cancelled', params)
  }

  // Get bookings by date range
  async getBookingsByDateRange(
    startDate: string,
    endDate: string,
    params?: PaginationParams
  ): Promise<ApiResponse<Booking[]>> {
    return this.getBookings({
      ...params,
      start_date_from: startDate,
      start_date_to: endDate
    })
  }

  // Get booking statistics
  async getBookingStats(id: number): Promise<ApiResponse<{
    total_cost: number
    daily_rate: number
    number_of_days: number
    status: string
    payment_status: string
    created_at: string
    updated_at: string
  }>> {
    return this.get(API_ENDPOINTS.BOOKINGS.SHOW(id) + '/stats')
  }

  // Get booking timeline
  async getBookingTimeline(id: number): Promise<ApiResponse<Array<{
    status: string
    timestamp: string
    note?: string
    user?: string
  }>>> {
    return this.get(API_ENDPOINTS.BOOKINGS.SHOW(id) + '/timeline')
  }

  // Extend booking
  async extendBooking(
    id: number,
    newEndDate: string,
    reason?: string
  ): Promise<ApiResponse<Booking>> {
    return this.patch<Booking>(API_ENDPOINTS.BOOKINGS.UPDATE(id), {
      end_date: newEndDate,
      notes: reason
    })
  }

  // Get booking invoice
  async getBookingInvoice(id: number): Promise<ApiResponse<{
    booking_id: number
    invoice_number: string
    total_amount: number
    items: Array<{
      description: string
      amount: number
      quantity: number
    }>
    created_at: string
  }>> {
    return this.get(API_ENDPOINTS.BOOKINGS.SHOW(id) + '/invoice')
  }
}
