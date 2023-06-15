import { Op } from 'sequelize';
import model from '../models';

const { User } = model;

export default {
  getUserDetails: async function (req, res) {
    const { id } = req;

    try {
      const user = await User.findByPk(id);

      const result = {
        id: user.id,
        username: user.username,
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
};
