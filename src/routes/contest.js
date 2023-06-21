import { Router } from 'express';
import validate from '../middleware/auth';
import ContestController from '../controllers/ContestController';

const router = Router();

router.route('/create').post(validate, ContestController.createContest);

router.route('/contestById').post(validate, ContestController.getContestById);

router
  .route('/contestByCategory')
  .post(validate, ContestController.getContestsByCategory);

router.route('/join').post(validate, ContestController.joinContestById);

module.exports = router;
