import jwt from 'jsonwebtoken';
import moment from 'moment';
import { faker } from '@faker-js/faker/locale/en_IN';
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

import { REFRESH_SECRET } from '../utils/settings';
import { generateReferralCode } from '../lib/referralCode';

import { generateOtp, verifyOTP } from '../lib/verifyOtp';

import model from '../../../database/models';
import JWTController from './JWTController';

const { User, UserRole, Role, Wallet } = model;

export default {

	checkUniqueness: async (req, res) => {
		try {
		  const userDetails = req.body;
	  
		  // Assuming you have a database model named User for user details
		  const existingUser = await User.findOne({
			where: {
			  [Op.or]: [
				{ username: userDetails.username },
				{ phoneNumber: userDetails.phoneNumber },
			  ],
			},
		  });
	  
		  console.log(existingUser);
	  
		  if (existingUser) {
			// User with the same username or phone number already exists
			return res.status(400).json({ error: 'Username or phone number is not unique' });
		  } else {
			// User details are unique
			return res.status(200).json({ message: 'Details are unique' });
		  }
		} catch (error) {
		  console.error('Error checking uniqueness:', error);
		  return res.status(500).json({ error: 'Internal server error' });
		}
	  },

	signUp: async (req, res) => {
		const userDetails = req.body;

		try {
			let newUser;
			let role;

			// Verified User i.e. signs up with phone number
			if (userDetails?.phoneNumber !== undefined && userDetails?.phoneNumber) { //if phone number is there
				const referralCode = await generateReferralCode();

				if (!userDetails?.firstName || !userDetails?.lastName) {
					return res
						.status(400)
						.json({ message: 'Please provide first & last name!' });
				}

				newUser = await User.create({
					username: userDetails?.username,
					phoneNumber: userDetails?.phoneNumber,
					email: userDetails?.email,
					gender: userDetails?.gender,
					dob: userDetails?.dob,
					firstName: userDetails?.firstName,
					lastName: userDetails?.lastName,
					profileImage: userDetails?.profileImage,
					referralCode: referralCode,
					referrer: userDetails?.referrer,
					referredAt: userDetails?.referrer ? moment().toISOString() : null,
					isBot: false,
					appCoins: 0,
				});

				role = await Role.findOne({
					where: { role: 'user' },
				});
			} else {
				// Unverified User i.e. Guest
				newUser = await User.create({
					username: userDetails.username,
					appCoins: 500
				});

				role = await Role.findOne({
					where: { role: 'guest' },
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

      const bonusCoins = 25;
      newUser.bonusCoins = bonusCoins;

			await newUser.save();

			const roleId = await role?.get('id');

			await UserRole.create({
				userId: newUserId,
				roleId: roleId,
			});

			// * Create a new wallet for the new user
			await Wallet.create({
				userId: newUserId,
			});

			return res.status(200).json({
				id: newUserId,
				accessToken,
				refreshToken,
			});
		} catch (error) {
			console.error('Some error: ', error);
			return res.status(500).json({
				errorMessage: error?.errors?.map((error) => error.message),
				error: 'Something went wrong while signing up the user',
			});
		}

		// res.send("hi")


	},


	guestSignUp: async function (req, res) {
		const userDetails = req.body;
		const uuid = uuidv4();
		try {
			let newUser;
			const referralCode = await generateReferralCode();

			newUser = await User.create({
				username: "Guest_" + uuid,
				referralCode: referralCode,
				isBot: false,
				profileImage: userDetails?.profileImage,
			})
			const newUserId = await newUser.id;
			console.log()
			// Generate Tokens for the user
			const { accessToken, refreshToken } = await JWTController.createToken(
				{ id: newUserId },
				true,
			);
			return res.status(201).json({
				id: newUserId,
				accessToken,
				refreshToken,
			});

		} catch (error) {
			console.error('Some error: ', error);
			return res.status(500).json({
				errorMessage: error?.errors?.map((error) => error.message),
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

	signInWithPhoneNumber: async function (req, res) {
		const { phoneNumber } = req.body;

		try {
			if (phoneNumber.includes('+')) {
				const user = await User.findOne({
					where: { phoneNumber },
				});

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
					return res.status(404).json({
						message: "User doesn't exists with the given phone number",
					});
				}
			} else {
				return res
					.status(400)
					.json({ message: 'Please provide the country code!' });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				errorMessage: error?.message,
				error:
					'Something went wrong while signing in the user with phone number',
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

					// * If user wasn't found
					if (foundUser) {
						const refreshTokenDB = (await foundUser.get('isBot'))
							? await JWTController.hashToken(
								await foundUser.get('refreshToken'),
							)
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
								await foundUser.update({
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
								refreshToken: newRefreshToken,
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


	generateMobileOtp: async function (req, res) {
		const { phoneNumber } = req.body;
		try {
			if (
				phoneNumber &&
				phoneNumber?.includes('+') &&
				phoneNumber?.length > 10
			) {
				const twilioResp = await generateOtp(phoneNumber, 'sms');

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
			console.error('Error while generating mobile OTP: ', error);
			return res.status(500).json({
				errorMessage: error?.message,
				error: 'Something went wrong while generating the mobile OTP',
			});
		}
	},

	generateEmailOtp: async function (req, res) {
		const { email } = req.body;
		try {
			if (email && email?.includes('@')) {
				const twilioResp = await generateOtp(email, 'email');

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
				return res.status(422).status.json({
					error: 'Provided a bad phone number!',
				});
			}
		} catch (error) {
			console.error('Error while generating email OTP: ', error);
			return res.status(500).json({
				errorMessage: error?.message,
				error: 'Something went wrong while generating the email OTP',
			});
		}
	},

	verifyOtp: async function (req, res) {
		const { credential, code } = req.body;
		try {
			const twilioResp = await verifyOTP(credential, code);
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
