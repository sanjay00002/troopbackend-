import model from '../models';

const { PrivateChat } = model;

async function getAllMessages(roomID){
    try {
        const messages = await PrivateChat.findAll({
            where: { roomID },
          });
        if (messages.length > 0) {
          return messages;
        } else {
          return [];
        }
      } catch (error) {
        return error;
      }
}

export default getAllMessages;