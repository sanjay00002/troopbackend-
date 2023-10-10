import coupomatedClient from '.';

require('dotenv').config();

export async function getAllCoupons() {
  return await coupomatedClient
    .get('/coupons/all', {
      params: {
        apikey: process.env.COUPOMATED_API_KEY,
        format: 'json',
        type: 'coupon',
        userType: 'all',
      },
    })
    .then((response) => {
      if (response.statusText == 'OK') {
        return response.data;
      }
    })
    .catch((error) =>
      console.error('Error while fetching all coupons: ', error.response),
    );
}

export async function getUpdatedCoupons() {
  return await coupomatedClient
    .get('/coupons/updated', {
      params: {
        apikey: process.env.COUPOMATED_API_KEY,
        format: 'json',
        type: 'coupon',
        userType: 'all',
      },
    })
    .then((response) => {
      if (response.statusText == 'OK') {
        return response.data;
      }
    })
    .catch((error) =>
      console.error('Error while fetching the updated Coupons', error.response),
    );
}
