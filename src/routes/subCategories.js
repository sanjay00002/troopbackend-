import { Router } from 'express';
import validate from '../middleware/auth';
import SubCategories from '../controllers/SubCategoriesController';

const router = Router();

router.route('/').get(validate, SubCategories.getContestSubCategories);

module.exports = router;
