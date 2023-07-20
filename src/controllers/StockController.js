import model from '../models';

const { Stocks, StocksSubCategories, SubCategories, Portfolio, PortfolioStocks } = model;

const getStock = require('../../Stock-socket/getStocks');

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
  updatePrices: async function (req, res) {
    const token_list = [];
    const stocks = await Stocks.findAll();

    stocks.forEach((stock) => {
      token_list.push(stock.token);
    });

    try {
      const stock_data = await getStock('io', 'socket', token_list, false);

      for (const stock of stock_data) {
        const stockrow = await Stocks.findOne({
          where: { token: stock.token.replace(/\D/g, '') },
        });
        if (stockrow) {
          await stockrow.update({
            open_price: stock.open_price_day,
            close_price: stock.close_price, 
          });
        }
      }

      const portfs = await Portfolio.findAll()
      for(const port of portfs){
        const portStocks = await PortfolioStocks.findAll({
          where: {portfolioId: port.id}
        })

        var score = 0;
        for(const portStock of portStocks){
          const stock = await Stocks.findOne({
            where:{ id: portStock.stockId}
          })

          var stock_value = stock.close_price - stock.open_price
          if(stock_value > 0){
            if(portStock.action === 'Buy'){        
              if(portStock.captain){
                score += 2*stock_value/stock.open_price;
              }else if(portStock.viceCaptain){
                score += 1.5*stock_value/stock.open_price;
              }else{
                score += stock_value/stock.open_price;
              }      
            }

            if(portStock.action === 'Sell'){
              if(portStock.captain){
                score -= 2*stock_value/stock.open_price;
              }else if(portStock.viceCaptain){
                score -= 1.5*stock_value/stock.open_price;
              }else{
                score -= stock_value/stock.open_price;
              }      
            }
          }else{
            if(portStock.action === 'Buy'){
              if(portStock.captain){
                score -= 2*stock_value/stock.open_price;
              }else if(portStock.viceCaptain){
                score -= 1.5*stock_value/stock.open_price;
              }else{
                score -= stock_value/stock.open_price;
              }      
            }

            if(portStock.action === 'Sell'){
              if(portStock.captain){
                score += 2*stock_value/stock.open_price;
              }else if(portStock.viceCaptain){
                score += 1.5*stock_value/stock.open_price;
              }else{
                score += stock_value/stock.open_price;
              }      
            }
          }
        }
        score = score*100/portStocks.length

        await port.update({
          score: score
        })
      }

      return res.status(200).json({
        message: 'Stock Data Updated and scores calculated Successfully',
      });
    } catch (error) {
      console.error('Error while fetching stock data:', error);
    }
  },
};
