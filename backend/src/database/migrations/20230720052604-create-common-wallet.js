/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('CommonWallets', {
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
    purpose: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
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
  await queryInterface.dropTable('CommonWallets');
}
