import { Model } from 'sequelize';
import { generateUserId } from '../lib/userId';
import { faker } from '@faker-js/faker/locale/en_IN';

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
        unique: true,
      },
      email: { type: DataTypes.STRING, allowNull: true, unique: true },
      phoneNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
      firstName: { type: DataTypes.STRING, allowNull: true },
      lastName: { type: DataTypes.STRING, allowNull: true },
      gender: {
        type: DataTypes.ENUM(['Male', 'Female', 'Other']),
        allowNull: true,
      },
      dob: { type: DataTypes.DATEONLY, allowNull: true },
      isBot: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      profileImage: { type: DataTypes.STRING, allowNull: true },
      score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      tickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
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
  User.beforeValidate(async (user, option) => {
    if (user.isNewRecord) {
      const id = user.dataValues.isBot
        ? `Bot-${await generateUserId()}`
        : `Troop-${await generateUserId()}`;
      user.id = id;

      if (user?.dataValues?.isBot === false) {
        if (
          !!user?.dataValues.firstName === false &&
          !!user?.dataValues.lastName === false
        ) {
          user.username = 'Trooper-' + user?.id.split('-')[1];
        }
        if (user?.dataValues.firstName && user?.dataValues.lastName) {
          const username = faker.internet.userName({
            firstName: user.dataValues.firstName,
            lastName: user.dataValues.lastName,
          });

          user.username = username;
        }
      }
    }
  });
  User.beforeCreate(async (user, options) => {
    if (user.isBot) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet.userName({
        firstName: firstName,
        lastName: lastName,
      });

      user.firstName = firstName;
      user.lastName = lastName;
      user.username = username;
    }
  });
  return User;
};
