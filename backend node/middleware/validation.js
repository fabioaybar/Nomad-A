const { body, param, query, validationResult } = require('express-validator')

// Common validation rules
const commonValidations = {
  id: param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  page: query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  limit: query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  email: body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  password: body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  name: body('name').isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  phone: body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  role: body('role').isIn(['user', 'vendor', 'admin']).withMessage('Role must be user, vendor, or admin'),
  status: body('status').isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  rating: body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  price: body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  date: body('date').isISO8601().withMessage('Valid date is required'),
  boolean: body('value').isBoolean().withMessage('Value must be a boolean'),
  positiveInt: body('value').isInt({ min: 1 }).withMessage('Value must be a positive integer'),
  positiveFloat: body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  url: body('url').isURL().withMessage('Valid URL is required'),
  json: body('data').isObject().withMessage('Data must be an object'),
  array: body('items').isArray().withMessage('Items must be an array'),
  string: body('text').isString().withMessage('Text must be a string'),
  optionalString: body('text').optional().isString().withMessage('Text must be a string'),
  optionalInt: body('value').optional().isInt().withMessage('Value must be an integer'),
  optionalFloat: body('value').optional().isFloat().withMessage('Value must be a number'),
  optionalBoolean: body('value').optional().isBoolean().withMessage('Value must be a boolean'),
  optionalEmail: body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  optionalPhone: body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  optionalDate: body('date').optional().isISO8601().withMessage('Valid date is required'),
  optionalUrl: body('url').optional().isURL().withMessage('Valid URL is required'),
  optionalJson: body('data').optional().isObject().withMessage('Data must be an object'),
  optionalArray: body('items').optional().isArray().withMessage('Items must be an array')
}

// User validation rules
const userValidations = {
  create: [
    commonValidations.name,
    commonValidations.email,
    commonValidations.password,
    commonValidations.role,
    commonValidations.phone,
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean')
  ],
  update: [
    commonValidations.id,
    commonValidations.name,
    commonValidations.phone,
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
    body('role').optional().isIn(['user', 'vendor', 'admin']).withMessage('Role must be user, vendor, or admin')
  ],
  changePassword: [
    commonValidations.id,
    body('current_password').isLength({ min: 6 }).withMessage('Current password is required'),
    body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirm_password').custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Password confirmation does not match')
      }
      return true
    })
  ]
}

// Vendor validation rules
const vendorValidations = {
  create: [
    body('user_id').isInt({ min: 1 }).withMessage('User ID is required and must be a positive integer'),
    body('company_name').isLength({ min: 1, max: 200 }).withMessage('Company name must be between 1 and 200 characters'),
    body('business_type').isIn(['individual', 'company']).withMessage('Business type must be individual or company'),
    commonValidations.email,
    commonValidations.phone,
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('address').isLength({ min: 1, max: 500 }).withMessage('Address must be between 1 and 500 characters'),
    body('city').isLength({ min: 1, max: 100 }).withMessage('City must be between 1 and 100 characters'),
    body('country').isLength({ min: 1, max: 100 }).withMessage('Country must be between 1 and 100 characters'),
    body('postal_code').isLength({ min: 1, max: 20 }).withMessage('Postal code must be between 1 and 20 characters'),
    body('is_verified').optional().isBoolean().withMessage('is_verified must be a boolean'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean')
  ],
  update: [
    commonValidations.id,
    body('company_name').optional().isLength({ min: 1, max: 200 }).withMessage('Company name must be between 1 and 200 characters'),
    body('business_type').optional().isIn(['individual', 'company']).withMessage('Business type must be individual or company'),
    commonValidations.optionalEmail,
    commonValidations.optionalPhone,
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('address').optional().isLength({ min: 1, max: 500 }).withMessage('Address must be between 1 and 500 characters'),
    body('city').optional().isLength({ min: 1, max: 100 }).withMessage('City must be between 1 and 100 characters'),
    body('country').optional().isLength({ min: 1, max: 100 }).withMessage('Country must be between 1 and 100 characters'),
    body('postal_code').optional().isLength({ min: 1, max: 20 }).withMessage('Postal code must be between 1 and 20 characters'),
    body('is_verified').optional().isBoolean().withMessage('is_verified must be a boolean'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean')
  ],
  bank: [
    commonValidations.id,
    body('bank_name').isLength({ min: 1, max: 100 }).withMessage('Bank name must be between 1 and 100 characters'),
    body('account_number').isLength({ min: 1, max: 50 }).withMessage('Account number must be between 1 and 50 characters'),
    body('routing_number').isLength({ min: 1, max: 50 }).withMessage('Routing number must be between 1 and 50 characters'),
    body('account_holder_name').isLength({ min: 1, max: 100 }).withMessage('Account holder name must be between 1 and 100 characters')
  ]
}

// Vehicle validation rules
const vehicleValidations = {
  create: [
    body('vendor_id').isInt({ min: 1 }).withMessage('Vendor ID is required and must be a positive integer'),
    body('make').isLength({ min: 1, max: 50 }).withMessage('Make must be between 1 and 50 characters'),
    body('model').isLength({ min: 1, max: 50 }).withMessage('Model must be between 1 and 50 characters'),
    body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Year must be between 1900 and current year + 1'),
    body('type').isIn(['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck', 'van', 'motorcycle']).withMessage('Type must be sedan, suv, hatchback, coupe, convertible, truck, van, or motorcycle'),
    body('fuel_type').isIn(['gasoline', 'diesel', 'electric', 'hybrid']).withMessage('Fuel type must be gasoline, diesel, electric, or hybrid'),
    body('transmission').isIn(['manual', 'automatic']).withMessage('Transmission must be manual or automatic'),
    body('seats').isInt({ min: 1, max: 50 }).withMessage('Seats must be between 1 and 50'),
    body('doors').isInt({ min: 2, max: 10 }).withMessage('Doors must be between 2 and 10'),
    body('price_per_day').isFloat({ min: 0 }).withMessage('Price per day must be a positive number'),
    body('location').isLength({ min: 1, max: 200 }).withMessage('Location must be between 1 and 200 characters'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    body('is_available').optional().isBoolean().withMessage('is_available must be a boolean'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
    body('features').optional().isArray().withMessage('Features must be an array'),
    body('images').optional().isArray().withMessage('Images must be an array'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
  ],
  update: [
    commonValidations.id,
    body('make').optional().isLength({ min: 1, max: 50 }).withMessage('Make must be between 1 and 50 characters'),
    body('model').optional().isLength({ min: 1, max: 50 }).withMessage('Model must be between 1 and 50 characters'),
    body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Year must be between 1900 and current year + 1'),
    body('type').optional().isIn(['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck', 'van', 'motorcycle']).withMessage('Type must be sedan, suv, hatchback, coupe, convertible, truck, van, or motorcycle'),
    body('fuel_type').optional().isIn(['gasoline', 'diesel', 'electric', 'hybrid']).withMessage('Fuel type must be gasoline, diesel, electric, or hybrid'),
    body('transmission').optional().isIn(['manual', 'automatic']).withMessage('Transmission must be manual or automatic'),
    body('seats').optional().isInt({ min: 1, max: 50 }).withMessage('Seats must be between 1 and 50'),
    body('doors').optional().isInt({ min: 2, max: 10 }).withMessage('Doors must be between 2 and 10'),
    body('price_per_day').optional().isFloat({ min: 0 }).withMessage('Price per day must be a positive number'),
    body('location').optional().isLength({ min: 1, max: 200 }).withMessage('Location must be between 1 and 200 characters'),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
    body('is_available').optional().isBoolean().withMessage('is_available must be a boolean'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
    body('features').optional().isArray().withMessage('Features must be an array'),
    body('images').optional().isArray().withMessage('Images must be an array'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters')
  ]
}

// Booking validation rules
const bookingValidations = {
  create: [
    body('vehicle_id').isInt({ min: 1 }).withMessage('Vehicle ID is required and must be a positive integer'),
    body('start_date').isISO8601().withMessage('Start date is required and must be a valid date'),
    body('end_date').isISO8601().withMessage('End date is required and must be a valid date'),
    body('pickup_location').isLength({ min: 1, max: 200 }).withMessage('Pickup location must be between 1 and 200 characters'),
    body('dropoff_location').isLength({ min: 1, max: 200 }).withMessage('Dropoff location must be between 1 and 200 characters'),
    body('total_cost').isFloat({ min: 0 }).withMessage('Total cost must be a positive number'),
    body('status').optional().isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled']).withMessage('Status must be pending, confirmed, active, completed, or cancelled'),
    body('payment_status').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Payment status must be pending, paid, failed, or refunded'),
    body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
  ],
  update: [
    commonValidations.id,
    body('start_date').optional().isISO8601().withMessage('Start date must be a valid date'),
    body('end_date').optional().isISO8601().withMessage('End date must be a valid date'),
    body('pickup_location').optional().isLength({ min: 1, max: 200 }).withMessage('Pickup location must be between 1 and 200 characters'),
    body('dropoff_location').optional().isLength({ min: 1, max: 200 }).withMessage('Dropoff location must be between 1 and 200 characters'),
    body('total_cost').optional().isFloat({ min: 0 }).withMessage('Total cost must be a positive number'),
    body('status').optional().isIn(['pending', 'confirmed', 'active', 'completed', 'cancelled']).withMessage('Status must be pending, confirmed, active, completed, or cancelled'),
    body('payment_status').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Payment status must be pending, paid, failed, or refunded'),
    body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
  ],
  calculateCost: [
    body('vehicle_id').isInt({ min: 1 }).withMessage('Vehicle ID is required and must be a positive integer'),
    body('start_date').isISO8601().withMessage('Start date is required and must be a valid date'),
    body('end_date').isISO8601().withMessage('End date is required and must be a valid date'),
    body('discount_code').optional().isLength({ max: 50 }).withMessage('Discount code must be less than 50 characters')
  ],
  checkAvailability: [
    body('vehicle_id').isInt({ min: 1 }).withMessage('Vehicle ID is required and must be a positive integer'),
    body('start_date').isISO8601().withMessage('Start date is required and must be a valid date'),
    body('end_date').isISO8601().withMessage('End date is required and must be a valid date')
  ]
}

// Review validation rules
const reviewValidations = {
  create: [
    body('vehicle_id').isInt({ min: 1 }).withMessage('Vehicle ID is required and must be a positive integer'),
    commonValidations.rating,
    body('comment').optional().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
    body('title').optional().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters')
  ],
  update: [
    commonValidations.id,
    commonValidations.rating,
    body('comment').optional().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
    body('title').optional().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters')
  ]
}

// Maintenance validation rules
const maintenanceValidations = {
  create: [
    body('vehicle_id').isInt({ min: 1 }).withMessage('Vehicle ID is required and must be a positive integer'),
    body('type').isIn(['routine', 'repair', 'inspection', 'cleaning']).withMessage('Type must be routine, repair, inspection, or cleaning'),
    body('description').isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
    body('cost').isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    body('scheduled_date').isISO8601().withMessage('Scheduled date is required and must be a valid date'),
    body('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled']).withMessage('Status must be scheduled, in_progress, completed, or cancelled'),
    body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
  ],
  update: [
    commonValidations.id,
    body('type').optional().isIn(['routine', 'repair', 'inspection', 'cleaning']).withMessage('Type must be routine, repair, inspection, or cleaning'),
    body('description').optional().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
    body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
    body('scheduled_date').optional().isISO8601().withMessage('Scheduled date must be a valid date'),
    body('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled']).withMessage('Status must be scheduled, in_progress, completed, or cancelled'),
    body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
  ]
}

// Reward validation rules
const rewardValidations = {
  create: [
    body('vendor_id').isInt({ min: 1 }).withMessage('Vendor ID is required and must be a positive integer'),
    body('type').isIn(['discount', 'free_rental', 'upgrade', 'points']).withMessage('Type must be discount, free_rental, upgrade, or points'),
    body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description').isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
    body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
    body('points_required').isInt({ min: 0 }).withMessage('Points required must be a non-negative integer'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
    body('expiry_date').optional().isISO8601().withMessage('Expiry date must be a valid date')
  ],
  update: [
    commonValidations.id,
    body('type').optional().isIn(['discount', 'free_rental', 'upgrade', 'points']).withMessage('Type must be discount, free_rental, upgrade, or points'),
    body('title').optional().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description').optional().isLength({ min: 1, max: 1000 }).withMessage('Description must be between 1 and 1000 characters'),
    body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
    body('points_required').optional().isInt({ min: 0 }).withMessage('Points required must be a non-negative integer'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
    body('expiry_date').optional().isISO8601().withMessage('Expiry date must be a valid date')
  ]
}

// Discount validation rules
const discountValidations = {
  create: [
    body('vendor_id').isInt({ min: 1 }).withMessage('Vendor ID is required and must be a positive integer'),
    body('code').isLength({ min: 1, max: 50 }).withMessage('Code must be between 1 and 50 characters'),
    body('type').isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
    body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number'),
    body('min_amount').optional().isFloat({ min: 0 }).withMessage('Minimum amount must be a positive number'),
    body('max_discount').optional().isFloat({ min: 0 }).withMessage('Maximum discount must be a positive number'),
    body('usage_limit').optional().isInt({ min: 1 }).withMessage('Usage limit must be a positive integer'),
    body('start_date').isISO8601().withMessage('Start date is required and must be a valid date'),
    body('end_date').isISO8601().withMessage('End date is required and must be a valid date'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean')
  ],
  update: [
    commonValidations.id,
    body('code').optional().isLength({ min: 1, max: 50 }).withMessage('Code must be between 1 and 50 characters'),
    body('type').optional().isIn(['percentage', 'fixed']).withMessage('Type must be percentage or fixed'),
    body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
    body('min_amount').optional().isFloat({ min: 0 }).withMessage('Minimum amount must be a positive number'),
    body('max_discount').optional().isFloat({ min: 0 }).withMessage('Maximum discount must be a positive number'),
    body('usage_limit').optional().isInt({ min: 1 }).withMessage('Usage limit must be a positive integer'),
    body('start_date').optional().isISO8601().withMessage('Start date must be a valid date'),
    body('end_date').optional().isISO8601().withMessage('End date must be a valid date'),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean')
  ]
}

// Conversation validation rules
const conversationValidations = {
  create: [
    body('user_id').isInt({ min: 1 }).withMessage('User ID is required and must be a positive integer'),
    body('vendor_id').isInt({ min: 1 }).withMessage('Vendor ID is required and must be a positive integer'),
    body('subject').isLength({ min: 1, max: 200 }).withMessage('Subject must be between 1 and 200 characters'),
    body('status').optional().isIn(['active', 'archived']).withMessage('Status must be active or archived')
  ],
  update: [
    commonValidations.id,
    body('subject').optional().isLength({ min: 1, max: 200 }).withMessage('Subject must be between 1 and 200 characters'),
    body('status').optional().isIn(['active', 'archived']).withMessage('Status must be active or archived')
  ]
}

// Message validation rules
const messageValidations = {
  create: [
    body('conversation_id').isInt({ min: 1 }).withMessage('Conversation ID is required and must be a positive integer'),
    body('sender_id').isInt({ min: 1 }).withMessage('Sender ID is required and must be a positive integer'),
    body('content').isLength({ min: 1, max: 2000 }).withMessage('Content must be between 1 and 2000 characters'),
    body('type').optional().isIn(['text', 'image', 'file']).withMessage('Type must be text, image, or file')
  ],
  update: [
    commonValidations.id,
    body('content').optional().isLength({ min: 1, max: 2000 }).withMessage('Content must be between 1 and 2000 characters'),
    body('type').optional().isIn(['text', 'image', 'file']).withMessage('Type must be text, image, or file')
  ]
}

// Notification validation rules
const notificationValidations = {
  create: [
    body('user_id').isInt({ min: 1 }).withMessage('User ID is required and must be a positive integer'),
    body('type').isIn(['booking', 'payment', 'review', 'maintenance', 'system', 'promotion']).withMessage('Type must be booking, payment, review, maintenance, system, or promotion'),
    body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('message').isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
    body('data').optional().isObject().withMessage('Data must be an object')
  ],
  update: [
    commonValidations.id,
    body('type').optional().isIn(['booking', 'payment', 'review', 'maintenance', 'system', 'promotion']).withMessage('Type must be booking, payment, review, maintenance, system, or promotion'),
    body('title').optional().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('message').optional().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
    body('data').optional().isObject().withMessage('Data must be an object')
  ]
}

// Payment validation rules
const paymentValidations = {
  create: [
    body('booking_id').isInt({ min: 1 }).withMessage('Booking ID is required and must be a positive integer'),
    body('user_id').isInt({ min: 1 }).withMessage('User ID is required and must be a positive integer'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('currency').isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-character code'),
    body('payment_method').isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer']).withMessage('Payment method must be credit_card, debit_card, paypal, or bank_transfer'),
    body('status').optional().isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Status must be pending, completed, failed, or refunded'),
    body('transaction_id').optional().isLength({ max: 100 }).withMessage('Transaction ID must be less than 100 characters')
  ],
  update: [
    commonValidations.id,
    body('amount').optional().isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be a 3-character code'),
    body('payment_method').optional().isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer']).withMessage('Payment method must be credit_card, debit_card, paypal, or bank_transfer'),
    body('status').optional().isIn(['pending', 'completed', 'failed', 'refunded']).withMessage('Status must be pending, completed, failed, or refunded'),
    body('transaction_id').optional().isLength({ max: 100 }).withMessage('Transaction ID must be less than 100 characters')
  ]
}

// Report validation rules
const reportValidations = {
  create: [
    body('user_id').isInt({ min: 1 }).withMessage('User ID is required and must be a positive integer'),
    body('type').isIn(['bug', 'feature_request', 'complaint', 'suggestion']).withMessage('Type must be bug, feature_request, complaint, or suggestion'),
    body('title').isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description').isLength({ min: 1, max: 2000 }).withMessage('Description must be between 1 and 2000 characters'),
    body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']).withMessage('Status must be open, in_progress, resolved, or closed'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Priority must be low, medium, high, or urgent')
  ],
  update: [
    commonValidations.id,
    body('type').optional().isIn(['bug', 'feature_request', 'complaint', 'suggestion']).withMessage('Type must be bug, feature_request, complaint, or suggestion'),
    body('title').optional().isLength({ min: 1, max: 200 }).withMessage('Title must be between 1 and 200 characters'),
    body('description').optional().isLength({ min: 1, max: 2000 }).withMessage('Description must be between 1 and 2000 characters'),
    body('status').optional().isIn(['open', 'in_progress', 'resolved', 'closed']).withMessage('Status must be open, in_progress, resolved, or closed'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Priority must be low, medium, high, or urgent')
  ]
}

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    })
  }
  next()
}

// Custom validation middleware
const validateDateRange = (startDateField, endDateField) => {
  return (req, res, next) => {
    const startDate = new Date(req.body[startDateField])
    const endDate = new Date(req.body[endDateField])

    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: `${startDateField} must be before ${endDateField}`
      })
    }

    if (startDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: `${startDateField} cannot be in the past`
      })
    }

    next()
  }
}

const validatePasswordStrength = (req, res, next) => {
  const password = req.body.password || req.body.new_password

  if (password) {
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      })
    }
  }

  next()
}

const validateFileUpload = (allowedTypes, maxSize) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required'
      })
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `File type must be one of: ${allowedTypes.join(', ')}`
      })
    }

    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: `File size must be less than ${maxSize} bytes`
      })
    }

    next()
  }
}

module.exports = {
  commonValidations,
  userValidations,
  vendorValidations,
  vehicleValidations,
  bookingValidations,
  reviewValidations,
  maintenanceValidations,
  rewardValidations,
  discountValidations,
  conversationValidations,
  messageValidations,
  notificationValidations,
  paymentValidations,
  reportValidations,
  handleValidationErrors,
  validateDateRange,
  validatePasswordStrength,
  validateFileUpload
}

