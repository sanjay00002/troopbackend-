import model from '../models';

const { Contest, ContestPriceDistribution, SubCategories, User } = model;

export default {
  createContest: async function (userId, contest) {
    try {
      console.log('CContest', contest);
      const subCategory = await SubCategories.findByPk(contest?.subCategoryId);

      // * Check if the sub category provided exists
      if (subCategory) {
        const newContest = await Contest.create({
          date: contest?.date,
          entryAmount: contest?.entryAmount,
          categoryId: contest?.categoryId,
          subCategoryId: subCategory.id,
          pricePool: contest?.pricePool,
          createdBy: userId,
          slots: contest?.slots,
        });

        const newContestId = await newContest.get('id');

        if (newContestId) {
          if (contest?.priceDistribution) {
            for (let i = 0; i < contest?.priceDistribution?.length; i++) {
              await ContestPriceDistribution.create({
                contestId: newContestId,
                rankStart: contest?.priceDistribution[i].rankStart,
                rankEnd: contest?.priceDistribution[i].rankEnd,
                priceAmount: contest?.priceDistribution[i].priceAmount,
              });
            }
          }
        }
      } else {
        throw new Error(
          'Cannot create contest without non-existing sub-category!',
        );
      }
    } catch (error) {
      console.error('Error while creating contest with CRON job: ', error);
    }
  },
};
