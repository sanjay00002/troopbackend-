import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ContestStocks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Stocks.hasMany(ContestStocks, {
        foreignKey: 'stockId',
        sourceKey: 'id',
      });

      ContestStocks.belongsTo(models.Stocks, {
        foreignKey: 'stockId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'stocks_conteststocks_fk_constraint',
      });
    }
  }
  ContestStocks.init(
    {
      stockId: { type: DataTypes.INTEGER, allowNull: false },
      contestId: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: 'ContestStocks',
    },
  );
  return ContestStocks;
};
