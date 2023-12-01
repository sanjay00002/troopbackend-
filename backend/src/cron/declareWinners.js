import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';
import models from '../../../database/models';
import CronJobController from '../controllers/CronJobController';

require('dotenv').config();

const { UserRole, Role } = models;

const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

module.exports = () => {
  cron.schedule(
    '30 15 * * *',
    () => {
      // * Close Contest
      // * Declare Winners
      async function declareWinners() {
        try {
          // * Update Stock Prices
          // await CronJobController.updateStockPrices();
          await CronJobController.updateStockClosePrices();

          // * Calculate the portfolio scores
          await CronJobController.calculatePortfolioScore();

          // * Declare winners for all the today's contest
          await CronJobController.generateWinners();
        } catch (error) {
          console.error(
            'Error while updating stock prices and scores of portfolios',
          );
        }
      }

      declareWinners();
    },
    {
      name: 'Close-Contests',
      ...scheduleOptions,
    },
  );

  cron.schedule(
    '0 55 14 * * *',
    () => {
      // * Close Live Contest
    },
    {
      name: 'Close-Live-Contest',
      ...scheduleOptions,
    },
  );
};
