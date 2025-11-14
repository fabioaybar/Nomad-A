const express = require('express')
const router = express.Router()
const { body, param, query } = require('express-validator')
const { DiscountModel, VendorModel } = require('../database/models')
const { validate, asyncHandler } = require('../middleware/errorHandler')
const { authenticate, authorize } = require('../middleware/auth')

// @route   GET /api/discounts
// @desc    Get all discounts
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
  query('vendor_id').optional().isInt().withMessage('Vendor ID must be an integer'),
  query('is_active').optional().isBoolean().withMessage('is_active must be a boolean')
], validate, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}
  
  if (req.query.type) filters.type = req.query.type
  if (req.query.vendor_id) filters.vendor_id = parseInt(req.query.vendor_id)
  if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === 'true'
  
  const result = await DiscountModel.paginate(page, limit, filters)
  
  res.json({
    success: true,
    data: result
  })
}))

// @route   GET /api/discounts/:id
// @desc    Get discount by ID
// @access  Public
router.get('/:id', [
  param('id').isInt().withMessage('Discount ID must be an integer')
], validate, asyncHandler(async (req, res) => {
  const discount = await DiscountModel.findById(parseInt(req.params.id))
  
  if (!discount) {
    return res.status(404).json({
      success: false,
      message: 'Discount not found'
    })
  }
  
  res.json({
    success: true,
    data: { discount }
  })
}))

// @route   POST /api/discounts
// @desc    Create new discount
// @access  Private (Vendor/Admin)
router.post('/', [
  authenticate,
  authorize(['vendor', 'admin']),
  body('code').trim().isLength({ min: 3, max: 20 }).withMessage('Code must be between 3 and 20 characters'),
  body('type').isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('min_amount').optional().isFloat({ min: 0 }).withMessage('Minimum amount must be a positive number'),
  body('max_discount').optional().isFloat({ min: 0 }).withMessage('Maximum discount must be a positive number'),
  body('usage_limit').optional().isInt({ min: 1 }).withMessage('Usage limit must be a positive integer'),
  body('start_date').isISO8601().withMessage('Start date must be a valid date'),
  body('end_date').isISO8601().withMessage('End date must be a valid date'),
  body('description').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Description must be between 5 and 200 characters')
], validate, asyncHandler(async (req, res) => {
  const discountData = req.body
  
  // Check if code already exists
  const existingDiscount = await DiscountModel.findByCode(discountData.code)
  if (existingDiscount) {
    return res.status(400).json({
      success: false,
      message: 'Discount code already exists'
    })
  }
  
  // Set vendor_id based on user role
  if (req.user.role === 'vendor') {
    discountData.vendor_id = req.user.id
  }
  
  // Validate date range
  const startDate = new Date(discountData.start_date)
  const endDate = new Date(discountData.end_date)
  
  if (startDate >= endDate) {
    return res.status(400).json({
      success: false,
      message: 'End date must be after start date'
    })
  }
  
  const discount = await DiscountModel.create({
    ...discountData,
    usage_count: 0,
    is_active: true
  })
  
  res.status(201).json({
    success: true,
    message: 'Discount created successfully',
    data: { discount }
  })
}))

// @route   PUT /api/discounts/:id
// @desc    Update discount
// @access  Private (Vendor/Admin)
router.put('/:id', [
  authenticate,
  authorize(['vendor', 'admin']),
  param('id').isInt().withMessage('Discount ID must be an integer'),
  body('code').optional().trim().isLength({ min: 3, max: 20 }).withMessage('Code must be between 3 and 20 characters'),
  body('type').optional().isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
  body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('min_amount').optional().isFloat({ min: 0 }).withMessage('Minimum amount must be a positive number'),
  body('max_discount').optional().isFloat({ min: 0 }).withMessage('Maximum discount must be a positive number'),
  body('usage_limit').optional().isInt({ min: 1 }).withMessage('Usage limit must be a positive integer'),
  body('start_date').optional().isISO8601().withMessage('Start date must be a valid date'),
  body('end_date').optional().isISO8601().withMessage('End date must be a valid date'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
  body('description').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Description must be between 5 and 200 characters')
], validate, asyncHandler(async (req, res) => {
  const discountId = parseInt(req.params.id)
  const discount = await DiscountModel.findById(discountId)
  
  if (!discount) {
    return res.status(404).json({
      success: false,
      message: 'Discount not found'
    })
  }
  
  // Check if user can update this discount
  if (req.user.role === 'vendor' && discount.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own discounts'
    })
  }
  
  // Check if code already exists (if updating code)
  if (req.body.code && req.body.code !== discount.code) {
    const existingDiscount = await DiscountModel.findByCode(req.body.code)
    if (existingDiscount) {
      return res.status(400).json({
        success: false,
        message: 'Discount code already exists'
      })
    }
  }
  
  // Validate date range if updating dates
  if (req.body.start_date || req.body.end_date) {
    const startDate = new Date(req.body.start_date || discount.start_date)
    const endDate = new Date(req.body.end_date || discount.end_date)
    
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      })
    }
  }
  
  const updatedDiscount = await DiscountModel.update(discountId, req.body)
  
  res.json({
    success: true,
    message: 'Discount updated successfully',
    data: { discount: updatedDiscount }
  })
}))

// @route   DELETE /api/discounts/:id
// @desc    Delete discount
// @access  Private (Vendor/Admin)
router.delete('/:id', [
  authenticate,
  authorize(['vendor', 'admin']),
  param('id').isInt().withMessage('Discount ID must be an integer')
], validate, asyncHandler(async (req, res) => {
  const discountId = parseInt(req.params.id)
  const discount = await DiscountModel.findById(discountId)
  
  if (!discount) {
    return res.status(404).json({
      success: false,
      message: 'Discount not found'
    })
  }
  
  // Check if user can delete this discount
  if (req.user.role === 'vendor' && discount.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own discounts'
    })
  }
  
  await DiscountModel.delete(discountId)
  
  res.json({
    success: true,
    message: 'Discount deleted successfully'
  })
}))

// @route   POST /api/discounts/validate
// @desc    Validate discount code
// @access  Public
router.post('/validate', [
  body('code').trim().notEmpty().withMessage('Discount code is required')
], validate, asyncHandler(async (req, res) => {
  const { code } = req.body
  
  const discount = await DiscountModel.validateDiscount(code)
  
  if (!discount) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired discount code'
    })
  }
  
  res.json({
    success: true,
    message: 'Discount code is valid',
    data: { discount }
  })
}))

// @route   POST /api/discounts/apply
// @desc    Apply discount code
// @access  Private
router.post('/apply', [
  authenticate,
  body('code').trim().notEmpty().withMessage('Discount code is required')
], validate, asyncHandler(async (req, res) => {
  const { code } = req.body
  
  const discount = await DiscountModel.validateDiscount(code)
  
  if (!discount) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired discount code'
    })
  }
  
  // Check usage limit
  if (discount.usage_limit && discount.usage_count >= discount.usage_limit) {
    return res.status(400).json({
      success: false,
      message: 'Discount code has reached its usage limit'
    })
  }
  
  // Increment usage count
  await DiscountModel.update(discount.id, {
    usage_count: discount.usage_count + 1
  })
  
  res.json({
    success: true,
    message: 'Discount code applied successfully',
    data: { discount }
  })
}))

// @route   DELETE /api/discounts/remove
// @desc    Remove active discount
// @access  Private
router.delete('/remove', [
  authenticate
], asyncHandler(async (req, res) => {
  // This endpoint is for removing active discount from user's session
  // The actual discount remains in the database
  
  res.json({
    success: true,
    message: 'Active discount removed successfully'
  })
}))

// @route   GET /api/discounts/stats
// @desc    Get discount statistics
// @access  Private (Admin)
router.get('/stats', [
  authenticate,
  authorize(['admin'])
], asyncHandler(async (req, res) => {
  const stats = await DiscountModel.getStats()
  
  res.json({
    success: true,
    data: { stats }
  })
}))

// @route   GET /api/vendors/:id/discounts
// @desc    Get vendor's discounts
// @access  Public
router.get('/vendors/:id/discounts', [
  param('id').isInt().withMessage('Vendor ID must be an integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('is_active').optional().isBoolean().withMessage('is_active must be a boolean')
], validate, asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  
  // Check if vendor exists
  const vendor = await VendorModel.findById(vendorId)
  if (!vendor) {
    return res.status(404).json({
      success: false,
      message: 'Vendor not found'
    })
  }
  
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { vendor_id: vendorId }
  
  if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === 'true'
  
  const result = await DiscountModel.paginate(page, limit, filters)
  
  res.json({
    success: true,
    data: result
  })
}))

module.exports = router