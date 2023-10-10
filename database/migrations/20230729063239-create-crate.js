/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Crates', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    crateCategoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    expiryTime: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    opened: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  await queryInterface.dropTable('Crates');
}
