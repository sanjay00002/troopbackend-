import { Op, Sequelize } from 'sequelize';
import model from '../models';
import moment from 'moment';

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
} = model;

export default {
  createContest: async function (req, res) {
    const contest = req.body;
    const userId = req.id;

    try {
      const user = await User.findByPk(userId);

      if (user && !user?.isBot) {
        const newContest = await Contest.create({
          name: contest?.name,
          image: contest?.image,
          description: contest?.description,
          entryAmount: contest?.entryAmount,
          category: contest?.category,
          subCategoryId: contest?.subCategoryId,
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
        error: 'Something went wrong while fetching contest by id',
        errorMessage: error.message,
      });
    }
  },

  /**
   *
   * @param id integer
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
      if (contestDetails?.id) {
        const existingContest = await Contest.findByPk(contestDetails?.id);

        console.log('Existing Contest: ', existingContest);

        // * Check if contest exists
        if (existingContest) {
          const exisitngContestId = await existingContest.get('id');
          // const alreadyJoined = await ContestParticipants.findOne({
          //   where: { userId, contestId: exisitngContestId },
          // });

          // * Check if user has already joined the contest
          // if (alreadyJoined) {
          //   return res.status(400).json({
          //     message: 'User has already joined the contest',
          //   });
          // }

          // * Check if there is an available slot to join
          const totalParticipants = await ContestParticipants.findAndCountAll({
            where: { contestId: exisitngContestId },
          });

          if (totalParticipants >= (await existingContest.get('slots'))) {
            return res.status(400).json({
              message: 'Slot are full, no more slots available!',
            });
          }

          // * Add User to the ContestParticipants Table
          const newParticipant = await ContestParticipants.create({
            userId,
            contestId: exisitngContestId,
          });

          if (newParticipant) {
            // TODO: Create a Portfolio and add Stocks to PortfolioStocks OR Select a portfolio

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
