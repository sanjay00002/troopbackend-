import model from '../models';

const { Contest } = model;

export default {
  createContest: async function (req, res) {
    const contest = req.body;

    try {
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while creating the contest',
        errorMessage: error.message,
      });
    }
  },
};
