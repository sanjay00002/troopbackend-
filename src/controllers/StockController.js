import model from '../models';

const { Stocks, StocksSubCategories, SubCategories } = model;

export default {
  enterStockData: async function (req, res) {
    const { name, token, exchangeType, subCategory } = req.body;

    try {
      const existSubCategory = await SubCategories.findOne({
        where: { name: subCategory },
      });

      if (!existSubCategory) {
        return res.status(400).json({
          message: 'Provided Bad Sub-Category!',
        });
      }

      const newStock = await Stocks.create({
        name,
        token,
        exchangeType,
      });

      if (newStock) {
        const stockSubCategory = await StocksSubCategories.create({
          stockId: newStock.id,
          subCategoryId: existSubCategory.id,
        });

        if (stockSubCategory) {
          return res.status(201).json(await newStock.get());
        }
      }
    } catch (error) {
      console.error('Error while entering stock data:', error);
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while entering stock data!',
      });
    }
  },

  enterBulkStockData: async function (req, res) {
    const { stocks } = req.body;

    try {
      for (let i = 0; i < stocks.length; i++) {
        const stock = stocks[i];

        const existSubCategory = await SubCategories.findOne({
          where: { name: stock.subCategory },
        });

        if (!existSubCategory) {
          return res.status(400).json({
            message: 'Provided Bad Sub-Category!',
          });
        }

        const newStock = await Stocks.create({
          name: stock.name,
          token: stock.token,
          exchangeType: stock.exchangeType,
        });

        if (newStock) {
          const stockSubCategory = await StocksSubCategories.create({
            stockId: newStock.id,
            subCategoryId: existSubCategory.id,
          });
        }
      }

      return res.status(201).json({
        message: 'Stocks Inserted successfully',
      });
    } catch (error) {
      console.error('Error while entering stock data:', error);
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while entering stock data!',
      });
    }
  },
};
