const express = require('express')
const { ReviewModel, BookingModel, VehicleModel, VendorModel, UserModel } = require('../database/models')
const { authenticate } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')
const { body, param, query, validationResult } = require('express-validator')

const router = express.Router()

// @route   GET /api/reviews
// @desc    Get all reviews with filters and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('vehicle_id').optional().isInt({ min: 1 }).withMessage('Vehicle ID must be a positive integer'),
  query('vendor_id').optional().isInt({ min: 1 }).withMessage('Vendor ID must be a positive integer'),
  query('user_id').optional().isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected'),
  query('sort').optional().isIn(['newest', 'oldest', 'highest_rating', 'lowest_rating']).withMessage('Sort must be newest, oldest, highest_rating, or lowest_rating')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  if (req.query.vehicle_id) filters.vehicle_id = parseInt(req.query.vehicle_id)
  if (req.query.vendor_id) filters.vendor_id = parseInt(req.query.vendor_id)
  if (req.query.user_id) filters.user_id = parseInt(req.query.user_id)
  if (req.query.rating) filters.rating = parseInt(req.query.rating)
  if (req.query.status) filters.status = req.query.status

  const sort = req.query.sort || 'newest'
  const result = await ReviewModel.paginate(filters, page, limit, sort)

  res.json({
    success: true,
    data: result
  })
}))

// @route   GET /api/reviews/stats
// @desc    Get review statistics
// @access  Public
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await ReviewModel.getStats()

  res.json({
    success: true,
    data: { stats }
  })
}))

// @route   GET /api/reviews/:id
// @desc    Get review by ID
// @access  Public
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Review ID must be a positive integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const review = await ReviewModel.findById(parseInt(req.params.id))
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    })
  }

  res.json({
    success: true,
    data: { review }
  })
}))

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', [
  authenticate,
  body('vehicle_id').isInt({ min: 1 }).withMessage('Vehicle ID is required and must be a positive integer'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('title').optional().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const { vehicle_id, rating, comment, title } = req.body
  const user_id = req.user.id

  // Check if vehicle exists
  const vehicle = await VehicleModel.findById(vehicle_id)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  // Check if user has completed a booking for this vehicle
  const booking = await BookingModel.findByFields({
    user_id,
    vehicle_id,
    status: 'completed'
  })

  if (!booking || booking.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'You can only review vehicles you have rented'
    })
  }

  // Check if user has already reviewed this vehicle
  const existingReview = await ReviewModel.findByFields({
    user_id,
    vehicle_id
  })

  if (existingReview && existingReview.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this vehicle'
    })
  }

  const reviewData = {
    user_id,
    vehicle_id,
    vendor_id: vehicle.vendor_id,
    rating,
    comment: comment || '',
    title: title || '',
    status: 'pending'
  }

  const review = await ReviewModel.create(reviewData)

  // Update vehicle rating
  await VehicleModel.updateRating(vehicle_id)

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: { review }
  })
}))

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', [
  authenticate,
  param('id').isInt({ min: 1 }).withMessage('Review ID must be a positive integer'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('title').optional().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const reviewId = parseInt(req.params.id)
  const review = await ReviewModel.findById(reviewId)

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    })
  }

  // Check if user owns the review or is admin
  if (review.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this review'
    })
  }

  // Only allow updates to pending reviews
  if (review.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Only pending reviews can be updated'
    })
  }

  const updateData = {}
  if (req.body.rating !== undefined) updateData.rating = req.body.rating
  if (req.body.comment !== undefined) updateData.comment = req.body.comment
  if (req.body.title !== undefined) updateData.title = req.body.title

  const updatedReview = await ReviewModel.update(reviewId, updateData)

  // Update vehicle rating if rating changed
  if (req.body.rating !== undefined) {
    await VehicleModel.updateRating(review.vehicle_id)
  }

  res.json({
    success: true,
    message: 'Review updated successfully',
    data: { review: updatedReview }
  })
}))

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', [
  authenticate,
  param('id').isInt({ min: 1 }).withMessage('Review ID must be a positive integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const reviewId = parseInt(req.params.id)
  const review = await ReviewModel.findById(reviewId)

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    })
  }

  // Check if user owns the review or is admin
  if (review.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this review'
    })
  }

  await ReviewModel.delete(reviewId)

  // Update vehicle rating
  await VehicleModel.updateRating(review.vehicle_id)

  res.json({
    success: true,
    message: 'Review deleted successfully'
  })
}))

// @route   PUT /api/reviews/:id/approve
// @desc    Approve review
// @access  Admin
router.put('/:id/approve', [
  authenticate,
  param('id').isInt({ min: 1 }).withMessage('Review ID must be a positive integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    })
  }

  const reviewId = parseInt(req.params.id)
  const review = await ReviewModel.findById(reviewId)

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    })
  }

  const updatedReview = await ReviewModel.approveReview(reviewId)

  // Update vehicle rating
  await VehicleModel.updateRating(review.vehicle_id)

  res.json({
    success: true,
    message: 'Review approved successfully',
    data: { review: updatedReview }
  })
}))

// @route   PUT /api/reviews/:id/reject
// @desc    Reject review
// @access  Admin
router.put('/:id/reject', [
  authenticate,
  param('id').isInt({ min: 1 }).withMessage('Review ID must be a positive integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    })
  }

  const reviewId = parseInt(req.params.id)
  const review = await ReviewModel.findById(reviewId)

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    })
  }

  const updatedReview = await ReviewModel.rejectReview(reviewId)

  res.json({
    success: true,
    message: 'Review rejected successfully',
    data: { review: updatedReview }
  })
}))

// @route   GET /api/reviews/vehicle/:id
// @desc    Get reviews for a specific vehicle
// @access  Public
router.get('/vehicle/:id', [
  param('id').isInt({ min: 1 }).withMessage('Vehicle ID must be a positive integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const vehicleId = parseInt(req.params.id)
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vehicle_id: vehicleId }

  if (req.query.rating) filters.rating = parseInt(req.query.rating)
  if (req.query.status) filters.status = req.query.status

  const result = await ReviewModel.paginate(filters, page, limit, 'newest')

  res.json({
    success: true,
    data: result
  })
}))

// @route   GET /api/reviews/vendor/:id
// @desc    Get reviews for a specific vendor
// @access  Public
router.get('/vendor/:id', [
  param('id').isInt({ min: 1 }).withMessage('Vendor ID must be a positive integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const vendorId = parseInt(req.params.id)
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vendor_id: vendorId }

  if (req.query.rating) filters.rating = parseInt(req.query.rating)
  if (req.query.status) filters.status = req.query.status

  const result = await ReviewModel.paginate(filters, page, limit, 'newest')

  res.json({
    success: true,
    data: result
  })
}))

// @route   GET /api/reviews/user/:id
// @desc    Get reviews by a specific user
// @access  Public
router.get('/user/:id', [
  param('id').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const userId = parseInt(req.params.id)
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { user_id: userId }

  if (req.query.rating) filters.rating = parseInt(req.query.rating)
  if (req.query.status) filters.status = req.query.status

  const result = await ReviewModel.paginate(filters, page, limit, 'newest')

  res.json({
    success: true,
    data: result
  })
}))

// @route   POST /api/reviews/:id/respond
// @desc    Respond to a review (Vendor only)
// @access  Private (Vendor)
router.post('/:id/respond', authenticate, [
  body('vendor_response').trim().isLength({ min: 1, max: 1000 }).withMessage('Vendor response must be between 1 and 1000 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const review = await ReviewModel.findById(req.params.id)
  
  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    })
  }

  // Check if user is the vendor who owns this review
  if (req.user.role !== 'vendor') {
    return res.status(403).json({
      success: false,
      message: 'Only vendors can respond to reviews'
    })
  }

  // Check if user is the vendor for this review
  const vendor = await VendorModel.findByUserId(req.user.id)
  if (!vendor || vendor.id !== review.vendor_id) {
    return res.status(403).json({
      success: false,
      message: 'You can only respond to reviews for your vehicles'
    })
  }

  // Check if review already has a response
  if (review.vendor_response) {
    return res.status(400).json({
      success: false,
      message: 'This review already has a response'
    })
  }

  const updatedReview = await ReviewModel.update(req.params.id, {
    vendor_response: req.body.vendor_response,
    updated_at: new Date().toISOString()
  })

  res.json({
    success: true,
    message: 'Response added successfully',
    data: { review: updatedReview }
  })
}))

// @route   GET /api/vendors/:id/reviews
// @desc    Get reviews for a specific vendor
// @access  Private (Vendor/Admin)
router.get('/vendors/:id', authenticate, [
  param('id').isInt({ min: 1 }).withMessage('Vendor ID must be a positive integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Status must be pending, approved, or rejected')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const vendorId = parseInt(req.params.id)
  const currentUser = req.user

  // Check if user can access this data
  if (currentUser.role !== 'admin') {
    const vendor = await VendorModel.findByUserId(currentUser.id)
    if (!vendor || vendor.id !== vendorId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view reviews for your own vehicles.'
      })
    }
  }

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vendor_id: vendorId }

  if (req.query.rating) filters.rating = parseInt(req.query.rating)
  if (req.query.status) filters.status = req.query.status

  const result = await ReviewModel.paginate(filters, page, limit, 'newest')

  // Populate user and vehicle data for each review
  const populatedReviews = await Promise.all(result.data.map(async (review) => {
    const user = await UserModel.findById(review.user_id)
    const vehicle = await VehicleModel.findById(review.vehicle_id)
    
    return {
      ...review,
      user,
      vehicle
    }
  }))

  res.json({
    success: true,
    data: {
      reviews: populatedReviews,
      pagination: result.pagination
    }
  })
}))

module.exports = router