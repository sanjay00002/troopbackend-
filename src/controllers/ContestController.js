import { Op, Sequelize } from 'sequelize';
import model from '../models';
import { validatePortfolio } from '../lib/portfolio';
import { getContestStatus } from '../lib/contest';

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

            console.log('Participants: ', participants.count);

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

          console.log('Participants: ', participants.count);
        }

        console.log('Contest with Participants: ', contestWithParticipants);

        return res.status(200).json(contestWithParticipants);
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
        const existingContest = await Contest.findByPk(contestDetails?.id, {
          include: {
            model: ContestCategories,
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        });

        console.log('Existing Contest: ', existingContest);

        // * Check if contest exists
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

          if (maxParticipation.count >= 20) {
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
          {
            model: ContestParticipants,
            required: true,
            as: 'participants',
            attributes: [],
          },
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
            [
              Sequelize.fn('COUNT', Sequelize.col('participants.id')),
              'participantsCount',
            ],
          ],
        },
        group: [
          'Contest.id',
          'contestPortfolios.id',
          'contestPortfolios->portfolio.id',
        ],
      });

      // console.log('Contests: ', contests);

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
        attributes: [
          [Sequelize.fn('COUNT', Sequelize.col('*')), 'actionCount'],
          'stockId',
          'action',
        ],
        where: {
          portfolioId: { [Op.in]: portfolioIds },
          stockId: stockId,
        },
        group: ['stockId', 'action'],
      });

      console.log('Stock Action: ', stockActionCount);

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

      for (let index = 0; index < stockActionCount.length; index++) {
        const stock = stockActionCount[index];
        const actionCount = Number(await stock.get('actionCount'));
        switch (stock.action) {
          case 'Buy':
            percentage.buy = Number(
              ((actionCount / totalParticipants) * 100).toFixed(2),
            );
            break;
          case 'Sell':
            percentage.sell = Number(
              ((actionCount / totalParticipants) * 100).toFixed(2),
            );
            break;
          default:
            break;
        }

        percentage.noTrade = 100 - (percentage.buy + percentage.sell);
      }

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

      try {
        const contestWinnersExist = await ContestWinners.findAll({
          where: { contestId: contestId },
        });

        if (contestWinnersExist.length > 0){
          return res.status(401).json({
            message: 'Contest Winners already calculated',
          });
        }else{
          var total_users = portfolios.length
          var rank = 0;
          var prev_score = -1;
          for (const portfolio of portfolios) {
            // Rank updation takes here 
            if(prev_score !== portfolio.portfolio.score){
              prev_score = portfolio.portfolio.score;
              rank += 1;
            }
            await ContestWinners.create({
              contestId: portfolio.contestId,
              userId: portfolio.portfolio.userId,
              rank: rank,
            });
            // ticket count updates here
            if((rank/total_users) <= 0.75){
              const top_user = await User.findByPk(portfolio.portfolio.userId)
              await top_user.update({
                tickets: (top_user.tickets + 1)
              })
            }
          }
  
          const winners = await ContestWinners.findAll({
            where: { contestId: contestId },
          });
  
          return res.status(200).json(winners);
        }
      } catch (err) {
        console.error('Error while fetching winner by contest Id: ', err);
        return res.status(500).json({
          error: 'Something went wrong while winner by contest Id',
          errorMessage: error.message,
        });
      }
    } catch (error) {
      console.error('Error while fetching winner by contest Id: ', error);
      return res.status(500).json({
        error: 'Something went wrong while winner by contest Id',
        errorMessage: error.message,
      });
    }
  },
};
