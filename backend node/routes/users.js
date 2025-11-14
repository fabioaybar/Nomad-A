const express = require('express')
const { body } = require('express-validator')
const { UserModel, BookingModel, VehicleModel, VendorModel, ReviewModel, NotificationModel } = require('../database/models')
const { authenticate, authorize } = require('../middleware/auth')
const { validate, asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
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

// @route   GET /api/users/stats
// @desc    Get user statistics (Admin only)
// @access  Private (Admin)
router.get('/stats', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const stats = await UserModel.getStats()
  
  res.json({
    success: true,
    data: stats
  })
}))

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id)
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Check access permissions
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  // Remove password from response
  delete user.password

  res.json({
    success: true,
    data: { user }
  })
}))

// @route   GET /api/users/:id/bookings
// @desc    Get bookings for a specific user
// @access  Private (User can only see their own, Admin can see all)
router.get('/:id/bookings', authenticate, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.role !== 'admin' && currentUser.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only view your own bookings.'
    })
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { user_id: userId }

  if (req.query.status) filters.status = req.query.status

  const result = await BookingModel.paginate(page, limit, filters)
  
  // Populate vehicle and vendor data for each booking
  const populatedBookings = await Promise.all(result.data.map(async (booking) => {
    const vehicle = await VehicleModel.findById(booking.vehicle_id)
    const vendor = await VendorModel.findById(booking.vendor_id)
    
    return {
      ...booking,
      vehicle: vehicle,
      vendor: vendor
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

// @route   GET /api/users/:id/reviews
// @desc    Get reviews by a specific user
// @access  Private (User can only see their own, Admin can see all)
router.get('/:id/reviews', authenticate, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.role !== 'admin' && currentUser.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only view your own reviews.'
    })
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { user_id: userId }

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

// @route   GET /api/users/:id/notifications
// @desc    Get notifications for a specific user
// @access  Private (User can only see their own)
router.get('/:id/notifications', authenticate, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only view your own notifications.'
    })
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { user_id: userId }

  if (req.query.type) filters.type = req.query.type
  if (req.query.is_read !== undefined) filters.is_read = req.query.is_read === 'true'

  const result = await NotificationModel.paginate(page, limit, filters)

  res.json({
    success: true,
    data: {
      notifications: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/users/:id/vehicles
// @desc    Get vehicles for a specific vendor
// @access  Private (Vendor can only see their own, Admin can see all)
router.get('/:id/vehicles', authenticate, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.role !== 'admin' && currentUser.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only view your own vehicles.'
    })
  }

  // Get vendor for this user
  const vendor = await VendorModel.findByUserId(userId)
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found for this user'
    })
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vendor_id: vendor.id }

  if (req.query.type) filters.type = req.query.type
  if (req.query.is_available !== undefined) filters.is_available = req.query.is_available === 'true'
  if (req.query.make) filters.make = req.query.make

  const result = await VehicleModel.paginate(page, limit, filters)

  res.json({
    success: true,
    data: {
      vehicles: result.data,
      pagination: result.pagination
    }
  })
}))

// @route   POST /api/users
// @desc    Create a new user (Admin only)
// @access  Private (Admin)
router.post('/', authenticate, authorize('admin'), [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['user', 'vendor', 'admin']).withMessage('Role must be user, vendor, or admin'),
  body('phone').optional().trim().isLength({ min: 10, max: 15 }).withMessage('Phone must be between 10 and 15 characters')
], validate, asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body

  // Check if user already exists
  const existingUser = await UserModel.findByEmail(email)
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    })
  }

  const userData = {
    name,
    email,
    password, // Password will be hashed in the model
    role,
    phone: phone || null,
    is_active: true
  }

  const user = await UserModel.create(userData)

  // Remove password from response
  delete user.password

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: { user }
  })
}))

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', authenticate, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().trim().isLength({ min: 10, max: 15 }),
  body('is_active').optional().isBoolean()
], validate, asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id)
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Check access permissions
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own profile'
    })
  }

  const allowedUpdates = ['name', 'phone']
  if (req.user.role === 'admin') {
    allowedUpdates.push('is_active', 'role')
  }

  const updates = {}
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key]
    }
  })

  const updatedUser = await UserModel.update(req.params.id, updates)

  // Remove password from response
  delete updatedUser.password

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user: updatedUser }
  })
}))

// @route   PUT /api/users/:id/password
// @desc    Update user password
// @access  Private
router.put('/:id/password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], validate, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id)
  const currentUser = req.user

  // Check access permissions
  if (currentUser.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own password'
    })
  }

  const user = await UserModel.findById(userId)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Verify current password
  const bcrypt = require('bcryptjs')
  const isMatch = await bcrypt.compare(req.body.currentPassword, user.password)
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    })
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.newPassword, salt)

  await UserModel.update(userId, { password: hashedPassword })

  res.json({
    success: true,
    message: 'Password updated successfully'
  })
}))

// @route   PUT /api/users/:id/notifications/read
// @desc    Mark all notifications as read for a user
// @access  Private
router.put('/:id/notifications/read', authenticate, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id)
  const currentUser = req.user

  // Check access permissions
  if (currentUser.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own notifications'
    })
  }

  const updatedCount = await NotificationModel.markAllAsRead(userId)

  res.json({
    success: true,
    message: `${updatedCount} notifications marked as read`
  })
}))

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id)
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Prevent admin from deleting themselves
  if (req.user.id === parseInt(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    })
  }

  await UserModel.delete(req.params.id)

  res.json({
    success: true,
    message: 'User deleted successfully'
  })
}))

module.exports = router

