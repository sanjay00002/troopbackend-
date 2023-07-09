const chatWS = require('express')();
const chatWSServer = require('http').createServer(chatWS);
const socketIO = require('socket.io');
import model from './src/models';
import getAllMessages from './src/controllers/privateChatController.js';

const { PrivateChat } = model;

const io = socketIO(chatWSServer, {
  cors: {
    origin: '*',
  },
  transports: ['polling', 'websocket'],
});



const privateChatNamespace = io.of('/chat');
const groupChatNamespace = io.of('/groupchat');

privateChatNamespace.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('A user connected with user ID', userId);

  socket.on('initiateChat', (data) => {
    const sender = data.senderId;
    const receiver = data.receiverId;

    const roomId = generateRoomId(sender, receiver);
    socket.join(roomId);

    const messages = getAllMessages(roomId);


    messages.then((messages) =>{
      socket.emit('chatInitiated', { room: roomId, oldMessages: messages});
    }).catch((error) => {
      console.log(error);
    })

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

      privateChatNamespace.to(roomId).emit('chatMessage',{message: message});

      console.log(message, "here is the saved message");


    } catch (error) {
      console.error('Error saving message:', error);
    }

  
  });

  // Listen for 'disconnect' events from clients
  socket.on('disconnect', () => {
    console.log('A user disconnected with user ID', userId);
  });
});

groupChatNamespace.on('connection', (socket) => {

});



function generateRoomId(senderId, receiverId) {
  const separator = '_';
  const sortedIds = [senderId, receiverId].sort();
  return sortedIds.join(separator);
}

module.exports = chatWSServer;
