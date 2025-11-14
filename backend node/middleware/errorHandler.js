const { validationResult } = require('express-validator')

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Default error
  let error = {
    success: false,
    message: 'Internal Server Error',
    statusCode: 500
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error'
    error.statusCode = 400
    error.errors = Object.values(err.errors).map(val => val.message)
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered'
    error.statusCode = 400
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    error.message = 'Resource not found'
    error.statusCode = 404
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token'
    error.statusCode = 401
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired'
    error.statusCode = 401
  }

  // Custom error
  if (err.statusCode) {
    error.statusCode = err.statusCode
    error.message = err.message
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(error.errors && { errors: error.errors })
  })
}

// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  error.statusCode = 404
  next(error)
}

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }
  next()
}

// Async error handler wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  errorHandler,
  notFound,
  validate,
  asyncHandler,
  AppError
}

