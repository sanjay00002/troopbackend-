import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class PrivateChat extends Model {
    static associate(models) {
      // Define associations here
      models.User.hasOne(PrivateChat, {
        foreignKey: 'senderID',
        sourceKey: 'id',
      });

      PrivateChat.belongsTo(models.User, {
        foreignKey: 'senderID',
        targetKey: 'id',
        as: 'sender',
      });

      models.User.hasOne(PrivateChat, {
        foreignKey: 'receiverID',
        sourceKey: 'id',
      });

      PrivateChat.belongsTo(models.User, {
        foreignKey: 'receiverID',
        targetKey: 'id',
        as: 'receiver',
      });
    }
  }

  PrivateChat.init(
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
      },
    },
    {
      sequelize,
      modelName: 'PrivateChat',
    },
  );

  return PrivateChat;
};
