const mongoose = require('mongoose');
const sequelize = require('sequelize');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    otp: String,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
