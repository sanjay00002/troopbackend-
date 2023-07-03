import { Router } from 'express';
import validate from '../middleware/auth';
import StockController from '../controllers/StockController';

const router = Router();

router.route('/enter').post(validate, StockController.enterStockData);

module.exports = router;
