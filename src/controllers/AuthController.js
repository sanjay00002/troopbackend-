import { Op } from 'sequelize';
import model from '../models';
import JWTController from './JWTController';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS, SECRET } from '../utils/settings';
import jwt from 'jsonwebtoken';

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
      const refreshToken = req.headers['authorization'].split(' ')[1];

      /*
       *  Verify the Token
       *  If valid token:
       *    - Fetch the user with id present in the token
       *    - Compare the token in the DB with the one recieved // An extra check
       *    - If matches:
       *      - Create a new access & refresh tokens
       *      - Hash and store it into the DB
       *      - Send the tokens as a response
       *    - Else: // Token Reuse situation | Valid Token getting reused
       *      - Try to fetch the user with the id present in the token i.e. the hacked user
       *      - If user found:
       *        - Reset the refresh and access Tokens in the DB for the hacked user
       *        - Now user needs to login again
       *        - Return 403 response
       *      - Else: // Attacker tried to get tokens for non-existing user
       *        - Return 403 response
       *  Else: // Token Reuse situation but wasn't verified | Non-valid token getting reused
       *    - Return 403 response, unauthorized access
       */
      await jwt.verify(refreshToken, SECRET, async (error, decoded) => {
        if (!error) {
          const foundUser = await User.findByPk(decoded?.id);
          console.log('User: ', foundUser);

          const isValidRefreshToken = await bcrypt.compare(
            refreshToken,
            foundUser.get('refreshToken'),
          );

          if (isValidRefreshToken) {
            const { newAccessToken, newRefreshToken } =
              await JWTController.createToken(
                { id: foundUser.get('id') },
                true,
              ).then((tokens) => ({
                newAccessToken: tokens.accessToken,
                newRefreshToken: tokens.refreshToken,
              }));

            console.log('New: ', newAccessToken, newRefreshToken);

            const salt = await bcrypt.genSalt(SALT_ROUNDS);
            const accessTokenHash = await bcrypt.hash(newAccessToken, salt);
            const refershTokenHash = await bcrypt.hash(newRefreshToken, salt);

            foundUser.accessToken = accessTokenHash;
            foundUser.refreshToken = refershTokenHash;

            await foundUser.save();

            return res.status(200).json({
              accessToken: newAccessToken,
              refershToken: newRefreshToken,
            });
          } else {
            // Refresh Token Reuse
            // Hacked User
            const hackedUser = await User.findByPk(decoded?.id);

            if (hackedUser) {
              await hackedUser.update({
                accessToken: null,
                refreshToken: null,
              });

              return res.status(403).json({ error: 'Permission Denied' });
            } else {
              return res.sendStatus(403);
            }
          }
        } else {
          return res
            .status(403)
            .json({ message: 'Refresh Token Invalid!', error });
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        errorMessage: error?.message,
        error: 'Something went wrong while refreshing the token',
      });
    }
  },
};
