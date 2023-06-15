'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Contests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      category: {
        type: Sequelize.ENUM([
          'Special',
          'Sectoral',
          'Practice',
          'Head2Head',
          'Custom',
        ]),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING(512),
        allowNull: true,
      },
      pricePool: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      slots: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endtime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      participants: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },
      winners: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      prizeDistribution: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: false,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Contests');
  },
};
