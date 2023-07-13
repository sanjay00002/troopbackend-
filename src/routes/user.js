import { Router } from 'express';
import UserController from '../controllers/UserController';
import validate from '../middleware/auth';

const router = Router();

router.route('/').post(validate, UserController.getUserById);

router.route('/').patch(validate, UserController.updateUserById);

router.route('/all').get(validate, UserController.getAllUsers);

module.exports = router;
