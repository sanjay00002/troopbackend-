import { Op } from 'sequelize';
import model from '../models';

const { User, Profile } = model;

export default {
  getUserById: async function (req, res) {
    const { id } = req;

    try {
      const user = await User.findByPk(id);

      const result = {
        id: user.id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.firstName,
        profileImage: user.profileImage,
        referralCode: user.referralCode,
        referrer: user.referrer,
        referredAt: user.referredAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
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

  getProfileByUserId: async function (req, res) {
    const { id } = req;

    try {
      const user = await User.findByPk(id);

      const profile = await Profile.findOne({
        where: { userId: id },
      });

      if (profile) {
        const result = { username: user.username, ...(await profile.get()) };

        return res.status(200).json(result);
      } else {
        return res.status(404).json({
          error: 'No Profile Found!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while fetching the profile of user by ID!',
      });
    }
  },

};
