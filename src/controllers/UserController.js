import { Op } from 'sequelize';
import model from '../models';

const { User } = model;

export default {
  getUserDetails: async function (req, res) {
    const { id } = req?.body;

    try {
      const user = await User.findByPk(id);

      if (user) {
        return res.status(200).json({
          ...user.dataValues,
        });
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
};
