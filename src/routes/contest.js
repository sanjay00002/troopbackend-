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
  .route('/contestByCategory')
  .post(validate, ContestController.getContestsByCategory);

router
  .route('/contestBySubCategory')
  .post(validate, ContestController.getContestsBySubCategory);

router.route('/join').post(validate, ContestController.joinContestById);

router
  .route('/joinedContests')
  .post(validate, ContestController.fetchJoinedContest);

module.exports = router;
