/** @type {import('sequelize-cli').Migration} */
// import { Deferrable } from 'sequelize';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Profiles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    profileImage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    referralCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    referrer: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    referredAt: {
      type: Sequelize.DATE,
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
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Profiles');
}
