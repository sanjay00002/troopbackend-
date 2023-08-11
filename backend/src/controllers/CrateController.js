import models from '../models';

const { Crate, CrateCategories } = models;

export default {
  getCratesByUserId: async function (req, res) {
    const userId = req.id;
    try {
      const cratesArr = await Crate.findAll({
        where: {
          userId,
          opened: false,
        },
        include: {
          model: CrateCategories,
          required: true,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      });

      const crates = await Promise.all([
        ...cratesArr.map(async (crate) => await crate.get()),
      ]);

      return res.status(200).json(crates);
    } catch (error) {
      console.error('Error while fetching crates for the user: ', error);

      return res.status(500).json({
        error: 'Something went wrong while fetching crates for the user',
        errorMessage: error.message,
      });
    }
  },
};
