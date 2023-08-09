import express, { json } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import { createServer } from 'http';
import { Server } from 'socket.io';
import momentTimezone from 'moment-timezone';
import moment from 'moment/moment';

import authRouter from './src/routes/auth';
import userRouter from './src/routes/user';
import contestRouter from './src/routes/contest';
import botRouter from './src/routes/bot';
import subCategoriesRouter from './src/routes/subCategories';
import stocksRouter from './src/routes/stocks';
import walletRouter from './src/routes/wallet';
import groupchatRouter from './src/routes/groupchatRouter';
import portfolioRouter from './src/routes/portfolio';
import crateRouter from './src/routes/crate';
import winningsRouter from './src/routes/winnings';

import createContestsCronJobs from './src/cron/createContests';
import declareWinnersCronJobs from './src/cron/declareWinners';
import botsJoinContestsCronJobs from './src/cron/bots/joinContests';

const chatWSServer = require('./chatWS');

import model from './src/models';

import { generateReferralCode } from './src/lib/referralCode';

import { getAllCoupons } from './src/api/rewards/coupons';
import { getAllOffers } from './src/api/rewards/rewards';

const { User, UserRole, Role, Wallet, CommonWallet, CouponRewards, Rewards } =
  model;

import liveContestRouter from './src/routes/liveContest';
import bankDetailRouter from './src/routes/bankDetail';
import faqRouter from './src/routes/faq';

const findMatch = require('./src/socketfiles/findMatch');
const joinLiveContest = require('./src/socketfiles/joinLiveContest');

const currentUserCount = require('./src/socketfiles/currentUserCount');
const getStock = require('./Stock-socket/getStocks');

const { createAdapter } = require('@socket.io/postgres-adapter');
const { Pool } = require('pg');
// require('dotenv').config({ path: './.env.local' });
require('dotenv').config({ path: './.env' });
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

io.on('connection', (socket) => {
  socket.on('send-stock-tokens', (stock_token) => {
    getStock(io, socket, stock_token, true);
  });
});

const normalContest = io.of('/normalContest');

normalContest.on('connection', (socket) => {
  // socket connection to show the live contest joined users
  socket.on('user-count', (contests) => {
    // here the contest id list is fetched from the frontend
    contests.forEach((contest) => {
      currentUserCount(io, socket, pool, contest);
    });
  });
});

// Creating a namespace for handling all the socket connections for live econtests

const liveContest = io.of('/liveContest');

liveContest.on('connection', (socket) => {
  // console.log("Live contest socket connected");
  socket.emit('get-socket-id', socket.id);

  socket.on('add-in-db', (user) => {
    joinLiveContest(socket, pool, user);
  });

  socket.on('find-match', (user) => {
    findMatch(io, socket, pool, user);
  });
});

const slotMachine = io.of('/slotMachine');

slotMachine.on('connection', (socket) => {
  socket.on('triggered', () => {
    console.log('Slot Machine triggered');
  });
});

const port = process.env.PORT || 5000;

app.use(cors());
app.use(json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

sequelize
  .authenticate()
  .then((res) => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/contest', contestRouter);
app.use('/api/v1/bot', botRouter);
app.use('/api/v1/sub-category', subCategoriesRouter);
app.use('/api/v1/stocks', stocksRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/v1/groupchat', groupchatRouter);
app.use('/api/v1/portfolio', portfolioRouter);
app.use('/api/v1/live-contest', liveContestRouter);
app.use('/api/v1/bank-detail', bankDetailRouter);
app.use('/api/v1/faq', faqRouter);
app.use('/api/v1/crates', crateRouter);
app.use('/api/v1/winnings', winningsRouter);

io.adapter(createAdapter(pool));
// server started using socket rather than express
httpServer.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
  (async () => {
    try {
      const referralCode = await generateReferralCode();

      const userDetails = {
        firstName: process.env.ADMIN_FIRSTNAME,
        lastName: process.env.ADMIN_LASTNAME,
        username: process.env.ADMIN_USERNAME,
        phoneNumber: process.env.ADMIN_PHONE_NUMBER,
        email: process.env.ADMIN_EMAIL,
        referralCode,
      };

      const existingUser = await User.findOne({
        where: {
          username: process.env.ADMIN_USERNAME,
        },
      });

      if (existingUser === null) {
        const newUser = await User.create({
          username: userDetails?.username ?? username,
          phoneNumber: userDetails?.phoneNumber,
          email: userDetails?.email,
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          referralCode: referralCode,
          referrer: userDetails?.referrer,
        });

        const role = await Role.findOne({
          where: { role: process.env.ADMIN_ROLE },
        });

        if (role) {
          const newUserId = await newUser?.get('id');

          const roleId = await role?.get('id');

          await UserRole.create({
            userId: newUserId,
            roleId: roleId,
          });

          await Wallet.create({
            userId: newUserId,
          });

          console.log('Admin user created successfully');
        } else {
          throw Error("Given role doesn't exist!");
        }
      } else {
        throw Error('Exists a user with the given username');
      }
    } catch (error) {
      console.error('Error creating admin user: ', error);
    }
  })();

  // * Common Wallet for Bots
  (async () => {
    try {
      const existingWallet = await CommonWallet.findOne({
        where: { purpose: 'bots' },
      });
      if (existingWallet === null) {
        const newCommonWallet = await CommonWallet.create({
          purpose: 'bots',
        });

        console.log('Successfully created Common Wallet!');
      } else {
        throw new Error('Common wallet already exists');
      }
    } catch (error) {
      console.error('Error creating common wallet for bots: ', error);
    }
  })();

  // * Populate the CouponRewards & Rewards Tables
  (async () => {
    console.log('Started');
    let wholeStart = performance.now(),
      couponsLength,
      rewardsLength;
    try {
      let start = performance.now();
      const couponCount = await CouponRewards.count();
      if (couponCount === 0) {
        const coupons = await getAllCoupons();

        const currentTimestamp = momentTimezone.tz(moment(), 'Asia/Kolkata');
        const length = coupons.length;
        const couponsToInsert = [];

        for (let index = 0; index < length; ++index) {
          const coupon = coupons[index];

          couponsToInsert.push({
            id: coupon.coupon_id,
            merchantId: coupon.merchant_id,
            title: coupon.title,
            description: coupon.description,
            discount: coupon.discount,
            couponCode: coupon.coupon_code,
            plainLink: coupon.plain_link,
            minPurchase: coupon.min_purchase,
            maxDiscount: coupon.max_discount,
            terms: coupon.terms,
            startDate: coupon.start_date
              ? moment(coupon.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
              : null,
            endDate: coupon.end_date
              ? moment(coupon.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
              : null,
            affiliateLink: coupon.affiliate_link,
            merchantLogo: coupon.merchant_logo,
            merchantName: coupon.merchant_name,
            createdAt: currentTimestamp.toISOString(),
            updatedAt: currentTimestamp.toISOString(),
          });
        }

        const chunkSize = 50,
          dataLength = couponsToInsert.length;
        couponsLength = dataLength;

        for (let i = 0; i < dataLength; i += chunkSize) {
          const chunk = couponsToInsert.slice(i, i + chunkSize);
          await CouponRewards.bulkCreate(chunk, {
            validate: true,
            individualHooks: true,
          });

          console.log('Chunk inserted: ', chunk.length);
        }

        let end = performance.now() - start;
        console.log('CouponRewards Populated: ', end);
      } else {
        console.log('CouponRewards already populated!');
      }

      const rewardCount = await Rewards.count();

      if (rewardCount === 0) {
        let start = performance.now();
        const offers = await getAllOffers();

        const currentTimestamp = momentTimezone.tz(moment(), 'Asia/Kolkata');
        const length = offers.length;
        const offersToInsert = [];

        for (let index = 0; index < length; ++index) {
          const offer = offers[index];

          offersToInsert.push({
            id: offer.coupon_id,
            merchantId: offer.merchant_id,
            title: offer.title,
            description: offer.description,
            discount: offer.discount,
            plainLink: offer.plain_link,
            minPurchase: offer.min_purchase,
            maxDiscount: offer.max_discount,
            terms: offer.terms,
            startDate: offer.start_date
              ? moment(offer.start_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
              : null,
            endDate: offer.end_date
              ? moment(offer.end_date, 'DD-MM-YYYY').format('YYYY-MM-DD')
              : null,
            affiliateLink: offer.affiliate_link,
            merchantLogo: offer.merchant_logo,
            merchantName: offer.merchant_name,
            createdAt: currentTimestamp.toISOString(),
            updatedAt: currentTimestamp.toISOString(),
          });
        }

        const chunkSize = 50,
          dataLength = offersToInsert.length;
        rewardsLength = dataLength;

        for (let i = 0; i < dataLength; i += chunkSize) {
          const chunk = offersToInsert.slice(i, i + chunkSize);
          await Rewards.bulkCreate(chunk, {
            validate: true,
            individualHooks: true,
          }).catch((error) => console.log('Error in Bulk Create: ', error));

          console.log('Chunk inserted: ', chunk.length);
        }

        let end = performance.now() - start;

        console.log('CouponRewards Populated: ', end);
      } else {
        console.log('Rewards already popluated!');
      }
      let wholeEnd = performance.now() - wholeStart;
      console.log('Time Taken:- ', wholeEnd);
      console.log('Coupons: ', couponsLength);
      console.log('Rewards: ', rewardsLength);
    } catch (error) {
      console.error(
        'Error while Populating the CouponRewards or Rewards Table',
        error,
      );
    }
  })();

  createContestsCronJobs();
  declareWinnersCronJobs();
  botsJoinContestsCronJobs();
});

chatWSServer.listen('5002', () => {
  console.log('chat ws server listening on 5002');
});
