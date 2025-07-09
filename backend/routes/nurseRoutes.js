import express from 'express';
import { authenticate, isNurse } from '../middleware/authMiddleware.js';
import { addExistingPatientIVBottle, addNewPatient, dischargePatient, getAvailableSenore, getLiveDataForNurse, getMyPatients, getPatientHistory} from '../controllers/nurseController.js';
import { getAvailableBedsByRoom, getAvailableRoomsForNurse } from '../controllers/adminController.js';

const router = express.Router();

// router.post('/add-patient', authenticate, isNurse, addPatient);
router.post('/add-patient', authenticate, isNurse, addNewPatient);
router.post('/add-Existing-patient', authenticate, isNurse, addExistingPatientIVBottle);
router.get('/my-patients', authenticate, isNurse, getMyPatients);
router.get('/my-patients/:id', authenticate, isNurse, getPatientHistory);
router.get('/live-data', authenticate, isNurse, getLiveDataForNurse);
// router.put('/patients/unassign-sensor/:id', authenticate, isNurse, unassignSensor);
// router.post("/assign-iv/:patientId", authenticate, isNurse, assignBottleToPatient);
router.patch("/discharge/:id", authenticate, isNurse, dischargePatient);
router.get('/available-rooms', authenticate, isNurse, getAvailableRoomsForNurse);
router.get('/available-beds/:roomNumber', authenticate, isNurse, getAvailableBedsByRoom);
router.get('/available-sensors', authenticate, isNurse, getAvailableSenore);
export default router;