import express, { json } from 'express';
import cors from 'cors';
// const mongoose = require('mongoose');
import { Sequelize } from 'sequelize';

import userRouter from './src/routes/user';

require('dotenv').config({ path: './.env.local' });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(json());

// const uri =
//   'mongodb+srv://troop:troop@cluster0.aljji9z.mongodb.net/?retryWrites=true&w=majority';

// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', function () {
//   console.log('Connected successfully');
// });

const sequelize = new Sequelize(process.env.DATABASE_URL);

sequelize
  .authenticate()
  .then((res) => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// const contestRouter = require('./Routes/Contest');

// app.use('/contests' , contestRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
