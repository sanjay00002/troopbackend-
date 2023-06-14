import { Op } from 'sequelize';
import model from '../models';
import JWTController from './JWTController';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../utils/settings';

const { User } = model;

export default {
  signUp: async (req, res) => {
    const { username } = req?.body;

    try {
      const existingUser = await User.findOne({
        where: { username },
      });

      if (existingUser) {
        return res.status(422).json({
          message: 'User with the given username already exists',
        });
      }

      // Check if the username is not falsy value
      if (username) {
        const newUser = await User.create({
          username,
        });

        if (newUser.get('id')) {
          return res.status(201).json({
            id: newUser.get('id'),
            message: 'Account Created Successfully',
          });
        }
      } else {
        return res.status(400).json({ message: 'Provided a bad username' });
      }
    } catch (error) {
      return res.status(500).json({
        errorMessage: error?.message,
        error: 'Something went wrong while creating the user',
      });
    }
  },

  signIn: async function (req, res) {
    const { username } = req?.body;

    try {
      const user = await User.findOne({
        where: { username: username },
      });

      console.log('User: ', user);

      if (user) {
        const userId = user.get('id');

        const { accessToken, refreshToken } = await JWTController.createToken(
          { id: userId },
          true,
        );

        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const accessTokenHash = await bcrypt.hash(accessToken, salt);
        const refershTokenHash = await bcrypt.hash(refreshToken, salt);

        user.accessToken = accessTokenHash;
        user.refreshToken = refershTokenHash;
        user.loggedInAt = new Date().toISOString();

        await user.save();

        console.log('Saved', user);

        return res.status(200).json({
          id: user?.get('id'),
          accessToken,
          refreshToken,
        });
      } else {
        return res.status(400).json({ message: 'Provided a bad username' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        errorMessage: error?.message,
        error: 'Something went wrong while signing in the user',
      });
    }
  },

  refreshToken: async function (req, res) {
    try {
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        errorMessage: error?.message,
        error: 'Something went wrong while refreshing the token',
      });
    }
  },
};
