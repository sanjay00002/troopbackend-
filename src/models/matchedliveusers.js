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
        foreignKey: 'apponentId',
        sourceKey: 'id',
      });

      MatchedLiveUser.belongsTo(models.User, {
        foreignKey: 'apponentId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'matchedlive_apponent_fk_constraint',
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
        foreignKey: 'apponnetSelectedStockId',
        sourceKey: 'id',
      });

      MatchedLiveUser.belongsTo(models.Stocks, {
        foreignKey: 'apponnetSelectedStockId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'matchedlive_apponentStock_fk_constraint',
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
      apponentId: { type: DataTypes.STRING, allowNull: false },
      selfSelectedStockId: { type: DataTypes.INTEGER, allowNull: false},
      selfStockOpenValue: { type: DataTypes.INTEGER, allowNull: true},
      selfStockCloseValue: { type: DataTypes.INTEGER, allowNull: true},
      apponnetSelectedStockId: { type: DataTypes.INTEGER, allowNull: false },
      apponentStockOpenValue: { type: DataTypes.INTEGER, allowNull: true},
      apponentStockCloseValue: { type: DataTypes.INTEGER, allowNull: true},
      contestId: { type: DataTypes.STRING, allowNull: false },
      winner: {
        type: DataTypes.ENUM([
            'Self',
            'Apponent'
        ])
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
