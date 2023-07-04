const { Model } = require('sequelize');
import { nanoid } from 'nanoid/async';

export default (sequelize, DataTypes) => {
  class Contest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(Contest, {
        foreignKey: 'createdBy',
        sourceKey: 'id',
      });

      Contest.belongsTo(models.User, {
        foreignKey: 'createdBy',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_contest_fk_constraint',
      });

      models.SubCategories.hasOne(Contest, {
        foreignKey: 'subCategoryId',
        sourceKey: 'id',
      });

      Contest.belongsTo(models.SubCategories, {
        foreignKey: 'subCategoryId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'subcategories_contest_fk_constraint',
      });
    }
  }
  Contest.init(
    {
      category: {
        type: DataTypes.ENUM([
          'Special',
          'Sectoral',
          'Practice',
          'Head2Head',
          'Private',
          'Mega',
        ]),
        allowNull: false,
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: true },
      image: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.STRING(512), allowNull: true },
      entryAmount: { type: DataTypes.DOUBLE, allowNull: false },
      pricePool: { type: DataTypes.DOUBLE, allowNull: false },
      likes: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      slots: { type: DataTypes.INTEGER, allowNull: false },
      startTime: { type: DataTypes.DATE, allowNull: false },
      endTime: { type: DataTypes.DATE, allowNull: false },
      createdBy: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Contest',
    },
  );
  Contest.beforeValidate(async (contest, option) => {
    if (contest.isNewRecord) {
      const id = await nanoid(10);
      contest.id = id;
    }
  });
  return Contest;
};
