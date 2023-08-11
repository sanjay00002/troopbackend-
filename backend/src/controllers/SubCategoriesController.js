import model from '../models';

const { SubCategories } = model;

export default {
  getContestSubCategories: async function (req, res) {
    try {
      const subCategories = await SubCategories.findAll({
        order: [['id', 'ASC']],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
      });
      console.log('Sub Categories: ', subCategories);

      return res.status(200).json({
        data: subCategories,
      });
    } catch (error) {
      console.error('Error while getting sub-categories: ', error);
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while getting sub-categories',
      });
    }
  },
};
