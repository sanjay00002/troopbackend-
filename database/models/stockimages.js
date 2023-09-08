"use strict";
import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class StockImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockImages.init(
    {
      stockName: DataTypes.STRING,
      stockImageUrl: DataTypes.STRING,
      stockImageId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "StockImages",
    }
  );
  return StockImages;
};
