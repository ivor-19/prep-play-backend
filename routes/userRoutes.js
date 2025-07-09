import express from 'express';
import { getUsers, createUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/get', verifyToken, getUsers);
router.post('/create', createUser);

export default router;