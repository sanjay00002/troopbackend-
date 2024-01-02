import { Router } from 'express';
import getcashfreetoken from '../middleware/cashfreeverification';
import KycController from '../controllers/KycController';
import validate from '../middleware/auth';
import panimage from '../middleware/panimage'

const router = Router();

// router.route('/bankverification').get(KycController.bankverification);
router.route('/bankverification').post(validate, getcashfreetoken,KycController.bankverification);
router.route('/upiverification').post(validate, getcashfreetoken,KycController.upiverification);
router.route('/otpaadharverification').post(validate, getcashfreetoken,KycController.otpaadharverification);
router.route('/aadharverification').post(validate, getcashfreetoken,KycController.aadharverification);
router.route('/panverification').post(validate,getcashfreetoken, KycController.panverificationSync);


module.exports = router;