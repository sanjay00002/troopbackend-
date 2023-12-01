import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';
import models from '../../../database/models';
import CronJobController from '../controllers/CronJobController';

require('dotenv').config();


const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};


module.exports = () => {
    cron.schedule(
        '*/7 0-14,15 * * *',
        // '42 13 * * *',
      () => {
        async function updateAllStockPrices() {
          try {
            console.log(' updating stock prices')
            await CronJobController.updateStockPrices();
          } catch (error) {
            console.error(
              'Error while updating stock prices',
            );
          }
        }
  
        updateAllStockPrices();
      },
      {
        name: 'Updating-the-Stock-Prices',
        ...scheduleOptions,
      },
    );
  };