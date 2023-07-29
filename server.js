import express, { json } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRouter from './src/routes/auth';
import userRouter from './src/routes/user';
import contestRouter from './src/routes/contest';
import botRouter from './src/routes/bot';
import subCategoriesRouter from './src/routes/subCategories';
import stocksRouter from './src/routes/stocks';
import walletRouter from './src/routes/wallet';
import liveContestRouter from './src/routes/liveContest';
import bankDetailRouter from './src/routes/bankDetail';
import faqRouter from './src/routes/faq';

const findMatch = require('./src/socketfiles/findMatch');
const joinLiveContest = require('./src/socketfiles/joinLiveContest');

const currentUserCount = require('./src/socketfiles/currentUserCount');
const getStock = require('./Stock-socket/getStocks');

const { createAdapter } = require('@socket.io/postgres-adapter');
const { Pool } = require('pg');
// require('dotenv').config({ path: './.env.local' });
require('dotenv').config({ path: './.env' });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

io.on('connection', (socket) => {
  socket.on('send-stock-tokens', (stock_token) => {
    getStock(io, socket, stock_token, true);
  });
});

const normalContest = io.of('/normalContest');

normalContest.on('connection', (socket) => {
  // socket connection to show the live contest joined users
  socket.on('user-count', (contests) => {
    // here the contest id list is fetched from the frontend
    contests.forEach((contest) => {
      currentUserCount(io, socket, pool, contest);
    });
  });
});

// Creating a namespace for handling all the socket connections for live econtests

const liveContest = io.of('/liveContest');

liveContest.on('connection', (socket) => {
  // console.log("Live contest socket connected");
  socket.emit('get-socket-id', socket.id);

  socket.on('add-in-db', (user) => {
    joinLiveContest(socket, pool, user);
  });

  socket.on('find-match', (user) => {
    findMatch(io, socket, pool, user);
  });
});

const slotMachine = io.of('/slotMachine');

slotMachine.on('connection', (socket) => {
  socket.on('triggered',()=>{
    console.log('Slot Machine triggered');
  })
});

const port = process.env.PORT || 5000;

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
app.use('/api/v1/sub-category', subCategoriesRouter);
app.use('/api/v1/stocks', stocksRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/live-contest', liveContestRouter);
app.use('/api/v1/bank-detail', bankDetailRouter);
app.use('/api/v1/faq', faqRouter);

io.adapter(createAdapter(pool));
// server started using socket rather than express
httpServer.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
