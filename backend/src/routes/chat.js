const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validateCreateChat, validateSendMessage } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/quicktime', 'video/x-msvideo',
      'audio/mpeg', 'audio/wav', 'audio/ogg',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  }
});

// @desc    Get user's chats
// @route   GET /api/chat
// @access  Private
const getChats = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    
    const chats = await Chat.find({
      'participants.user': req.user.id,
      isActive: true
    })
    .populate('participants.user', 'username firstName lastName avatar status')
    .populate('lastMessage', 'content type createdAt sender')
    .populate('lastMessage.sender', 'username firstName lastName avatar')
    .sort({ lastActivity: -1 })
    .skip(skip)
    .limit(limit);
    
    const total = await Chat.countDocuments({
      'participants.user': req.user.id,
      isActive: true
    });
    
    res.status(200).json({
      success: true,
      data: {
        chats,
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

// @desc    Get single chat
// @route   GET /api/chat/:id
// @access  Private
const getChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants.user', 'username firstName lastName avatar status')
      .populate('createdBy', 'username firstName lastName avatar');
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check if user is participant
    if (!chat.isParticipant(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        chat
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new chat
// @route   POST /api/chat
// @access  Private
const createChat = async (req, res, next) => {
  try {
    const { name, description, type, participants } = req.body;
    
    // Validate participants
    const participantIds = [...new Set([...participants, req.user.id])]; // Add creator and remove duplicates
    
    const validUsers = await User.find({
      _id: { $in: participantIds },
      isActive: true
    });
    
    if (validUsers.length !== participantIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more participants are invalid'
      });
    }
    
    // For private chats, check if chat already exists
    if (type === 'private' && participantIds.length === 2) {
      const existingChat = await Chat.findOne({
        type: 'private',
        'participants.user': { $all: participantIds },
        participantCount: 2
      });
      
      if (existingChat) {
        return res.status(400).json({
          success: false,
          message: 'Private chat already exists between these users',
          data: { chatId: existingChat._id }
        });
      }
    }
    
    const chatData = {
      type,
      createdBy: req.user.id,
      participants: participantIds.map(userId => ({
        user: userId,
        role: userId.toString() === req.user.id.toString() ? 'owner' : 'member'
      }))
    };
    
    if (type === 'group') {
      chatData.name = name;
      chatData.description = description;
    }
    
    const chat = await Chat.create(chatData);
    
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants.user', 'username firstName lastName avatar status')
      .populate('createdBy', 'username firstName lastName avatar');
    
    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: {
        chat: populatedChat
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update chat
// @route   PUT /api/chat/:id
// @access  Private
const updateChat = async (req, res, next) => {
  try {
    const { name, description, settings } = req.body;
    
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    // Check if user has permission to update
    const userParticipant = chat.participants.find(p => p.user.toString() === req.user.id.toString());
    
    if (!userParticipant || !['owner', 'admin'].includes(userParticipant.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this chat'
      });
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (settings) updateData.settings = { ...chat.settings, ...settings };
    
    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('participants.user', 'username firstName lastName avatar status');
    
    res.status(200).json({
      success: true,
      message: 'Chat updated successfully',
      data: {
        chat: updatedChat
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add participant to chat
// @route   POST /api/chat/:id/participants
// @access  Private
const addParticipant = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    if (chat.type === 'private') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add participants to private chat'
      });
    }
    
    // Check permissions
    const userParticipant = chat.participants.find(p => p.user.toString() === req.user.id.toString());
    
    if (!userParticipant || !['owner', 'admin'].includes(userParticipant.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add participants'
      });
    }
    
    // Check if user exists and is active
    const userToAdd = await User.findById(userId);
    if (!userToAdd || !userToAdd.isActive) {
      return res.status(400).json({
        success: false,
        message: 'User not found or inactive'
      });
    }
    
    await chat.addParticipant(userId);
    
    const updatedChat = await Chat.findById(req.params.id)
      .populate('participants.user', 'username firstName lastName avatar status');
    
    res.status(200).json({
      success: true,
      message: 'Participant added successfully',
      data: {
        chat: updatedChat
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove participant from chat
// @route   DELETE /api/chat/:id/participants/:userId
// @access  Private
const removeParticipant = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    if (chat.type === 'private') {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove participants from private chat'
      });
    }
    
    // Check permissions (can remove self or admin/owner can remove others)
    const userParticipant = chat.participants.find(p => p.user.toString() === req.user.id.toString());
    
    if (!userParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not a participant in this chat'
      });
    }
    
    if (userId !== req.user.id.toString() && !['owner', 'admin'].includes(userParticipant.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to remove this participant'
      });
    }
    
    await chat.removeParticipant(userId);
    
    const updatedChat = await Chat.findById(req.params.id)
      .populate('participants.user', 'username firstName lastName avatar status');
    
    res.status(200).json({
      success: true,
      message: 'Participant removed successfully',
      data: {
        chat: updatedChat
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat messages
// @route   GET /api/chat/:id/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    
    const chat = await Chat.findById(req.params.id);
    
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
    
    const messages = await Message.find({
      chat: req.params.id,
      isDeleted: false
    })
    .populate('sender', 'username firstName lastName avatar')
    .populate('replyTo', 'content sender')
    .populate('replyTo.sender', 'username firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    const total = await Message.countDocuments({
      chat: req.params.id,
      isDeleted: false
    });
    
    // Mark messages as read
    await chat.updateLastRead(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first
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

// @desc    Send message
// @route   POST /api/chat/:id/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { content, type = 'text', replyTo } = req.body;
    
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    if (!chat.isParticipant(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send messages to this chat'
      });
    }
    
    const messageData = {
      content,
      type,
      sender: req.user.id,
      chat: req.params.id
    };
    
    if (replyTo) {
      const originalMessage = await Message.findById(replyTo);
      if (originalMessage && originalMessage.chat.toString() === req.params.id) {
        messageData.replyTo = replyTo;
      }
    }
    
    const message = await Message.create(messageData);
    
    // Update chat's last message and activity
    chat.lastMessage = message._id;
    await chat.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username firstName lastName avatar')
      .populate('replyTo', 'content sender')
      .populate('replyTo.sender', 'username firstName lastName');
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        message: populatedMessage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload file/media
// @route   POST /api/chat/:id/upload
// @access  Private
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }
    
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }
    
    if (!chat.isParticipant(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload files to this chat'
      });
    }
    
    if (!chat.settings.allowFileSharing) {
      return res.status(403).json({
        success: false,
        message: 'File sharing is disabled in this chat'
      });
    }
    
    // Determine file type for message type
    let messageType = 'file';
    if (req.file.mimetype.startsWith('image/')) {
      messageType = 'image';
    } else if (req.file.mimetype.startsWith('video/')) {
      messageType = 'video';
    } else if (req.file.mimetype.startsWith('audio/')) {
      messageType = 'audio';
    }
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'chat-files'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });
    
    // Create message with attachment
    const message = await Message.create({
      content: req.file.originalname,
      type: messageType,
      sender: req.user.id,
      chat: req.params.id,
      attachments: [{
        url: result.secure_url,
        publicId: result.public_id,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      }]
    });
    
    // Update chat's last message and activity
    chat.lastMessage = message._id;
    await chat.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username firstName lastName avatar');
    
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        message: populatedMessage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/chat/:id/messages/:messageId
// @access  Private
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    if (message.chat.toString() !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Message does not belong to this chat'
      });
    }
    
    // Only sender can delete their own messages
    if (message.sender.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }
    
    await message.softDelete(req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Routes
router.get('/', protect, getChats);
router.get('/:id', protect, getChat);
router.post('/', protect, validateCreateChat, createChat);
router.put('/:id', protect, updateChat);
router.post('/:id/participants', protect, addParticipant);
router.delete('/:id/participants/:userId', protect, removeParticipant);
router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, validateSendMessage, sendMessage);
router.post('/:id/upload', protect, upload.single('file'), uploadFile);
router.delete('/:id/messages/:messageId', protect, deleteMessage);

module.exports = router;