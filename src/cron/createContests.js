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

        const today = momentTimezone.tz(moment(), 'Asia/Kolkata');

        // * Create 2 Practice Contest in Nifty 50
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 1,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 450,
          priceDistribution: [],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 1,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 450,
          priceDistribution: [],
        });

        // * Creates 2 Practice Contest in Nifty IT
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 2,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 450,
          priceDistribution: [],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 2,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 450,
          priceDistribution: [],
        });

        // * Create 2 Practice Contest in Nifty Auto
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 3,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 450,
          priceDistribution: [],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 3,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 450,
          priceDistribution: [],
        });

        // * Create 2 Practice Contest for Nifty Bank
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 4,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 450,
          priceDistribution: [],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 4,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 450,
          priceDistribution: [],
        });

        // * Create a Mega Contest
        await CronJobController.createContest(adminId, {
          categoryId: 1,
          subCategoryId: 7,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 10,
          pricePool: 4500,
          slots: 450,
          priceDistribution: [
            {
              rankStart: 1,
              rankEnd: 1,
              priceAmount: 3000,
            },
            {
              rankStart: 2,
              rankEnd: 2,
              priceAmount: 1500,
            },
            {
              rankStart: 3,
              rankEnd: 3,
              priceAmount: 750,
            },
            {
              rankStart: 4,
              rankEnd: 10,
              priceAmount: 375,
            },
            {
              rankStart: 11,
              rankEnd: 50,
              priceAmount: 187.5,
            },
            {
              rankStart: 51,
              rankEnd: 100,
              priceAmount: 93.75,
            },
            {
              rankStart: 101,
              rankEnd: 1000,
              priceAmount: 46.875,
            },
          ],
        });
      }

      createContest();
    },
    {
      name: 'Create-Normal-Contest',
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
};
