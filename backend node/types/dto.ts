// API Request/Response DTOs for PHP/MySQL Backend

import { User, Vendor, Vehicle, Booking, Review, Maintenance, Reward, Discount, UserRewards, ChatMessage, Conversation, Notification, SystemSettings, AuditLog } from './entities'

// Common API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    total?: number
    per_page?: number
    current_page?: number
    last_page?: number
    from?: number
    to?: number
  }
}

// Pagination Parameters
export interface PaginationParams {
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Search Parameters
export interface SearchParams extends PaginationParams {
  search?: string
  filters?: Record<string, any>
}

// Authentication DTOs
export interface LoginRequest {
  email: string
  password: string
  remember_me?: boolean
}

export interface LoginResponse {
  token: string
  user: User
  expires_at: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  role: 'user' | 'vendor'
}

export interface RegisterResponse {
  user: User
  token: string
  expires_at: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  token: string
  password: string
  password_confirmation: string
}

// User DTOs
export interface UserUpdateRequest {
  name?: string
  email?: string
  phone?: string
}

export interface UserListParams extends SearchParams {
  role?: 'user' | 'vendor' | 'admin'
  is_active?: boolean
}

// Vendor DTOs
export interface VendorCreateRequest {
  user_id: number
  company_name: string
  business_type: 'individual' | 'company' | 'enterprise'
  contact_email: string
  contact_phone: string
  logo?: string
  description?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  tax_id?: string
}

export interface VendorUpdateRequest extends Partial<VendorCreateRequest> {
  is_verified?: boolean
}

export interface VendorListParams extends SearchParams {
  business_type?: 'individual' | 'company' | 'enterprise'
  is_verified?: boolean
  city?: string
  country?: string
}

// Vehicle DTOs
export interface VehicleCreateRequest {
  vendor_id: number
  make: string
  model: string
  year: number
  color: string
  type: 'sedan' | 'suv' | 'hatchback' | 'convertible' | 'coupe' | 'wagon' | 'pickup' | 'van'
  fuel_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric'
  transmission: 'manual' | 'automatic'
  engine_size?: string
  mileage?: number
  seats: number
  doors: number
  price_per_day: number
  location_address: string
  latitude?: number
  longitude?: number
  images: string[]
  features: string[]
  description?: string
}

export interface VehicleUpdateRequest extends Partial<VehicleCreateRequest> {
  is_available?: boolean
  is_rented?: boolean
  rental_status?: 'available' | 'rented' | 'maintenance' | 'out_of_service'
}

export interface VehicleListParams extends SearchParams {
  vendor_id?: number
  make?: string
  type?: string
  fuel_type?: string
  transmission?: string
  min_price?: number
  max_price?: number
  min_year?: number
  max_year?: number
  seats?: number
  is_available?: boolean
  location?: string
  latitude?: number
  longitude?: number
  radius?: number // in kilometers
}

// Booking DTOs
export interface BookingCreateRequest {
  vehicle_id: number
  start_date: string
  end_date: string
  pickup_location: string
  return_location: string
  pickup_time?: string
  return_time?: string
  notes?: string
}

export interface BookingUpdateRequest {
  start_date?: string
  end_date?: string
  pickup_location?: string
  return_location?: string
  pickup_time?: string
  return_time?: string
  status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  transaction_id?: string
  notes?: string
  cancellation_reason?: string
}

export interface BookingListParams extends SearchParams {
  user_id?: number
  vendor_id?: number
  vehicle_id?: number
  status?: string
  payment_status?: string
  start_date_from?: string
  start_date_to?: string
  end_date_from?: string
  end_date_to?: string
}

// Review DTOs
export interface ReviewCreateRequest {
  booking_id: number
  rating: number
  title?: string
  comment?: string
  is_anonymous?: boolean
}

export interface ReviewUpdateRequest {
  rating?: number
  title?: string
  comment?: string
  is_anonymous?: boolean
}

export interface ReviewListParams extends SearchParams {
  user_id?: number
  vendor_id?: number
  vehicle_id?: number
  rating?: number
}

// Maintenance DTOs
export interface MaintenanceCreateRequest {
  vehicle_id: number
  type: 'routine' | 'repair' | 'inspection' | 'cleaning'
  title: string
  description?: string
  cost?: number
  scheduled_date: string
}

export interface MaintenanceUpdateRequest {
  type?: 'routine' | 'repair' | 'inspection' | 'cleaning'
  title?: string
  description?: string
  cost?: number
  scheduled_date?: string
  completed_date?: string
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
}

export interface MaintenanceListParams extends SearchParams {
  vendor_id?: number
  vehicle_id?: number
  type?: string
  status?: string
  scheduled_date_from?: string
  scheduled_date_to?: string
}

// Reward DTOs
export interface RewardCreateRequest {
  user_id: number
  type: 'points' | 'discount' | 'bonus'
  amount: number
  description: string
  expires_at?: string
}

export interface RewardListParams extends SearchParams {
  user_id?: number
  type?: string
  status?: string
}

// Discount DTOs
export interface DiscountCreateRequest {
  name: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  points_required: number
  expires_at?: string
}

export interface DiscountUpdateRequest {
  name?: string
  description?: string
  type?: 'percentage' | 'fixed'
  value?: number
  points_required?: number
  is_active?: boolean
  expires_at?: string
}

export interface DiscountListParams extends SearchParams {
  is_active?: boolean
  type?: string
}

// Chat DTOs
export interface ChatMessageCreateRequest {
  conversation_id: number
  message: string
  message_type?: 'text' | 'image' | 'file'
}

export interface ConversationCreateRequest {
  user_id: number
  vendor_id?: number
  admin_id?: number
  booking_id?: number
  subject?: string
}

export interface ConversationListParams extends SearchParams {
  user_id?: number
  vendor_id?: number
  admin_id?: number
  status?: string
}

// Notification DTOs
export interface NotificationCreateRequest {
  user_id: number
  type: 'booking' | 'payment' | 'maintenance' | 'review' | 'system'
  title: string
  message: string
  action_url?: string
}

export interface NotificationListParams extends SearchParams {
  user_id?: number
  type?: string
  is_read?: boolean
}

// System Settings DTOs
export interface SystemSettingsUpdateRequest {
  key: string
  value: string
  description?: string
}

export interface SystemSettingsListParams extends SearchParams {
  key?: string
}

// Audit Log DTOs
export interface AuditLogListParams extends SearchParams {
  user_id?: number
  action?: string
  resource_type?: string
  resource_id?: number
  date_from?: string
  date_to?: string
}

// File Upload DTOs
export interface FileUploadRequest {
  file: File
  type: 'vehicle_image' | 'vendor_logo' | 'user_avatar' | 'document'
  entity_id?: number
}

export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mime_type: string
}

// Statistics DTOs
export interface DashboardStats {
  total_users: number
  total_vendors: number
  total_vehicles: number
  total_bookings: number
  active_bookings: number
  total_revenue: number
  monthly_revenue: number
  average_rating: number
}

export interface VendorStats {
  total_vehicles: number
  active_vehicles: number
  total_bookings: number
  active_bookings: number
  completed_bookings: number
  total_revenue: number
  monthly_revenue: number
  average_rating: number
  total_reviews: number
}

export interface UserStats {
  total_bookings: number
  active_bookings: number
  completed_bookings: number
  cancelled_bookings: number
  total_spent: number
  points_earned: number
  current_tier: string
  reviews_written: number
}
