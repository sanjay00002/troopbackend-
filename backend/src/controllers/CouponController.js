import models from '../../../database/models';
import {  Sequelize } from 'sequelize';
const moment = require('moment');

const { CouponRewards, CouponsLent, Coupons, User } = models;

import coupomatedClient from '../api/rewards/index';
require('dotenv').config();

export default {

//     getSingleCoupon: async function (req, res) {
//   try {
//     const userId = req.params.id; 
//     const user = await User.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const couponsLentId = req.params.couponsLentId;
//     const response = await coupomatedClient.get('/coupons/all', {
//       params: {
//         apikey: process.env.COUPOMATED_API_KEY,
//         format: 'json',
//         type: 'coupon',
//         userId: userId,
//         couponsLentId:couponsLentId,
//       },
//     });

//     if (response.statusText === 'OK') {
//       return res.json(response.data);
//     } else {
//       return res.status(response.status).json({ message: 'Error fetching coupon' });
//     }
//   } catch (error) {
//     console.error('Error while fetching a single coupon: ', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// },


  AssignCoupon: async function (req, res) {
   
    try {
          const userId = req.params.id;
          // console.log(userId)
          const user = await User.findByPk(userId);
        // console.log(user)
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
          
          const randomCoupon = await CouponRewards.findAll();
          let rand = Math.floor(Math.random() * randomCoupon.length);

          console.log(rand)
      if (!randomCoupon) {
        return res.status(404).json({ error: 'No available coupons.' });
      }
      // console.log(randomCoupon)

      const couponLent = await CouponsLent.create({
        merchantId: randomCoupon[rand].merchantId,
        title: randomCoupon[rand].title,
        description: randomCoupon[rand].description,
        discount: randomCoupon[rand].discount,
        plainLink: randomCoupon[rand].plainLink,
        minPurchase: randomCoupon[rand].minPurchase,
        maxDiscount: randomCoupon[rand].maxDiscount,
        terms: randomCoupon[rand].terms,
        startDate: randomCoupon[rand].startDate,
        endDate: randomCoupon[rand].endDate,
        merchantLogo: randomCoupon[rand].merchantLogo,
        merchantName: randomCoupon[rand].merchantName,
      });

      console.log(couponLent.id)

      // const couponId = randomCoupon.id;
      const updateCoupon = await Coupons.create(
        { redeemed: false,
          couponsLentId: couponLent.id,
          userId: userId,
        },
        
      );
      
      return res.status(201).json({
        message: 'User signed up successfully and received a coupon.',
        couponLent
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Something went wrong during sign-up and coupon assignment.',
        errorMessage: error.message,
      });
    }
  },

    redeemCoupon: async function (req, res)  {
    try {
      const userId = req.params.id;

      // const couponId = await Coupons.findOne({ id:Coupons.id})
      // const couponId2 = req.params.couponId;
      // // const couponId = req.params.Coupons.id;
      // console.log(couponId2)
      
      const coupon = await Coupons.findOne({ id: req.params.couponId ,userId: userId, redeemed: false });

      if (coupon) {
        const couponId = coupon.id;
        console.log(couponId);
      } else {
        console.log("Coupon not found");
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // const coupon1 = await Coupons.findOne({                        //error findOne shouldn't
      //   where: { id: coupon, userId: userId, redeemed: false },
      // });
      
      console.log('hello')
  
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found or already redeemed' });
      }

      await Coupons.update(
        { redeemed: true, redeemedAt: moment() },
        { where: { id: coupon.id } }
      );
  
      return res.status(200).json({ message: 'Coupon redeemed successfully' });
    } 
    catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Something went wrong during coupon redemption.',
        errorMessage: error.message,
      });
    }

  },

  UserHaveCoupon: async function (req, res) {
    try {
      const userId = req.params.id;
  
      const coupons = await Coupons.findAll({
        attributes: ['couponsLentId'],
        where: { userId },
      });
  
      if (!coupons || coupons.length === 0) {
        return res.status(404).json({ message: 'No coupons found for this user.' });
      }
  
      const couponLentIds = coupons.map((coupon) => coupon.couponsLentId);
      console.log(couponLentIds);

      const couponLentData = await CouponsLent.findAll({
        where: { id: couponLentIds },
      });
      console.log(couponLentData);
      
      if (!couponLentData || couponLentData.length === 0) {
        return res.status(404).json({ message: 'No coupon data found for the user.' });
      }
  
      return res.status(200).json({ couponLentData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'Something went wrong while fetching user coupons.',
        errorMessage: error.message,
      });
    }
  },
  

};
  

