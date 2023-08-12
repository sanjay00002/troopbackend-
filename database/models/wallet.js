import { Model } from "sequelize";
import { generateUserId } from "../../backend/src/lib/userId";

export default (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasOne(Wallet, {
        foreignKey: "userId",
        sourceKey: "id",
      });

      Wallet.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: "user_wallet_fk_constraint",
      });
    }
  }
  Wallet.init(
    {
      cashAmount: { type: DataTypes.DOUBLE, defaultValue: 0 },
      winAmount: { type: DataTypes.DOUBLE, defaultValue: 0 },
      bonusAmount: { type: DataTypes.DOUBLE, defaultValue: 0 },
      userId: { type: DataTypes.STRING, allowNull: false },
    },
    {
      name: {
        plural: "wallets",
        singular: "wallet",
      },
      sequelize,
      modelName: "Wallet",
    }
  );
  Wallet.beforeValidate(async (wallet, options) => {
    if (wallet.isNewRecord) {
      const id = `Wallet-${await generateUserId()}`;
      wallet.id = id;
    }
  });
  return Wallet;
};
