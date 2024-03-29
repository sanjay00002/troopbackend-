/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('Portfolios', {
    fields: ['userId'],
    type: 'foreign key',
    name: 'user_portfolio_fk_constraint',
    references: {
      field: 'id',
      table: 'Users',
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
    'Portfolios',
    'user_portfolio_fk_constraint',
  );
}
