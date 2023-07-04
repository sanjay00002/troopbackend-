import { Op, Sequelize } from 'sequelize';
import model from '../models';
import moment from 'moment';
import { validatePortfolio } from '../lib/portfolio';

const {
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
} = model;

export default {
  createContest: async function (req, res) {
    const contest = req.body;
    const userId = req.id;

    try {
      const user = await User.findByPk(userId);

      if (user && !user?.isBot) {
        const subCategory = await SubCategories.findByPk(
          contest?.subCategoryId,
        );

        // * Check if the sub category provided exists
        if (subCategory) {
          const newContest = await Contest.create({
            name: contest?.name,
            image: contest?.image,
            description: contest?.description,
            entryAmount: contest?.entryAmount,
            category: contest?.category,
            subCategoryId: subCategory.id,
            pricePool: contest?.pricePool,
            createdBy: userId,
            slots: contest?.slots,
            startTime: contest?.startTime,
            endTime: contest?.endTime,
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

            const priceDistribution = await ContestPriceDistribution.findAll({
              where: { contestId: newContestId },
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              order: [['rankStart', 'ASC']],
            });

            return res.status(201).json({
              ...(await newContest.get()),
              priceDistribution: priceDistribution,
            });
          }
        } else {
          return res.status(400).json({
            message: 'Cannot create contest without non-existing sub-category!',
          });
        }
      } else {
        return res.status(400).json({
          message: 'Cannot create contest without non-existing user!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while creating the contest',
        errorMessage: error.message,
      });
    }
  },

  getContestById: async function (req, res) {
    const { id } = req.body;

    try {
      // * Fetch the contest and the prize distribution
      const contest = await Contest.findByPk(id, {
        include: [
          {
            model: ContestPriceDistribution,
            require: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [['rankStart', 'ASC']],
          },
          {
            model: ContestWinners,
            require: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'contestId'] },
          },
        ],
      });

      console.log('Constest: ', contest);

      if (contest) {
        // * Fetch the stocks related to the subCategory

        const stocks = await StocksSubCategories.findAll({
          where: {
            subCategoryId: await contest.get('subCategoryId'),
          },
          attributes: {
            exclude: [
              'createdAt',
              'updatedAt',
              'stockId',
              'subCategoryId',
              'id',
            ],
          },
          include: {
            model: Stocks,
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        });

        console.log('Stocks: ', stocks);

        const stocksArr = await Promise.all(
          stocks?.map(async (stock) => await stock.get('stock').get()),
        );

        console.log('Stocks Arr: ', stocksArr);

        // * Fetch the the number of participants who have joined the contest

        const participants = await ContestParticipants.findAndCountAll({
          where: { contestId: await contest.get('id') },
        });

        console.log('Participants: ', participants);

        const result = {
          ...(await contest.get()),
          stocks: stocksArr,
          participants: participants.count,
        };
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ error: 'No contest found!' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while fetching contest by id',
        errorMessage: error.message,
      });
    }
  },

  getContestsByCategory: async function (req, res) {
    const { category } = req.body;

    try {
      const contest = await Contest.findAll({
        where: {
          category: category,
        },
      });

      if (contest) {
        return res.status(200).json(contest);
      } else {
        return res.status(404).json({ error: 'No contest found!' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while fetching contest by category',
        errorMessage: error.message,
      });
    }
  },

  getContestsBySubCategory: async function (req, res) {
    const { subCategoryId } = req.body;
    try {
      const contest = await Contest.findAll({
        where: {
          subCategoryId,
        },
      });

      if (contest) {
        return res.status(200).json(contest);
      } else {
        return res.status(404).json({ error: 'No contest found!' });
      }
    } catch (error) {
      console.error('Error while fetching contest by sub category: ', error);
      return res.status(500).json({
        error: 'Something went wrong while fetching contest by sub category',
        errorMessage: error.message,
      });
    }
  },

  /**
   *
   * @param id contest id
   * @param portfolio id, name, stocks
   * @param portfolio.stocks stockId, action, captain, viceCaptain
   * @returns
   */
  joinContestById: async function (req, res) {
    const userId = req.id;
    const contestDetails = req.body;

    /*
     *  Check if there is any contest with the given id
    //  *  Check if the user has already joined the contest by checking the userId and contestId in the Participants table
     *  Check if there is an available slot to join
     *    Add User to the ContestParticipants Table
     */

    try {
      validatePortfolio(contestDetails?.portfolio?.stocks);

      if (contestDetails?.id) {
        const existingContest = await Contest.findByPk(contestDetails?.id);

        console.log('Existing Contest: ', existingContest);

        // * Check if contest exists
        if (existingContest) {
          // * Check if the contest has not started yet
          if (
            moment(existingContest?.startTime) > moment() &&
            moment(existingContest.endTime) < moment()
          ) {
            return res.status(403).json({
              message: 'Contest is live! Cannot join!',
            });
          } else if (moment(existingContest.endTime) < moment()) {
            return res.status(403).json({
              message: 'Contest has ended',
            });
          }
          const exisitngContestId = await existingContest.get('id');

          // * Check if there is an available slot to join
          const totalParticipants = await ContestParticipants.findAndCountAll({
            where: { contestId: exisitngContestId },
          });

          if (totalParticipants >= (await existingContest.get('slots'))) {
            return res.status(400).json({
              message: 'Slot are full, no more slots available!',
            });
          }

          // * Check if he has participated 20 times in the same contest
          const maxParticipation = await ContestParticipants.findAndCountAll({
            where: { userId: userId, contestId: exisitngContestId },
          });

          if (maxParticipation.count >= 3) {
            return res.status(403).json({
              message: 'Player has reached the limit of maximum participation',
            });
          }

          // * Add User to the ContestParticipants Table
          const newParticipant = await ContestParticipants.create({
            userId,
            contestId: exisitngContestId,
          });

          if (newParticipant) {
            // * Create a Portfolio and add Stocks to PortfolioStocks OR Select a portfolio

            const existingPortfolio = await Portfolio.findByPk(
              contestDetails?.portfolio?.id,
            );

            if (existingPortfolio?.id) {
              // * Insert Contest id and portfolio id into ContestPortfolios Table if portfolio selected already exists
              await ContestPortfolios.create({
                contestId: exisitngContestId,
                portfolioId: existingPortfolio.id,
              });
            } else {
              // * Create new portfolio for the user with the stocks selected
              // * Will recieve a list of object of stocks containing the stockId, action, and captain and viceCaptian fields
              const portfolio = await Portfolio.create({
                name: contestDetails?.portfolio?.name ?? null,
                userId: userId,
                subCategoryId: await existingContest.get('subCategoryId'),
              });

              for (
                let i = 0;
                i < contestDetails?.portfolio?.stocks.length;
                i++
              ) {
                const stock = contestDetails?.portfolio?.stocks[i];
                await PortfolioStocks.create({
                  portfolioId: await portfolio.get('id'),
                  stockId: stock?.stockId,
                  action: stock?.action,
                  captain: stock?.captain,
                  viceCaptain: stock?.viceCaptain,
                });
              }

              await ContestPortfolios.create({
                contestId: exisitngContestId,
                portfolioId: await portfolio.get('id'),
              });
            }

            return res.status(200).json({
              message: 'Join Contest Successful',
            });
          }
        } else {
          return res.status(404).json({
            message: 'No Contest Found!',
          });
        }
      } else {
        return res.status(422).json({
          error: 'Provided a bad contest id!',
        });
      }
    } catch (error) {
      console.error('Error while joining the contest: ', error);
      return res.status(500).json({
        error: 'Something went wrong while joining the contest by id',
        errorMessage: error.message,
      });
    }
  },
};
