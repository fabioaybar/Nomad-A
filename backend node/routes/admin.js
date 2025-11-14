const express = require('express')
const { body } = require('express-validator')
const { 
  UserModel, 
  VendorModel, 
  VehicleModel, 
  BookingModel, 
  ReviewModel, 
  MaintenanceModel, 
  RewardModel, 
  DiscountModel, 
  NotificationModel,
  PaymentModel,
  ReportModel
} = require('../database/models')
const { authenticate, authorize } = require('../middleware/auth')
const { validate, asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// All admin routes require authentication and admin role
router.use(authenticate)
router.use(authorize('admin'))

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', asyncHandler(async (req, res) => {
  const [
    userStats,
    vendorStats,
    vehicleStats,
    bookingStats,
    reviewStats,
    maintenanceStats,
    rewardStats,
    discountStats,
    paymentStats,
    reportStats
  ] = await Promise.all([
    UserModel.getStats(),
    VendorModel.getStats(),
    VehicleModel.getStats(),
    BookingModel.getStats(),
    ReviewModel.getStats(),
    MaintenanceModel.getStats(),
    RewardModel.getStats(),
    DiscountModel.getStats(),
    PaymentModel.getStats(),
    ReportModel.getStats()
  ])

  res.json({
    success: true,
    data: {
      users: userStats,
      vendors: vendorStats,
      vehicles: vehicleStats,
      bookings: bookingStats,
      reviews: reviewStats,
      maintenance: maintenanceStats,
      rewards: rewardStats,
      discounts: discountStats,
      payments: paymentStats,
      reports: reportStats
    }
  })
}))

// @route   GET /api/admin/activity
// @desc    Get recent platform activity (users, bookings, support)
// @access  Private (Admin)
router.get('/activity', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10

  const [users, bookings, reports] = await Promise.all([
    UserModel.findAll(),
    BookingModel.findAll(),
    ReportModel.findAll ? ReportModel.findAll() : []
  ])

  const userActivities = (Array.isArray(users) ? users : []).slice(-limit).map(u => ({
    id: u.id,
    type: 'user',
    message: `Nuevo usuario registrado: ${u.name}`,
    timestamp: u.created_at || new Date().toISOString()
  }))

  const bookingActivities = (Array.isArray(bookings) ? bookings : []).slice(-limit).map(b => ({
    id: b.id,
    type: 'booking',
    message: `Reserva ${b.status}: #${b.id}`,
    timestamp: b.created_at || b.start_date || new Date().toISOString()
  }))

  const supportActivities = (Array.isArray(reports) ? reports : []).slice(-limit).map(r => ({
    id: r.id,
    type: 'support',
    message: r.title ? `Nuevo reporte: ${r.title}` : 'Nuevo ticket de soporte',
    timestamp: r.created_at || new Date().toISOString()
  }))

  const combined = [...userActivities, ...bookingActivities, ...supportActivities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)

  res.json({
    success: true,
    data: combined
  })
}))

// @route   GET /api/admin/users
// @desc    Get all users with advanced filtering
// @access  Private (Admin)
router.get('/users', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.role) filters.role = req.query.role
  if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === 'true'
  if (req.query.search) {
    const users = await UserModel.search(req.query.search, filters)
    return res.json({
      success: true,
      data: {
        users: users.map(user => {
          delete user.password
          return user
        }),
        pagination: {
          page: 1,
          limit: users.length,
          total: users.length,
          pages: 1
        }
      }
    })
  }

  const result = await UserModel.paginate(page, limit, filters)

  // Remove passwords from response
  const users = result.data.map(user => {
    delete user.password
    return user
  })

  res.json({
    success: true,
    data: {
      users,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/admin/vendors
// @desc    Get all vendors with advanced filtering
// @access  Private (Admin)
router.get('/vendors', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.is_verified !== undefined) filters.is_verified = req.query.is_verified === 'true'
  if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === 'true'
  if (req.query.business_type) filters.business_type = req.query.business_type
  if (req.query.city) filters.city = req.query.city
  if (req.query.country) filters.country = req.query.country
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

// @route   GET /api/admin/vehicles
// @desc    Get all vehicles with advanced filtering
// @access  Private (Admin)
router.get('/vehicles', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.vendor_id) filters.vendor_id = parseInt(req.query.vendor_id)
  if (req.query.type) filters.type = req.query.type
  if (req.query.make) filters.make = req.query.make
  if (req.query.fuel_type) filters.fuel_type = req.query.fuel_type
  if (req.query.transmission) filters.transmission = req.query.transmission
  if (req.query.is_available !== undefined) filters.is_available = req.query.is_available === 'true'
  if (req.query.is_rented !== undefined) filters.is_rented = req.query.is_rented === 'true'
  if (req.query.rental_status) filters.rental_status = req.query.rental_status
  if (req.query.search) {
    const vehicles = await VehicleModel.search(req.query.search, filters)
    return res.json({
      success: true,
      data: {
        vehicles,
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

// @route   GET /api/admin/bookings
// @desc    Get all bookings with advanced filtering
// @access  Private (Admin)
router.get('/bookings', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.user_id) filters.user_id = parseInt(req.query.user_id)
  if (req.query.vendor_id) filters.vendor_id = parseInt(req.query.vendor_id)
  if (req.query.vehicle_id) filters.vehicle_id = parseInt(req.query.vehicle_id)
  if (req.query.status) filters.status = req.query.status
  if (req.query.payment_status) filters.payment_status = req.query.payment_status
  if (req.query.start_date && req.query.end_date) {
    const bookings = await BookingModel.findByDateRange(req.query.start_date, req.query.end_date)
    return res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page: 1,
          limit: bookings.length,
          total: bookings.length,
          pages: 1
        }
      }
    })
  }

  const result = await BookingModel.paginate(page, limit, filters)

  // Enrich with user and vehicle data and normalize amounts
  const [users, vehicles] = await Promise.all([
    UserModel.findAll(),
    VehicleModel.findAll()
  ])

  const enriched = (Array.isArray(result.data) ? result.data : []).map(b => {
    const user = users.find(u => u.id === b.user_id)
    const vehicle = vehicles.find(v => v.id === b.vehicle_id)
    return {
      ...b,
      total_amount: b.total_amount !== undefined ? b.total_amount : (b.total_cost || 0),
      user: user ? { id: user.id, name: user.name, email: user.email, phone: user.phone } : undefined,
      vehicle: vehicle ? { id: vehicle.id, make: vehicle.make, model: vehicle.model, year: vehicle.year, license_plate: vehicle.license_plate, type: vehicle.type } : undefined
    }
  })

  res.json({
    success: true,
    data: {
      bookings: enriched,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/admin/reviews
// @desc    Get all reviews with advanced filtering
// @access  Private (Admin)
router.get('/reviews', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.user_id) filters.user_id = parseInt(req.query.user_id)
  if (req.query.vendor_id) filters.vendor_id = parseInt(req.query.vendor_id)
  if (req.query.vehicle_id) filters.vehicle_id = parseInt(req.query.vehicle_id)
  if (req.query.rating) filters.rating = parseInt(req.query.rating)
  if (req.query.is_approved !== undefined) filters.is_approved = req.query.is_approved === 'true'

  const result = await ReviewModel.paginate(page, limit, filters)

  // Enrich reviews with user and vehicle data
  const enrichedReviews = await Promise.all(result.data.map(async (review) => {
    try {
      // Get user data
      const user = await UserModel.findById(review.user_id)
      
      // Get vehicle data
      const vehicle = await VehicleModel.findById(review.vehicle_id)
      
      // Get vendor data
      const vendor = await VendorModel.findById(review.vendor_id)

      return {
        ...review,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        } : null,
        vehicle: vehicle ? {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          license_plate: vehicle.license_plate,
          year: vehicle.year
        } : null,
        vendor: vendor ? {
          id: vendor.id,
          company_name: vendor.company_name,
          contact_name: vendor.contact_name
        } : null
      }
    } catch (error) {
      console.error(`Error enriching review ${review.id}:`, error)
      return review
    }
  }))

  res.json({
    success: true,
    data: {
      reviews: enrichedReviews,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/admin/reports
// @desc    Get all reports with advanced filtering
// @access  Private (Admin)
router.get('/reports', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.user_id) filters.user_id = parseInt(req.query.user_id)
  if (req.query.type) filters.type = req.query.type
  if (req.query.status) filters.status = req.query.status

  const result = await ReportModel.paginate(page, limit, filters)

  res.json({
    success: true,
    data: {
      reports: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/admin/analytics/revenue
// @desc    Get revenue analytics
// @access  Private (Admin)
router.get('/analytics/revenue', asyncHandler(async (req, res) => {
  const startDate = req.query.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const endDate = req.query.end_date || new Date().toISOString()
  
  const revenueStats = await BookingModel.getRevenueStats(startDate, endDate)
  
  res.json({
    success: true,
    data: {
      period: { startDate, endDate },
      ...revenueStats
    }
  })
}))

// @route   GET /api/admin/analytics/users
// @desc    Get user analytics
// @access  Private (Admin)
router.get('/analytics/users', asyncHandler(async (req, res) => {
  const userStats = await UserModel.getStats()
  
  res.json({
    success: true,
    data: userStats
  })
}))

// @route   GET /api/admin/analytics/vendors
// @desc    Get vendor analytics
// @access  Private (Admin)
router.get('/analytics/vendors', asyncHandler(async (req, res) => {
  const vendorStats = await VendorModel.getStats()
  
  res.json({
    success: true,
    data: vendorStats
  })
}))

// @route   GET /api/admin/analytics/vehicles
// @desc    Get vehicle analytics
// @access  Private (Admin)
router.get('/analytics/vehicles', asyncHandler(async (req, res) => {
  const vehicleStats = await VehicleModel.getStats()
  
  res.json({
    success: true,
    data: vehicleStats
  })
}))

// @route   GET /api/admin/analytics/comprehensive
// @desc    Get comprehensive analytics data
// @access  Private (Admin)
router.get('/analytics/comprehensive', asyncHandler(async (req, res) => {
  const period = req.query.period || '30'
  const days = parseInt(period)
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const endDate = new Date().toISOString()
  
  // Get all analytics data
  const [userStats, vendorStats, vehicleStats, bookingStats, reviewStats, paymentStats] = await Promise.all([
    UserModel.getStats(),
    VendorModel.getStats(),
    VehicleModel.getStats(),
    BookingModel.getStats(),
    ReviewModel.getStats(),
    PaymentModel.getStats()
  ])
  
  // Calculate KPIs
  const kpis = {
    totalUsers: userStats.total || 0,
    userGrowth: Math.floor(Math.random() * 20) + 5, // Mock growth percentage
    totalBookings: bookingStats.total || 0,
    bookingGrowth: Math.floor(Math.random() * 15) + 3, // Mock growth percentage
    totalRevenue: paymentStats.total_amount || 0,
    revenueGrowth: Math.floor(Math.random() * 25) + 8, // Mock growth percentage
    conversionRate: Math.floor(Math.random() * 10) + 15, // Mock conversion rate
    conversionGrowth: Math.floor(Math.random() * 5) + 2 // Mock growth percentage
  }
  
  // Platform Statistics
  const platformStats = {
    newUsers: userStats.new_users || 0,
    activeUsers: userStats.active || 0,
    userRetention: Math.floor(Math.random() * 20) + 70, // Mock retention rate
    completedBookings: bookingStats.completed || 0,
    cancelledBookings: bookingStats.cancelled || 0,
    avgBookingDuration: Math.floor(Math.random() * 5) + 3, // Mock average days
    avgBookingValue: paymentStats.average_amount || 0,
    revenuePerUser: userStats.total > 0 ? (paymentStats.total_amount / userStats.total) : 0,
    platformCommission: paymentStats.total_amount * 0.1 // 10% commission
  }
  
  // User Behavior Statistics
  const behaviorStats = {
    visitors: Math.floor(Math.random() * 10000) + 5000, // Mock visitor count
    registeredUsers: userStats.total || 0,
    activeSearchers: Math.floor(userStats.total * 0.3), // 30% of users search
    bookingsMade: bookingStats.total || 0,
    avgSessionDuration: Math.floor(Math.random() * 30) + 15, // Mock session duration
    pagesPerSession: Math.floor(Math.random() * 5) + 3, // Mock pages per session
    bounceRate: Math.floor(Math.random() * 20) + 30, // Mock bounce rate
    repeatUsers: Math.floor(Math.random() * 30) + 40, // Mock repeat user percentage
    userSatisfaction: Math.floor(Math.random() * 2) + 4, // Mock satisfaction score
    featureAdoption: Math.floor(Math.random() * 40) + 50 // Mock feature adoption
  }
  
  // Performance Statistics
  const performanceStats = {
    avgResponseTime: Math.floor(Math.random() * 100) + 50, // Mock response time
    apiUptime: Math.floor(Math.random() * 5) + 95, // Mock uptime percentage
    errorRate: Math.floor(Math.random() * 2) + 1, // Mock error rate
    requestsPerMinute: Math.floor(Math.random() * 1000) + 500, // Mock requests
    queryTime: Math.floor(Math.random() * 50) + 20, // Mock query time
    connectionPool: Math.floor(Math.random() * 20) + 60, // Mock connection pool usage
    cacheHitRate: Math.floor(Math.random() * 20) + 75, // Mock cache hit rate
    cpuUsage: Math.floor(Math.random() * 30) + 40, // Mock CPU usage
    memoryUsage: Math.floor(Math.random() * 25) + 50, // Mock memory usage
    diskUsage: Math.floor(Math.random() * 20) + 30, // Mock disk usage
    failedLogins: Math.floor(Math.random() * 50) + 10, // Mock failed logins
    securityIncidents: Math.floor(Math.random() * 5) + 1 // Mock security incidents
  }
  
  res.json({
    success: true,
    data: {
      period: { startDate, endDate, days },
      kpis,
      platform: platformStats,
      behavior: behaviorStats,
      performance: performanceStats
    }
  })
}))

// @route   GET /api/admin/payments
// @desc    Get all payments with advanced filtering
// @access  Private (Admin)
router.get('/payments', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.user_id) filters.user_id = parseInt(req.query.user_id)
  if (req.query.booking_id) filters.booking_id = parseInt(req.query.booking_id)
  if (req.query.status) filters.status = req.query.status
  if (req.query.payment_method) filters.payment_method = req.query.payment_method
  if (req.query.search) {
    // Search by user name or email
    const users = await UserModel.search(req.query.search)
    if (users.length > 0) {
      filters.user_id = users.map(user => user.id)
    }
  }

  const result = await PaymentModel.paginate(page, limit, filters)

  res.json({
    success: true,
    data: {
      payments: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   PUT /api/admin/payments/:id/process
// @desc    Process a pending payment
// @access  Private (Admin)
router.put('/payments/:id/process', asyncHandler(async (req, res) => {
  const paymentId = req.params.id
  
  const payment = await PaymentModel.findById(paymentId)
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    })
  }
  
  if (payment.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Payment is not pending'
    })
  }
  
  const updatedPayment = await PaymentModel.update(paymentId, {
    status: 'completed',
    processed_at: new Date().toISOString(),
    processed_by: req.user.id
  })
  
  res.json({
    success: true,
    message: 'Payment processed successfully',
    data: { payment: updatedPayment }
  })
}))

// @route   PUT /api/admin/payments/:id/refund
// @desc    Refund a completed payment
// @access  Private (Admin)
router.put('/payments/:id/refund', [
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason must not exceed 200 characters')
], validate, asyncHandler(async (req, res) => {
  const paymentId = req.params.id
  const { reason } = req.body
  
  const payment = await PaymentModel.findById(paymentId)
  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    })
  }
  
  if (payment.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Payment is not completed'
    })
  }
  
  const updatedPayment = await PaymentModel.update(paymentId, {
    status: 'refunded',
    refunded_at: new Date().toISOString(),
    refunded_by: req.user.id,
    refund_reason: reason
  })
  
  res.json({
    success: true,
    message: 'Payment refunded successfully',
    data: { payment: updatedPayment }
  })
}))

// @route   GET /api/admin/tax/settings
// @desc    Get tax settings and statistics
// @access  Private (Admin)
router.get('/tax/settings', asyncHandler(async (req, res) => {
  // Mock tax settings - in a real app, this would come from a settings table
  const taxSettings = {
    rate: 19, // 19% VAT
    type: 'VAT',
    enabled: true
  }
  
  // Calculate tax statistics
  const payments = await PaymentModel.findAll()
  const totalCollected = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount * taxSettings.rate / 100), 0)
  
  const monthlyCollected = payments
    .filter(p => {
      const paymentDate = new Date(p.created_at)
      const now = new Date()
      return p.status === 'completed' && 
             paymentDate.getMonth() === now.getMonth() && 
             paymentDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, p) => sum + (p.amount * taxSettings.rate / 100), 0)
  
  const pendingPayments = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (p.amount * taxSettings.rate / 100), 0)
  
  res.json({
    success: true,
    data: {
      settings: taxSettings,
      stats: {
        totalCollected,
        monthlyCollected,
        pendingPayments
      }
    }
  })
}))

// @route   GET /api/admin/content/announcements
// @desc    Get all announcements
// @access  Private (Admin)
router.get('/content/announcements', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.status) filters.status = req.query.status
  if (req.query.priority) filters.priority = req.query.priority
  if (req.query.search) {
    // Mock search functionality
    filters.search = req.query.search
  }

  // Mock announcements data
  const announcements = [
    {
      id: 1,
      title: 'Welcome to Our Platform',
      content: 'We are excited to announce new features and improvements to enhance your car rental experience.',
      status: 'active',
      priority: 'high',
      created_at: '2024-01-15T10:00:00Z',
      scheduled_at: null,
      expires_at: '2024-02-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Maintenance Notice',
      content: 'Scheduled maintenance will occur on Sunday from 2 AM to 4 AM. Some features may be temporarily unavailable.',
      status: 'scheduled',
      priority: 'medium',
      created_at: '2024-01-14T15:30:00Z',
      scheduled_at: '2024-01-21T02:00:00Z',
      expires_at: '2024-01-21T04:00:00Z'
    }
  ]

  res.json({
    success: true,
    data: {
      announcements,
      pagination: {
        page,
        limit,
        total: announcements.length,
        pages: Math.ceil(announcements.length / limit)
      }
    }
  })
}))

// @route   POST /api/admin/content/announcements
// @desc    Create a new announcement
// @access  Private (Admin)
router.post('/content/announcements', [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Content must be between 1 and 1000 characters'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('status').isIn(['active', 'inactive', 'scheduled']).withMessage('Status must be active, inactive, or scheduled')
], validate, asyncHandler(async (req, res) => {
  const { title, content, priority, status, scheduled_at, expires_at } = req.body
  
  const announcement = {
    id: Date.now(),
    title,
    content,
    priority,
    status,
    scheduled_at,
    expires_at,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  res.json({
    success: true,
    message: 'Announcement created successfully',
    data: { announcement }
  })
}))

// @route   GET /api/admin/content/campaigns
// @desc    Get all promotional campaigns
// @access  Private (Admin)
router.get('/content/campaigns', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.status) filters.status = req.query.status
  if (req.query.type) filters.type = req.query.type
  if (req.query.search) {
    filters.search = req.query.search
  }

  // Mock campaigns data
  const campaigns = [
    {
      id: 1,
      name: 'Summer Discount Campaign',
      description: 'Get 20% off on all summer bookings. Limited time offer!',
      type: 'banner',
      status: 'active',
      start_date: '2024-01-01T00:00:00Z',
      end_date: '2024-03-31T23:59:59Z',
      created_at: '2024-01-01T10:00:00Z',
      impressions: 15420,
      clicks: 1234,
      conversions: 89,
      ctr: 8.0
    },
    {
      id: 2,
      name: 'New User Welcome',
      description: 'Welcome new users with a special discount code for their first booking.',
      type: 'email',
      status: 'active',
      start_date: '2024-01-01T00:00:00Z',
      end_date: null,
      created_at: '2024-01-01T10:00:00Z',
      impressions: 8500,
      clicks: 2100,
      conversions: 156,
      ctr: 24.7
    }
  ]

  res.json({
    success: true,
    data: {
      campaigns,
      pagination: {
        page,
        limit,
        total: campaigns.length,
        pages: Math.ceil(campaigns.length / limit)
      }
    }
  })
}))

// @route   GET /api/admin/content/messages
// @desc    Get all system messages
// @access  Private (Admin)
router.get('/content/messages', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.type) filters.type = req.query.type
  if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === 'true'
  if (req.query.search) {
    filters.search = req.query.search
  }

  // Mock messages data
  const messages = [
    {
      id: 1,
      title: 'Welcome Message',
      content: 'Welcome to our car rental platform! We are here to help you find the perfect vehicle for your needs.',
      type: 'welcome',
      is_active: true,
      display_location: 'homepage',
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Booking Confirmation',
      content: 'Your booking has been confirmed. You will receive a confirmation email shortly.',
      type: 'notification',
      is_active: true,
      display_location: 'booking',
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-10T10:00:00Z'
    }
  ]

  res.json({
    success: true,
    data: {
      messages,
      pagination: {
        page,
        limit,
        total: messages.length,
        pages: Math.ceil(messages.length / limit)
      }
    }
  })
}))

// @route   GET /api/admin/settings
// @desc    Get system settings
// @access  Private (Admin)
router.get('/settings', asyncHandler(async (req, res) => {
  // Mock settings data
  const settings = {
    platform: {
      name: 'Car Rental Platform',
      description: 'Your trusted car rental service',
      support_email: 'support@carrental.com',
      timezone: 'UTC',
      default_currency: 'USD',
      commission_rate: 10.0,
      min_booking_amount: 25.00,
      max_booking_duration: 30
    },
    features: {
      user_registration: true,
      vendor_registration: true,
      reviews_system: true,
      rewards_program: true,
      chat_system: true,
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false
    },
    security: {
      session_timeout: 30,
      max_login_attempts: 5,
      password_min_length: 8,
      two_factor_auth: false,
      api_rate_limit: 100,
      cors_enabled: true,
      https_only: true,
      api_logging: true
    },
    maintenance: {
      enabled: false,
      message: 'We are currently performing scheduled maintenance. We will be back online shortly.',
      estimated_downtime: '2-4 hours',
      allow_admin_access: true
    }
  }

  res.json({
    success: true,
    data: settings
  })
}))

// @route   PUT /api/admin/settings
// @desc    Update system settings
// @access  Private (Admin)
router.put('/settings', [
  body('platform.name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Platform name must be between 1 and 100 characters'),
  body('platform.support_email').optional().isEmail().withMessage('Support email must be valid'),
  body('platform.commission_rate').optional().isFloat({ min: 0, max: 50 }).withMessage('Commission rate must be between 0 and 50'),
  body('platform.min_booking_amount').optional().isFloat({ min: 0 }).withMessage('Minimum booking amount must be positive'),
  body('platform.max_booking_duration').optional().isInt({ min: 1, max: 365 }).withMessage('Maximum booking duration must be between 1 and 365 days'),
  body('security.session_timeout').optional().isInt({ min: 5, max: 480 }).withMessage('Session timeout must be between 5 and 480 minutes'),
  body('security.max_login_attempts').optional().isInt({ min: 3, max: 10 }).withMessage('Max login attempts must be between 3 and 10'),
  body('security.password_min_length').optional().isInt({ min: 6, max: 20 }).withMessage('Password min length must be between 6 and 20'),
  body('security.api_rate_limit').optional().isInt({ min: 10, max: 1000 }).withMessage('API rate limit must be between 10 and 1000')
], validate, asyncHandler(async (req, res) => {
  const { platform, features, security, maintenance } = req.body
  
  // In a real application, this would save to a settings table
  const updatedSettings = {
    platform: { ...settings.platform, ...platform },
    features: { ...settings.features, ...features },
    security: { ...settings.security, ...security },
    maintenance: { ...settings.maintenance, ...maintenance },
    updated_at: new Date().toISOString(),
    updated_by: req.user.id
  }
  
  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: updatedSettings
  })
}))

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status
// @access  Private (Admin)
router.put('/users/:id/status', [
  body('is_active').isBoolean().withMessage('Status must be boolean')
], validate, asyncHandler(async (req, res) => {
  const userId = req.params.id
  const { is_active } = req.body
  
  const user = await UserModel.findById(userId)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
  
  const updatedUser = await UserModel.update(userId, { is_active })
  
  res.json({
    success: true,
    message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
    data: { user: updatedUser }
  })
}))

// @route   PUT /api/admin/vendors/:id/verify
// @desc    Verify/unverify vendor
// @access  Private (Admin)
router.put('/vendors/:id/verify', [
  body('is_verified').isBoolean().withMessage('Verification status must be boolean')
], validate, asyncHandler(async (req, res) => {
  const vendorId = req.params.id
  const { is_verified } = req.body
  
  const vendor = await VendorModel.findById(vendorId)
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }
  
  const updatedVendor = await VendorModel.update(vendorId, { is_verified })
  
  res.json({
    success: true,
    message: `Vendor ${is_verified ? 'verified' : 'unverified'} successfully`,
    data: { vendor: updatedVendor }
  })
}))

// @route   PUT /api/admin/reviews/:id/approve
// @desc    Approve/reject review
// @access  Private (Admin)
router.put('/reviews/:id/approve', [
  body('is_approved').isBoolean().withMessage('Approval status must be boolean'),
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason must not exceed 200 characters')
], validate, asyncHandler(async (req, res) => {
  const reviewId = req.params.id
  const { is_approved, reason } = req.body
  
  const review = await ReviewModel.findById(reviewId)
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    })
  }
  
  let updatedReview
  if (is_approved) {
    updatedReview = await ReviewModel.approveReview(reviewId)
  } else {
    updatedReview = await ReviewModel.rejectReview(reviewId, reason)
  }
  
  res.json({
    success: true,
    message: `Review ${is_approved ? 'approved' : 'rejected'} successfully`,
    data: { review: updatedReview }
  })
}))

// @route   PUT /api/admin/reports/:id/resolve
// @desc    Resolve/reject report
// @access  Private (Admin)
router.put('/reports/:id/resolve', [
  body('status').isIn(['resolved', 'rejected']).withMessage('Status must be resolved or rejected'),
  body('resolution_notes').optional().trim().isLength({ max: 500 }).withMessage('Resolution notes must not exceed 500 characters')
], validate, asyncHandler(async (req, res) => {
  const reportId = req.params.id
  const { status, resolution_notes } = req.body
  
  const report = await ReportModel.findById(reportId)
  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Report not found'
    })
  }
  
  const updatedReport = await ReportModel.update(reportId, {
    status,
    resolution_notes,
    resolved_at: new Date().toISOString(),
    resolved_by: req.user.id
  })
  
  res.json({
    success: true,
    message: `Report ${status} successfully`,
    data: { report: updatedReport }
  })
}))

// @route   POST /api/admin/discounts
// @desc    Create discount
// @access  Private (Admin)
router.post('/discounts', [
  body('code').trim().isLength({ min: 3, max: 20 }).withMessage('Code must be between 3 and 20 characters'),
  body('type').isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('max_uses').optional().isInt({ min: 1 }).withMessage('Max uses must be a positive integer'),
  body('start_date').isISO8601().withMessage('Start date must be a valid date'),
  body('end_date').isISO8601().withMessage('End date must be a valid date'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Description must not exceed 200 characters')
], validate, asyncHandler(async (req, res) => {
  const discountData = req.body
  
  // Check if discount code already exists
  const existingDiscount = await DiscountModel.findByCode(discountData.code)
  if (existingDiscount) {
    return res.status(400).json({
      success: false,
      message: 'Discount code already exists'
    })
  }
  
  const discount = await DiscountModel.create({
    ...discountData,
    is_active: true,
    used_count: 0
  })
  
  res.status(201).json({
    success: true,
    message: 'Discount created successfully',
    data: { discount }
  })
}))

// @route   POST /api/admin/rewards
// @desc    Create reward
// @access  Private (Admin)
router.post('/rewards', [
  body('user_id').isInt().withMessage('User ID is required'),
  body('type').isIn(['points', 'discount', 'free_rental']).withMessage('Type must be points, discount, or free_rental'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('description').trim().isLength({ min: 5, max: 200 }).withMessage('Description must be between 5 and 200 characters'),
  body('expires_at').optional().isISO8601().withMessage('Expiration date must be a valid date')
], validate, asyncHandler(async (req, res) => {
  const rewardData = req.body
  
  // Check if user exists
  const user = await UserModel.findById(rewardData.user_id)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
  
  const reward = await RewardModel.create({
    ...rewardData,
    is_active: true,
    is_redeemed: false
  })
  
  res.status(201).json({
    success: true,
    message: 'Reward created successfully',
    data: { reward }
  })
}))

// @route   POST /api/admin/notifications
// @desc    Send notification to users
// @access  Private (Admin)
router.post('/notifications', [
  body('user_ids').isArray().withMessage('User IDs must be an array'),
  body('type').isIn(['info', 'warning', 'success', 'error']).withMessage('Type must be info, warning, success, or error'),
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('message').trim().isLength({ min: 10, max: 500 }).withMessage('Message must be between 10 and 500 characters'),
  body('data').optional().isObject().withMessage('Data must be an object')
], validate, asyncHandler(async (req, res) => {
  const { user_ids, type, title, message, data } = req.body
  
  const notifications = []
  
  for (const userId of user_ids) {
    const notification = await NotificationModel.createNotification(userId, type, title, message, data)
    notifications.push(notification)
  }
  
  res.status(201).json({
    success: true,
    message: `Notification sent to ${notifications.length} users`,
    data: { notifications }
  })
}))

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const userId = req.params.id
  
  const user = await UserModel.findById(userId)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
  
  // Prevent admin from deleting themselves
  if (req.user.id === parseInt(userId)) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    })
  }
  
  await UserModel.delete(userId)
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  })
}))

// @route   DELETE /api/admin/vendors/:id
// @desc    Delete vendor
// @access  Private (Admin)
router.delete('/vendors/:id', asyncHandler(async (req, res) => {
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

// @route   DELETE /api/admin/vehicles/:id
// @desc    Delete vehicle
// @access  Private (Admin)
router.delete('/vehicles/:id', asyncHandler(async (req, res) => {
  const vehicleId = req.params.id
  
  const vehicle = await VehicleModel.findById(vehicleId)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }
  
  await VehicleModel.delete(vehicleId)
  
  res.json({
    success: true,
    message: 'Vehicle deleted successfully'
  })
}))

module.exports = router