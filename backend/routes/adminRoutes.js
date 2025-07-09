import express from 'express';
import { authenticate, isAdmin } from '../middleware/authMiddleware.js';
import { addsensor, deleteSensor, getAdminDashboardData, getAllPatientHistories, getAllSensors, getNurses, getPatientById, getPatients } from '../controllers/adminController.js';

const router = express.Router();

router.post('/add-sensor', authenticate, isAdmin, addsensor);
router.get('/nurses', authenticate, isAdmin , getNurses);
router.get('/patients', authenticate, isAdmin , getPatients);
router.get('/patients/:id', authenticate, isAdmin, getPatientById);
router.get('/allsensor', authenticate, isAdmin, getAllSensors);
router.delete('/delete-sensor/:id', authenticate, isAdmin, deleteSensor);
router.get('/patient-history', authenticate, isAdmin, getAllPatientHistories);
router.get('/dashboard-stats', authenticate, isAdmin, getAdminDashboardData);

export default router;