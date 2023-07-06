import { Op, Sequelize } from 'sequelize';
import model from '../models';
import moment from 'moment';

const {
  LiveContest,
  User,
  Stocks,
} = model;

export default {
  createLiveContest: async function (req, res) {
    const contest = req.body;
    const userId = req.id;

    try {
      const user = await User.findByPk(userId);

      if (user && !user?.isBot) {
        const newContest = await LiveContest.create({
          stock1Id: contest?.stock1Id,
          stock2Id: contest?.stock2Id,
          entryAmount: contest?.entryAmount,
          createdBy: userId,
        });

        const newContestId = await newContest.get('id');

        if (newContestId) {
          return res.status(201).json({
            ...(await newContest.get()),
          });
        }
      } else {
        return res.status(400).json({
          message: 'Cannot create contest without non-existing user!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while creating the contest',
        errorMessage: error.message,
      });
    }
  },

  getLiveContestById: async function (req, res) {
    const { id } = req.body;

    try {
      // * Fetch the contest and the prize distribution
      const contest = await LiveContest.findByPk(id);

      console.log('Constest: ', contest);

      if (contest) {
        // * Fetch the stocks related to the subCategory

        const stock1 = await Stocks.findByPk(contest.stock1Id)
        const stock2 = await Stocks.findByPk(contest.stock2Id)


        const stocksArr = {
            company1 : stock1,
            company2 : stock2,
        }

        console.log('Stocks Arr: ', stocksArr);

        const result = {
          ...(await contest.get()),
          stocks: stocksArr,

        };
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ error: 'No contest found!' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while fetching contest by id',
        errorMessage: error.message,
      });
    }
  },

  getLiveContests: async function (req,res){
    const userId = req.id
    try{
        const user = await User.findByPk(userId);
        if(user && !user?.isBot){
            const contests = await LiveContest.findAll({
              where: {
                isLive: true
              }
            })
            return res.status(200).json(contests);
        }else{
        return res.status(404).json({ error: 'No contest found!' });
        }
    }catch (error){
        return res.status(500).json({
            error: 'Something went wrong while fetching contests',
            errorMessage: error.message,
          });
    }
  }
};
