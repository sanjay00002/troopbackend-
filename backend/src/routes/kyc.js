import { Router } from 'express';
import getcashfreetoken from '../middleware/cashfreeverification';
import KycController from '../controllers/KycController';

const router = Router();

// router.route('/bankverification').get(KycController.bankverification);
router.route('/bankverification').post(getcashfreetoken,KycController.bankverification);
router.route('/upiverification').post(getcashfreetoken,KycController.upiverification);
router.route('/otpaadharverification').post(getcashfreetoken,KycController.otpaadharverification);
router.route('/aadharverification').post(getcashfreetoken,KycController.aadharverification);


module.exports = router;