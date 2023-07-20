import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';
import models from '../../models';
import CronJobController from '../../controllers/CronJobController';

const { User } = models;

const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

module.exports = () => {
  cron.schedule('0 05 09 * * *', () => {
    // * Creating bots 10 mins before the contest starts
    /**
     * TODO:
     * Create bots
     */
  });
};
