// Admin API Service for PHP/MySQL Backend

import { BaseApiService } from './BaseApiService'
import { API_ENDPOINTS } from '../config/endpoints'
import type { 
  User,
  Vendor,
  Vehicle,
  Booking,
  Review,
  Maintenance,
  Reward,
  Discount,
  Conversation,
  Notification,
  SystemSettings,
  AuditLog,
  ApiResponse,
  PaginationParams,
  DashboardStats,
  UserListParams,
  VendorListParams,
  VehicleListParams,
  BookingListParams,
  ReviewListParams,
  MaintenanceListParams,
  DiscountListParams,
  AuditLogListParams
} from '../types'

export class AdminApiService extends BaseApiService {
  // Dashboard & Statistics
  async getDashboard(): Promise<ApiResponse<DashboardStats>> {
    return this.get<DashboardStats>(API_ENDPOINTS.ADMIN.DASHBOARD)
  }

  async getStats(): Promise<ApiResponse<{
    total_users: number
    total_vendors: number
    total_vehicles: number
    total_bookings: number
    active_bookings: number
    total_revenue: number
    monthly_revenue: number
    average_rating: number
    system_health: {
      status: 'healthy' | 'warning' | 'critical'
      uptime: number
      last_backup: string
      disk_usage: number
      memory_usage: number
    }
  }>> {
    return this.get(API_ENDPOINTS.ADMIN.STATS)
  }

  // User Management
  async getUsers(params?: UserListParams): Promise<ApiResponse<User[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<User[]>(API_ENDPOINTS.ADMIN.USERS, searchParams)
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    return this.get<User>(API_ENDPOINTS.USERS.SHOW(id))
  }

  async createUser(userData: {
    name: string
    email: string
    password: string
    role: 'user' | 'vendor' | 'admin'
    phone?: string
  }): Promise<ApiResponse<User>> {
    return this.post<User>(API_ENDPOINTS.USERS.CREATE, userData)
  }

  async updateUser(id: number, userData: {
    name?: string
    email?: string
    phone?: string
    role?: 'user' | 'vendor' | 'admin'
    is_active?: boolean
  }): Promise<ApiResponse<User>> {
    return this.put<User>(API_ENDPOINTS.USERS.UPDATE(id), userData)
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.USERS.DELETE(id))
  }

  async activateUser(id: number): Promise<ApiResponse<User>> {
    return this.post<User>(API_ENDPOINTS.USERS.ACTIVATE(id))
  }

  async deactivateUser(id: number): Promise<ApiResponse<User>> {
    return this.post<User>(API_ENDPOINTS.USERS.DEACTIVATE(id))
  }

  async getUserStats(id: number): Promise<ApiResponse<{
    total_bookings: number
    total_spent: number
    average_rating: number
    last_login: string
    account_age: number
  }>> {
    return this.get(API_ENDPOINTS.USERS.STATS(id))
  }

  // Vendor Management
  async getVendors(params?: VendorListParams): Promise<ApiResponse<Vendor[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<Vendor[]>(API_ENDPOINTS.ADMIN.VENDORS, searchParams)
  }

  async getVendor(id: number): Promise<ApiResponse<Vendor>> {
    return this.get<Vendor>(API_ENDPOINTS.VENDORS.SHOW(id))
  }

  async updateVendor(id: number, vendorData: {
    company_name?: string
    business_type?: 'individual' | 'company' | 'enterprise'
    contact_email?: string
    contact_phone?: string
    description?: string
    is_verified?: boolean
  }): Promise<ApiResponse<Vendor>> {
    return this.put<Vendor>(API_ENDPOINTS.VENDORS.UPDATE(id), vendorData)
  }

  async verifyVendor(id: number): Promise<ApiResponse<Vendor>> {
    return this.post<Vendor>(API_ENDPOINTS.VENDORS.VERIFY(id))
  }

  async unverifyVendor(id: number): Promise<ApiResponse<Vendor>> {
    return this.post<Vendor>(API_ENDPOINTS.VENDORS.UNVERIFY(id))
  }

  async getVendorStats(id: number): Promise<ApiResponse<{
    total_vehicles: number
    total_bookings: number
    total_revenue: number
    average_rating: number
    verification_status: string
  }>> {
    return this.get(API_ENDPOINTS.VENDORS.STATS(id))
  }

  // Vehicle Management
  async getVehicles(params?: VehicleListParams): Promise<ApiResponse<Vehicle[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<Vehicle[]>(API_ENDPOINTS.ADMIN.VEHICLES, searchParams)
  }

  async getVehicle(id: number): Promise<ApiResponse<Vehicle>> {
    return this.get<Vehicle>(API_ENDPOINTS.VEHICLES.SHOW(id))
  }

  async updateVehicle(id: number, vehicleData: {
    make?: string
    model?: string
    year?: number
    price_per_day?: number
    is_available?: boolean
    rental_status?: 'available' | 'rented' | 'maintenance' | 'out_of_service'
  }): Promise<ApiResponse<Vehicle>> {
    return this.put<Vehicle>(API_ENDPOINTS.VEHICLES.UPDATE(id), vehicleData)
  }

  async deleteVehicle(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.VEHICLES.DELETE(id))
  }

  async approveVehicle(id: number): Promise<ApiResponse<Vehicle>> {
    return this.post<Vehicle>(API_ENDPOINTS.VEHICLES.UPDATE(id) + '/approve')
  }

  async rejectVehicle(id: number, reason: string): Promise<ApiResponse<Vehicle>> {
    return this.post<Vehicle>(API_ENDPOINTS.VEHICLES.UPDATE(id) + '/reject', { reason })
  }

  // Booking Management
  async getBookings(params?: BookingListParams): Promise<ApiResponse<Booking[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<Booking[]>(API_ENDPOINTS.ADMIN.BOOKINGS, searchParams)
  }

  async getBooking(id: number): Promise<ApiResponse<Booking>> {
    return this.get<Booking>(API_ENDPOINTS.BOOKINGS.SHOW(id))
  }

  async updateBooking(id: number, bookingData: {
    status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
    payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
    total_cost?: number
    notes?: string
  }): Promise<ApiResponse<Booking>> {
    return this.put<Booking>(API_ENDPOINTS.BOOKINGS.UPDATE(id), bookingData)
  }

  async cancelBooking(id: number, reason: string): Promise<ApiResponse<Booking>> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.CANCEL(id), { reason })
  }

  async refundBooking(id: number, refundData: {
    amount?: number
    reason: string
  }): Promise<ApiResponse<Booking>> {
    return this.post<Booking>(API_ENDPOINTS.BOOKINGS.REFUND(id), refundData)
  }

  // Review Management
  async getReviews(params?: ReviewListParams): Promise<ApiResponse<Review[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<Review[]>(API_ENDPOINTS.ADMIN.REVIEWS, searchParams)
  }

  async getReview(id: number): Promise<ApiResponse<Review>> {
    return this.get<Review>(API_ENDPOINTS.REVIEWS.SHOW(id))
  }

  async updateReview(id: number, reviewData: {
    rating?: number
    title?: string
    comment?: string
    is_anonymous?: boolean
  }): Promise<ApiResponse<Review>> {
    return this.put<Review>(API_ENDPOINTS.REVIEWS.UPDATE(id), reviewData)
  }

  async deleteReview(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.REVIEWS.DELETE(id))
  }

  async approveReview(id: number): Promise<ApiResponse<Review>> {
    return this.post<Review>(API_ENDPOINTS.REVIEWS.UPDATE(id) + '/approve')
  }

  async flagReview(id: number, reason: string): Promise<ApiResponse<Review>> {
    return this.post<Review>(API_ENDPOINTS.REVIEWS.UPDATE(id) + '/flag', { reason })
  }

  // Maintenance Management
  async getMaintenance(params?: MaintenanceListParams): Promise<ApiResponse<Maintenance[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<Maintenance[]>(API_ENDPOINTS.ADMIN.MAINTENANCE, searchParams)
  }

  async getMaintenanceRecord(id: number): Promise<ApiResponse<Maintenance>> {
    return this.get<Maintenance>(API_ENDPOINTS.MAINTENANCE.SHOW(id))
  }

  async updateMaintenance(id: number, maintenanceData: {
    type?: 'routine' | 'repair' | 'inspection' | 'cleaning'
    title?: string
    description?: string
    cost?: number
    scheduled_date?: string
    completed_date?: string
    status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  }): Promise<ApiResponse<Maintenance>> {
    return this.put<Maintenance>(API_ENDPOINTS.MAINTENANCE.UPDATE(id), maintenanceData)
  }

  async completeMaintenance(id: number): Promise<ApiResponse<Maintenance>> {
    return this.post<Maintenance>(API_ENDPOINTS.MAINTENANCE.COMPLETE(id))
  }

  // Rewards Management
  async getRewards(): Promise<ApiResponse<Reward[]>> {
    return this.get<Reward[]>(API_ENDPOINTS.ADMIN.REWARDS)
  }

  async createReward(rewardData: {
    user_id: number
    type: 'points' | 'discount' | 'bonus'
    amount: number
    description: string
    expires_at?: string
  }): Promise<ApiResponse<Reward>> {
    return this.post<Reward>(API_ENDPOINTS.REWARDS.CREATE, rewardData)
  }

  async updateReward(id: number, rewardData: {
    type?: 'points' | 'discount' | 'bonus'
    amount?: number
    description?: string
    status?: 'active' | 'used' | 'expired'
    expires_at?: string
  }): Promise<ApiResponse<Reward>> {
    return this.put<Reward>(API_ENDPOINTS.REWARDS.UPDATE(id), rewardData)
  }

  async deleteReward(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.REWARDS.DELETE(id))
  }

  // Discount Management
  async getDiscounts(params?: DiscountListParams): Promise<ApiResponse<Discount[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<Discount[]>(API_ENDPOINTS.ADMIN.DISCOUNTS, searchParams)
  }

  async getDiscount(id: number): Promise<ApiResponse<Discount>> {
    return this.get<Discount>(API_ENDPOINTS.DISCOUNTS.SHOW(id))
  }

  async createDiscount(discountData: {
    name: string
    description: string
    type: 'percentage' | 'fixed'
    value: number
    points_required: number
    expires_at?: string
  }): Promise<ApiResponse<Discount>> {
    return this.post<Discount>(API_ENDPOINTS.DISCOUNTS.CREATE, discountData)
  }

  async updateDiscount(id: number, discountData: {
    name?: string
    description?: string
    type?: 'percentage' | 'fixed'
    value?: number
    points_required?: number
    is_active?: boolean
    expires_at?: string
  }): Promise<ApiResponse<Discount>> {
    return this.put<Discount>(API_ENDPOINTS.DISCOUNTS.UPDATE(id), discountData)
  }

  async deleteDiscount(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.DISCOUNTS.DELETE(id))
  }

  async activateDiscount(id: number): Promise<ApiResponse<Discount>> {
    return this.post<Discount>(API_ENDPOINTS.DISCOUNTS.ACTIVATE(id))
  }

  async deactivateDiscount(id: number): Promise<ApiResponse<Discount>> {
    return this.post<Discount>(API_ENDPOINTS.DISCOUNTS.DEACTIVATE(id))
  }

  // Conversation Management
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.get<Conversation[]>(API_ENDPOINTS.ADMIN.CONVERSATIONS)
  }

  async getConversation(id: number): Promise<ApiResponse<Conversation>> {
    return this.get<Conversation>(API_ENDPOINTS.CONVERSATIONS.SHOW(id))
  }

  async updateConversation(id: number, conversationData: {
    status?: 'active' | 'closed' | 'archived'
    subject?: string
  }): Promise<ApiResponse<Conversation>> {
    return this.put<Conversation>(API_ENDPOINTS.CONVERSATIONS.UPDATE(id), conversationData)
  }

  async closeConversation(id: number): Promise<ApiResponse<Conversation>> {
    return this.post<Conversation>(API_ENDPOINTS.CONVERSATIONS.CLOSE(id))
  }

  async archiveConversation(id: number): Promise<ApiResponse<Conversation>> {
    return this.post<Conversation>(API_ENDPOINTS.CONVERSATIONS.ARCHIVE(id))
  }

  // Notification Management
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.get<Notification[]>(API_ENDPOINTS.ADMIN.NOTIFICATIONS)
  }

  async createNotification(notificationData: {
    user_id: number
    type: 'booking' | 'payment' | 'maintenance' | 'review' | 'system'
    title: string
    message: string
    action_url?: string
  }): Promise<ApiResponse<Notification>> {
    return this.post<Notification>(API_ENDPOINTS.NOTIFICATIONS.CREATE, notificationData)
  }

  async updateNotification(id: number, notificationData: {
    title?: string
    message?: string
    is_read?: boolean
    action_url?: string
  }): Promise<ApiResponse<Notification>> {
    return this.put<Notification>(API_ENDPOINTS.NOTIFICATIONS.UPDATE(id), notificationData)
  }

  async deleteNotification(id: number): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.NOTIFICATIONS.DELETE(id))
  }

  async broadcastNotification(notificationData: {
    type: 'booking' | 'payment' | 'maintenance' | 'review' | 'system'
    title: string
    message: string
    target_users?: 'all' | 'vendors' | 'users' | 'admins'
    user_ids?: number[]
  }): Promise<ApiResponse<{ sent_count: number }>> {
    return this.post(API_ENDPOINTS.NOTIFICATIONS.CREATE + '/broadcast', notificationData)
  }

  // System Settings Management
  async getSystemSettings(): Promise<ApiResponse<SystemSettings[]>> {
    return this.get<SystemSettings[]>(API_ENDPOINTS.ADMIN.SYSTEM_SETTINGS)
  }

  async getSystemSetting(key: string): Promise<ApiResponse<SystemSettings>> {
    return this.get<SystemSettings>(API_ENDPOINTS.SYSTEM.UPDATE_SETTING(key))
  }

  async updateSystemSetting(key: string, value: string, description?: string): Promise<ApiResponse<SystemSettings>> {
    return this.put<SystemSettings>(API_ENDPOINTS.SYSTEM.UPDATE_SETTING(key), { value, description })
  }

  async createSystemSetting(settingData: {
    key: string
    value: string
    description?: string
  }): Promise<ApiResponse<SystemSettings>> {
    return this.post<SystemSettings>(API_ENDPOINTS.ADMIN.SYSTEM_SETTINGS, settingData)
  }

  async deleteSystemSetting(key: string): Promise<ApiResponse<void>> {
    return this.delete<void>(API_ENDPOINTS.SYSTEM.UPDATE_SETTING(key))
  }

  // Audit Log Management
  async getAuditLogs(params?: AuditLogListParams): Promise<ApiResponse<AuditLog[]>> {
    const searchParams = params ? this.buildSearchParams(params) : undefined
    return this.get<AuditLog[]>(API_ENDPOINTS.ADMIN.AUDIT_LOGS, searchParams)
  }

  async getAuditLog(id: number): Promise<ApiResponse<AuditLog>> {
    return this.get<AuditLog>(API_ENDPOINTS.ADMIN.AUDIT_LOGS + `/${id}`)
  }

  // Reports & Analytics
  async generateReport(reportType: 'users' | 'vendors' | 'vehicles' | 'bookings' | 'revenue', params: {
    start_date?: string
    end_date?: string
    format?: 'json' | 'csv' | 'pdf'
    filters?: Record<string, any>
  }): Promise<ApiResponse<any>> {
    return this.post(API_ENDPOINTS.REPORTS.EXPORT(reportType), params)
  }

  async getSystemHealth(): Promise<ApiResponse<{
    status: 'healthy' | 'warning' | 'critical'
    uptime: number
    last_backup: string
    disk_usage: number
    memory_usage: number
    database_status: 'connected' | 'disconnected'
    api_status: 'operational' | 'degraded' | 'down'
    queue_status: 'normal' | 'backlog' | 'overloaded'
  }>> {
    return this.get(API_ENDPOINTS.SYSTEM.HEALTH)
  }

  async getSystemVersion(): Promise<ApiResponse<{
    version: string
    build: string
    release_date: string
    changelog: string[]
  }>> {
    return this.get(API_ENDPOINTS.SYSTEM.VERSION)
  }

  // Bulk Operations
  async bulkUpdateUsers(userIds: number[], updates: {
    role?: 'user' | 'vendor' | 'admin'
    is_active?: boolean
  }): Promise<ApiResponse<{ updated_count: number }>> {
    return this.post(API_ENDPOINTS.ADMIN.USERS + '/bulk-update', { user_ids: userIds, updates })
  }

  async bulkDeleteUsers(userIds: number[]): Promise<ApiResponse<{ deleted_count: number }>> {
    return this.post(API_ENDPOINTS.ADMIN.USERS + '/bulk-delete', { user_ids: userIds })
  }

  async bulkVerifyVendors(vendorIds: number[]): Promise<ApiResponse<{ verified_count: number }>> {
    return this.post(API_ENDPOINTS.ADMIN.VENDORS + '/bulk-verify', { vendor_ids: vendorIds })
  }

  async bulkUpdateVehicles(vehicleIds: number[], updates: {
    is_available?: boolean
    rental_status?: 'available' | 'rented' | 'maintenance' | 'out_of_service'
  }): Promise<ApiResponse<{ updated_count: number }>> {
    return this.post(API_ENDPOINTS.ADMIN.VEHICLES + '/bulk-update', { vehicle_ids: vehicleIds, updates })
  }

  // Data Export
  async exportData(dataType: 'users' | 'vendors' | 'vehicles' | 'bookings' | 'reviews', format: 'csv' | 'xlsx' | 'json' = 'csv'): Promise<ApiResponse<{ download_url: string }>> {
    return this.post(API_ENDPOINTS.ADMIN.DASHBOARD + '/export', { data_type: dataType, format })
  }

  // System Maintenance
  async runSystemMaintenance(): Promise<ApiResponse<{
    status: string
    tasks_completed: string[]
    errors: string[]
  }>> {
    return this.post(API_ENDPOINTS.SYSTEM.SETTINGS + '/maintenance')
  }

  async clearCache(): Promise<ApiResponse<{ cleared_caches: string[] }>> {
    return this.post(API_ENDPOINTS.SYSTEM.SETTINGS + '/clear-cache')
  }

  async backupDatabase(): Promise<ApiResponse<{ backup_url: string; backup_size: number }>> {
    return this.post(API_ENDPOINTS.SYSTEM.SETTINGS + '/backup')
  }
}
