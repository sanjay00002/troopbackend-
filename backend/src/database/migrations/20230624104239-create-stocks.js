/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Stocks', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    exchangeType: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    open_price: {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    close_price: {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: Sequelize.ENUM(['active', 'inactive']),
      defaultValue: 'active',
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
  await queryInterface.dropTable('Stocks');
}
