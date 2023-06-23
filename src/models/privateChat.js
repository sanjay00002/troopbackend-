// import { Model } from 'sequelize';
// const { v4: uuidv4 } = require('uuid');

// export default (sequelize, DataTypes) => {
//   class PrivateChat extends Model {}
//   PrivateChat.init(
//     {
//       senderID: { type: DataTypes.STRING, allowNull: false},
//       receiverID: { type: DataTypes.STRING, allowNull: false},
//       content: { type: DataTypes.STRING, allowNull: false, defaultValue: " "}
//     },
//     {
//       sequelize,
//       modelName: 'PrivateChat',
//     },
//   );
//   PrivateChat.beforeValidate(async (message) => {
//     if (message.isNewRecord) {
//         const messageId = uuidv4();
//         message.id = messageId;
//     }
//   });
//   return PrivateChat;
// };
// import { Model } from 'sequelize';
// const { v4: uuidv4 } = require('uuid');

// export default (sequelize, DataTypes) => {
//   class PrivateChat extends Model {}
//   PrivateChat.init(
//     {
//       senderID: { type: DataTypes.STRING, allowNull: false},
//       receiverID: { type: DataTypes.STRING, allowNull: false},
//       content: { type: DataTypes.STRING, allowNull: false, defaultValue: " "}
//     },
//     {
//       sequelize,
//       modelName: 'PrivateChat',
//     },
//   );
//   PrivateChat.beforeValidate(async (message) => {
//     if (message.isNewRecord) {
//         const messageId = uuidv4();
//         message.id = messageId;
//     }
//   });
//   return PrivateChat;
// };
