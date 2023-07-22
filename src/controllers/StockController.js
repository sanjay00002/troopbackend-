import model from '../models';

const { Stocks, StocksSubCategories, SubCategories, Portfolio, PortfolioStocks } = model;

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
  updateStockPrices: async function(req,res){
    const token_list = []
    const stocks = await Stocks.findAll()
    stocks.forEach(stock => {
      token_list.push(stock.token)
    });

    // Assuming here we make the function call and for each token we get open and close price
    const stockData = [];
    try {
      const client = await pool.connect();
  
      // Construct the bulk update query with the CASE expression
      let updateQuery = `
        UPDATE stock_table
        SET
          open_price = (CASE token_number
                        ${Object.entries(stockData).map(([token, [openPrice]]) => `WHEN ${token} THEN ${openPrice}`).join('\n')}
                       END),
          close_price = (CASE token_number
                         ${Object.entries(stockData).map(([token, [closePrice]]) => `WHEN ${token} THEN ${closePrice}`).join('\n')}
                        END)
        WHERE token_number IN (${Object.keys(stockData).join(',')});
      `;
  
      await client.query(updateQuery);
  
      // Release the client back to the pool
      client.release();
      
      const portfolios = await Portfolio.findAll()
      try {
        const promises = portfolios.map(async (portfolio) => {
          const portfolioStocks = await PortfolioStocks.findAll({
            /* Your query options here */
            where:{}
          });
    
          // Process portfolioStocks or perform any other tasks related to each portfolio
          // ...
    
          return portfolioStocks;
        });
    
        // Wait for all the promises to resolve using Promise.all
        const results = await Promise.all(promises);
    
        // You can access the results here, which will be an array of results for each portfolio
        console.log(results);
      } catch (error) {
        console.error("Error occurred during processing portfolios:", error);
      }

    } catch (err) {
      console.error('Error during bulk update:', err);
    }
    return res.status(201).json(token_list)
  }
};
