export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('GroupChatMessages', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    senderId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roomId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });

  // Add foreign key constraint
  await queryInterface.addConstraint('GroupChatMessages', {
    fields: ['roomId'],
    type: 'foreign key',
    name: 'fk_groupChatMessages_roomId',
    references: {
      table: 'GroupChats',
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
}
export async function down(queryInterface, Sequelize) {
  // Remove foreign key constraint
  await queryInterface.removeConstraint(
    'GroupChatMessages',
    'fk_groupChatMessages_roomId',
  );

  await queryInterface.dropTable('GroupChatMessages');
}
