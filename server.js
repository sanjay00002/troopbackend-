import express, { json } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';

import authRouter from './src/routes/auth';
import userRouter from './src/routes/user';

require('dotenv').config({ path: './.env.local' });

const app = express();
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

// app.use('/contests' , contestRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
