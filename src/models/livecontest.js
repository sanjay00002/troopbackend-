const { Model } = require('sequelize');
import { nanoid } from 'nanoid/async';

export default (sequelize, DataTypes) => {
  class LiveContest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Stocks.hasMany(LiveContest, {
        foreignKey: 'stock1Id',
        sourceKey: 'id',
      });

      LiveContest.belongsTo(models.Stocks, {
        foreignKey: 'stock1Id',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'livecontest_stock1_fk_constraint',
      });

      models.Stocks.hasMany(LiveContest, {
        foreignKey: 'stock2Id',
        sourceKey: 'id',
      });

      LiveContest.belongsTo(models.Stocks, {
        foreignKey: 'stock2Id',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'livecontest_stock2_fk_constraint',
      });

      models.Users.hasMany(LiveContest, {
        foreignKey: 'createdBy',
        sourceKey: 'id',
      });

      LiveContest.belongsTo(models.Users, {
        foreignKey: 'createdBy',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'livecontest_user_fk_constraint',
      });

    }
  }
  LiveContest.init(
    {
      stock1Id: { type: DataTypes.INTEGER, allowNull: false },
      stock2Id: { type: DataTypes.INTEGER, allowNull: false },
      entryAmount: { type: DataTypes.DOUBLE, allowNull: false },
      createdBy: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'LiveContest',
    },
  );
  LiveContest.beforeValidate(async (contest, option) => {
    if (LiveContest.isNewRecord) {
      const id = await nanoid(10);
      contest.id = id;
    }
  });
  return LiveContest;
};
