import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';
import models from '../../../database/models';
import CronJobController from '../controllers/CronJobController';

const { CouponRewards } = models;

const scheduleOptions = {
  scheduled: true,
  timezone: 'Asia/Kolkata',
};

module.exports = () => {
  cron.schedule(
    '*/10 * * * *',
    () => {
      async function updateCoupons() {
        try {
          await CronJobController.insertNewCoupons();
        } catch (error) {
          console.error('Error while updating coupons in CRON job: ', error);
        }
      }

      async function updateOffers() {
        try {
          await CronJobController.insertNewOffers();
        } catch (error) {
          console.error('Error while updating coupons in CRON job: ', error);
        }
      }

      updateCoupons();
      updateOffers();
    },
    {
      name: 'Update-Coupons-Offers',
      ...scheduleOptions,
    },
  );
};
