import { Router } from "express";
import MatchedLiveUsersController from "../controllers/MatchedLiveUsersController";
import validate from "../middleware/auth";

const router = Router()

router.route('/getLiveContestMatches').get(validate, MatchedLiveUsersController.getLiveContestMatches)

module.exports = router