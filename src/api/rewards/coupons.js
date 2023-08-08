import coupomatedClient from '.';

require('dotenv').config();

export async function getAllCoupons() {
  return await coupomatedClient.get('/coupons/all', {
    params: {
      apikey: process.env.COUPOMATED_API_KEY,
      format: 'json',
      type: 'coupon',
      userType: 'all',
    },
  });
}
