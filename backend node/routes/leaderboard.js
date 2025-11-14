const express = require('express')
const { VehicleModel, BookingModel, VendorModel } = require('../database/models')
const { optionalAuth } = require('../middleware/auth')
const { asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// @route   GET /api/leaderboard
// @desc    Get vehicle leaderboard with different metrics
// @access  Public
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  try {
    // Get all vehicles with vendor data
    const vehicles = await VehicleModel.findAll()
    const populatedVehicles = await Promise.all(vehicles.map(async (vehicle) => {
      const vendor = await VendorModel.findById(vehicle.vendor_id)
      return {
        ...vehicle,
        vendor: vendor || null
      }
    }))

    // Get all bookings to calculate metrics
    const bookings = await BookingModel.findAll()

    // Calculate metrics for each vehicle
    const vehiclesWithMetrics = populatedVehicles.map(vehicle => {
      const vehicleBookings = bookings.filter(booking => booking.vehicle_id === vehicle.id)
      
      const totalBookings = vehicleBookings.length
      const totalRevenue = vehicleBookings.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
      const averageRating = vehicle.average_rating || 0
      
      // Calculate popularity score (combination of bookings, revenue, and rating)
      const popularityScore = Math.round(
        (totalBookings * 0.3) + 
        (totalRevenue / 1000 * 0.4) + 
        (averageRating * 10 * 0.3)
      )

      return {
        ...vehicle,
        metrics: {
          totalBookings,
          totalRevenue,
          averageRating,
          popularityScore
        }
      }
    })

    // Sort by different metrics
    const byRating = [...vehiclesWithMetrics].sort((a, b) => b.metrics.averageRating - a.metrics.averageRating)
    const byBookings = [...vehiclesWithMetrics].sort((a, b) => b.metrics.totalBookings - a.metrics.totalBookings)
    const byRevenue = [...vehiclesWithMetrics].sort((a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue)
    const byPopularity = [...vehiclesWithMetrics].sort((a, b) => b.metrics.popularityScore - a.metrics.popularityScore)

    // Get top 10 for each metric
    const leaderboard = {
      byRating: byRating.slice(0, 10).map((vehicle, index) => ({
        rank: index + 1,
        vehicle: {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.type,
          color: vehicle.color,
          images: vehicle.images,
          price_per_day: vehicle.price_per_day,
          fuel_type: vehicle.fuel_type,
          seats: vehicle.seats,
          vendor: vehicle.vendor
        },
        score: vehicle.metrics.averageRating,
        metric: 'rating'
      })),
      byBookings: byBookings.slice(0, 10).map((vehicle, index) => ({
        rank: index + 1,
        vehicle: {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.type,
          color: vehicle.color,
          images: vehicle.images,
          price_per_day: vehicle.price_per_day,
          fuel_type: vehicle.fuel_type,
          seats: vehicle.seats,
          vendor: vehicle.vendor
        },
        score: vehicle.metrics.totalBookings,
        metric: 'bookings'
      })),
      byRevenue: byRevenue.slice(0, 10).map((vehicle, index) => ({
        rank: index + 1,
        vehicle: {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.type,
          color: vehicle.color,
          images: vehicle.images,
          price_per_day: vehicle.price_per_day,
          fuel_type: vehicle.fuel_type,
          seats: vehicle.seats,
          vendor: vehicle.vendor
        },
        score: vehicle.metrics.totalRevenue,
        metric: 'revenue'
      })),
      byPopularity: byPopularity.slice(0, 10).map((vehicle, index) => ({
        rank: index + 1,
        vehicle: {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.type,
          color: vehicle.color,
          images: vehicle.images,
          price_per_day: vehicle.price_per_day,
          fuel_type: vehicle.fuel_type,
          seats: vehicle.seats,
          vendor: vehicle.vendor
        },
        score: vehicle.metrics.popularityScore,
        metric: 'popularity'
      }))
    }

    res.json({
      success: true,
      data: {
        leaderboard,
        top3: byPopularity.slice(0, 3).map(vehicle => ({
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          type: vehicle.type,
          color: vehicle.color,
          images: vehicle.images,
          average_rating: vehicle.metrics.averageRating,
          vendor: vehicle.vendor,
          metrics: vehicle.metrics
        }))
      }
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Error generating leaderboard'
    })
  }
}))

// @route   GET /api/leaderboard/top3
// @desc    Get top 3 vehicles for homepage
// @access  Public
router.get('/top3', optionalAuth, asyncHandler(async (req, res) => {
  try {
    // Get all vehicles with vendor data
    const vehicles = await VehicleModel.findAll()
    const populatedVehicles = await Promise.all(vehicles.map(async (vehicle) => {
      const vendor = await VendorModel.findById(vehicle.vendor_id)
      return {
        ...vehicle,
        vendor: vendor || null
      }
    }))

    // Get all bookings to calculate metrics
    const bookings = await BookingModel.findAll()

    // Calculate metrics for each vehicle
    const vehiclesWithMetrics = populatedVehicles.map(vehicle => {
      const vehicleBookings = bookings.filter(booking => booking.vehicle_id === vehicle.id)
      
      const totalBookings = vehicleBookings.length
      const totalRevenue = vehicleBookings.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
      const averageRating = vehicle.average_rating || 0
      
      // Calculate popularity score
      const popularityScore = Math.round(
        (totalBookings * 0.3) + 
        (totalRevenue / 1000 * 0.4) + 
        (averageRating * 10 * 0.3)
      )

      return {
        ...vehicle,
        metrics: {
          totalBookings,
          totalRevenue,
          averageRating,
          popularityScore
        }
      }
    })

    // Sort by popularity and get top 3
    const top3 = vehiclesWithMetrics
      .sort((a, b) => b.metrics.popularityScore - a.metrics.popularityScore)
      .slice(0, 3)
      .map(vehicle => ({
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        type: vehicle.type,
        color: vehicle.color,
        images: vehicle.images,
        price_per_day: vehicle.price_per_day,
        fuel_type: vehicle.fuel_type,
        seats: vehicle.seats,
        average_rating: vehicle.metrics.averageRating,
        vendor: vehicle.vendor,
        metrics: vehicle.metrics
      }))

    res.json({
      success: true,
      data: { top3 }
    })
  } catch (error) {
    console.error('Top 3 error:', error)
    res.status(500).json({
      success: false,
      message: 'Error getting top 3 vehicles'
    })
  }
}))

module.exports = router
