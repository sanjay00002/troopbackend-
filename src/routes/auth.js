import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router.route('/create').post(AuthController.signUp);

router.route('/signIn').post(AuthController.signIn);

router.route('/refresh').post(AuthController.refreshToken);

module.exports = router;
