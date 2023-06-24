'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint('ContestPriceDistributions', {
      fields: ['contestId'],
      type: 'foreign key',
      name: 'contest_contestpricedistribution_fk_constraint',
      references: {
        table: 'Contests',
        field: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint(
      'ContestWinners',
      'contest_contestpricedistribution_fk_constraint',
    );
  },
};
