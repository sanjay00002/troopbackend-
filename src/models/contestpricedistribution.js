'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ContestPriceDistribution extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Contest.hasMany(ContestPriceDistribution, {
        foreignKey: 'contestId',
        sourceKey: 'id',
      });

      ContestPriceDistribution.belongsTo(models.Contest, {
        foreignKey: 'contestId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'contest_contestpricedistribution_fk_constraint',
      });
    }
  }
  ContestPriceDistribution.init(
    {
      contestId: { type: DataTypes.STRING, allowNull: false },
      rankStart: { type: DataTypes.INTEGER, allowNull: false },
      rankEnd: { type: DataTypes.INTEGER, allowNull: false },
      priceAmount: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'ContestPriceDistribution',
    },
  );
  return ContestPriceDistribution;
};
