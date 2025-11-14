const express = require('express')
const router = express.Router()

// @route   GET /api/external/currency-conversion
// @desc    Currency conversion
// @access  Public
router.get('/currency-conversion', (req, res) => {
  res.json({ success: true, message: 'External API endpoints - to be implemented' })
})

module.exports = router

