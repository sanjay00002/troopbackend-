/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('ContestPriceDistributions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    contestId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rankStart: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    rankEnd: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    priceAmount: {
      type: Sequelize.INTEGER,
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
  await queryInterface.dropTable('ContestPriceDistributions');
}
