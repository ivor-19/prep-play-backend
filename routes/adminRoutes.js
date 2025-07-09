import express from 'express';
import {
  getAllSessions,
} from '../controllers/childSessionController.js';
import { authorize, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected endpoints
router.get('/', verifyToken, authorize('admin'), getAllSessions);

export default router;