import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PrivateChat extends Model {
    static associate(models) {
      // Define associations here
      PrivateChat.belongsTo(models.User, {
        foreignKey: 'senderID',
        as: 'sender',
      });

      PrivateChat.belongsTo(models.User, {
        foreignKey: 'receiverID',
        as: 'receiver',
      });
    }
  }

  PrivateChat.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senderID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'PrivateChat',
    }
  );

  return PrivateChat;
};
