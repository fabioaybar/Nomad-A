const express = require('express')
const router = express.Router()

// @route   GET /api/reports
// @desc    Generate reports
// @access  Private (Admin)
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Reports endpoint - to be implemented' })
})

module.exports = router

