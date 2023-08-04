import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ContestPortfolios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.Contest.hasMany(ContestPortfolios, {
        foreignKey: 'contestId',
        sourceKey: 'id',
      });

      ContestPortfolios.belongsTo(models.Contest, {
        foreignKey: 'contestId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'contest_contestportfolios_fk_constraint',
      });

      models.Portfolio.hasMany(ContestPortfolios, {
        foreignKey: 'portfolioId',
        sourceKey: 'id',
      });

      ContestPortfolios.belongsTo(models.Portfolio, {
        foreignKey: 'portfolioId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'portfolio_contestportfolio_fk_constraint',
      });

      models.Contest.belongsToMany(models.Portfolio, {
        through: ContestPortfolios,
      });
      models.Portfolio.belongsToMany(models.Contest, {
        through: ContestPortfolios,
      });
    }
  }
  ContestPortfolios.init(
    {
      portfolioId: { type: DataTypes.INTEGER, allowNull: false },
      contestId: { type: DataTypes.STRING, allowNull: false },
    },
    {
      name: {
        singular: 'contestPortfolio',
        plural: 'contestPortfolios',
      },
      sequelize,
      modelName: 'ContestPortfolios',
    },
  );
  return ContestPortfolios;
};
