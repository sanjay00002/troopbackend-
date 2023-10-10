import { Router } from 'express';
import validate from '../middleware/auth';
import PortfolioController from '../controllers/PortfolioController';

const router = Router();

router
  .route('/getBySubCategory')
  .get(validate, PortfolioController.fetchPortfoliosBySubCategory);

router.route('/').put(validate, PortfolioController.updatePortfolioById);

module.exports = router;
