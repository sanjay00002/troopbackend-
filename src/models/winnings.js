import { Model } from 'sequelize';
import { generateUserId } from '../lib/userId';
export default (sequelize, DataTypes) => {
  class Winnings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.CrateCategories.hasMany(Winnings, {
        foreignKey: 'crateCategoryId',
        sourceKey: 'id',
      });

      Winnings.belongsTo(models.CrateCategories, {
        foreignKey: 'crateCategoryId',
        keyType: DataTypes.INTEGER,
        constraints: true,
        targetKey: 'id',
        uniqueKey: 'cratecategories_winnings_fk_constraint',
      });

      models.User.hasMany(Winnings, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });

      Winnings.belongsTo(models.User, {
        foreignKey: 'userId',
        keyType: DataTypes.STRING,
        constraints: true,
        targetKey: 'id',
        uniqueKey: 'user_winnings_fk_constraint',
      });

      models.RewardsLent.hasMany(Winnings, {
        foreignKey: 'rewardsLentId',
        sourceKey: 'id',
      });

      Winnings.belongsTo(models.RewardsLent, {
        foreignKey: 'rewardsLentId',
        keyType: DataTypes.STRING,
        constraints: true,
        targetKey: 'id',
        uniqueKey: 'rewardsLent_winnings_fk_constraint',
      });
    }
  }
  Winnings.init(
    {
      crateCategoryId: { type: DataTypes.INTEGER, allowNull: false },
      rewardsLentId: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
    },
    {
      name: {
        singular: 'winning',
        plural: 'winnings',
      },
      sequelize,
      modelName: 'Winnings',
    },
  );
  Winnings.beforeValidate((winning, options) => {
    if (winning.isNewRecord) {
      const id = `Win-${generateUserId(10)}`;

      winning.id = id;
    }
  });
  return Winnings;
};
