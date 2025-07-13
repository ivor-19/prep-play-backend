import express from 'express';
import { authorize, verifyToken } from '../middleware/authMiddleware.js';
import { createSession, deleteSession, getAllSessions, getSessionsBySocialWorker, getSpecificSessionInfo, updateSession } from '../controllers/sessionContoller.js';

const router = express.Router();

// Public endpoints
router.post('/create', createSession);

// Protected endpoints
router.get('/:social_worker_id/list', getSessionsBySocialWorker);
router.get('/all', getAllSessions);
router.get('/:session_id/details', getSpecificSessionInfo);
router.put('/update/:session_id', updateSession);
router.delete('/delete/:session_id', deleteSession);
// router.get('/all', verifyToken, authorize('admin'), getAllSessions);

export default router;