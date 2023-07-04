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
import walletRouter from './src/routes/wallet'

// const createContest = require('./src/socketfiles/createContest');
// const joinContest = require('./src/socketfiles/joinContest');
// const currentUserCount = require('./src/socketfiles/currentUserCount');
// const connectSmartApi = require('./src/socketfiles/connectStock').default;
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

const normalContest = io.of('/normalContest');

normalContest.on('connection', (socket) => {
  // socket connection when from client side create contest is triggered
  socket.on('create-contest', (response) => {
    createContest(socket, response, pool);
  });

  // socket connection when new users join the contest
  socket.on('join-contest', (response) => {
    joinContest(socket, pool, response);
  });

  // socket connection to show the live contest joined users
  socket.on('user-count', (contests) => {
    currentUserCount(socket, pool, contests.contest1);
    currentUserCount(socket, pool, contests.contest2);
  });
});

// Creating a namespace for handling all the socket connections for live econtests

const liveContest = io.of('/liveContest');

liveContest.on('connection', (socket) => {
  // console.log("Live contest socket connected");
  socket.on('payment-done',()=>{
    console.log("Payment Done waiting period starts ....");
  })

  socket.on('contest-session-joined',()=>{
    console.log("User joined the session");
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


io.adapter(createAdapter(pool));
// server started using socket rather than express
httpServer.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});