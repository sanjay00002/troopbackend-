import { Op } from 'sequelize';
import model from '../../../database/models';
import { validatePortfolio } from '../lib/portfolio';

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
    const { id, name, stocks } = req.body;

    try {
      validatePortfolio(stocks);

      const portfolio = await Portfolio.findByPk(id, {
        include: {
          model: PortfolioStocks,
          required: true,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      });

      if (portfolio) {
        const portfolioStocks = await portfolio.get('portfolioStocks');

        for (let index = 0; index < portfolioStocks.length; index++) {
          const newPortfolioStocks = stocks[index];
          portfolioStocks[index].stockId = newPortfolioStocks.stockId;
          portfolioStocks[index].action = newPortfolioStocks.action;
          portfolioStocks[index].captain = newPortfolioStocks.captain;
          portfolioStocks[index].viceCaptain = newPortfolioStocks.viceCaptain;
        }

        for (let index = 0; index < portfolioStocks.length; index++) {
          const portfolioStock = portfolioStocks[index];
          await PortfolioStocks.update(
            {
              stockId: portfolioStock.stockId,
              action: portfolioStock.action,
              captain: portfolioStock.captain,
              viceCaptain: portfolioStock.viceCaptain,
            },
            {
              where: {
                id: portfolioStock.id,
                portfolioId: portfolioStock.portfolioId,
              },
            },
          );
        }

        await portfolio.update({
          name,
        });

        return res.status(204).json({
          message: 'Portfolio Updated Successfully!',
        });
      } else {
        return res.status(404).json({
          message: 'Provided a bad portfolio id!',
        });
      }
    } catch (error) {
      console.error('Error while updating portfolio by id: ', error);
      return res.status(500).json({
        error: 'Something went wrong while updating portfolio by id',
        errorMessage: error.message,
      });
    }
  },
};
