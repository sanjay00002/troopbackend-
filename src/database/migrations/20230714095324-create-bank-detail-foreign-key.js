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
    await queryInterface.addConstraint('BankDetails',{
      fields : ['userId'],
      type: 'foreign key',
      name: 'user_bankDetail_fk_constraint',
      references: {
        table: 'Users',
        field: 'id',
      }
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
      'BankDetails',
      'user_bankDetail_fk_constraint'
    )
  }
};
