import { Router } from 'express';
import UserController from '../controllers/UserController';
import validate from '../middleware/auth';

const router = Router();

router.route('/').post(validate, UserController.getUserById);

router.route('/').patch(validate, UserController.updateCurrentUser);

module.exports = router;
