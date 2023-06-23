import express, { json } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
const http = require('http');

import authRouter from './src/routes/auth';
import userRouter from './src/routes/user';
import contestRouter from './src/routes/contest';
import botRouter from './src/routes/bot';
const chatWSServer = require('./chatWS');

// require('dotenv').config({ path: './.env.local' });
require('dotenv').config({ path: './.env' });
const app = express();

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

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});

chatWSServer.listen("5002", () => {
  console.log('chat ws server listening on 5002')
})
