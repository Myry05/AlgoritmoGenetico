const express = require('express');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Initiate video call
// @route   POST /api/video/call
// @access  Private
const initiateCall = async (req, res, next) => {
  try {
    const { chatId, callType = 'video' } = req.body;
    
    if (!['video', 'audio'].includes(callType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid call type. Must be video or audio'
      });
    }
    
    const chat = await Chat.findById(chatId)
      .populate('participants.user', 'username firstName lastName avatar status');
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    if (!chat.isParticipant(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to call in this chat'
      });
    }
    
    // Check if video/audio calls are allowed
    if (callType === 'video' && !chat.settings.allowVideoCalls) {
      return res.status(403).json({
        success: false,
        message: 'Video calls are disabled in this chat'
      });
    }
    
    if (callType === 'audio' && !chat.settings.allowVoiceCalls) {
      return res.status(403).json({
        success: false,
        message: 'Voice calls are disabled in this chat'
      });
    }
    
    // Get other participants (exclude caller)
    const otherParticipants = chat.participants
      .filter(p => p.user._id.toString() !== req.user.id.toString())
      .map(p => ({
        id: p.user._id,
        username: p.user.username,
        name: `${p.user.firstName} ${p.user.lastName}`,
        avatar: p.user.avatar,
        status: p.user.status
      }));
    
    // For private chats, we can only call if the other user is online
    if (chat.type === 'private') {
      const otherUser = otherParticipants[0];
      if (!otherUser || otherUser.status === 'offline') {
        return res.status(400).json({
          success: false,
          message: 'User is not available for calls'
        });
      }
    }
    
    // Generate call session ID (you would typically use a more robust ID generation)
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.status(200).json({
      success: true,
      message: 'Call initiated successfully',
      data: {
        callId,
        callType,
        chat: {
          id: chat._id,
          name: chat.name || (chat.type === 'private' ? otherParticipants[0]?.name : 'Group Call'),
          type: chat.type
        },
        participants: otherParticipants,
        caller: {
          id: req.user.id,
          username: req.user.username,
          name: `${req.user.firstName} ${req.user.lastName}`,
          avatar: req.user.avatar
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get call history
// @route   GET /api/video/history
// @access  Private
const getCallHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    // This would typically come from a calls collection
    // For now, we'll return an empty array as placeholder
    const calls = [];
    const total = 0;
    
    res.status(200).json({
      success: true,
      data: {
        calls,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End call
// @route   POST /api/video/end
// @access  Private
const endCall = async (req, res, next) => {
  try {
    const { callId, duration, reason = 'normal' } = req.body;
    
    if (!callId) {
      return res.status(400).json({
        success: false,
        message: 'Call ID is required'
      });
    }
    
    // Here you would typically:
    // 1. Update call record in database
    // 2. Clean up any WebRTC resources
    // 3. Send notifications to other participants
    
    res.status(200).json({
      success: true,
      message: 'Call ended successfully',
      data: {
        callId,
        duration,
        reason,
        endedAt: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user availability for calls
// @route   GET /api/video/availability/:userId
// @access  Private
const getUserAvailability = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('status username firstName lastName');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const isAvailable = ['online', 'away'].includes(user.status);
    
    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        username: user.username,
        name: `${user.firstName} ${user.lastName}`,
        status: user.status,
        isAvailable,
        canReceiveCalls: isAvailable
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check chat call permissions
// @route   GET /api/video/permissions/:chatId
// @access  Private
const getCallPermissions = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    if (!chat.isParticipant(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        chatId: chat._id,
        chatType: chat.type,
        permissions: {
          canMakeVideoCalls: chat.settings.allowVideoCalls,
          canMakeVoiceCalls: chat.settings.allowVoiceCalls,
          participantCount: chat.participants.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update call settings for chat
// @route   PUT /api/video/settings/:chatId
// @access  Private
const updateCallSettings = async (req, res, next) => {
  try {
    const { allowVideoCalls, allowVoiceCalls } = req.body;
    
    const chat = await Chat.findById(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check if user has permission to update settings
    const userParticipant = chat.participants.find(p => p.user.toString() === req.user.id.toString());
    
    if (!userParticipant || !['owner', 'admin'].includes(userParticipant.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update call settings'
      });
    }
    
    const updateData = {};
    if (allowVideoCalls !== undefined) {
      updateData['settings.allowVideoCalls'] = allowVideoCalls;
    }
    if (allowVoiceCalls !== undefined) {
      updateData['settings.allowVoiceCalls'] = allowVoiceCalls;
    }
    
    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      updateData,
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Call settings updated successfully',
      data: {
        chatId: updatedChat._id,
        settings: updatedChat.settings
      }
    });
  } catch (error) {
    next(error);
  }
};

// Routes
router.post('/call', protect, initiateCall);
router.get('/history', protect, getCallHistory);
router.post('/end', protect, endCall);
router.get('/availability/:userId', protect, getUserAvailability);
router.get('/permissions/:chatId', protect, getCallPermissions);
router.put('/settings/:chatId', protect, updateCallSettings);

module.exports = router;