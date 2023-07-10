import { Op } from 'sequelize';
import model from '../models';

const { Portfolio, PortfolioStocks } = model;

export default {
  fetchPortfoliosBySubCategory: async function (req, res) {
    const userId = req.id;
    const { subCategoryId } = req.body;
    /**
     * Fetch all the portfolios for that user and subCategory
     */
    try {
      const portfolios = await Portfolio.findAll({
        where: {
          [Op.and]: [
            {
              userId,
            },
            { subCategoryId },
          ],
        },
      });

      if (portfolios) {
        return res.status(200).json(portfolios);
      } else {
        return res.status(404).json({
          message: 'Provided bad sub category id!',
        });
      }
    } catch (error) {
      console.error(
        'Error while fetching portfolios for the sub category: ',
        error,
      );
      return res.status(500).json({
        error:
          'Something went wrong while fetching portfolios for the sub category',
        errorMessage: error.message,
      });
    }
  },

  updatePortfolioById: async function (req, res) {
    const userId = req.id;
    const { id, name, stocks } = req.body;

    try {
      console.log('Id', id);
      const portfolio = await Portfolio.findByPk(id, {
        include: {
          model: PortfolioStocks,
          require: true,
        },
      });

      return res.status(200).json(portfolio);
    } catch (error) {
      console.error('Error while updating portfolio by id: ', error);
      return res.status(500).json({
        error: 'Something went wrong while updating portfolio by id',
        errorMessage: error.message,
      });
    }
  },
};
