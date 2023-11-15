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
    await queryInterface.addColumn('Stocks', 'zerodhaInstrumentToken', {
      type: Sequelize.STRING,
      allowNull: true, // You can change this based on your requirements
    });
    await queryInterface.addColumn('Stocks', 'zerodhaInstrumentType', {
      type: Sequelize.STRING,
      allowNull: true, // You can change this based on your requirements
    });
    await queryInterface.addColumn('Stocks', 'exchange', {
      type: Sequelize.STRING,
      allowNull: true, // You can change this based on your requirements
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Stocks', 'zerodhaInstrumentToken');
    await queryInterface.removeColumn('Stocks', 'zerodhaInstrumentType');
    await queryInterface.removeColumn('Stocks', 'exchange');
  }
};
