const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');


dotenv.config();


connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require('./routes/authRoutes');
const serverRoutes = require('./routes/serverRoutes');
const channelRoutes = require('./routes/channelRoutes');
const serverChannelRoutes = require('./routes/serverChannelRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/servers/:serverId/channels', serverChannelRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});


io.on('connection', (socket) => {
  console.log('New client connected', socket.id);
  
 
  let userId = null;
  let username = null;
  
 
  socket.on('authenticate', (userData) => {
    userId = userData.userId;
    username = userData.username;
    
   
    console.log(`User authenticated: ${username} (${userId}) with socket ${socket.id}`);
    
  
    socket.join(`user-${userId}`);
  });
  

  socket.on('join-channel', (channelId) => {
    socket.join(channelId);
    console.log(`User ${socket.id} joined channel ${channelId}`);
  });
 
  socket.on('leave-channel', (channelId) => {
    socket.leave(channelId);
    console.log(`User ${socket.id} left channel ${channelId}`);
  });
  
 
  socket.on('send-message', (data) => {
    io.to(data.channelId).emit('receive-message', {
      content: data.content,
      sender: data.sender,
      timestamp: new Date()
    });
  });
  
  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation-${conversationId}`);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });
  
 
  socket.on('leave-conversation', (conversationId) => {
    socket.leave(`conversation-${conversationId}`);
    console.log(`User ${socket.id} left conversation ${conversationId}`);
  });
  
 
  socket.on('send-direct-message', (data) => {
    console.log(`Sending message in conversation ${data.conversationId} from ${data.senderName || 'unknown user'}`);
    
    
    const messageToSend = {
      ...data,
      timestamp: new Date(),
      delivered: true
    };
    
    // Send to the conversation room (includes both the sender and recipient)
    io.to(`conversation-${data.conversationId}`).emit('receive-direct-message', messageToSend);
    
    // Log successful delivery
    console.log(`Message delivered to conversation ${data.conversationId}`);
  });
  
  socket.on('typing-in-conversation', (data) => {
    console.log(`User ${data.username} typing status: ${data.isTyping} in conversation ${data.conversationId}`);
    
    socket.to(`conversation-${data.conversationId}`).emit('user-typing', {
      userId: data.userId,
      username: data.username,
      conversationId: data.conversationId,
      isTyping: data.isTyping
    });
  });
  
 
  socket.on('call-user', (data) => {
    io.to(data.to).emit('call-made', {
      offer: data.offer,
      from: socket.id
    });
  });
  
  socket.on('answer-call', (data) => {
    io.to(data.to).emit('answer-made', {
      answer: data.answer,
      from: socket.id
    });
  });
  
  socket.on('ice-candidate', (data) => {
    io.to(data.to).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id
    });
  });
  
 
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
    if (userId) {
      console.log(`User ${username} (${userId}) disconnected`);
    }
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 