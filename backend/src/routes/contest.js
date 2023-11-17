import { Router } from 'express';
import validate from '../middleware/auth';
import ContestController from '../controllers/ContestController';
import ContestCategoriesController from '../controllers/ContestCategoriesController';

const router = Router();

router.route('/create').post(validate, ContestController.createContest);

router.route('/contestById').post(ContestController.getContestById);

router
  .route('/categories')
  .get(ContestCategoriesController.getContestCategories);

router
  .route('/contestsByCategory')
  .post(ContestController.getContestsByCategory);

router
  .route('/contestsBySubCategory')
  .post(ContestController.getContestsBySubCategory);

router.route('/join').post(validate, ContestController.joinContestById);

router.route('/joinbots').post(ContestController.joinBots);

router
  .route('/joinedContests')
  .post(validate, ContestController.fetchJoinedContest);

router
  .route('/joinedContestsByStatus')
  .post(validate, ContestController.fetchJoinedContestByStatus);

router.route('/stockStats').post(ContestController.getStockStats);
router.route('/stockStatsPercentage/:subCategory').get(ContestController.StockChangePercentage);

router
  .route('/getWinnerbyContestId')
  .post(ContestController.getWinnerbyContestId);

router
  .route('/private/getPriceDistribution')
  .post(validate, ContestController.privateContestPriceDistribution);

router
  .route('/private/getContests')
  .post(validate, ContestController.getPrivateContests);

router
  .route('/private/update')
  .patch(validate, ContestController.updatePrivateContestDetails);

module.exports = router;
