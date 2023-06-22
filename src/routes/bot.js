import { Router } from 'express';
import validate from '../middleware/auth';
import BotController from '../controllers/BotController';

const router = Router();

router.route('/create').post(BotController.createBot);

module.exports = router;
