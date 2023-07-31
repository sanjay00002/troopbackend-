import { Op } from 'sequelize';
import models from '../models';

const { Winnings, CrateCategories, Rewards } = models;

export default {
  getWinningsByCrateCategory: async function (req, res) {
    const { crateCategoryId } = req.body;
    const userId = req.id;

    try {
      const existingCrateCategory = await CrateCategories.findByPk(
        crateCategoryId,
      );

      if (existingCrateCategory) {
        const winningsArr = await Winnings.findAll({
          where: {
            [Op.and]: [
              {
                crateCategoryId,
              },
              {
                userId,
              },
            ],
          },
          include: {
            model: Rewards,
            required: true,
          },
        });

        const winnings = await Promise.all([
          ...winningsArr.map(async (winning) => await winning.get()),
        ]);

        return res.status(200).json(winnings);
      } else {
        return res.status(404).json({
          message: 'Provided invalid crate category id',
        });
      }
    } catch (error) {
      console.error(
        'Error while fetching winnings by crate category for the user: ',
        error,
      );

      return res.status(500).json({
        error:
          'Something went wrong while fetching winnings by crate category for the user',
        errorMessage: error.message,
      });
    }
  },
};
