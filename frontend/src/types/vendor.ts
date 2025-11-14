export interface Vendor {
  id: number;
  user_id: number;
  company_name: string;
  business_type: string;
  contact_email: string;
  contact_phone: string;
  description: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  settings?: {
    auto_confirm_bookings: boolean;
    minimum_booking_duration: number;
    maximum_booking_duration: number;
    advance_booking_limit: number;
    commission_rate: number;
    minimum_price_per_day: number;
    notification_settings?: {
      new_bookings: boolean;
      booking_cancellations: boolean;
      payment_updates: boolean;
      reviews: boolean;
      sms_urgent: boolean;
    }
  }
}