const express = require('express')
const { NotificationModel, UserModel, BookingModel, VehicleModel, VendorModel } = require('../database/models')
const { authenticate } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')
const { body, param, query, validationResult } = require('express-validator')

const router = express.Router()

// @route   GET /api/notifications
// @desc    Get all notifications for the authenticated user
// @access  Private
router.get('/', [
  authenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['booking', 'payment', 'review', 'maintenance', 'system', 'promotion']).withMessage('Type must be booking, payment, review, maintenance, system, or promotion'),
  query('status').optional().isIn(['unread', 'read']).withMessage('Status must be unread or read'),
  query('sort').optional().isIn(['newest', 'oldest']).withMessage('Sort must be newest or oldest')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const userId = req.user.id
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { user_id: userId }

  if (req.query.type) filters.type = req.query.type
  if (req.query.status) filters.status = req.query.status

  const sort = req.query.sort || 'newest'
  const result = await NotificationModel.paginate(filters, page, limit, sort)

  res.json({
    success: true,
    data: result
  })
}))

// @route   GET /api/notifications/stats
// @desc    Get notification statistics for the authenticated user
// @access  Private
router.get('/stats', [
  authenticate
], asyncHandler(async (req, res) => {
  const userId = req.user.id
  const stats = await NotificationModel.getStats(userId)

  res.json({
    success: true,
    data: { stats }
  })
}))

// @route   GET /api/notifications/unread
// @desc    Get unread notifications for the authenticated user
// @access  Private
router.get('/unread', [
  authenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const userId = req.user.id
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const result = await NotificationModel.findUnreadByUserId(userId, page, limit)

  res.json({
    success: true,
    data: result
  })
}))

// @route   GET /api/notifications/:id
// @desc    Get notification by ID
// @access  Private
router.get('/:id', [
  authenticate,
  param('id').isInt({ min: 1 }).withMessage('Notification ID must be a positive integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const notificationId = parseInt(req.params.id)
  const notification = await NotificationModel.findById(notificationId)

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    })
  }

  // Check if user owns the notification
  if (notification.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this notification'
    })
  }

  res.json({
    success: true,
    data: { notification }
  })
}))

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private
router.post('/', [
  authenticate,
  body('user_id').isInt({ min: 1 }).withMessage('User ID is required and must be a positive integer'),
  body('type').isIn(['booking', 'payment', 'review', 'maintenance', 'system', 'promotion']).withMessage('Type must be booking, payment, review, maintenance, system, or promotion'),
  body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('message').isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('data').optional().isObject().withMessage('Data must be an object')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  // Check if user exists
  const user = await UserModel.findById(req.body.user_id)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  const notificationData = {
    user_id: req.body.user_id,
    type: req.body.type,
    title: req.body.title,
    message: req.body.message,
    data: req.body.data || {},
    status: 'unread'
  }

  const notification = await NotificationModel.create(notificationData)

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: { notification }
  })
}))

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', [
  authenticate,
  param('id').isInt({ min: 1 }).withMessage('Notification ID must be a positive integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const notificationId = parseInt(req.params.id)
  const notification = await NotificationModel.findById(notificationId)

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    })
  }

  // Check if user owns the notification
  if (notification.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this notification'
    })
  }

  const updatedNotification = await NotificationModel.markAsRead(notificationId)

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: { notification: updatedNotification }
  })
}))

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read for the authenticated user
// @access  Private
router.put('/read-all', [
  authenticate
], asyncHandler(async (req, res) => {
  const userId = req.user.id
  await NotificationModel.markAllAsRead(userId)

  res.json({
    success: true,
    message: 'All notifications marked as read'
  })
}))

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', [
  authenticate,
  param('id').isInt({ min: 1 }).withMessage('Notification ID must be a positive integer')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const notificationId = parseInt(req.params.id)
  const notification = await NotificationModel.findById(notificationId)

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    })
  }

  // Check if user owns the notification
  if (notification.user_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this notification'
    })
  }

  await NotificationModel.delete(notificationId)

  res.json({
    success: true,
    message: 'Notification deleted successfully'
  })
}))

// @route   POST /api/notifications/bulk-create
// @desc    Create multiple notifications
// @access  Private
router.post('/bulk-create', [
  authenticate,
  body('notifications').isArray({ min: 1 }).withMessage('Notifications must be an array with at least one item'),
  body('notifications.*.user_id').isInt({ min: 1 }).withMessage('User ID is required and must be a positive integer'),
  body('notifications.*.type').isIn(['booking', 'payment', 'review', 'maintenance', 'system', 'promotion']).withMessage('Type must be booking, payment, review, maintenance, system, or promotion'),
  body('notifications.*.title').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('notifications.*.message').isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('notifications.*.data').optional().isObject().withMessage('Data must be an object')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }

  const notifications = req.body.notifications
  const createdNotifications = []

  for (const notificationData of notifications) {
    // Check if user exists
    const user = await UserModel.findById(notificationData.user_id)
    if (!user) {
      continue // Skip invalid user IDs
    }

    const notification = await NotificationModel.create({
      user_id: notificationData.user_id,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data || {},
      status: 'unread'
    })

    createdNotifications.push(notification)
  }

  res.status(201).json({
    success: true,
    message: `${createdNotifications.length} notifications created successfully`,
    data: { notifications: createdNotifications }
  })
}))

// @route   GET /api/notifications/user/:id
// @desc    Get notifications for a specific user (Admin only)
// @access  Admin
router.get('/user/:id', [
  authenticate,
  param('id').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['booking', 'payment', 'review', 'maintenance', 'system', 'promotion']).withMessage('Type must be booking, payment, review, maintenance, system, or promotion'),
  query('status').optional().isIn(['unread', 'read']).withMessage('Status must be unread or read')
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

  const userId = parseInt(req.params.id)
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = { user_id: userId }

  if (req.query.type) filters.type = req.query.type
  if (req.query.status) filters.status = req.query.status

  const result = await NotificationModel.paginate(filters, page, limit, 'newest')

  res.json({
    success: true,
    data: result
  })
}))

// @route   POST /api/notifications/system
// @desc    Create system-wide notification
// @access  Admin
router.post('/system', [
  authenticate,
  body('type').isIn(['system', 'promotion']).withMessage('Type must be system or promotion'),
  body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
  body('message').isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('data').optional().isObject().withMessage('Data must be an object'),
  body('user_ids').optional().isArray().withMessage('User IDs must be an array')
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

  const { type, title, message, data, user_ids } = req.body
  let targetUsers = []

  if (user_ids && user_ids.length > 0) {
    // Send to specific users
    targetUsers = user_ids
  } else {
    // Send to all active users
    const users = await UserModel.findActive()
    targetUsers = users.map(user => user.id)
  }

  const createdNotifications = []

  for (const userId of targetUsers) {
    const notification = await NotificationModel.create({
      user_id: userId,
      type,
      title,
      message,
      data: data || {},
      status: 'unread'
    })

    createdNotifications.push(notification)
  }

  res.status(201).json({
    success: true,
    message: `${createdNotifications.length} system notifications created successfully`,
    data: { notifications: createdNotifications }
  })
}))

module.exports = router