import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class StocksSubCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Stocks.hasMany(StocksSubCategories, {
        foreignKey: 'stockId',
        sourceKey: 'id',
      });

      StocksSubCategories.belongsTo(models.Stocks, {
        foreignKey: 'stockId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'stock_subcategories_fk_constraint',
      });

      models.SubCategories.hasMany(StocksSubCategories, {
        foreignKey: 'subCategoryId',
        sourceKey: 'id',
      });

      StocksSubCategories.belongsTo(models.SubCategories, {
        foreignKey: 'subCategoryId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'subcategories_stockssubcategories_fk_constraint',
      });
    }
  }
  StocksSubCategories.init(
    {
      stockId: { type: DataTypes.INTEGER, allowNull: false },
      subCategoryId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'StocksSubCategories',
    },
  );
  return StocksSubCategories;
};
