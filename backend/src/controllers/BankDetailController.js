import { Op, Sequelize } from 'sequelize';
import model from '../../../database/models';
import moment from 'moment';

const { User, BankDetail } = model;

export default {
  addBankDetail: async function (req, res) {
    const bankDetail = req.body;
    const userId = req.id;

    try {
      const user = await User.findByPk(userId);
      const bankdetailcheck = await BankDetail.findOne({
        where: { userId: userId },
      });
      if (user && !user?.isBot) {
        if (bankdetailcheck) {
          return res
            .status(400)
            .json({
              message: 'Bank details already present for the existing user',
            });
        } else {
          const newBdl = await BankDetail.create({
            bankAccount: bankDetail?.bankAccount,
            ifsc: bankDetail?.ifsc,
            address: bankDetail?.address,
            userId: userId,
          });

          if (newBdl) {
            return res.status(201).json(newBdl);
          }
        }
      } else {
        return res.status(400).json({
          message: 'Cannot add bank detail without non-existing user!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while adding bank details',
        errorMessage: error.message,
      });
    }
  },

  getBankDetailById: async function (req, res) {
    const bankdetailId = req.body.id;

    try {
      // * Fetch the contest and the prize distribution
      const bankDetail = await BankDetail.findByPk(bankdetailId);

      console.log('BankDetail: ', bankDetail);

      if (bankDetail) {
        return res.status(200).json(bankDetail);
      } else {
        return res.status(404).json({ error: 'No bank detail found!' });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while fetching bank detail by id',
        errorMessage: error.message,
      });
    }
  },

  updateBankDetail: async function (req, res) {
    const newbankDetail = req.body;

    try {
      const bankDetail = await BankDetail.findByPk(newbankDetail.id);
      if (bankDetail) {
        await bankDetail.update({
          bankAccount: newbankDetail?.bankAccount ?? bankDetail.bankAccount,
          ifsc: newbankDetail?.ifsc ?? bankDetail.ifsc,
          address: newbankDetail?.address ?? bankDetail.address,
        });

        const result = await bankDetail.get();
        return res.status(200).json(result);
      } else {
        return res.status(404).json({
          error: 'No Bank details Found!',
        });
      }
    } catch (error) {
      console.error('Error while updating Bank Detail', error);
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while updating the bankdetail!',
      });
    }
  },
};
