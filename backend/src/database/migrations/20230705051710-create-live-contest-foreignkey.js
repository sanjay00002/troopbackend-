/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('LiveContests', {
    fields: ['stock1Id'],
    type: 'foreign key',
    name: 'stock1_livecontest_fk_constraint',
    references: {
      table: 'Stocks',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('LiveContests', {
    fields: ['stock2Id'],
    type: 'foreign key',
    name: 'stock2_livecontest_fk_constraint',
    references: {
      table: 'Stocks',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('LiveContests', {
    fields: ['createdBy'],
    type: 'foreign key',
    name: 'user_livecontest_fk_constraint',
    references: {
      table: 'Users',
      field: 'id',
    },
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.removeConstraint(
    'LiveContests',
    'stock1_livecontest_fk_constraint',
  );

  await queryInterface.removeConstraint(
    'LiveContests',
    'stock2_livecontest_fk_constraint',
  );

  await queryInterface.removeConstraint(
    'LiveContests',
    'user_livecontest_fk_constraint',
  );
}
