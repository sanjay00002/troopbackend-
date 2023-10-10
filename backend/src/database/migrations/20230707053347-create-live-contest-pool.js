/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('LiveContestUserPool', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    contestId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    socketId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    stockId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    stockValue: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    matched: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   */
  await queryInterface.dropTable('LiveContestUserPool');
}
