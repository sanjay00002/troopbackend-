import model from '../models';
import JWTController from './JWTController';

const { User } = model;

export default {
  createBot: async (req, res) => {
    try {
      const bot = await User.create({
        isBot: true,
      });

      const newBotId = await bot.get('id');

      const { accessToken, refreshToken } = await JWTController.createToken(
        { id: newBotId },
        true,
      );

      await bot.update({
        accessToken,
        refreshToken,
      });

      return res.status(201).json({ ...(await bot.get()) });
    } catch (error) {
      console.error('Error while creating bot:', error);
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while creating bot!',
      });
    }
  },
};
