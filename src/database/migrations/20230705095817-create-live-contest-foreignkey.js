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
    await queryInterface.addConstraint('LiveContests',{
      fields: ['stock1Id'],
      type: 'foreign key',
      name: 'livecontest_stock1_fk_constraint',
      references: {
        table: 'Stocks',
        field: 'id',
      },
    })

    await queryInterface.addConstraint('LiveContests',{
      fields: ['stock2Id'],
      type: 'foreign key',
      name: 'livecontest_stock2_fk_constraint',
      references: {
        table: 'Stocks',
        field: 'id',
      },
    })

    await queryInterface.addConstraint('LiveContests',{
      fields: ['createdBy'],
      type: 'foreign key',
      name: 'livecontest_user_fk_constraint',
      references: {
        table: 'Users',
        field: 'id',
      },
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint(
      'LiveContests',
      'livecontest_stock1_fk_constraint',
    );

    await queryInterface.removeConstraint(
      'LiveContests',
      'livecontest_stock2_fk_constraint',
    )

    await queryInterface.removeConstraint(
      'LiveContests',
      'livecontest_user_fk_constraint',
    )
  }
};
