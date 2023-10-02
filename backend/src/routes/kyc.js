import { Router } from 'express';
import getcashfreetoken from '../middleware/cashfreeverification';
import KycController from '../controllers/KycController';

const router = Router();

// router.route('/bankverification').get(KycController.bankverification);
router.route('/bankverification').post(getcashfreetoken,KycController.bankverification);

module.exports = router;