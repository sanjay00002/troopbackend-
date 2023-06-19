import { Op } from 'sequelize';
import model from '../models';

const { Contest } = model;

export default {
  createContest: async function (req, res) {
    const contest = req.body;
    const userId = req.id;

    try {
      const newContest = await Contest.create({
        name: contest?.name,
        category: contest?.category,
        pricePool: contest?.pricePool,
        createdBy: userId,
        slots: contest?.slots,
        startTime: contest?.startTime,
        endTime: contest?.endTime,
        priceDistribution: contest?.priceDistribution,
      });

      if (await newContest.get('id')) {
        return res.status(201).json({
          ...(await newContest.get()),
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while creating the contest',
        errorMessage: error.message,
      });
    }
  },

  getContestById: async function (req, res) {
    const { id } = req.body;

    try {
      const contest = await Contest.findOne({
        where: {
          id: id,
        },
      });

      if (contest) {
        return res.status(200).json({
          ...(await contest.get()),
        });
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

  getContestsByCategory: async function (req, res) {
    const { category } = req.body;

    try {
      const contest = await Contest.findAll({
        where: {
          category: category,
        },
      });

      if (contest) {
        return res.status(200).json(contest);
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
};
