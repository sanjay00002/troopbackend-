// import moment from 'moment';
// import momentTimezone from 'moment-timezone';
import cron from 'node-cron';
import models from '../../models';
import CronJobController from '../../controllers/CronJobController';

import client from '../../api/client';
import { createPortfolioForBot } from '../../lib/bot';

const { User, StocksSubCategories } = models;

const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

module.exports = () => {
  cron.schedule(
    '0 05 09 * * *',
    () => {
      // * Creating bots 10 mins before the contest starts
      /*
       * Create a dummy bot user
       * Iterate over the categories and fetch contest by categories
       * Look for number of slots and participants in a contest and calculate the unfilled slots
       * Create bots for the unfilled slots
       * Randomly assign a portfolio of stocks to each bot and join the contest
       */

      async function createBots() {
        try {
          const bot = await client
            .post('/bot/create')
            .then((response) => response.data)
            .catch((error) => {
              throw new Error(error.response);
            });

          console.log('Dummy Bot: ', bot);

          if (bot?.id) {
            client.defaults.headers.common['Authorization'] =
              'Bearer ' + bot.accessToken;

            const categories = await client
              .get('/contest/categories')
              .then((response) => response.data)
              .catch((error) => {
                throw new Error(error.response);
              });

            if (categories?.data?.length) {
              categories.data.forEach(async (category) => {
                const contests = await client
                  .post('/contest/contestsByCategory', {
                    category: category.name,
                  })
                  .then((response) => response.data)
                  .catch((error) => {
                    throw new Error(error.response);
                  });

                contests?.length &&
                  contests.forEach(async (contest) => {
                    const nonParticipantCount =
                      contest.slots - Number(contest.participants);

                    if (nonParticipantCount > 0) {
                      const bulkBots = await client
                        .post('/bot/bulkCreate', { limit: nonParticipantCount })
                        .then((response) => response.data)
                        .catch((error) => {
                          throw new Error(error.response);
                        });

                      bulkBots?.length > 0 &&
                        bulkBots.forEach(async (bot) => {
                          // * Join the contest with a random portfolio

                          const stocksList = await StocksSubCategories.findAll({
                            where: {
                              subCategoryId: contest.subCategoryId,
                            },
                            attributes: { include: ['stockId'] },
                          });

                          const stockIdList = await Promise.all(
                            stocksList?.map(
                              async (stock) => await stock.get('stockId'),
                            ),
                          );
                          // console.log('StockIdList: ', stockIdList);

                          const stocks = await createPortfolioForBot(
                            stockIdList,
                          );

                          const joinContestObj = {
                            id: contest.id,
                            portfolio: { stocks },
                          };
                          // console.log('Join Contest: ', joinContestObj);

                          await client
                            .post('/contest/join', joinContestObj, {
                              headers: {
                                Authorization: 'Bearer ' + bot.accessToken,
                              },
                            })
                            // .then((response) => console.log(response.data))
                            .catch((error) => {
                              throw new Error(error.response);
                            });
                        });
                    }
                  });
              });
            }

            // * Delete the dummy bot
            await User.destroy({
              where: { id: bot.id },
            });
          }
        } catch (error) {
          console.error(
            'Error while creating bots: ',
            JSON.stringify(error, null, 2),
          );
        }
      }

      createBots();
    },
    {
      name: 'Bot-Join-Contests',
      ...scheduleOptions,
    },
  );
};
