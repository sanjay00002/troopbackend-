import { Op, Sequelize } from 'sequelize';
import model from '../../../database/models';
import { validatePortfolio } from '../lib/portfolio';
import { getContestStatus } from '../lib/contest';
import calculatePayout, { calculatePrivatePayout } from './../lib/payout';

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
            name: contest?.name ?? null,
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
      const contest = await Contest.findOne(
        { where: { id } },
        {
          include: [
            {
              model: ContestPriceDistribution,
              required: true,
              attributes: { exclude: ['createdAt', 'updatedAt'] },
              order: [['rankStart', 'ASC']],
            },
            {
              model: ContestWinners,
              required: true,
              attributes: { exclude: ['createdAt', 'updatedAt', 'contestId'] },
            },
          ],
        },
      );

      // console.log('Constest: ', contest);

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
      const existingCategory = await ContestCategories.findOne({
        where: { name: category },
      });

      if (existingCategory) {
        const contests = await Contest.findAll({
          where: {
            categoryId: existingCategory.id,
          },
          include: {
            model: SubCategories,
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        });

        if (contests) {
          let contestWithParticipants = JSON.parse(JSON.stringify(contests));
          for (let i = 0; i < contestWithParticipants.length; i++) {
            const contest = contests[i];
            const participants = await ContestParticipants.findAndCountAll({
              where: { contestId: await contest.get('id') },
            });

            // console.log('Participants: ', participants.count);

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

            contestWithParticipants[i].participants = participants.count;
            contestWithParticipants[i].stocks = stocksArr;
          }

          console.log('Contest with Participants: ', contestWithParticipants);

          return res.status(200).json(contestWithParticipants);
        } else {
          return res.status(404).json({ error: 'No contest found!' });
        }
      } else {
        return res.status(404).json({ error: "Category doesn't exists!" });
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
      const contests = await Contest.findAll({
        where: {
          subCategoryId,
        },
      });

      if (contests) {
        let contestWithParticipants = JSON.parse(JSON.stringify(contests));
        for (let i = 0; i < contestWithParticipants.length; i++) {
          const contest = contests[i];
          const participants = await ContestParticipants.findAndCountAll({
            where: { contestId: await contest.get('id') },
          });

          contestWithParticipants[i].participants = participants.count;

          // console.log('Participants: ', participants.count);
        }

        const stocksORM = await StocksSubCategories.findAll({
          where: {
            subCategoryId,
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

        const stocksArr = await Promise.all([
          ...(await stocksORM.map(
            async (stocks) => await stocks.get('stock').get(),
          )),
        ]);

        console.log('Contest with Participants: ', contestWithParticipants);

        return res.status(200).json({
          contests: contestWithParticipants,
          stocks: stocksArr,
        });
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
    console.log(contestDetails)
    try {
      // Validate the portfolio data
      validatePortfolio(contestDetails?.portfolio?.stocks);
    
      if (contestDetails?.id) {
        // Find the contest by ID

        const existingContest = await Contest.findByPk(contestDetails?.id, {
          include: {
            model: ContestCategories,
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        });
    
        console.log('Existing Contest: ', existingContest);
    
        if (existingContest) {
          const contestStatus = getContestStatus(existingContest);
    
          if (!existingContest.get('canJoin')) {
            return res.status(403).json({
              message: 'Contest is not active! Cannot join!',
            });
          } 
          else if (!existingContest.get('isActive')) {
            return res.status(403).json({
              message: 'Contest has ended',
            });
          }
    
          const existingContestId = await existingContest.get('id');
    
          const canJoin = await existingContest.get('canJoin');
    
          if (!canJoin) {
            return res.status(403).json({
              message: 'Cannot join this contest at the moment',
            });
          }
    
          // Count the total participants in the contest
          const totalParticipants = await ContestParticipants.findAndCountAll({
            where: { contestId: existingContestId },
          });
    
          if (totalParticipants.count >= (await existingContest.get('slots'))) {
            return res.status(400).json({
              message: 'Slots are full, no more slots available!',
            });
          }
    
          // Count the user's maximum participation in the contest
          const maxParticipation = await ContestParticipants.findAndCountAll({
            where: { userId, contestId: existingContestId },
          });
    
          if (maxParticipation.count >= 20) {
            return res.status(403).json({
              message: 'Player has reached the limit of maximum participation',
            });
          }

          const user = await User.findByPk(userId, {
            attributes: ['username'],
          });
    
          const username = user ? user.get('username') : null;
          console.log('Username:', username);

          // Create a new participant in the contest
          const newParticipant = await ContestParticipants.create({
            userId,
            contestId: existingContestId,
          });
    
          if (newParticipant) {
            // Find an existing portfolio
            const existingPortfolio = await Portfolio.findByPk(
              contestDetails?.portfolio?.id
            );
    
            if (existingPortfolio?.id) {
              // Insert Contest ID and Portfolio ID into ContestPortfolios Table if the portfolio selected already exists
              await ContestPortfolios.create({
                contestId: existingContestId,
                portfolioId: existingPortfolio.id,
              });
            } else {
              // Create a new portfolio for the user with the selected stocks
              const portfolio = await Portfolio.create({
                username: username,
                name:existingContest.name,
                // name: contestDetails?.portfolio?.name ?? null,
                userId: userId,
                subCategoryId: await existingContest.get('subCategoryId'),
                // contestId: await existingContestId.get('contestId'),
                contestId: existingContestId,
                // portfolioId: await portfolio.get('id'),
              });
    
              for (let i = 0; i < contestDetails?.portfolio?.stocks.length; i++) {
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
                contestId: existingContestId,
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

  joinBots: async function (req, res) {
    const contestDetails = req.body;
    const userId = req.body.userId;
  
     /*
     *  Check if there is any contest with the given id
    //  *  Check if the user has already joined the contest by checking the userId and contestId in the Participants table
     *  Check if there is an available slot to join
     *    Add User to the ContestParticipants Table
     */
    console.log(contestDetails)
    try {
      // Validate the portfolio data
      validatePortfolio(contestDetails?.portfolio?.stocks);
  
      if (contestDetails?.id) {
        // Find the contest by ID
        const existingContest = await Contest.findByPk(contestDetails?.id, {
          include: {
            model: ContestCategories,
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        });
  
        console.log('Existing Contest: ', existingContest);
  
        if (existingContest) {
          const contestStatus = getContestStatus(existingContest);
  
          if (!existingContest.get('canJoin')) {
            return res.status(403).json({
              message: 'Contest is not active! Cannot join!',
            });
          } else if (!existingContest.get('isActive')) {
            return res.status(403).json({
              message: 'Contest has ended',
            });
          }
  
          const existingContestId = await existingContest.get('id');
          const canJoin = await existingContest.get('canJoin');
  
          if (!canJoin) {
            return res.status(403).json({
              message: 'Cannot join this contest at the moment',
            });
          }
  
          // Count the total participants in the contest
          const totalParticipants = await ContestParticipants.findAndCountAll({
            where: { contestId: existingContestId },
          });
  
          if (totalParticipants.count >= (await existingContest.get('slots'))) {
            return res.status(400).json({
              message: 'Slots are full, no more slots available!',
            });
          }
  
          // Count the user's maximum participation in the contest
          const maxParticipation = await ContestParticipants.findAndCountAll({
            where: { userId, contestId: existingContestId },
          });
  
          if (maxParticipation.count >= 20) {
            return res.status(403).json({
              message: 'Player has reached the limit of maximum participation',
            });
          }
  
          // Create a new participant in the contest
          const newParticipant = await ContestParticipants.create({
            userId,
            contestId: existingContestId,
          });
  
          if (newParticipant) {
            // Find an existing portfolio
            const existingPortfolio = await Portfolio.findByPk(
              contestDetails?.portfolio?.id
            );
  
            if (existingPortfolio?.id) {
                 // Insert Contest ID and Portfolio ID into ContestPortfolios Table if the portfolio selected already exists
              await ContestPortfolios.create({
                contestId: existingContestId,
                portfolioId: existingPortfolio.id,
              });
            } else {
              // Create a new portfolio for the user with the selected stocks
              const portfolio = await Portfolio.create({
                name: existingContest.name,
                userId: userId,
                subCategoryId: await existingContest.get('subCategoryId'),
                contestId: existingContestId,
              });
  
              for (let i = 0; i < contestDetails?.portfolio?.stocks.length; i++) {
                const stock = contestDetails?.portfolio?.stocks[i];
                if (stock?.stockId != null) {
                  await PortfolioStocks.create({
                    portfolioId: await portfolio.get('id'),
                    stockId: stock?.stockId,
                    action: stock?.action,
                    captain: stock?.captain,
                    viceCaptain: stock?.viceCaptain,
                  });
                } else {
                  return res.status(422).json({
                    error: 'StockId cannot be null or undefined',
                  });
                }
              }
  
              await ContestPortfolios.create({
                contestId: existingContestId,
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
  


  fetchJoinedContest: async function (req, res) {
    const userId = req.id;
    const { subCategoryId } = req.body;

    try {
      const contests = await Contest.findAll({
        where: {
          subCategoryId,
        },
        include: [
          {
            model: ContestPortfolios,
            required: true,
            include: {
              model: Portfolio,
              required: true,
              where: { userId },
              attributes: [],
            },
            attributes: { exclude: ['createdAt', 'updatedAt', 'contestId'] },
          },
          // {
          //   model: ContestParticipants,
          //   required: true,
          //   as: 'participants',
          //   attributes: [],
          // },
        ],
        attributes: {
          include: [
            'id',
            'categoryId',
            'subCategoryId',
            'entryAmount',
            'pricePool',
            'createdBy',
            'slots',
            // [
            //   Sequelize.fn('COUNT', Sequelize.col('participants.id')),
            //   'participantsCount',
            // ],
          ],
        },
        group: [
          'Contest.id',
          'contestPortfolios.id',
          'contestPortfolios->portfolio.id',
        ],
      });

      const allJoinedContest = await Promise.all([
        ...(await contests.map(async (c) => await c.get())),
      ]);

      const length = allJoinedContest.length;
      for (let index = 0; index < length; index++) {
        const contest = await allJoinedContest[index];
        const participants = await ContestParticipants.findAndCountAll({
          where: {
            contestId: contest.id,
          },
        });

        allJoinedContest[index].participantCount = participants.count;
      }

      console.log('Contests: ', allJoinedContest);

      return res.status(200).json(contests);
    } catch (error) {
      console.error('Error while joining the contest: ', error);
      return res.status(500).json({
        error:
          'Something went wrong while fetching the joined contests for sub category',
        errorMessage: error.message,
      });
    }
  },

  fetchJoinedContestByStatus: async function (req, res) {
    const userId = req.id;

    /*
     *  Get the contests that the user has participated from ContestParticipants
     *  Get the contest details from the contest table
     *  Get the category details from the categoryId
     *  Get the Sub Category details from the subCategoryId
     *  Get the portfolioIds from ContestPortfolios
     *
     *  Filter for status:
     *    Compare the date of the contest with the current date (past date = completed, next date = upcoming)
     *    If current date is found then:
     *      Compare the timings from the category and place the contest in upcoming/live accordingly
     *
     */
    try {
      // const participatedContests = await ContestParticipants.findAll({
      //   where: { userId },
      //   attributes: [],
      //   include: {
      //     model: Contest,
      //     required: false,
      //     duplicating: false,
      //     include: [
      //       {
      //         model: SubCategories,
      //         required: true,
      //       },
      //       {
      //         model: ContestCategories,
      //         required: true,
      //       },
      //       {
      //         model: ContestPortfolios,
      //         required: true,
      //       },
      //     ],
      //   },
      // });

      const participatedContests = await ContestParticipants.findAll({
        where: { userId },
        attributes: ['contestId'],
        include: {
          model: Contest,
          required: true,
        },
      });

      const setOfContests = new Set(
        participatedContests.map((contest) => contest.contestId),
      );

      const joinedContest = await Contest.findAll({
        where: {
          id: { [Op.in]: [...setOfContests] },
        },
        include: [
          {
            model: SubCategories,
            required: true,
          },
          {
            model: ContestCategories,
            required: true,
          },
          {
            model: ContestPortfolios,
            required: true,
          },
        ],
      });

      const upcoming = [],
        live = [],
        completed = [];

      joinedContest.forEach((element) => {
        const contestStatus = getContestStatus(element);

        switch (contestStatus) {
          case 'upcoming':
            upcoming.push(element);
            break;
          case 'live':
            live.push(element);
            break;
          case 'completed':
            completed.push(element);
            break;
          default:
            break;
        }
      });

      return res.status(200).json({ upcoming, live, completed });
    } catch (error) {
      console.error('Error while fetching contest by status: ', error);
      return res.status(500).json({
        error: 'Something went wrong while fetching contest by status',
        errorMessage: error.message,
      });
    }
  },

  getStockStats: async function (req, res) {
    const { contestId, stockId } = req.body;
  
    try {
      const subQuery = await ContestPortfolios.findAll({
        attributes: ['portfolioId'],
        where: {
          contestId,
        },
        include: {
          model: Contest,
          required: true,
        },
      });
  
      const portfolioIds = subQuery.map((row) => row.portfolioId);
  
      const stockActionCount = await PortfolioStocks.findAll({
        attributes: ['stockId', 'action'],
        where: {
          portfolioId: { [Op.in]: portfolioIds },
          stockId: stockId,
        },
        raw: true, 
      });
  
      const countMap = new Map();
  
      stockActionCount.forEach((row) => {
        const key = `${row.stockId}_${row.action}`;
        countMap.set(key, (countMap.get(key) || 0) + 1);
      });
  
      const result = Array.from(countMap.entries()).map(([key, count]) => {
        const [stockId, action] = key.split('_');
        return {
          stockId,
          action,
          actionCount: count,
        };
      });
  
      console.log('Stock Action: ', result);
  
      const participants = await ContestParticipants.findAndCountAll({
        where: { contestId },
      });
  
      const totalParticipants = participants.count;
  
      console.log('Total Participants: ', totalParticipants);
  
      const percentage = {
        buy: 0,
        sell: 0,
        noTrade: 0,
      };
  
      result.forEach((stock) => {
        const actionCount = stock.actionCount;
        const actionPercentage = (actionCount / totalParticipants) * 100;
  
        switch (stock.action) {
          case 'Buy':
            percentage.buy = Number(actionPercentage.toFixed(2));
            break;
          case 'Sell':
            percentage.sell = Number(actionPercentage.toFixed(2));
            break;
          default:
            break;
        }
      });
  
      percentage.noTrade = 100 - (percentage.buy + percentage.sell);
  
      console.log('Percentage: ', percentage);

      return res.status(200).json(percentage);
    } catch (error) {
      console.error('Error while fetching live stocks stats: ', error);
      return res.status(500).json({
        error: 'Something went wrong while fetching live stocks stats',
        errorMessage: error.message,
      });
    }
  },
  getWinnerbyContestId: async function (req, res) {
    const contestId = req.body.contestId;
    console.log(contestId);

    try {
        const portfolios = await ContestPortfolios.findAll({
            where: {
                contestId: contestId,
            },
            include: {
                model: Portfolio,
                required: true,
            },
            order: [[Portfolio, 'score', 'DESC']],
        });

        const contestWinnersExist = await ContestWinners.findAll({
            where: { contestId: contestId },
        });

  
        var total_users = portfolios.length;
        var rank = 0;
        var prev_score = -1;

        for (const portfolio of portfolios) {
            // Rank updation takes place here
            if (prev_score !== portfolio.portfolio.score) {
                prev_score = portfolio.portfolio.score;
                rank += 1;
            }

            await ContestWinners.create({
                contestId: portfolio.contestId,
                userId: portfolio.portfolio.userId,
                rank: rank,
            });

            // ticket count updates here
            if (rank / total_users <= 0.75) {
                const top_user = await User.findByPk(portfolio.portfolio.userId);
                await top_user.update({
                    tickets: top_user.tickets + 1,
                });
            }
        }

        const winners = await ContestWinners.findAll({
            where: { contestId: contestId },
        });

        return res.status(200).json(winners);
    } catch (error) {
        console.error('Error while fetching winner by contest Id: ', error);
        return res.status(500).json({
            error: 'Something went wrong while winner by contest Id',
            errorMessage: error.message,
        });
    }
},

  privateContestPriceDistribution: async function (req, res) {
    const { entryAmount, noOfWinners, totalPlayers } = req.body;
    try {
      const priceDistribution = calculatePayout(totalPlayers, entryAmount, 0.7);

      const requiredWinnersIndex = priceDistribution.findIndex(
        (distribution) =>
          distribution.rankEnd >= noOfWinners &&
          distribution.rankStart <= noOfWinners,
      );

      const requiredPriceDistribution = priceDistribution.splice(
        0,
        requiredWinnersIndex + 1,
      );

      return res.status(200).json(requiredPriceDistribution);
    } catch (error) {
      console.error(
        'Error while calculating price distribution for private contest: ',
        error,
      );
      return res.status(500).json({
        error:
          'Something went wrong while calculating price distribution for private contest',
        errorMessage: error.message,
      });
    }
  },

  getPrivateContests: async function (req, res) {
    const userId = req.id;

    try {
      const existingUser = await User.findByPk(userId);
      if (existingUser) {
        const privateContestCategoryId = await ContestCategories.findOne({
          where: {
            name: 'Private',
          },
        });

        if (privateContestCategoryId) {
          const contests = await Contest.findAll({
            where: {
              categoryId: await privateContestCategoryId.get('id'),
              createdBy: userId,
            },
          });

          const contestArr = await Promise.all([
            ...contests.map(async (contest) => await contest.get()),
          ]);

          return res.status(200).json(contestArr);
        } else {
          return res.status(404).json({
            message: 'Private Contest category was not found!',
          });
        }
      } else {
        return res.status(404).json({
          message: 'User not found!',
        });
      }
    } catch (error) {
      console.error(
        'Error while fetching private contest for the user: ',
        error,
      );
      return res.status(500).json({
        error:
          'Something went wrong while fetching private contest for the user',
        errorMessage: error.message,
      });
    }
  },

  updatePrivateContestDetails: async function (req, res) {
    const { id, name, entryAmount, slots, priceDistribution } = req.body;

    try {
      const existingContest = await Contest.findByPk(id);

      if (existingContest) {
        const contestStatus = getContestStatus(existingContest);

        // * Check if the contest has not started yet
        if (contestStatus === 'live') {
          return res.status(403).json({
            message: 'Contest is live! Cannot join!',
          });
        } else if (contestStatus === 'completed') {
          return res.status(403).json({
            message: 'Contest has ended',
          });
        }

        const existingContestId = await existingContest.get('id');

        const deletedPriceDistributionRows =
          await ContestPriceDistribution.destroy({
            where: {
              contestId: existingContestId,
            },
            cascade: true,
          });

        console.log('Deleted Rows: ', deletedPriceDistributionRows);

        if (deletedPriceDistributionRows) {
          for (let i = 0; i < priceDistribution?.length; i++) {
            await ContestPriceDistribution.create({
              contestId: existingContestId,
              rankStart: priceDistribution[i].rankStart,
              rankEnd: priceDistribution[i].rankEnd,
              priceAmount: priceDistribution[i].priceAmount,
            });
          }

          await existingContest.update(
            {
              name,
              entryAmount,
              slots,
              pricePool: priceDistribution[0]?.priceAmount ?? null,
            },
            { fields: ['name', 'entryAmount', 'slots', 'pricePool'] },
          );

          return res.status(200).json({
            message: 'Contest Updated Successfully!',
          });
        }
      }
    } catch (error) {
      console.error(
        'Error while updating private contest details for the user: ',
        error,
      );
      return res.status(500).json({
        error:
          'Something went wrong while updating private contest details for the user',
        errorMessage: error.message,
      });
    }
  },
  StockChangePercentage: async (req, res) => {
    const { subCategory } = req.params;
  
    try {
      const stocks = await Stocks.findAll({
        where: { subCategory: subCategory },
      });
  
      if (stocks.length === 0) {
        return res.status(404).json({
          error: 'No stocks found for the given subCategory',
        });
      }
  
      const stockData = stocks.map((stock) => {
        const openPrice = stock.open_price;
        const closePrice = stock.close_price;
        const priceDifference = (openPrice - closePrice).toFixed(2);
        const percentageChange = ((priceDifference / openPrice) * 100).toFixed(2);
  
        return {
          stockId: stock.id,
          stockName: stock.name,
          token: stock.token,
          openPrice,
          closePrice,
          priceDifference,
          percentageChange,
        };
      });
  
      return res.status(200).json(stockData);
    } catch (error) {
      console.error('Error while calculating stock change percentage: ', error);
      return res.status(500).json({
        error: 'Something went wrong while calculating stock change percentage',
        errorMessage: error.message,
      });
    }
  },
  
}
