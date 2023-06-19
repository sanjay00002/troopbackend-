import { Model } from 'sequelize';
import { generateUserId } from '../lib/userId';
export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        defaultValue: 'Trooper',
      },
      phoneNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
      firstName: { type: DataTypes.STRING, allowNull: true },
      lastName: { type: DataTypes.STRING, allowNull: true },
      profileImage: { type: DataTypes.STRING, allowNull: true },
      referralCode: { type: DataTypes.STRING, allowNull: true },
      referrer: { type: DataTypes.STRING, allowNull: true },
      referredAt: { type: DataTypes.DATE, allowNull: true },
      accessToken: { type: DataTypes.STRING, allowNull: true },
      refreshToken: { type: DataTypes.STRING, allowNull: true },
      loggedInAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  User.beforeCreate(async (user, option) => {
    if (user.isNewRecord) {
      const id = `Troop-${await generateUserId()}`;
      user.id = id;
    }
  });
  return User;
};
