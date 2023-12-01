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
    // '30 15 * * *',
    '*/30 0-14,15 * * *',
    () => {
      // * Close Contest
      // * Declare Winners
      async function updateAllPortfolioScores() {
        try {
          // * Calculate the portfolio scores
          await CronJobController.calculatePortfolioScore();

        } catch (error) {
          console.error(
            'Error while updating stock prices and scores of portfolios',
          );
        }
      }

      updateAllPortfolioScores();
    },
    {
      name: 'Close-Contests',
      ...scheduleOptions,
    },
  );
};