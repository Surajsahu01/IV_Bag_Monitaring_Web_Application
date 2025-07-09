import express from 'express';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';
import { addBedToRoom, createRoom, getAdminDashboardData, getRooms } from '../controllers/adminController.js';

const router = express.Router();


router.post('/create', authenticate, isAdmin, createRoom);
router.post('/add-bed', authenticate, isAdmin, addBedToRoom);
router.get('/dashbord-stats', authenticate, getAdminDashboardData);
router.get('/', authenticate, getRooms);

export default router;