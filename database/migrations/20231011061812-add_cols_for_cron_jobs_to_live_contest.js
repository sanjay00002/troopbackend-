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
    await queryInterface.removeColumn('LiveContests', 'isLive');
    await queryInterface.addColumn('LiveContests', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
    await queryInterface.addColumn('LiveContests', 'canJoin', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })
    await queryInterface.addColumn('LiveContests', 'contestDate', {
      type: Sequelize.DATE,
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
    await queryInterface.removeColumn('LiveContests', 'isActive');
    await queryInterface.removeColumn('LiveContests', 'canJoin');
    await queryInterface.removeColumn('LiveContests', 'contestDate');
    await queryInterface.addColumn('LiveContests', 'isLive', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    })

  }
};
