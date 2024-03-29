import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ContestCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ContestCategories.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.STRING, allowNull: true },
      startTime: { type: DataTypes.TIME, allowNull: false },
      endTime: { type: DataTypes.TIME, allowNull: false },
    },
    {
      name: {
        singular: 'category',
        plural: 'categories',
      },
      sequelize,
      modelName: 'ContestCategories',
    },
  );
  return ContestCategories;
};
