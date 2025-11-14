const express = require('express')
const { body } = require('express-validator')
const rateLimit = require('express-rate-limit')
const { UserModel } = require('../database/models')
const { generateToken, hashPassword, comparePassword, authenticate } = require('../middleware/auth')
const { validate, asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs (increased for testing)
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['user', 'vendor']).withMessage('Role must be either user or vendor')
]

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
]

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, registerValidation, validate, asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user', phone } = req.body

  // Check if user already exists
  const existingUser = await UserModel.findByEmail(email)
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    })
  }

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
    is_active: true
  })

  // Generate token
  const token = generateToken({ id: user.id, email: user.email, role: user.role })

  // Remove password from response
  delete user.password

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  })
}))

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, loginValidation, validate, asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find user
  const user = await UserModel.findByEmail(email)
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  // Check if user is active
  if (!user.is_active) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    })
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    })
  }

  // Update last login
  await UserModel.update(user.id, { last_login: new Date().toISOString() })

  // Generate token
  const token = generateToken(user.id)

  // Remove password from response
  delete user.password

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  })
}))

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id)
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  // Remove password from response
  delete user.password

  res.json({
    success: true,
    data: { user }
  })
}))

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('phone').optional().trim().isLength({ min: 10, max: 15 }).withMessage('Phone must be between 10 and 15 characters')
], validate, asyncHandler(async (req, res) => {
  const { name, phone } = req.body
  const updates = {}

  if (name) updates.name = name
  if (phone) updates.phone = phone

  const user = await UserModel.update(req.user.id, updates)

  // Remove password from response
  delete user.password

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  })
}))

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticate, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  })
}))

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', authenticate, asyncHandler(async (req, res) => {
  const token = generateToken({ id: req.user.id, email: req.user.email, role: req.user.role })

  res.json({
    success: true,
    message: 'Token refreshed successfully',
    data: { token }
  })
}))

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], validate, asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await UserModel.findByEmail(email)
  if (!user) {
    // Don't reveal if email exists or not
    return res.json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    })
  }

  // In a real application, you would send an email here
  // For now, we'll just return a success message
  res.json({
    success: true,
    message: 'If the email exists, a password reset link has been sent'
  })
}))

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', authLimiter, [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], validate, asyncHandler(async (req, res) => {
  const { token, password } = req.body

  // In a real application, you would verify the reset token here
  // For now, we'll just return a success message
  res.json({
    success: true,
    message: 'Password has been reset successfully'
  })
}))

module.exports = router

