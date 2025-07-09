import express from 'express';
import { getAllLatestIVData, getLatestIVData, getPatientIVHistory, receiveSensorData } from '../controllers/ivDataController.js';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/receive', receiveSensorData);
router.get('/patient/:id', authenticate, getPatientIVHistory);
router.get('/patient/:id/latest', authenticate, getLatestIVData);
router.get('/latest-all', authenticate, isAdmin, getAllLatestIVData);

export default router;