const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  'mongodb+srv://troop:troop@cluster0.aljji9z.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

// const contestRouter = require('./Routes/Contest');
const userRouter = require('./routes/user');

// app.use('/contests' , contestRouter);
app.use('/user', userRouter);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
