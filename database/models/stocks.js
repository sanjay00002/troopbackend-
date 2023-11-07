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
    }
  }
  Stocks.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      token: { type: DataTypes.STRING, allowNull: false },
      exchangeType: { type: DataTypes.INTEGER, allowNull: false },
      open_price: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0},
      close_price: { type: DataTypes.DOUBLE, allowNull: true, defaultValue: 0},
      subCategory: { type: DataTypes.STRING, allowNull: false },
      status: {
        type: DataTypes.ENUM(['active', 'inactive']),
        defaultValue: 'active',
      },
      globalDataFeedsIdentifier: { type: DataTypes.STRING, allowNull: true}
    },
    {
      name: {
        plural: 'stocks',
        singular: 'stock',
      },
      sequelize,
      modelName: 'Stocks',
    },
  );
  return Stocks;
};
