import { Router } from 'express';
import validate from '../middleware/auth';
import WalletController from '../controllers/WalletController';


const router = Router();

router.route('/update').get(WalletController.updateWallet);

router.route('/contestPayment').post(validate, WalletController.payForContest);

module.exports = router;
