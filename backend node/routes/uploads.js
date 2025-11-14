const express = require('express')
const router = express.Router()

// @route   POST /api/uploads
// @desc    Handle file uploads
// @access  Private
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Uploads endpoint - to be implemented' })
})

module.exports = router

