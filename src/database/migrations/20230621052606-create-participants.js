/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Participants', {
    id: {
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      type: Sequelize.UUID,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contestId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    points: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    selectedStocks: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
    rank: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    joinedAt: {
      allowNull: false,
      type: Sequelize.DATE,
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
  await queryInterface.dropTable('Participants');
}
