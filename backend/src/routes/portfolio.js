import { Router } from 'express';
import validate from '../middleware/auth';
import PortfolioController from '../controllers/PortfolioController';

const router = Router();

router
  .route('/getBySubCategory')
  .post(validate, PortfolioController.fetchPortfoliosBySubCategory);

router.route('/').put(validate, PortfolioController.updatePortfolioById);
router.route('/PortfolioStockPercentage/:portfolioId').get(PortfolioController.PortfolioStockPercentage);
router.route('/myTroops/:portfolioId/:subCategory').get(PortfolioController.myTroops);

module.exports = router;
