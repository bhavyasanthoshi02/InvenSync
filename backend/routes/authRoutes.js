import express from 'express';
import { authUser, registerUser, updateUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.put('/profile', protect, updateUserProfile);

export default router;
