'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Users', 'winningsAmount', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0, // You can change this based on your requirements
    });
    await queryInterface.addColumn('Users', 'bonusCoins', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0, // You can change this based on your requirements
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Users', 'winningsAmount');
    await queryInterface.removeColumn('Users', 'bonusCoins');
  }
};
