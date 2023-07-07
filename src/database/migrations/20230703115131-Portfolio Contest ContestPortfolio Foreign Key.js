/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('ContestPortfolios', {
    fields: ['contestId'],
    type: 'foreign key',
    name: 'contest_contestportfolios_fk_constraint',
    references: {
      table: 'Contests',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('ContestPortfolios', {
    fields: ['portfolioId'],
    type: 'foreign key',
    name: 'portfolio_contestportfolios_fk_constraint',
    references: {
      table: 'Portfolios',
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
    'ContestPortfolios',
    'contest_contestportfolios_fk_constraint',
  );
  await queryInterface.removeConstraint(
    'ContestPortfolios',
    'portfolio_contestportfolios_fk_constraint',
  );
}
