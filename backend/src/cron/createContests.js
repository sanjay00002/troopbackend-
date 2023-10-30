import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';

import models from '../../../database/models';

import CronJobController from '../controllers/CronJobController';


import priceDistribution from '../utils/contestPriceDistributions';

require('dotenv').config();

const { UserRole, Role } = models;

const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

module.exports = () => {
  // * Normal contest
  cron.schedule(
    // '0 15 9 * * *',
    // '31 15 * * * *',
    // '* * * * *',
    '0 9 * * *',
    () => {
      async function createContest() {
        console.log("creating contests")
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
        const tomorrow = today.clone().add(1, 'day');

        // * Create 1 Mega Contest
        await CronJobController.createContest(adminId, {
          categoryId: 1,
          subCategoryId: 1,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 380,
          pricePool: priceDistribution.mega[0].priceAmount,
          slots: 200,
          priceDistribution: priceDistribution.mega,
        });

        // * Create 3 Contest in Nifty IT
        await CronJobController.createContest(adminId, {
          categoryId: 3,
          subCategoryId: 2,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 11,
          pricePool: priceDistribution.niftyIT[0][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.niftyIT[0],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 3,
          subCategoryId: 2,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 99,
          pricePool: priceDistribution.niftyIT[1][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.niftyIT[1],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 3,
          subCategoryId: 2,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 199,
          pricePool: priceDistribution.niftyIT[2][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.niftyIT[2],
        });

        // * Creates 2 Practice Contest in Nifty IT
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 2,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 2,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });

        // * Create 3 Contest in Nifty Auto
        await CronJobController.createContest(adminId, {
          categoryId: 3,
          subCategoryId: 3,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 11,
          pricePool: priceDistribution.niftyAuto[0][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.niftyAuto[0],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 3,
          subCategoryId: 3,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 99,
          pricePool: priceDistribution.niftyAuto[1][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.niftyAuto[1],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 3,
          subCategoryId: 3,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 199,
          pricePool: priceDistribution.niftyAuto[2][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.niftyAuto[2],
        });

        // * Create 2 Practice Contest in Nifty Auto
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 3,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 3,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });

        // * Create 3 Contest in Nifty Bank
        await CronJobController.createContest(adminId, {
          categoryId: 3,
          subCategoryId: 4,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 11,
          pricePool: priceDistribution.niftyBank[0][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.niftyBank[0],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 3,
          subCategoryId: 4,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 99,
          pricePool: priceDistribution.niftyBank[1][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.niftyBank[1],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 3,
          subCategoryId: 4,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 199,
          pricePool: priceDistribution.niftyBank[2][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.niftyBank[2],
        });

        // * Create 2 Practice Contest for Nifty Bank
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 4,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 4,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });

        // * Create 3 Gaint Stock Contests
        await CronJobController.createContest(adminId, {
          categoryId: 2,
          subCategoryId: 6,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 99,
          pricePool: priceDistribution.gaintStocks[0][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.gaintStocks[0],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 2,
          subCategoryId: 6,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 299,
          pricePool: priceDistribution.gaintStocks[1][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.gaintStocks[1],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 2,
          subCategoryId: 6,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 499,
          pricePool: priceDistribution.gaintStocks[2][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.gaintStocks[2],
        });

        // * Create 2 Practice Contest for Gaint Stocks
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 6,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 6,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });

        // * Create 3 Penny Stocks Contests
        await CronJobController.createContest(adminId, {
          categoryId: 2,
          subCategoryId: 5,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 2,
          pricePool: priceDistribution.pennyStocks[0][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.pennyStocks[0],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 2,
          subCategoryId: 5,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 5,
          pricePool: priceDistribution.pennyStocks[1][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.pennyStocks[1],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 2,
          subCategoryId: 5,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 10,
          pricePool: priceDistribution.pennyStocks[2][0].priceAmount,
          slots: 500,
          priceDistribution: priceDistribution.pennyStocks[2],
        });

        // * Create 2 Practice Contest for Penny Stocks
        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 5,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });

        await CronJobController.createContest(adminId, {
          categoryId: 5,
          subCategoryId: 5,
          date: today.format('YYYY-MM-DD'),
          entryAmount: 0,
          pricePool: 0,
          slots: 500,
          priceDistribution: [],
        });
        await CronJobController.updateStockPrices()
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
