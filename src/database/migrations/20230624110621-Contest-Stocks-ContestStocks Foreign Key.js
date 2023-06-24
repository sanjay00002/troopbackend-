/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */

  await queryInterface.addConstraint('ContestStocks', {
    fields: ['contestId'],
    type: 'foreign key',
    name: 'contest_conteststocks_fk_constraint',
    references: {
      table: 'Contests',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('ContestStocks', {
    fields: ['stockId'],
    type: 'foreign key',
    name: 'stocks_conteststocks_fk_constraint',
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
    'ContestStocks',
    'contest_conteststocks_fk_constraint',
  );
  await queryInterface.removeConstraint(
    'ContestStocks',
    'stocks_conteststocks_fk_constraint',
  );
}
