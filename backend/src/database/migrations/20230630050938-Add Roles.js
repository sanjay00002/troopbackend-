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
  await queryInterface.bulkInsert('Roles', [
    {
      role: 'admin',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      role: 'user',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      role: 'guest',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      role: 'bot',
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
    'Roles',
    {
      role: { [Op.in]: ['admin', 'user', 'guest', 'bot'] },
    },
    {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    },
  );
}
