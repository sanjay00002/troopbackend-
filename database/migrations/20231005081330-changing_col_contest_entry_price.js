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

    await queryInterface.addColumn('LiveContestUserPool', 'contestEntryPrice', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
    await queryInterface.addColumn('MatchedLiveUsers', 'contestEntryPrice', {
      type: Sequelize.INTEGER,
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
    await queryInterface.removeColumn('MatchedLiveUsers', 'contestEntryPrice');
    await queryInterface.removeColumn('LiveContestUserPool', 'contestEntryPrice');

  }
};
