const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { 
  UserModel, 
  VehicleModel, 
  BookingModel, 
  ReviewModel, 
  NotificationModel, 
  MaintenanceModel, 
  RewardModel, 
  DiscountModel, 
  ConversationModel, 
  MessageModel, 
  ReportModel, 
  PaymentModel 
} = require('../database/models')

// Password hashing utility
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12)
  return await bcrypt.hash(password, salt)
}

// Password comparison utility (simplified for testing - no hashing)
const comparePassword = async (password, storedPassword) => {
  // For testing purposes, use simple string comparison
  // In production, this should use bcrypt.compare(password, storedPassword)
  return password === storedPassword
}

// JWT token generation
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  })
}

// Middleware for optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      req.user = null
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    const user = await UserModel.findById(decoded.id)

    if (user && user.is_active) {
      req.user = user
    } else {
      req.user = null
    }

    next()
  } catch (error) {
    req.user = null
    next()
  }
}

// Middleware to authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    const user = await UserModel.findById(decoded.id)
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      })
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    })
  }
}

// Middleware to authorize user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.'
      })
    }

    next()
  }
}

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.'
    })
  }
  next()
}

// Middleware to check if user is vendor
const requireVendor = (req, res, next) => {
  if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Vendor access required.'
    })
  }
  next()
}

// Middleware to check if user is vendor or admin
const requireVendorOrAdmin = (req, res, next) => {
  if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Vendor or Admin access required.'
    })
  }
  next()
}

// Middleware to check if user owns the resource or is admin
const requireOwnershipOrAdmin = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField]
    
    if (req.user.role === 'admin' || req.user.id === parseInt(resourceUserId)) {
      return next()
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this resource.'
    })
  }
}

// Middleware to check if user can access vendor resource
const requireVendorAccess = (req, res, next) => {
  const vendorId = req.params.vendor_id || req.body.vendor_id

  if (req.user.role === 'admin') {
    return next()
  }

  if (req.user.role === 'vendor') {
    // Check if vendor is accessing their own resource
    if (req.user.id === parseInt(vendorId)) {
      return next()
    }
  }

  return res.status(403).json({
        success: false,
    message: 'Not authorized to access this vendor resource.'
  })
}

// Middleware to check if user can access vehicle resource
const requireVehicleAccess = async (req, res, next) => {
  try {
    const vehicleId = req.params.vehicle_id || req.body.vehicle_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor owns the vehicle
      const vehicle = await VehicleModel.findById(vehicleId)
      if (vehicle && vehicle.vendor_id === req.user.id) {
        return next()
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this vehicle resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking vehicle access.'
    })
  }
}

// Middleware to check if user can access booking resource
const requireBookingAccess = async (req, res, next) => {
  try {
    const bookingId = req.params.booking_id || req.body.booking_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor owns the vehicle associated with the booking
      const booking = await BookingModel.findById(bookingId)
      if (booking) {
        const vehicle = await VehicleModel.findById(booking.vehicle_id)
        if (vehicle && vehicle.vendor_id === req.user.id) {
          return next()
        }
      }
    }

    if (req.user.role === 'user') {
      // Check if user owns the booking
      const booking = await BookingModel.findById(bookingId)
      if (booking && booking.user_id === req.user.id) {
        return next()
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this booking resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking booking access.'
    })
  }
}

// Middleware to check if user can access review resource
const requireReviewAccess = async (req, res, next) => {
  try {
    const reviewId = req.params.review_id || req.body.review_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor owns the vehicle associated with the review
      const review = await ReviewModel.findById(reviewId)
      if (review) {
        const vehicle = await VehicleModel.findById(review.vehicle_id)
        if (vehicle && vehicle.vendor_id === req.user.id) {
          return next()
        }
      }
    }

    if (req.user.role === 'user') {
      // Check if user owns the review
      const review = await ReviewModel.findById(reviewId)
      if (review && review.user_id === req.user.id) {
        return next()
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this review resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking review access.'
    })
  }
}

// Middleware to check if user can access notification resource
const requireNotificationAccess = async (req, res, next) => {
  try {
    const notificationId = req.params.notification_id || req.body.notification_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'user' || req.user.role === 'vendor') {
      // Check if user owns the notification
      const notification = await NotificationModel.findById(notificationId)
      if (notification && notification.user_id === req.user.id) {
        return next()
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this notification resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking notification access.'
    })
  }
}

// Middleware to check if user can access maintenance resource
const requireMaintenanceAccess = async (req, res, next) => {
  try {
    const maintenanceId = req.params.maintenance_id || req.body.maintenance_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor owns the vehicle associated with the maintenance
      const maintenance = await MaintenanceModel.findById(maintenanceId)
      if (maintenance) {
        const vehicle = await VehicleModel.findById(maintenance.vehicle_id)
        if (vehicle && vehicle.vendor_id === req.user.id) {
          return next()
        }
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this maintenance resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking maintenance access.'
    })
  }
}

// Middleware to check if user can access reward resource
const requireRewardAccess = async (req, res, next) => {
  try {
    const rewardId = req.params.reward_id || req.body.reward_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor owns the reward
      const reward = await RewardModel.findById(rewardId)
      if (reward && reward.vendor_id === req.user.id) {
        return next()
      }
    }

    if (req.user.role === 'user') {
      // Check if user owns the reward
      const reward = await RewardModel.findById(rewardId)
      if (reward && reward.user_id === req.user.id) {
        return next()
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this reward resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking reward access.'
    })
  }
}

// Middleware to check if user can access discount resource
const requireDiscountAccess = async (req, res, next) => {
  try {
    const discountId = req.params.discount_id || req.body.discount_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor owns the discount
      const discount = await DiscountModel.findById(discountId)
      if (discount && discount.vendor_id === req.user.id) {
        return next()
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this discount resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking discount access.'
    })
  }
}

// Middleware to check if user can access conversation resource
const requireConversationAccess = async (req, res, next) => {
  try {
    const conversationId = req.params.conversation_id || req.body.conversation_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor is part of the conversation
      const conversation = await ConversationModel.findById(conversationId)
      if (conversation && conversation.vendor_id === req.user.id) {
        return next()
      }
    }

    if (req.user.role === 'user') {
      // Check if user is part of the conversation
      const conversation = await ConversationModel.findById(conversationId)
      if (conversation && conversation.user_id === req.user.id) {
        return next()
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this conversation resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking conversation access.'
    })
  }
}

// Middleware to check if user can access message resource
const requireMessageAccess = async (req, res, next) => {
  try {
    const messageId = req.params.message_id || req.body.message_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor sent the message or is part of the conversation
      const message = await MessageModel.findById(messageId)
      if (message) {
        const conversation = await ConversationModel.findById(message.conversation_id)
        if (conversation && conversation.vendor_id === req.user.id) {
          return next()
        }
      }
    }

    if (req.user.role === 'user') {
      // Check if user sent the message or is part of the conversation
      const message = await MessageModel.findById(messageId)
      if (message) {
        const conversation = await ConversationModel.findById(message.conversation_id)
        if (conversation && conversation.user_id === req.user.id) {
          return next()
        }
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this message resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking message access.'
    })
  }
}

// Middleware to check if user can access report resource
const requireReportAccess = async (req, res, next) => {
  try {
    const reportId = req.params.report_id || req.body.report_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor owns the report
      const report = await ReportModel.findById(reportId)
      if (report && report.vendor_id === req.user.id) {
        return next()
      }
    }

    if (req.user.role === 'user') {
      // Check if user owns the report
      const report = await ReportModel.findById(reportId)
      if (report && report.user_id === req.user.id) {
        return next()
      }
    }

      return res.status(403).json({
        success: false,
      message: 'Not authorized to access this report resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking report access.'
    })
  }
}

// Middleware to check if user can access payment resource
const requirePaymentAccess = async (req, res, next) => {
  try {
    const paymentId = req.params.payment_id || req.body.payment_id

    if (req.user.role === 'admin') {
      return next()
    }

    if (req.user.role === 'vendor') {
      // Check if vendor owns the vehicle associated with the payment
      const payment = await PaymentModel.findById(paymentId)
      if (payment) {
        const booking = await BookingModel.findById(payment.booking_id)
        if (booking) {
          const vehicle = await VehicleModel.findById(booking.vehicle_id)
          if (vehicle && vehicle.vendor_id === req.user.id) {
            return next()
          }
        }
      }
    }

    if (req.user.role === 'user') {
      // Check if user owns the payment
      const payment = await PaymentModel.findById(paymentId)
      if (payment && payment.user_id === req.user.id) {
        return next()
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this payment resource.'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking payment access.'
    })
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  authenticate,
  optionalAuth,
  authorize,
  requireAdmin,
  requireVendor,
  requireVendorOrAdmin,
  requireOwnershipOrAdmin,
  requireVendorAccess,
  requireVehicleAccess,
  requireBookingAccess,
  requireReviewAccess,
  requireNotificationAccess,
  requireMaintenanceAccess,
  requireRewardAccess,
  requireDiscountAccess,
  requireConversationAccess,
  requireMessageAccess,
  requireReportAccess,
  requirePaymentAccess
}