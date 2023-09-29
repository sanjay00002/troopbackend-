import { Router } from 'express';
import LiveContestUserPoolController from '../controllers/LiveContestUserPoolController';
import validate from '../middleware/auth';

const router = Router();

router.route('/addBot').post(validate, LiveContestUserPoolController.addBot);

module.exports = router;
