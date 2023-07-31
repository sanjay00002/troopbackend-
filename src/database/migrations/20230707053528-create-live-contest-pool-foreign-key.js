/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('LiveContestUserPool', {
    fields: ['user_id'],
    type: 'foreign key',
    name: 'user_livecontest_fk_constraint',
    references: {
      table: 'Users',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('LiveContestUserPool', {
    fields: ['contest_id'],
    type: 'foreign key',
    name: 'contest_live_fk_constraint',
    references: {
      table: 'LiveContests',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('LiveContestUserPool', {
    fields: ['stock_id'],
    type: 'foreign key',
    name: 'stock_live_fk_constraint',
    references: {
      table: 'Stocks',
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
    'LiveContestUserPool',
    'user_livecontest_fk_constraint',
  );

  await queryInterface.removeConstraint(
    'LiveContestUserPool',
    'contest_live_fk_constraint',
  );

  await queryInterface.removeConstraint(
    'LiveContestUserPool',
    'stock_live_fk_constraint',
  );
}
