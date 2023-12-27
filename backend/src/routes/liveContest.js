import { Router } from 'express';
import validate from '../middleware/auth';
import LiveContestController from '../controllers/LiveContestController';

const router = Router();

router.route('/create').post(validate, LiveContestController.createLiveContest);

router.route('/contestById').post(LiveContestController.getLiveContestById);

router.route('/getContests').get(LiveContestController.getLiveContests);

// router
// 	.route('/getHistory')
// 	.get(validate, LiveContestController.getLiveContestHistoryById);

// router.route('/joinLiveContest').post(validate, LiveContestController.joinLiveContest)


module.exports = router;

