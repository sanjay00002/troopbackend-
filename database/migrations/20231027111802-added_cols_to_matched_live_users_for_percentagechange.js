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
    await queryInterface.addColumn('MatchedLiveUsers', 'selfUserName', {
      type: Sequelize.STRING,
      allowNull: true, // You can change this based on your requirements
    });
    await queryInterface.addColumn('MatchedLiveUsers', 'opponentUserName', {
      type: Sequelize.STRING,
      allowNull: true, // You can change this based on your requirements
    });
    await queryInterface.addColumn('MatchedLiveUsers', 'selfSelectedStockToken', {
      type: Sequelize.INTEGER,
      allowNull: true, // You can change this based on your requirements
    });
    await queryInterface.addColumn('MatchedLiveUsers', 'opponentSelectedStockToken', {
      type: Sequelize.INTEGER,
      allowNull: true, // You can change this based on your requirements
    });
    await queryInterface.addColumn('MatchedLiveUsers', 'selfStockPercentageChange', {
      type: Sequelize.FLOAT,
      allowNull: true, // You can change this based on your requirements
    });
    await queryInterface.addColumn('MatchedLiveUsers', 'opponentStockPercentageChange', {
      type: Sequelize.FLOAT,
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
    await queryInterface.removeColumn('MatchedLiveUsers', 'selfUserName');
    await queryInterface.removeColumn('MatchedLiveUsers', 'opponentUserName');
    await queryInterface.removeColumn('MatchedLiveUsers', 'selfSelectedStockToken');
    await queryInterface.removeColumn('MatchedLiveUsers', 'opponentSelectedStockToken');
    await queryInterface.removeColumn('MatchedLiveUsers', 'selfStockPercentageChange');
    await queryInterface.removeColumn('MatchedLiveUsers', 'opponentStockPercentageChange');
    
  }
};
