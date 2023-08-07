import { Router } from 'express';
import validate from '../middleware/auth';
import SubCategories from '../controllers/SubCategoriesController';

const router = Router();

router.route('/').get(SubCategories.getContestSubCategories);

module.exports = router;
