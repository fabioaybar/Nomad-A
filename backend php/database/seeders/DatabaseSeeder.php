<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@carrental.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create test vendor
        $vendor = User::create([
            'name' => 'John Vendor',
            'email' => 'vendor@example.com',
            'password' => Hash::make('password'),
            'role' => 'vendor',
            'phone' => '+1234567890',
            'address' => '123 Main St, New York, NY',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'is_active' => true,
        ]);

        // Create test user
        $user = User::create([
            'name' => 'Jane User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '+0987654321',
            'address' => '456 Oak Ave, New York, NY',
            'latitude' => 40.7589,
            'longitude' => -73.9851,
            'is_active' => true,
        ]);

        // Create test vehicles
        $vehicles = [
            [
                'vendor_id' => $vendor->id,
                'make' => 'Toyota',
                'model' => 'Camry',
                'year' => 2023,
                'color' => 'Silver',
                'license_plate' => 'ABC-123',
                'type' => 'sedan',
                'fuel_type' => 'hybrid',
                'transmission' => 'automatic',
                'seats' => 5,
                'price_per_day' => 75.00,
                'description' => 'Comfortable hybrid sedan perfect for city driving.',
                'features' => ['AC', 'GPS', 'Bluetooth', 'Backup Camera'],
                'images' => ['https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'],
                'latitude' => 40.7489,
                'longitude' => -73.9857,
                'location_address' => '789 Park Ave, New York, NY',
                'is_available' => true,
                'status' => 'approved',
            ],
            [
                'vendor_id' => $vendor->id,
                'make' => 'Honda',
                'model' => 'CR-V',
                'year' => 2022,
                'color' => 'Blue',
                'license_plate' => 'XYZ-789',
                'type' => 'suv',
                'fuel_type' => 'petrol',
                'transmission' => 'automatic',
                'seats' => 7,
                'price_per_day' => 95.00,
                'description' => 'Spacious SUV ideal for family trips and adventures.',
                'features' => ['AC', 'GPS', 'Bluetooth', '4WD', 'Roof Rack'],
                'images' => ['https://images.pexels.com/photos/707046/pexels-photo-707046.jpeg'],
                'latitude' => 40.7614,
                'longitude' => -73.9776,
                'location_address' => '321 Fifth Ave, New York, NY',
                'is_available' => true,
                'status' => 'approved',
            ],
        ];

        foreach ($vehicles as $vehicleData) {
            Vehicle::create($vehicleData);
        }
    }
}