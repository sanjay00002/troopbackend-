import { generateReferralCode } from '../lib/referralCode';
import model from '../models';

const { User } = model;

export default {
  getUserById: async function (req, res) {
    const { id } = req;

    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['accessToken', 'refreshToken', 'loggedInAt'] },
      });

      const result = await user.get();

      if (user) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json({
          error: 'No User Found!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while fetching the user by ID!',
      });
    }
  },

  updateUserById: async function (req, res) {
    const userDetails = req.body;
    const userId = req.id;
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['accessToken', 'refreshToken', 'loggedInAt'] },
      });

      if (user) {
        const referralCode = await generateReferralCode();

        await user.update({
          username: userDetails?.username ?? user.username,
          phoneNumber: userDetails?.phoneNumber ?? user.phoneNumber,
          firstName: userDetails?.firstName ?? user.firstName,
          lastName: userDetails?.lastName ?? user.lastName,
          profileImage: userDetails?.profileImage ?? user.profileImage,
          referralCode:
            user.referralCode ?? userDetails?.referrer ? referralCode : null,
          referrer: user.referrer ?? userDetails?.referrer,
          referredAt:
            user?.referredAt ?? userDetails?.referrer
              ? moment().toISOString()
              : null,
        });

        const result = await user.get();

        return res.status(200).json(result);
      } else {
        return res.status(404).json({
          error: 'No User Found!',
        });
      }
    } catch (error) {}
  },
};
