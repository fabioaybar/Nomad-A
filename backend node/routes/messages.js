const express = require('express')
const router = express.Router()

// @route   GET /api/messages
// @desc    Get messages
// @access  Private
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Messages endpoint - to be implemented' })
})

module.exports = router

