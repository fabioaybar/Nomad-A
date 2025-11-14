const express = require('express')
const { body, query } = require('express-validator')
const { ConversationModel, MessageModel, UserModel } = require('../database/models')
const { authenticate, authorize } = require('../middleware/auth')
const { validate, asyncHandler } = require('../middleware/errorHandler')

const router = express.Router()

// @route   GET /api/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const conversations = await ConversationModel.findByUserId(userId)
  
  // Populate last message for each conversation
  const populatedConversations = await Promise.all(conversations.map(async (conversation) => {
    const lastMessage = await MessageModel.findLastByConversationId(conversation.id)
    return {
      ...conversation,
      lastMessage: lastMessage?.text || 'No messages yet'
    }
  }))

  res.json({
    success: true,
    data: populatedConversations
  })
}))

// @route   POST /api/conversations
// @desc    Create a new conversation
// @access  Private
router.post('/', authenticate, [
  body('participantId').isInt().withMessage('Participant ID must be a number'),
  body('title').trim().notEmpty().withMessage('Title is required')
], validate, asyncHandler(async (req, res) => {
  const { participantId, title } = req.body
  const userId = req.user.id

  // Check if conversation already exists
  const existingConversation = await ConversationModel.findByParticipants(userId, participantId)
  if (existingConversation) {
    return res.json({
      success: true,
      data: existingConversation
    })
  }

  const conversation = await ConversationModel.create({
    user_id: userId,
    participant_id: participantId,
    title: title,
    help_requested: false
  })

  res.status(201).json({
    success: true,
    data: conversation
  })
}))

// @route   GET /api/conversations/:id/messages
// @desc    Get messages for a conversation
// @access  Private
router.get('/:id/messages', authenticate, asyncHandler(async (req, res) => {
  const conversationId = parseInt(req.params.id)
  const userId = req.user.id

  // Verify user has access to this conversation
  const conversation = await ConversationModel.findById(conversationId)
  if (!conversation || conversation.user_id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  const messages = await MessageModel.findByConversationId(conversationId)

  res.json({
    success: true,
    data: messages
  })
}))

// @route   POST /api/conversations/:id/messages
// @desc    Send a message in a conversation
// @access  Private
router.post('/:id/messages', authenticate, [
  body('text').trim().notEmpty().withMessage('Message text is required'),
  body('from').isIn(['user', 'participant', 'admin']).withMessage('Invalid sender type')
], validate, asyncHandler(async (req, res) => {
  const conversationId = parseInt(req.params.id)
  const userId = req.user.id
  const { text, from } = req.body

  // Verify user has access to this conversation
  const conversation = await ConversationModel.findById(conversationId)
  if (!conversation || conversation.user_id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  const message = await MessageModel.create({
    conversation_id: conversationId,
    sender_id: userId,
    sender_type: from,
    text: text,
    timestamp: new Date().toISOString()
  })

  // Update conversation's last message
  await ConversationModel.update(conversationId, {
    last_message: text,
    updated_at: new Date().toISOString()
  })

  res.status(201).json({
    success: true,
    data: message
  })
}))

// @route   PUT /api/conversations/:id/help
// @desc    Toggle help request for a conversation
// @access  Private
router.put('/:id/help', authenticate, asyncHandler(async (req, res) => {
  const conversationId = parseInt(req.params.id)
  const userId = req.user.id
  const { help_requested } = req.body

  // Verify user has access to this conversation
  const conversation = await ConversationModel.findById(conversationId)
  if (!conversation || conversation.user_id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  const updatedConversation = await ConversationModel.update(conversationId, {
    help_requested: help_requested,
    updated_at: new Date().toISOString()
  })

  res.json({
    success: true,
    data: updatedConversation
  })
}))

// @route   GET /api/vendors/:id/conversations
// @desc    Get conversations for a specific vendor
// @access  Private (Vendor/Admin)
router.get('/vendors/:id/conversations', authenticate, asyncHandler(async (req, res) => {
  const vendorId = parseInt(req.params.id)
  
  // Check if user is the vendor or admin
  if (req.user.role !== 'admin' && req.user.id !== vendorId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }
  
  const conversations = await ConversationModel.findAll()
  const vendorConversations = conversations.filter(conv => conv.participant_id === vendorId)
  
  // Enhance conversations with additional data
  const enhancedConversations = await Promise.all(vendorConversations.map(async (conv) => {
    // Get customer info
    const customer = await UserModel.findById(conv.user_id)
    
    // Get message count and unread count
    const messages = await MessageModel.findAll()
    const conversationMessages = messages.filter(msg => msg.conversation_id === conv.id)
    const unreadMessages = conversationMessages.filter(msg => 
      msg.sender_type === 'user' && !msg.read_at
    )
    
    // Get recent messages
    const recentMessages = conversationMessages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
    
    return {
      ...conv,
      customer: customer ? {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      } : null,
      message_count: conversationMessages.length,
      unread_count: unreadMessages.length,
      messages: recentMessages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender_type: msg.sender_type,
        timestamp: msg.timestamp
      }))
    }
  }))
  
  res.json({
    success: true,
    data: {
      conversations: enhancedConversations,
      total: enhancedConversations.length
    }
  })
}))

// @route   POST /api/conversations/:id/archive
// @desc    Archive a conversation
// @access  Private (Vendor/Admin)
router.post('/:id/archive', authenticate, asyncHandler(async (req, res) => {
  const conversationId = parseInt(req.params.id)
  const userId = req.user.id

  // Verify user has access to this conversation (vendor or admin)
  const conversation = await ConversationModel.findById(conversationId)
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found'
    })
  }

  // Check if user is the vendor participant or admin
  if (req.user.role !== 'admin' && conversation.participant_id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  const updatedConversation = await ConversationModel.update(conversationId, {
    status: 'archived',
    updated_at: new Date().toISOString()
  })

  res.json({
    success: true,
    data: updatedConversation
  })
}))

// @route   POST /api/conversations/:id/resolve-help
// @desc    Resolve a help request
// @access  Private (Vendor/Admin)
router.post('/:id/resolve-help', authenticate, asyncHandler(async (req, res) => {
  const conversationId = parseInt(req.params.id)
  const userId = req.user.id

  // Verify user has access to this conversation (vendor or admin)
  const conversation = await ConversationModel.findById(conversationId)
  if (!conversation) {
    return res.status(404).json({
      success: false,
      message: 'Conversation not found'
    })
  }

  // Check if user is the vendor participant or admin
  if (req.user.role !== 'admin' && conversation.participant_id !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    })
  }

  const updatedConversation = await ConversationModel.update(conversationId, {
    help_requested: false,
    updated_at: new Date().toISOString()
  })

  res.json({
    success: true,
    data: updatedConversation
  })
}))

module.exports = router