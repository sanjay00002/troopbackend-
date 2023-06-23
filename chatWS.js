const chatWS = require('express')();
const chatWSServer = require('http').createServer(chatWS);
const socketIO = require('socket.io');


const io = socketIO(chatWSServer, {
    cors: {
      origin: "*"
    }
});

const privateChatNamespace = io.of("/chat");

privateChatNamespace.on('connection', (socket) => {
    
    console.log('A user connected');
  
    // Listen for 'chat message' events from the client
    socket.on('chat message', (message) => {
      console.log('Received message:', message.content);
  
      // Broadcast the received message to all connected clients, including the sender
      // Later will change it to Broadcast to only the sender and the receiver
      privateChatNamespace.emit('chat message', message);
    });
  
    // Listen for 'disconnect' events from clients
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
});







module.exports = chatWSServer;