'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address!',
        },
      },
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    gender: {
      type: Sequelize.ENUM(['Male', 'Female', 'Other']),
      allowNull: true,
    },
    dob: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    isBot: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    profileImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    referralCode: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    referrer: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    referredAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    accessToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    refreshToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    loggedInAt: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Users');
}
