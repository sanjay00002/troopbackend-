import express, { json } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';

import authRouter from './src/routes/auth';
import userRouter from './src/routes/user';
import contestRouter from './src/routes/contest';
import botRouter from './src/routes/bot';
import subCategoriesRouter from './src/routes/subCategories';
import stocksRouter from './src/routes/stocks';
import walletRouter from './src/routes/wallet';

// require('dotenv').config({ path: './.env.local' });
require('dotenv').config({ path: './.env' });

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

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/contest', contestRouter);
app.use('/api/v1/bot', botRouter);
app.use('/api/v1/sub-category', subCategoriesRouter);
app.use('/api/v1/stocks', stocksRouter);
app.use('/api/v1/wallet', walletRouter);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
