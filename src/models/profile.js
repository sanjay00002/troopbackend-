import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.INTEGER,
        uniqueKey: 'user_profile_fk_constraint',
      });
      models.User.hasOne(Profile, {
        foreignKey: 'userId',
        sourceKey: 'id',
      });
    }
  }
  Profile.init(
    {
      profileImage: { type: DataTypes.STRING, allowNull: true },
      referralCode: { type: DataTypes.STRING, allowNull: false },
      referrer: { type: DataTypes.STRING, allowNull: true },
      referred_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Profile',
    },
  );
  return Profile;
};
