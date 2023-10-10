import { Model } from "sequelize";
import { nanoid } from "nanoid/async";
// import("nanoid/async").then((nanoid) => nanoid);

/**
 * [
      'Special',
      'Sectoral',
      'Practice',
      'Head2Head',
      'Private',
      'Mega',
    ]
 */

export default (sequelize, DataTypes) => {
  class Contest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.ContestCategories.hasMany(Contest, {
        foreignKey: "categoryId",
        sourceKey: "id",
      });

      Contest.belongsTo(models.ContestCategories, {
        foreignKey: "categoryId",
        targetKey: "id",
        keyType: DataTypes.INTEGER,
        constraints: true,
        uniqueKey: "contestcategories_contest_fk_constraint",
      });

      models.User.hasMany(Contest, {
        foreignKey: "createdBy",
        sourceKey: "id",
      });

      Contest.belongsTo(models.User, {
        foreignKey: "createdBy",
        targetKey: "id",
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: "user_contest_fk_constraint",
      });

      models.SubCategories.hasOne(Contest, {
        foreignKey: "subCategoryId",
        sourceKey: "id",
      });

      Contest.belongsTo(models.SubCategories, {
        foreignKey: "subCategoryId",
        targetKey: "id",
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: "subcategories_contest_fk_constraint",
      });
    }
  }
  Contest.init(
    {
      name: { type: DataTypes.STRING, allowNull: true },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      entryAmount: { type: DataTypes.DOUBLE, allowNull: false },
      pricePool: { type: DataTypes.DOUBLE, allowNull: false },
      likes: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
      slots: { type: DataTypes.INTEGER, allowNull: false },
      createdBy: { type: DataTypes.STRING, allowNull: false },
    },
    {
      name: {
        singular: "contest",
        plural: "contests",
      },
      sequelize,
      modelName: "Contest",
    }
  );
  Contest.beforeValidate(async (contest, option) => {
    if (contest.isNewRecord) {
      const id = await nanoid(10);
      contest.id = id;
    }
  });
  return Contest;
};
