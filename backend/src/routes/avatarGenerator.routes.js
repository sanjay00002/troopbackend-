import { Router } from 'express';
import AvatarGeneratorController from '../controllers/AvatarGenerator';

const router = Router();

router.route('/getAvatar').get(AvatarGeneratorController.getAvatar);

export default router;
