import { generateNBotDetails } from '../lib/bot';
import model from '../../../database/models';
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

  createBots: async (req, res) => {
    const { limit } = req.body;

    try {
      const bots = [];

      for (let i = 0; i < limit; i++) {
        const details = await generateNBotDetails()
          .next()
          .then((value) => value.value);

        console.log('Bot Details: ', details);

        bots.push(details);
      }

      const botsCreated = await User.bulkCreate(bots, {
        validate: true,
        individualHooks: true,
        returning: true,
      });

      console.log('Result of bulkCreate: ', botsCreated);
      const response = botsCreated.map((element) => element.dataValues);

      console.log('Response: ', response);
      return res.status(201).json(response);
    } catch (error) {
      console.error('Error while bulk creating bots:', error);
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while bulk creating bots!',
      });
    }
  },

  createPortfolioForBot: async function (subCategoryId, contestId) {},
};
