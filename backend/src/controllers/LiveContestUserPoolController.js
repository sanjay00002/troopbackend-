import model from '../../../database/models';
const { LiveContestUserPool, User, LiveContest } = model;
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

export default {
  addBot: async (req, res) => {
    const { contestId, userStockId } = req.body;
    let botStockId;
    const dummyStockValue = 5000; // just for testing

    const liveContestObj = await LiveContest.findByPk(contestId);

    // Initializing bot stock id as other than the users
    if (liveContestObj.stock1Id == userStockId) {
      botStockId = liveContestObj.stock2Id;
    } else {
      botStockId = liveContestObj.stock1Id;
    }
    console.log('bot stock pick is                          ', botStockId);

    const bot = await User.create({
      isBot: true,
    });
    const newBotId = await bot.get('id');
    const socketId = 'Bot_User'; // might not be correct approach
    console.log('contest is:                    ', contestId);
    //     const sqlquery = `
    //   INSERT INTO public."LiveContestUserPool" (contestId, userId, socketId, stockId) VALUES ($1, $2, $3, $4)
    // `;
    //     const values = [contestId, newBotId, socketId, botStockId];
    //     pool.query(sqlquery, values, (error, result) => {
    //       if (error) {
    //         console.log(
    //           'Error entering bot into live contest user pool:   ',
    //           error,
    //         );
    //       } else {
    //         console.log('successfully entered bot into live contest user pool');
    //       }
    //     });
    res.status(201).json({ ...(await bot.get()) });
  },
};
