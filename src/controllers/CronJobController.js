import { Op, Sequelize } from 'sequelize';
import model from '../models';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import getStocks from '../../Stock-socket/getStocks';

const {
  Contest,
  ContestPriceDistribution,
  ContestPortfolios,
  ContestWinners,
  SubCategories,
  Stocks,
  PortfolioStocks,
  Portfolio,
  User,
} = model;

export default {
  createContest: async function (userId, contest) {
    try {
      console.log('CContest', contest);
      const subCategory = await SubCategories.findByPk(contest?.subCategoryId);

      // * Check if the sub category provided exists
      if (subCategory) {
        const newContest = await Contest.create({
          date: contest?.date,
          entryAmount: contest?.entryAmount,
          categoryId: contest?.categoryId,
          subCategoryId: subCategory.id,
          pricePool: contest?.pricePool,
          createdBy: userId,
          slots: contest?.slots,
        });

        const newContestId = await newContest.get('id');

        if (newContestId) {
          if (contest?.priceDistribution) {
            for (let i = 0; i < contest?.priceDistribution?.length; i++) {
              await ContestPriceDistribution.create({
                contestId: newContestId,
                rankStart: contest?.priceDistribution[i].rankStart,
                rankEnd: contest?.priceDistribution[i].rankEnd,
                priceAmount: contest?.priceDistribution[i].priceAmount,
              });
            }
          }
        }
      } else {
        throw new Error(
          'Cannot create contest without non-existing sub-category!',
        );
      }
    } catch (error) {
      console.error('Error while creating contest with CRON job: ', error);
    }
  },

  updateStockPrices: async function () {
    try {
      let start = performance.now();

      const token_list = [];
      const stocks = await Stocks.findAll();

      stocks.forEach((stock) => {
        token_list.push(stock.token);
      });

      const stock_data = await getStocks('io', 'socket', token_list, false);

      const stockPricesToBeUpdated = [];

      for (const stock of stock_data) {
        stockPricesToBeUpdated.push({
          token: stock.token.replace(/\D/g, ''),
          open_price: stock.open_price_day,
          close_price: stock.close_price,
        });
      }

      const stockTokens = await stockPricesToBeUpdated.map(
        (stock) => stock.token,
      );

      // * Bulk Updating the stock prices
      await Stocks.update(
        {
          open_price: Sequelize.literal(
            `CASE ${stockPricesToBeUpdated
              .map(
                (stock) =>
                  `WHEN token='${stock.token}' THEN ${stock.open_price}`,
              )
              .join(' ')} END`,
          ),

          close_price: Sequelize.literal(
            `CASE ${stockPricesToBeUpdated
              .map(
                (stock) =>
                  `WHEN token='${stock.token}' THEN ${stock.close_price}`,
              )
              .join(' ')} END`,
          ),
        },
        {
          where: { token: { [Op.in]: stockTokens } },
        },
      ).then((updatedRows) =>
        console.log(`${updatedRows} Stock Prices updated`),
      );

      let timeEnd = performance.now() - start;
      console.log('Time taken: ', timeEnd);
    } catch (error) {
      console.error('Error while fetching stock data:', error);
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

  generateWinners: async function () {
    try {
      const today = momentTimezone.tz(moment(), 'Asia/Kolkata');
      const formattedDate = today.format('YYYY-MM-DD');

      const contests = await Contest.findAll({
        where: {
          date: formattedDate,
        },
        include: [
          {
            model: Portfolio,
            through: ContestPortfolios,
            order: [[Portfolio, 'score', 'DESC']],
          },
        ],
      });

      console.log('Contest in generate WInners: ', contests[0]);

      for (let index = 0; index < contests.length; index++) {
        const contest = contests[index];
        // ! Not checking if there are already winners declared for the contest since its a CRON job

        let totalParticipants = contest.portfolios.length;

        console.log('Total Participants: ', totalParticipants);
        let rank = 0;
        let prevScore = -1; // * To check if 2 or more portfolio's have the same score

        for (const portfolio of contest.portfolios) {
          if (prevScore !== portfolio.score) {
            prevScore = portfolio.score;
            rank += 1;
          }

          await ContestWinners.create({
            contestId: contest.id,
            userId: portfolio.userId,
            rank: rank,
          });

          // * Update Ticket count
          if (rank / totalParticipants <= 0.75) {
            await User.increment(['tickets'], {
              where: {
                id: portfolio.userId,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error(
        "Error while generating winners for all the today's contest: ",
        error,
      );
    }
  },
};
