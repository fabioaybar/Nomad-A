const { UserModel, VendorModel, VehicleModel, BookingModel, ReviewModel, MaintenanceModel, RewardModel, DiscountModel, NotificationModel, PaymentModel, ReportModel } = require('./models')

const seedData = async () => {
  console.log('🌱 Starting database seeding...')

  try {
    // Create admin user
    const admin = await UserModel.create({
      name: 'Admin User',
      email: 'admin@rentacar.com',
      password: 'admin123', // Plain text for testing
      role: 'admin',
      phone: '+56912345678',
      is_active: true
    })
    console.log('✅ Admin user created')

    // Create regular users
    const user1 = await UserModel.create({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'user123', // Plain text for testing
      role: 'user',
      phone: '+56987654321',
      is_active: true
    })

    const user2 = await UserModel.create({
      name: 'María González',
      email: 'maria@example.com',
      password: 'user123', // Plain text for testing
      role: 'user',
      phone: '+56911111111',
      is_active: true
    })
    console.log('✅ Regular users created')

    // Create vendor users
    const vendorUser1 = await UserModel.create({
      name: 'Carlos Silva',
      email: 'carlos@autorent.com',
      password: 'vendor123', // Plain text for testing
      role: 'vendor',
      phone: '+56922222222',
      is_active: true
    })

    const vendorUser2 = await UserModel.create({
      name: 'Ana Rodríguez',
      email: 'ana@carrental.com',
      password: 'vendor123', // Plain text for testing
      role: 'vendor',
      phone: '+56933333333',
      is_active: true
    })
    console.log('✅ Vendor users created')

    // Create vendors
    const vendor1 = await VendorModel.create({
      user_id: vendorUser1.id,
      company_name: 'AutoRent Chile',
      business_type: 'company',
      contact_email: 'carlos@autorent.com',
      contact_phone: '+56922222222',
      description: 'Professional car rental service in Santiago',
      address: 'Av. Providencia 1234',
      city: 'Santiago',
      country: 'Chile',
      postal_code: '7500000',
      is_verified: true,
      rating: 4.5,
      total_vehicles: 0,
      total_bookings: 0
    })

    const vendor2 = await VendorModel.create({
      user_id: vendorUser2.id,
      company_name: 'CarRental Express',
      business_type: 'individual',
      contact_email: 'ana@carrental.com',
      contact_phone: '+56933333333',
      description: 'Quick and reliable car rental',
      address: 'Las Condes 567',
      city: 'Santiago',
      country: 'Chile',
      postal_code: '7500000',
      is_verified: true,
      rating: 4.2,
      total_vehicles: 0,
      total_bookings: 0
    })
    console.log('✅ Vendors created')

    // Create vehicles
    const vehicle1 = await VehicleModel.create({
      vendor_id: vendor1.id,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'White',
      type: 'sedan',
      fuel_type: 'gasoline',
      transmission: 'automatic',
      engine_size: '2.5L',
      mileage: 15000,
      seats: 5,
      doors: 4,
      price_per_day: 45000,
      location_address: 'Av. Providencia 1234, Santiago',
      latitude: -33.4172,
      longitude: -70.6064,
      is_available: true,
      is_rented: false,
      rental_status: 'available',
      average_rating: 4.5,
      total_reviews: 12,
      images: ['/images/vehicles/toyota-camry-1.jpg', '/images/vehicles/toyota-camry-2.jpg'],
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Ports', 'Backup Camera'],
      description: 'Comfortable and reliable sedan perfect for city driving'
    })

    const vehicle2 = await VehicleModel.create({
      vendor_id: vendor1.id,
      make: 'Honda',
      model: 'CR-V',
      year: 2021,
      color: 'Silver',
      type: 'suv',
      fuel_type: 'gasoline',
      transmission: 'automatic',
      engine_size: '1.5L Turbo',
      mileage: 25000,
      seats: 7,
      doors: 5,
      price_per_day: 55000,
      location_address: 'Av. Providencia 1234, Santiago',
      latitude: -33.4172,
      longitude: -70.6064,
      is_available: true,
      is_rented: false,
      rental_status: 'available',
      average_rating: 4.3,
      total_reviews: 8,
      images: ['/images/vehicles/honda-crv-1.jpg', '/images/vehicles/honda-crv-2.jpg'],
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Ports', 'Backup Camera', '4WD'],
      description: 'Spacious SUV ideal for family trips'
    })

    const vehicle3 = await VehicleModel.create({
      vendor_id: vendor2.id,
      make: 'BMW',
      model: '3 Series',
      year: 2023,
      color: 'Black',
      type: 'sedan',
      fuel_type: 'gasoline',
      transmission: 'automatic',
      engine_size: '2.0L Turbo',
      mileage: 5000,
      seats: 5,
      doors: 4,
      price_per_day: 75000,
      location_address: 'Las Condes 567, Santiago',
      latitude: -33.4172,
      longitude: -70.6064,
      is_available: true,
      is_rented: false,
      rental_status: 'available',
      average_rating: 4.8,
      total_reviews: 5,
      images: ['/images/vehicles/bmw-3series-1.jpg', '/images/vehicles/bmw-3series-2.jpg'],
      features: ['Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Ports', 'Backup Camera', 'Leather Seats', 'Premium Sound System'],
      description: 'Luxury sedan with premium features'
    })

    const vehicle4 = await VehicleModel.create({
      vendor_id: vendor2.id,
      make: 'Ford',
      model: 'Mustang',
      year: 2022,
      color: 'Red',
      type: 'coupe',
      fuel_type: 'gasoline',
      transmission: 'manual',
      engine_size: '5.0L V8',
      mileage: 8000,
      seats: 4,
      doors: 2,
      price_per_day: 95000,
      location_address: 'Las Condes 567, Santiago',
      latitude: -33.4172,
      longitude: -70.6064,
      is_available: false,
      is_rented: true,
      rental_status: 'rented',
      average_rating: 4.9,
      total_reviews: 3,
      images: ['/images/vehicles/ford-mustang-1.jpg', '/images/vehicles/ford-mustang-2.jpg'],
      features: ['Air Conditioning', 'Bluetooth', 'USB Ports', 'Leather Seats', 'Premium Sound System', 'Sunroof'],
      description: 'Iconic sports car for an unforgettable driving experience'
    })
    console.log('✅ Vehicles created')

    // Update vendor vehicle counts
    await VendorModel.update(vendor1.id, { total_vehicles: 2 })
    await VendorModel.update(vendor2.id, { total_vehicles: 2 })

    // Create bookings
    const booking1 = await BookingModel.create({
      user_id: user1.id,
      vehicle_id: vehicle1.id,
      vendor_id: vendor1.id,
      start_date: '2024-01-15',
      end_date: '2024-01-17',
      pickup_location: 'Av. Providencia 1234, Santiago',
      return_location: 'Av. Providencia 1234, Santiago',
      pickup_time: '10:00',
      return_time: '10:00',
      total_cost: 90000,
      daily_rate: 45000,
      number_of_days: 2,
      status: 'completed',
      payment_status: 'paid',
      payment_method: 'credit_card',
      transaction_id: 'txn_123456789',
      notes: 'Smooth rental experience'
    })

    const booking2 = await BookingModel.create({
      user_id: user2.id,
      vehicle_id: vehicle4.id,
      vendor_id: vendor2.id,
      start_date: '2024-01-20',
      end_date: '2024-01-25',
      pickup_location: 'Las Condes 567, Santiago',
      return_location: 'Las Condes 567, Santiago',
      pickup_time: '14:00',
      return_time: '14:00',
      total_cost: 475000,
      daily_rate: 95000,
      number_of_days: 5,
      status: 'active',
      payment_status: 'paid',
      payment_method: 'credit_card',
      transaction_id: 'txn_987654321',
      notes: 'Weekend getaway rental'
    })
    console.log('✅ Bookings created')

    // Create reviews
    const review1 = await ReviewModel.create({
      booking_id: booking1.id,
      user_id: user1.id,
      vehicle_id: vehicle1.id,
      vendor_id: vendor1.id,
      rating: 5,
      title: 'Excellent service',
      comment: 'The car was in perfect condition and the service was outstanding. Highly recommended!',
      is_anonymous: false
    })

    const review2 = await ReviewModel.create({
      booking_id: booking2.id,
      user_id: user2.id,
      vehicle_id: vehicle4.id,
      vendor_id: vendor2.id,
      rating: 5,
      title: 'Amazing experience',
      comment: 'The Mustang was incredible! Perfect for our weekend trip. Will definitely rent again.',
      is_anonymous: false
    })
    console.log('✅ Reviews created')

    // Update vendor booking counts
    await VendorModel.update(vendor1.id, { total_bookings: 1 })
    await VendorModel.update(vendor2.id, { total_bookings: 1 })

    // Create maintenance records
    const maintenance1 = await MaintenanceModel.create({
      vehicle_id: vehicle1.id,
      vendor_id: vendor1.id,
      type: 'routine',
      description: 'Regular oil change and inspection',
      scheduled_date: '2024-02-01',
      estimated_cost: 25000,
      status: 'scheduled',
      priority: 'medium'
    })

    const maintenance2 = await MaintenanceModel.create({
      vehicle_id: vehicle2.id,
      vendor_id: vendor1.id,
      type: 'repair',
      description: 'Brake pad replacement',
      scheduled_date: '2024-01-25',
      estimated_cost: 45000,
      status: 'completed',
      priority: 'high',
      actual_cost: 42000,
      completed_date: '2024-01-25'
    })
    console.log('✅ Maintenance records created')

    // Create rewards
    const reward1 = await RewardModel.create({
      name: 'Welcome Bonus',
      description: 'Get 1000 points for your first booking',
      type: 'points',
      value: 1000,
      is_active: true,
      expiry_date: '2024-12-31',
      min_booking_amount: 0
    })

    const reward2 = await RewardModel.create({
      name: 'Loyalty Discount',
      description: 'Get 10% off your next booking',
      type: 'discount',
      value: 10,
      is_active: true,
      expiry_date: '2024-12-31',
      min_booking_amount: 50000
    })
    console.log('✅ Rewards created')

    // Create discounts
    const discount1 = await DiscountModel.create({
      code: 'WELCOME10',
      name: 'Welcome Discount',
      description: '10% off for new users',
      type: 'percentage',
      value: 10,
      max_discount_amount: 20000,
      min_booking_amount: 30000,
      usage_limit: 100,
      used_count: 0,
      is_active: true,
      start_date: '2024-01-01',
      end_date: '2024-12-31'
    })

    const discount2 = await DiscountModel.create({
      code: 'SUMMER20',
      name: 'Summer Special',
      description: '20% off summer bookings',
      type: 'percentage',
      value: 20,
      max_discount_amount: 50000,
      min_booking_amount: 100000,
      usage_limit: 50,
      used_count: 0,
      is_active: true,
      start_date: '2024-01-01',
      end_date: '2024-03-31'
    })
    console.log('✅ Discounts created')

    // Create notifications
    const notification1 = await NotificationModel.create({
      user_id: user1.id,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Your booking for Toyota Camry has been confirmed',
      is_read: false,
      data: { booking_id: booking1.id, vehicle_id: vehicle1.id }
    })

    const notification2 = await NotificationModel.create({
      user_id: user2.id,
      type: 'payment_success',
      title: 'Payment Successful',
      message: 'Your payment for Ford Mustang has been processed',
      is_read: true,
      data: { booking_id: booking2.id, amount: 475000 }
    })
    console.log('✅ Notifications created')

    // Create payments
    const payment1 = await PaymentModel.create({
      booking_id: booking1.id,
      user_id: user1.id,
      vendor_id: vendor1.id,
      amount: 90000,
      currency: 'CLP',
      payment_method: 'credit_card',
      transaction_id: 'txn_123456789',
      status: 'completed',
      processed_at: '2024-01-15T10:00:00Z'
    })

    const payment2 = await PaymentModel.create({
      booking_id: booking2.id,
      user_id: user2.id,
      vendor_id: vendor2.id,
      amount: 475000,
      currency: 'CLP',
      payment_method: 'credit_card',
      transaction_id: 'txn_987654321',
      status: 'completed',
      processed_at: '2024-01-20T14:00:00Z'
    })
    console.log('✅ Payments created')

    // Create reports
    const report1 = await ReportModel.create({
      user_id: user1.id,
      type: 'vehicle_issue',
      title: 'Vehicle Problem Report',
      description: 'The vehicle had some issues during my rental period',
      status: 'pending',
      priority: 'medium',
      reported_item_id: vehicle1.id,
      reported_item_type: 'vehicle'
    })

    const report2 = await ReportModel.create({
      user_id: user2.id,
      type: 'vendor_complaint',
      title: 'Vendor Service Complaint',
      description: 'Poor customer service from the vendor',
      status: 'resolved',
      priority: 'high',
      reported_item_id: vendor2.id,
      reported_item_type: 'vendor',
      resolved_at: '2024-01-22T10:00:00Z',
      resolution_notes: 'Issue resolved with vendor'
    })
    console.log('✅ Reports created')

    console.log('🎉 Database seeding completed successfully!')
    console.log('\n📋 Test Accounts Created:')
    console.log('Admin: admin@rentacar.com / admin123')
    console.log('User: juan@example.com / user123')
    console.log('User: maria@example.com / user123')
    console.log('Vendor: carlos@autorent.com / vendor123')
    console.log('Vendor: ana@carrental.com / vendor123')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
}

module.exports = { seedData }

