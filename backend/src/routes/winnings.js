import { Router } from 'express';
import validate from '../middleware/auth';
import WinningsController from '../controllers/WinningsController';

const router = Router();

router
  .route('/crateCategory')
  .get(validate, WinningsController.getWinningsByCrateCategory);

module.exports = router;
