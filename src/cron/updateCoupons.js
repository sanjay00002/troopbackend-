import moment from 'moment';
import momentTimezone from 'moment-timezone';
import cron from 'node-cron';
import models from '../models';
import CronJobController from '../controllers/CronJobController';
import { getUpdatedCoupons } from '../api/rewards/coupons';
import { Sequelize } from 'sequelize';

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
        // * Update the exisiting coupons
        try {
          let start = performance.now();

          const updatedCoupons = await getUpdatedCoupons();
          const updatedLength = updatedCoupons?.length;

          if (updatedLength && updatedLength > 0) {
            const chunkSize = 50;
            for (let i = 0; i < updatedLength; i += chunkSize) {
              const chunk = updatedCoupons.slice(i, i + chunkSize);
              const chunkIds = await chunk.map((coupon) => String(coupon.id));
              await CouponRewards.update(
                {
                  title: Sequelize.literal(
                    `CASE ${chunk
                      .map(
                        (coupon) =>
                          `WHEN id='${coupon.id}' THEN '${coupon.title}'`,
                      )
                      .join(' ')} END`,
                  ),
                  description: Sequelize.literal(
                    `CASE ${chunk
                      .map(
                        (coupon) =>
                          `WHEN id='${coupon.id}' THEN '${coupon.description}'`,
                      )
                      .join(' ')} END`,
                  ),
                  couponCode: Sequelize.literal(
                    `CASE ${chunk
                      .map(
                        (coupon) =>
                          `WHEN id='${coupon.id}' THEN '${coupon.coupon_code}'`,
                      )
                      .join(' ')} END`,
                  ),
                },
                {
                  where: { id: { [Op.in]: chunkIds } },
                },
              );

              console.log('Coupons Updated Chunk: ', i + chunkSize);
            }
          } else {
            console.log('No coupons needed to be updated!');
          }

          let end = performance.now() - start;
          console.log('Time taken for updating coupon: ', end);
        } catch (error) {
          console.error('Error while updating coupons in CRON job: ', error);
        }
      }

      async function insertNewCoupons() {
        try {
        } catch (error) {
          console.error(
            'Error while inserting new coupons in CRON job: ',
            error,
          );
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
