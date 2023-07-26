import { Router } from 'express';
import validate from '../middleware/auth';
import ContestController from '../controllers/ContestController';
import ContestCategoriesController from '../controllers/ContestCategoriesController';

const router = Router();

router.route('/create').post(validate, ContestController.createContest);

router.route('/contestById').post(validate, ContestController.getContestById);

router
  .route('/categories')
  .get(validate, ContestCategoriesController.getContestCategories);

router
  .route('/contestsByCategory')
  .post(validate, ContestController.getContestsByCategory);

router
  .route('/contestsBySubCategory')
  .post(validate, ContestController.getContestsBySubCategory);

router.route('/join').post(validate, ContestController.joinContestById);

router
  .route('/joinedContests')
  .post(validate, ContestController.fetchJoinedContest);

router
  .route('/joinedContestsByStatus')
  .post(validate, ContestController.fetchJoinedContestByStatus);

router.route('/stockStats').post(validate, ContestController.getStockStats);

router
  .route('/getPriceDistribution')
  .post(validate, ContestController.privateContestPriceDistribution);

router
  .route('/getPrivateContests')
  .post(validate, ContestController.getPrivateContests);

module.exports = router;
