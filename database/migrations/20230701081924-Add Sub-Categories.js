import moment from 'moment';
import { Op } from 'sequelize';
/** Nifty 50 -> 'Mega',
        'Nifty IT',
        'Nifty Auto',
        'Nifty Bank',
        'Penny Stocks',
        'Giant Stocks',
        'Mega'
*/
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.bulkInsert('SubCategories', [
    {
      name: 'Mega',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Nifty IT',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Nifty Auto',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Nifty Bank',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Penny Stocks',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Giant Stocks',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
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
  await queryInterface.bulkDelete(
    'SubCategories',
    {
      name: {
        [Op.in]: [
          'Mega',
          'Nifty IT',
          'Nifty Auto',
          'Nifty Bank',
          'Penny Stocks',
          'Giant Stocks',
        ],
      },
    },
    {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    },
  );
}
