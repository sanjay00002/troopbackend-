'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  return Promise.all([
    queryInterface.addColumn('Users', 'accessToken', {
      type: Sequelize.STRING,
    }),
    queryInterface.addColumn('Users', 'refreshToken', {
      type: Sequelize.STRING,
    }),
  ]);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  return Promise.all([
    queryInterface.removeColumn('Users', 'accessToken'),
    queryInterface.removeColumn('Users', 'refreshToken'),
  ]);
}
