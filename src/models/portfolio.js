import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.User.hasMany(Portfolio, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });

      Portfolio.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        keyType: DataTypes.STRING,
        constraints: true,
        uniqueKey: 'user_portfolio_fk_constraint',
      });

      models.SubCategories.hasMany(Portfolio, {
        foreignKey: 'subCategoryId',
        sourceKey: 'id',
      });

      Portfolio.belongsTo(models.SubCategories, {
        foreignKey: 'subCategoryId',
        targetKey: 'id',
        keyType: DataTypes.INTEGER,
        constraints: true,
        uniqueKey: 'subcategories_portfolio_fk_constraint',
      });
    }
  }
  Portfolio.init(
    {
      name: { type: DataTypes.STRING, allowNull: true },
      userId: { type: DataTypes.STRING, allowNull: false },
      score: { type: DataTypes.INTEGER, defaultValue: 0 },
      subCategoryId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'Portfolio',
    },
  );
  return Portfolio;
};
