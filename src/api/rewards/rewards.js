import coupomatedClient from '.';

require('dotenv').config();

export async function getAllOffers() {
  return await coupomatedClient.get('/coupons/all', {
    params: {
      apikey: process.env.COUPOMATED_API_KEY,
      type: 'offer',
      userType: 'all',
    },
  });
}
