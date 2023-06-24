import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ContestWinners extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(ContestWinners, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });
      ContestWinners.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_contestwinners_fk_constraint',
      });

      models.Contest.hasMany(ContestWinners, {
        foreignKey: 'contestId',
        sourceKey: 'id',
      });
      ContestWinners.belongsTo(models.Contest, {
        foreignKey: 'contestId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'contest_contestwinners_fk_constraint',
      });
    }
  }
  ContestWinners.init(
    {
      contestId: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
      rank: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: 'ContestWinners',
    },
  );
  return ContestWinners;
};
