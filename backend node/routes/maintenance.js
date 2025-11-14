const express = require('express')
const { body, query } = require('express-validator')
const { MaintenanceModel, VehicleModel, VendorModel, NotificationModel } = require('../database/models')
const { authenticate, authorize } = require('../middleware/auth')
const { validate, asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// Validation rules
const maintenanceValidation = [
  body('vehicle_id').isInt({ min: 1 }).withMessage('Valid vehicle ID is required'),
  body('type').isIn(['routine', 'repair', 'inspection', 'cleaning']).withMessage('Valid maintenance type is required'),
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('scheduled_date').isISO8601().withMessage('Valid scheduled date is required'),
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number')
]

// @route   GET /api/maintenance
// @desc    Get all maintenance records (with filters)
// @access  Private
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled']),
  query('type').optional().isIn(['routine', 'repair', 'inspection', 'cleaning']),
  query('vendor_id').optional().isInt({ min: 1 }),
  query('vehicle_id').optional().isInt({ min: 1 })
], validate, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const filters = {}

  // Apply filters based on user role
  if (req.user.role === 'vendor') {
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (vendor) {
      filters.vendor_id = vendor.id
    }
  }

  if (req.query.status) filters.status = req.query.status
  if (req.query.type) filters.type = req.query.type
  if (req.query.vendor_id && req.user.role === 'admin') filters.vendor_id = req.query.vendor_id
  if (req.query.vehicle_id) filters.vehicle_id = req.query.vehicle_id

  const result = await MaintenanceModel.paginate(page, limit, filters)

  // Populate vehicle and vendor data for each maintenance record
  const populatedMaintenance = await Promise.all(result.data.map(async (maintenance) => {
    const vehicle = await VehicleModel.findById(maintenance.vehicle_id)
    const vendor = await VendorModel.findById(maintenance.vendor_id)
    
    return {
      ...maintenance,
      vehicle,
      vendor
    }
  }))

  res.json({
    success: true,
    data: {
      maintenance: populatedMaintenance,
      pagination: result.pagination
    }
  })
}))

// @route   GET /api/maintenance/:id
// @desc    Get maintenance record by ID
// @access  Private
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const maintenance = await MaintenanceModel.findById(req.params.id)
  
  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: 'Maintenance record not found'
    })
  }

  // Check access permissions
  if (req.user.role === 'vendor') {
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (!vendor || vendor.id !== maintenance.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }
  }

  // Populate related data
  const vehicle = await VehicleModel.findById(maintenance.vehicle_id)
  const vendor = await VendorModel.findById(maintenance.vendor_id)

  res.json({
    success: true,
    data: {
      maintenance: {
        ...maintenance,
        vehicle,
        vendor
      }
    }
  })
}))

// @route   POST /api/maintenance
// @desc    Create new maintenance record
// @access  Private (Vendor/Admin)
router.post('/', authenticate, authorize(['vendor', 'admin']), maintenanceValidation, validate, asyncHandler(async (req, res) => {
  const { vehicle_id, type, title, description, scheduled_date, cost } = req.body

  // Check if vehicle exists and belongs to vendor (unless admin)
  const vehicle = await VehicleModel.findById(vehicle_id)
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    })
  }

  if (req.user.role === 'vendor') {
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (!vendor || vehicle.vendor_id !== vendor.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only schedule maintenance for your own vehicles'
      })
    }
  }

  const maintenanceData = {
    vehicle_id,
    vendor_id: vehicle.vendor_id,
    type,
    title,
    description: description || null,
    scheduled_date,
    cost: cost || null,
    status: 'scheduled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const maintenance = await MaintenanceModel.create(maintenanceData)

  res.status(201).json({
    success: true,
    message: 'Maintenance record created successfully',
    data: { maintenance }
  })
}))

// @route   PUT /api/maintenance/:id
// @desc    Update maintenance record
// @access  Private (Vendor/Admin)
router.put('/:id', authenticate, authorize(['vendor', 'admin']), [
  body('type').optional().isIn(['routine', 'repair', 'inspection', 'cleaning']),
  body('title').optional().trim().isLength({ min: 2, max: 200 }),
  body('scheduled_date').optional().isISO8601(),
  body('cost').optional().isFloat({ min: 0 })
], validate, asyncHandler(async (req, res) => {
  const maintenance = await MaintenanceModel.findById(req.params.id)
  
  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: 'Maintenance record not found'
    })
  }

  // Check access permissions
  if (req.user.role === 'vendor') {
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (!vendor || vendor.id !== maintenance.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own maintenance records'
      })
    }
  }

  // Only allow updates for scheduled maintenance
  if (maintenance.status !== 'scheduled') {
    return res.status(400).json({
      success: false,
      message: 'Only scheduled maintenance can be updated'
    })
  }

  const updateData = {
    ...req.body,
    updated_at: new Date().toISOString()
  }

  const updatedMaintenance = await MaintenanceModel.update(req.params.id, updateData)

  res.json({
    success: true,
    message: 'Maintenance record updated successfully',
    data: { maintenance: updatedMaintenance }
  })
}))

// @route   DELETE /api/maintenance/:id
// @desc    Delete maintenance record
// @access  Private (Vendor/Admin)
router.delete('/:id', authenticate, authorize(['vendor', 'admin']), asyncHandler(async (req, res) => {
  const maintenance = await MaintenanceModel.findById(req.params.id)
  
  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: 'Maintenance record not found'
    })
  }

  // Check access permissions
  if (req.user.role === 'vendor') {
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (!vendor || vendor.id !== maintenance.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own maintenance records'
      })
    }
  }

  // Only allow deletion of scheduled maintenance
  if (maintenance.status !== 'scheduled') {
    return res.status(400).json({
      success: false,
      message: 'Only scheduled maintenance can be deleted'
    })
  }

  await MaintenanceModel.delete(req.params.id)

  res.json({
    success: true,
    message: 'Maintenance record deleted successfully'
  })
}))

// @route   POST /api/maintenance/:id/start
// @desc    Start maintenance
// @access  Private (Vendor/Admin)
router.post('/:id/start', authenticate, authorize(['vendor', 'admin']), asyncHandler(async (req, res) => {
  const maintenance = await MaintenanceModel.findById(req.params.id)
  
  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: 'Maintenance record not found'
    })
  }

  // Check access permissions
  if (req.user.role === 'vendor') {
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (!vendor || vendor.id !== maintenance.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only start your own maintenance records'
      })
    }
  }

  if (maintenance.status !== 'scheduled') {
    return res.status(400).json({
      success: false,
      message: 'Only scheduled maintenance can be started'
    })
  }

  const updatedMaintenance = await MaintenanceModel.update(req.params.id, {
    status: 'in_progress',
    updated_at: new Date().toISOString()
  })

  // Update vehicle status to maintenance
  await VehicleModel.update(maintenance.vehicle_id, {
    rental_status: 'maintenance',
    is_available: false,
    updated_at: new Date().toISOString()
  })

  res.json({
    success: true,
    message: 'Maintenance started successfully',
    data: { maintenance: updatedMaintenance }
  })
}))

// @route   POST /api/maintenance/:id/complete
// @desc    Complete maintenance
// @access  Private (Vendor/Admin)
router.post('/:id/complete', authenticate, authorize(['vendor', 'admin']), [
  body('cost').optional().isFloat({ min: 0 }).withMessage('Cost must be a positive number'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters')
], validate, asyncHandler(async (req, res) => {
  const maintenance = await MaintenanceModel.findById(req.params.id)
  
  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: 'Maintenance record not found'
    })
  }

  // Check access permissions
  if (req.user.role === 'vendor') {
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (!vendor || vendor.id !== maintenance.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only complete your own maintenance records'
      })
    }
  }

  if (maintenance.status !== 'in_progress') {
    return res.status(400).json({
      success: false,
      message: 'Only in-progress maintenance can be completed'
    })
  }

  const updateData = {
    status: 'completed',
    completed_date: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  if (req.body.cost !== undefined) {
    updateData.cost = req.body.cost
  }

  if (req.body.notes) {
    updateData.description = req.body.notes
  }

  const updatedMaintenance = await MaintenanceModel.update(req.params.id, updateData)

  // Update vehicle status back to available
  await VehicleModel.update(maintenance.vehicle_id, {
    rental_status: 'available',
    is_available: true,
    updated_at: new Date().toISOString()
  })

  res.json({
    success: true,
    message: 'Maintenance completed successfully',
    data: { maintenance: updatedMaintenance }
  })
}))

// @route   POST /api/maintenance/:id/cancel
// @desc    Cancel maintenance
// @access  Private (Vendor/Admin)
router.post('/:id/cancel', authenticate, authorize(['vendor', 'admin']), asyncHandler(async (req, res) => {
  const maintenance = await MaintenanceModel.findById(req.params.id)
  
  if (!maintenance) {
    return res.status(404).json({
      success: false,
      message: 'Maintenance record not found'
    })
  }

  // Check access permissions
  if (req.user.role === 'vendor') {
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (!vendor || vendor.id !== maintenance.vendor_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own maintenance records'
      })
    }
  }

  if (!['scheduled', 'in_progress'].includes(maintenance.status)) {
    return res.status(400).json({
      success: false,
      message: 'Only scheduled or in-progress maintenance can be cancelled'
    })
  }

  const updatedMaintenance = await MaintenanceModel.update(req.params.id, {
    status: 'cancelled',
    updated_at: new Date().toISOString()
  })

  // If maintenance was in progress, make vehicle available again
  if (maintenance.status === 'in_progress') {
    await VehicleModel.update(maintenance.vehicle_id, {
      rental_status: 'available',
      is_available: true,
      updated_at: new Date().toISOString()
    })
  }

  res.json({
    success: true,
    message: 'Maintenance cancelled successfully',
    data: { maintenance: updatedMaintenance }
  })
}))

// @route   GET /api/maintenance/stats
// @desc    Get maintenance statistics
// @access  Private (Vendor/Admin)
router.get('/stats', authenticate, authorize(['vendor', 'admin']), asyncHandler(async (req, res) => {
  let vendorId = null

  if (req.user.role === 'vendor') {
    const vendor = await VendorModel.findByUserId(req.user.id)
    if (vendor) {
      vendorId = vendor.id
    }
  } else if (req.query.vendor_id) {
    vendorId = parseInt(req.query.vendor_id)
  }

  const stats = await MaintenanceModel.getStats(vendorId)

  res.json({
    success: true,
    data: { stats }
  })
}))

module.exports = router