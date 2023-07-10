import models from '../models';

const { ContestCategories } = models;

export default {
  getContestCategories: async function (req, res) {
    try {
      const categories = await ContestCategories.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
      });
      console.log('Contest Categories: ', categories);

      if (categories) {
        return res.status(200).json({
          data: categories,
        });
      } else {
        return res.status(404).json({
          message: 'No categories for contest found',
        });
      }
    } catch (error) {
      console.error('Error while fetching categories of contest: ', error);
      return res.status(500).json({
        error: 'Something went wrong while fetching categories of contest',
        errorMessage: error.message,
      });
    }
  },
};
