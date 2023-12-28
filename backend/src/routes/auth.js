import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router.route('/checkUniqueness').post(AuthController.checkUniqueness)

router.route('/signUp').post(AuthController.signUp);

router.route('/guestSignUp').post(AuthController.guestSignUp);

router.route('/signIn').post(AuthController.signIn);

router.route('/signInPhoneNumber').post(AuthController.signInWithPhoneNumber);

router.route('/refresh').post(AuthController.refreshTokens);

router.route('/otp/mobile').post(AuthController.generateMobileOtp);

router.route('/otp/email').post(AuthController.generateEmailOtp);

router.route('/otp/verify').post(AuthController.verifyOtp);

module.exports = router;
