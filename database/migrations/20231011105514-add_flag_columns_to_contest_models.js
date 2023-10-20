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

    await queryInterface.addColumn('Contests', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
    await queryInterface.addColumn('Contests', 'canJoin', {
      type: Sequelize.BOOLEAN,
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
    await queryInterface.removeColumn('Contests', 'isActive');
    await queryInterface.removeColumn('Contests', 'canJoin');
  }
};
