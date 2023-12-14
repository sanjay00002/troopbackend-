import { Model } from "sequelize";
// import("nanoid/async").then((nanoid) => nanoid.nanoid);
import { generateUserId } from "../../lib/generateId";
import randomIndianName from "random-indian-name";
import { faker } from "@faker-js/faker";

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
        type: DataTypes.ENUM(["Male", "Female", "Other"]),
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
      appCoins: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.0},
      winningsAmount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.0},
      bonusCoins: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.0},
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeValidate(async (user, option) => {
    if (user.changed('appCoins') && user.appCoins < 0) {
      throw new Error('appCoins cannot go below 0');
  }
    if (user.isNewRecord) {
      const id = user.dataValues.isBot
        ? `Bot-${await generateUserId()}`
        : `Troop-${await generateUserId()}`;
      user.id = id;

      // if (user?.dataValues?.isBot === false) {
      //   if (!user?.dataValues.firstName && !user?.dataValues.lastName) {
      //     user.username = "Trooper-" + user?.id.split("-")[1];
      //   }

      //   if (
      //     user?.dataValues.firstName &&
      //     user?.dataValues.lastName &&
      //     !user?.dataValues.username === false
      //   ) {
      //     const randomFullName = randomIndianName();
      //     user.firstName = randomFullName.split(" ")[0];
      //     user.lastName = randomFullName.split(" ")[1];
      //     const randomCondition = Math.floor(Math.random() * 3);

      //     switch (randomCondition) {
      //       case 0:
      //         user.username = `${user.firstName}-${user.lastName}`;
      //         break;
      //       case 1:
      //         user.username = `${user.firstName}${Math.floor(
      //           Math.random() * 100
      //         )}`;
      //         break;
      //       case 2:
      //         user.username = `${user.firstName}${user.lastName}${Math.floor(
      //           Math.random() * 100
      //         )}`;
      //         break;
      //       default:
      //         break;
      //     }
      //   }
      // }

      if (user?.dataValues?.isBot === true) {
        const randomFullName = randomIndianName();
        user.firstName = randomFullName.split(" ")[0];
        user.lastName = randomFullName.split(" ")[1];
        const randomCondition = Math.floor(Math.random() * 3);

        switch (randomCondition) {
          case 0:
            user.username = `${user.firstName}-${user.lastName}`;
            break;
          case 1:
            user.username = `${user.firstName}${Math.floor(
              Math.random() * 100
            )}`;
            break;
          case 2:
            user.username = `${user.firstName}${user.lastName}${Math.floor(
              Math.random() * 100
            )}`;
            break;
          default:
            break;
        }
      }
    }
  });

  return User;
};
