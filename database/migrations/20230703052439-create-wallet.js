/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Wallets', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    cashAmount: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    winAmount: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    bonusAmount: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    userId: {
      type: Sequelize.STRING,
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
  await queryInterface.dropTable('Wallets');
}
