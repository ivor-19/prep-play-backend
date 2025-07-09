import express from 'express';
import {
  getAllSessions,
} from '../controllers/adminController.js';
import { authorize, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected endpoints
router.get('/childSessions/all', verifyToken, authorize('admin'), getAllSessions);

export default router;