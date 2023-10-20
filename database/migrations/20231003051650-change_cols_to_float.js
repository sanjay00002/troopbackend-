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

    await queryInterface.changeColumn('LiveContestUserPool', 'stockValue', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
    await queryInterface.changeColumn('MatchedLiveUsers', 'selfStockOpenValue', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
    await queryInterface.changeColumn('MatchedLiveUsers', 'selfStockCloseValue', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
    await queryInterface.changeColumn('MatchedLiveUsers', 'opponentStockOpenValue', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
    await queryInterface.changeColumn('MatchedLiveUsers', 'opponentStockCloseValue', {
      type: Sequelize.FLOAT,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.changeColumn('LiveContestUserPool', 'stockValue', {
      type: Sequelize.INT,
      allowNull: true
    })
    await queryInterface.changeColumn('MatchedLiveUsers', 'selfStockOpenValue', {
      type: Sequelize.INT,
      allowNull: true
    })
    await queryInterface.changeColumn('MatchedLiveUsers', 'selfStockCloseValue', {
      type: Sequelize.INT,
      allowNull: true
    })
    await queryInterface.changeColumn('MatchedLiveUsers', 'opponentStockOpenValue', {
      type: Sequelize.INT,
      allowNull: true
    })
    await queryInterface.changeColumn('MatchedLiveUsers', 'opponentStockCloseValue', {
      type: Sequelize.INT,
      allowNull: true
    })
  }
};
