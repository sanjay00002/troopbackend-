const { Model } = require('sequelize');
import { nanoid } from 'nanoid/async';

import { v4 as uuidv4 } from 'uuid';

export default (sequelize, DataTypes) => {
  class GroupChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(GroupChat,{
        foreignKey: 'createdBy',
        sourceKey: 'id',
      });

      GroupChat.belongsTo(models.User, {
        foreignKey: 'createdBy',
        targetKey: 'id',
        constraints: true,
        keyType: DataTypes.STRING,
        uniqueKey: 'user_GroupChat_fk_constraint',
      });
    }
  }


  GroupChat.init(
    {
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING(512),
      participants: DataTypes.ARRAY(DataTypes.STRING),
    },
    {
      sequelize,
      modelName: 'GroupChat',
    },
  );


  GroupChat.beforeValidate(async (GroupChat, option) => {
    if (GroupChat.isNewRecord) {
      const id = uuidv4().slice(0,8);
      GroupChat.id = id;
    }
  });
  
  return GroupChat;
};
