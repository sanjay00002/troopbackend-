// import moment from 'moment';
// import momentTimezone from 'moment-timezone';
const axios = require('axios');
import cron from 'node-cron';
import models from '../../../../database/models';
import CronJobController from '../../controllers/CronJobController';

import client from '../../api/client';
import { createPortfolioForBot } from '../../lib/bot';

const { User, StocksSubCategories } = models;

const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

// module.exports = () => {
//   cron.schedule(
//     // '0 05 09 * * *',
//     // '50 14 * * *',
//     // '6 17 * * *',
//     '45 8 * * *',
//     () => {
//       // * Creating bots 10 mins before the contest starts
//       /*
//        * Create a dummy bot user
//        * Iterate over the categories and fetch contest by categories
//        * Look for number of slots and participants in a contest and calculate the unfilled slots
//        * Create bots for the unfilled slots
//        * Randomly assign a portfolio of stocks to each bot and join the contest
//        */

//       async function createBotsAndJoinContest() {
//         try {
//           const bot = await client
//             .post('/bot/create')
//             .then((response) => response.data);

//           // console.log('Dummy Bot: ', bot);

//           if (bot?.id) {
//             client.defaults.headers.common['Authorization'] =
//               'Bearer ' + bot.accessToken;

//             const categories = await client
//               .get('/contest/categories')
//               .then((response) => response.data);

//             if (categories?.data?.length) {
//               for (const category of categories.data) {
//                 if (category.name !== 'Private') {
//                   const contests = await client
//                     .post('/contest/contestsByCategory', {
//                       category: category.name,
//                     })
//                     .then((response) => response.data);

//                   if (contests.length > 0) {
//                     for (const contest of contests) {
//                       const nonParticipantCount =
//                         contest.slots - Number(contest.participants);

//                       if (nonParticipantCount > 0) {
//                         const bulkBots = await client
//                           .post('/bot/bulkCreate', {
//                             limit: nonParticipantCount,
//                           })
//                           .then((response) => response.data);

//                         if (bulkBots.length > 0) {
//                           for (const bot of bulkBots) {
//                             const stocksList =
//                               await StocksSubCategories.findAll({
//                                 where: {
//                                   subCategoryId: contest.subCategoryId,
//                                 },
//                                 attributes: ['stockId'],
//                               });

//                             const stockIdList = stocksList.map(
//                               (stock) => stock.stockId,
//                             );

//                             const stocks = createPortfolioForBot(
//                               stockIdList
//                             );

//                             const joinContestObj = {
//                               id: contest.id,
//                               portfolio: { stocks },
//                             };

//                             await client.post('/contest/join', joinContestObj, {
//                               headers: {
//                                 Authorization: 'Bearer ' + bot.accessToken,
//                               },
//                             });
//                           }
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//             await User.destroy({
//               where: { isBot: true },
//             });
//           }
//         } catch (error) {
//           console.error(
//             'Error while creating bots: ',
//             JSON.stringify(error, null, 2),
//           );
//         }
//       }

//       createBotsAndJoinContest();
//     },
//     {
//       name: 'Bot-Join-Contests',
//       ...scheduleOptions,
//     },
//   );
// };

module.exports = () => {
  cron.schedule(
    '30 7 * * *',
    async () => {
      async function joinBotsToContests() {
        try {
          const bots = await User.findAll({
            where: { isBot: true },
            attributes: ['id'],
          });

          console.log('Wow:', bots);

          if (bots.length > 0) {
            for (const botInstance of bots) {
              const bot = botInstance.dataValues;
              const userId = bot.id;

              console.log('Wow2:', bot.id);

              const categories = await client
                .get('/contest/categories')
                .then((response) => response.data);

              for (const category of categories.data) {
                if (category.name !== 'Private') {
                  const contests = await client
                    .post('/contest/contestsByCategory', {
                      category: category.name,
                    })
                    .then((response) => response.data);

                  for (const contest of contests) {
                    const nonParticipantCount =
                      contest.slots - Number(contest.participants);

                    if (nonParticipantCount > 0) {
                      const stocksList = await StocksSubCategories.findAll({
                        where: {
                          subCategoryId: contest.subCategoryId,
                        },
                        attributes: { include: ['stockId'] },
                      });

                      const stockIdList = stocksList.map((stock) =>
                        stock.get('stockId'),
                      );
                      const stocks = createPortfolioForBot(stockIdList);

                      const joinContestObj = {
                        userId: userId,
                        id: contest.id,
                        portfolio: { stocks },
                      };

                      await client.post('/contest/joinBots', joinContestObj);
                    }
                  }
                }
              }
            }
          } else {
            console.log('No bots found.');
          }
        } catch (error) {
          if (error.response) {
            console.error('Server returned an error:', error.response.data);
            console.error('Status code:', error.response.status);
          } else if (error.request) {
            console.error(
              'No response received. Request made but no response.',
            );
          } else {
            console.error('Error setting up the request:', error.message);
          }
        }
      }

      joinBotsToContests();
    },
    {
      name: 'Bot-Join-Contests',
      ...scheduleOptions,
    },
  );
};
