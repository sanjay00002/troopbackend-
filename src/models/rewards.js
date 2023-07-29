import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Rewards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Rewards.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      name: {
        singular: 'reward',
        plural: 'rewards',
      },
      sequelize,
      modelName: 'Rewards',
    },
  );
  return Rewards;
};
