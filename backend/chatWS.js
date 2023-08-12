const chatWS = require('express')();
const chatWSServer = require('http').createServer(chatWS);
const socketIO = require('socket.io');
import model from '../database/models';
import getAllMessages from './src/controllers/privateChatController.js';
import groupChatController from './src/controllers/groupChatController.js';

const { PrivateChat, GroupChatMessage } = model;

export default function chat(io) {
  const privateChatNamespace = io.of('/chat');
  const groupChatNamespace = io.of('/groupchat');

  privateChatNamespace.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('A user connected with user ID', userId);

    socket.on('getAllMessages', (data) => {
      const sender = data.senderId;
      const receiver = data.receiverIds;

      const messages = [];

      async function fetchMessages() {
        for (let i = 0; i < receiver.length; i++) {
          const roomId = generateRoomId(sender, receiver[i]);
          try {
            const message = await getAllMessages(roomId);
            messages.push({ roomId: roomId, messages: message });
          } catch (error) {
            console.log(error);
          }
        }
      }

      // Call the fetchMessages function
      fetchMessages()
        .then(() => {
          // console.log(messages);
          socket.emit('sendAllMessages', { oldMessages: messages });
        })
        .catch((error) => {
          console.log(error);
        });
    });

    socket.on('initiateChat', (data) => {
      const sender = data.senderId;
      const receiver = data.receiverId;

      const roomId = generateRoomId(sender, receiver);
      socket.join(roomId);

      const messages = getAllMessages(roomId);

      messages
        .then((messages) => {
          socket.emit('chatInitiated', { room: roomId, oldMessages: messages });
        })
        .catch((error) => {
          console.log(error);
        });
    });

    // Listen for 'chat message' events from the client
    socket.on('chatMessage', (data) => {
      const { roomId, message } = data;
      console.log('Received message:', message.content);

      var storedMessage = {};

      async function storeMessage() {
        try {
          storedMessage = await PrivateChat.create({
            content: message.content,
            senderID: message.sender,
            receiverID: message.receiver,
            roomID: roomId,
          });
          console.log(storedMessage);
        } catch (error) {
          console.error('Error saving message:', error);
        }
      }

      storeMessage()
        .then(() => {
          privateChatNamespace
            .to(roomId)
            .emit('chatMessage', { message: storedMessage });
        })
        .catch((error) => {
          console.log(error);
        });
    });

    // Listen for 'disconnect' events from clients
    socket.on('disconnect', () => {
      console.log('A user disconnected with user ID', userId);
    });
  });

  groupChatNamespace.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('A user connected with user ID', userId);

    socket.on('initiateChat', (data) => {
      const roomId = data.roomId;

      socket.join(roomId);

      const messages = groupChatController.getAllGroupMessages(roomId);

      console.log(messages);

      messages
        .then((messages) => {
          socket.emit('chatInitiated', { oldMessages: messages });
        })
        .catch((error) => {
          console.log(error);
        });
    });

    // Listen for 'chat message' events from the client
    socket.on('chatMessage', async (data) => {
      const { roomId, message } = data;
      console.log('Received message:', message.content);

      try {
        await GroupChatMessage.create({
          content: message.content,
          senderId: message.sender,
          roomId: roomId,
        });

        groupChatNamespace.to(roomId).emit('chatMessage', { message: message });
      } catch (error) {
        console.error('Error saving message:', error);
      }
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
}
