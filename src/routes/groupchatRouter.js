import { Router } from 'express';
import validate from '../middleware/auth';
import groupChatController from '../controllers/groupChatController.js';

const router = Router();

router.route('/create').post(validate, groupChatController.createGroup);

router.route('/addMembers').patch(validate, groupChatController.addMembers);

router.route('/deleteMember').delete(validate, groupChatController.deleteMember);

// router.route('delete').post(validate, groupChatController.deleteGroup);

module.exports = router;
