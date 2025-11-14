const express = require('express')
const { body, query } = require('express-validator')
const { BookingModel, VehicleModel, UserModel, VendorModel, PaymentModel, NotificationModel } = require('../database/models')
const { authenticate, authorize } = require('../middleware/auth')
const { validate, asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Validation rules
const bookingValidation = [
  body('vehicle_id').isInt({ min: 1 }).withMessage('Valid vehicle ID is required'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('end_date').isISO8601().withMessage('Valid end date is required'),
  body('pickup_location').trim().notEmpty().withMessage('Pickup location is required'),
  body('return_location').trim().notEmpty().withMessage('Return location is required')
]

// @route   GET /api/bookings
// @desc    Get all bookings (with filters)
// @access  Private
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled']),
  query('user_id').optional().isInt({ min: 1 }),
  query('vendor_id').optional().isInt({ min: 1 }),
  query('vehicle_id').optional().isInt({ min: 1 })
], validate, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  // Apply filters based on user role
  if (req.user.role === 'user') {
    filters.user_id = req.user.id
  } else if (req.user.role === 'vendor') {
    // For vendors, we need to find their vendor_id based on user_id
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (vendor) {
      filters.vendor_id = vendor.id
    }
  }
  // Admin can see all bookings

  if (req.query.status) filters.status = req.query.status
  if (req.query.user_id && req.user.role === 'admin') filters.user_id = req.query.user_id
  if (req.query.vendor_id && req.user.role === 'admin') filters.vendor_id = req.query.vendor_id
  if (req.query.vehicle_id) filters.vehicle_id = req.query.vehicle_id

  const result = await BookingModel.paginate(page, limit, filters)

  // Populate user and vehicle data for each booking
  const populatedBookings = await Promise.all(result.data.map(async (booking) => {
    const user = await UserModel.findById(booking.user_id)
    const vehicle = await VehicleModel.findById(booking.vehicle_id)
    
    return {
      ...booking,
      user,
      vehicle
    }
  }))

  res.json({
    success: true,
    data: {
      bookings: populatedBookings,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const booking = await BookingModel.findById(req.params.id)
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  // Check access permissions
  if (req.user.role === 'user' && booking.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  if (req.user.role === 'vendor' && booking.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  // Populate user and vehicle data
  const user = await UserModel.findById(booking.user_id)
  const vehicle = await VehicleModel.findById(booking.vehicle_id)
  
  booking.user = user
  booking.vehicle = vehicle

  res.json({
    success: true,
    data: { booking }
  })
}))

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', authenticate, bookingValidation, validate, asyncHandler(async (req, res) => {
  const { vehicle_id, start_date, end_date, pickup_location, return_location, pickup_time, return_time, notes } = req.body

  // Check if vehicle exists
  const vehicle = await VehicleModel.findById(vehicle_id)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  // Check if vehicle is available
  if (!vehicle.is_available || vehicle.rental_status !== 'available') {
    return res.status(400).json({
      success: false,
      message: 'Vehicle is not available for booking'
    })
  }

  // Check availability for the requested dates
  const isAvailable = await BookingModel.checkAvailability(vehicle_id, start_date, end_date)
  if (!isAvailable) {
    return res.status(400).json({
      success: false,
      message: 'Vehicle is not available for the selected dates'
    })
  }

  // Calculate booking details
  const start = new Date(start_date)
  const end = new Date(end_date)
  const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const dailyRate = vehicle.price_per_day
  const totalCost = numberOfDays * dailyRate

  const bookingData = {
    user_id: req.user.id,
    vehicle_id,
    vendor_id: vehicle.vendor_id,
    start_date,
    end_date,
    pickup_location,
    return_location,
    pickup_time,
    return_time,
    total_cost: totalCost,
    daily_rate: dailyRate,
    number_of_days: numberOfDays,
    status: 'pending',
    payment_status: 'pending',
    notes
  }

  const booking = await BookingModel.create(bookingData)

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: { booking }
  })
}))

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const booking = await BookingModel.findById(req.params.id)
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  // Check access permissions
  if (req.user.role === 'user' && booking.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own bookings'
    })
  }

  if (req.user.role === 'vendor' && booking.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update bookings for your vehicles'
    })
  }

  // Only allow certain fields to be updated
  const allowedUpdates = ['pickup_time', 'return_time', 'notes']
  const updates = {}
  
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key]
    }
  })

  const updatedBooking = await BookingModel.update(req.params.id, updates)

  res.json({
    success: true,
    message: 'Booking updated successfully',
    data: { booking: updatedBooking }
  })
}))

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const booking = await BookingModel.findById(req.params.id)
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  // Check access permissions
  if (req.user.role === 'user' && booking.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only cancel your own bookings'
    })
  }

  if (req.user.role === 'vendor' && booking.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only cancel bookings for your vehicles'
    })
  }

  // Only allow cancellation if booking is pending or confirmed
  if (!['pending', 'confirmed'].includes(booking.status)) {
    return res.status(400).json({
      success: false,
      message: 'Only pending or confirmed bookings can be cancelled'
    })
  }

  const updatedBooking = await BookingModel.update(req.params.id, {
    status: 'cancelled',
    cancellation_reason: req.body.reason || 'Cancelled by user'
  })

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: { booking: updatedBooking }
  })
}))

// @route   POST /api/bookings/:id/confirm
// @desc    Confirm booking
// @access  Private (Vendor/Admin)
router.post('/:id/confirm', authenticate, authorize('vendor', 'admin'), asyncHandler(async (req, res) => {
  const booking = await BookingModel.findById(req.params.id)
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  // Check if vendor owns this vehicle (unless admin)
  if (req.user.role === 'vendor' && booking.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only confirm bookings for your vehicles'
    })
  }

  if (booking.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Only pending bookings can be confirmed'
    })
  }

  const updatedBooking = await BookingModel.update(req.params.id, {
    status: 'confirmed'
  })

  res.json({
    success: true,
    message: 'Booking confirmed successfully',
    data: { booking: updatedBooking }
  })
}))

// @route   POST /api/bookings/:id/start
// @desc    Start booking
// @access  Private (Vendor/Admin)
router.post('/:id/start', authenticate, authorize('vendor', 'admin'), asyncHandler(async (req, res) => {
  const booking = await BookingModel.findById(req.params.id)
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  // Check if vendor owns this vehicle (unless admin)
  if (req.user.role === 'vendor' && booking.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only start bookings for your vehicles'
    })
  }

  if (booking.status !== 'confirmed') {
    return res.status(400).json({
      success: false,
      message: 'Only confirmed bookings can be started'
    })
  }

  const updatedBooking = await BookingModel.update(req.params.id, {
    status: 'active',
    started_at: new Date().toISOString()
  })

  // Create notification for user
  await NotificationModel.createNotification({
    user_id: booking.user_id,
    type: 'booking',
    title: 'Booking Started',
    message: `Your booking #${booking.id} has started. Enjoy your rental!`,
    action_url: `/bookings/${booking.id}`
  })

  res.json({
    success: true,
    message: 'Booking started successfully',
    data: { booking: updatedBooking }
  })
}))

// @route   POST /api/bookings/:id/complete
// @desc    Complete booking
// @access  Private (Vendor/Admin)
router.post('/:id/complete', authenticate, authorize('vendor', 'admin'), asyncHandler(async (req, res) => {
  const booking = await BookingModel.findById(req.params.id)
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  // Check if vendor owns this vehicle (unless admin)
  if (req.user.role === 'vendor' && booking.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only complete bookings for your vehicles'
    })
  }

  if (booking.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'Only active bookings can be completed'
    })
  }

  const updatedBooking = await BookingModel.update(req.params.id, {
    status: 'completed'
  })

  // Make vehicle available again
  await VehicleModel.update(booking.vehicle_id, {
    is_available: true,
    is_rented: false,
    rental_status: 'available'
  })

  res.json({
    success: true,
    message: 'Booking completed successfully',
    data: { booking: updatedBooking }
  })
}))

// @route   POST /api/bookings/calculate-cost
// @desc    Calculate booking cost
// @access  Public
router.post('/calculate-cost', [
  body('vehicle_id').isInt({ min: 1 }).withMessage('Valid vehicle ID is required'),
  body('start_date').isISO8601().withMessage('Valid start date is required'),
  body('end_date').isISO8601().withMessage('Valid end date is required')
], validate, asyncHandler(async (req, res) => {
  const { vehicle_id, start_date, end_date } = req.body

  const vehicle = await VehicleModel.findById(vehicle_id)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  const start = new Date(start_date)
  const end = new Date(end_date)
  const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const dailyRate = vehicle.price_per_day
  const totalCost = numberOfDays * dailyRate

  res.json({
    success: true,
    data: {
      vehicle_id,
      start_date,
      end_date,
      number_of_days: numberOfDays,
      daily_rate: dailyRate,
      total_cost: totalCost
    }
  })
}))

// @route   GET /api/bookings/stats
// @desc    Get booking statistics
// @access  Private (Admin)
router.get('/stats', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const stats = await BookingModel.getStats()
  
  res.json({
    success: true,
    data: stats
  })
}))

// @route   GET /api/bookings/revenue
// @desc    Get revenue statistics
// @access  Private (Admin)
router.get('/revenue', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
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

// @route   PUT /api/bookings/:id/payment
// @desc    Update booking payment status
// @access  Private (Admin)
router.put('/:id/payment', authenticate, authorize('admin'), [
  body('payment_status').isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Payment status must be valid'),
  body('transaction_id').optional().trim().isLength({ max: 100 }).withMessage('Transaction ID must not exceed 100 characters')
], validate, asyncHandler(async (req, res) => {
  const bookingId = req.params.id
  const { payment_status, transaction_id } = req.body

  const booking = await BookingModel.findById(bookingId)
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  const updatedBooking = await BookingModel.updatePaymentStatus(bookingId, payment_status)

  // Update payment record
  const payment = await PaymentModel.findByBookingId(bookingId)
  if (payment) {
    await PaymentModel.update(payment.id, {
      status: payment_status,
      transaction_id: transaction_id || payment.transaction_id
    })
  }

  // Send notification to user
  await NotificationModel.createNotification(
    booking.user_id,
    'payment',
    'Payment Status Updated',
    `Your payment status has been updated to ${payment_status}`,
    { booking_id: bookingId, payment_status }
  )

  res.json({
    success: true,
    message: `Payment status updated to ${payment_status}`,
    data: { booking: updatedBooking }
  })
}))

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', authenticate, [
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason must not exceed 200 characters')
], validate, asyncHandler(async (req, res) => {
  const bookingId = req.params.id
  const { reason } = req.body
  const currentUser = req.user

  const booking = await BookingModel.findById(bookingId)
  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    })
  }

  // Check if user can cancel this booking
  if (currentUser.role !== 'admin' && currentUser.id !== booking.user_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only cancel your own bookings.'
    })
  }

  // Check if booking can be cancelled
  if (booking.status === 'completed' || booking.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      message: 'Booking cannot be cancelled'
    })
  }

  const updatedBooking = await BookingModel.cancelBooking(bookingId, reason)

  // Update vehicle availability
  await VehicleModel.updateAvailability(booking.vehicle_id, true)

  // Send notification to vendor
  await NotificationModel.createNotification(
    booking.vendor_id,
    'booking',
    'Booking Cancelled',
    `Booking ${bookingId} has been cancelled`,
    { booking_id: bookingId, reason }
  )

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: { booking: updatedBooking }
  })
}))

module.exports = router

