const chatWS = require('express')();
const chatWSServer = require('http').createServer(chatWS);
const socketIO = require('socket.io');
import model from './src/models';

const { PrivateChat } = model;

const io = socketIO(chatWSServer, {
  cors: {
    origin: '*',
  },
});

const privateChatNamespace = io.of('/chat');

privateChatNamespace.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('A user connected with user ID', userId);

  socket.on('initiateChat', (data) => {
    const sender = data.senderId;
    const receiver = data.receiverId;

    const roomId = generateRoomId(sender, receiver);
    socket.join(roomId);

    privateChatNamespace.to(roomId).emit('chatInitiated', { room: roomId });
  });

  // Listen for 'chat message' events from the client
  socket.on('chatMessage', (data) => {
    const { roomId, message } = data;
    console.log('Received message:', message.content);

    try {
      PrivateChat.create({
        content: message.content,
        senderID: message.sender,
        receiverID: message.receiver,
        roomID: roomId,
      });

      privateChatNamespace.to(roomId).emit('chatMessage', message);
      console.log('Message saved:');
    } catch (error) {
      console.error('Error saving message:', error);
    }

    // Broadcast the received message to all connected clients, including the sender
    // Later will change it to Broadcast to only the sender and the receiver
  });

  // Listen for 'disconnect' events from clients
  socket.on('disconnect', () => {
    console.log('A user disconnected with user ID', userId);
  });
});

function generateRoomId(senderId, receiverId) {
  const separator = '_';
  const sortedIds = [senderId, receiverId].sort();
  return sortedIds.join(separator);
}

module.exports = chatWSServer;
