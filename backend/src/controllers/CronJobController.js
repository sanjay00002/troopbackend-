import { Op, Sequelize } from 'sequelize';
import model from '../../../database/models';
import moment from 'moment';
import momentTimezone from 'moment-timezone';

import getStocks from '../../Stock-socket/getStocks';
import { getAllOffers } from '../api/rewards/rewards';
import { getAllCoupons } from '../api/rewards/coupons';
import client from '../api/client';
import axios from 'axios';

const {
  ContestCategories,
  Contest,
  ContestPriceDistribution,
  ContestWinners,
  ContestParticipants,
  ContestPortfolios,
  Portfolio,
  PortfolioStocks,
  User,
  StocksSubCategories,
  Stocks,
  SubCategories,
  CouponRewards,
  Rewards,
} = model;

export default {
  createContest: async function (userId, contest) {
    try {
      console.log('CContest', contest);
      const subCategory = await SubCategories.findByPk(contest?.subCategoryId);

      // * Check if the sub category provided exists
      if (subCategory) {
        const newContest = await Contest.create({
          name: contest?.name,
          date: contest?.date,
          entryAmount: contest?.entryAmount,
          categoryId: contest?.categoryId,
          subCategoryId: subCategory.id,
          pricePool: contest?.pricePool,
          createdBy: userId,
          slots: contest?.slots,
          isActive: true,
          canJoin: true,
        });

        const newContestId = await newContest.get('id');

        if (newContestId) {
          // console.log("new contestId incoming");
          if (contest?.priceDistribution) {
            // console.log("priceDistribution running");
            for (let i = 0; i < contest?.priceDistribution?.length; i++) {
              const currentDistribution = contest.priceDistribution[i];

              if (!currentDistribution.hasOwnProperty('originalPricePool')) {
                await ContestPriceDistribution.create({
                  contestId: newContestId,
                  rankStart: currentDistribution.rankStart,
                  rankEnd: currentDistribution.rankEnd,
                  priceAmount: parseFloat(currentDistribution.priceAmount),
                });
              }
            }
          }
        } else {
          throw new Error(
            'Cannot create contest without non-existing sub-category!',
          );
        }
      }
    } catch (error) {
      console.error('Error while creating contest with CRON job: ', error);
    }
  },

  // updateStockPrices: async function () {
  //   try {
  //     let start = performance.now();

  //     const token_list = [];
  //     const stocks = await Stocks.findAll();

  //     stocks.forEach((stock) => {
  //       token_list.push(stock.token);
  //     });

  //     const stock_data = await getStocks('io', 'socket', token_list, false);
  //     // console.log('hello')

  //     const stockPricesToBeUpdated = [];

  //     for (const stock of stock_data) {
  //       stockPricesToBeUpdated.push({
  //         token: stock.token.replace(/\D/g, ''),
  //         open_price: stock.open_price_day,
  //         close_price: stock.close_price,
  //       });
  //     }

  //     const stockTokens = stockPricesToBeUpdated.map(
  //       (stock) => stock.token,
  //     );

  //     // * Bulk Updating the stock prices
  // const updatePromises = stockPricesToBeUpdated.map((stock) =>
  //     Stocks.update(
  //       {
  //         open_price: stock.open_price,
  //         close_price: stock.close_price,
  //       },
  //       {
  //         where: { token: stock.token },
  //       }
  //     )
  //   );

  //   Promise.all(updatePromises).then((results) => {
  //     const updatedRows = results.reduce((sum, affectedRows) => sum + affectedRows, 0);
  //     console.log(`${updatedRows} Stock Prices updated`);

  //     const timeEnd = performance.now() - start;
  //     console.log('Time taken: ', timeEnd);
  //   });
  //   } catch (error) {
  //   console.error('Error while updating stock data:', error);
  //   }
  //   // console.log("update2")
  // },

  updateStockPrices: async function () {
    try {
      let start = performance.now();

      const token_list = [];
      const stocks = await Stocks.findAll();

      stocks.forEach((stock) => {
        token_list.push(stock.zerodhaInstrumentToken);
      });

      const response = await axios.post(
        'https://redis-stocks-server.onrender.com/api/getStockLTP',
        {
          stockInstrumentArray: token_list,
        },
      );

      console.log(response.data);

      const stockPricesToBeUpdated = response.data;

      const updatePromises = stockPricesToBeUpdated.map((stockData) => {
        const token = Object.keys(stockData)[0];
        const open_price = parseFloat(stockData[token]);

        return Stocks.update(
          {
            open_price: open_price,
          },
          {
            where: { zerodhaInstrumentToken: token },
          },
        ).catch((updateError) => {
          console.error(
            `Error updating stock with token ${token}:`,
            updateError,
          );
          return 0; // Treat the failed update as 0 affected rows
        });
      });

      Promise.all(updatePromises).then((results) => {
        const updatedRows = results.reduce(
          (sum, affectedRows) => sum + affectedRows,
          0,
        );
        console.log(`${updatedRows} Stock Prices updated`);

        const timeEnd = performance.now() - start;
        console.log('Time taken: ', timeEnd);
      });
    } catch (error) {
      console.error(
        'Error while updating stock data:',
        error.response.status,
        error.response.data,
      );
    }
  },
  updateStockClosePrices: async function () {
    try {
      let start = performance.now();

      const token_list = [];
      const stocks = await Stocks.findAll();

      stocks.forEach((stock) => {
        token_list.push(stock.zerodhaInstrumentToken);
      });

      const response = await axios.post(process.env.STOCKS_PRICE_API_LINK, {
        stockInstrumentArray: token_list,
      });

      console.log(response.data);

      const stockPricesToBeUpdated = response.data;

      const updatePromises = stockPricesToBeUpdated.map((stockData) => {
        const token = Object.keys(stockData)[0];
        const close_price = parseFloat(stockData[token]);

        return Stocks.update(
          {
            close_price: close_price,
          },
          {
            where: { zerodhaInstrumentToken: token },
          },
        ).catch((updateError) => {
          console.error(
            `Error updating stock with token ${token}:`,
            updateError,
          );
          return 0; // Treat the failed update as 0 affected rows
        });
      });

      Promise.all(updatePromises).then((results) => {
        const updatedRows = results.reduce(
          (sum, affectedRows) => sum + affectedRows,
          0,
        );
        console.log(`${updatedRows} Stock Prices updated`);

        const timeEnd = performance.now() - start;
        console.log('Time taken: ', timeEnd);
      });
    } catch (error) {
      console.error(
        'Error while updating stock data:',
        error.response.status,
        error.response.data,
      );
    }
  },

  calculatePortfolioScore: async function () {
    try {
      let start = performance.now();
      const today = momentTimezone.tz(moment(), 'Asia/Kolkata');
      const formattedDate = today.format('YYYY-MM-DD');

      const allContestPortfolios = await ContestPortfolios.findAll({
        include: [
          {
            model: Contest,
            required: true,
            attributes: [],
            where: {
              date: {
                [Op.eq]: formattedDate,
              },
            },
          },
          {
            model: Portfolio,
            required: true,
          },
        ],
      });

      if (allContestPortfolios.length > 0) {
        for (const contestPortfolio of allContestPortfolios) {
          const portfolioStocks = await PortfolioStocks.findAll({
            where: {
              portfolioId: contestPortfolio.portfolioId,
            },
            include: {
              model: Stocks,
              required: true,
            },
          });

          let score = 0;
          for (const portfolioStock of portfolioStocks) {
            const stock = portfolioStock.stock;

            let stockValue = stock.close_price - stock.open_price;

            switch (portfolioStock.action) {
              case 'Buy':
                if (portfolioStock.captain) {
                  score =
                    stockValue > 0
                      ? score + (2 * stockValue) / stock.open_price
                      : score - (2 * stockValue) / stock.open_price;
                } else if (portfolioStock.viceCaptain) {
                  score =
                    stockValue > 0
                      ? score + (1.5 * stockValue) / stock.open_price
                      : score - (1.5 * stockValue) / stock.open_price;
                } else {
                  score =
                    stockValue > 0
                      ? score + stockValue / stock.open_price
                      : score - stockValue / stock.open_price;
                }
                break;
              case 'Sell':
                if (portfolioStock.captain) {
                  score =
                    stockValue > 0
                      ? score - (2 * stockValue) / stock.open_price
                      : score + (2 * stockValue) / stock.open_price;
                } else if (portfolioStock.viceCaptain) {
                  score =
                    stockValue > 0
                      ? score - (1.5 * stockValue) / stock.open_price
                      : score + (1.5 * stockValue) / stock.open_price;
                } else {
                  score =
                    stockValue > 0
                      ? score - stockValue / stock.open_price
                      : score + stockValue / stock.open_price;
                }
                break;
              default:
                break;
            }
          }
          console.log('Score: ', score);
          score = (score * 100) / portfolioStocks.length;

          console.log(
            `Score for Portfolio Id: ${contestPortfolio.portfolioId}:- ${score}`,
          );

          await contestPortfolio.portfolio.update({
            score: score,
          });
        }
      }

      let timeEnd = performance.now() - start;
      console.log('Execution time: ', timeEnd);
    } catch (error) {
      console.error('Error while calculating portfolio scores: ', error);
    }
  },
  // generateWinners: async function () {
  //   try {
  //     const today = momentTimezone.tz(moment(), 'Asia/Kolkata');
  //     const formattedDate = today.format('YYYY-MM-DD');

  //     const contests = await Contest.findAll({
  //       where: {
  //         date: formattedDate,
  //       },
  //       include: [
  //         {
  //           model: Portfolio,
  //           through: ContestPortfolios,
  //           order: [[Portfolio, 'score', 'DESC']],
  //         },
  //       ],
  //     });

  //     console.log('Contest in generate WInners: ', contests[0]);

  //     for (let index = 0; index < contests.length; index++) {
  //       const contest = contests[index];
  //       // ! Not checking if there are already winners declared for the contest since its a CRON job

  //       let totalParticipants = contest.portfolios.length;

  //       console.log('Total Participants: ', totalParticipants);
  //       let rank = 0;
  //       let prevScore = -1; // * To check if 2 or more portfolio's have the same score

  //       for (const portfolio of contest.portfolios) {
  //         if (prevScore !== portfolio.score) {
  //           prevScore = portfolio.score;
  //           rank += 1;
  //         }

  //         await ContestWinners.create({
  //           contestId: contest.id,
  //           userId: portfolio.userId,
  //           rank: rank,
  //         });

  //         // * Update Ticket count
  //         if (rank / totalParticipants <= 0.75) {
  //           await User.increment(['tickets'], {
  //             where: {
  //               id: portfolio.userId,
  //             },
  //           });
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error while generating winners for all the today's contest: ",
  //       error,
  //     );
  //   }
  // },

  generateWinners: async function () {
    try {
      const today = moment.tz(moment(), 'Asia/Kolkata');
      const formattedDate = today.format('YYYY-MM-DD');
  
      const contests = await Contest.findAll({
        where: {
          date: formattedDate,
        },
      });
  
      for (const contest of contests) {
        const contestId = contest.id;
  
        const portfolioData = await Portfolio.findAll({
          where: {
            contestId: contestId,
          },
          order: [['score', 'DESC']], // Sort by score in descending order
        });
  
        if (portfolioData.length === 0) {
          console.log('No participants for this contest. Skipping winner generation.');
          continue;
        }
        console.log('Total Participants: ', portfolioData.length);

        const prizeDistribution = await ContestPriceDistribution.findAll({
          attributes: ['contestId', 'rankStart', 'rankEnd', 'priceAmount'],
          where: {
            contestId: contestId,
          },
        });
            // console.log(JSON.stringify(prizeDistribution))

        let rank = 0;
        let prevScore = -1; // To check if 2 or more portfolios have the same score
  
        for (const portfolio of portfolioData) {
          if (prevScore !== portfolio.score) {
            prevScore = portfolio.score;
            rank += 1;
          }

          const prizeInfo = prizeDistribution.find(
            (prize) => rank >= prize.rankStart && rank <= prize.rankEnd
        );

        if (prizeInfo) {
            const priceAmount = prizeInfo.priceAmount;
            console.log(`User ${portfolio.userId} won ${priceAmount} for rank ${rank}`);
        }
            await ContestWinners.create({
            contestId: contest.id,
            userId: portfolio.userId,
            rank: rank,
            winningAmount: prizeInfo.priceAmount,
            username: portfolio.username
          });
  
          // Update Ticket count
          if (rank / portfolioData.length <= 0.75) {
            await User.increment(['tickets'], {
              where: {
                id: portfolio.userId,
              },
            });
          }
          
          const user = await User.findByPk(portfolio.userId);
          const currentAppCoins = user.appCoins;
          const currentWinningCoins = user.winningsAmount
          const newWinningCoins = currentWinningCoins + prizeInfo.priceAmount
          const newAppCoins = currentAppCoins + prizeInfo.priceAmount



          // console.log(newAppCoins)

          await User.update(
            { appCoins: newAppCoins },
            {winningsAmount: newWinningCoins},
            {
              where: {
                id: portfolio.userId,
              },
            }
          );

        }
    
      }
    } catch (error) {
      console.error("Error while generating winners for all today's contests: ", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
  

  insertNewCoupons: async function () {
    try {
      let start = performance.now();

      const newCoupons = await getAllCoupons();
      const updatedLength = newCoupons?.length,
        couponsToInsert = [],
        currentTimestamp = momentTimezone.tz(moment(), 'Asia/Kolkata');

      if (updatedLength && updatedLength > 0) {
        // * Truncate the table
        console.log('TRUNCATING TABLE!!!!');

        await CouponRewards.destroy({
          where: {},
          hooks: false,
          truncate: true,
          cascade: true,
        });

        for (let index = 0; index < updatedLength; ++index) {
          const coupon = newCoupons[index];

          couponsToInsert.push({
            id: coupon.coupon_id,
            merchantId: coupon.merchant_id,
            title: coupon.title,
            description: coupon.description,
            discount: coupon.discount,
            couponCode: coupon.coupon_code,
            plainLink: coupon.plain_link,
            minPurchase: coupon.min_purchase,
            maxDiscount: coupon.max_discount,
            terms: coupon.terms,
            startDate: coupon.start_date
              ? moment(coupon.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
              : null,
            endDate: coupon.end_date
              ? moment(coupon.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
              : null,
            affiliateLink: coupon.affiliate_link,
            merchantLogo: coupon.merchant_logo,
            merchantName: coupon.merchant_name,
            createdAt: currentTimestamp.toISOString(),
            updatedAt: currentTimestamp.toISOString(),
          });
        }

        const chunkSize = 50,
          dataLength = couponsToInsert.length;

        for (let i = 0; i < dataLength; i += chunkSize) {
          const chunk = couponsToInsert.slice(i, i + chunkSize);
          await CouponRewards.bulkCreate(chunk, {
            validate: true,
            individualHooks: true,
          });

          console.log('Chunk inserted: ', chunk.length);
        }
      }

      let end = performance.now() - start;
      console.log(
        'Time taken for truncating & inserting all the coupons: ',
        end,
      );
    } catch (error) {
      console.error('Error while inserting coupons: ', error);
    }
  },

  insertNewOffers: async function () {
    try {
      let start = performance.now();

      const newOffers = await getAllOffers();
      const updatedLength = newOffers?.length,
        offersToInsert = [],
        currentTimestamp = momentTimezone.tz(moment(), 'Asia/Kolkata');

      if (updatedLength && updatedLength > 0) {
        // * Truncate the table
        console.log('TRUNCATING TABLE!!!!');

        await Rewards.destroy({
          where: {},
          hooks: false,
          truncate: true,
          cascade: true,
        });

        for (let index = 0; index < updatedLength; ++index) {
          const offer = newOffers[index];

          offersToInsert.push({
            id: offer.coupon_id,
            merchantId: offer.merchant_id,
            title: offer.title,
            description: offer.description,
            discount: offer.discount,
            plainLink: offer.plain_link,
            minPurchase: offer.min_purchase,
            maxDiscount: offer.max_discount,
            terms: offer.terms,
            startDate: offer.start_date
              ? moment(offer.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
              : null,
            endDate: offer.end_date
              ? moment(offer.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
              : null,
            affiliateLink: offer.affiliate_link,
            merchantLogo: offer.merchant_logo,
            merchantName: offer.merchant_name,
            createdAt: currentTimestamp.toISOString(),
            updatedAt: currentTimestamp.toISOString(),
          });
        }

        const chunkSize = 50,
          dataLength = offersToInsert.length;

        for (let i = 0; i < dataLength; i += chunkSize) {
          const chunk = offersToInsert.slice(i, i + chunkSize);
          await Rewards.bulkCreate(chunk, {
            validate: true,
            individualHooks: true,
          }).catch((error) => console.log('Error in Bulk Create: ', error));

          console.log('Chunk inserted: ', chunk.length);
        }
      }

      let end = performance.now() - start;
      console.log(
        'Time taken for truncating & inserting all the offers: ',
        end,
      );
    } catch (error) {
      console.error('Error while inserting offers: ', error);
    }
  },

  closeAllContestEntry: async function () {
    try {
      console.log('Closing all contest entry');
      const today = momentTimezone.tz(moment(), 'Asia/Kolkata');
      const allContests = await Contest.update(
        {
          canJoin: false,
        },
        {
          where: {
            date: today,
          },
        },
      );
    } catch (error) {
      console.log('Error closing all contests entry:  ', error);
    }
  },

  closeAllContests: async function () {
    try {
      const today = momentTimezone.tz(moment(), 'Asia/Kolkata');
      console.log('today is:  ');
      const allContests = await Contest.update(
        {
          isActive: false,
        },
        {
          where: {
            date: today,
          },
        },
      );
    } catch (error) {
      console.log('Error closing all contests for the day:  ', error);
    }
  },
};
