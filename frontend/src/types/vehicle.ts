export interface Vehicle {
  id: number;
  make: string;
  model: string;
  license_plate: string;
  type: 'sedan' | 'suv' | 'hatchback';
  price_per_day: number;
  rental_status: 'available' | 'booked' | 'maintenance';
  image?: string;
  images?: string[];
  vendor_id: number;
}

export interface VehicleFormData {
  id?: number;
  name: string;
  licensePlate: string;
  type: Vehicle['type'];
  pricePerDay: number;
  status: Vehicle['rental_status'];
  image?: string;
}