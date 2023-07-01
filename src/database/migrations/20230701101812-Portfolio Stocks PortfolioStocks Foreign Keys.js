/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addConstraint('PortfolioStocks', {
    fields: ['portfolioId'],
    type: 'foreign key',
    name: 'portfolio_portfoliostocks_fk_constraint',
    references: {
      table: 'Portfolios',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('PortfolioStocks', {
    fields: ['stockId'],
    type: 'foreign key',
    name: 'stocks_portfoliostocks_fk_constraint',
    references: {
      table: 'Stocks',
      field: 'id',
    },
  });

  await queryInterface.addConstraint('PortfolioStocks', {
    fields: ['captain', 'viceCaptain'],
    type: 'check',
    name: 'captain_viceCaptain_check_constraint',
    where: {
      [Sequelize.Op.or]: [
        {
          captain: false,
          viceCaptain: false,
        },
        {
          captain: true,
          viceCaptain: false,
        },
        {
          captain: false,
          viceCaptain: true,
        },
      ],
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
    'PortfolioStocks',
    'portfolio_portfoliostocks_fk_constraint',
  );
  await queryInterface.removeConstraint(
    'PortfolioStocks',
    'stocks_portfoliostocks_fk_constraint',
  );
  await queryInterface.removeConstraint(
    'PortfolioStocks',
    'captain_viceCaptain_check_constraint',
  );
}
