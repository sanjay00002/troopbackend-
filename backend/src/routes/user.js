import { Router } from 'express';
import UserController from '../controllers/UserController';
import validate from '../middleware/auth';

const router = Router();

router.route('/').post(validate, UserController.getUserById);

router.route('/').patch(validate, UserController.updateCurrentUser);

router.route('/updateUser').patch(UserController.updateCurrentUserProfile);

router.route('/all').get(validate, UserController.getAllUsers);

// router.route('/deductCoins').post(validate, UserController.deductCoins)

// router.route('/addCoins').post(validate, UserController.addCoins)

module.exports = router;
