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

      models.Contest.hasMany(Portfolio, {
        foreignKey: 'contestId',
        sourceKey: 'id',
      });

      Portfolio.belongsTo(models.Contest, {
        foreignKey: 'contestId',
        targetKey: 'id',
        keyType: DataTypes.STRING,
        constraints: true,
        uniqueKey: 'user_portfolio_fk_constraint',
      });

      // models.PortfolioStocks.hasMany(Portfolio, {
      //   foreignKey: 'portfolioId',
      //   sourceKey: 'id',
      // });

      // Portfolio.belongsTo(models.Contest, {
      //   foreignKey: 'portfolioId',
      //   targetKey: 'id',
      //   keyType: DataTypes.STRING,
      //   constraints: true,
      //   uniqueKey: 'user_portfolio_fk_constraint',
      // });

      models.Contest.hasMany(Portfolio, {
        foreignKey: 'name',
        sourceKey: 'id',
      });

      Portfolio.belongsTo(models.Contest, {
        foreignKey: 'name',
        targetKey: 'id',
        keyType: DataTypes.STRING,
        constraints: true,
        uniqueKey: 'user_portfolio_fk_constraint',
      });

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
      contestId: { type: DataTypes.STRING, allowNull: true },
      // portfolioId: { type: DataTypes.STRING, allowNull: true },
      userId: { type: DataTypes.STRING, allowNull: false },
      score: { type: DataTypes.DECIMAL(25, 10), defaultValue: 0 },
      subCategoryId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      name: {
        singular: 'portfolio',
        plural: 'portfolios',
      },
      sequelize,
      modelName: 'Portfolio',
    },
  );
  return Portfolio;
};
