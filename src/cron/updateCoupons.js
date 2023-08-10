import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';
import models from '../models';
import CronJobController from '../controllers/CronJobController';

const { CouponRewards } = models;

const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

module.exports = () => {
  cron.schedule(
    '0 03 * * *',
    () => {
      async function updateCoupons() {
        try {
          await CronJobController.insertNewCoupons();
        } catch (error) {
          console.error('Error while updating coupons in CRON job: ', error);
        }
      }

      updateCoupons();
    },
    {
      name: 'Update-Coupons',
      ...scheduleOptions,
    },
  );
};
