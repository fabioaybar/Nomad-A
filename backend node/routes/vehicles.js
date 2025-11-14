const express = require('express')
const { body, query } = require('express-validator')
const { VehicleModel, VendorModel, BookingModel, ReviewModel, MaintenanceModel } = require('../database/models')
const { authenticate, authorize, optionalAuth } = require('../middleware/auth')
const { validate, asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Validation rules
const vehicleValidation = [
  body('make').trim().notEmpty().withMessage('Make is required'),
  body('model').trim().notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('type').isIn(['sedan', 'suv', 'hatchback', 'convertible', 'coupe', 'wagon', 'pickup', 'van']).withMessage('Invalid vehicle type'),
  body('fuel_type').isIn(['gasoline', 'diesel', 'hybrid', 'electric']).withMessage('Invalid fuel type'),
  body('transmission').isIn(['manual', 'automatic']).withMessage('Invalid transmission type'),
  body('seats').isInt({ min: 1, max: 20 }).withMessage('Seats must be between 1 and 20'),
  body('doors').isInt({ min: 2, max: 6 }).withMessage('Doors must be between 2 and 6'),
  body('price_per_day').isFloat({ min: 0 }).withMessage('Price per day must be positive'),
  body('location_address').trim().notEmpty().withMessage('Location address is required')
]

// @route   GET /api/vehicles
// @desc    Get all vehicles with optional filters
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['sedan', 'suv', 'hatchback', 'convertible', 'coupe', 'wagon', 'pickup', 'van']),
  query('fuel_type').optional().isIn(['gasoline', 'diesel', 'hybrid', 'electric']),
  query('transmission').optional().isIn(['manual', 'automatic']),
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 }),
  query('available').optional().isBoolean()
], validate, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  // Apply filters
  if (req.query.type) filters.type = req.query.type
  if (req.query.fuel_type) filters.fuel_type = req.query.fuel_type
  if (req.query.transmission) filters.transmission = req.query.transmission
  if (req.query.available === 'true') {
    filters.is_available = true
    filters.rental_status = 'available'
  }

  const result = await VehicleModel.paginate(page, limit, filters)

  // Filter by price range if specified
  let vehicles = result.data
  if (req.query.min_price || req.query.max_price) {
    const minPrice = parseFloat(req.query.min_price) || 0
    const maxPrice = parseFloat(req.query.max_price) || Infinity
    
    vehicles = vehicles.filter(vehicle => 
      vehicle.price_per_day >= minPrice && vehicle.price_per_day <= maxPrice
    )
  }

  // Populate vendor data for each vehicle
  const populatedVehicles = await Promise.all(vehicles.map(async (vehicle) => {
    const vendor = await VendorModel.findById(vehicle.vendor_id)
    return {
      ...vehicle,
      vendor: vendor || null
    }
  }))

  res.json({
    success: true,
    data: {
      vehicles: populatedVehicles,
      pagination: {
        ...result.pagination,
        total: populatedVehicles.length
      }
    }
  })
}))

// @route   GET /api/vehicles/available
// @desc    Get available vehicles
// @access  Public
router.get('/available', optionalAuth, asyncHandler(async (req, res) => {
  const vehicles = await VehicleModel.findAvailable()
  
  // Populate vendor data for each vehicle
  const populatedVehicles = await Promise.all(vehicles.map(async (vehicle) => {
    const vendor = await VendorModel.findById(vehicle.vendor_id)
    return {
      ...vehicle,
      vendor: vendor || null
    }
  }))
  
  res.json({
    success: true,
    data: { vehicles: populatedVehicles }
  })
}))

// @route   GET /api/vehicles/search
// @desc    Search vehicles
// @access  Public
router.get('/search', optionalAuth, [
  query('q').trim().notEmpty().withMessage('Search query is required')
], validate, asyncHandler(async (req, res) => {
  const { q } = req.query
  const vehicles = await VehicleModel.search(q)
  
  // Populate vendor data for each vehicle
  const populatedVehicles = await Promise.all(vehicles.map(async (vehicle) => {
    const vendor = await VendorModel.findById(vehicle.vendor_id)
    return {
      ...vehicle,
      vendor: vendor || null
    }
  }))
  
  res.json({
    success: true,
    data: { vehicles: populatedVehicles }
  })
}))

// @route   GET /api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Public
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const vehicle = await VehicleModel.findById(req.params.id)
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  // Populate vendor data
  const vendor = await VendorModel.findById(vehicle.vendor_id)
  const populatedVehicle = {
    ...vehicle,
    vendor: vendor || null
  }

  res.json({
    success: true,
    data: { vehicle: populatedVehicle }
  })
}))

// @route   POST /api/vehicles
// @desc    Create a new vehicle
// @access  Private (Vendor/Admin)
router.post('/', authenticate, authorize('vendor', 'admin'), vehicleValidation, validate, asyncHandler(async (req, res) => {
  const vehicleData = {
    ...req.body,
    vendor_id: req.user.role === 'vendor' ? req.user.id : req.body.vendor_id,
    is_available: true,
    is_rented: false,
    rental_status: 'available',
    average_rating: 0,
    total_reviews: 0,
    images: req.body.images || [],
    features: req.body.features || []
  }

  const vehicle = await VehicleModel.create(vehicleData)

  res.status(201).json({
    success: true,
    message: 'Vehicle created successfully',
    data: { vehicle }
  })
}))

// @route   PUT /api/vehicles/:id
// @desc    Update vehicle
// @access  Private (Vendor/Admin)
router.put('/:id', authenticate, authorize('vendor', 'admin'), vehicleValidation, validate, asyncHandler(async (req, res) => {
  const vehicle = await VehicleModel.findById(req.params.id)
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  // Check if vendor owns this vehicle (unless admin)
  if (req.user.role === 'vendor' && vehicle.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own vehicles'
    })
  }

  const updatedVehicle = await VehicleModel.update(req.params.id, req.body)

  res.json({
    success: true,
    message: 'Vehicle updated successfully',
    data: { vehicle: updatedVehicle }
  })
}))

// @route   DELETE /api/vehicles/:id
// @desc    Delete vehicle
// @access  Private (Vendor/Admin)
router.delete('/:id', authenticate, authorize('vendor', 'admin'), asyncHandler(async (req, res) => {
  const vehicle = await VehicleModel.findById(req.params.id)
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  // Check if vendor owns this vehicle (unless admin)
  if (req.user.role === 'vendor' && vehicle.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own vehicles'
    })
  }

  await VehicleModel.delete(req.params.id)

  res.json({
    success: true,
    message: 'Vehicle deleted successfully'
  })
}))

// @route   GET /api/vehicles/features
// @desc    Get available vehicle features
// @access  Public
router.get('/features', asyncHandler(async (req, res) => {
  const features = [
    'Air Conditioning',
    'GPS Navigation',
    'Bluetooth',
    'USB Ports',
    'Leather Seats',
    'Sunroof',
    'Backup Camera',
    'Cruise Control',
    'Automatic Transmission',
    'Manual Transmission',
    '4WD',
    'Child Safety Seats',
    'WiFi Hotspot',
    'Premium Sound System',
    'Heated Seats',
    'Remote Start',
    'Keyless Entry',
    'Tinted Windows',
    'Alloy Wheels',
    'Fog Lights'
  ]

  res.json({
    success: true,
    data: { features }
  })
}))

// @route   GET /api/vehicles/makes
// @desc    Get available vehicle makes
// @access  Public
router.get('/makes', asyncHandler(async (req, res) => {
  const makes = [
    'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia',
    'Mazda', 'Subaru', 'Mitsubishi', 'Volkswagen', 'BMW', 'Mercedes-Benz',
    'Audi', 'Lexus', 'Acura', 'Infiniti', 'Cadillac', 'Lincoln', 'Buick',
    'Chrysler', 'Dodge', 'Jeep', 'Ram', 'GMC', 'Genesis', 'Volvo', 'Saab',
    'Jaguar', 'Land Rover', 'Porsche', 'Ferrari', 'Lamborghini', 'Maserati',
    'Bentley', 'Rolls-Royce', 'Aston Martin', 'McLaren', 'Bugatti', 'Koenigsegg'
  ]

  res.json({
    success: true,
    data: { makes }
  })
}))

// @route   GET /api/vehicles/:id/reviews
// @desc    Get reviews for a specific vehicle
// @access  Public
router.get('/:id/reviews', optionalAuth, asyncHandler(async (req, res) => {
  const vehicleId = parseInt(req.params.id)
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vehicle_id: vehicleId }

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

// @route   GET /api/vehicles/:id/bookings
// @desc    Get bookings for a specific vehicle
// @access  Private (Vendor/Admin)
router.get('/:id/bookings', authenticate, asyncHandler(async (req, res) => {
  const vehicleId = parseInt(req.params.id)
  const currentUser = req.user

  // Get vehicle to check vendor
  const vehicle = await VehicleModel.findById(vehicleId)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  // Check if user can access this data
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vehicle.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view bookings for your own vehicles.'
      })
    }
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vehicle_id: vehicleId }

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

// @route   GET /api/vehicles/:id/maintenance
// @desc    Get maintenance records for a specific vehicle
// @access  Private (Vendor/Admin)
router.get('/:id/maintenance', authenticate, asyncHandler(async (req, res) => {
  const vehicleId = parseInt(req.params.id)
  const currentUser = req.user

  // Get vehicle to check vendor
  const vehicle = await VehicleModel.findById(vehicleId)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  // Check if user can access this data
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vehicle.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view maintenance records for your own vehicles.'
      })
    }
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vehicle_id: vehicleId }

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

// @route   GET /api/vehicles/:id/availability
// @desc    Check vehicle availability for specific dates
// @access  Public
router.get('/:id/availability', optionalAuth, asyncHandler(async (req, res) => {
  const vehicleId = parseInt(req.params.id)
  const { start_date, end_date } = req.query

  if (!start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: 'Start date and end date are required'
    })
  }

  const vehicle = await VehicleModel.findById(vehicleId)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  const isAvailable = await BookingModel.checkAvailability(vehicleId, start_date, end_date)

  res.json({
    success: true,
    data: {
      vehicle_id: vehicleId,
      start_date,
      end_date,
      is_available: isAvailable
    }
  })
}))

// @route   PUT /api/vehicles/:id/availability
// @desc    Update vehicle availability
// @access  Private (Vendor/Admin)
router.put('/:id/availability', authenticate, authorize('vendor', 'admin'), [
  body('is_available').isBoolean().withMessage('Availability status must be boolean')
], validate, asyncHandler(async (req, res) => {
  const vehicleId = req.params.id
  const { is_available } = req.body
  const currentUser = req.user

  const vehicle = await VehicleModel.findById(vehicleId)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  // Check if user can update this vehicle
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vehicle.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own vehicles.'
      })
    }
  }

  const updatedVehicle = await VehicleModel.updateAvailability(vehicleId, is_available)

  res.json({
    success: true,
    message: `Vehicle ${is_available ? 'made available' : 'made unavailable'}`,
    data: { vehicle: updatedVehicle }
  })
}))

// @route   PUT /api/vehicles/:id/rating
// @desc    Update vehicle rating
// @access  Private (Vendor/Admin)
router.put('/:id/rating', authenticate, authorize('vendor', 'admin'), asyncHandler(async (req, res) => {
  const vehicleId = req.params.id
  const currentUser = req.user

  const vehicle = await VehicleModel.findById(vehicleId)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  // Check if user can update this vehicle
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vehicle.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own vehicles.'
      })
    }
  }

  const updatedVehicle = await VehicleModel.updateRating(vehicleId)

  res.json({
    success: true,
    message: 'Vehicle rating updated successfully',
    data: { vehicle: updatedVehicle }
  })
}))

// @route   GET /api/vehicles/stats
// @desc    Get vehicle statistics
// @access  Public
router.get('/stats', optionalAuth, asyncHandler(async (req, res) => {
  const stats = await VehicleModel.getStats()
  
  res.json({
    success: true,
    data: stats
  })
}))

// @route   GET /api/vehicles/top-rated
// @desc    Get top rated vehicles
// @access  Public
router.get('/top-rated', optionalAuth, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const topVehicles = await VehicleModel.getTopRated(limit)
  
  res.json({
    success: true,
    data: topVehicles
  })
}))

// @route   GET /api/vehicles/most-popular
// @desc    Get most popular vehicles
// @access  Public
router.get('/most-popular', optionalAuth, asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10
  const popularVehicles = await VehicleModel.getMostPopular(limit)
  
  res.json({
    success: true,
    data: popularVehicles
  })
}))

module.exports = router

