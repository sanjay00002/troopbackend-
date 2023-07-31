/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('LiveContestUserPool', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    contest_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    socket_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    stock_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    stock_value: {
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
