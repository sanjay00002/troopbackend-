import model from '../models';

const { Contest, Wallet } = model;

export default {
  payForContest: async function (req, res) {
    const userId = req.id;
    const { contestId } = req.body;
    try {
      const wallet = await Wallet.findOne({
        where: { userId },
      });

      if (wallet) {
        const contest = await Contest.findOne({
          where: { id: contestId },
        });

        if (contest) {
          let cashAmount = await wallet.get('cashAmount');
          const entryAmount = await contest.get('entryAmount');
          if (cashAmount >= entryAmount) {
            cashAmount -= entryAmount;

            await wallet.update({
              cashAmount: cashAmount,
            });

            return res.status(200).json({
              message: 'Successful Payment for the contest!',
            });
          } else {
            return res.status(422).json({
              message: 'Insufficient Wallet Balance',
            });
          }
        } else {
          return res.status(404).json({
            message: 'Provided a bad contest id',
          });
        }
      } else {
        return res.status(404).json({
          message: 'Wallet not found',
        });
      }
    } catch (error) {
      console.error(
        'Error while making payment for contest with wallet: ',
        error,
      );
      return res.status(500).json({
        errorMessage: error.message,
        error:
          'Something went wrong while making payment for contest with wallet!',
      });
    }
  },
};
