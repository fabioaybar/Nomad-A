// Vendor API Service for PHP/MySQL Backend

import { BaseApiService } from './BaseApiService'
import { API_ENDPOINTS } from '../config/endpoints'
import type { 
  Vendor, 
  VendorCreateRequest, 
  VendorUpdateRequest, 
  VendorListParams,
  Vehicle,
  Booking,
  Review,
  ApiResponse,
  PaginationParams,
  VendorStats
} from '../types'

export class VendorApiService extends BaseApiService {
  // Get all vendors with optional filtering
  async getVendors(params?: VendorListParams): Promise<ApiResponse<Vendor[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<Vendor[]>(API_ENDPOINTS.VENDORS.LIST, searchParams)
  }

  // Get single vendor by ID
  async getVendor(id: number): Promise<ApiResponse<Vendor>> {
    return this.get<Vendor>(API_ENDPOINTS.VENDORS.SHOW(id))
  }

  // Create new vendor
  async createVendor(data: VendorCreateRequest): Promise<ApiResponse<Vendor>> {
    return this.post<Vendor>(API_ENDPOINTS.VENDORS.CREATE, data)
  }

  // Update vendor
  async updateVendor(id: number, data: VendorUpdateRequest): Promise<ApiResponse<Vendor>> {
    return this.put<Vendor>(API_ENDPOINTS.VENDORS.UPDATE(id), data)
  }

  // Delete vendor
  async deleteVendor(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.VENDORS.DELETE(id))
  }

  // Verify vendor
  async verifyVendor(id: number): Promise<ApiResponse<Vendor>> {
    return this.post<Vendor>(API_ENDPOINTS.VENDORS.VERIFY(id))
  }

  // Unverify vendor
  async unverifyVendor(id: number): Promise<ApiResponse<Vendor>> {
    return this.post<Vendor>(API_ENDPOINTS.VENDORS.UNVERIFY(id))
  }

  // Get vendor statistics
  async getVendorStats(id: number): Promise<ApiResponse<VendorStats>> {
    return this.get<VendorStats>(API_ENDPOINTS.VENDORS.STATS(id))
  }

  // Get vendor vehicles
  async getVendorVehicles(vendorId: number, params?: PaginationParams): Promise<ApiResponse<Vehicle[]>> {
    const searchParams = params ? this.buildPaginationParams(params) : undefined
    return this.get<Vehicle[]>(API_ENDPOINTS.VENDORS.VEHICLES(vendorId), searchParams)
  }

  // Get vendor bookings
  async getVendorBookings(vendorId: number, params?: PaginationParams): Promise<ApiResponse<Booking[]>> {
    const searchParams = params ? this.buildPaginationParams(params) : undefined
    return this.get<Booking[]>(API_ENDPOINTS.VENDORS.BOOKINGS(vendorId), searchParams)
  }

  // Get vendor reviews
  async getVendorReviews(vendorId: number, params?: PaginationParams): Promise<ApiResponse<Review[]>> {
    const searchParams = params ? this.buildPaginationParams(params) : undefined
    return this.get<Review[]>(API_ENDPOINTS.VENDORS.REVIEWS(vendorId), searchParams)
  }

  // Upload vendor logo
  async uploadLogo(vendorId: number, file: File): Promise<ApiResponse<{ url: string }>> {
    return this.uploadFile<{ url: string }>(
      API_ENDPOINTS.UPLOADS.VENDOR_LOGO,
      file,
      { vendor_id: vendorId }
    )
  }

  // Delete vendor logo
  async deleteLogo(vendorId: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.VENDORS.UPDATE(vendorId) + '/logo')
  }

  // Get vendor dashboard data
  async getVendorDashboard(vendorId: number): Promise<ApiResponse<{
    stats: VendorStats
    recent_bookings: Booking[]
    recent_reviews: Review[]
    upcoming_maintenance: Array<{
      id: number
      vehicle_id: number
      title: string
      scheduled_date: string
      vehicle: Vehicle
    }>
    low_stock_vehicles: Vehicle[]
    pending_verifications: number
  }>> {
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/dashboard')
  }

  // Get vendor analytics
  async getVendorAnalytics(
    vendorId: number,
    period: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<ApiResponse<{
    revenue_chart: Array<{
      date: string
      revenue: number
      bookings: number
    }>
    vehicle_performance: Array<{
      vehicle_id: number
      vehicle_name: string
      bookings: number
      revenue: number
      rating: number
    }>
    customer_insights: {
      repeat_customers: number
      new_customers: number
      average_booking_value: number
      customer_satisfaction: number
    }
    booking_trends: Array<{
      date: string
      bookings: number
      cancellations: number
    }>
  }>> {
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/analytics', { period })
  }

  // Get vendor financial summary
  async getFinancialSummary(
    vendorId: number,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<{
    total_revenue: number
    total_bookings: number
    average_booking_value: number
    commission_earned: number
    pending_payments: number
    monthly_breakdown: Array<{
      month: string
      revenue: number
      bookings: number
    }>
    top_performing_vehicles: Array<{
      vehicle_id: number
      vehicle_name: string
      revenue: number
      bookings: number
    }>
  }>> {
    const params: Record<string, any> = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/financial', params)
  }

  // Get vendor performance metrics
  async getPerformanceMetrics(vendorId: number): Promise<ApiResponse<{
    overall_rating: number
    total_reviews: number
    response_rate: number
    average_response_time: number
    booking_completion_rate: number
    customer_satisfaction_score: number
    vehicle_utilization_rate: number
    revenue_growth_rate: number
    monthly_comparison: {
      current_month: number
      previous_month: number
      growth_percentage: number
    }
  }>> {
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/performance')
  }

  // Update vendor settings
  async updateSettings(
    vendorId: number,
    settings: {
      auto_confirm_bookings?: boolean
      email_notifications?: boolean
      sms_notifications?: boolean
      commission_rate?: number
      minimum_booking_duration?: number
      advance_booking_limit?: number
    }
  ): Promise<ApiResponse<Vendor>> {
    return this.patch<Vendor>(API_ENDPOINTS.VENDORS.UPDATE(vendorId) + '/settings', settings)
  }

  // Get vendor notifications
  async getNotifications(vendorId: number, params?: PaginationParams): Promise<ApiResponse<Array<{
    id: number
    type: string
    title: string
    message: string
    is_read: boolean
    created_at: string
    action_url?: string
  }>>> {
    const searchParams = params ? this.buildPaginationParams(params) : undefined
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/notifications', searchParams)
  }

  // Mark notification as read
  async markNotificationRead(vendorId: number, notificationId: number): Promise<ApiResponse<void>> {
    return this.patch<void>(API_ENDPOINTS.VENDORS.STATS(vendorId) + `/notifications/${notificationId}/read`)
  }

  // Mark all notifications as read
  async markAllNotificationsRead(vendorId: number): Promise<ApiResponse<void>> {
    return this.post<void>(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/notifications/read-all')
  }

  // Get vendor calendar
  async getVendorCalendar(
    vendorId: number,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{
    bookings: Array<{
      id: number
      vehicle_id: number
      start_date: string
      end_date: string
      status: string
      customer_name: string
      vehicle_name: string
    }>
    maintenance: Array<{
      id: number
      vehicle_id: number
      title: string
      scheduled_date: string
      status: string
      vehicle_name: string
    }>
    availability: Array<{
      vehicle_id: number
      date: string
      is_available: boolean
      vehicle_name: string
    }>
  }>> {
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/calendar', {
      start_date: startDate,
      end_date: endDate
    })
  }

  // Get vendor reports
  async getVendorReports(
    vendorId: number,
    reportType: 'bookings' | 'revenue' | 'vehicles' | 'customers',
    startDate?: string,
    endDate?: string,
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<ApiResponse<any>> {
    const params: Record<string, any> = { type: reportType, format }
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/reports', params)
  }

  // Export vendor data
  async exportVendorData(
    vendorId: number,
    dataType: 'bookings' | 'vehicles' | 'reviews' | 'financial',
    format: 'csv' | 'xlsx' | 'pdf' = 'csv'
  ): Promise<ApiResponse<{ download_url: string }>> {
    return this.post(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/export', {
      data_type: dataType,
      format
    })
  }

  // Get vendor support tickets
  async getSupportTickets(vendorId: number, params?: PaginationParams): Promise<ApiResponse<Array<{
    id: number
    subject: string
    status: string
    priority: string
    created_at: string
    updated_at: string
  }>>> {
    const searchParams = params ? this.buildPaginationParams(params) : undefined
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/support-tickets', searchParams)
  }

  // Create support ticket
  async createSupportTicket(
    vendorId: number,
    ticketData: {
      subject: string
      description: string
      priority: 'low' | 'medium' | 'high' | 'urgent'
      category: string
    }
  ): Promise<ApiResponse<{ id: number; ticket_number: string }>> {
    return this.post(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/support-tickets', ticketData)
  }

  // Get vendor profile completeness
  async getProfileCompleteness(vendorId: number): Promise<ApiResponse<{
    completion_percentage: number
    missing_fields: string[]
    recommendations: string[]
  }>> {
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/profile-completeness')
  }

  // Update vendor profile completeness
  async updateProfileCompleteness(
    vendorId: number,
    updates: Record<string, any>
  ): Promise<ApiResponse<Vendor>> {
    return this.patch<Vendor>(API_ENDPOINTS.VENDORS.UPDATE(vendorId) + '/profile', updates)
  }

  // Get vendor verification status
  async getVerificationStatus(vendorId: number): Promise<ApiResponse<{
    is_verified: boolean
    verification_level: 'pending' | 'basic' | 'verified' | 'premium'
    required_documents: Array<{
      type: string
      status: 'missing' | 'pending' | 'approved' | 'rejected'
      uploaded_at?: string
    }>
    verification_steps: Array<{
      step: string
      completed: boolean
      completed_at?: string
    }>
  }>> {
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/verification-status')
  }

  // Upload verification document
  async uploadVerificationDocument(
    vendorId: number,
    documentType: string,
    file: File
  ): Promise<ApiResponse<{ document_id: number; status: string }>> {
    return this.uploadFile(
      API_ENDPOINTS.VENDORS.STATS(vendorId) + '/verification-documents',
      file,
      { document_type: documentType }
    )
  }

  // Get vendor team members
  async getTeamMembers(vendorId: number): Promise<ApiResponse<Array<{
    id: number
    user_id: number
    role: string
    permissions: string[]
    is_active: boolean
    user: {
      name: string
      email: string
    }
  }>>> {
    return this.get(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/team-members')
  }

  // Add team member
  async addTeamMember(
    vendorId: number,
    memberData: {
      email: string
      role: string
      permissions: string[]
    }
  ): Promise<ApiResponse<{ user_id: number; invitation_sent: boolean }>> {
    return this.post(API_ENDPOINTS.VENDORS.STATS(vendorId) + '/team-members', memberData)
  }

  // Remove team member
  async removeTeamMember(vendorId: number, memberId: number): Promise<ApiResponse<void>> {
    return this.delete(API_ENDPOINTS.VENDORS.STATS(vendorId) + `/team-members/${memberId}`)
  }
}
