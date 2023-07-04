/** @type {import('sequelize-cli').Migration} */

import moment from 'moment';

/**
 * [
      'Special',
      'Sectoral',
      'Practice',
      'Head2Head',
      'Private',
      'Mega',
    ]
 */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.bulkInsert('ContestCategories', [
    {
      name: 'Mega',
      startTime: moment().set({ hour: 9, minute: 15 }),
      endTime: moment,
    },
  ]);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
}
