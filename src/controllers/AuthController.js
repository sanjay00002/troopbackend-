import { Op } from 'sequelize';
import model from '../models';

const { User } = model;

export default {
  signUp: async (req, res) => {
    const { username, phoneNumber } = req?.body;

    try {
      const existingUser = await User.findOne({
        where: { [Op.or]: [{ phoneNumber }, { username }] },
      });

      if (existingUser) {
        return res.status(422).json({
          message:
            'User with the given phone number or username already exists',
        });
      }

      // Check if the username and phoneNumber are not falsy values
      if (username && phoneNumber) {
        const newUser = await User.create({
          username,
          phoneNumber,
        });

        if (newUser.get('id')) {
          return res.status(201).json({
            id: newUser.get('id'),
            message: 'Account Created Successfully',
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: 'Provided a bad username or phoneNumber' });
      }
    } catch (error) {
      return res.status(500).json({
        errorMessage: error?.message,
        error: 'Something went wrong while creating the user',
      });
    }
  },

  signIn: async function (req, res) {
    const { id } = req?.body;

    // ! TODO: Logging in the User
    // try {
    //     const user = await User.findOne({
    //         where: {}
    //     })
    // } catch (error) {

    // }
  },
};
