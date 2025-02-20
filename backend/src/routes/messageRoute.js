import express from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import { getUsersForSidebar,getUserMessages,sendMessage } from '../controllers/messageController.js';


const router = express.Router();

router.get('/users',protectRoute,getUsersForSidebar);
router.get('/:id',protectRoute,getUserMessages);

router.post("/send",protectRoute,sendMessage);

export default router;