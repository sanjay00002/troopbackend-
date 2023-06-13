import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';

const router = Router();

router.route('/create').post(AuthController.signUp);

router.route('/').post(UserController.getUserDetails);

module.exports = router;
