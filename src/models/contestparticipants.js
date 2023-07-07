import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class ContestParticipants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(ContestParticipants, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });
      ContestParticipants.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_contestparticipants_fk_constraint',
      });
      models.Contest.hasMany(ContestParticipants, {
        foreignKey: 'contestId',
        sourceKey: 'id',
      });
      ContestParticipants.belongsTo(models.Contest, {
        foreignKey: 'contestId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'contest_contestparticipants_fk_constraint',
      });
    }
  }
  ContestParticipants.init(
    {
      contestId: { type: DataTypes.STRING, allowNull: false },
      userId: { type: DataTypes.STRING, allowNull: false },
    },
    {
      name: {
        singular: 'participant',
        plural: 'participants',
      },
      sequelize,
      modelName: 'ContestParticipants',
    },
  );
  return ContestParticipants;
};
