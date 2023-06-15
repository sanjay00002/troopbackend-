import { Router } from 'express';
import validate from '../middleware/auth';
import ContestController from '../controllers/ContestController';

const router = Router();

router.route('/create').post(validate, ContestController.createContest);

module.exports = router;
