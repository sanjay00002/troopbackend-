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
    await queryInterface.addConstraint('ContestParticipants', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'user_contestparticipants_fk_constraint',
      references: {
        table: 'Users',
        field: 'id',
      },
    });

    await queryInterface.addConstraint('ContestParticipants', {
      fields: ['contestId'],
      type: 'foreign key',
      name: 'contest_contestparticipants_fk_constraint',
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
      'ContestParticipants',
      'user_contestparticipants_fk_constraint',
    );
    await queryInterface.removeConstraint(
      'ContestParticipants',
      'contest_contestparticipants_fk_constraint',
    );
  },
};
