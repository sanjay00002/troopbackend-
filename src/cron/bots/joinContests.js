import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';
import models from '../../models';
import CronJobController from '../../controllers/CronJobController';
import axios from 'axios';

const { User } = models;

const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

const client = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

module.exports = () => {
  cron.schedule('0 05 09 * * *', () => {
    // * Creating bots 10 mins before the contest starts
    /**
     * TODO:
     * Create a dummy bot user
     * Iterate over the categories and fetch contest by categories
     * Look for number of slots and participants in a contest and calculate the unfilled slots
     * Create bots for the unfilled slots
     * Randomly assign a portfolio of stocks to each bot and join the contest
     */

    async function createBots() {
      try {
        const bot = await client
          .post('/bot/create', null)
          .then((response) => response.data)
          .catch((error) => {
            throw new Error(error.response);
          });

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
                contests.forEach((contest) => {
                  const nonParticipantCount =
                    contest.slots - Number(contest.participants);

                  if (nonParticipantCount > 0) {
                    const bulkBots = client
                      .post('/bot/bulkCreate', { limit: nonParticipantCount })
                      .then((response) => response.data)
                      .catch((error) => {
                        throw new Error(error.response);
                      });

                    bulkBots?.length &&
                      bulkBots.forEach((bot) => {
                        // TODO: Join the contest with a random portfolio
                      });
                  }
                });
            });
          }
        }
      } catch (error) {
        console.error('Error while creating bots: ', error);
      }
    }
  });
};
