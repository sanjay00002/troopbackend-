import { Router } from 'express';
import validate from '../middleware/auth';
import LiveContestController from '../controllers/LiveContestController';


const router = Router();

router.route('/create').post(validate, LiveContestController.createLiveContest);

router.route('/contestById').post(validate, LiveContestController.getLiveContestById);

router.route('/getContests').get(validate, LiveContestController.getLiveContests)

module.exports = router;
