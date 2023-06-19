import model from '../models';
import JWTController from './JWTController';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS, SECRET } from '../utils/settings';
import jwt from 'jsonwebtoken';
import { generateReferralCode } from '../lib/referralCode';
import moment from 'moment';

const { User, Profile } = model;

export default {
  signUp: async (req, res) => {
    const userDetails = req.body;

    try {
      let newUser;

      // Verified User i.e. signs up with phone number
      if (userDetails?.phoneNumber !== undefined && userDetails?.phoneNumber) {
        const referralCode = await generateReferralCode();

        newUser = await User.create({
          username: userDetails?.username,
          phoneNumber: userDetails?.phoneNumber,
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          profileImage: userDetails?.profileImage,
          referralCode: referralCode,
          referrer: userDetails?.referrer,
          referredAt: userDetails?.referrer ? moment().toISOString() : null,
        });
      } else {
        // Unverified User i.e. Guest
        newUser = await User.create({
          username: 'Trooper',
        });
      }

      const newUserId = await newUser?.get('id');
      // Generate Tokens for the user
      const { accessToken, refreshToken } = await JWTController.createToken(
        { id: newUserId },
        true,
      );

      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const accessTokenHash = await bcrypt.hash(accessToken, salt);
      const refershTokenHash = await bcrypt.hash(refreshToken, salt);

      newUser.accessToken = accessTokenHash;
      newUser.refreshToken = refershTokenHash;
      newUser.loggedInAt = moment().toISOString();

      await newUser.save();

      return res.status(200).json({
        id: newUserId,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error('Some error: ', error);
      return res.status(500).json({
        errorMessage: error?.message,
        error: 'Something went wrong while signing up the user',
      });
    }
  },

  signIn: async function (req, res) {
    const { id } = req?.body;

    try {
      const user = await User.findByPk(id);

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
        user.loggedInAt = moment().toISOString();

        await user.save();

        console.log('Saved', user);

        return res.status(200).json({
          id: await user?.get('id'),
          accessToken,
          refreshToken,
        });
      } else {
        return res.status(400).json({ message: 'Provided a bad user id' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        errorMessage: error?.message,
        error: 'Something went wrong while signing in the user',
      });
    }
  },

  refreshTokens: async function (req, res) {
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

          const refreshTokenDB = await foundUser.get('refreshToken');

          const isValidRefreshToken = await bcrypt.compare(
            refreshToken,
            refreshTokenDB,
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

            await foundUser.update({
              accessToken: accessTokenHash,
              refreshToken: refershTokenHash,
            });

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
          return res.status(403).json({ message: 'Refresh Token Invalid!' });
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
