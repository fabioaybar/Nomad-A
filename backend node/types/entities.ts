// Core Entity Types for PHP/MySQL Backend Integration

export interface User {
  id: number
  name: string
  email: string
  password?: string // Only for creation/updates, never returned from API
  role: 'user' | 'vendor' | 'admin'
  is_active: boolean
  phone?: string
  created_at: string
  updated_at: string
  last_login?: string
}

export interface Vendor {
  id: number
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
  is_verified: boolean
  rating?: number
  total_vehicles: number
  total_bookings: number
  created_at: string
  updated_at: string
  user?: User // Populated when needed
}

export interface Vehicle {
  id: number
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
  price_per_day: number // In CLP (Chilean Pesos)
  location_address: string
  latitude?: number
  longitude?: number
  is_available: boolean
  is_rented: boolean
  rental_status: 'available' | 'rented' | 'maintenance' | 'out_of_service'
  average_rating?: number
  total_reviews: number
  images: string[]
  features: string[]
  description?: string
  created_at: string
  updated_at: string
  vendor?: Vendor // Populated when needed
}

export interface Booking {
  id: number
  user_id: number
  vehicle_id: number
  vendor_id: number
  start_date: string
  end_date: number
  pickup_location: string
  return_location: string
  pickup_time?: string
  return_time?: string
  total_cost: number // In CLP
  daily_rate: number // In CLP
  number_of_days: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  transaction_id?: string
  notes?: string
  cancellation_reason?: string
  created_at: string
  updated_at: string
  user?: User // Populated when needed
  vehicle?: Vehicle // Populated when needed
  vendor?: Vendor // Populated when needed
}

export interface Review {
  id: number
  booking_id: number
  user_id: number
  vehicle_id: number
  vendor_id: number
  rating: number // 1-5 stars
  title?: string
  comment?: string
  is_anonymous: boolean
  created_at: string
  updated_at: string
  user?: User // Populated when needed
  vehicle?: Vehicle // Populated when needed
  vendor?: Vendor // Populated when needed
}

export interface Maintenance {
  id: number
  vehicle_id: number
  vendor_id: number
  type: 'routine' | 'repair' | 'inspection' | 'cleaning'
  title: string
  description?: string
  cost?: number
  scheduled_date: string
  completed_date?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
  vehicle?: Vehicle // Populated when needed
  vendor?: Vendor // Populated when needed
}

export interface Reward {
  id: number
  user_id: number
  type: 'points' | 'discount' | 'bonus'
  amount: number
  description: string
  status: 'active' | 'used' | 'expired'
  expires_at?: string
  created_at: string
  updated_at: string
  user?: User // Populated when needed
}

export interface Discount {
  id: number
  name: string
  description: string
  type: 'percentage' | 'fixed'
  value: number
  points_required: number
  is_active: boolean
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface UserRewards {
  user_id: number
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  next_tier: string
  points_to_next: number
  active_discount_id?: number
  created_at: string
  updated_at: string
  user?: User // Populated when needed
  active_discount?: Discount // Populated when needed
}

export interface ChatMessage {
  id: number
  conversation_id: number
  sender_id: number
  sender_type: 'user' | 'vendor' | 'admin'
  message: string
  message_type: 'text' | 'image' | 'file'
  is_read: boolean
  created_at: string
  updated_at: string
  sender?: User | Vendor // Populated when needed
}

export interface Conversation {
  id: number
  user_id: number
  vendor_id?: number
  admin_id?: number
  booking_id?: number
  subject?: string
  status: 'active' | 'closed' | 'archived'
  last_message_at?: string
  created_at: string
  updated_at: string
  user?: User // Populated when needed
  vendor?: Vendor // Populated when needed
  admin?: User // Populated when needed
  booking?: Booking // Populated when needed
  messages?: ChatMessage[] // Populated when needed
}

export interface Notification {
  id: number
  user_id: number
  type: 'booking' | 'payment' | 'maintenance' | 'review' | 'system'
  title: string
  message: string
  is_read: boolean
  action_url?: string
  created_at: string
  updated_at: string
  user?: User // Populated when needed
}

export interface SystemSettings {
  id: number
  key: string
  value: string
  description?: string
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: number
  user_id?: number
  action: string
  resource_type: string
  resource_id: number
  old_values?: Record<string, any>
  new_values?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
  user?: User // Populated when needed
}
