/** @type {import('sequelize-cli').Migration} */

import moment from 'moment';
import { Op } from 'sequelize';

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
      startTime: moment().set({ hour: 9, minute: 15, second: 0 }).format('LTS'),
      endTime: moment().set({ hour: 15, minute: 30, second: 0 }).format('LTS'),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Special',
      startTime: moment().set({ hour: 9, minute: 15, second: 0 }).format('LTS'),
      endTime: moment().set({ hour: 15, minute: 30, second: 0 }).format('LTS'),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Sectoral',
      startTime: moment().set({ hour: 9, minute: 15, second: 0 }).format('LTS'),
      endTime: moment().set({ hour: 15, minute: 30, second: 0 }).format('LTS'),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Private',
      startTime: moment().set({ hour: 9, minute: 15, second: 0 }).format('LTS'),
      endTime: moment().set({ hour: 15, minute: 30, second: 0 }).format('LTS'),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Practice',
      startTime: moment().set({ hour: 9, minute: 15, second: 0 }).format('LTS'),
      endTime: moment().set({ hour: 15, minute: 30, second: 0 }).format('LTS'),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    },
    {
      name: 'Head2Head',
      startTime: moment().set({ hour: 9, minute: 30, second: 0 }).format('LTS'),
      endTime: moment().set({ hour: 14, minute: 55, second: 0 }).format('LTS'),
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
    'ContestCategories',
    {
      name: {
        [Op.in]: [
          'Mega',
          'Special',
          'Sectoral',
          'Head2Head',
          'Private',
          'Practice',
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
