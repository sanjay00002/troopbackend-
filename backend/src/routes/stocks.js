import { Router } from 'express';
import validate from '../middleware/auth';
import StockController from '../controllers/StockController';
import CronJobController from '../controllers/CronJobController';

const router = Router();

router.route('/enter').post(validate, StockController.enterStockData);

router.route('/enterBulk').post(validate, StockController.enterBulkStockData);

router.route('/getZerodhaInstruments').get(StockController.getZerodhaStockInstruments)
router.route('/updateStockPrices').post(CronJobController.updateStockPrices)

module.exports = router;
