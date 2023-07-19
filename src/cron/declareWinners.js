import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';
import models from '../models';
import CronJobController from '../controllers/CronJobController';

require('dotenv').config();

const { UserRole, Role } = models;

const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

module.exports = () => {
  cron.schedule(
    '0 30 15 * * *',
    () => {
      // * Close Contest
      // * Declare Winners
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
