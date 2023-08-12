import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class CrateCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CrateCategories.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      cooldownTime: {
        type: DataTypes.ENUM(DataTypes.STRING),
        allowNull: false,
      },
    },
    {
      name: {
        singular: 'crateCategory',
        plural: 'crateCategories',
      },
      sequelize,
      modelName: 'CrateCategories',
    },
  );
  return CrateCategories;
};
