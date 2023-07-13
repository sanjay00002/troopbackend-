const { Model } = require('sequelize');
import { v4 as uuidv4 } from 'uuid';

export default (sequelize, DataTypes) => {
  class GroupChatMessage extends Model {
    static associate(models) {
      // Define associations here
    //   GroupChatMessage.belongsTo(models.GroupChat, {
    //     foreignKey: 'roomId',
    //     as: 'groupId',
    //   });
    }
  }

  GroupChatMessage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'GroupChatMessage',
    }
  );

  GroupChatMessage.beforeValidate(async (GroupChatMessage, options) => {
    if (GroupChatMessage.isNewRecord) {
      const id = uuidv4().slice(0, 8);
      GroupChatMessage.id = id;
    }
  });

  return GroupChatMessage;
};
