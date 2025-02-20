import express from 'express';
import { login, logout, signup,updateProfile,checkAuth } from '../controllers/authController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login',login);

router.post('/logout', logout)

router.put('/update-profile',protectRoute, updateProfile);//this is the middleware that will check if the user is logged in or not

router.get("/check",protectRoute,checkAuth);


export default router;