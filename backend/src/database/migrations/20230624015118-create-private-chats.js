/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('PrivateChats', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    senderID: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    receiverID: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    roomID: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('PrivateChats');
}
