import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Stocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stocks.belongsToMany(models.Contest, { through: models.ContestStocks });
    }
  }
  Stocks.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: 'Stocks',
    },
  );
  return Stocks;
};
