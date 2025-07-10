import express from 'express';
import { authorize, verifyToken } from '../middleware/authMiddleware.js';
import { createSession, getAllSessions, getSessionsBySocialWorker } from '../controllers/sessionContoller.js';

const router = express.Router();

// Public endpoints
router.post('/create', createSession);

// Protected endpoints
router.get('/:social_worker_id/list', getSessionsBySocialWorker);
router.get('/all', getAllSessions);
// router.get('/all', verifyToken, authorize('admin'), getAllSessions);

export default router;