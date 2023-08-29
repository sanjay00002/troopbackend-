import multiavatar from '@multiavatar/multiavatar';
import { random } from 'nanoid/async';

export default {
  getAvatar: async (req, res) => {
    const generateAvatarNumber = 20;
    const avatars = [];
    for (let i = 0; i < generateAvatarNumber; i++) {
      const avatar = multiavatar(i.toString());
      avatars.push({
        id: Math.floor(Math.random() * 101),
        avatar: avatar,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Avatar generated successfully',
      data: avatars,
    });
  },
};
