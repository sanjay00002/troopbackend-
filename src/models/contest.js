const { Model } = require('sequelize');
import { nanoid } from 'nanoid/async';

export default (sequelize, DataTypes) => {
  class Contest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(Contest, {
        foreignKey: 'createdBy',
        sourceKey: 'id',
      });

      Contest.belongsTo(models.User, {
        foreignKey: 'createdBy',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_contest_fk_constraint',
      });
    }
  }
  Contest.init(
    {
      category: DataTypes.ENUM([
        'Special',
        'Sectoral',
        'Practice',
        'Head2Head',
        'Custom',
      ]),
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING(512),
      pricePool: DataTypes.DOUBLE,
      likes: DataTypes.INTEGER,
      slots: DataTypes.INTEGER,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      participants: DataTypes.ARRAY(DataTypes.STRING),
      winners: DataTypes.ARRAY(DataTypes.JSON),
      priceDistribution: DataTypes.ARRAY(DataTypes.JSON),
    },
    {
      sequelize,
      modelName: 'Contest',
    },
  );
  Contest.beforeValidate(async (contest, option) => {
    if (contest.isNewRecord) {
      const id = await nanoid(10);
      contest.id = id;
    }
  });
  return Contest;
};
