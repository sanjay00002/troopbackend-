import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router.route('/signUp').post(AuthController.signUp);

router.route('/signIn').post(AuthController.signIn);

router.route('/signInPhoneNumber').post(AuthController.signInWithPhoneNumber);

router.route('/refresh').post(AuthController.refreshTokens);

router.route('/generateOtp').post(AuthController.generteOtp);

router.route('/verifyOtp').post(AuthController.verifyOtp);

module.exports = router;
