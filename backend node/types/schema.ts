// Database Schema Types for PHP/MySQL Backend

// Core Tables
export interface UsersTable {
  id: number
  name: string
  email: string
  password: string
  role: 'user' | 'vendor' | 'admin'
  is_active: boolean
  phone?: string
  email_verified_at?: string
  remember_token?: string
  created_at: string
  updated_at: string
  last_login?: string
}

export interface VendorsTable {
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
}

export interface VehiclesTable {
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
  price_per_day: number
  location_address: string
  latitude?: number
  longitude?: number
  is_available: boolean
  is_rented: boolean
  rental_status: 'available' | 'rented' | 'maintenance' | 'out_of_service'
  average_rating?: number
  total_reviews: number
  images: string // JSON array stored as string
  features: string // JSON array stored as string
  description?: string
  created_at: string
  updated_at: string
}

export interface BookingsTable {
  id: number
  user_id: number
  vehicle_id: number
  vendor_id: number
  start_date: string
  end_date: string
  pickup_location: string
  return_location: string
  pickup_time?: string
  return_time?: string
  total_cost: number
  daily_rate: number
  number_of_days: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  transaction_id?: string
  notes?: string
  cancellation_reason?: string
  created_at: string
  updated_at: string
}

export interface ReviewsTable {
  id: number
  booking_id: number
  user_id: number
  vehicle_id: number
  vendor_id: number
  rating: number
  title?: string
  comment?: string
  is_anonymous: boolean
  created_at: string
  updated_at: string
}

export interface MaintenanceTable {
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
}

export interface RewardsTable {
  id: number
  user_id: number
  type: 'points' | 'discount' | 'bonus'
  amount: number
  description: string
  status: 'active' | 'used' | 'expired'
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface DiscountsTable {
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

export interface UserRewardsTable {
  id: number
  user_id: number
  points: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  next_tier: string
  points_to_next: number
  active_discount_id?: number
  created_at: string
  updated_at: string
}

export interface ConversationsTable {
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
}

export interface ChatMessagesTable {
  id: number
  conversation_id: number
  sender_id: number
  sender_type: 'user' | 'vendor' | 'admin'
  message: string
  message_type: 'text' | 'image' | 'file'
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface NotificationsTable {
  id: number
  user_id: number
  type: 'booking' | 'payment' | 'maintenance' | 'review' | 'system'
  title: string
  message: string
  is_read: boolean
  action_url?: string
  created_at: string
  updated_at: string
}

export interface SystemSettingsTable {
  id: number
  key: string
  value: string
  description?: string
  created_at: string
  updated_at: string
}

export interface AuditLogsTable {
  id: number
  user_id?: number
  action: string
  resource_type: string
  resource_id: number
  old_values?: string // JSON stored as string
  new_values?: string // JSON stored as string
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Pivot Tables
export interface UserDiscountsTable {
  id: number
  user_id: number
  discount_id: number
  is_active: boolean
  activated_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface VehicleFeaturesTable {
  id: number
  vehicle_id: number
  feature: string
  created_at: string
}

export interface VehicleImagesTable {
  id: number
  vehicle_id: number
  image_url: string
  is_primary: boolean
  order: number
  created_at: string
}

// Database Indexes
export interface DatabaseIndexes {
  users: {
    email: string
    role: string
    is_active: string
  }
  vendors: {
    user_id: string
    company_name: string
    business_type: string
    is_verified: string
    city: string
    country: string
  }
  vehicles: {
    vendor_id: string
    make: string
    type: string
    fuel_type: string
    is_available: string
    rental_status: string
    price_per_day: string
    location: string
  }
  bookings: {
    user_id: string
    vehicle_id: string
    vendor_id: string
    status: string
    payment_status: string
    start_date: string
    end_date: string
  }
  reviews: {
    user_id: string
    vehicle_id: string
    vendor_id: string
    booking_id: string
    rating: string
  }
  maintenance: {
    vehicle_id: string
    vendor_id: string
    status: string
    scheduled_date: string
  }
  conversations: {
    user_id: string
    vendor_id: string
    admin_id: string
    status: string
  }
  chat_messages: {
    conversation_id: string
    sender_id: string
    created_at: string
  }
  notifications: {
    user_id: string
    type: string
    is_read: string
    created_at: string
  }
  audit_logs: {
    user_id: string
    action: string
    resource_type: string
    resource_id: string
    created_at: string
  }
}

// Database Constraints
export interface DatabaseConstraints {
  foreign_keys: {
    vendors_user_id: 'vendors.user_id -> users.id'
    vehicles_vendor_id: 'vehicles.vendor_id -> vendors.id'
    bookings_user_id: 'bookings.user_id -> users.id'
    bookings_vehicle_id: 'bookings.vehicle_id -> vehicles.id'
    bookings_vendor_id: 'bookings.vendor_id -> vendors.id'
    reviews_booking_id: 'reviews.booking_id -> bookings.id'
    reviews_user_id: 'reviews.user_id -> users.id'
    reviews_vehicle_id: 'reviews.vehicle_id -> vehicles.id'
    reviews_vendor_id: 'reviews.vendor_id -> vendors.id'
    maintenance_vehicle_id: 'maintenance.vehicle_id -> vehicles.id'
    maintenance_vendor_id: 'maintenance.vendor_id -> vendors.id'
    rewards_user_id: 'rewards.user_id -> users.id'
    user_rewards_user_id: 'user_rewards.user_id -> users.id'
    user_rewards_active_discount_id: 'user_rewards.active_discount_id -> discounts.id'
    conversations_user_id: 'conversations.user_id -> users.id'
    conversations_vendor_id: 'conversations.vendor_id -> vendors.id'
    conversations_admin_id: 'conversations.admin_id -> users.id'
    conversations_booking_id: 'conversations.booking_id -> bookings.id'
    chat_messages_conversation_id: 'chat_messages.conversation_id -> conversations.id'
    chat_messages_sender_id: 'chat_messages.sender_id -> users.id'
    notifications_user_id: 'notifications.user_id -> users.id'
    audit_logs_user_id: 'audit_logs.user_id -> users.id'
  }
  unique_constraints: {
    users_email: 'users.email'
    vendors_user_id: 'vendors.user_id'
    user_rewards_user_id: 'user_rewards.user_id'
  }
  check_constraints: {
    users_role: "users.role IN ('user', 'vendor', 'admin')"
    vendors_business_type: "vendors.business_type IN ('individual', 'company', 'enterprise')"
    vehicles_type: "vehicles.type IN ('sedan', 'suv', 'hatchback', 'convertible', 'coupe', 'wagon', 'pickup', 'van')"
    vehicles_fuel_type: "vehicles.fuel_type IN ('gasoline', 'diesel', 'hybrid', 'electric')"
    vehicles_transmission: "vehicles.transmission IN ('manual', 'automatic')"
    vehicles_rental_status: "vehicles.rental_status IN ('available', 'rented', 'maintenance', 'out_of_service')"
    bookings_status: "bookings.status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')"
    bookings_payment_status: "bookings.payment_status IN ('pending', 'paid', 'failed', 'refunded')"
    reviews_rating: 'reviews.rating BETWEEN 1 AND 5'
    maintenance_type: "maintenance.type IN ('routine', 'repair', 'inspection', 'cleaning')"
    maintenance_status: "maintenance.status IN ('scheduled', 'in_progress', 'completed', 'cancelled')"
    rewards_type: "rewards.type IN ('points', 'discount', 'bonus')"
    rewards_status: "rewards.status IN ('active', 'used', 'expired')"
    discounts_type: "discounts.type IN ('percentage', 'fixed')"
    user_rewards_tier: "user_rewards.tier IN ('bronze', 'silver', 'gold', 'platinum')"
    conversations_status: "conversations.status IN ('active', 'closed', 'archived')"
    chat_messages_sender_type: "chat_messages.sender_type IN ('user', 'vendor', 'admin')"
    chat_messages_message_type: "chat_messages.message_type IN ('text', 'image', 'file')"
    notifications_type: "notifications.type IN ('booking', 'payment', 'maintenance', 'review', 'system')"
  }
}
