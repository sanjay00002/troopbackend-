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
    await queryInterface.addConstraint('ContestWinners', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'user_contestwinners_fk_constraint',
      references: {
        table: 'Users',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('ContestWinners', {
      fields: ['contestId'],
      type: 'foreign key',
      name: 'contest_contestwinners_fk_constraint',
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
      'user_contestwinners_fk_constraint',
    );
    await queryInterface.removeConstraint(
      'ContestWinners',
      'contest_contestwinners_fk_constraint',
    );
  },
};
