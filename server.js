import express, { json } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
const http = require('http');
const socketIO = require('socket.io');

import authRouter from './src/routes/auth';
import userRouter from './src/routes/user';
import contestRouter from './src/routes/contest';
import botRouter from './src/routes/bot';

// require('dotenv').config({ path: './.env.local' });
require('dotenv').config({ path: './.env' });
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*"
  }
});

const port = process.env.PORT || 5001;

app.use(cors());
app.use(json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

sequelize
  .authenticate()
  .then((res) => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/contest', contestRouter);
app.use('/api/v1/bot', botRouter);

// app.listen(port, () => {
//   console.log(`Server is running at port: ${port}`);
// });



io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for 'chat message' events from the client
  socket.on('chat message', (message) => {
    console.log('Received message:', message.content);

    // Broadcast the received message to all connected clients, including the sender
    // Later will change it to Broadcast to only the sender and the receiver
    io.emit('chat message', message);
  });


  // Listen for 'disconnect' events from clients
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
