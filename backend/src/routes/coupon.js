import { Router } from 'express';
import validate from '../middleware/auth';
import CouponController from '../controllers/CouponController';

const router = Router();

router.route('/giveCoupon/:id').get(CouponController.AssignCoupon);
router.route('/redeemCoupon/:id/:couponId').get(CouponController.redeemCoupon);

module.exports = router;
