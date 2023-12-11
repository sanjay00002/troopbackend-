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
    // '06 12 * * *',
    () => {
      async function createContest() {
        console.log("creating contests")
        // * Create Contests
        // * Special - Penny, giant Stocks, Practice | Sectoral - Nifty 50, IT, Auto, Bank, Practice | Mega - Mega
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
            name:"Mega",
            categoryId: 1,
            subCategoryId: 1,
            date: tomorrow.format('YYYY-MM-DD'),
            entryAmount: 99,
            pricePool: parseInt(priceDistribution.mega[7].originalPricePool),
            slots: 500,
            priceDistribution: priceDistribution.mega,
          });
  
        // * Create 3 Contest in Nifty IT
        await CronJobController.createContest(adminId, {
          name:"Nifty IT",
          categoryId: 3,
          subCategoryId: 2,
          date: tomorrow.format('YYYY-MM-DD'),
          entryAmount: 11,
          pricePool:  parseInt(priceDistribution.niftyIT[0][0].originalPricePool),
          slots: 500,
          priceDistribution: priceDistribution.niftyIT[0],
        });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 3,
        //   subCategoryId: 2,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 99,
        //   pricePool:  parseInt(priceDistribution.niftyIT[1][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.niftyIT[1],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 3,
        //   subCategoryId: 2,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 199,
        //   pricePool:  parseInt(priceDistribution.niftyIT[2][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.niftyIT[2],
        // });

        // // * Creates 2 Practice Contest in Nifty IT
        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 2,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 2,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });

        // * Create 3 Contest in Nifty Auto
        await CronJobController.createContest(adminId, {
          name:"Nifty Auto",
          categoryId: 3,
          subCategoryId: 3,
          date: tomorrow.format('YYYY-MM-DD'),
          entryAmount: 11,
          pricePool:  parseInt(priceDistribution.niftyAuto[0][0].originalPricePool),
          slots: 500,
          priceDistribution: priceDistribution.niftyAuto[0],
        });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 3,
        //   subCategoryId: 3,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 99,
        //   pricePool:  parseInt(priceDistribution.niftyAuto[1][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.niftyAuto[1],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 3,
        //   subCategoryId: 3,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 199,
        //   pricePool:  parseInt(priceDistribution.niftyAuto[2][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.niftyAuto[2],
        // });

        // // * Create 2 Practice Contest in Nifty Auto
        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 3,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 3,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });

        // * Create 3 Contest in Nifty Bank
        await CronJobController.createContest(adminId, {
          name:"Nifty Bank",
          categoryId: 3,
          subCategoryId: 4,
          date: tomorrow.format('YYYY-MM-DD'),
          entryAmount: 11,
          pricePool:  parseInt(priceDistribution.niftyBank[0][0].originalPricePool),
          slots: 500,
          priceDistribution: priceDistribution.niftyBank[0],
        });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 3,
        //   subCategoryId: 4,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 99,
        //   pricePool:  parseInt(priceDistribution.niftyBank[1][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.niftyBank[1],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 3,
        //   subCategoryId: 4,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 199,
        //   pricePool:  parseInt(priceDistribution.niftyBank[2][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.niftyBank[2],
        // });

        // // * Create 2 Practice Contest for Nifty Bank
        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 4,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 4,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });

        // * Create 3 giant Stock Contests
        await CronJobController.createContest(adminId, {
          name:"Giant Stocks",
          categoryId: 2,
          subCategoryId: 6,
          date: tomorrow.format('YYYY-MM-DD'),
          entryAmount: 99,
          pricePool:  parseInt(priceDistribution.giantStocks[0][0].originalPricePool),
          slots: 500,
          priceDistribution: priceDistribution.giantStocks[0],
        });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 2,
        //   subCategoryId: 6,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 299,
        //   pricePool:  parseInt(priceDistribution.giantStocks[1][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.giantStocks[1],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 2,
        //   subCategoryId: 6,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 499,
        //   pricePool:  parseInt(priceDistribution.giantStocks[2][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.giantStocks[2],
        // });

        // // * Create 2 Practice Contest for giant Stocks
        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 6,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 6,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });

        // * Create 3 Penny Stocks Contests
        await CronJobController.createContest(adminId, {
          name:"Penny Stocks",
          categoryId: 2,
          subCategoryId: 5,
          date: tomorrow.format('YYYY-MM-DD'),
          entryAmount: 2,
          pricePool:  parseInt(priceDistribution.pennyStocks[0][0].originalPricePool),
          slots: 500,
          priceDistribution: priceDistribution.pennyStocks[0],
        });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 2,
        //   subCategoryId: 5,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 5,
        //   pricePool:  parseInt(priceDistribution.pennyStocks[1][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.pennyStocks[1],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 2,
        //   subCategoryId: 5,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 10,
        //   pricePool:  parseInt(priceDistribution.pennyStocks[2][0].originalPricePool),
        //   slots: 500,
        //   priceDistribution: priceDistribution.pennyStocks[2],
        // });

        // // * Create 2 Practice Contest for Penny Stocks
        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 5,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });

        // await CronJobController.createContest(adminId, {
        //   categoryId: 5,
        //   subCategoryId: 5,
        //   date: tomorrow.format('YYYY-MM-DD'),
        //   entryAmount: 0,
        //   pricePool: 0,
        //   slots: 500,
        //   priceDistribution: [],
        // });
        // await CronJobController.updateStockPrices()
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
