import jwt from 'jsonwebtoken';
import moment from 'moment';

import { REFRESH_SECRET } from '../utils/settings';
import { generateReferralCode } from '../lib/referralCode';

import { verifyOTP } from '../lib/verifyOtp';
import { generateOtp } from '../lib/verifyOtp';

import model from '../models';
import JWTController from './JWTController';

const { User } = model;

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

      const accessTokenHash = await JWTController.hashToken(accessToken);
      const refreshTokenHash = await JWTController.hashToken(refreshToken);

      newUser.accessToken = accessTokenHash;
      newUser.refreshToken = refreshTokenHash;
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

        const accessTokenHash = await JWTController.hashToken(accessToken);
        const refreshTokenHash = await JWTController.hashToken(refreshToken);

        user.accessToken = accessTokenHash;
        user.refreshToken = refreshTokenHash;
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
      await jwt.verify(refreshToken, REFRESH_SECRET, async (error, decoded) => {
        if (!error) {
          const recievedRefreshTokenHash = await JWTController.hashToken(
            refreshToken,
          );

          const foundUser = await User.findOne({ where: { id: decoded?.id } });

          const refreshTokenDB = (await foundUser.get('isBot'))
            ? await JWTController.hashToken(await foundUser.get('refreshToken'))
            : await foundUser.get('refreshToken');
          console.log('Refresh Token from Req: ', recievedRefreshTokenHash);
          console.log('Refresh Token from DB: ', refreshTokenDB);

          const isValidRefreshToken =
            refreshTokenDB === recievedRefreshTokenHash;

          console.log('Is Valid refresh token: ', isValidRefreshToken);

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

            const accessTokenHash = await JWTController.hashToken(
              newAccessToken,
            );
            const refreshTokenHash = await JWTController.hashToken(
              newRefreshToken,
            );

            if (await foundUser.get('isBot')) {
              foundUser.update({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              });
            } else {
              await foundUser.update({
                accessToken: accessTokenHash,
                refreshToken: refreshTokenHash,
              });
            }

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

  generteOtp: async function (req, res) {
    const { phoneNumber } = req.body;
    try {
      if (
        phoneNumber &&
        phoneNumber?.includes('+') &&
        phoneNumber?.length > 10
      ) {
        const twilioResp = await generateOtp(phoneNumber);

        console.log('Twilio Response: ', twilioResp);

        if (
          twilioResp?.status === 'pending' &&
          twilioResp?.sendCodeAttempts?.length >= 1
        ) {
          return res.status(200).json({
            message: 'OTP Successfully Sent!',
          });
        } else {
          return res
            .status(500)
            .json({ message: 'Something bad happened while generating OTP' });
        }
      } else {
        if (!phoneNumber.includes('+')) {
          return res.status(400).json({
            message: 'Country code missing in phone number!',
          });
        }

        return res.status(422).status.json({
          error: 'Provided a bad phone number!',
        });
      }
    } catch (error) {
      console.error('Error while generating OTP: ', error);
      return res.status(500).json({
        errorMessage: error?.message,
        error: 'Something went wrong while generating the OTP',
      });
    }
  },

  verifyOtp: async function (req, res) {
    const { phoneNumber, code } = req.body;
    try {
      const twilioResp = await verifyOTP(phoneNumber, code);
      console.log('Verify Twilio Response: ', twilioResp);

      if (twilioResp?.valid && twilioResp?.status === 'approved') {
        res.status(200).json({
          message: 'Otp Verified!',
        });
      } else {
        res.status(500).json({
          message: 'Incorrect OTP!',
        });
      }
    } catch (error) {
      res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while verifying the OTP',
      });
    }
  },
};
