import { Router } from 'express';
import validate from '../middleware/auth';
import CrateController from '../controllers/CrateController';

const router = Router();

router.route('/').get(validate, CrateController.getCratesByUserId);

module.exports = router;
