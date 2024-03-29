import { Model } from 'sequelize';
import { generateUserId } from '../../lib/generateId';

export default (sequelize, DataTypes) => {
  class LiveContestUserPool extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(LiveContestUserPool, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });

      LiveContestUserPool.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_livecontest_fk_constraint',
      });

      models.Contest.hasMany(LiveContestUserPool, {
        foreignKey: 'contestId',
        sourceKey: 'id',
      });

      LiveContestUserPool.belongsTo(models.Contest, {
        foreignKey: 'contestId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'contest_live_fk_constraint',
      });

      models.Stocks.hasMany(LiveContestUserPool, {
        foreignKey: 'stockId',
        sourceKey: 'id',
      });

      LiveContestUserPool.belongsTo(models.Stocks, {
        foreignKey: 'stockId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'stock_live_fk_constraint',
      });
    }
  }
  LiveContestUserPool.init(
    {
      contestId: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
      socketId: { type: DataTypes.STRING, allowNull: false },
      stockId: { type: DataTypes.INTEGER, allowNull: true },
      stockValue: { type: DataTypes.FLOAT, allowNull: true },
      matched: { type: DataTypes.BOOLEAN, allowNull: true },
      isBot: { type: DataTypes.BOOLEAN, allowNull: true},
      contestEntryPrice: { type: DataTypes.INTEGER, allowNull:true},
      
    },
    {
      sequelize,
      modelName: 'LiveContestUserPool',
      tableName: 'LiveContestUserPool',
    }
  );
  LiveContestUserPool.beforeValidate(async (liveuser, options) => {
    if (liveuser.isNewRecord) {
      const id = `LiveContest-${await generateUserId()}`;
      liveuser.id = id;
    }
  });
  return LiveContestUserPool;
};
