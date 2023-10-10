import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class PortfolioStocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.Portfolio.hasMany(PortfolioStocks, {
        foreignKey: 'portfolioId',
        sourceKey: 'id',
      });

      PortfolioStocks.belongsTo(models.Portfolio, {
        foreignKey: 'portfolioId',
        targetKey: 'id',
        keyType: DataTypes.INTEGER,
        constraints: true,
        uniqueKey: 'portfolio_portfoliostocks_fk_constraint',
      });

      models.Stocks.hasMany(PortfolioStocks, {
        foreignKey: 'stockId',
        sourceKey: 'id',
      });

      PortfolioStocks.belongsTo(models.Stocks, {
        foreignKey: 'stockId',
        targetKey: 'id',
        keyType: DataTypes.INTEGER,
        constraints: true,
        uniqueKey: 'stocks_portfoliostocks_fk_constraint',
      });
    }
  }
  PortfolioStocks.init(
    {
      portfolioId: DataTypes.INTEGER,
      stockId: { type: DataTypes.INTEGER, allowNull: false },
      action: { type: DataTypes.ENUM(['Buy', 'Sell', 'No Trade']) },
      captain: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      viceCaptain: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      name: {
        singular: 'portfolioStock',
        plural: 'portfolioStocks',
      },
      sequelize,
      modelName: 'PortfolioStocks',
    },
  );
  return PortfolioStocks;
};
