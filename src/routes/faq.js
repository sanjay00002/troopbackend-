import { Router } from 'express';
import validate from '../middleware/auth';
import FaqController from '../controllers/FaqController';

const router = Router();

router.route('/').get(validate, FaqController.getAllFaqs);

router.route('/enter').post(validate, FaqController.createFaq);

router.route('/updateById').patch(validate, FaqController.updateFaqById);

router.route('/enterBulkData').post(validate, FaqController.enterBulkFaqData);

module.exports = router;
