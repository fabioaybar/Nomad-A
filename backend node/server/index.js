const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const { exec } = require('child_process')
const os = require('os')
require('dotenv').config()

const authRoutes = require('../routes/auth')
const userRoutes = require('../routes/users')
const vendorRoutes = require('../routes/vendors')
const vehicleRoutes = require('../routes/vehicles')
const bookingRoutes = require('../routes/bookings')
const reviewRoutes = require('../routes/reviews')
const maintenanceRoutes = require('../routes/maintenance')
const rewardRoutes = require('../routes/rewards')
const discountRoutes = require('../routes/discounts')
const conversationRoutes = require('../routes/conversations')
const messageRoutes = require('../routes/messages')
const notificationRoutes = require('../routes/notifications')
const uploadRoutes = require('../routes/uploads')
const leaderboardRoutes = require('../routes/leaderboard')
const systemRoutes = require('../routes/system')
const adminRoutes = require('../routes/admin')
const reportRoutes = require('../routes/reports')
const externalRoutes = require('../routes/external')

const { errorHandler, notFound } = require('../middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 8000

// Function to kill processes on the port
function killPort(port) {
  return new Promise((resolve) => {
    const platform = os.platform()
    let command

    if (platform === 'win32') {
      command = `netstat -ano | findstr :${port}`
    } else {
      command = `lsof -ti:${port}`
    }

    exec(command, (error, stdout) => {
      if (error || !stdout.trim()) {
        console.log(`Port ${port} is available`)
        resolve()
        return
      }

      if (platform === 'win32') {
        const lines = stdout.trim().split('\n')
        const pids = []
        
        lines.forEach(line => {
          const parts = line.trim().split(/\s+/)
          if (parts.length >= 5) {
            const pid = parts[4]
            if (pid && pid !== '0' && !pids.includes(pid)) {
              pids.push(pid)
            }
          }
        })

        if (pids.length === 0) {
          resolve()
          return
        }

        let killCount = 0
        pids.forEach(pid => {
          exec(`taskkill /PID ${pid} /F`, () => {
            killCount++
            if (killCount === pids.length) {
              console.log(`Killed processes on port ${port}`)
              resolve()
            }
          })
        })
      } else {
        const pids = stdout.trim().split('\n').filter(pid => pid.trim())
        
        if (pids.length === 0) {
          resolve()
          return
        }

        let killCount = 0
        pids.forEach(pid => {
          exec(`kill -9 ${pid}`, () => {
            killCount++
            if (killCount === pids.length) {
              console.log(`Killed processes on port ${port}`)
              resolve()
            }
          })
        })
      }
    })
  })
}

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs (increased for testing)
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control', 'Pragma']
}))

// Logging
app.use(morgan('combined'))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Root endpoint with API information
app.get('/', (req, res) => {
  const apiInfo = {
    name: 'RentACar Backend API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      users: '/api/users',
      vehicles: '/api/vehicles',
      bookings: '/api/bookings',
      vendors: '/api/vendors',
      reviews: '/api/reviews',
      admin: '/api/admin',
      system: '/api/system'
    },
    documentation: 'See README.md for full API documentation'
  }
  
  res.json(apiInfo)
})

// API root endpoint
app.get('/api', (req, res) => {
  const apiRoutes = {
    message: 'RentACar Backend API',
    version: '1.0.0',
    available_endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get user profile',
        'PUT /api/auth/profile': 'Update user profile',
        'POST /api/auth/logout': 'Logout user',
        'POST /api/auth/refresh': 'Refresh JWT token'
      },
      users: {
        'GET /api/users': 'Get all users (Admin)',
        'GET /api/users/:id': 'Get user by ID',
        'PUT /api/users/:id': 'Update user',
        'DELETE /api/users/:id': 'Delete user (Admin)'
      },
      vehicles: {
        'GET /api/vehicles': 'Get all vehicles',
        'GET /api/vehicles/available': 'Get available vehicles',
        'GET /api/vehicles/search': 'Search vehicles',
        'GET /api/vehicles/:id': 'Get vehicle by ID',
        'POST /api/vehicles': 'Create vehicle (Vendor/Admin)',
        'PUT /api/vehicles/:id': 'Update vehicle (Vendor/Admin)',
        'DELETE /api/vehicles/:id': 'Delete vehicle (Vendor/Admin)'
      },
      bookings: {
        'GET /api/bookings': 'Get all bookings',
        'GET /api/bookings/:id': 'Get booking by ID',
        'POST /api/bookings': 'Create new booking',
        'PUT /api/bookings/:id': 'Update booking',
        'DELETE /api/bookings/:id': 'Cancel booking',
        'POST /api/bookings/:id/confirm': 'Confirm booking (Vendor/Admin)',
        'POST /api/bookings/:id/complete': 'Complete booking (Vendor/Admin)'
      },
      vendors: {
        'GET /api/vendors': 'Get all vendors',
        'GET /api/vendors/:id': 'Get vendor by ID'
      },
      reviews: {
        'GET /api/reviews': 'Get all reviews',
        'POST /api/reviews': 'Create new review'
      },
      system: {
        'GET /health': 'Health check',
        'GET /api/system/health': 'System health check'
      }
    },
    test_accounts: {
      admin: 'admin@rentacar.com / admin123',
      user: 'juan@example.com / user123',
      vendor: 'carlos@autorent.com / vendor123'
    }
  }
  
  res.json(apiRoutes)
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  })
})

// Favicon endpoint (to prevent 404 errors)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end()
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/vendors', vendorRoutes)
app.use('/api/vendor', vendorRoutes) // Add this for vendor-specific endpoints
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/rewards', rewardRoutes)
app.use('/api/discounts', discountRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/uploads', uploadRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/system', systemRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/external', externalRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
async function startServer() {
  try {
    // Kill any existing processes on the port
    console.log(`Checking port ${PORT}...`)
    await killPort(PORT)
    
    // Start the server
    app.listen(PORT, () => {
      console.log('='.repeat(60))
      console.log('RentACar Backend Server')
      console.log('='.repeat(60))
      console.log(`Server running on: http://localhost:${PORT}`)
      console.log(`Health check:     http://localhost:${PORT}/health`)
      console.log(`API Base URL:     http://localhost:${PORT}/api`)
      console.log('='.repeat(60))
      
      console.log('\nAVAILABLE API ENDPOINTS:')
      console.log('-'.repeat(60))
      
      // Authentication endpoints
      console.log('\nAUTHENTICATION:')
      console.log('  POST   /api/auth/register     - Register new user')
      console.log('  POST   /api/auth/login        - Login user')
      console.log('  GET    /api/auth/profile      - Get user profile')
      console.log('  PUT    /api/auth/profile      - Update user profile')
      console.log('  POST   /api/auth/logout       - Logout user')
      console.log('  POST   /api/auth/refresh      - Refresh JWT token')
      
      // User endpoints
      console.log('\nUSERS:')
      console.log('  GET    /api/users             - Get all users (Admin)')
      console.log('  GET    /api/users/:id         - Get user by ID')
      console.log('  PUT    /api/users/:id         - Update user')
      console.log('  DELETE /api/users/:id         - Delete user (Admin)')
      
      // Vehicle endpoints
      console.log('\nVEHICLES:')
      console.log('  GET    /api/vehicles          - Get all vehicles')
      console.log('  GET    /api/vehicles/available - Get available vehicles')
      console.log('  GET    /api/vehicles/search   - Search vehicles')
      console.log('  GET    /api/vehicles/:id      - Get vehicle by ID')
      console.log('  POST   /api/vehicles          - Create vehicle (Vendor/Admin)')
      console.log('  PUT    /api/vehicles/:id      - Update vehicle (Vendor/Admin)')
      console.log('  DELETE /api/vehicles/:id      - Delete vehicle (Vendor/Admin)')
      
      // Booking endpoints
      console.log('\nBOOKINGS:')
      console.log('  GET    /api/bookings          - Get all bookings')
      console.log('  GET    /api/bookings/:id      - Get booking by ID')
      console.log('  POST   /api/bookings          - Create new booking')
      console.log('  PUT    /api/bookings/:id      - Update booking')
      console.log('  DELETE /api/bookings/:id      - Cancel booking')
      console.log('  POST   /api/bookings/:id/confirm - Confirm booking (Vendor/Admin)')
      console.log('  POST   /api/bookings/:id/complete - Complete booking (Vendor/Admin)')
      
      // Vendor endpoints
      console.log('\nVENDORS:')
      console.log('  GET    /api/vendors           - Get all vendors')
      console.log('  GET    /api/vendors/:id       - Get vendor by ID')
      
      // Review endpoints
      console.log('\nREVIEWS:')
      console.log('  GET    /api/reviews           - Get all reviews')
      console.log('  POST   /api/reviews           - Create new review')
      
      // System endpoints
      console.log('\nSYSTEM:')
      console.log('  GET    /health                - Health check')
      console.log('  GET    /api/system/health     - System health check')
      
      console.log('\n' + '='.repeat(60))
      console.log('TEST ACCOUNTS:')
      console.log('-'.repeat(60))
      console.log('Admin:  admin@rentacar.com / admin123')
      console.log('User:   juan@example.com / user123')
      console.log('Vendor: carlos@autorent.com / vendor123')
      
      console.log('\n' + '='.repeat(60))
      console.log('QUICK TEST COMMANDS:')
      console.log('-'.repeat(60))
      console.log('curl http://localhost:8000/health')
      console.log('curl http://localhost:8000/api')
      console.log('curl http://localhost:8000/api/vehicles')
      console.log('='.repeat(60))
      console.log('')
    })
  } catch (error) {
    console.error('Error starting server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

module.exports = app

