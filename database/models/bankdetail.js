import { Model } from 'sequelize';
import { generateUserId } from '../../lib/generateId';
export default (sequelize, DataTypes) => {
  class BankDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasOne(BankDetail, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });

      BankDetail.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_bankDetail_fk_constraint',
      });
    }
  }
  BankDetail.init(
    {
      bankAccount: { type: DataTypes.STRING, allowNull: false },
      ifsc: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
    },
    {
      name: {
        plural: 'bankDetails',
        singular: 'bankDetail',
      },
      sequelize,
      modelName: 'BankDetail',
    }
  );
  BankDetail.beforeValidate(async (bankDetail, options) => {
    if (bankDetail.isNewRecord) {
      const id = `babk-${await generateUserId()}`;
      bankDetail.id = id;
    }
  });
  return BankDetail;
};
