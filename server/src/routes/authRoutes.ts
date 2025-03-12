import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { auth } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);

export default router; 