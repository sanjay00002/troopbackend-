import moment from 'moment';
import { Op } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.bulkInsert('CrateCategories', [
    {
      name: 'Platinum',
      cooldownTime: '2 hours',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Gold',
      cooldownTime: '6 hours',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Bronze',
      cooldownTime: '24 hours',
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
    'CrateCategories',
    {
      name: {
        [Op.in]: ['Platinum', 'Gold', 'Bronze'],
      },
    },
    {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    },
  );
}
