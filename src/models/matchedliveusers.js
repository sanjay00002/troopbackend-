const { Model } = require('sequelize');
import { nanoid } from 'nanoid/async';

export default (sequelize, DataTypes) => {
  class MatchedLiveUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(MatchedLiveUser, {
        foreignKey: 'selfId',
        sourceKey: 'id',
      });

      MatchedLiveUser.belongsTo(models.User, {
        foreignKey: 'selfId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'matchedlive_selfuser_fk_constraint',
      });

      models.User.hasMany(MatchedLiveUser, {
        foreignKey: 'opponentId',
        sourceKey: 'id',
      });

      MatchedLiveUser.belongsTo(models.User, {
        foreignKey: 'opponentId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'matchedlive_opponent_fk_constraint',
      });

      models.Stocks.hasMany(MatchedLiveUser, {
        foreignKey: 'selfSelectedStockId',
        sourceKey: 'id',
      });

      MatchedLiveUser.belongsTo(models.Stocks, {
        foreignKey: 'selfSelectedStockId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'matchedlive_selfStock_fk_constraint',
      });

      models.Stocks.hasMany(MatchedLiveUser, {
        foreignKey: 'opponnetSelectedStockId',
        sourceKey: 'id',
      });

      MatchedLiveUser.belongsTo(models.Stocks, {
        foreignKey: 'opponnetSelectedStockId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'matchedlive_opponentStock_fk_constraint',
      });

      models.Contest.hasMany(MatchedLiveUser, {
        foreignKey: 'contestId',
        sourceKey: 'id',
      });

      MatchedLiveUser.belongsTo(models.Contest, {
        foreignKey: 'contestId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'matchedlive_contest_fk_constraint',
      });
    }
  }
  MatchedLiveUser.init(
    {
      selfId: { type: DataTypes.STRING, allowNull: false },
      opponentId: { type: DataTypes.STRING, allowNull: false },
      selfSelectedStockId: { type: DataTypes.INTEGER, allowNull: false },
      selfStockOpenValue: { type: DataTypes.INTEGER, allowNull: true },
      selfStockCloseValue: { type: DataTypes.INTEGER, allowNull: true },
      opponnetSelectedStockId: { type: DataTypes.INTEGER, allowNull: false },
      opponentStockOpenValue: { type: DataTypes.INTEGER, allowNull: true },
      opponentStockCloseValue: { type: DataTypes.INTEGER, allowNull: true },
      contestId: { type: DataTypes.STRING, allowNull: false },
      winner: {
        type: DataTypes.ENUM(['Self', 'Opponent']),
      },
    },
    {
      sequelize,
      modelName: 'MatchedLiveUser',
    },
  );
  MatchedLiveUser.beforeValidate(async (match, option) => {
    if (match.isNewRecord) {
      const id = await nanoid(10);
      match.id = id;
    }
  });
  return MatchedLiveUser;
};
