import { Model } from 'sequelize';
import { generateUserId } from '../lib/userId';
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
        foreignKey: 'user_id',
        sourceKey: 'id',
      });

      LiveContestUserPool.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_livecontest_fk_constraint',
      });

      models.Contest.hasMany(LiveContestUserPool, {
        foreignKey: 'contest_id',
        sourceKey: 'id',
      });

      LiveContestUserPool.belongsTo(models.Contest, {
        foreignKey: 'contest_id',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'contest_live_fk_constraint',
      });

      models.Stocks.hasMany(LiveContestUserPool, {
        foreignKey: 'stock_id',
        sourceKey: 'id',
      });

      LiveContestUserPool.belongsTo(models.Stocks, {
        foreignKey: 'stock_id',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'stock_live_fk_constraint',
      });
    }
  }
  LiveContestUserPool.init(
    {
      constest_id: { type: DataTypes.STRING, allowNull: false },
      user_id: { type: DataTypes.STRING, allowNull: false },
      socket_id: { type: DataTypes.STRING, allowNull: false },
      stock_id: { type: DataTypes.INTEGER, allowNull: true },
      matched: { type: DataTypes.BOOLEAN, allowNull: true },
    },
    {
      sequelize,
      modelName: 'LiveContestUserPool',
    },
  );
  LiveContestUserPool.beforeValidate(async (liveuser, options) => {
    if (liveuser.isNewRecord) {
      const id = `LiveContest-${await generateUserId()}`;
      liveuser.id = id;
    }
  });
  return LiveContestUserPool;
};
