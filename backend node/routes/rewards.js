const express = require('express')
const router = express.Router()
const { body, param, query } = require('express-validator')
const { RewardModel, DiscountModel, UserModel } = require('../database/models')
const { validate, asyncHandler } = require('../middleware/errorHandler')
const { authenticate, authorize } = require('../middleware/auth')

// @route   GET /api/rewards
// @desc    Get all rewards
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['points', 'discount', 'free_rental', 'upgrade']).withMessage('Invalid reward type'),
  query('vendor_id').optional().isInt().withMessage('Vendor ID must be an integer'),
  query('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
  query('is_redeemed').optional().isBoolean().withMessage('is_redeemed must be a boolean')
], validate, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}
  
  if (req.query.type) filters.type = req.query.type
  if (req.query.vendor_id) filters.vendor_id = parseInt(req.query.vendor_id)
  if (req.query.is_active !== undefined) filters.is_active = req.query.is_active === 'true'
  if (req.query.is_redeemed !== undefined) filters.is_redeemed = req.query.is_redeemed === 'true'
  
  const result = await RewardModel.paginate(page, limit, filters)
  
  res.json({
    success: true,
    data: result
  })
}))

// @route   GET /api/rewards/:id
// @desc    Get reward by ID
// @access  Public
router.get('/:id', [
  param('id').isInt().withMessage('Reward ID must be an integer')
], validate, asyncHandler(async (req, res) => {
  const reward = await RewardModel.findById(parseInt(req.params.id))
  
  if (!reward) {
    return res.status(404).json({
      success: false,
      message: 'Reward not found'
    })
  }
  
  res.json({
    success: true,
    data: { reward }
  })
}))

// @route   POST /api/rewards
// @desc    Create new reward
// @access  Private (Vendor/Admin)
router.post('/', [
  authenticate,
  authorize(['vendor', 'admin']),
  body('user_id').isInt().withMessage('User ID is required'),
  body('type').isIn(['points', 'discount', 'free_rental', 'upgrade']).withMessage('Type must be points, discount, free_rental, or upgrade'),
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('points_required').isInt({ min: 0 }).withMessage('Points required must be a non-negative integer'),
  body('expiry_date').optional().isISO8601().withMessage('Expiry date must be a valid date')
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
  
  // Set vendor_id based on user role
  if (req.user.role === 'vendor') {
    rewardData.vendor_id = req.user.id
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

// @route   PUT /api/rewards/:id
// @desc    Update reward
// @access  Private (Vendor/Admin)
router.put('/:id', [
  authenticate,
  authorize(['vendor', 'admin']),
  param('id').isInt().withMessage('Reward ID must be an integer'),
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('points_required').optional().isInt({ min: 0 }).withMessage('Points required must be a non-negative integer'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
  body('expiry_date').optional().isISO8601().withMessage('Expiry date must be a valid date')
], validate, asyncHandler(async (req, res) => {
  const rewardId = parseInt(req.params.id)
  const reward = await RewardModel.findById(rewardId)
  
  if (!reward) {
    return res.status(404).json({
      success: false,
      message: 'Reward not found'
    })
  }
  
  // Check if user can update this reward
  if (req.user.role === 'vendor' && reward.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own rewards'
    })
  }
  
  const updatedReward = await RewardModel.update(rewardId, req.body)
  
  res.json({
    success: true,
    message: 'Reward updated successfully',
    data: { reward: updatedReward }
  })
}))

// @route   DELETE /api/rewards/:id
// @desc    Delete reward
// @access  Private (Vendor/Admin)
router.delete('/:id', [
  authenticate,
  authorize(['vendor', 'admin']),
  param('id').isInt().withMessage('Reward ID must be an integer')
], validate, asyncHandler(async (req, res) => {
  const rewardId = parseInt(req.params.id)
  const reward = await RewardModel.findById(rewardId)
  
  if (!reward) {
    return res.status(404).json({
      success: false,
      message: 'Reward not found'
    })
  }
  
  // Check if user can delete this reward
  if (req.user.role === 'vendor' && reward.vendor_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own rewards'
    })
  }
  
  await RewardModel.delete(rewardId)
  
  res.json({
    success: true,
    message: 'Reward deleted successfully'
  })
}))

// @route   POST /api/rewards/:id/redeem
// @desc    Redeem reward
// @access  Private
router.post('/:id/redeem', [
  authenticate,
  param('id').isInt().withMessage('Reward ID must be an integer')
], validate, asyncHandler(async (req, res) => {
  const rewardId = parseInt(req.params.id)
  const reward = await RewardModel.findById(rewardId)
  
  if (!reward) {
    return res.status(404).json({
      success: false,
      message: 'Reward not found'
    })
  }
  
  // Check if reward belongs to the user
  if (reward.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'You can only redeem your own rewards'
    })
  }
  
  // Check if reward is already redeemed
  if (reward.is_redeemed) {
    return res.status(400).json({
      success: false,
      message: 'Reward has already been redeemed'
    })
  }
  
  // Check if reward is active
  if (!reward.is_active) {
    return res.status(400).json({
      success: false,
      message: 'Reward is not active'
    })
  }
  
  // Check if reward has expired
  if (reward.expiry_date && new Date(reward.expiry_date) < new Date()) {
    return res.status(400).json({
      success: false,
      message: 'Reward has expired'
    })
  }
  
  const redeemedReward = await RewardModel.redeemReward(rewardId)
  
  res.json({
    success: true,
    message: 'Reward redeemed successfully',
    data: { reward: redeemedReward }
  })
}))

// @route   GET /api/rewards/stats
// @desc    Get reward statistics
// @access  Private (Admin)
router.get('/stats', [
  authenticate,
  authorize(['admin'])
], asyncHandler(async (req, res) => {
  const stats = await RewardModel.getStats()
  
  res.json({
    success: true,
    data: { stats }
  })
}))

// @route   GET /api/users/:id/rewards
// @desc    Get user's rewards
// @access  Private
router.get('/users/:id/rewards', [
  authenticate,
  param('id').isInt().withMessage('User ID must be an integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['points', 'discount', 'free_rental', 'upgrade']).withMessage('Invalid reward type'),
  query('is_redeemed').optional().isBoolean().withMessage('is_redeemed must be a boolean')
], validate, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id)
  
  // Check if user can access these rewards
  if (req.user.role !== 'admin' && req.user.id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You can only view your own rewards'
    })
  }
  
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { user_id: userId }
  
  if (req.query.type) filters.type = req.query.type
  if (req.query.is_redeemed !== undefined) filters.is_redeemed = req.query.is_redeemed === 'true'
  
  const result = await RewardModel.paginate(page, limit, filters)
  
  res.json({
    success: true,
    data: result
  })
}))

// @route   POST /api/users/:id/rewards/earn
// @desc    Earn points for user
// @access  Private (Vendor/Admin)
router.post('/users/:id/rewards/earn', [
  authenticate,
  authorize(['vendor', 'admin']),
  param('id').isInt().withMessage('User ID must be an integer'),
  body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
  body('reason').trim().isLength({ min: 5, max: 200 }).withMessage('Reason must be between 5 and 200 characters')
], validate, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id)
  const { points, reason } = req.body
  
  // Check if user exists
  const user = await UserModel.findById(userId)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
  
  // Create points reward
  const reward = await RewardModel.create({
    user_id: userId,
    vendor_id: req.user.role === 'vendor' ? req.user.id : null,
    type: 'points',
    title: `Earned ${points} points`,
    description: reason,
    value: points,
    points_required: 0,
    is_active: true,
    is_redeemed: false
  })
  
  res.status(201).json({
    success: true,
    message: 'Points earned successfully',
    data: { reward }
  })
}))

// @route   POST /api/users/:id/rewards/use
// @desc    Use points for user
// @access  Private (Vendor/Admin)
router.post('/users/:id/rewards/use', [
  authenticate,
  authorize(['vendor', 'admin']),
  param('id').isInt().withMessage('User ID must be an integer'),
  body('points').isInt({ min: 1 }).withMessage('Points must be a positive integer'),
  body('reason').trim().isLength({ min: 5, max: 200 }).withMessage('Reason must be between 5 and 200 characters')
], validate, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id)
  const { points, reason } = req.body
  
  // Check if user exists
  const user = await UserModel.findById(userId)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }
  
  // Create points usage reward
  const reward = await RewardModel.create({
    user_id: userId,
    vendor_id: req.user.role === 'vendor' ? req.user.id : null,
    type: 'points',
    title: `Used ${points} points`,
    description: reason,
    value: -points,
    points_required: 0,
    is_active: true,
    is_redeemed: false
  })
  
  res.status(201).json({
    success: true,
    message: 'Points used successfully',
    data: { reward }
  })
}))

module.exports = router