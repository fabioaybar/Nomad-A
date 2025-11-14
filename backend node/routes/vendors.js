const express = require('express')
const { body } = require('express-validator')
const { VendorModel, BookingModel, VehicleModel, ReviewModel, MaintenanceModel, UserModel } = require('../database/models')
const { authenticate, authorize } = require('../middleware/auth')
const { validate, asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// @route   GET /api/vendors
// @desc    Get all vendors
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.is_verified !== undefined) filters.is_verified = req.query.is_verified === 'true'
  if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === 'true'
  if (req.query.city) filters.city = req.query.city
  if (req.query.country) filters.country = req.query.country
  if (req.query.business_type) filters.business_type = req.query.business_type
  if (req.query.search) {
    const vendors = await VendorModel.search(req.query.search, filters)
    return res.json({
      success: true,
      data: {
        vendors,
        pagination: {
          page: 1,
          limit: vendors.length,
          total: vendors.length,
          pages: 1
        }
      }
    })
  }

  const result = await VendorModel.paginate(page, limit, filters)

  res.json({
    success: true,
    data: {
      vendors: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/vendors/profile
// @desc    Get current vendor profile
// @access  Private (Vendor)
router.get('/profile', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  res.json({
    success: true,
    data: vendor
  })
}))

// @route   GET /api/vendors/reviews
// @desc    Get reviews for current vendor
// @access  Private (Vendor)
router.get('/reviews', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vendor_id: vendor.id }

  if (req.query.rating) filters.rating = parseInt(req.query.rating)
  if (req.query.is_approved !== undefined) filters.is_approved = req.query.is_approved === 'true'

  const result = await ReviewModel.paginate(page, limit, filters)
  const users = await UserModel.findAll()
  const vehicles = await VehicleModel.findByVendorId(vendor.id)

  // Enrich reviews with user and vehicle data
  const enrichedReviews = result.data.map(review => {
    const user = users.find(u => u.id === review.user_id)
    const vehicle = vehicles.find(v => v.id === review.vehicle_id)
    
    return {
      ...review,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email
      } : {
        id: review.user_id,
        name: 'Usuario no encontrado',
        email: 'N/A'
      },
      vehicle: vehicle ? {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year
      } : null
    }
  })

  res.json({
    success: true,
    data: enrichedReviews,
    pagination: result.pagination
  })
}))

// @route   GET /api/vendors/vehicles
// @desc    Get current vendor's vehicles
// @access  Private (Vendor)
router.get('/vehicles', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  const vehicles = await VehicleModel.findByVendorId(vendor.id)
  
  res.json({
    success: true,
    data: vehicles
  })
}))

// @route   GET /api/vendors/bookings
// @desc    Get current vendor's bookings
// @access  Private (Vendor)
router.get('/bookings', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  const bookings = await BookingModel.findByVendorId(vendor.id)
  const vehicles = await VehicleModel.findByVendorId(vendor.id)
  const users = await UserModel.findAll()
  
  console.log('🔍 Debug - Users found:', users.length)
  console.log('🔍 Debug - First user:', users[0])
  console.log('🔍 Debug - Bookings found:', bookings.length)
  console.log('🔍 Debug - First booking user_id:', bookings[0]?.user_id)
  
  // Enrich bookings with vehicle and user data
  const enrichedBookings = bookings.map(booking => {
    const vehicle = vehicles.find(v => v.id === booking.vehicle_id)
    const user = users.find(u => u.id === booking.user_id)
    
    console.log(`🔍 Debug - Booking ${booking.id} user_id: ${booking.user_id}, found user:`, user)
    
    return {
      ...booking,
      vehicle: vehicle ? {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        type: vehicle.type
      } : null,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      } : {
        id: booking.user_id,
        name: 'Usuario no encontrado',
        email: 'N/A',
        phone: 'N/A'
      }
    }
  })
  
  res.json({
    success: true,
    data: enrichedBookings
  })
}))

// @route   GET /api/vendors/finances/stats
// @desc    Get current vendor's financial stats
// @access  Private (Vendor)
router.get('/finances/stats', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  const bookings = await BookingModel.findByVendorId(vendor.id)
  const bookingsArray = Array.isArray(bookings) ? bookings : []
  const totalRevenue = bookingsArray.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
  const completedBookings = bookingsArray.filter(booking => booking.status === 'completed').length
  const pendingBookings = bookingsArray.filter(booking => booking.status === 'pending').length
  
  // Calculate monthly revenue (current month)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyBookings = bookingsArray.filter(booking => {
    const bookingDate = new Date(booking.created_at)
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear
  })
  const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
  
  // Calculate growth (mock for now)
  const revenueGrowth = 12 // Mock growth percentage
  const bookingsGrowth = 8 // Mock growth percentage
  
  res.json({
    success: true,
    data: {
      total_revenue: totalRevenue,
      revenue_growth: revenueGrowth,
      total_bookings: bookingsArray.length,
      completed_bookings: completedBookings,
      pending_bookings: pendingBookings,
      pending_payments: pendingBookings * 90000, // Mock pending payments
      monthly_revenue: monthlyRevenue,
      monthly_bookings: monthlyBookings.length,
      net_income: totalRevenue * 0.8, // Mock net income (80% of revenue)
      profit_margin: 20, // Mock profit margin
      average_booking_value: bookingsArray.length > 0 ? totalRevenue / bookingsArray.length : 0,
      commission_rate: 10,
      commission_earned: totalRevenue * 0.1, // 10% commission
      utilization_rate: 85 // Mock utilization rate
    }
  })
}))

// @route   GET /api/vendors/maintenance
// @desc    Get current vendor's maintenance records
// @access  Private (Vendor)
router.get('/maintenance', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  const vehicles = await VehicleModel.findByVendorId(vendor.id)
  const vehicleIds = vehicles.map(v => v.id)
  const maintenance = await MaintenanceModel.findByVehicleIds(vehicleIds)
  
  res.json({
    success: true,
    data: maintenance
  })
}))

// @route   GET /api/vendors/calendar
// @desc    Get current vendor's calendar events (bookings and maintenance)
// @access  Private (Vendor)
router.get('/calendar', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  const bookings = await BookingModel.findByVendorId(vendor.id)
  const vehicles = await VehicleModel.findByVendorId(vendor.id)
  const vehicleIds = vehicles.map(v => v.id)
  const maintenance = await MaintenanceModel.findByVehicleIds(vehicleIds)
  const users = await UserModel.findAll()

  // Create calendar events from bookings
  const bookingEvents = bookings.map(booking => {
    const vehicle = vehicles.find(v => v.id === booking.vehicle_id)
    const user = users.find(u => u.id === booking.user_id)
    
    return {
      id: `booking-${booking.id}`,
      type: 'booking',
      title: `${vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehículo no encontrado'} - ${user ? user.name : 'Usuario no encontrado'}`,
      date: booking.start_date,
      endDate: booking.end_date,
      status: booking.status,
      vehicle: vehicle ? {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year
      } : null,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email
      } : null,
      booking: booking
    }
  })

  // Create calendar events from maintenance
  const maintenanceEvents = maintenance.map(maintenance => {
    const vehicle = vehicles.find(v => v.id === maintenance.vehicle_id)
    
    return {
      id: `maintenance-${maintenance.id}`,
      type: 'maintenance',
      title: `${maintenance.type} - ${vehicle ? `${vehicle.make} ${vehicle.model}` : 'Vehículo no encontrado'}`,
      date: maintenance.scheduled_date,
      endDate: maintenance.scheduled_date,
      status: maintenance.status,
      vehicle: vehicle ? {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year
      } : null,
      maintenance: maintenance
    }
  })

  // Combine all events
  const events = [...bookingEvents, ...maintenanceEvents]

  res.json({
    success: true,
    data: events
  })
}))

// @route   GET /api/vendors/analytics
// @desc    Get current vendor's analytics
// @access  Private (Vendor)
router.get('/analytics', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  const vehicles = await VehicleModel.findByVendorId(vendor.id)
  const bookings = await BookingModel.findByVendorId(vendor.id)
  const reviews = await ReviewModel.findByVendorId(vendor.id)
  
  const bookingsArray = Array.isArray(bookings) ? bookings : []
  const reviewsArray = Array.isArray(reviews) ? reviews : []
  const totalRevenue = bookingsArray.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
  
  // Calculate growth percentages
  const revenueGrowth = 12
  const bookingsGrowth = 8
  
  // Calculate fleet utilization
  const activeVehicles = vehicles.filter(v => v.status === 'available').length
  const fleetUtilization = vehicles.length > 0 ? (activeVehicles / vehicles.length) * 100 : 0
  
  // Generate vehicle performance data
  const vehiclePerformance = vehicles.map(vehicle => {
    const vehicleBookings = bookingsArray.filter(b => b.vehicle_id === vehicle.id)
    const vehicleRevenue = vehicleBookings.reduce((sum, b) => sum + (b.total_cost || 0), 0)
    const vehicleReviews = reviewsArray.filter(r => r.vehicle_id === vehicle.id)
    const avgRating = vehicleReviews.length > 0 ? 
      vehicleReviews.reduce((sum, r) => sum + r.rating, 0) / vehicleReviews.length : 0
    
    return {
      vehicle_id: vehicle.id,
      vehicle_name: `${vehicle.make} ${vehicle.model}`,
      bookings: vehicleBookings.length,
      revenue: vehicleRevenue,
      rating: avgRating
    }
  })
  
  // Generate customer insights
  const uniqueCustomers = new Set(bookingsArray.map(b => b.user_id)).size
  const repeatCustomers = bookingsArray.reduce((acc, booking) => {
    const userBookings = bookingsArray.filter(b => b.user_id === booking.user_id)
    if (userBookings.length > 1) acc.add(booking.user_id)
    return acc
  }, new Set()).size
  
  const customerInsights = {
    repeat_customers: repeatCustomers,
    new_customers: uniqueCustomers - repeatCustomers,
    average_booking_value: bookingsArray.length > 0 ? totalRevenue / bookingsArray.length : 0,
    customer_satisfaction: reviewsArray.length > 0 ? 
      reviewsArray.reduce((sum, r) => sum + r.rating, 0) / reviewsArray.length : 0
  }
  
  // Generate chart data (mock for now)
  const revenueChart = [
    { date: '2025-10-01', revenue: 90000, bookings: 1 },
    { date: '2025-10-15', revenue: 180000, bookings: 2 },
    { date: '2025-10-30', revenue: 270000, bookings: 3 }
  ]
  
  const bookingTrends = [
    { date: '2025-10-01', bookings: 1, cancellations: 0 },
    { date: '2025-10-15', bookings: 2, cancellations: 0 },
    { date: '2025-10-30', bookings: 3, cancellations: 0 }
  ]
  
  res.json({
    success: true,
    data: {
      total_revenue: totalRevenue,
      revenue_growth: revenueGrowth,
      total_bookings: bookingsArray.length,
      bookings_growth: bookingsGrowth,
      average_booking_value: bookingsArray.length > 0 ? totalRevenue / bookingsArray.length : 0,
      fleet_utilization: fleetUtilization,
      vehicle_performance: vehiclePerformance,
      customer_insights: customerInsights,
      revenue_chart: revenueChart,
      booking_trends: bookingTrends
    }
  })
}))

// @route   GET /api/vendors/conversations
// @desc    Get current vendor's conversations
// @access  Private (Vendor)
router.get('/conversations', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  const conversations = await ConversationModel.findByVendorId(vendor.id)
  
  res.json({
    success: true,
    data: conversations
  })
}))

// @route   GET /api/vendors/settings
// @desc    Get current vendor's settings
// @access  Private (Vendor)
router.get('/settings', authenticate, authorize('vendor'), asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findByUserId(req.user.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  res.json({
    success: true,
    data: {
      business_settings: {
        company_name: vendor.company_name,
        business_type: vendor.business_type,
        contact_email: vendor.contact_email,
        contact_phone: vendor.contact_phone,
        address: vendor.address,
        city: vendor.city,
        country: vendor.country
      },
      notification_settings: {
        email_notifications: true,
        sms_notifications: false,
        booking_notifications: true,
        maintenance_reminders: true
      }
    }
  })
}))

// @route   GET /api/vendors/stats
// @desc    Get vendor statistics (Admin only)
// @access  Private (Admin)
router.get('/stats', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const stats = await VendorModel.getStats()
  
  res.json({
    success: true,
    data: stats
  })
}))

// @route   GET /api/vendors/top-rated
// @desc    Get top rated vendors
// @access  Public
router.get('/top-rated', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const topVendors = await VendorModel.getTopRated(limit)
  
  res.json({
    success: true,
    data: topVendors
  })
}))

// @route   GET /api/vendors/:id
// @desc    Get vendor by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const vendor = await VendorModel.findById(req.params.id)
  
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  res.json({
    success: true,
    data: { vendor }
  })
}))

// @route   GET /api/vendors/:id/vehicles
// @desc    Get vehicles for a specific vendor
// @access  Public
router.get('/:id/vehicles', asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vendor_id: vendorId }

  if (req.query.type) filters.type = req.query.type
  if (req.query.is_available !== undefined) filters.is_available = req.query.is_available === 'true'
  if (req.query.make) filters.make = req.query.make
  if (req.query.fuel_type) filters.fuel_type = req.query.fuel_type
  if (req.query.transmission) filters.transmission = req.query.transmission
  if (req.query.min_price) {
    const vehicles = await VehicleModel.findByPriceRange(
      parseInt(req.query.min_price), 
      parseInt(req.query.max_price) || 999999
    )
    return res.json({
      success: true,
      data: {
        vehicles: vehicles.filter(v => v.vendor_id === vendorId),
        pagination: {
          page: 1,
          limit: vehicles.length,
          total: vehicles.length,
          pages: 1
        }
      }
    })
  }

  const result = await VehicleModel.paginate(page, limit, filters)

  res.json({
    success: true,
    data: {
      vehicles: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/vendors/:id/bookings
// @desc    Get bookings for a specific vendor
// @access  Private (Vendor/Admin)
router.get('/:id/bookings', authenticate, asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own bookings.'
      })
    }
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vendor_id: vendorId }

  if (req.query.status) filters.status = req.query.status
  if (req.query.payment_status) filters.payment_status = req.query.payment_status

  const result = await BookingModel.paginate(page, limit, filters)

  res.json({
    success: true,
    data: {
      bookings: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/vendors/:id/reviews
// @desc    Get reviews for a specific vendor
// @access  Public
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vendor_id: vendorId }

  if (req.query.rating) filters.rating = parseInt(req.query.rating)
  if (req.query.is_approved !== undefined) filters.is_approved = req.query.is_approved === 'true'

  const result = await ReviewModel.paginate(page, limit, filters)

  res.json({
    success: true,
    data: {
      reviews: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/vendors/:id/maintenance
// @desc    Get maintenance records for a specific vendor
// @access  Private (Vendor/Admin)
router.get('/:id/maintenance', authenticate, asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own maintenance records.'
      })
    }
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vendor_id: vendorId }

  if (req.query.status) filters.status = req.query.status

  const result = await MaintenanceModel.paginate(page, limit, filters)

  res.json({
    success: true,
    data: {
      maintenance: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/vendors/:id/finances/stats
// @desc    Get vendor financial statistics
// @access  Private (Vendor/Admin)
router.get('/:id/finances/stats', authenticate, asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own financial data.'
      })
    }
  }
  
  // Get vendor's vehicles
  const vehicles = await VehicleModel.findByVendorId(vendorId)
  const vehicleIds = vehicles.map(v => v.id)
  
  // Get bookings for vendor's vehicles
  const bookings = await BookingModel.findByVehicleIds(vehicleIds)
  
  // Calculate stats
  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
  const totalBookings = bookings.length
  const activeBookings = bookings.filter(b => b.status === 'active').length
  const completedBookings = bookings.filter(b => b.status === 'completed').length
  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  
  // Calculate monthly revenue
  const currentMonth = new Date()
  currentMonth.setDate(1)
  const monthlyBookings = bookings.filter(b => new Date(b.created_at) >= currentMonth)
  const monthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
  
  // Calculate previous month for growth comparison
  const previousMonth = new Date()
  previousMonth.setMonth(previousMonth.getMonth() - 1)
  previousMonth.setDate(1)
  const prevMonthBookings = bookings.filter(b => {
    const bookingDate = new Date(b.created_at)
    return bookingDate >= previousMonth && bookingDate < currentMonth
  })
  const prevMonthRevenue = prevMonthBookings.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
  
  // Calculate growth percentage
  const revenueGrowth = prevMonthRevenue > 0 ? 
    ((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0
  
  // Calculate pending payments
  const pendingPayments = bookings
    .filter(b => ['pending', 'confirmed', 'active'].includes(b.status))
    .reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
  
  // Calculate commission (assuming 10% commission rate)
  const commissionRate = 10
  const commissionEarned = (totalRevenue * commissionRate) / 100
  
  // Calculate net income (revenue - commission)
  const netIncome = totalRevenue - commissionEarned
  
  // Calculate profit margin
  const profitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0
  
  // Calculate utilization rate (completed bookings / total bookings)
  const utilizationRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0
  
  res.json({
    success: true,
    data: {
      totalRevenue,
      totalBookings,
      activeBookings,
      completedBookings,
      pendingBookings,
      monthlyRevenue,
      monthlyBookings: monthlyBookings.length,
      averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      pendingPayments,
      commissionRate,
      commissionEarned,
      netIncome,
      profitMargin: Math.round(profitMargin * 100) / 100,
      utilizationRate: Math.round(utilizationRate * 100) / 100
    }
  })
}))

// @route   GET /api/vendors/:id/transactions
// @desc    Get vendor transactions
// @access  Private (Vendor/Admin)
router.get('/:id/transactions', authenticate, asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own transactions.'
      })
    }
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const filters = { vendor_id: vendorId }

  if (req.query.type) filters.type = req.query.type
  if (req.query.status) filters.status = req.query.status

  const result = await PaymentModel.paginate(page, limit, filters)
  
  res.json({
    success: true,
    data: {
      transactions: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/vendors/:id/analytics
// @desc    Get vendor analytics
// @access  Private (Vendor/Admin)
router.get('/:id/analytics', authenticate, asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  const currentUser = req.user
  const period = req.query.period || 'month'

  // Check if user can access this data
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own analytics.'
      })
    }
  }
  
  // Get vendor's vehicles
  const vehicles = await VehicleModel.findByVendorId(vendorId)
  const vehicleIds = vehicles.map(v => v.id)
  
  // Get bookings for vendor's vehicles
  const bookings = await BookingModel.findByVehicleIds(vehicleIds)
  
  // Calculate date range based on period
  const now = new Date()
  let startDate = new Date()
  
  switch (period) {
    case 'week':
      startDate.setDate(now.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(now.getMonth() - 1)
      break
    case 'quarter':
      startDate.setMonth(now.getMonth() - 3)
      break
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1)
      break
  }
  
  // Filter bookings by date range
  const periodBookings = bookings.filter(b => new Date(b.created_at) >= startDate)
  
  // Generate revenue chart data
  const revenueChart = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= now) {
    const dateStr = currentDate.toISOString().split('T')[0]
    const dayBookings = periodBookings.filter(b => 
      b.created_at.startsWith(dateStr)
    )
    
    revenueChart.push({
      date: dateStr,
      revenue: dayBookings.reduce((sum, b) => sum + (b.total_cost || 0), 0),
      bookings: dayBookings.length
    })
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  // Vehicle performance
  const vehiclePerformance = vehicles.map(vehicle => {
    const vehicleBookings = bookings.filter(b => b.vehicle_id === vehicle.id)
    const revenue = vehicleBookings.reduce((sum, b) => sum + (b.total_cost || 0), 0)
    
    return {
      vehicle_id: vehicle.id,
      vehicle_name: `${vehicle.make} ${vehicle.model}`,
      bookings: vehicleBookings.length,
      revenue: revenue,
      rating: vehicle.rating || 0
    }
  }).sort((a, b) => b.revenue - a.revenue)
  
  // Customer insights
  const uniqueCustomers = new Set(bookings.map(b => b.user_id))
  const repeatCustomers = bookings.reduce((acc, booking) => {
    const userId = booking.user_id
    acc[userId] = (acc[userId] || 0) + 1
    return acc
  }, {})
  
  const customerInsights = {
    repeat_customers: Object.values(repeatCustomers).filter(count => count > 1).length,
    new_customers: uniqueCustomers.size - Object.values(repeatCustomers).filter(count => count > 1).length,
    average_booking_value: bookings.length > 0 ? 
      bookings.reduce((sum, b) => sum + (b.total_cost || 0), 0) / bookings.length : 0,
    customer_satisfaction: vehiclePerformance.length > 0 ? 
      vehiclePerformance.reduce((sum, v) => sum + v.rating, 0) / vehiclePerformance.length : 0
  }
  
  // Booking trends
  const bookingTrends = revenueChart.map(item => ({
    date: item.date,
    bookings: item.bookings,
    cancellations: bookings.filter(b => 
      b.status === 'cancelled' && b.created_at.startsWith(item.date)
    ).length
  }))
  
  res.json({
    success: true,
    data: {
      revenue_chart: revenueChart,
      vehicle_performance: vehiclePerformance,
      customer_insights: customerInsights,
      booking_trends: bookingTrends
    }
  })
}))

// @route   GET /api/vendors/:id/maintenance
// @desc    Get vendor maintenance records
// @access  Private (Vendor/Admin)
router.get('/:id/maintenance', authenticate, asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own maintenance records.'
      })
    }
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const filters = { vendor_id: vendorId }

  if (req.query.status) filters.status = req.query.status
  if (req.query.type) filters.type = req.query.type

  const result = await MaintenanceModel.paginate(page, limit, filters)

  // Populate vehicle data for each maintenance record
  const populatedMaintenance = await Promise.all(result.data.map(async (maintenance) => {
    const vehicle = await VehicleModel.findById(maintenance.vehicle_id)
    
    return {
      ...maintenance,
      vehicle
    }
  }))

  res.json({
    success: true,
    data: {
      maintenance: populatedMaintenance,
      pagination: result.pagination
    }
  })
}))

// @route   POST /api/vendors/onboard
// @desc    Vendor onboarding process
// @access  Private
router.post('/onboard', authenticate, [
  body('company_name').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  body('business_type').isIn(['individual', 'company']).withMessage('Business type must be individual or company'),
  body('contact_email').isEmail().normalizeEmail().withMessage('Please provide a valid contact email'),
  body('contact_phone').trim().isLength({ min: 10, max: 15 }).withMessage('Contact phone must be between 10 and 15 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('city').trim().isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('country').trim().isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
  body('postal_code').trim().isLength({ min: 3, max: 10 }).withMessage('Postal code must be between 3 and 10 characters'),
  body('latitude').isFloat().withMessage('Latitude must be a valid number'),
  body('longitude').isFloat().withMessage('Longitude must be a valid number')
], validate, asyncHandler(async (req, res) => {
  const vendorData = req.body
  const userId = req.user.id

  // Check if user is already a vendor
  const existingVendor = await VendorModel.findByUserId(userId)
  if (existingVendor) {
    return res.status(400).json({
      success: false,
      message: 'User is already a vendor'
    })
  }

  // Check if company name is already taken
  const existingCompany = await VendorModel.findByCompanyName(vendorData.company_name)
  if (existingCompany) {
    return res.status(400).json({
      success: false,
      message: 'Company name is already taken'
    })
  }

  // Create vendor profile
  const vendor = await VendorModel.create({
    user_id: userId,
    company_name: vendorData.company_name,
    business_type: vendorData.business_type,
    contact_email: vendorData.contact_email,
    contact_phone: vendorData.contact_phone,
    description: vendorData.description || '',
    address: vendorData.address,
    city: vendorData.city,
    country: vendorData.country,
    postal_code: vendorData.postal_code,
    latitude: parseFloat(vendorData.latitude),
    longitude: parseFloat(vendorData.longitude),
    is_verified: false, // Requires admin approval
    is_active: true,
    rating: 0,
    total_vehicles: 0,
    total_bookings: 0
  })

  // Update user role to vendor
  await UserModel.update(userId, { role: 'vendor' })

  // TODO: Handle file uploads for verification documents
  // This would typically involve uploading to cloud storage and storing references

  res.status(201).json({
    success: true,
    message: 'Vendor onboarding completed successfully. Your account is pending verification.',
    data: { vendor }
  })
}))

// @route   POST /api/vendors
// @desc    Create a new vendor
// @access  Private (Admin)
router.post('/', authenticate, authorize('admin'), [
  body('user_id').isInt().withMessage('User ID is required'),
  body('company_name').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  body('business_type').isIn(['individual', 'company']).withMessage('Business type must be individual or company'),
  body('contact_email').isEmail().normalizeEmail().withMessage('Please provide a valid contact email'),
  body('contact_phone').trim().isLength({ min: 10, max: 15 }).withMessage('Contact phone must be between 10 and 15 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
  body('address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
  body('city').trim().isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
  body('country').trim().isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
  body('postal_code').trim().isLength({ min: 3, max: 10 }).withMessage('Postal code must be between 3 and 10 characters')
], validate, asyncHandler(async (req, res) => {
  const vendorData = req.body

  // Check if user exists
  const user = await UserModel.findById(vendorData.user_id)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Check if user is already a vendor
  const existingVendor = await VendorModel.findByUserId(vendorData.user_id)
  if (existingVendor) {
    return res.status(400).json({
      success: false,
      message: 'User is already a vendor'
    })
  }

  // Check if company name is already taken
  const existingCompany = await VendorModel.findByCompanyName(vendorData.company_name)
  if (existingCompany) {
    return res.status(400).json({
      success: false,
      message: 'Company name is already taken'
    })
  }

  const vendor = await VendorModel.create({
    ...vendorData,
    is_verified: false,
    is_active: true,
    rating: 0,
    total_vehicles: 0,
    total_bookings: 0
  })

  res.status(201).json({
    success: true,
    message: 'Vendor created successfully',
    data: { vendor }
  })
}))

// @route   PUT /api/vendors/:id
// @desc    Update vendor information
// @access  Private (Vendor/Admin)
router.put('/:id', authenticate, [
  body('company_name').optional().trim().isLength({ min: 2, max: 100 }),
  body('business_type').optional().isIn(['individual', 'company']),
  body('contact_email').optional().isEmail().normalizeEmail(),
  body('contact_phone').optional().trim().isLength({ min: 10, max: 15 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('address').optional().trim().isLength({ min: 5, max: 200 }),
  body('city').optional().trim().isLength({ min: 2, max: 50 }),
  body('country').optional().trim().isLength({ min: 2, max: 50 }),
  body('postal_code').optional().trim().isLength({ min: 3, max: 10 })
], validate, asyncHandler(async (req, res) => {
  const vendorId = req.params.id
  const currentUser = req.user
  
  // Check if user is updating their own vendor profile or is admin
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== parseInt(vendorId)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
    }
  }
  
  const updateData = req.body
  
  // Update vendor information
  const updatedVendor = await VendorModel.update(vendorId, updateData)
  
  if (!updatedVendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }
  
  res.json({
    success: true,
    message: 'Vendor updated successfully',
    data: { vendor: updatedVendor }
  })
}))

// @route   PUT /api/vendors/:id/verify
// @desc    Verify vendor (Admin only)
// @access  Private (Admin)
router.put('/:id/verify', authenticate, authorize('admin'), [
  body('is_verified').isBoolean().withMessage('Verification status must be boolean')
], validate, asyncHandler(async (req, res) => {
  const vendorId = req.params.id
  const { is_verified } = req.body
  
  const updatedVendor = await VendorModel.update(vendorId, { is_verified })
  
  if (!updatedVendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }
  
  res.json({
    success: true,
    message: `Vendor ${is_verified ? 'verified' : 'unverified'} successfully`,
    data: { vendor: updatedVendor }
  })
}))

// @route   PUT /api/vendors/:id/bank
// @desc    Update vendor bank information
// @access  Private (Vendor)
router.put('/:id/bank', authenticate, [
  body('bank_name').trim().isLength({ min: 2, max: 50 }).withMessage('Bank name must be between 2 and 50 characters'),
  body('account_number').trim().isLength({ min: 8, max: 20 }).withMessage('Account number must be between 8 and 20 characters'),
  body('routing_number').optional().trim().isLength({ min: 6, max: 12 }).withMessage('Routing number must be between 6 and 12 characters'),
  body('account_type').optional().isIn(['checking', 'savings']).withMessage('Account type must be checking or savings')
], validate, asyncHandler(async (req, res) => {
  const vendorId = req.params.id
  const currentUser = req.user
  
  // Check if user is updating their own vendor profile
  const vendor = await VendorModel.findByUserId(currentUser.id)
  if (!vendor || vendor.id !== parseInt(vendorId)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }
  
  const bankData = req.body
  
  // Update vendor bank information
  const updatedVendor = await VendorModel.update(vendorId, {
    bank_name: bankData.bank_name,
    account_number: bankData.account_number,
    routing_number: bankData.routing_number,
    account_type: bankData.account_type
  })
  
  if (!updatedVendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }
  
  res.json({
    success: true,
    message: 'Bank information updated successfully',
    data: { vendor: updatedVendor }
  })
}))

// @route   PUT /api/vendors/:id/stats
// @desc    Update vendor statistics
// @access  Private (Vendor/Admin)
router.put('/:id/stats', authenticate, asyncHandler(async (req, res) => {
  const vendorId = req.params.id
  const currentUser = req.user
  
  // Check if user is updating their own vendor profile or is admin
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== parseInt(vendorId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }
  }
  
  const updatedVendor = await VendorModel.updateStats(vendorId)
  
  if (!updatedVendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }
  
  res.json({
    success: true,
    message: 'Vendor statistics updated successfully',
    data: { vendor: updatedVendor }
  })
}))

// @route   DELETE /api/vendors/:id
// @desc    Delete vendor (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const vendorId = req.params.id
  
  const vendor = await VendorModel.findById(vendorId)
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }
  
  await VendorModel.delete(vendorId)
  
  res.json({
    success: true,
    message: 'Vendor deleted successfully'
  })
}))

// @route   PUT /api/vendors/:id/settings
// @desc    Update vendor settings
// @access  Private (Vendor/Admin)
router.put('/:id/settings', authenticate, [
  body('auto_confirm_bookings').optional().isBoolean().withMessage('Auto confirm bookings must be boolean'),
  body('minimum_booking_duration').optional().isInt({ min: 1 }).withMessage('Minimum booking duration must be a positive integer'),
  body('maximum_booking_duration').optional().isInt({ min: 1 }).withMessage('Maximum booking duration must be a positive integer'),
  body('advance_booking_limit').optional().isInt({ min: 1 }).withMessage('Advance booking limit must be a positive integer'),
  body('commission_rate').optional().isFloat({ min: 0, max: 50 }).withMessage('Commission rate must be between 0 and 50'),
  body('minimum_price_per_day').optional().isFloat({ min: 0 }).withMessage('Minimum price per day must be a positive number'),
  body('notification_settings').optional().isObject().withMessage('Notification settings must be an object')
], validate, asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can update this vendor's settings
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own settings.'
      })
    }
  }

  const vendor = await VendorModel.findById(vendorId)
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }

  // Update vendor settings
  const updateData = {}
  const allowedFields = [
    'auto_confirm_bookings',
    'minimum_booking_duration',
    'maximum_booking_duration',
    'advance_booking_limit',
    'commission_rate',
    'minimum_price_per_day',
    'notification_settings'
  ]

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field]
    }
  })

  const updatedVendor = await VendorModel.update(vendorId, updateData)

  res.json({
    success: true,
    data: updatedVendor
  })
}))

module.exports = router

