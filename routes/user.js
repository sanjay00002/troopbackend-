const router = require('express').Router();

const User = require('../models/User.model');

router.route('/create').post(async (req, res) => {
  try {
    const { username, contactNumber } = req?.body;

    const newUser = new User({ username, contactNumber });

    await newUser
      ?.save()
      .then(async (result) => {
        const query = User.where({
          username,
          contactNumber,
        });

        const currentUser = await query?.findOne();

        if (currentUser) {
          res.status(201).json({
            message: 'User Created Successfully',
            id: currentUser?.id,
          });
        }
      })
      .catch((err) => {
        console.error('Error while creating: ', err.message);
        res
          .status(500)
          .json({ error: 'Oops! Error occured while creating the new user!' });
      });
  } catch (error) {
    console.error('Error: ', error.message);
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong on the server!' });
  }
});

router.route('/').post(async (req, res) => {
  try {
    const { id } = req?.body;

    const userObj = await User.findById(id);

    const user = userObj.toJSON();

    if (user && user?._id) {
      res.status(200).json({
        ...user,
      });
    }
  } catch (error) {
    console.error('Error: ', error.message);
    res
      .status(500)
      .json({ error: 'Oops! Something went wrong on the server!' });
  }
});

module.exports = router;
