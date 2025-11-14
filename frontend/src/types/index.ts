export interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'vendor' | 'admin'
  phone?: string
  address?: string
  latitude?: number
  longitude?: number
  profile_image?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: number
  vendor_id: number
  make: string
  model: string
  year: number
  color: string
  license_plate: string
  type: 'sedan' | 'suv' | 'hatchback' | 'convertible' | 'truck' | 'van'
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  transmission: 'manual' | 'automatic'
  seats: number
  price_per_day: number
  description?: string
  features?: string[]
  images?: string[]
  latitude: number
  longitude: number
  location_address: string
  is_available: boolean
  status: 'pending' | 'approved' | 'rejected'
  vendor?: User
  reviews?: Review[]
  average_rating?: number
  review_count?: number
  created_at: string
  updated_at: string
}

export interface Booking {
  id: number
  user_id: number
  vehicle_id: number
  start_date: string
  end_date: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled'
  pickup_location: string
  dropoff_location: string
  notes?: string
  user?: User
  vehicle?: Vehicle
  payment?: Payment
  review?: Review
  total_days?: number
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  user_id: number
  vehicle_id: number
  booking_id: number
  rating: number
  comment?: string
  user?: User
  vehicle?: Vehicle
  booking?: Booking
  created_at: string
  updated_at: string
}

export interface Payment {
  id: number
  booking_id: number
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method?: string
  transaction_id?: string
  payment_data?: any
  booking?: Booking
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: 'user' | 'vendor'
  phone?: string
  address?: string
  latitude?: number
  longitude?: number
}

export interface VehicleFilters {
  type?: string
  min_price?: number
  max_price?: number
  fuel_type?: string
  transmission?: string
  seats?: number
  search?: string
  latitude?: number
  longitude?: number
  radius?: number
  start_date?: string
  end_date?: string
}

export interface PaginationMeta {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: PaginationMeta
}

export interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  source: {
    name: string
  }
}

export interface CurrencyRates {
  base: string
  rates: Record<string, number>
}