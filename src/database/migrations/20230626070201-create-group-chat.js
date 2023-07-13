/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('GroupChats', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdBy: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING(512),
      allowNull: true,
    },
    participants: {
      type: Sequelize.ARRAY(Sequelize.STRING),
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
  await queryInterface.dropTable('GroupChats');
}
