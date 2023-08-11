import { Router } from 'express';
import validate from '../middleware/auth';
import BankDetailController from '../controllers/BankDetailController';


const router = Router();

router.route('/').post(validate, BankDetailController.addBankDetail);

router.route('/getDetailbyId').post(validate, BankDetailController.getBankDetailById);

router.route('/').patch(validate, BankDetailController.updateBankDetail)

module.exports = router;
