import model from '../models';

const { Contest } = model;

export default {
  createContest: async function (req, res) {
    const contest = req.body;

    try {
      const newContest = await Contest.create({
        name: contest?.name,
        category: contest?.category,
        pricePool: contest?.pricePool,
        createdBy: contest?.createdBy,
        slots: contest?.slots,
        startTime: contest?.startTime,
        endTime: contest?.endTime,
        priceDistribution: contest?.priceDistribution,
      });

      if (await newContest.get('id')) {
        return res.status(200).json({
          id: await newContest.get('id'),
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while creating the contest',
        errorMessage: error.message,
      });
    }
  },
};
