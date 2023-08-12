/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable('MatchedLiveUsers', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    selfId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    opponentId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    selfSelectedStockId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    selfStockOpenValue: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    selfStockCloseValue: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    opponnetSelectedStockId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    opponentStockOpenValue: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    opponentStockCloseValue: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    contestId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    winner: {
      type: Sequelize.ENUM(['Self', 'Opponent']),
    },
    createdAt: {
      allowNull: true,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: true,
      type: Sequelize.DATE,
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
  await queryInterface.dropTable('MatchedLiveUsers');
}
