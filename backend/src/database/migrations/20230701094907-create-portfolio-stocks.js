/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('PortfolioStocks', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    portfolioId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    stockId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    action: {
      type: Sequelize.ENUM(['Buy', 'Sell', 'No Trade']),
      allowNull: false,
    },
    captain: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    viceCaptain: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('PortfolioStocks');
}
