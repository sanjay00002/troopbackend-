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
  // * Normal contest
  cron.schedule(
    '0 15 09 * * *',
    () => {
      async function createContest() {
        // * Create Contests
        // * Special - Penny, Gaint Stocks, Practice | Sectoral - Nifty 50, IT, Auto, Bank, Practice | Mega - Mega
        // * Fetch the admin user

        const adminUser = await UserRole.findOne({
          include: {
            model: Role,
            where: { role: process.env.ADMIN_ROLE },
          },
        });

        const adminId = await adminUser.get('userId');

        const contestDate = momentTimezone.tz(moment(), 'Asia/Kolkata');

        // * Creates a Practice Contest in Nifty IT
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 2,
          date: contestDate.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 450,
          priceDistribution: [],
        });
      }

      createContest();
    },
    {
      name: 'Create-Normal-Contest',
      ...scheduleOptions,
    },
  );

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

  // * Live Contest
  cron.schedule(
    '0 30 09 * * *',
    () => {
      // * Create Live Contests
    },
    {
      name: 'Create-Live-Contest',
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
