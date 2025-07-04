const jwt = require('jsonwebtoken');
const User = require('../models/User');

const setupSocketHandlers = (io) => {
  // Middleware para autenticación de socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`👤 User ${socket.user.username} connected`);

    // Join user to their personal room
    socket.join(socket.userId);

    // Chat handlers
    socket.on('join_chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.user.username} joined chat ${chatId}`);
    });

    socket.on('leave_chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.user.username} left chat ${chatId}`);
    });

    socket.on('send_message', (data) => {
      const { chatId, message, timestamp } = data;
      
      // Broadcast message to all users in the chat
      socket.to(chatId).emit('receive_message', {
        chatId,
        message,
        sender: {
          _id: socket.userId,
          username: socket.user.username,
          avatar: socket.user.avatar
        },
        timestamp
      });
    });

    // Video call handlers
    socket.on('call_user', (data) => {
      const { userToCall, signalData, from, name } = data;
      io.to(userToCall).emit('call_user', {
        signal: signalData,
        from,
        name
      });
    });

    socket.on('answer_call', (data) => {
      const { to, signal } = data;
      io.to(to).emit('call_accepted', signal);
    });

    socket.on('end_call', (data) => {
      const { to } = data;
      io.to(to).emit('call_ended');
    });

    socket.on('reject_call', (data) => {
      const { to } = data;
      io.to(to).emit('call_rejected');
    });

    // Typing indicators
    socket.on('typing', (data) => {
      const { chatId, isTyping } = data;
      socket.to(chatId).emit('user_typing', {
        userId: socket.userId,
        username: socket.user.username,
        isTyping
      });
    });

    // User status
    socket.on('update_status', (status) => {
      socket.user.status = status;
      socket.broadcast.emit('user_status_update', {
        userId: socket.userId,
        status
      });
    });

    socket.on('disconnect', () => {
      console.log(`👤 User ${socket.user.username} disconnected`);
      
      // Broadcast user offline status
      socket.broadcast.emit('user_status_update', {
        userId: socket.userId,
        status: 'offline'
      });
    });
  });
};

module.exports = { setupSocketHandlers };