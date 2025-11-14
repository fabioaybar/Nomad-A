const express = require('express')
const router = express.Router()

// @route   GET /api/system/health
// @desc    System health check
// @access  Public
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'OK',
    timestamp: new Date().toISOString()
  })
})

module.exports = router

