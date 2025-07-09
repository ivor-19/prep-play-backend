import express from 'express';
import {
  createSession,
  getSessionsBySocialWorker,
} from '../controllers/socialWorkerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoints
router.post('/createSession', createSession);

// Protected endpoints
router.get('/:social_worker_id/childSessions', verifyToken, getSessionsBySocialWorker);

export default router;