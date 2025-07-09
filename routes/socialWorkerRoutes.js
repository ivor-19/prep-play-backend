import express from 'express';
import {
  createSession,
  getAllSessions,
  getSessionsBySocialWorker,
} from '../controllers/childSessionController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public endpoints
router.post('/', createSession);

// Protected endpoints
router.get('/:id', verifyToken, getSessionsBySocialWorker);

export default router;