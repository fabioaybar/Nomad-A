const db = require('./database')

class UserModel {
  static async findAll(filters = {}) {
    return await db.findAll('users', filters)
  }

  static async findById(id) {
    return await db.findById('users', id)
  }

  static async findByEmail(email) {
    return await db.findByField('users', 'email', email)
  }

  static async findByPhone(phone) {
    return await db.findByField('users', 'phone', phone)
  }

  static async findByRole(role) {
    return await db.findAll('users', { role })
  }

  static async findActive() {
    return await db.findAll('users', { is_active: true })
  }

  static async create(userData) {
    return await db.create('users', userData)
  }

  static async update(id, updates) {
    return await db.update('users', id, updates)
  }

  static async delete(id) {
    return await db.delete('users', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('users', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('users', filters)
  }

  static async search(query, filters = {}) {
    const users = await db.findAll('users', filters)
    const searchTerm = query.toLowerCase()
    
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      (user.phone && user.phone.includes(searchTerm))
    )
  }

  static async getStats() {
    const totalUsers = await db.count('users')
    const activeUsers = await db.count('users', { is_active: true })
    const adminUsers = await db.count('users', { role: 'admin' })
    const vendorUsers = await db.count('users', { role: 'vendor' })
    const regularUsers = await db.count('users', { role: 'user' })
    
    return {
      total: totalUsers,
      active: activeUsers,
      inactive: totalUsers - activeUsers,
      byRole: {
        admin: adminUsers,
        vendor: vendorUsers,
        user: regularUsers
      }
    }
  }
}

class VendorModel {
  static async findAll(filters = {}) {
    return await db.findAll('vendors', filters)
  }

  static async findById(id) {
    return await db.findById('vendors', id)
  }

  static async findByUserId(userId) {
    return await db.findByField('vendors', 'user_id', userId)
  }

  static async findByEmail(email) {
    return await db.findByField('vendors', 'contact_email', email)
  }

  static async findByCompanyName(companyName) {
    return await db.findByField('vendors', 'company_name', companyName)
  }

  static async findVerified() {
    return await db.findAll('vendors', { is_verified: true })
  }

  static async findActive() {
    return await db.findAll('vendors', { is_active: true })
  }

  static async findByLocation(city, country) {
    return await db.findByFields('vendors', { city, country })
  }

  static async create(vendorData) {
    return await db.create('vendors', vendorData)
  }

  static async update(id, updates) {
    return await db.update('vendors', id, updates)
  }

  static async delete(id) {
    return await db.delete('vendors', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('vendors', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('vendors', filters)
  }

  static async search(query, filters = {}) {
    const vendors = await db.findAll('vendors', filters)
    const searchTerm = query.toLowerCase()
    
    return vendors.filter(vendor => 
      vendor.company_name.toLowerCase().includes(searchTerm) ||
      vendor.description.toLowerCase().includes(searchTerm) ||
      vendor.city.toLowerCase().includes(searchTerm) ||
      vendor.country.toLowerCase().includes(searchTerm) ||
      vendor.contact_email.toLowerCase().includes(searchTerm)
    )
  }

  static async getStats() {
    const totalVendors = await db.count('vendors')
    const verifiedVendors = await db.count('vendors', { is_verified: true })
    const activeVendors = await db.count('vendors', { is_active: true })
    
    return {
      total: totalVendors,
      verified: verifiedVendors,
      unverified: totalVendors - verifiedVendors,
      active: activeVendors,
      inactive: totalVendors - activeVendors
    }
  }

  static async getTopRated(limit = 10) {
    const vendors = await db.findAll('vendors', { is_verified: true })
    return vendors
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit)
  }

  static async updateStats(vendorId) {
    const vehicles = await VehicleModel.findByVendorId(vendorId)
    const bookings = await BookingModel.findByVendorId(vendorId)
    const reviews = await ReviewModel.findByVendorId(vendorId)
    
    const totalVehicles = vehicles.length
    const totalBookings = bookings.length
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    
    return await this.update(vendorId, {
      total_vehicles: totalVehicles,
      total_bookings: totalBookings,
      rating: Math.round(averageRating * 10) / 10
    })
  }
}

class VehicleModel {
  static async findAll(filters = {}) {
    return await db.findAll('vehicles', filters)
  }

  static async findById(id) {
    return await db.findById('vehicles', id)
  }

  static async findByVendorId(vendorId) {
    const vehicles = await db.findAll('vehicles')
    return vehicles.filter(vehicle => vehicle.vendor_id === vendorId)
  }

  static async findByMake(make) {
    return await db.findAll('vehicles', { make })
  }

  static async findByType(type) {
    return await db.findAll('vehicles', { type })
  }

  static async findByFuelType(fuelType) {
    return await db.findAll('vehicles', { fuel_type: fuelType })
  }

  static async findByTransmission(transmission) {
    return await db.findAll('vehicles', { transmission })
  }

  static async findByPriceRange(minPrice, maxPrice) {
    const vehicles = await db.findAll('vehicles')
    return vehicles.filter(vehicle => 
      vehicle.price_per_day >= minPrice && vehicle.price_per_day <= maxPrice
    )
  }

  static async findByLocation(latitude, longitude, radius = 10) {
    const vehicles = await db.findAll('vehicles')
    return vehicles.filter(vehicle => {
      if (!vehicle.latitude || !vehicle.longitude) return false
      const distance = this.calculateDistance(
        latitude, longitude, 
        vehicle.latitude, vehicle.longitude
      )
      return distance <= radius
    })
  }

  static async findAvailable(filters = {}) {
    const allFilters = { ...filters, is_available: true, rental_status: 'available' }
    return await db.findAll('vehicles', allFilters)
  }

  static async findRented(filters = {}) {
    const allFilters = { ...filters, is_rented: true, rental_status: 'rented' }
    return await db.findAll('vehicles', allFilters)
  }

  static async findUnderMaintenance(filters = {}) {
    const allFilters = { ...filters, rental_status: 'maintenance' }
    return await db.findAll('vehicles', allFilters)
  }

  static async create(vehicleData) {
    return await db.create('vehicles', vehicleData)
  }

  static async update(id, updates) {
    return await db.update('vehicles', id, updates)
  }

  static async delete(id) {
    return await db.delete('vehicles', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('vehicles', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('vehicles', filters)
  }

  static async search(query, filters = {}) {
    const vehicles = await db.findAll('vehicles', filters)
    const searchTerm = query.toLowerCase()
    
    return vehicles.filter(vehicle => 
      vehicle.make.toLowerCase().includes(searchTerm) ||
      vehicle.model.toLowerCase().includes(searchTerm) ||
      vehicle.type.toLowerCase().includes(searchTerm) ||
      vehicle.location_address.toLowerCase().includes(searchTerm) ||
      vehicle.description.toLowerCase().includes(searchTerm)
    )
  }

  static async getStats() {
    const totalVehicles = await db.count('vehicles')
    const availableVehicles = await db.count('vehicles', { is_available: true })
    const rentedVehicles = await db.count('vehicles', { is_rented: true })
    const maintenanceVehicles = await db.count('vehicles', { rental_status: 'maintenance' })
    
    return {
      total: totalVehicles,
      available: availableVehicles,
      rented: rentedVehicles,
      maintenance: maintenanceVehicles,
      utilization: totalVehicles > 0 ? (rentedVehicles / totalVehicles) * 100 : 0
    }
  }

  static async getTopRated(limit = 10) {
    const vehicles = await db.findAll('vehicles', { is_available: true })
    return vehicles
      .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      .slice(0, limit)
  }

  static async getMostPopular(limit = 10) {
    const vehicles = await db.findAll('vehicles')
    return vehicles
      .sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0))
      .slice(0, limit)
  }

  static async updateAvailability(vehicleId, isAvailable) {
    return await this.update(vehicleId, {
      is_available: isAvailable,
      is_rented: !isAvailable,
      rental_status: isAvailable ? 'available' : 'rented'
    })
  }

  static async updateRating(vehicleId) {
    const reviews = await ReviewModel.findByVehicleId(vehicleId)
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    
    return await this.update(vehicleId, {
      average_rating: Math.round(averageRating * 10) / 10,
      total_reviews: reviews.length
    })
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  static deg2rad(deg) {
    return deg * (Math.PI/180)
  }
}

class BookingModel {
  static async findAll(filters = {}) {
    return await db.findAll('bookings', filters)
  }

  static async findById(id) {
    return await db.findById('bookings', id)
  }

  static async findByUserId(userId) {
    return await db.findByField('bookings', 'user_id', userId)
  }

  static async findByVendorId(vendorId) {
    const bookings = await db.findAll('bookings')
    return bookings.filter(booking => booking.vendor_id === vendorId)
  }

  static async findByVehicleId(vehicleId) {
    return await db.findByField('bookings', 'vehicle_id', vehicleId)
  }

  static async findByVehicleIds(vehicleIds) {
    const bookings = await db.findAll('bookings')
    return bookings.filter(booking => vehicleIds.includes(booking.vehicle_id))
  }

  static async findByFields(fields) {
    return await db.findByFields('bookings', fields)
  }

  static async findByStatus(status) {
    return await db.findAll('bookings', { status })
  }

  static async findByPaymentStatus(paymentStatus) {
    return await db.findAll('bookings', { payment_status: paymentStatus })
  }

  static async findByDateRange(startDate, endDate) {
    const bookings = await db.findAll('bookings')
    return bookings.filter(booking => {
      const bookingStart = new Date(booking.start_date)
      const bookingEnd = new Date(booking.end_date)
      const filterStart = new Date(startDate)
      const filterEnd = new Date(endDate)
      
      return (bookingStart >= filterStart && bookingStart <= filterEnd) ||
             (bookingEnd >= filterStart && bookingEnd <= filterEnd) ||
             (bookingStart <= filterStart && bookingEnd >= filterEnd)
    })
  }

  static async findActive() {
    return await db.findAll('bookings', { status: 'active' })
  }

  static async findCompleted() {
    return await db.findAll('bookings', { status: 'completed' })
  }

  static async findCancelled() {
    return await db.findAll('bookings', { status: 'cancelled' })
  }

  static async findPending() {
    return await db.findAll('bookings', { status: 'pending' })
  }

  static async create(bookingData) {
    return await db.create('bookings', bookingData)
  }

  static async update(id, updates) {
    return await db.update('bookings', id, updates)
  }

  static async delete(id) {
    return await db.delete('bookings', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('bookings', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('bookings', filters)
  }

  static async checkAvailability(vehicleId, startDate, endDate) {
    const bookings = await db.findAll('bookings', {
      vehicle_id: vehicleId,
      status: ['confirmed', 'active']
    })
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return !bookings.some(booking => {
      const bookingStart = new Date(booking.start_date)
      const bookingEnd = new Date(booking.end_date)
      
      return (start < bookingEnd && end > bookingStart)
    })
  }

  static async getStats() {
    const totalBookings = await db.count('bookings')
    const activeBookings = await db.count('bookings', { status: 'active' })
    const completedBookings = await db.count('bookings', { status: 'completed' })
    const cancelledBookings = await db.count('bookings', { status: 'cancelled' })
    const pendingBookings = await db.count('bookings', { status: 'pending' })
    
    const bookings = await db.findAll('bookings')
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
    
    return {
      total: totalBookings,
      active: activeBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
      pending: pendingBookings,
      totalRevenue,
      averageBookingValue: Math.round(averageBookingValue)
    }
  }

  static async getRevenueStats(startDate, endDate) {
    const bookings = await this.findByDateRange(startDate, endDate)
    const completedBookings = bookings.filter(b => b.status === 'completed')
    
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + (booking.total_cost || 0), 0)
    const averageBookingValue = completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0
    
    return {
      totalBookings: bookings.length,
      completedBookings: completedBookings.length,
      totalRevenue,
      averageBookingValue: Math.round(averageBookingValue)
    }
  }

  static async updateStatus(bookingId, status) {
    return await this.update(bookingId, { status })
  }

  static async updatePaymentStatus(bookingId, paymentStatus) {
    return await this.update(bookingId, { payment_status: paymentStatus })
  }

  static async cancelBooking(bookingId, reason = '') {
    return await this.update(bookingId, { 
      status: 'cancelled',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString()
    })
  }

  static async completeBooking(bookingId) {
    return await this.update(bookingId, { 
      status: 'completed',
      completed_at: new Date().toISOString()
    })
  }
}

class ReviewModel {
  static async findAll(filters = {}) {
    return await db.findAll('reviews', filters)
  }

  static async findById(id) {
    return await db.findById('reviews', id)
  }

  static async findByVehicleId(vehicleId) {
    return await db.findByField('reviews', 'vehicle_id', vehicleId)
  }

  static async findByVendorId(vendorId) {
    const reviews = await db.findAll('reviews')
    return reviews.filter(review => review.vendor_id === vendorId)
  }

  static async findByUserId(userId) {
    return await db.findByField('reviews', 'user_id', userId)
  }

  static async findByBookingId(bookingId) {
    return await db.findByField('reviews', 'booking_id', bookingId)
  }

  static async findByFields(fields) {
    return await db.findByFields('reviews', fields)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('reviews', page, limit, filters)
  }

  static async findByRating(rating) {
    return await db.findAll('reviews', { rating })
  }

  static async findApproved() {
    return await db.findAll('reviews', { is_approved: true })
  }

  static async findPending() {
    return await db.findAll('reviews', { is_approved: false })
  }

  static async create(reviewData) {
    return await db.create('reviews', reviewData)
  }

  static async update(id, updates) {
    return await db.update('reviews', id, updates)
  }

  static async delete(id) {
    return await db.delete('reviews', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('reviews', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('reviews', filters)
  }

  static async getStats() {
    const totalReviews = await db.count('reviews')
    const approvedReviews = await db.count('reviews', { is_approved: true })
    const pendingReviews = await db.count('reviews', { is_approved: false })
    
    const reviews = await db.findAll('reviews', { is_approved: true })
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0
    
    return {
      total: totalReviews,
      approved: approvedReviews,
      pending: pendingReviews,
      averageRating: Math.round(averageRating * 10) / 10
    }
  }

  static async approveReview(reviewId) {
    return await this.update(reviewId, { is_approved: true })
  }

  static async rejectReview(reviewId, reason = '') {
    return await this.update(reviewId, { 
      is_approved: false,
      rejection_reason: reason
    })
  }
}

class MaintenanceModel {
  static async findAll(filters = {}) {
    return await db.findAll('maintenance', filters)
  }

  static async findById(id) {
    return await db.findById('maintenance', id)
  }

  static async findByVehicleId(vehicleId) {
    return await db.findByField('maintenance', 'vehicle_id', vehicleId)
  }

  static async findByVendorId(vendorId) {
    const maintenance = await db.findAll('maintenance')
    return maintenance.filter(item => item.vendor_id === vendorId)
  }

  static async findByVehicleIds(vehicleIds) {
    const maintenance = await db.findAll('maintenance')
    return maintenance.filter(item => vehicleIds.includes(item.vehicle_id))
  }

  static async findByStatus(status) {
    return await db.findAll('maintenance', { status })
  }

  static async findScheduled() {
    return await db.findAll('maintenance', { status: 'scheduled' })
  }

  static async findInProgress() {
    return await db.findAll('maintenance', { status: 'in_progress' })
  }

  static async findCompleted() {
    return await db.findAll('maintenance', { status: 'completed' })
  }

  static async create(maintenanceData) {
    return await db.create('maintenance', maintenanceData)
  }

  static async update(id, updates) {
    return await db.update('maintenance', id, updates)
  }

  static async delete(id) {
    return await db.delete('maintenance', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('maintenance', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('maintenance', filters)
  }

  static async getStats() {
    const totalMaintenance = await db.count('maintenance')
    const scheduledMaintenance = await db.count('maintenance', { status: 'scheduled' })
    const inProgressMaintenance = await db.count('maintenance', { status: 'in_progress' })
    const completedMaintenance = await db.count('maintenance', { status: 'completed' })
    
    return {
      total: totalMaintenance,
      scheduled: scheduledMaintenance,
      inProgress: inProgressMaintenance,
      completed: completedMaintenance
    }
  }

  static async updateStatus(maintenanceId, status) {
    return await this.update(maintenanceId, { status })
  }

  static async completeMaintenance(maintenanceId, notes = '') {
    return await this.update(maintenanceId, { 
      status: 'completed',
      completion_notes: notes,
      completed_at: new Date().toISOString()
    })
  }
}

class RewardModel {
  static async findAll(filters = {}) {
    return await db.findAll('rewards', filters)
  }

  static async findById(id) {
    return await db.findById('rewards', id)
  }

  static async findByUserId(userId) {
    return await db.findByField('rewards', 'user_id', userId)
  }

  static async findByType(type) {
    return await db.findAll('rewards', { type })
  }

  static async findActive() {
    return await db.findAll('rewards', { is_active: true })
  }

  static async findRedeemed() {
    return await db.findAll('rewards', { is_redeemed: true })
  }

  static async create(rewardData) {
    return await db.create('rewards', rewardData)
  }

  static async update(id, updates) {
    return await db.update('rewards', id, updates)
  }

  static async delete(id) {
    return await db.delete('rewards', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('rewards', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('rewards', filters)
  }

  static async getStats() {
    const totalRewards = await db.count('rewards')
    const activeRewards = await db.count('rewards', { is_active: true })
    const redeemedRewards = await db.count('rewards', { is_redeemed: true })
    
    return {
      total: totalRewards,
      active: activeRewards,
      redeemed: redeemedRewards
    }
  }

  static async redeemReward(rewardId) {
    return await this.update(rewardId, { 
      is_redeemed: true,
      redeemed_at: new Date().toISOString()
    })
  }
}

class DiscountModel {
  static async findAll(filters = {}) {
    return await db.findAll('discounts', filters)
  }

  static async findById(id) {
    return await db.findById('discounts', id)
  }

  static async findActive() {
    return await db.findAll('discounts', { is_active: true })
  }

  static async findByCode(code) {
    return await db.findByField('discounts', 'code', code)
  }

  static async findByType(type) {
    return await db.findAll('discounts', { type })
  }

  static async create(discountData) {
    return await db.create('discounts', discountData)
  }

  static async update(id, updates) {
    return await db.update('discounts', id, updates)
  }

  static async delete(id) {
    return await db.delete('discounts', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('discounts', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('discounts', filters)
  }

  static async getStats() {
    const totalDiscounts = await db.count('discounts')
    const activeDiscounts = await db.count('discounts', { is_active: true })
    
    return {
      total: totalDiscounts,
      active: activeDiscounts,
      inactive: totalDiscounts - activeDiscounts
    }
  }

  static async validateDiscount(code) {
    const discount = await this.findByCode(code)
    if (!discount) return null
    
    const now = new Date()
    const startDate = new Date(discount.start_date)
    const endDate = new Date(discount.end_date)
    
    if (now < startDate || now > endDate || !discount.is_active) {
      return null
    }
    
    return discount
  }
}

class ConversationModel {
  static async findAll(filters = {}) {
    return await db.findAll('conversations', filters)
  }

  static async findById(id) {
    return await db.findById('conversations', id)
  }

  static async findByUserId(userId) {
    const conversations = await db.findAll('conversations')
    return conversations.filter(c => c.user_id === userId)
  }

  static async findByVendorId(vendorId) {
    const conversations = await db.findAll('conversations')
    return conversations.filter(c => c.vendor_id === vendorId)
  }

  static async findByParticipants(userId, participantId) {
    const conversations = await db.findAll('conversations')
    return conversations.find(c => 
      (c.user_id === userId && c.participant_id === participantId) ||
      (c.user_id === participantId && c.participant_id === userId)
    )
  }

  static async findActive() {
    return await db.findAll('conversations', { is_active: true })
  }

  static async create(conversationData) {
    return await db.create('conversations', conversationData)
  }

  static async update(id, updates) {
    return await db.update('conversations', id, updates)
  }

  static async delete(id) {
    return await db.delete('conversations', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('conversations', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('conversations', filters)
  }

  static async getStats() {
    const totalConversations = await db.count('conversations')
    const activeConversations = await db.count('conversations', { is_active: true })
    
    return {
      total: totalConversations,
      active: activeConversations,
      inactive: totalConversations - activeConversations
    }
  }

  static async archiveConversation(conversationId) {
    return await this.update(conversationId, { is_active: false })
  }
}

class MessageModel {
  static async findAll(filters = {}) {
    return await db.findAll('messages', filters)
  }

  static async findById(id) {
    return await db.findById('messages', id)
  }

  static async findByConversationId(conversationId) {
    const messages = await db.findAll('messages')
    return messages.filter(m => m.conversation_id === conversationId)
  }

  static async findLastByConversationId(conversationId) {
    const messages = await db.findAll('messages')
    const conversationMessages = messages.filter(m => m.conversation_id === conversationId)
    if (conversationMessages.length === 0) return null
    return conversationMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
  }

  static async findBySenderId(senderId) {
    return await db.findByField('messages', 'sender_id', senderId)
  }

  static async findUnreadByUserId(userId) {
    const messages = await db.findAll('messages')
    return messages.filter(m => m.receiver_id === userId && !m.is_read)
  }

  static async create(messageData) {
    return await db.create('messages', messageData)
  }

  static async update(id, updates) {
    return await db.update('messages', id, updates)
  }

  static async delete(id) {
    return await db.delete('messages', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('messages', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('messages', filters)
  }

  static async getStats() {
    const totalMessages = await db.count('messages')
    const unreadMessages = await db.count('messages', { is_read: false })
    
    return {
      total: totalMessages,
      unread: unreadMessages,
      read: totalMessages - unreadMessages
    }
  }

  static async markAsRead(messageId) {
    return await this.update(messageId, { is_read: true })
  }

  static async markAllAsRead(conversationId) {
    const messages = await this.findByConversationId(conversationId)
    const unreadMessages = messages.filter(m => !m.is_read)
    
    for (const message of unreadMessages) {
      await this.update(message.id, { is_read: true })
    }
    
    return unreadMessages.length
  }
}

class NotificationModel {
  static async findAll(filters = {}) {
    return await db.findAll('notifications', filters)
  }

  static async findById(id) {
    return await db.findById('notifications', id)
  }

  static async findByUserId(userId) {
    return await db.findByField('notifications', 'user_id', userId)
  }

  static async findByType(type) {
    return await db.findAll('notifications', { type })
  }

  static async findUnreadByUserId(userId) {
    return await db.findByFields('notifications', { user_id: userId, is_read: false })
  }

  static async findReadByUserId(userId) {
    return await db.findByFields('notifications', { user_id: userId, is_read: true })
  }

  static async create(notificationData) {
    return await db.create('notifications', notificationData)
  }

  static async update(id, updates) {
    return await db.update('notifications', id, updates)
  }

  static async delete(id) {
    return await db.delete('notifications', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('notifications', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('notifications', filters)
  }

  static async getStats() {
    const totalNotifications = await db.count('notifications')
    const unreadNotifications = await db.count('notifications', { is_read: false })
    
    return {
      total: totalNotifications,
      unread: unreadNotifications,
      read: totalNotifications - unreadNotifications
    }
  }

  static async markAsRead(notificationId) {
    return await this.update(notificationId, { is_read: true })
  }

  static async markAllAsRead(userId) {
    return await db.updateMany('notifications', { user_id: userId }, { is_read: true })
  }

  static async createNotification(userId, type, title, message, data = {}) {
    return await this.create({
      user_id: userId,
      type,
      title,
      message,
      data,
      is_read: false
    })
  }
}

// Additional models for complete system
class PaymentModel {
  static async findAll(filters = {}) {
    return await db.findAll('payments', filters)
  }

  static async findById(id) {
    return await db.findById('payments', id)
  }

  static async findByBookingId(bookingId) {
    return await db.findByField('payments', 'booking_id', bookingId)
  }

  static async findByUserId(userId) {
    return await db.findByField('payments', 'user_id', userId)
  }

  static async findByStatus(status) {
    return await db.findAll('payments', { status })
  }

  static async findByTransactionId(transactionId) {
    return await db.findByField('payments', 'transaction_id', transactionId)
  }

  static async create(paymentData) {
    return await db.create('payments', paymentData)
  }

  static async update(id, updates) {
    return await db.update('payments', id, updates)
  }

  static async delete(id) {
    return await db.delete('payments', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('payments', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('payments', filters)
  }

  static async getStats() {
    const totalPayments = await db.count('payments')
    const successfulPayments = await db.count('payments', { status: 'completed' })
    const failedPayments = await db.count('payments', { status: 'failed' })
    const pendingPayments = await db.count('payments', { status: 'pending' })
    
    const payments = await db.findAll('payments', { status: 'completed' })
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
    
    return {
      total: totalPayments,
      successful: successfulPayments,
      failed: failedPayments,
      pending: pendingPayments,
      totalAmount
    }
  }
}

class ReportModel {
  static async findAll(filters = {}) {
    return await db.findAll('reports', filters)
  }

  static async findById(id) {
    return await db.findById('reports', id)
  }

  static async findByUserId(userId) {
    return await db.findByField('reports', 'user_id', userId)
  }

  static async findByType(type) {
    return await db.findAll('reports', { type })
  }

  static async findByStatus(status) {
    return await db.findAll('reports', { status })
  }

  static async create(reportData) {
    return await db.create('reports', reportData)
  }

  static async update(id, updates) {
    return await db.update('reports', id, updates)
  }

  static async delete(id) {
    return await db.delete('reports', id)
  }

  static async paginate(page = 1, limit = 10, filters = {}) {
    return await db.paginate('reports', page, limit, filters)
  }

  static async count(filters = {}) {
    return await db.count('reports', filters)
  }

  static async getStats() {
    const totalReports = await db.count('reports')
    const pendingReports = await db.count('reports', { status: 'pending' })
    const resolvedReports = await db.count('reports', { status: 'resolved' })
    const rejectedReports = await db.count('reports', { status: 'rejected' })
    
    return {
      total: totalReports,
      pending: pendingReports,
      resolved: resolvedReports,
      rejected: rejectedReports
    }
  }
}

module.exports = {
  UserModel,
  VendorModel,
  VehicleModel,
  BookingModel,
  ReviewModel,
  MaintenanceModel,
  RewardModel,
  DiscountModel,
  ConversationModel,
  MessageModel,
  NotificationModel,
  PaymentModel,
  ReportModel
}

