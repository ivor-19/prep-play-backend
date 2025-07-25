import express from 'express';
import { authorize, verifyToken } from '../middleware/authMiddleware.js';
import { createSession, deleteSession, getAllSessions, getSessionsBySocialWorker, getSpecificSessionInfo, updateSession } from '../controllers/sessionContoller.js';

const router = express.Router();

// Protected endpoints
router.get('/all', verifyToken, authorize('admin'), getAllSessions);

router.post('/create', verifyToken, createSession);
router.get('/:social_worker_id/list', verifyToken, getSessionsBySocialWorker);
router.get('/:session_id/details', verifyToken, getSpecificSessionInfo);
router.put('/update/:session_id', verifyToken, updateSession);
router.delete('/delete/:session_id', verifyToken, deleteSession);

export default router;