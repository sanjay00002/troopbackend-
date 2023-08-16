import { Model } from 'sequelize';
import { generateUserId } from '../../lib/generateId';

export default (sequelize, DataTypes) => {
  class CommonWallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CommonWallet.init(
    {
      cashAmount: { type: DataTypes.DOUBLE, defaultValue: 0 },
      winAmount: { type: DataTypes.DOUBLE, defaultValue: 0 },
      bonusAmount: { type: DataTypes.DOUBLE, defaultValue: 0 },
      purpose: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      name: {
        singular: 'commonWallet',
        plural: 'commonWallets',
      },
      sequelize,
      modelName: 'CommonWallet',
    }
  );
  CommonWallet.beforeValidate(async (wallet, options) => {
    if (wallet.isNewRecord) {
      const id = `CWallet-${await generateUserId()}`;
      wallet.id = id;
    }
  });
  return CommonWallet;
};
