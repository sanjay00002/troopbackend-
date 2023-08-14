require('@babel/register')({
  rootMode: 'upward',
});

import { Server } from 'socket.io';
import { Pool } from 'pg';
import { createAdapter } from '@socket.io/postgres-adapter';

import getStocks from './stockSocket/getStocks';

import chat from './handlers/chatWS';
import joinLiveContest from './handlers/joinLiveContest';
import currentUserCount from './handlers/currentUserCount';
import findMatch from './handlers/findMatch';

const io = new Server({
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
  chat(io);
  console.log('Connection Established!');
  socket.on('send-stock-tokens', (stock_token) => {
    getStocks(io, socket, stock_token, true);
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
  socket.on('triggered', () => {
    console.log('Slot Machine triggered');
  });
});

io.adapter(createAdapter(pool));

io.listen(5001);
