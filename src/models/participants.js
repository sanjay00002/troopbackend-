import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Participants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(Participants, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });
      Participants.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_participants_fk_constraint',
      });
      models.Contest.hasMany(Participants, {
        foreignKey: 'contestId',
        sourceKey: 'id',
      });
      Participants.belongsTo(models.Contest, {
        foreignKey: 'contestId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'contest_participants_fk_constraint',
      });
    }
  }
  Participants.init(
    {
      points: DataTypes.INTEGER,
      selectedStocks: DataTypes.ARRAY(DataTypes.STRING),
      rank: DataTypes.INTEGER,
      joinedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Participants',
    },
  );
  return Participants;
};
